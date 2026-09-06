import { r as __exportAll, s as __toESM } from "../chunks/rolldown-runtime.js";
import { _ as stashSkuHandoff, h as shouldHandoffViewToSibling, v as takeSkuHandoff } from "../chunks/ecosystem-skus.js";
import { C as writeText, I as H, P as defineElement, a as isBase64Like, o as normalizeDataAsset, s as parseDataUrl, u as createContentAddressedStore } from "../vendor/culori.js";
import { h as processApiAuthFromSettings, m as postProcessApi, o as ROUTE_HASHES, p as isProcessApiUnavailable, t as API_ENDPOINTS } from "../chunks/Names.js";
import { n as readProcessApiResultText, t as unwrapSwInteropMessage } from "../chunks/sw-unwrap.js";
import { u as sendMessage } from "../chunks/UnifiedMessaging.js";
import { t as summarizeForLog } from "../vendor/@fest-lib_lure.js";
import "../chunks/UniformInterop2.js";
import { a as replayQueuedMessagesForDestination, n as initializeComponent, r as registerComponent } from "../chunks/UnifiedMessaging2.js";
import { c as isAndroidLocalShareUri, f as registerWorkCenterFlushHost, h as takeHeldIngressFiles, i as flushHeldIngressToWorkCenter, l as onHeldIngressFiles, r as dropHeldIngressFiles, u as peekHeldIngressFiles } from "../chunks/sku-ingress.js";
import { a as loadSettings } from "../chunks/Settings.js";
import "../chunks/Clipboard.js";
import { c as __decorate, o as UIElement } from "./app5.js";
import { _ as validateReadableFileForIngress, d as BROADCAST_CHANNELS, f as viewBroadcastChannelName } from "./service.js";
import "./app9.js";
import { i as renderSafeMarkdown, n as configureMarkdownRendering, s as f } from "../vendor/dompurify.js";
import { r as highlightCodeTree } from "./app11.js";
import { i as buildInstructionPrompt } from "../chunks/utils.js";
import { a as getCustomInstructions, o as getInstructionRegistry, s as setActiveInstruction } from "../chunks/CustomInstructions.js";
import { r as extractJSONFromAIResponse, t as processDataWithInstruction } from "../vendor/@toon-format_toon.js";
import { ensureViewportTracking } from "/fest/dom.js";
import { loadAsAdopted as loadAsAdopted$1, removeAdopted } from "/fest/style-lib.js";
//#region ../../modules/projects/fl.ui/src/ui/inputs/attachments/AttachmentSources.ts
var isUsableUrl = (value) => {
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
};
var appendFile = (target, seen, file, source) => {
	if (!file || seen.has(file)) return;
	seen.add(file);
	target.push({
		kind: "file",
		file,
		source
	});
};
/**
* Collect actual files and URI-list links from a browser transfer payload.
* Text-only data is deliberately ignored so an editable composer keeps native
* paste behavior and cursor selection semantics.
*/
var collectAttachmentCandidates = (data, source) => {
	if (!data) return [];
	const candidates = [];
	const seen = /* @__PURE__ */ new Set();
	for (const item of Array.from(data.items || [])) {
		if (item.kind !== "file") continue;
		appendFile(candidates, seen, item.getAsFile?.() ?? null, source);
	}
	for (const file of Array.from(data.files || [])) appendFile(candidates, seen, file, source);
	const urls = String(data.getData?.("text/uri-list") || "").split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#") && isUsableUrl(line));
	const seenUrls = /* @__PURE__ */ new Set();
	for (const url of urls) {
		if (seenUrls.has(url)) continue;
		seenUrls.add(url);
		candidates.push({
			kind: "url",
			url,
			source
		});
	}
	return candidates;
};
//#endregion
//#region ../../modules/projects/subsystem/src/routing/pwa/sw-cache.ts
var originHint = () => {
	try {
		const origin = globalThis.location?.origin;
		if (origin) return origin;
	} catch {}
	return "https://localhost";
};
var toCacheRequestInfo = (requestLike) => {
	if (!requestLike) return void 0;
	return requestLike instanceof URL ? requestLike.toString() : requestLike;
};
var cacheKeyString = (request) => {
	if (typeof request === "string") return request;
	if (request instanceof Request) return request.url;
	return "";
};
/**
* Cache#match rejects blob:/data:/non-GET. chrome-extension: is valid in MV3.
* Relative paths (`/share-target-data`) resolve against the worker origin.
*/
var isCacheApiKey = (request) => {
	if (request instanceof Request && String(request.method || "GET").toUpperCase() !== "GET") return false;
	const raw = cacheKeyString(request);
	if (!raw) return false;
	try {
		const protocol = new URL(raw, originHint()).protocol;
		return protocol === "http:" || protocol === "https:" || protocol === "chrome-extension:" || protocol === "moz-extension:";
	} catch {
		return raw.startsWith("/");
	}
};
var asMatchKey = (request) => {
	if (typeof request === "string") return request;
	if (typeof Request !== "undefined" && request instanceof Request) return request;
};
var cachesApi = () => {
	try {
		return globalThis.caches || null;
	} catch {
		return null;
	}
};
var safeCacheOpen = async (name) => {
	const store = cachesApi();
	if (!store || typeof store.open !== "function") return null;
	try {
		return await store.open(name);
	} catch {
		return null;
	}
};
var safeCacheMatch = async (cache, requestLike) => {
	const request = toCacheRequestInfo(requestLike);
	if (!cache || !request) return void 0;
	const key = asMatchKey(request);
	if (!key || !isCacheApiKey(key)) return void 0;
	const match = cache.match;
	if (typeof match !== "function") return void 0;
	try {
		return await match.call(cache, key) ?? void 0;
	} catch (error) {
		console.warn("[SW] Cache.match failed:", request, error);
		return;
	}
};
var safeCacheDelete = async (cache, requestLike) => {
	const request = toCacheRequestInfo(requestLike);
	if (!cache || !request || typeof cache.delete !== "function") return false;
	try {
		return await cache.delete(request);
	} catch {
		return false;
	}
};
//#endregion
//#region ../../modules/projects/subsystem/src/routing/channel/ShareTargetGateway.ts
/**
* Helpers for moving share-target payloads between the service worker, Cache
* Storage, and the foreground app.
*
* WHY: share-target launches often happen before the main app is ready. These
* helpers persist the payload in browser-managed caches so the UI can consume
* it later without depending on a live in-memory handoff.
*/
var SHARE_CACHE_NAME = "share-target-data";
var SHARE_CACHE_KEY = "/share-target-data";
var SHARE_FILES_MANIFEST_KEY = "/share-target-files";
/**
* Rehydrate the cached share-target payload and optionally clear the consumed
* cache entries so they are not replayed on the next app load.
*/
var consumeCachedShareTargetPayload = async (opts = {}) => {
	const clear = opts.clear !== false;
	try {
		const cache = await safeCacheOpen(SHARE_CACHE_NAME);
		if (!cache) return null;
		const metaResp = await safeCacheMatch(cache, SHARE_CACHE_KEY);
		const manifestResp = await safeCacheMatch(cache, SHARE_FILES_MANIFEST_KEY);
		if (!metaResp && !manifestResp) return null;
		const meta = metaResp ? await metaResp.json().catch(() => null) : null;
		const manifest = manifestResp ? await manifestResp.json().catch(() => null) : null;
		const fileMeta = Array.isArray(manifest?.files) ? manifest.files : [];
		const files = [];
		for (const fm of fileMeta) {
			const fileKey = typeof fm?.key === "string" ? fm.key.trim() : String(fm?.key ?? "").trim();
			if (!fileKey) continue;
			const response = await safeCacheMatch(cache, fileKey);
			if (!response) continue;
			const blob = await response.blob();
			files.push(new File([blob], fm.name || "shared-file", {
				type: fm.type || blob.type || "application/octet-stream",
				lastModified: Number(fm.lastModified) || Date.now()
			}));
		}
		if (clear) {
			await safeCacheDelete(cache, SHARE_CACHE_KEY);
			await safeCacheDelete(cache, SHARE_FILES_MANIFEST_KEY);
			for (const fm of fileMeta) if (fm?.key) await safeCacheDelete(cache, fm.key);
		}
		return {
			meta: meta || {},
			files,
			fileMeta
		};
	} catch (error) {
		console.warn("[ShareTargetGateway] Failed to consume cached payload:", error);
		return null;
	}
};
/** Read the service worker's advertised cached content entries through the HTTP bridge. */
var fetchSwCachedEntries = async () => {
	try {
		const response = await fetch(API_ENDPOINTS.SW_CONTENT_AVAILABLE);
		if (!response.ok) return [];
		const data = await response.json();
		const keys = Array.isArray(data?.cacheKeys) ? data.cacheKeys : [];
		const content = [];
		for (const cacheKey of keys) {
			const key = String(cacheKey?.key || "");
			if (!key) continue;
			try {
				const contentResponse = await fetch(`${API_ENDPOINTS.SW_CONTENT}/${key}`);
				if (!contentResponse.ok) continue;
				content.push({
					key,
					context: String(cacheKey?.context || ""),
					content: await contentResponse.json()
				});
			} catch (error) {
				console.warn("[ShareTargetGateway] Failed to fetch SW cache item:", error);
			}
		}
		return content;
	} catch (error) {
		console.warn("[ShareTargetGateway] Failed to fetch SW cache entries:", error);
		return [];
	}
};
/** Fetch share-target files exposed by the service worker-side manifest endpoint. */
var fetchCachedShareFiles = async (cacheKey = "latest") => {
	try {
		const response = await fetch(`/share-target-files?cacheKey=${encodeURIComponent(cacheKey)}`);
		if (!response.ok) return [];
		const manifest = await response.json();
		const fileItems = Array.isArray(manifest?.files) ? manifest.files : [];
		const files = [];
		for (const item of fileItems) {
			const fileUrl = typeof item?.key === "string" ? item.key : "";
			if (!fileUrl) continue;
			try {
				const fileResponse = await fetch(fileUrl);
				if (!fileResponse.ok) continue;
				const fileBlob = await fileResponse.blob();
				files.push(new File([fileBlob], item.name || "shared-file", { type: item.type || fileBlob.type || "application/octet-stream" }));
			} catch (error) {
				console.warn("[ShareTargetGateway] Failed to fetch file from cache:", error);
			}
		}
		return files;
	} catch (error) {
		console.warn("[ShareTargetGateway] Failed to fetch cached share files:", error);
		return [];
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterState.ts
var WorkCenterStateManager = class {
	static STORAGE_KEY = "rs-workcenter-state";
	static TEMPLATES_STORAGE_KEY = "rs-workcenter-templates";
	static createDefaultState() {
		const legacy = this.loadWorkCenterState();
		const legacyPrompt = String(legacy.currentPrompt || "");
		return {
			...legacy,
			files: [],
			selectedFiles: [],
			currentPrompt: legacyPrompt,
			draft: {
				content: legacyPrompt,
				attachments: []
			},
			messages: [],
			sessionEpoch: 0,
			sessionHydrated: false,
			autoAction: legacy.autoAction || false,
			selectedInstruction: legacy.selectedInstruction || "",
			outputFormat: legacy.outputFormat || "auto",
			activeInputTab: legacy.activeInputTab || "prompt",
			activeResultsTab: legacy.activeResultsTab || "output",
			selectedLanguage: legacy.selectedLanguage || "auto",
			selectedTemplate: legacy.selectedTemplate || "",
			recognitionFormat: legacy.recognitionFormat || "auto",
			processingFormat: legacy.processingFormat || "markdown",
			voiceRecording: false,
			promptTemplates: this.loadPromptTemplates(),
			lastRawResult: null,
			recognizedData: null,
			processedData: null,
			currentProcessingStep: legacy.currentProcessingStep || 0
		};
	}
	static saveState(state) {
		try {
			const stateToSave = {
				autoAction: state.autoAction,
				selectedInstruction: state.selectedInstruction,
				outputFormat: state.outputFormat,
				activeInputTab: state.activeInputTab,
				activeResultsTab: state.activeResultsTab,
				selectedLanguage: state.selectedLanguage,
				selectedTemplate: state.selectedTemplate,
				recognitionFormat: state.recognitionFormat,
				processingFormat: state.processingFormat,
				currentProcessingStep: state.currentProcessingStep,
				recognizedData: state.recognizedData ? {
					timestamp: state.recognizedData.timestamp,
					source: state.recognizedData.source,
					contentLength: state.recognizedData.content.length,
					metadata: state.recognizedData.metadata
				} : null,
				processedData: state.processedData ? state.processedData.map((p) => ({
					timestamp: p.timestamp,
					action: p.action,
					contentLength: p.content.length,
					metadata: p.metadata
				})) : null
			};
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stateToSave));
		} catch (e) {
			console.warn("Failed to save workcenter state:", e);
		}
	}
	static loadWorkCenterState() {
		try {
			const saved = localStorage.getItem(this.STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				return {
					currentPrompt: parsed.currentPrompt || "",
					autoAction: parsed.autoAction || false,
					selectedInstruction: parsed.selectedInstruction || "",
					outputFormat: parsed.outputFormat || "auto",
					activeInputTab: (() => {
						const tab = String(parsed.activeInputTab || "prompt");
						return tab === "attachments" || tab === "prompt" ? tab : "prompt";
					})(),
					activeResultsTab: (() => {
						const tab = String(parsed.activeResultsTab || "output");
						return tab === "pipeline" || tab === "history" || tab === "output" ? tab : "output";
					})(),
					selectedLanguage: parsed.selectedLanguage || "auto",
					selectedTemplate: parsed.selectedTemplate || "",
					recognitionFormat: parsed.recognitionFormat || "auto",
					processingFormat: parsed.processingFormat || "markdown",
					currentProcessingStep: parsed.currentProcessingStep || 0
				};
			}
		} catch (e) {
			console.warn("Failed to load workcenter state:", e);
		}
		return {};
	}
	static loadPromptTemplates() {
		const safeJsonParse = (raw, fallback) => {
			if (!raw) return fallback;
			try {
				return JSON.parse(raw) ?? fallback;
			} catch {
				return fallback;
			}
		};
		return safeJsonParse(localStorage.getItem(this.TEMPLATES_STORAGE_KEY), [
			{
				name: "Analyze & Extract",
				prompt: "Analyze the provided content and extract key information, formulas, data, and insights. Identify the main topics, recognize any mathematical expressions or equations, and provide a structured summary."
			},
			{
				name: "Solve Equations",
				prompt: "Find and solve any mathematical equations, problems, or calculations in the content. Show your work step-by-step and provide the final answers."
			},
			{
				name: "Generate Code",
				prompt: "Based on the description or requirements in the content, generate appropriate code. Include comments and explain the implementation."
			},
			{
				name: "Extract Styles",
				prompt: "Analyze the visual content or design description and extract/generate CSS styles, color schemes, and layout information."
			},
			{
				name: "Document Analysis",
				prompt: "Perform a comprehensive analysis of the document, including structure, key points, relationships, and actionable insights."
			},
			{
				name: "Data Processing",
				prompt: "Process and transform the provided data. Extract structured information, identify patterns, and present results in a clear format."
			}
		]);
	}
	static savePromptTemplates(templates) {
		try {
			localStorage.setItem(this.TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
		} catch (e) {
			console.warn("Failed to save prompt templates:", e);
		}
	}
	static clearRecognizedData(state) {
		state.recognizedData = null;
		state.processedData = null;
		state.currentProcessingStep = 0;
	}
	static addProcessedStep(state, step) {
		if (!state.processedData) state.processedData = [];
		state.processedData.push(step);
		state.currentProcessingStep++;
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterUI.ts
var icon = (name, size = "18") => {
	const element = document.createElement("ui-icon");
	element.setAttribute("icon", name);
	element.setAttribute("icon-style", "duotone");
	element.setAttribute("size", size);
	element.setAttribute("aria-hidden", "true");
	return element;
};
var button = (action, label, iconName, className = "wc-icon-button") => {
	const element = document.createElement("button");
	element.type = "button";
	element.className = className;
	element.dataset.action = action;
	element.setAttribute("aria-label", label);
	element.title = label;
	element.append(icon(iconName));
	return element;
};
var formatFileSize = (bytes) => {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};
var formatAttachCount = (count) => count === 1 ? "1 file" : `${count} files`;
var attachmentGlyph = (attachment) => {
	if (attachment.url) return "link";
	const type = attachment.type.toLowerCase();
	const name = attachment.name.toLowerCase();
	if (type.startsWith("image/")) return "image";
	if (type === "application/pdf" || name.endsWith(".pdf")) return "file-pdf";
	if (type.includes("wordprocessingml") || name.endsWith(".docx") || name.endsWith(".doc")) return "file-doc";
	if (type.includes("spreadsheetml") || name.endsWith(".xlsx") || name.endsWith(".xls")) return "file-xls";
	if (type.startsWith("text/") || name.endsWith(".md") || name.endsWith(".txt") || name.endsWith(".csv")) return "file-text";
	return "paperclip";
};
/** Grow the composer textarea with its text; a dragged min-height can still expand further. */
var syncWorkCenterComposerHeight = (root) => {
	if (!root?.querySelector(".prompt-input")) return;
};
/** After attachments land, grow the composer (and a floating window) so the rail is not clipped. */
var syncWorkCenterChatForAttachments = (root) => {
	syncWorkCenterComposerHeight(root);
	const composer = root?.querySelector("[data-workcenter-composer]");
	if (!composer) return;
	const rail = composer.querySelector("[data-draft-files]");
	const hasFiles = Boolean(rail && !rail.hidden);
	composer.classList.toggle("has-attachments", hasFiles);
	if (!hasFiles) {
		composer.style.removeProperty("--wc-composer-min");
		return;
	}
	const chat = root instanceof HTMLElement ? root : composer.closest(".workcenter-chat");
	const needed = Math.max(composer.scrollHeight, composer.offsetHeight, 200);
	const cap = chat ? Math.max(200, chat.clientHeight * .75 || 540) : 540;
	composer.style.setProperty("--wc-composer-min", `${Math.min(needed, cap)}px`);
	const extra = rail?.getBoundingClientRect().height || 0;
	const frame = chat?.closest("ui-window");
	if (!(frame instanceof HTMLElement) || extra <= 0) return;
	const rect = frame.getBoundingClientRect();
	const next = Math.min((globalThis.innerHeight || rect.height) * .92, rect.height + extra);
	if (next > rect.height + 4) frame.style.blockSize = `${Math.round(next)}px`;
};
var appendAttachmentCard = (target, attachment, presentation, removable = false) => {
	const card = document.createElement("article");
	card.className = `wc-attachment-chip${attachment.type.startsWith("image/") ? " is-image" : ""}`;
	card.dataset.attachmentHash = attachment.hash;
	const file = presentation?.fileFor(attachment) ?? null;
	const preview = file ? presentation?.getPreviewUrl(file) : null;
	const open = document.createElement("button");
	open.type = "button";
	open.className = "wc-attachment-chip__open";
	open.dataset.action = "view-attachment";
	open.dataset.attachmentHash = attachment.hash;
	open.setAttribute("aria-label", `View ${attachment.name}`);
	open.title = `View ${attachment.name}`;
	if (preview) {
		const image = document.createElement("img");
		image.className = "wc-attachment-chip__preview";
		image.src = preview;
		image.alt = "";
		image.decoding = "async";
		image.loading = "lazy";
		open.append(image);
	} else {
		const glyph = icon(attachmentGlyph(attachment), "20");
		glyph.classList.add("wc-attachment-chip__glyph");
		open.append(glyph);
	}
	const copy = document.createElement("span");
	copy.className = "wc-attachment-chip__copy";
	const label = document.createElement("span");
	label.className = "wc-attachment-chip__label";
	label.textContent = attachment.url || attachment.name;
	const meta = document.createElement("span");
	meta.className = "wc-attachment-chip__meta";
	meta.textContent = attachment.error || formatFileSize(attachment.size);
	copy.append(label, meta);
	open.append(copy);
	card.append(open);
	const actions = document.createElement("div");
	actions.className = "wc-attachment-chip__actions";
	const download = button("download-attachment", `Download ${attachment.name}`, "download", "wc-chip-remove");
	download.dataset.attachmentHash = attachment.hash;
	actions.append(download);
	if (removable) {
		const remove = button("remove-draft-attachment", `Remove ${attachment.name}`, "trash", "wc-chip-remove");
		remove.dataset.attachmentHash = attachment.hash;
		actions.append(remove);
	}
	card.append(actions);
	target.append(card);
};
var appendMessage = (transcript, message, presentation) => {
	const item = document.createElement("article");
	item.className = `workcenter-message workcenter-message--${message.role} is-${message.status}`;
	item.dataset.workcenterMessage = "";
	item.dataset.messageId = message.id;
	const header = document.createElement("div");
	header.className = "workcenter-message__header";
	const author = document.createElement("span");
	author.className = "workcenter-message__author";
	author.textContent = message.role === "user" ? "You" : "Work Center";
	header.append(author);
	item.append(header);
	const body = document.createElement("div");
	body.className = "workcenter-message__body";
	if (message.role === "assistant" && message.status === "complete") {
		body.innerHTML = renderSafeMarkdown(message.content);
		highlightCodeTree(body);
	} else if (message.status === "pending") {
		body.textContent = "Thinking…";
		body.setAttribute("aria-busy", "true");
	} else if (message.status === "failed") body.textContent = message.error || "The response could not be completed.";
	else if (message.status === "cancelled") body.textContent = "Cancelled";
	else body.textContent = message.content;
	item.append(body);
	if (message.attachments.length) {
		const attachments = document.createElement("div");
		attachments.className = "workcenter-message__attachments";
		for (const attachment of message.attachments) appendAttachmentCard(attachments, attachment, presentation);
		item.append(attachments);
	}
	if (message.role === "assistant" && message.status === "pending") {
		const actions = document.createElement("div");
		actions.className = "workcenter-message__actions";
		const cancel = button("cancel-turn", "Cancel response", "stop-circle", "wc-quiet-button");
		cancel.dataset.turnId = message.id;
		actions.append(cancel);
		item.append(actions);
	}
	if (message.role === "assistant" && message.status === "failed") {
		const actions = document.createElement("div");
		actions.className = "workcenter-message__actions";
		const retry = button("retry-turn", "Retry response", "arrow-clockwise", "wc-quiet-button");
		retry.dataset.turnId = message.id;
		actions.append(retry);
		item.append(actions);
	}
	if (message.role === "assistant" && message.status === "complete") {
		const actions = document.createElement("div");
		actions.className = "workcenter-message__actions";
		const copy = button("copy-turn", "Copy response", "copy", "wc-quiet-button");
		copy.dataset.turnId = message.id;
		actions.append(copy);
		item.append(actions);
	}
	transcript.append(item);
};
var createRequestOptions = (state) => {
	const panel = document.createElement("section");
	panel.className = "workcenter-request-options";
	panel.dataset.workcenterRequestOptions = "";
	panel.hidden = true;
	panel.setAttribute("aria-label", "Response options");
	const instructionLabel = document.createElement("label");
	instructionLabel.textContent = "Instruction";
	const instructionSelect = document.createElement("select");
	instructionSelect.className = "instruction-select";
	instructionSelect.setAttribute("data-action", "select-instruction");
	const emptyInstruction = document.createElement("option");
	emptyInstruction.value = "";
	emptyInstruction.textContent = "None (default)";
	instructionSelect.append(emptyInstruction);
	instructionLabel.append(instructionSelect);
	panel.append(instructionLabel);
	const templateLabel = document.createElement("label");
	templateLabel.textContent = "Template";
	const templateSelect = document.createElement("select");
	templateSelect.className = "template-select";
	const emptyTemplate = document.createElement("option");
	emptyTemplate.value = "";
	emptyTemplate.textContent = "No template";
	templateSelect.append(emptyTemplate);
	for (const template of state.promptTemplates) {
		const option = document.createElement("option");
		option.value = template.prompt;
		option.textContent = template.name;
		option.selected = template.prompt === state.selectedTemplate;
		templateSelect.append(option);
	}
	templateLabel.append(templateSelect);
	panel.append(templateLabel);
	panel.append(button("edit-templates", "Edit templates", "gear", "wc-quiet-button"));
	const fields = [
		[
			"Output",
			"format-select",
			state.outputFormat,
			[
				["auto", "Auto"],
				["markdown", "Markdown"],
				["json", "JSON"],
				["code", "Code"],
				["raw", "Raw text"],
				["text", "Plain text"],
				["html", "HTML"]
			]
		],
		[
			"Language",
			"language-select",
			state.selectedLanguage,
			[
				["auto", "Auto"],
				["en", "English"],
				["ru", "Русский"]
			]
		],
		[
			"Recognition",
			"recognition-select",
			state.recognitionFormat,
			[
				["auto", "Auto"],
				["most-suitable", "Most suitable"],
				["most-optimized", "Most optimized"],
				["most-legibility", "Most legible"],
				["markdown", "Markdown"],
				["html", "HTML"],
				["text", "Plain text"],
				["json", "JSON"]
			]
		],
		[
			"Processing",
			"processing-select",
			state.processingFormat,
			[
				["markdown", "Markdown"],
				["html", "HTML"],
				["json", "JSON"],
				["text", "Plain text"],
				["typescript", "TypeScript"],
				["javascript", "JavaScript"],
				["python", "Python"],
				["java", "Java"],
				["cpp", "C++"],
				["csharp", "C#"],
				["php", "PHP"],
				["ruby", "Ruby"],
				["go", "Go"],
				["rust", "Rust"],
				["xml", "XML"],
				["yaml", "YAML"],
				["css", "CSS"],
				["scss", "SCSS"]
			]
		]
	];
	for (const [labelText, className, value, options] of fields) {
		const label = document.createElement("label");
		label.textContent = labelText;
		const select = document.createElement("select");
		select.className = className;
		for (const [optionValue, optionText] of options) {
			const option = document.createElement("option");
			option.value = optionValue;
			option.textContent = optionText;
			option.selected = optionValue === value;
			select.append(option);
		}
		label.append(select);
		panel.append(label);
	}
	return panel;
};
/** Build a stateless, accessible Work Center chat shell for rendering or tests. */
var createWorkCenterChatShell = (options) => {
	const root = document.createElement("div");
	root.className = "workcenter-view workcenter-chat";
	root.dataset.view = "workcenter";
	root.setAttribute("role", "main");
	root.setAttribute("aria-labelledby", "workcenter-title");
	const header = document.createElement("header");
	header.className = "workcenter-header";
	const title = document.createElement("h2");
	title.id = "workcenter-title";
	title.textContent = options.title;
	header.append(title);
	const headerActions = document.createElement("div");
	headerActions.className = "workcenter-header__actions";
	headerActions.append(button("new-chat", "New chat", "plus"), button("open-secondary", "Open activity", "clock-counter-clockwise"), button("open-request-options", "Response options", "sliders-horizontal"));
	header.append(headerActions);
	root.append(header);
	if (options.settings) root.append(createRequestOptions(options.settings));
	const transcript = document.createElement("section");
	transcript.className = "workcenter-transcript";
	transcript.dataset.workcenterTranscript = "";
	transcript.setAttribute("role", "log");
	transcript.setAttribute("aria-live", "polite");
	transcript.setAttribute("aria-relevant", "additions text");
	if (!options.messages.length) {
		const empty = document.createElement("p");
		empty.className = "workcenter-transcript__empty";
		empty.textContent = "Start with a question or attach something to review.";
		transcript.append(empty);
	} else for (const message of options.messages) appendMessage(transcript, message, options.attachments);
	root.append(transcript);
	const composer = document.createElement("form");
	composer.className = "workcenter-composer";
	composer.dataset.workcenterComposer = "";
	composer.setAttribute("aria-label", "Message composer");
	const resize = document.createElement("div");
	resize.className = "workcenter-composer__resize";
	resize.dataset.composerResize = "";
	resize.setAttribute("role", "separator");
	resize.setAttribute("aria-orientation", "horizontal");
	resize.setAttribute("aria-label", "Resize composer");
	resize.title = "Drag to stretch the composer";
	composer.append(resize);
	const fileRail = document.createElement("div");
	fileRail.className = "workcenter-composer__files";
	fileRail.dataset.draftFiles = "";
	fileRail.hidden = options.draft.attachments.length === 0;
	const fileHead = document.createElement("div");
	fileHead.className = "workcenter-composer__files-head";
	const fileLabel = document.createElement("span");
	fileLabel.dataset.attachLabel = "";
	fileLabel.textContent = formatAttachCount(options.draft.attachments.length);
	fileHead.append(fileLabel);
	const chips = document.createElement("div");
	chips.className = "workcenter-composer__attachments";
	chips.dataset.draftAttachments = "";
	for (const attachment of options.draft.attachments) appendAttachmentCard(chips, attachment, options.attachments, true);
	fileRail.append(fileHead, chips);
	composer.append(fileRail);
	const inputRow = document.createElement("div");
	inputRow.className = "workcenter-composer__input-row";
	const prompt = document.createElement("textarea");
	prompt.className = "prompt-input";
	prompt.name = "prompt";
	prompt.rows = 1;
	prompt.dataset.composerAutogrow = "";
	prompt.placeholder = "Message Work Center…";
	prompt.value = options.draft.content;
	prompt.setAttribute("aria-label", "Message Work Center");
	inputRow.append(prompt);
	const attach = document.createElement("label");
	attach.className = "wc-icon-button wc-attach-button";
	attach.dataset.action = "select-files";
	attach.setAttribute("aria-label", options.draft.attachments.length ? `Attach files, ${formatAttachCount(options.draft.attachments.length)} attached` : "Attach files");
	attach.title = "Attach files";
	const picker = document.createElement("input");
	picker.type = "file";
	picker.multiple = true;
	picker.className = "wc-file-picker";
	picker.dataset.workcenterFilePicker = "";
	const badge = document.createElement("span");
	badge.className = "wc-attach-count";
	badge.dataset.attachCount = "";
	badge.textContent = String(options.draft.attachments.length);
	badge.hidden = options.draft.attachments.length === 0;
	attach.append(picker, icon("paperclip"), badge);
	inputRow.append(attach);
	inputRow.append(button("voice-input", "Voice input", "microphone"));
	const send = button("execute", "Send message", "arrow-up", "wc-send-button");
	send.type = "submit";
	inputRow.append(send);
	composer.append(inputRow);
	root.append(composer);
	const secondary = document.createElement("aside");
	secondary.className = "workcenter-secondary-panel";
	secondary.dataset.workcenterSecondary = "";
	secondary.hidden = true;
	secondary.setAttribute("aria-label", "Work Center activity");
	secondary.append(button("view-action-history", "View technical activity", "clock-counter-clockwise", "wc-quiet-button"));
	root.append(secondary);
	return root;
};
/** Presentation facade that keeps legacy callers working while the view uses chat state. */
var WorkCenterUI = class {
	deps;
	attachments;
	prompts;
	results;
	history;
	presentation;
	container = null;
	constructor(deps, attachments, prompts, results, history, presentation) {
		this.deps = deps;
		this.attachments = attachments;
		this.prompts = prompts;
		this.results = results;
		this.history = history;
		this.presentation = presentation;
	}
	setContainer(container) {
		this.container = container;
		this.attachments.setContainer(container);
		this.prompts.setContainer(container);
		this.results.setContainer(container);
		this.history.setContainer(container);
	}
	getContainer() {
		return this.container;
	}
	renderWorkCenterView(state) {
		const container = createWorkCenterChatShell({
			title: "AI Work Center",
			draft: state.draft,
			messages: state.messages,
			attachments: this.presentation,
			settings: state
		});
		this.setContainer(container);
		return container;
	}
	/** Rebuild transcript + draft chips on an already-mounted chat root. */
	paintConversation(state, root = this.container, syncPrompt = "replace") {
		const transcript = root?.querySelector("[data-workcenter-transcript]");
		if (transcript) {
			transcript.replaceChildren();
			if (!state.messages.length) {
				const empty = document.createElement("p");
				empty.className = "workcenter-transcript__empty";
				empty.textContent = "Start with a question or attach something to review.";
				transcript.append(empty);
			} else for (const message of state.messages) appendMessage(transcript, message, this.presentation);
			transcript.scrollTop = transcript.scrollHeight;
		}
		this.updateFileCounter(state, root);
		const input = root?.querySelector(".prompt-input");
		if (input && (syncPrompt === "replace" || input !== document.activeElement)) input.value = state.draft.content;
		syncWorkCenterComposerHeight(root);
	}
	updateFileCounter(state, root = this.container) {
		const count = state.draft.attachments.length;
		const rail = root?.querySelector("[data-draft-files]");
		if (rail) rail.hidden = count === 0;
		const label = root?.querySelector("[data-attach-label]");
		if (label) label.textContent = formatAttachCount(count);
		const badge = root?.querySelector("[data-attach-count]");
		if (badge) {
			badge.textContent = String(count);
			badge.hidden = count === 0;
		}
		(root?.querySelector("[data-action='select-files']"))?.setAttribute("aria-label", count ? `Attach files, ${formatAttachCount(count)} attached` : "Attach files");
		const attachments = root?.querySelector("[data-draft-attachments]");
		if (!attachments) return;
		attachments.replaceChildren();
		for (const attachment of state.draft.attachments) appendAttachmentCard(attachments, attachment, this.presentation, true);
		syncWorkCenterChatForAttachments(root);
	}
	updateFileList(state) {
		this.updateFileCounter(state);
	}
	updatePromptInput(state) {
		const input = this.container?.querySelector(".prompt-input");
		if (input) input.value = state.draft.content;
		syncWorkCenterComposerHeight(this.container);
	}
	updateTemplateSelect(_state) {}
	updateVoiceButton(_state) {}
	updateDataPipeline(_state) {}
	updateDataCounters(_state) {}
	showProcessingMessage(_message) {}
	showResult(_state) {}
	showError(_error) {}
	clearResults() {}
	revokeAllPreviewUrls(_state) {
		this.attachments.revokeAllPreviewUrls(_state);
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterFileOps.ts
var WorkCenterFileOps = class {
	deps;
	constructor(dependencies) {
		this.deps = dependencies;
	}
	async handleDroppedContent(state, content, sourceType) {
		switch (this.getCurrentHash()) {
			case ROUTE_HASHES.SHARE_TARGET_TEXT: if (sourceType === "text" || sourceType === "html") return this.handlePastedContent(state, content, sourceType);
			else {
				this.deps.showMessage?.("This route only accepts text content. Please paste text or use the files route for file drops.");
				return;
			}
			case ROUTE_HASHES.SHARE_TARGET_IMAGE: if (this.isImageContent(content) || sourceType === "image") return this.handleImageContent(state, content, sourceType);
			else {
				this.deps.showMessage?.("This route only accepts image content. Please drop images or use other routes for different content types.");
				return;
			}
			case ROUTE_HASHES.SHARE_TARGET_FILES: return this.handlePastedContent(state, content, sourceType);
			case ROUTE_HASHES.SHARE_TARGET_URL: if (this.isValidUrl(content)) return this.handlePastedContent(state, content, sourceType);
			else {
				this.deps.showMessage?.("This route only accepts URLs. Please paste a valid URL.");
				return;
			}
			default: return this.handlePastedContent(state, content, sourceType);
		}
	}
	async handlePastedContent(state, content, sourceType) {
		const currentHash = this.getCurrentHash();
		try {
			switch (currentHash) {
				case ROUTE_HASHES.SHARE_TARGET_TEXT:
					if (sourceType === "text" || sourceType === "html") await this.handleTextContent(state, content, sourceType);
					else this.deps.showMessage?.("This route only accepts text content");
					break;
				case ROUTE_HASHES.SHARE_TARGET_URL:
					if (this.isValidUrl(content)) await this.handleUrlContent(state, content);
					else this.deps.showMessage?.("This route only accepts valid URLs");
					break;
				case ROUTE_HASHES.SHARE_TARGET_IMAGE:
					if (this.isImageContent(content) || this.isBase64Data(content)) await this.handleImageContent(state, content, sourceType);
					else this.deps.showMessage?.("This route only accepts image content");
					break;
				default: await this.handleDefaultPaste(state, content, sourceType);
			}
		} catch (error) {
			console.error("[WorkCenter] Failed to handle pasted content:", error);
			this.deps.showMessage?.("Failed to process pasted content");
		}
	}
	isValidUrl(string) {
		try {
			new URL(string);
			return true;
		} catch {
			return false;
		}
	}
	isBase64Data(content) {
		const raw = (content || "").trim();
		return !!parseDataUrl(raw) || isBase64Like(raw);
	}
	async handleBase64Content(state, content) {
		try {
			const asset = await normalizeDataAsset(content, {
				namePrefix: "pasted-data",
				uriComponent: true
			});
			state.files.push(asset.file);
			this.deps.showMessage?.("Encoded content decoded and added to work center");
		} catch (error) {
			console.error("[WorkCenter] Failed to decode base64 content:", error);
			const fallbackAsset = await normalizeDataAsset(content, {
				namePrefix: "pasted-text",
				mimeType: "text/plain;charset=utf-8"
			});
			state.files.push(fallbackAsset.file);
			this.deps.showMessage?.("Base64 content added as text to work center");
		}
	}
	addFilesFromInput(state, files) {
		const fileArray = Array.from(files);
		const currentHash = this.getCurrentHash();
		let filteredFiles = fileArray;
		switch (currentHash) {
			case ROUTE_HASHES.SHARE_TARGET_IMAGE:
				filteredFiles = fileArray.filter((file) => file.type.startsWith("image/"));
				if (filteredFiles.length === 0) {
					this.deps.showMessage?.("This route only accepts image files. Please drop images or use other routes for different file types.");
					return;
				}
				break;
			case ROUTE_HASHES.SHARE_TARGET_TEXT:
				filteredFiles = fileArray.filter((file) => file.type.startsWith("text/") || file.type === "application/json" || file.type === "application/xml" || file.name.toLowerCase().endsWith(".txt") || file.name.toLowerCase().endsWith(".md") || file.name.toLowerCase().endsWith(".json") || file.name.toLowerCase().endsWith(".xml"));
				if (filteredFiles.length === 0) {
					this.deps.showMessage?.("This route only accepts text files. Please drop text files or use the files route for other file types.");
					return;
				}
				break;
			case ROUTE_HASHES.SHARE_TARGET_FILES:
				filteredFiles = fileArray;
				break;
			case ROUTE_HASHES.SHARE_TARGET_URL:
				this.deps.showMessage?.("This route only accepts URLs. Please paste a URL instead of dropping files.");
				return;
			default: filteredFiles = fileArray;
		}
		state.files.push(...filteredFiles);
		if (filteredFiles.length > 0) {
			const fileCount = filteredFiles.length;
			const fileWord = fileCount === 1 ? "file" : "files";
			this.deps.showMessage?.(`${fileCount} ${fileWord} added to work center`);
		}
	}
	removeFile(state, index) {
		if (index >= 0 && index < state.files.length) return state.files.splice(index, 1)[0];
		return null;
	}
	clearAllFiles(state) {
		const files = [...state.files];
		state.files.length = 0;
		return files;
	}
	getFilesForProcessing(state) {
		return [...state.files];
	}
	hasFiles(state) {
		return state.files.length > 0;
	}
	hasTextFiles(state) {
		return state.files.some((f) => f.type.startsWith("text/") || f.type === "application/markdown" || f.name?.endsWith(".md") || f.name?.endsWith(".txt"));
	}
	determineRecognizedFormat(state) {
		if (!this.hasTextFiles(state)) return "markdown";
		else return "markdown";
	}
	validateFileForUpload(file) {
		if (file.size > 52428800) return {
			valid: false,
			reason: "File too large (max 50MB)"
		};
		if (![
			"image/",
			"text/",
			"application/pdf",
			"application/json",
			"application/markdown",
			"application/xml"
		].some((type) => file.type.startsWith(type) || file.name.toLowerCase().endsWith(type.replace("application/", ".")))) return {
			valid: false,
			reason: "File type not supported"
		};
		return { valid: true };
	}
	getCurrentHash() {
		return typeof globalThis !== "undefined" ? globalThis?.location?.hash : "";
	}
	async handleTextContent(state, content, sourceType) {
		const asset = await normalizeDataAsset(content, {
			namePrefix: sourceType === "html" ? "shared-html" : "shared-text",
			mimeType: sourceType === "html" ? "text/html" : "text/plain;charset=utf-8"
		});
		state.files.push(asset.file);
		this.deps.showMessage?.("Text content added to work center");
	}
	async handleUrlContent(state, content) {
		const asset = await normalizeDataAsset(content, {
			namePrefix: "shared-url",
			uriComponent: true
		});
		state.files.push(asset.file);
		this.deps.showMessage?.("URL added to work center");
	}
	async handleImageContent(state, content, sourceType) {
		if (this.isBase64Data(content)) await this.handleBase64Content(state, content);
		else {
			const asset = await normalizeDataAsset(content, {
				namePrefix: "shared-image",
				mimeType: sourceType === "image" ? "image/png" : "text/plain;charset=utf-8",
				uriComponent: true
			});
			state.files.push(asset.file);
			this.deps.showMessage?.("Image content added to work center");
		}
	}
	async handleDefaultPaste(state, content, sourceType) {
		if (this.isValidUrl(content)) {
			const asset = await normalizeDataAsset(content, {
				namePrefix: "pasted-url",
				uriComponent: true
			});
			state.files.push(asset.file);
			this.deps.showMessage?.("URL added to work center");
		} else if (this.isBase64Data(content)) await this.handleBase64Content(state, content);
		else {
			const asset = await normalizeDataAsset(content, {
				namePrefix: `pasted-${sourceType || "text"}`,
				mimeType: sourceType === "html" ? "text/html" : "text/plain;charset=utf-8"
			});
			state.files.push(asset.file);
			this.deps.showMessage?.(`${sourceType === "html" ? "HTML" : "Text"} content added to work center`);
		}
	}
	isImageContent(content) {
		return content.startsWith("data:image/") || /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(content);
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterShareTarget.ts
var WorkCenterShareTarget = class {
	deps;
	_fileOps;
	ingestInput;
	constructor(dependencies, fileOps, ingestInput) {
		this.deps = dependencies;
		this._fileOps = fileOps;
		this.ingestInput = ingestInput;
		this._fileOps;
	}
	initShareTargetListener(_state) {
		console.log("[WorkCenter] Share target result listener initialized via unified messaging");
	}
	async processQueuedMessages(_state) {
		try {
			console.log("[WorkCenter] Queued message processing handled by unified messaging");
			const payload = await consumeCachedShareTargetPayload({ clear: true });
			if (payload) {
				const meta = payload.meta && typeof payload.meta === "object" ? payload.meta : {};
				await this.addShareTargetInput(_state, {
					files: payload.files,
					title: typeof meta.title === "string" ? meta.title : "",
					text: typeof meta.text === "string" ? meta.text : "",
					url: typeof meta.url === "string" ? meta.url : "",
					timestamp: typeof meta.timestamp === "number" ? meta.timestamp : Date.now(),
					source: "share-target-cache"
				});
			}
		} catch (error) {
			console.error("[WorkCenter] Failed to process queued messages:", error);
		}
	}
	handleShareTargetMessage(state, event) {
		const { type, data, pingId } = event.data || {};
		if (type === "ping" && pingId) return;
		else if (type === "share-target-result" && data) {
			console.log("[WorkCenter] Received share target result:", summarizeForLog(data));
			this.addShareTargetResult(state, data);
		} else if (type === "share-target-input" && data) {
			console.log("[WorkCenter] Received share target input:", summarizeForLog(data));
			this.addShareTargetInput(state, data);
		} else if (type === "ai-result" && data) {
			console.log("[WorkCenter] Received AI processing result:", summarizeForLog(data));
			this.handleAIResult(state, data);
		} else if (type === "content-cached" && data) {
			console.log("[WorkCenter] Received cached content from SW:", summarizeForLog(data));
			this.handleCachedContent(state, data);
		} else if (type === "content-received" && data) {
			console.log("[WorkCenter] Received content from SW:", summarizeForLog(data));
			this.handleReceivedContent(state, data);
		}
	}
	async addShareTargetResult(state, resultData) {
		const processedEntry = {
			content: resultData.content || "",
			timestamp: resultData.timestamp || Date.now(),
			action: resultData.action || "Share Target Processing",
			sourceData: resultData.rawData,
			metadata: {
				source: resultData.source || "share-target",
				...resultData.metadata
			}
		};
		const { WorkCenterStateManager } = await import("../chunks/WorkCenterState.js");
		WorkCenterStateManager.addProcessedStep(state, processedEntry);
		state.lastRawResult = resultData.rawData ?? resultData.content ?? null;
		WorkCenterStateManager.saveState(state);
		this.deps.showMessage?.(`Share target result added to work center`);
		this.deps.render?.();
	}
	async addShareTargetInput(state, inputData) {
		console.log("[WorkCenter] Adding share target input:", summarizeForLog(inputData));
		if (this.ingestInput) {
			await this.ingestInput(inputData);
			return;
		}
		try {
			let filesAdded = 0;
			let textAdded = false;
			const fileFingerprint = (file) => `${String(file.name || "").trim().toLowerCase()}::${Number(file.size || 0)}::${String(file.type || "").trim().toLowerCase()}`;
			const seenFingerprints = new Set((state.files || []).map(fileFingerprint));
			const pushUniqueFile = (file) => {
				const key = fileFingerprint(file);
				if (seenFingerprints.has(key)) return false;
				seenFingerprints.add(key);
				state.files.push(file);
				return true;
			};
			const normalizeIncomingFile = async (raw) => {
				if (!raw) return null;
				if (raw instanceof File) return raw;
				if (raw instanceof Blob) return new File([raw], `shared-${Date.now()}`, { type: raw.type || "application/octet-stream" });
				const candidate = raw;
				if (candidate?.blob instanceof Blob) {
					const blob = candidate.blob;
					const name = typeof candidate.name === "string" && candidate.name.trim() ? candidate.name : `shared-${Date.now()}`;
					const lastModified = Number(candidate.lastModified || Date.now());
					return new File([blob], name, {
						type: String(candidate.type || blob.type || "application/octet-stream"),
						lastModified: Number.isFinite(lastModified) ? lastModified : Date.now()
					});
				}
				return null;
			};
			const attachmentFiles = Array.isArray(inputData.attachments) ? inputData.attachments.map((entry) => entry?.data).filter((entry) => entry instanceof File || entry instanceof Blob) : [];
			const incomingFiles = [...Array.isArray(inputData.files) ? inputData.files : [], ...attachmentFiles];
			if (incomingFiles.length > 0) for (const raw of incomingFiles) {
				const normalized = await normalizeIncomingFile(raw);
				if (normalized && pushUniqueFile(normalized)) filesAdded++;
			}
			if (filesAdded === 0 && Number(inputData?.fileCount || 0) > 0) try {
				const cached = await consumeCachedShareTargetPayload({ clear: false });
				const cachedFiles = Array.isArray(cached?.files) ? cached.files : [];
				if (cachedFiles.length > 0) {
					for (const cachedFile of cachedFiles) if (cachedFile instanceof File && pushUniqueFile(cachedFile)) filesAdded++;
				}
			} catch (cacheError) {
				console.warn("[WorkCenter] Failed to hydrate cached share files:", cacheError);
			}
			if (inputData.text && typeof inputData.text === "string" && inputData.text.trim()) {
				const textBlob = new Blob([inputData.text], { type: "text/plain" });
				if (pushUniqueFile(new File([textBlob], "shared-text.txt", { type: "text/plain" }))) {
					filesAdded++;
					textAdded = true;
				}
			}
			if (inputData.url && typeof inputData.url === "string") {
				const urlBlob = new Blob([inputData.url], { type: "text/plain" });
				if (pushUniqueFile(new File([urlBlob], "shared-url.txt", { type: "text/plain" }))) filesAdded++;
			}
			if (inputData.base64Data && typeof inputData.base64Data === "string") try {
				if (pushUniqueFile((await normalizeDataAsset(inputData.base64Data, {
					namePrefix: "shared",
					uriComponent: true
				})).file)) filesAdded++;
			} catch (error) {
				console.warn("[WorkCenter] Failed to decode base64 data:", error);
			}
			const { WorkCenterStateManager: StateManager } = await import("../chunks/WorkCenterState.js");
			StateManager.clearRecognizedData(state);
			StateManager.saveState(state);
			if (filesAdded > 0 || textAdded) {
				state.activeInputTab = "attachments";
				this.deps.onFilesChanged?.();
			}
			let message = "";
			if (filesAdded > 0) message += `${filesAdded} file(s) added to work center`;
			if (textAdded) message += (message ? " and " : "") + "text content added";
			if (message) this.deps.showMessage?.(message);
			if (filesAdded > 0 || textAdded) this.deps.render?.();
		} catch (error) {
			console.error("[WorkCenter] Failed to add share target input:", error);
			this.deps.showMessage?.("Failed to add share target input");
		}
	}
	sendShareTargetResult(resultData) {
		sendMessage({
			type: "share-target-result",
			source: "workcenter",
			destination: "workcenter",
			data: resultData,
			metadata: { priority: "high" }
		}).catch((error) => {
			console.error("[WorkCenter] Failed to send share target result:", error);
		});
	}
	sendShareTargetInput(inputData) {
		sendMessage({
			type: "share-target-input",
			source: "workcenter",
			destination: "workcenter",
			data: inputData,
			metadata: { priority: "high" }
		}).catch((error) => {
			console.error("[WorkCenter] Failed to send share target input:", error);
		});
	}
	async handleCachedContent(state, data) {
		const { cacheKey, context, content } = data;
		if (context === "share-target" && content) {
			console.log("[WorkCenter] Processing cached share-target content:", summarizeForLog(content));
			await this.addShareTargetInput(state, content);
			await this.retrieveCachedFiles(state, cacheKey);
		}
	}
	async handleReceivedContent(state, data) {
		const { content, context } = data;
		if (context === "share-target" && content) {
			console.log("[WorkCenter] Processing received share-target content:", summarizeForLog(content));
			await this.addShareTargetInput(state, content);
		}
	}
	async handleAIResult(state, resultData) {
		const { success, data, error } = resultData;
		if (!success) {
			console.warn("[WorkCenter] AI processing failed:", error);
			this.deps.showMessage?.("AI processing failed: " + (error || "Unknown error"));
			return;
		}
		if (!data) {
			console.warn("[WorkCenter] No data in AI result");
			return;
		}
		console.log("[WorkCenter] Adding AI processing result to work center");
		try {
			const processedEntry = {
				content: typeof data === "string" ? data : JSON.stringify(data, null, 2),
				timestamp: Date.now(),
				action: "AI Processing (Share Target)",
				sourceData: {
					aiResult: data,
					source: "share-target"
				},
				metadata: {
					source: "share-target-ai",
					processingType: "ai",
					resultType: typeof data
				}
			};
			const { WorkCenterStateManager } = await import("../chunks/WorkCenterState.js");
			WorkCenterStateManager.addProcessedStep(state, processedEntry);
			state.lastRawResult = data;
			WorkCenterStateManager.saveState(state);
			this.deps.render?.();
			this.deps.showMessage?.("AI processing result added to work center");
			if (this.deps.render) this.deps.render();
		} catch (error) {
			console.error("[WorkCenter] Failed to add AI result:", error);
			this.deps.showMessage?.("Failed to add AI processing result");
		}
	}
	async retrieveCachedFiles(state, cacheKey) {
		try {
			const files = await fetchCachedShareFiles(cacheKey || "latest");
			if (files.length > 0) {
				const fileFingerprint = (file) => `${String(file.name || "").trim().toLowerCase()}::${Number(file.size || 0)}::${String(file.type || "").trim().toLowerCase()}`;
				const seenFingerprints = new Set((state.files || []).map(fileFingerprint));
				let added = 0;
				for (const file of files) {
					if (!(file instanceof File)) continue;
					const key = fileFingerprint(file);
					if (seenFingerprints.has(key)) continue;
					seenFingerprints.add(key);
					console.log("[WorkCenter] Adding cached file:", file.name);
					state.files.push(file);
					added++;
				}
				if (added > 0) {
					this.deps.onFilesChanged?.();
					this.deps.showMessage?.(`Added ${added} cached file(s) from share-target`);
				}
			}
		} catch (error) {
			console.warn("[WorkCenter] Failed to retrieve cached files:", error);
		}
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterTemplates.ts
var WorkCenterTemplates = class {
	deps;
	/** Cached custom instructions from settings */
	cachedInstructions = [];
	cachedActiveInstructionId = "";
	constructor(dependencies) {
		this.deps = dependencies;
	}
	/** Load custom instructions from app settings */
	async loadInstructions() {
		try {
			const snapshot = await getInstructionRegistry();
			this.cachedInstructions = snapshot.instructions;
			this.cachedActiveInstructionId = snapshot.activeId;
			return this.cachedInstructions;
		} catch (e) {
			console.warn("[WorkCenterTemplates] Failed to load custom instructions:", e);
			return [];
		}
	}
	/** Get cached instructions (sync, call loadInstructions first) */
	getInstructions() {
		return this.cachedInstructions;
	}
	/** Get cached active instruction id from settings */
	getActiveInstructionId() {
		return this.cachedActiveInstructionId;
	}
	/** Get the currently active instruction from settings */
	async getActiveInstruction() {
		if (this.cachedActiveInstructionId) {
			const cached = this.getInstructionById(this.cachedActiveInstructionId);
			if (cached) return cached;
		}
		const snapshot = await getInstructionRegistry();
		this.cachedInstructions = snapshot.instructions;
		this.cachedActiveInstructionId = snapshot.activeId;
		return snapshot.activeInstruction;
	}
	/** Set a specific instruction as active in settings */
	async setActiveInstruction(id) {
		await setActiveInstruction(id);
		this.cachedActiveInstructionId = id || "";
	}
	/** Build a combined prompt with the selected custom instruction */
	buildPromptWithInstruction(basePrompt, instruction) {
		if (!instruction?.instruction) return basePrompt;
		return buildInstructionPrompt(basePrompt, instruction.instruction);
	}
	/** Get a specific instruction by ID */
	getInstructionById(id) {
		return this.cachedInstructions.find((i) => i.id === id);
	}
	/** Resolve selected instruction, fallback to active settings instruction */
	resolveInstruction(selectedId) {
		if (selectedId) {
			const selected = this.getInstructionById(selectedId);
			if (selected) return selected;
		}
		if (!this.cachedActiveInstructionId) return null;
		return this.getInstructionById(this.cachedActiveInstructionId) || null;
	}
	/** Get default instruction templates (for seeding). Dynamic import avoids TDZ when workcenter loads before `com/app` finishes. */
	async getDefaultTemplates() {
		const { DEFAULT_INSTRUCTION_TEMPLATES } = await import("../chunks/templates.js").then((n) => n.n);
		return DEFAULT_INSTRUCTION_TEMPLATES;
	}
	renderInstructionPanel(state) {
		return `
            <div class="instruction-panel">
              <div class="instruction-selector-row wide">
                <label class="instruction-label">
                  <ui-icon icon="clipboard-text" size="16" icon-style="duotone"></ui-icon>
                  <span>Instruction:</span>
                </label>
                <select class="instruction-select" data-action="select-instruction">
                  <option value="">None (default)</option>
                </select>
                <button class="btn btn-icon btn-sm" data-action="refresh-instructions" title="Refresh from Settings">
                  <ui-icon icon="arrows-clockwise" size="14" icon-style="duotone"></ui-icon>
                </button>
              </div>
              <div class="instruction-help">
                Active instruction from Settings is appended to your prompt.
              </div>
            </div>
        `;
	}
	async fillInstructionSelects(root, state) {
		if (!root) return;
		const instructions = await this.loadInstructions();
		const hasStored = Boolean(state.selectedInstruction) && instructions.some((item) => item.id === state.selectedInstruction);
		const selectedId = hasStored ? state.selectedInstruction : this.cachedActiveInstructionId;
		if ((!state.selectedInstruction || !hasStored) && selectedId) state.selectedInstruction = selectedId;
		root.querySelectorAll(".instruction-select").forEach((select) => {
			select.replaceChildren();
			const empty = document.createElement("option");
			empty.value = "";
			empty.textContent = "None (default)";
			select.append(empty);
			for (const item of instructions) {
				const option = document.createElement("option");
				option.value = item.id;
				option.textContent = item.label || item.id;
				option.selected = item.id === selectedId;
				select.append(option);
			}
			select.value = selectedId || "";
		});
	}
	async applyInstruction(state, instructionId) {
		state.selectedInstruction = instructionId;
		await this.setActiveInstruction(instructionId || null);
	}
	showTemplateEditor(state, container) {
		const modal = H`<div class="template-editor-modal">
      <div class="modal-content">
        <div class="modal-header">
            <h3>Prompt Templates</h3>
            <p class="modal-desc">Manage prompt templates used in Work Center. These define what action to perform on the content.</p>
        </div>
        ${this.renderInstructionPanel(state)}
        <div class="template-list">
          ${state.promptTemplates.map((template, index) => H`<div class="template-item" data-index="${index}">
              <div class="template-item-header">
                <input type="text" class="template-name" value="${template.name}" data-index="${index}" placeholder="Template name...">
                <button class="btn small" data-action="use-template" data-index="${index}" title="Use this template">Use</button>
                <button class="btn small btn-danger remove-template" data-index="${index}" title="Remove template">
                  <ui-icon icon="trash" size="14"></ui-icon>
                </button>
              </div>
              <textarea class="template-prompt" data-index="${index}" rows="3" placeholder="Enter prompt template...">${template.prompt}</textarea>
            </div>`)}
        </div>
        <div class="modal-actions">
          <div class="modal-actions-group modal-actions-group-start">
            <button class="btn" data-action="add-template">
              <ui-icon icon="plus" size="14"></ui-icon>
              <span>Add Template</span>
            </button>
            <button class="btn" data-action="import-instructions" title="Import from Custom Instructions (Settings)">
              <ui-icon icon="download" size="14"></ui-icon>
              <span>Import from Settings</span>
            </button>
          </div>
          <div class="modal-actions-group modal-actions-group-end">
            <button class="btn primary" data-action="save-templates">Save</button>
            <button class="btn" data-action="close-editor">Close</button>
          </div>
        </div>
      </div>
    </div>`;
		modal.addEventListener("click", async (e) => {
			const target = e.target;
			const action = target.closest("[data-action]")?.getAttribute("data-action");
			const index = target.closest("[data-index]")?.getAttribute("data-index");
			if (action === "refresh-instructions") await this.fillInstructionSelects(modal, state);
			else if (action === "use-template" && index) {
				const template = state.promptTemplates[Number(index)];
				if (template) {
					this.selectTemplate(state, template.prompt);
					modal.remove();
					this.deps.render?.();
				}
			} else if (action === "add-template") {
				this.addTemplate(state);
				modal.remove();
				this.showTemplateEditor(state, container);
			} else if (action === "save-templates") {
				await this.saveTemplates(state, modal);
				modal.remove();
				this.deps.render?.();
			} else if (action === "close-editor") modal.remove();
			else if (action === "import-instructions") {
				await this.importFromCustomInstructions(state);
				modal.remove();
				this.showTemplateEditor(state, container);
			} else if (target.classList.contains("remove-template") && index) {
				this.removeTemplate(state, parseInt(index));
				modal.remove();
				this.showTemplateEditor(state, container);
			}
		});
		modal.addEventListener("click", (e) => {
			if (e.target === modal) modal.remove();
		});
		container.append(modal);
		const instruction = modal.querySelector(".instruction-select");
		instruction?.addEventListener("change", () => {
			this.applyInstruction(state, instruction.value);
		});
		this.fillInstructionSelects(modal, state);
	}
	addTemplate(state) {
		state.promptTemplates.push({
			name: "New Template",
			prompt: "Enter your prompt here..."
		});
	}
	removeTemplate(state, index) {
		if (index >= 0 && index < state.promptTemplates.length) state.promptTemplates.splice(index, 1);
	}
	async saveTemplates(state, modal) {
		const nameInputs = modal.querySelectorAll(".template-name");
		const promptInputs = modal.querySelectorAll(".template-prompt");
		state.promptTemplates = Array.from(nameInputs).map((input, i) => ({
			name: input.value,
			prompt: promptInputs[i].value
		}));
		const { WorkCenterStateManager } = await import("../chunks/WorkCenterState.js");
		WorkCenterStateManager.savePromptTemplates(state.promptTemplates);
		this.deps.showMessage?.("Templates saved");
	}
	/**
	* Import custom instructions from app settings as prompt templates.
	* Maps each CustomInstruction into the WorkCenter template format.
	*/
	async importFromCustomInstructions(state) {
		try {
			const instructions = await getCustomInstructions();
			if (!instructions.length) {
				this.deps.showMessage?.("No custom instructions found in Settings");
				return;
			}
			const existingNames = new Set(state.promptTemplates.map((t) => t.name));
			let added = 0;
			for (const instr of instructions) if (!existingNames.has(instr.label)) {
				state.promptTemplates.push({
					name: instr.label,
					prompt: instr.instruction
				});
				added++;
			}
			const { WorkCenterStateManager } = await import("../chunks/WorkCenterState.js");
			WorkCenterStateManager.savePromptTemplates(state.promptTemplates);
			if (added > 0) this.deps.showMessage?.(`Imported ${added} instruction${added > 1 ? "s" : ""} as templates`);
			else this.deps.showMessage?.("All instructions already exist as templates");
		} catch (e) {
			console.warn("[WorkCenterTemplates] Failed to import instructions:", e);
			this.deps.showMessage?.("Failed to import instructions");
		}
	}
	selectTemplate(state, prompt) {
		state.selectedTemplate = prompt;
		if (prompt) state.currentPrompt = prompt;
	}
	getTemplateByPrompt(state, prompt) {
		return state.promptTemplates.find((t) => t.prompt === prompt);
	}
	hasTemplate(state, prompt) {
		return state.promptTemplates.some((t) => t.prompt === prompt);
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterVoice.ts
var WorkCenterVoice = class {
	deps;
	voiceTimeout = null;
	constructor(dependencies) {
		this.deps = dependencies;
	}
	async startVoiceRecording(state) {
		if (state.voiceRecording) return;
		state.voiceRecording = true;
		try {
			const prompt = await this.deps.getSpeechPrompt();
			if (prompt) state.currentPrompt = prompt;
		} catch (e) {
			console.warn("Voice recording failed:", e);
			this.deps.showMessage?.("Voice recording failed");
		} finally {
			state.voiceRecording = false;
		}
	}
	stopVoiceRecording(state) {
		state.voiceRecording = false;
		if (this.voiceTimeout) {
			globalThis?.clearTimeout?.(this.voiceTimeout);
			this.voiceTimeout = null;
		}
	}
	isRecording(state) {
		return state.voiceRecording;
	}
	setVoiceTimeout(callback, delay = 3e4) {
		if (this.voiceTimeout) globalThis?.clearTimeout?.(this.voiceTimeout);
		this.voiceTimeout = globalThis?.setTimeout?.(() => {
			callback();
			this.voiceTimeout = null;
		}, delay);
	}
	clearVoiceTimeout() {
		if (this.voiceTimeout) {
			globalThis?.clearTimeout?.(this.voiceTimeout);
			this.voiceTimeout = null;
		}
	}
};
//#endregion
//#region src/shared/service/service/WorkCenterTurnInput.ts
/**
* Pure Responses-input builder for a Work Center turn.
*
* FIND:workcenter-turn-input
* WHY: Keeping this free of settings and fetch code makes direct-file behavior
* testable and lets the provider policy choose a local fallback deterministically.
*/
var attachmentLabel = (attachment) => `\n\n--- Attachment: ${attachment.original.name || attachment.attachmentId} ---\n`;
var encodeBase64 = (bytes) => {
	const BufferCtor = globalThis.Buffer;
	if (BufferCtor) return BufferCtor.from(bytes).toString("base64");
	let binary = "";
	const chunkSize = 32768;
	for (let offset = 0; offset < bytes.length; offset += chunkSize) {
		const chunk = bytes.subarray(offset, offset + chunkSize);
		binary += String.fromCharCode(...chunk);
	}
	return btoa(binary);
};
var fileDataUrl = async (file) => {
	const buffer = await file.arrayBuffer();
	return `data:${file.type || "application/octet-stream"};base64,${encodeBase64(new Uint8Array(buffer))}`;
};
var isDirectDocument = (attachment) => [
	"pdf",
	"docx",
	"xlsx"
].includes(attachment.kind) && !attachment.error && attachment.original.size <= 10485760;
/** INVARIANT: Responses API rejects `input_text` on assistant messages. */
var textTypeForRole = (role) => role === "assistant" ? "output_text" : "input_text";
var fallbackParts = (attachment) => {
	const text = attachment.fallbackText?.trim();
	if (text) return [{
		type: "input_text",
		text: `${attachmentLabel(attachment)}${text}`
	}];
	return [{
		type: "input_text",
		text: `${attachmentLabel(attachment)}[Attachment could not be prepared: ${attachment.error || "no readable text"}]`
	}];
};
/**
* Produces Responses API message content with direct files only for eligible
* document types. All other attachments have a readable local fallback.
*/
var buildWorkCenterTurnInput = async (request, options = {}) => {
	const allowDirectFile = options.allowDirectFile !== false;
	const directFileByteLimit = options.directFileByteLimit ?? 10485760;
	const input = request.messages.map((message) => ({
		type: "message",
		role: message.role,
		content: [{
			type: textTypeForRole(message.role),
			text: message.content
		}]
	}));
	let target = input.at(-1);
	if (!target || target.role !== "user") {
		target = {
			type: "message",
			role: "user",
			content: []
		};
		input.push(target);
	}
	const content = target.content ?? (target.content = []);
	let usedDirectFile = false;
	for (const attachment of request.attachments) {
		if (attachment.kind === "image" && !attachment.error) {
			content.push({
				type: "input_image",
				detail: "auto",
				image_url: await fileDataUrl(attachment.original)
			});
			continue;
		}
		if (allowDirectFile && isDirectDocument(attachment) && attachment.original.size <= directFileByteLimit) {
			content.push({
				type: "input_file",
				filename: attachment.original.name || "attachment",
				file_data: await fileDataUrl(attachment.original)
			});
			usedDirectFile = true;
			continue;
		}
		content.push(...fallbackParts(attachment));
		for (const image of attachment.images || []) content.push({
			type: "input_image",
			detail: "auto",
			image_url: await fileDataUrl(image)
		});
	}
	return {
		input,
		usedDirectFile
	};
};
var isFileCapabilityRejection = (error) => /(?:input_file|file_data|unsupported\s+(?:file|input)|file\s+(?:input|type).*(?:unsupported|invalid))/i.test(String(error || ""));
//#endregion
//#region src/shared/service/service/WorkCenterTurnPolicy.ts
var cancelledResult = () => ({
	ok: false,
	error: "Cancelled"
});
/** Stateful provider policy with a one-way direct-file incompatibility cache. */
var WorkCenterTurnService = class {
	directFileUnsupported = false;
	async run(request, execute) {
		if (request.signal?.aborted) return cancelledResult();
		const requestOptions = {
			...request.options,
			instruction: request.instruction,
			signal: request.signal
		};
		const direct = await buildWorkCenterTurnInput(request, { allowDirectFile: !this.directFileUnsupported });
		if (request.signal?.aborted) return cancelledResult();
		const result = await execute(direct.input, requestOptions, { usedDirectFile: direct.usedDirectFile });
		if (result.ok || !direct.usedDirectFile || request.signal?.aborted || !isFileCapabilityRejection(result.error)) return request.signal?.aborted ? cancelledResult() : result;
		this.directFileUnsupported = true;
		const fallback = await buildWorkCenterTurnInput(request, { allowDirectFile: false });
		if (request.signal?.aborted) return cancelledResult();
		return execute(fallback.input, requestOptions, { usedDirectFile: false });
	}
};
//#endregion
//#region src/shared/service/service/WorkCenterTurn.ts
/**
* Public Work Center turn entry point.
*
* FIND:workcenter-turn
* WHY: Keep provider execution separate from the pure request builder so UI
* contracts can be verified without loading application settings or workers.
* INVARIANT: Process PWA posts to /api/process on process.u2re.space / ai.u2re.space first.
*/
var flattenResponsesInput = (input) => {
	const texts = [];
	for (const item of input) {
		if (typeof item === "string") {
			texts.push(item);
			continue;
		}
		const content = item?.content;
		if (typeof content === "string") texts.push(content);
		if (!Array.isArray(content)) continue;
		for (const part of content) if (typeof part === "string") texts.push(part);
		else if (part && typeof part === "object" && typeof part.text === "string") texts.push(part.text);
	}
	return texts.join("\n\n").trim();
};
var hasVisualInput = (input) => {
	for (const item of input) {
		const content = item?.content;
		if (!Array.isArray(content)) continue;
		for (const part of content) {
			const type = String(part?.type || "");
			if (type === "input_image" || type === "input_file" || type === "image_url" || type === "image") return true;
		}
	}
	return false;
};
var processApiTurnSignal = (signal) => {
	const timed = typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(12e3) : void 0;
	if (timed && signal && typeof AbortSignal.any === "function") return AbortSignal.any([signal, timed]);
	return timed || signal;
};
var tryProcessApiTurn = async (input, options) => {
	if (hasVisualInput(input)) return null;
	const text = flattenResponsesInput(input);
	if (!text) return null;
	const settings = await loadSettings().catch(() => null);
	const auth = processApiAuthFromSettings(settings);
	const posted = await postProcessApi("processing", {
		input: text,
		text,
		mode: "smartRecognize",
		customInstruction: options.instruction || options.customInstruction || void 0
	}, auth, { signal: processApiTurnSignal(options.signal) });
	if (isProcessApiUnavailable(posted) || !posted.json) return null;
	const json = posted.json;
	if (json.ok === false) {
		const error = String(json.error || "");
		if (/missing credentials|invalid credentials/i.test(error)) return null;
		return {
			ok: false,
			error: error || "Process API failed"
		};
	}
	const data = readProcessApiResultText(json);
	if (!data) return null;
	return {
		ok: true,
		data
	};
};
var defaultExecutor = async (input, options) => {
	const remote = await tryProcessApiTurn(input, options).catch(() => null);
	if (remote) return remote;
	return processDataWithInstruction(input, options);
};
var defaultService = new WorkCenterTurnService();
/** Execute one turn using the app's shared direct-file capability cache. */
var runWorkCenterTurn = (request) => defaultService.run(request, defaultExecutor);
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterActions.ts
var WorkCenterActions = class {
	deps;
	ui;
	fileOps;
	dataProcessing;
	results;
	history;
	templates;
	conversation;
	activeTurns = /* @__PURE__ */ new Map();
	constructor(dependencies, ui, fileOps, dataProcessing, results, history, templates, conversation) {
		this.deps = dependencies;
		this.ui = ui;
		this.fileOps = fileOps;
		this.dataProcessing = dataProcessing;
		this.results = results;
		this.history = history;
		this.templates = templates;
		this.conversation = conversation;
	}
	async executeUnifiedAction(state) {
		if (this.conversation) {
			await this.executeConversationTurn(state);
			return;
		}
		if (this.fileOps.getFilesForProcessing(state).length === 0 && !state.currentPrompt.trim() && !state.recognizedData) {
			this.deps.showMessage("Please select files or enter a prompt first");
			return;
		}
		let processingMessage = "Processing...";
		if (state.recognizedData) processingMessage = `Processing ${state.recognizedData.source} content...`;
		else if (this.fileOps.hasFiles(state)) processingMessage = `Processing ${state.files.length} file${state.files.length > 1 ? "s" : ""}...`;
		this.results.showProcessingMessage(processingMessage);
		try {
			let basePrompt = state.currentPrompt.trim() || (state.autoAction ? this.getLastSuccessfulPrompt() : "Analyze and process the provided content intelligently");
			if (this.templates) {
				let instruction = this.templates.resolveInstruction(state.selectedInstruction);
				if (!instruction && !state.selectedInstruction) instruction = await this.templates.getActiveInstruction();
				if (instruction?.instruction) {
					if (!state.selectedInstruction) state.selectedInstruction = instruction.id;
					basePrompt = this.templates.buildPromptWithInstruction(basePrompt, instruction);
				}
			}
			const actionInput = {
				type: state.recognizedData ? "text" : this.fileOps.hasFiles(state) ? "files" : "text",
				files: this.fileOps.hasFiles(state) ? [...state.files] : void 0,
				text: basePrompt,
				recognizedData: state.recognizedData || void 0,
				recognizedContent: state.recognizedData?.content || void 0
			};
			if (state.selectedTemplate && state.selectedTemplate.includes("Translate the following content to the selected language") && state.selectedLanguage !== "auto") {
				const targetLanguage = state.selectedLanguage === "ru" ? "Russian" : "English";
				actionInput.text = `Translate the following content to ${targetLanguage}. Maintain the original formatting and structure where possible. If the content is already in ${targetLanguage}, provide a natural rephrasing or improvement instead.`;
			} else if (state.selectedLanguage !== "auto") actionInput.text = `${state.selectedLanguage === "ru" ? "Please respond in Russian language." : "Please respond in English language."} ${actionInput.text}`;
			const context = {
				source: "workcenter",
				sessionId: this.generateSessionId()
			};
			let forceAction;
			if (state.currentPrompt.trim() && state.currentPrompt.trim() !== "Analyze and process the provided content intelligently") forceAction = void 0;
			else if (state.recognizedData) forceAction = "analyze";
			else if (this.fileOps.hasFiles(state)) {
				if (this.fileOps.hasTextFiles(state)) forceAction = "source";
				else forceAction = "recognize";
			} else forceAction = "analyze";
			const result = await executionCore.execute(actionInput, context, {
				forceAction,
				recognitionFormat: state.recognitionFormat,
				processingFormat: state.processingFormat
			});
			const { WorkCenterStateManager } = await import("../chunks/WorkCenterState.js");
			WorkCenterStateManager.saveState(state);
			state.lastRawResult = result.rawData;
			const formattedResult = this.dataProcessing.formatResult(result.rawData || result, state.outputFormat);
			const outputContent = this.ui.getContainer()?.querySelector("[data-output]");
			if (outputContent) {
				outputContent.innerHTML = `<div class="result-content">${formattedResult}</div>`;
				highlightCodeTree(outputContent);
			}
			if (this.fileOps.hasFiles(state) && result.rawData?.ok && !state.recognizedData) {
				const isTextFile = this.fileOps.hasTextFiles(state);
				state.recognizedData = {
					content: result.content,
					timestamp: Date.now(),
					source: isTextFile ? "text" : "files",
					recognizedAs: this.fileOps.determineRecognizedFormat(state),
					metadata: { fileCount: state.files.length },
					responseId: result.responseId || "unknown"
				};
				this.results.updateDataPipeline(state);
				this.ui.updateDataCounters(state);
				if (state.selectedTemplate && state.selectedTemplate.trim()) {
					console.log("[WorkCenter] Auto-processing with template:", state.selectedTemplate);
					setTimeout(async () => {
						await this.executeUnifiedAction(state);
					}, 100);
				}
			} else if (state.recognizedData && result.rawData?.ok) {
				const processedEntry = {
					content: result.content,
					timestamp: Date.now(),
					action: state.currentPrompt.trim() || "additional processing",
					sourceData: state.recognizedData,
					metadata: { step: state.currentProcessingStep + 1 }
				};
				const { WorkCenterStateManager: StateManager } = await import("../chunks/WorkCenterState.js");
				StateManager.addProcessedStep(state, processedEntry);
			}
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : String(error);
			this.results.showError(errorMsg);
		}
		this.history.updateRecentHistory(state);
		this.ui.updateDataPipeline(state);
		this.ui.updateDataCounters(state);
	}
	async persistDraft(state) {
		const conversation = this.conversation;
		if (!conversation) return;
		state.currentPrompt = state.draft.content;
		conversation.session.setDraft(state.draft);
		await conversation.session.persistDraft();
	}
	requestOptions(state) {
		return {
			outputFormat: state.outputFormat,
			language: state.selectedLanguage,
			recognitionFormat: state.recognitionFormat,
			processingFormat: state.processingFormat
		};
	}
	async conversationInstruction(state) {
		const base = state.selectedTemplate.trim() || "Answer the newest user message using its attached content as context.";
		let instruction = this.templates.resolveInstruction(state.selectedInstruction);
		if (!instruction && !state.selectedInstruction) instruction = await this.templates.getActiveInstruction();
		return this.templates.buildPromptWithInstruction(base, instruction);
	}
	syncConversationState(state) {
		const conversation = this.conversation;
		if (!conversation) return;
		const snapshot = conversation.session.snapshot();
		state.messages = snapshot.messages;
		state.draft = snapshot.draft;
		state.currentPrompt = snapshot.draft.content;
		state.sessionEpoch = snapshot.epoch;
		conversation.syncFromSession();
	}
	async executeConversationTurn(state) {
		const conversation = this.conversation;
		if (!conversation) return;
		try {
			if (this.activeTurns.size > 0) {
				this.deps.showMessage("Wait for the current response before sending another message");
				return;
			}
			if (!state.draft.content.trim() && state.draft.attachments.length === 0) {
				this.deps.showMessage("Enter a prompt or attach a file first");
				return;
			}
			conversation.session.setDraft(state.draft);
			const submitted = conversation.session.commitDraft(this.requestOptions(state));
			state.files = [];
			this.syncConversationState(state);
			conversation.session.persistDraft().catch(() => {
				this.deps.showMessage("Unable to save this chat locally");
			});
			const controller = new AbortController();
			this.activeTurns.set(submitted.assistant.id, controller);
			await this.runConversationTurn(state, submitted.user, submitted.assistant, controller);
		} catch (error) {
			this.deps.showMessage(error instanceof Error ? error.message : "Unable to send the message");
		}
	}
	async retryConversationTurn(state, assistantId) {
		const conversation = this.conversation;
		if (!conversation || this.activeTurns.size > 0) return;
		try {
			const retry = await conversation.session.retry(assistantId);
			this.syncConversationState(state);
			const controller = new AbortController();
			this.activeTurns.set(retry.assistant.id, controller);
			await this.runConversationTurn(state, retry.user, retry.assistant, controller);
		} catch (error) {
			this.deps.showMessage(error instanceof Error ? error.message : "Unable to retry this message");
		}
	}
	async cancelConversationTurn(state, assistantId) {
		const conversation = this.conversation;
		if (!conversation) return;
		this.activeTurns.get(assistantId)?.abort();
		this.activeTurns.delete(assistantId);
		await conversation.session.cancel(assistantId);
		this.syncConversationState(state);
	}
	async startNewConversation(state) {
		const conversation = this.conversation;
		if (!conversation) return;
		for (const controller of this.activeTurns.values()) controller.abort();
		this.activeTurns.clear();
		conversation.attachments.revokeAllPreviews();
		await conversation.session.newChat();
		state.files = [];
		this.syncConversationState(state);
	}
	async runConversationTurn(state, user, assistant, controller) {
		const conversation = this.conversation;
		if (!conversation) return;
		const epoch = conversation.session.epoch();
		try {
			const prepared = [];
			for (const ref of user.attachments) {
				const file = await conversation.attachments.resolve(ref);
				if (!file) {
					await conversation.session.markAttachmentError(user.id, ref.hash, "Attachment data is unavailable");
					prepared.push({
						attachmentId: ref.hash,
						original: new File([], ref.name, { type: ref.type }),
						kind: "unknown",
						images: [],
						error: "Attachment data is unavailable"
					});
					continue;
				}
				const preparedAttachment = await conversation.documentPreparer.prepare(file);
				if (preparedAttachment.error) await conversation.session.markAttachmentError(user.id, ref.hash, preparedAttachment.error);
				prepared.push({
					attachmentId: ref.hash,
					...preparedAttachment
				});
			}
			const result = await runWorkCenterTurn({
				messages: conversation.session.snapshot().messages.filter((message) => message.status === "complete").map((message) => ({
					role: message.role,
					content: message.content
				})),
				attachments: prepared,
				instruction: await this.conversationInstruction(state),
				options: {
					outputFormat: state.processingFormat,
					outputLanguage: state.selectedLanguage,
					processingEffort: "medium",
					processingVerbosity: "medium"
				},
				signal: controller.signal
			});
			if (epoch !== conversation.session.epoch()) return;
			if (controller.signal.aborted || result.error === "Cancelled") conversation.session.applyAssistantCompletion(assistant.id, {
				status: "cancelled",
				content: "",
				error: "Cancelled"
			});
			else if (result.ok) {
				const content = this.extractTurnText(result);
				conversation.session.applyAssistantCompletion(assistant.id, {
					status: "complete",
					content,
					rawResult: result
				});
				state.lastRawResult = result;
				state.recognizedData = {
					content,
					timestamp: Date.now(),
					source: user.attachments.length ? "files" : "text",
					recognizedAs: "markdown",
					responseId: result.responseId || void 0
				};
			} else conversation.session.applyAssistantCompletion(assistant.id, {
				status: "failed",
				content: "",
				error: result.error || "The request did not return a response"
			});
			this.syncConversationState(state);
			conversation.session.persistDraft().catch(() => void 0);
		} catch (error) {
			if (epoch === conversation.session.epoch()) {
				conversation.session.applyAssistantCompletion(assistant.id, {
					status: controller.signal.aborted ? "cancelled" : "failed",
					content: "",
					error: controller.signal.aborted ? "Cancelled" : error instanceof Error ? error.message : "Failed to process message"
				});
				this.syncConversationState(state);
				conversation.session.persistDraft().catch(() => void 0);
			}
		} finally {
			if (this.activeTurns.get(assistant.id) === controller) this.activeTurns.delete(assistant.id);
			this.syncConversationState(state);
			this.history.updateRecentHistory(state);
			this.ui.updateDataPipeline(state);
		}
	}
	extractTurnText(result) {
		if (result == null) return "";
		if (typeof result === "string") return readProcessApiResultText(result);
		const row = result;
		if (typeof row.data === "string" && row.data.trim()) return row.data.trim();
		return readProcessApiResultText(result) || readProcessApiResultText(row.raw) || "";
	}
	getLastSuccessfulPrompt() {
		return this.history.getLastSuccessfulPrompt();
	}
	generateSessionId() {
		return `wc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
	async copyResults(state) {
		if (!state.lastRawResult) return;
		try {
			await this.dataProcessing.copyResultsToClipboard(state.lastRawResult, state.outputFormat);
			this.deps.showMessage("Results copied to clipboard");
		} catch (error) {
			console.error("Failed to copy results:", error);
			this.deps.showMessage("Failed to copy results");
		}
	}
	async copyConversationTurn(state, turnId) {
		const message = state.messages.find((candidate) => candidate.id === turnId && candidate.role === "assistant");
		if (!message) return;
		try {
			await this.dataProcessing.copyResultsToClipboard(message.rawResult ?? { content: message.content }, state.outputFormat);
			this.deps.showMessage("Response copied to clipboard");
		} catch {
			this.deps.showMessage("Failed to copy response");
		}
	}
	async viewResultsInViewer(state) {
		if (!state.lastRawResult) {
			this.deps.showMessage("No results to view");
			return;
		}
		try {
			const { unifiedMessaging } = await import("../chunks/UnifiedMessaging.js").then((n) => n.t);
			let resultContent = typeof state.lastRawResult === "string" ? state.lastRawResult : JSON.stringify(state.lastRawResult, null, 2);
			try {
				resultContent = JSON.parse(resultContent)?.data || resultContent;
			} catch (error) {}
			const filename = `workcenter-output-${Date.now()}.${state.outputFormat === "markdown" ? "md" : state.outputFormat === "json" ? "json" : state.outputFormat === "html" ? "html" : state.outputFormat === "code" ? "ts" : "txt"}`;
			if (shouldHandoffViewToSibling("viewer")) {
				stashSkuHandoff({
					dest: "viewer",
					content: String(resultContent || ""),
					filename
				});
				await this.navigateToViewer();
				return;
			}
			await unifiedMessaging.sendMessage({
				id: crypto.randomUUID(),
				type: "content-view",
				source: "workcenter",
				destination: "viewer",
				contentType: state.outputFormat === "markdown" ? "markdown" : "text",
				data: {
					text: resultContent,
					filename
				},
				metadata: {
					title: "Work Center Output",
					timestamp: Date.now(),
					source: "workcenter",
					format: state.outputFormat
				}
			});
			await this.navigateToViewer();
		} catch (error) {
			console.error("Failed to open output in viewer:", error);
			this.deps.showMessage("Failed to open output in viewer");
		}
	}
	async navigateToViewer() {
		if (this.deps.navigate) {
			await this.deps.navigate("viewer");
			return;
		}
		if (this.deps?.state) {
			this.deps.state.view = "markdown-viewer";
			this.deps.render?.();
		}
	}
	clearResults(state) {
		state.lastRawResult = null;
		this.results.clearResults();
	}
	async saveResultsToExplorer(state) {
		if (!state.lastRawResult) {
			this.deps.showMessage("No results to save");
			return;
		}
		try {
			const { unifiedMessaging } = await import("../chunks/UnifiedMessaging.js").then((n) => n.t);
			const resultContent = typeof state.lastRawResult === "string" ? state.lastRawResult : JSON.stringify(state.lastRawResult, null, 2);
			await unifiedMessaging.sendMessage({
				id: crypto.randomUUID(),
				type: "content-save",
				source: "workcenter",
				destination: "explorer",
				data: {
					action: "save",
					text: resultContent,
					filename: `workcenter-result-${Date.now()}.${state.outputFormat === "json" ? "json" : state.outputFormat === "html" ? "html" : state.outputFormat === "code" ? "ts" : "txt"}`,
					path: "/workcenter-results/"
				},
				metadata: {
					title: "Work Center Result",
					timestamp: Date.now(),
					source: "workcenter",
					format: state.outputFormat
				}
			});
			this.deps.showMessage("Results saved to Explorer");
		} catch (error) {
			console.error("Failed to save results to explorer:", error);
			this.deps.showMessage("Failed to save results to Explorer");
		}
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterDataProcessing.ts
var WorkCenterDataProcessing = class {
	formatResult(result, format, outputFormat) {
		if (format === "auto") {
			const rawData = result?.rawData || result;
			let data = extractJSONFromAIResponse(rawData)?.data || rawData;
			if (typeof data === "string") try {
				const parsed = JSON.parse(data);
				if (parsed && typeof parsed === "object") data = parsed;
			} catch {}
			if (data && typeof data === "object" && (data.recognized_data || data.verbose_data || data.keywords_and_tags || data.suggested_type)) {
				const content = [];
				if (data.recognized_data) {
					const recognized = Array.isArray(data.recognized_data) ? data.recognized_data : [data.recognized_data];
					content.push(...recognized.map((item) => String(item)));
				}
				if (data.verbose_data) content.push(String(data.verbose_data));
				if (data.keywords_and_tags && Array.isArray(data.keywords_and_tags) && data.keywords_and_tags.length > 0) content.push(`\n**Keywords:** ${data.keywords_and_tags.join(", ")}`);
				if (data.confidence || data.suggested_type) {
					const info = [];
					if (data.confidence) info.push(`Confidence: ${Math.round(data.confidence * 100)}%`);
					if (data.suggested_type) info.push(`Type: ${data.suggested_type}`);
					if (info.length > 0) content.push(`\n*${info.join(" • ")}*`);
				}
				if (content.length > 0) return `<div class="markdown-result structured-content">${content.join("\n\n")}</div>`;
			}
			if (data && typeof data === "object") return this.formatResult(result, "json");
			return this.formatResult(result, "markdown");
		}
		if (format === "json") {
			const rawData = result?.rawData || result;
			let data = extractJSONFromAIResponse(rawData)?.data || rawData;
			if (typeof data === "string") try {
				const parsed = JSON.parse(data);
				if (parsed && typeof parsed === "object") data = parsed;
			} catch {}
			return this.renderAsJSON(data);
		}
		if (format === "markdown") {
			const rawData = result?.rawData || result;
			let data = extractJSONFromAIResponse(rawData)?.data || rawData;
			if (typeof data === "string") try {
				const parsed = JSON.parse(data);
				if (parsed && typeof parsed === "object") data = parsed;
			} catch {}
			if (data && typeof data === "object" && (data.recognized_data || data.verbose_data || data.keywords_and_tags || data.suggested_type)) {
				const content = [];
				if (data.recognized_data) {
					const recognized = Array.isArray(data.recognized_data) ? data.recognized_data : [data.recognized_data];
					content.push(...recognized.map((item) => String(item)));
				}
				if (data.verbose_data) content.push(String(data.verbose_data));
				if (data.keywords_and_tags && Array.isArray(data.keywords_and_tags) && data.keywords_and_tags.length > 0) content.push(`\n**Keywords:** ${data.keywords_and_tags.join(", ")}`);
				if (data.confidence || data.suggested_type) {
					const info = [];
					if (data.confidence) info.push(`Confidence: ${Math.round(data.confidence * 100)}%`);
					if (data.suggested_type) info.push(`Type: ${data.suggested_type}`);
					if (info.length > 0) content.push(`\n*${info.join(" • ")}*`);
				}
				if (content.length > 0) return `<div class="markdown-result structured-content">${content.join("\n\n")}</div>`;
			}
		}
		const normalizedData = this.normalizeResultData(result);
		if (!normalizedData) return "<div class=\"no-result\">No result</div>";
		switch (format) {
			case "code": return this.renderAsCode(normalizedData);
			case "raw": return this.renderAsRaw(result?.rawData || result);
			case "html": return this.renderAsHTML(normalizedData);
			case "text": return this.renderAsText(normalizedData);
			default: return this.renderAsMarkdown(normalizedData);
		}
	}
	normalizeResultData(result) {
		if (!result) return null;
		let data = extractJSONFromAIResponse(result)?.data || result;
		if (data && typeof data === "object") {
			if (data.data !== void 0) data = data.data;
			if (typeof data === "string") try {
				const parsed = JSON.parse(data);
				if (parsed && typeof parsed === "object") data = parsed;
			} catch {}
		}
		if (typeof data !== "object" || data === null) data = { recognized_data: [String(data)] };
		return data;
	}
	renderAsJSON(data) {
		try {
			const createFormattedJSON = (obj, indent = 0) => {
				const spaces = "  ".repeat(indent);
				if (obj === null) return "null";
				if (typeof obj === "boolean") return obj ? "true" : "false";
				if (typeof obj === "number") return String(obj);
				if (typeof obj === "string") {
					if (obj.includes("<math") || obj.includes("class=\"katex\"") || obj.includes("<span>")) {
						const placeholder = `__HTML_CONTENT_${Math.random().toString(36).substr(2, 9)}__`;
						htmlPlaceholders[placeholder] = obj;
						return `"${placeholder}"`;
					}
					return JSON.stringify(obj);
				}
				if (Array.isArray(obj)) {
					if (obj.length === 0) return "[]";
					const items = obj.map((item) => createFormattedJSON(item, indent + 1));
					return `[\n${"  ".repeat(indent + 1)}${items.join(`,\n${"  ".repeat(indent + 1)}`)}\n${spaces}]`;
				}
				if (typeof obj === "object") {
					const keys = Object.keys(obj);
					if (keys.length === 0) return "{}";
					const items = keys.map((key) => {
						const formattedValue = createFormattedJSON(obj[key], indent + 1);
						return `${JSON.stringify(key)}: ${formattedValue}`;
					});
					return `{\n${"  ".repeat(indent + 1)}${items.join(`,\n${"  ".repeat(indent + 1)}`)}\n${spaces}}`;
				}
				return String(obj);
			};
			const htmlPlaceholders = {};
			let finalHTML = `<div class="json-result"><pre>${createFormattedJSON(data)}</pre></div>`;
			for (const [placeholder, htmlContent] of Object.entries(htmlPlaceholders)) {
				const tempDiv = document.createElement("div");
				tempDiv.innerHTML = htmlContent;
				const renderedHTML = tempDiv.innerHTML;
				finalHTML = finalHTML.replace(`"${placeholder}"`, `<span class="json-html-content">${renderedHTML}</span>`);
			}
			return finalHTML;
		} catch (error) {
			return `<div class="error">Failed to format JSON: ${error}</div>`;
		}
	}
	renderAsHTML(data) {
		const renderedContent = this.extractContentItems(data).map((item) => this.renderContentItem(item, "html")).join("");
		if (!renderedContent) return `<div class="html-result">${this.renderMathAsHTML(this.extractTextContent(data))}</div>`;
		return `<div class="html-result">${renderedContent}</div>`;
	}
	renderAsText(data) {
		const renderedContent = this.extractContentItems(data).map((item) => this.renderContentItem(item, "text")).join("\n\n");
		if (!renderedContent.trim()) return `<pre class="text-result">${this.escapeHtml(this.extractTextContent(data))}</pre>`;
		return `<pre class="text-result">${this.escapeHtml(renderedContent)}</pre>`;
	}
	renderAsRaw(data) {
		let rawText = "";
		if (typeof data === "string") rawText = data;
		else try {
			rawText = JSON.stringify(data, null, 2);
		} catch {
			rawText = String(data ?? "");
		}
		return `<pre class="raw-result">${this.escapeHtml(rawText)}</pre>`;
	}
	renderAsCode(data) {
		const content = this.extractContentItems(data).join("\n\n").trim() || this.extractTextContent(data);
		const code = this.extractLikelyCode(content);
		const language = this.detectCodeLanguage(content);
		return `<pre class="code-result" data-language="${this.escapeHtml(language)}"><code data-language="${this.escapeHtml(language)}" data-lang="${this.escapeHtml(language)}" class="language-${this.escapeHtml(language)}">${this.escapeHtml(code)}</code></pre>`;
	}
	renderAsMarkdown(data) {
		const renderedContent = this.extractContentItems(data).map((item) => this.renderContentItem(item, "markdown")).join("\n\n");
		if (!renderedContent.trim()) try {
			const textContent = this.extractTextContent(data);
			return renderSafeMarkdown(textContent);
		} catch (error) {
			console.warn("Markdown parsing failed, falling back to simple rendering:", error);
			return this.renderMathAsHTML(renderedContent);
		}
		try {
			return renderSafeMarkdown(renderedContent);
		} catch (error) {
			console.warn("Markdown parsing failed, falling back to simple rendering:", error);
			return this.renderMathAsHTML(renderedContent);
		}
	}
	extractContentItems(data) {
		const items = [];
		if (data.recognized_data) {
			const recognized = Array.isArray(data.recognized_data) ? data.recognized_data : [data.recognized_data];
			items.push(...recognized.map((item) => String(item)));
		}
		if (data.verbose_data) items.push(String(data.verbose_data));
		if (items.length === 0) {
			for (const field of [
				"content",
				"text",
				"message",
				"result",
				"response",
				"description"
			]) if (data[field]) {
				const content = Array.isArray(data[field]) ? data[field] : [data[field]];
				items.push(...content.map((item) => String(item)));
				break;
			}
		}
		if (items.length === 0) {
			const textContent = this.extractTextContent(data);
			if (textContent) items.push(textContent);
		}
		return items;
	}
	renderContentItem(item, format) {
		switch (format) {
			case "html": return `<div class="recognized-item">${this.renderMathAsHTML(item)}</div>`;
			case "text": return this.stripMarkdown(item);
			case "markdown": return item;
			default: return item;
		}
	}
	renderMathAsHTML(content) {
		let result = content;
		result = result.replace(/\$\$([^$]+)\$\$/g, (match, math) => {
			try {
				return f.parse(`$$${math}$$`).replace(/<p>|<\/p>/g, "").trim();
			} catch {
				return `<span class="math-display">${this.escapeHtml(`$$${math}$$`)}</span>`;
			}
		});
		result = result.replace(/\$([^$]+)\$/g, (match, math) => {
			try {
				return f.parse(`$${math}$`).replace(/<p>|<\/p>/g, "").trim();
			} catch {
				return `<span class="math-inline">${this.escapeHtml(`$${math}$`)}</span>`;
			}
		});
		result = result.replace(/\n/g, "<br>");
		return result;
	}
	stripMarkdown(content) {
		return content.replace(/#{1,6}\s*/g, "").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/`(.*?)`/g, "$1").replace(/^\s*[-*+]\s+/gm, "").replace(/^\s*\d+\.\s+/gm, "").replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1").replace(/!\[([^\]]+)\]\([^\)]+\)/g, "$1").trim();
	}
	extractLikelyCode(content) {
		const fenced = content.match(/```[\t ]*([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/);
		if (fenced?.[2]) return fenced[2].trim();
		return content;
	}
	detectCodeLanguage(content) {
		const fencedLanguage = content.match(/```[\t ]*([a-zA-Z0-9_-]+)?\n/)?.[1];
		if (fencedLanguage) return fencedLanguage.toLowerCase();
		if (/\b(interface|type|const|let|=>|import\s+type)\b/.test(content)) return "typescript";
		if (/\b(function|const|let|var|import|export)\b/.test(content)) return "javascript";
		if (/\b(def |import |from |class )/.test(content)) return "python";
		if (/\b<[^>]+>/.test(content)) return "html";
		return "text";
	}
	extractTextContent(data) {
		if (data == null) return "";
		if (typeof data === "string") return data;
		if (typeof data === "number" || typeof data === "boolean") return String(data);
		if (Array.isArray(data)) return data.map((item) => this.extractTextContent(item)).join("\n");
		if (typeof data === "object") {
			for (const field of [
				"verbose_data",
				"recognized_data",
				"content",
				"text",
				"message",
				"result",
				"response",
				"data"
			]) if (data[field] != null) {
				const content = this.extractTextContent(data[field]);
				if (content) return content;
			}
			try {
				return JSON.stringify(data, null, 2);
			} catch {
				return "[Complex Object]";
			}
		}
		return String(data);
	}
	escapeHtml(text) {
		const div = document.createElement("div");
		div.textContent = text;
		return div.innerHTML;
	}
	copyResultsToClipboard(result, format) {
		let textToCopy = "";
		if (format === "auto" && result) {
			const rawData = result?.rawData || result;
			let data = extractJSONFromAIResponse(rawData)?.data || rawData;
			if (typeof data === "string") try {
				const parsed = JSON.parse(data);
				if (parsed && typeof parsed === "object") data = parsed;
			} catch {}
			if (data && typeof data === "object" && (data.recognized_data || data.verbose_data)) {
				const contentItems = [];
				if (data.recognized_data) {
					const recognized = Array.isArray(data.recognized_data) ? data.recognized_data : [data.recognized_data];
					contentItems.push(...recognized.map((item) => String(item)));
				}
				if (data.verbose_data) contentItems.push(String(data.verbose_data));
				textToCopy = contentItems.join("\n\n");
			} else {
				const normalizedData = this.normalizeResultData(result);
				textToCopy = this.extractContentItems(normalizedData).join("\n\n");
			}
		} else if ((format === "markdown" || format === "html") && result) {
			const normalizedData = this.normalizeResultData(result);
			textToCopy = this.extractContentItems(normalizedData).join("\n\n");
		} else if (format === "json" && result) {
			const normalizedData = this.normalizeResultData(result);
			textToCopy = this.extractContentItems(normalizedData).join("\n\n");
		} else if ((format === "raw" || format === "code") && result) {
			const rawData = result?.rawData || result;
			textToCopy = typeof rawData === "string" ? rawData : JSON.stringify(rawData, null, 2);
		} else textToCopy = result?.textContent || "";
		return writeText(textToCopy).then((result) => {
			if (!result.ok) throw new Error(result.error || "Clipboard write failed");
		});
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterAttachmentViewer.ts
var TEXT_TYPES = /* @__PURE__ */ new Set([
	"application/json",
	"application/xml",
	"application/javascript",
	"application/typescript",
	"application/x-javascript",
	"text/uri-list",
	"text/markdown"
]);
var isTextAttachment = (file, type) => {
	if (type.startsWith("text/")) return true;
	if (TEXT_TYPES.has(type)) return true;
	return /\.(txt|md|json|csv|xml|svg|ts|js|mjs|css|scss|html|yml|yaml)$/i.test(file.name);
};
var closeExistingViewer = (host) => {
	host.querySelector("[data-workcenter-attachment-viewer]")?.remove();
};
/** Download the stored blob, or open a remote URL when there is no local file. */
var downloadWorkCenterAttachment = (options) => {
	const href = options.objectUrl || options.remoteUrl;
	if (!href) return;
	const link = document.createElement("a");
	link.href = href;
	if (options.objectUrl) link.download = options.name;
	else link.target = "_blank";
	link.rel = "noreferrer";
	link.click();
};
/** Show the attachment in a modal, a new tab, or as readable text. */
var openWorkCenterAttachment = async (options) => {
	const { host, attachment, file, objectUrl } = options;
	if (attachment.url) {
		window.open(attachment.url, "_blank", "noopener,noreferrer");
		return;
	}
	if (!file && !objectUrl) return;
	closeExistingViewer(host);
	const type = (file?.type || attachment.type || "").toLowerCase();
	const dialog = document.createElement("dialog");
	dialog.className = "wc-attachment-viewer";
	dialog.dataset.workcenterAttachmentViewer = "";
	dialog.setAttribute("aria-label", attachment.name);
	const header = document.createElement("header");
	header.className = "wc-attachment-viewer__header";
	const title = document.createElement("h3");
	title.textContent = attachment.name;
	const close = document.createElement("button");
	close.type = "button";
	close.className = "wc-icon-button";
	close.setAttribute("aria-label", "Close attachment");
	close.dataset.action = "close-attachment-viewer";
	close.textContent = "×";
	header.append(title, close);
	dialog.append(header);
	const body = document.createElement("div");
	body.className = "wc-attachment-viewer__body";
	if (type.startsWith("image/") && objectUrl) {
		const image = document.createElement("img");
		image.className = "wc-attachment-viewer__frame";
		image.src = objectUrl;
		image.alt = attachment.name;
		body.append(image);
	} else if (file && isTextAttachment(file, type)) {
		const pre = document.createElement("pre");
		pre.className = "wc-attachment-viewer__text";
		pre.textContent = await file.text();
		body.append(pre);
	} else if (objectUrl) {
		const frame = document.createElement("iframe");
		frame.className = "wc-attachment-viewer__frame";
		frame.src = objectUrl;
		frame.title = attachment.name;
		body.append(frame);
	}
	dialog.append(body);
	dialog.addEventListener("close", () => dialog.remove());
	dialog.addEventListener("click", (event) => {
		if (event.target === dialog) dialog.close();
	});
	close.addEventListener("click", () => dialog.close());
	host.append(dialog);
	if (typeof dialog.showModal === "function") dialog.showModal();
	else dialog.setAttribute("open", "");
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterEvents.ts
var isHttpUrl = (value) => {
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
};
/** Binds the chat composer once per rendered Work Center root. */
var WorkCenterEvents = class {
	deps;
	actions;
	templates;
	voice;
	history;
	ingress;
	state;
	container = null;
	draftPersistTimer = null;
	constructor(deps, actions, templates, voice, history, ingress, state) {
		this.deps = deps;
		this.actions = actions;
		this.templates = templates;
		this.voice = voice;
		this.history = history;
		this.ingress = ingress;
		this.state = state;
	}
	setContainer(container) {
		this.container = container;
	}
	setupWorkCenterEvents() {
		this.bindLiveChats();
	}
	/** Bind Send/Enter/drop on every mounted chat, including a visible clone GLit left behind. */
	bindLiveChats() {
		for (const root of this.liveRoots()) this.bindRoot(root);
	}
	liveRoots() {
		const roots = /* @__PURE__ */ new Set();
		if (this.container) roots.add(this.container);
		if (typeof document !== "undefined") document.querySelectorAll(".workcenter-chat").forEach((node) => {
			if (node.isConnected || node === this.container) roots.add(node);
		});
		return [...roots];
	}
	bindRoot(root) {
		if (root.dataset.wcEventsBound === "1") return;
		root.dataset.wcEventsBound = "1";
		this.setupFilePicker(root);
		this.setupComposerInput(root);
		this.setupComposerResize(root);
		this.setupClipboardIngress(root);
		this.setupDropIngress(root);
		this.setupRequestOptions(root);
		this.setupVoiceInput(root);
		this.setupActions(root);
		syncWorkCenterComposerHeight(root);
	}
	sendComposer(root) {
		this.syncDraftFromComposer(root);
		this.actions.executeUnifiedAction(this.state);
	}
	syncDraftFromComposer(preferred) {
		const roots = preferred ? [preferred, ...this.liveRoots()] : this.liveRoots();
		for (const root of roots) {
			const input = root.querySelector(".prompt-input");
			if (!input) continue;
			if (!root.isConnected && root !== preferred && root !== this.container) continue;
			this.state.draft.content = input.value;
			this.state.currentPrompt = input.value;
			if (root.isConnected) break;
		}
	}
	setupFilePicker(root = this.container) {
		if (!root) return;
		let input = root.querySelector("[data-workcenter-file-picker]");
		if (!input) {
			input = document.createElement("input");
			input.type = "file";
			input.multiple = true;
			input.className = "wc-file-picker";
			input.dataset.workcenterFilePicker = "";
			root.append(input);
		}
		input.addEventListener("change", () => {
			const files = Array.from(input.files || []);
			input.value = "";
			if (!files.length) return;
			this.attachFiles(files);
		});
	}
	setupComposerInput(root) {
		const input = root.querySelector(".prompt-input");
		const composer = root.querySelector("[data-workcenter-composer]");
		if (!input || !composer) return;
		input.addEventListener("input", () => {
			this.state.draft.content = input.value;
			this.state.currentPrompt = input.value;
			syncWorkCenterComposerHeight(root);
			this.scheduleDraftPersistence();
		});
		input.addEventListener("keydown", (event) => {
			if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
				event.preventDefault();
				this.sendComposer(root);
			}
		});
		composer.addEventListener("submit", (event) => {
			event.preventDefault();
			this.sendComposer(root);
		});
	}
	setupClipboardIngress(root) {
		root.addEventListener("paste", (event) => {
			const data = event.clipboardData;
			if (!data) return;
			const target = event.target;
			const editable = this.isEditableTarget(target);
			const candidates = collectAttachmentCandidates(data, "paste");
			const files = candidates.filter((candidate) => candidate.kind === "file").map((candidate) => candidate.file);
			const urls = candidates.filter((candidate) => candidate.kind === "url").map((candidate) => candidate.url);
			if (files.length) {
				event.preventDefault();
				this.attachFiles(files);
				return;
			}
			if (!editable && urls.length) {
				event.preventDefault();
				Promise.all(urls.map((url) => this.attachUrl(url)));
				return;
			}
			if (editable) return;
			const text = data.getData("text/plain").trim();
			if (text) {
				event.preventDefault();
				this.appendDraftText(text);
			}
		});
	}
	setupDropIngress(root) {
		const composer = root.querySelector("[data-workcenter-composer]");
		const accept = (event) => {
			event.preventDefault();
			if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
			composer?.classList.add("is-dragging");
		};
		root.addEventListener("dragover", accept);
		root.addEventListener("dragenter", accept);
		root.addEventListener("dragleave", (event) => {
			if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) return;
			composer?.classList.remove("is-dragging");
		});
		root.addEventListener("drop", (event) => {
			event.preventDefault();
			event.stopPropagation();
			composer?.classList.remove("is-dragging");
			const data = event.dataTransfer;
			if (!data) return;
			const candidates = collectAttachmentCandidates(data, "drop");
			const files = candidates.filter((candidate) => candidate.kind === "file").map((candidate) => candidate.file);
			const urls = candidates.filter((candidate) => candidate.kind === "url").map((candidate) => candidate.url);
			if (files.length) this.attachFiles(files);
			if (urls.length) Promise.all(urls.map((url) => this.attachUrl(url)));
			if (files.length || urls.length) return;
			const text = data.getData("text/plain").trim();
			if (!text) return;
			if (isHttpUrl(text)) {
				this.attachUrl(text);
				return;
			}
			this.appendDraftText(text);
		});
	}
	setupRequestOptions(root) {
		for (const [selector, property] of [
			[".format-select", "outputFormat"],
			[".language-select", "selectedLanguage"],
			[".recognition-select", "recognitionFormat"],
			[".processing-select", "processingFormat"]
		]) {
			const select = root.querySelector(selector);
			select?.addEventListener("change", () => {
				this.state[property] = select.value;
				WorkCenterStateManager.saveState(this.state);
			});
		}
		const template = root.querySelector(".template-select");
		template?.addEventListener("change", () => {
			this.state.selectedTemplate = template.value;
			if (template.value) {
				this.state.draft.content = template.value;
				this.state.currentPrompt = template.value;
			}
			WorkCenterStateManager.saveState(this.state);
			this.actions.persistDraft(this.state);
			this.deps.render?.();
		});
		const instruction = root.querySelector(".instruction-select");
		instruction?.addEventListener("change", () => {
			this.templates.applyInstruction(this.state, instruction.value);
			WorkCenterStateManager.saveState(this.state);
		});
		this.bindPopoverDismiss(root, "[data-workcenter-request-options]", "[data-action=\"open-request-options\"]");
		this.bindPopoverDismiss(root, "[data-workcenter-secondary]", "[data-action=\"open-secondary\"]");
	}
	bindPopoverDismiss(root, panelSelector, triggerSelector) {
		const hidePanel = () => {
			const panel = root.querySelector(panelSelector);
			if (!panel || panel.hidden) return;
			panel.hidden = true;
			root.querySelector(triggerSelector)?.setAttribute("aria-expanded", "false");
		};
		const hideIfOutside = (event) => {
			const panel = root.querySelector(panelSelector);
			if (!panel || panel.hidden) return;
			const path = event.composedPath();
			if (path.includes(panel)) return;
			const trigger = root.querySelector(triggerSelector);
			if (trigger && path.includes(trigger)) return;
			hidePanel();
		};
		window.addEventListener("pointerdown", hideIfOutside, true);
		window.addEventListener("focusin", hideIfOutside, true);
		root.addEventListener("keydown", (event) => {
			if (event.key !== "Escape") return;
			hidePanel();
		});
	}
	setupVoiceInput(root) {
		const voice = root.querySelector("[data-action=\"voice-input\"]");
		if (!voice) return;
		voice.addEventListener("mousedown", () => this.voice.startVoiceRecording(this.state));
		const stop = () => this.voice.stopVoiceRecording(this.state);
		voice.addEventListener("mouseup", stop);
		voice.addEventListener("mouseleave", stop);
	}
	setupActions(root) {
		root.addEventListener("click", (event) => {
			const actionElement = event.target.closest("[data-action]");
			const action = actionElement?.dataset.action;
			if (!action || !actionElement) return;
			switch (action) {
				case "execute":
					event.preventDefault();
					this.sendComposer(root);
					break;
				case "select-files": break;
				case "new-chat":
					this.actions.startNewConversation(this.state);
					break;
				case "cancel-turn":
					this.actions.cancelConversationTurn(this.state, actionElement.dataset.turnId || "");
					break;
				case "retry-turn":
					this.actions.retryConversationTurn(this.state, actionElement.dataset.turnId || "");
					break;
				case "copy-turn":
					this.actions.copyConversationTurn(this.state, actionElement.dataset.turnId || "");
					break;
				case "view-attachment":
					event.preventDefault();
					this.viewAttachment(actionElement.dataset.attachmentHash || "");
					break;
				case "download-attachment":
					event.preventDefault();
					event.stopPropagation();
					this.downloadAttachment(actionElement.dataset.attachmentHash || "");
					break;
				case "remove-draft-attachment":
					event.preventDefault();
					event.stopPropagation();
					this.ingress.remove(actionElement.dataset.attachmentHash || "");
					break;
				case "close-attachment-viewer": {
					const viewer = root.querySelector("[data-workcenter-attachment-viewer]");
					if (typeof HTMLDialogElement !== "undefined" && viewer instanceof HTMLDialogElement && typeof viewer.close === "function") viewer.close();
					else viewer?.remove();
					break;
				}
				case "open-request-options":
					this.togglePanel("[data-workcenter-request-options]", actionElement);
					this.templates.fillInstructionSelects(root, this.state);
					break;
				case "refresh-instructions":
					this.templates.fillInstructionSelects(root, this.state);
					break;
				case "open-secondary":
					this.togglePanel("[data-workcenter-secondary]", actionElement);
					break;
				case "view-action-history":
					this.history.showActionHistory();
					break;
				case "edit-templates": this.templates.showTemplateEditor(this.state, root);
			}
		});
	}
	async attachFiles(files) {
		if (!(await this.ingress.addFiles(files)).length) this.deps.showMessage?.("Could not attach that file");
	}
	async attachUrl(url) {
		await this.ingress.addUrl(url);
	}
	setupComposerResize(root) {
		const handle = root.querySelector("[data-composer-resize]");
		const composer = root.querySelector("[data-workcenter-composer]");
		if (!handle || !composer) return;
		const applyHeight = (clientY, startY, startHeight, limit) => {
			const next = Math.min(limit, Math.max(72, startHeight + (startY - clientY)));
			composer.style.setProperty("--wc-composer-min", `${next}px`);
			syncWorkCenterComposerHeight(root);
		};
		let pointerDrag = false;
		handle.addEventListener("pointerdown", (event) => {
			if (event.isPrimary === false) return;
			if (event.pointerType === "mouse" && event.button !== 0) return;
			pointerDrag = true;
			event.preventDefault();
			event.stopPropagation();
			try {
				handle.setPointerCapture?.(event.pointerId);
			} catch {}
			const startY = event.clientY;
			const startHeight = composer.getBoundingClientRect().height;
			const hostHeight = root.getBoundingClientRect().height || startHeight;
			const limit = Math.max(96, hostHeight * .75);
			const onMove = (move) => {
				if (move.pointerId !== event.pointerId) return;
				move.preventDefault();
				applyHeight(move.clientY, startY, startHeight, limit);
			};
			const onUp = (up) => {
				if (up.pointerId !== event.pointerId) return;
				pointerDrag = false;
				window.removeEventListener("pointermove", onMove);
				window.removeEventListener("pointerup", onUp);
				window.removeEventListener("pointercancel", onUp);
				try {
					handle.releasePointerCapture?.(event.pointerId);
				} catch {}
			};
			window.addEventListener("pointermove", onMove, { passive: false });
			window.addEventListener("pointerup", onUp);
			window.addEventListener("pointercancel", onUp);
		}, { passive: false });
		handle.addEventListener("touchstart", (event) => {
			if (pointerDrag || event.touches.length !== 1) return;
			event.preventDefault();
			event.stopPropagation();
			const startY = event.touches[0].clientY;
			const startHeight = composer.getBoundingClientRect().height;
			const hostHeight = root.getBoundingClientRect().height || startHeight;
			const limit = Math.max(96, hostHeight * .75);
			const onMove = (move) => {
				const touch = move.touches[0];
				if (!touch) return;
				move.preventDefault();
				applyHeight(touch.clientY, startY, startHeight, limit);
			};
			const onUp = () => {
				window.removeEventListener("touchmove", onMove);
				window.removeEventListener("touchend", onUp);
				window.removeEventListener("touchcancel", onUp);
			};
			window.addEventListener("touchmove", onMove, { passive: false });
			window.addEventListener("touchend", onUp);
			window.addEventListener("touchcancel", onUp);
		}, { passive: false });
	}
	findAttachment(hash) {
		if (!hash) return null;
		const draft = this.state.draft.attachments.find((attachment) => attachment.hash === hash);
		if (draft) return draft;
		for (const message of this.state.messages) {
			const found = message.attachments.find((attachment) => attachment.hash === hash);
			if (found) return found;
		}
		return null;
	}
	async viewAttachment(hash) {
		const attachment = this.findAttachment(hash);
		const host = this.liveRoots().find((node) => node.isConnected) ?? this.container;
		if (!attachment || !host) return;
		const file = attachment.url ? this.ingress.fileFor(attachment) : await this.ingress.resolve(attachment);
		if (!file && !attachment.url) {
			this.deps.showMessage?.("Attachment is no longer available");
			return;
		}
		await openWorkCenterAttachment({
			host,
			attachment,
			file,
			objectUrl: file ? this.ingress.objectUrlFor(file) : null
		});
	}
	async downloadAttachment(hash) {
		const attachment = this.findAttachment(hash);
		if (!attachment) return;
		if (attachment.url && !this.ingress.fileFor(attachment)) {
			downloadWorkCenterAttachment({
				name: attachment.name,
				remoteUrl: attachment.url,
				objectUrl: null
			});
			return;
		}
		const file = await this.ingress.resolve(attachment);
		if (!file) {
			this.deps.showMessage?.("Attachment is no longer available");
			return;
		}
		downloadWorkCenterAttachment({
			name: attachment.name,
			remoteUrl: attachment.url,
			objectUrl: this.ingress.objectUrlFor(file)
		});
	}
	appendDraftText(text) {
		const next = [this.state.draft.content, text].filter(Boolean).join(this.state.draft.content ? "\n" : "");
		this.state.draft.content = next;
		this.state.currentPrompt = next;
		this.actions.persistDraft(this.state);
		for (const root of this.liveRoots()) {
			const input = root.querySelector(".prompt-input");
			if (input) input.value = next;
		}
	}
	scheduleDraftPersistence() {
		if (this.draftPersistTimer) clearTimeout(this.draftPersistTimer);
		this.draftPersistTimer = setTimeout(() => {
			this.draftPersistTimer = null;
			this.actions.persistDraft(this.state);
		}, 180);
	}
	togglePanel(selector, trigger) {
		const panel = (trigger.closest(".workcenter-chat") ?? this.container)?.querySelector(selector);
		if (!panel) return;
		panel.hidden = !panel.hidden;
		trigger.setAttribute("aria-expanded", String(!panel.hidden));
	}
	isEditableTarget(target) {
		if (!target) return false;
		return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable || !!target.closest("[contenteditable='true']");
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterResults.ts
var WorkCenterResults = class {
	container = null;
	deps;
	dataProcessing;
	constructor(dependencies, dataProcessing) {
		this.deps = dependencies;
		this.dataProcessing = dataProcessing;
	}
	setContainer(container) {
		this.container = container;
	}
	showProcessingMessage(message) {
		if (!this.container) return;
		const outputContent = this.container.querySelector("[data-output]");
		if (outputContent) outputContent.innerHTML = `<div class="wc-loading">${message}</div>`;
	}
	showResult(state) {
		if (!this.container || !state.lastRawResult) return;
		const outputContent = this.container.querySelector("[data-output]");
		if (!outputContent) return;
		outputContent.innerHTML = `<div class="result-content">${this.dataProcessing.formatResult(state.lastRawResult, state.outputFormat)}</div>`;
		highlightCodeTree(outputContent);
	}
	showError(error) {
		if (!this.container) return;
		const outputContent = this.container.querySelector("[data-output]");
		if (outputContent) outputContent.innerHTML = `<div class="error">Error: ${error}</div>`;
	}
	clearResults() {
		if (!this.container) return;
		const outputContent = this.container.querySelector("[data-output]");
		if (outputContent) outputContent.innerHTML = "<div class=\"wc-results-empty\">Results cleared</div>";
	}
	renderDataPipeline(state) {
		if (!state.recognizedData && (!state.processedData || state.processedData.length === 0)) return "";
		return H`<div class="data-pipeline-section">
            <div class="pipeline-content">
              <div class="pipeline-header">
                <h3>Data Processing Pipeline</h3>
                <div class="pipeline-actions">
                  <button class="btn btn-icon" data-action="clear-pipeline" title="Clear all data">
                    <ui-icon icon="trash" size="18" icon-style="duotone"></ui-icon>
                  </button>
                </div>
              </div>
              <div class="pipeline-steps">
              ${state.recognizedData ? H`<div class="pipeline-step recognized-step">
                <div class="step-header">
                  <ui-icon icon="eye" size="16" icon-style="duotone"></ui-icon>
                  <span class="step-title">Recognized Data</span>
                  <span class="step-time">${new Date(state.recognizedData.timestamp).toLocaleTimeString()}</span>
                  <span class="step-source">${state.recognizedData.source}</span>
                  <span class="step-format">${state.recognizedData.recognizedAs}</span>
                </div>
                <div class="step-content">
                  <div class="step-preview">${state.recognizedData.content.substring(0, 100)}${state.recognizedData.content.length > 100 ? "..." : ""}</div>
                </div>
              </div>` : ""}

              ${state.processedData ? state.processedData.map((step, index) => {
			const isShareTarget = step.metadata?.source === "share-target";
			return H`<div class="${isShareTarget ? "pipeline-step share-target-step" : "pipeline-step processed-step"}">
                <div class="step-header">
                  <ui-icon icon="${isShareTarget ? "share" : "cogs"}" size="16" icon-style="duotone"></ui-icon>
                  <span class="step-title">Step ${index + 1}: ${step.action}</span>
                  <span class="step-time">${new Date(step.timestamp).toLocaleTimeString()}</span>
                  ${isShareTarget ? H`<span class="step-badge share-target-badge" title="Share Target Result">Share</span>` : ""}
                  <button class="btn small" data-restore-step="${index}">Use Result</button>
                </div>
                <div class="step-content">
                  <div class="step-preview">${step.content.substring(0, 100)}${step.content.length > 100 ? "..." : ""}</div>
                </div>
              </div>`;
		}) : ""}
              </div>
            </div>
          </div>`;
	}
	updateDataPipeline(state) {
		if (!this.container) return;
		const pipelinePanel = this.container.querySelector("[data-results-tab-panel=\"pipeline\"]");
		if (!pipelinePanel) return;
		const pipelineHTML = this.renderDataPipeline(state);
		if (typeof pipelineHTML === "string") pipelinePanel.innerHTML = `<div class="wc-results-empty">No data pipeline yet</div>`;
		else {
			pipelinePanel.innerHTML = "";
			pipelinePanel.appendChild(pipelineHTML);
		}
	}
	updateRecognizedStatus(state) {
		if (!this.container) return;
		const statusElement = this.container.querySelector(".wc-recognized-status");
		if (state.recognizedData) {
			if (!statusElement) {
				const fileInputArea = this.container.querySelector(".wc-file-drop-overlay");
				if (fileInputArea) {
					const newStatus = H`<div class="wc-recognized-status">
                        <ui-icon icon="check-circle" size="16" icon-style="duotone" class="status-icon"></ui-icon>
                        <span>Content recognized - ready for actions</span>
                        <button class="btn small clear-recognized" data-action="clear-recognized">Clear</button>
                    </div>`;
					fileInputArea.appendChild(newStatus);
				}
			}
		} else if (statusElement) statusElement.remove();
	}
	renderOutputHeader() {
		return `
            <div class="wc-output-header">
                <div class="wc-output-actions">
                    <button class="btn btn-icon" data-action="view-output" title="View output in Viewer">
                        <ui-icon icon="eye" size="16" icon-style="duotone"></ui-icon>
                        <span class="btn-text">View</span>
                    </button>
                    <button class="btn btn-icon" data-action="copy-results" title="Copy results">
                        <ui-icon icon="copy" size="16" icon-style="duotone"></ui-icon>
                        <span class="btn-text">Copy</span>
                    </button>
                    <button class="btn btn-icon" data-action="save-to-explorer" title="Save to Explorer">
                        <ui-icon icon="floppy-disk" size="16" icon-style="duotone"></ui-icon>
                        <span class="btn-text">Save</span>
                    </button>
                    <button class="btn btn-icon" data-action="clear-results" title="Clear results">
                        <ui-icon icon="trash" size="16" icon-style="duotone"></ui-icon>
                        <span class="btn-text">Clear</span>
                    </button>
                </div>
            </div>
        `;
	}
	renderOutputContent() {
		return `
            <div class="wc-output-content" data-output>
                <div class="wc-results-empty">No results yet</div>
            </div>
        `;
	}
	restorePipelineStep(state, stepIndex) {
		if (!this.container) return;
		if (state.processedData && state.processedData[stepIndex]) {
			const step = state.processedData[stepIndex];
			const outputContent = this.container.querySelector("[data-output]");
			if (outputContent) {
				outputContent.innerHTML = `<div class="result-content">${this.dataProcessing.formatResult({ content: step.content }, state.outputFormat)}</div>`;
				highlightCodeTree(outputContent);
				state.lastRawResult = { data: step.content };
			}
		}
	}
	updateAllResultsUI(state) {
		this.updateDataPipeline(state);
		this.updateRecognizedStatus(state);
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterAttachments.ts
var WorkCenterAttachments = class {
	container = null;
	deps;
	fileOps;
	previewUrlCache = /* @__PURE__ */ new WeakMap();
	constructor(dependencies, fileOps) {
		this.deps = dependencies;
		this.fileOps = fileOps;
	}
	setContainer(container) {
		this.container = container;
	}
	renderAttachmentsSection(state) {
		return `
            <div class="wc-attachments-section">
              <div class="file-attachment-area" data-file-drop-zone="" data-dropzone="">
                <div class="file-drop-zone" >
                  <div class="drop-zone-content">
                    <ui-icon icon="folder" size="4rem" icon-style="duotone" class="drop-icon"></ui-icon>
                    <div class="drop-text">Drop files here or click to select files</div>
                    <div class="drop-hint" data-drop-hint>Supports: Images, Documents, Text files, PDFs, URLs, Base64 data</div>
                  </div>
                </div>
                <div class="file-list" data-file-list></div>
                ${this.renderRecognizedStatus(state)}
              </div>
              <div class="wc-block-header wc-attachments-toolbar">
                <div class="file-stats">
                  <div class="file-counter" data-file-count>
                    <ui-icon icon="file" size="16" icon-style="duotone"></ui-icon>
                    <span class="count">${state.files.length}</span>
                    <span class="label">files attached</span>
                  </div>
                  ${state.recognizedData ? `
                    <div class="data-counter recognized">
                      <ui-icon icon="eye" size="16" icon-style="duotone"></ui-icon>
                      <span>Content recognized</span>
                    </div>
                  ` : ""}
                  ${state.processedData && state.processedData.length > 0 ? `
                    <div class="data-counter processed">
                      <ui-icon icon="cogs" size="16" icon-style="duotone"></ui-icon>
                      <span>${state.processedData.length} processing steps</span>
                    </div>
                  ` : ""}
                </div>
              </div>
            </div>
        `;
	}
	renderRecognizedStatus(state) {
		if (!state.recognizedData) return "";
		return `
            <div class="wc-recognized-status">
              <ui-icon icon="check-circle" size="16" icon-style="duotone" class="status-icon"></ui-icon>
              <span>Content recognized - ready for processing</span>
              <button class="btn small clear-recognized" data-action="clear-recognized">Clear</button>
            </div>
        `;
	}
	updateFileList(state) {
		if (!this.container) return;
		const fileList = this.container.querySelector("[data-file-list]");
		if (!fileList) return;
		fileList.innerHTML = "";
		if (state.files.length === 0) {
			fileList.innerHTML = "<div class=\"wc-attachments-empty\">No files attached</div>";
			return;
		}
		state.files.forEach((file, index) => {
			const fileItem = this.createFileItem(file, index, state);
			fileList.append(fileItem);
		});
	}
	createFileItem(file, index, state) {
		const isImage = this.isImageFile(file);
		const isMarkdown = this.isMarkdownFile(file);
		const previewUrl = isImage ? this.getOrCreatePreviewUrl(file) : null;
		const fileSize = this.formatFileSize(file.size);
		const fileItem = H`<div class="file-item" data-file-index="${index}">
      <div class="file-info">
        <span class="file-icon">${this.createFileIconElement(file.type)}</span>
        ${previewUrl ? H`<img class="file-preview" alt=${file.name || "image"} src=${previewUrl} loading="lazy" decoding="async" />` : ""}
        <div class="file-details">
          <span class="file-name">${file.name || "Unnamed file"}</span>
          <span class="file-size">(${fileSize})</span>
          <span class="file-type">${this.getReadableFileType(file.type)}</span>
        </div>
        ${isMarkdown ? H`<button class="btn small" data-open-md="${index}" title="Open in Markdown Viewer">Open</button>` : ""}
      </div>
      <button class="btn small remove-btn" data-remove="${index}" title="Remove file">✕</button>
    </div>`;
		const openBtn = fileItem.querySelector(`[data-open-md="${index}"]`);
		if (openBtn) openBtn.addEventListener("click", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			await this.openMarkdownInViewer(file);
		});
		fileItem.querySelector(".remove-btn").addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.removeFile(state, index);
		});
		return fileItem;
	}
	removeFile(state, index) {
		const removedFile = state.files[index];
		if (removedFile) {
			this.revokePreviewUrl(removedFile);
			state.files.splice(index, 1);
			this.updateFileList(state);
			this.updateFileCounter(state);
			this.deps.onFilesChanged?.();
		}
	}
	setupDropZone(state) {
		if (!this.container) return;
		const dropZone = this.container.querySelector("[data-file-drop-zone]");
		if (!dropZone) return;
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.multiple = true;
		fileInput.accept = "image/*,.pdf,.txt,.md,.json,.html,.css,.js,.ts";
		fileInput.style.display = "none";
		this.container.append(fileInput);
		this.updateDropHint();
		dropZone.addEventListener("click", (e) => {
			if (e.target?.closest("button, a, input, select, textarea, label, [data-remove], [data-open-md]")) return;
			fileInput.click();
		});
		dropZone.addEventListener("dragover", (e) => {
			e.preventDefault();
			dropZone.classList.add("drag-over");
		});
		dropZone.addEventListener("dragleave", (e) => {
			const rect = dropZone.getBoundingClientRect();
			const x = e.clientX;
			const y = e.clientY;
			if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) dropZone.classList.remove("drag-over");
		});
		dropZone.addEventListener("drop", async (e) => {
			e.preventDefault();
			dropZone.classList.remove("drag-over");
			const dataTransfer = e.dataTransfer;
			if (!dataTransfer) return;
			let contentAdded = false;
			const files = Array.from(dataTransfer.files || []);
			if (files.length > 0) {
				this.fileOps.addFilesFromInput(state, files);
				this.updateFileList(state);
				this.updateFileCounter(state);
				this.deps.onFilesChanged?.();
				contentAdded = true;
			}
			if (!contentAdded && dataTransfer.types.includes("text/plain")) try {
				const textContent = dataTransfer.getData("text/plain");
				if (textContent?.trim()) {
					await this.fileOps.handleDroppedContent(state, textContent.trim(), "text");
					contentAdded = true;
				}
			} catch (error) {
				console.warn("[WorkCenter] Failed to get dragged text:", error);
			}
			if (!contentAdded && dataTransfer.types.includes("text/uri-list")) try {
				const urls = dataTransfer.getData("text/uri-list").split("\n").filter((url) => url.trim() && !url.startsWith("#"));
				if (urls.length > 0) {
					for (const url of urls) if (this.isValidUrl(url.trim())) {
						await this.fileOps.handleDroppedContent(state, url.trim(), "url");
						break;
					}
					contentAdded = true;
				}
			} catch (error) {
				console.warn("[WorkCenter] Failed to get dragged URLs:", error);
			}
			if (!contentAdded && dataTransfer.types.includes("text/html")) try {
				const htmlContent = dataTransfer.getData("text/html");
				if (htmlContent) {
					const tempDiv = document.createElement("div");
					tempDiv.innerHTML = htmlContent;
					const extractedText = tempDiv.textContent || tempDiv.innerText || "";
					if (extractedText.trim()) {
						await this.fileOps.handleDroppedContent(state, extractedText.trim(), "html");
						contentAdded = true;
					}
				}
			} catch (error) {
				console.warn("[WorkCenter] Failed to get dragged HTML:", error);
			}
		});
		fileInput.addEventListener("change", async (e) => {
			const files = Array.from(e.target.files || []);
			this.fileOps.addFilesFromInput(state, files);
			this.updateFileList(state);
			this.updateFileCounter(state);
			this.deps.onFilesChanged?.();
			if (files.filter((f) => f.type.startsWith("text/") || f.type === "application/markdown" || f.name?.endsWith(".md") || f.name?.endsWith(".txt")).length > 0 && state.selectedTemplate && state.selectedTemplate.trim()) {
				console.log("[WorkCenter] Auto-processing text/markdown files with template:", state.selectedTemplate);
				setTimeout(async () => {
					this.deps.showMessage?.("Files attached and ready for processing");
				}, 100);
			}
		});
	}
	updateFileCounter(state) {
		if (!this.container) return;
		const counter = this.container.querySelector("[data-file-count] .count");
		if (counter) counter.textContent = state.files.length.toString();
	}
	updateDataCounters(state) {
		if (!this.container) return;
		const recognizedCounter = this.container.querySelector(".data-counter.recognized");
		if (state.recognizedData) {
			if (!recognizedCounter) {
				const statsContainer = this.container.querySelector(".file-stats");
				if (statsContainer) {
					const newCounter = H`<div class="data-counter recognized">
                        <ui-icon icon="eye" size="16" icon-style="duotone"></ui-icon>
                        <span>Content recognized</span>
                    </div>`;
					statsContainer.appendChild(newCounter);
				}
			}
		} else if (recognizedCounter) recognizedCounter.remove();
		const processedCounter = this.container.querySelector(".data-counter.processed");
		if (state.processedData && state.processedData.length > 0) {
			if (processedCounter) {
				const span = processedCounter.querySelector("span");
				if (span) span.textContent = `${state.processedData.length} processing steps`;
			} else {
				const statsContainer = this.container.querySelector(".file-stats");
				if (statsContainer) {
					const newCounter = H`<div class="data-counter processed">
                        <ui-icon icon="cogs" size="16" icon-style="duotone"></ui-icon>
                        <span>${state.processedData.length} processing steps</span>
                    </div>`;
					statsContainer.appendChild(newCounter);
				}
			}
		} else if (processedCounter) processedCounter.remove();
	}
	clearAllFiles(state) {
		this.revokeAllPreviewUrls(state);
		state.files.length = 0;
		this.updateFileList(state);
		this.updateFileCounter(state);
		this.updateDataCounters(state);
		this.deps.onFilesChanged?.();
	}
	isImageFile(file) {
		return (file?.type || "").toLowerCase().startsWith("image/");
	}
	isMarkdownFile(file) {
		const name = (file?.name || "").toLowerCase();
		return (file?.type || "").toLowerCase() === "text/markdown" || name.endsWith(".md") || name.endsWith(".markdown") || name.endsWith(".mdown") || name.endsWith(".mkd") || name.endsWith(".mkdn");
	}
	getOrCreatePreviewUrl(file) {
		if (!file) return null;
		if (!this.isImageFile(file)) return null;
		const cached = this.previewUrlCache.get(file);
		if (cached) return cached;
		try {
			const url = URL.createObjectURL(file);
			this.previewUrlCache.set(file, url);
			return url;
		} catch {
			return null;
		}
	}
	revokePreviewUrl(file) {
		const url = this.previewUrlCache.get(file);
		if (url) try {
			URL.revokeObjectURL(url);
		} catch {}
		this.previewUrlCache.delete(file);
	}
	async openMarkdownInViewer(file) {
		try {
			const md = await file.text();
			try {
				localStorage.setItem("rs-markdown", md);
			} catch {}
			try {
				if (this.deps?.state) {
					this.deps.state.markdown = md;
					this.deps.state.view = "markdown-viewer";
				}
			} catch {}
			this.deps.render?.();
			setTimeout(() => {
				this.deps.showMessage?.(`Opened ${file.name || "file"} in Markdown Viewer`);
			}, 0);
		} catch (e) {
			this.deps.showMessage?.(`Failed to open ${file.name || "file"}`);
			console.warn("[WorkCenter] Failed to open markdown file:", e);
		}
	}
	createFileIconElement(mimeType) {
		const iconName = this.getFileIconName(mimeType);
		return H`<ui-icon icon="${iconName}" size="20" icon-style="duotone" class="file-type-icon"></ui-icon>`;
	}
	getFileIconName(mimeType) {
		if (mimeType.startsWith("image/")) return "image";
		if (mimeType === "application/pdf") return "file-pdf";
		if (mimeType.includes("json")) return "file-text";
		if (mimeType.includes("text") || mimeType.includes("markdown")) return "file-text";
		return "file";
	}
	getReadableFileType(mimeType) {
		if (!mimeType) return "Unknown";
		const typeMap = {
			"image/jpeg": "JPEG Image",
			"image/png": "PNG Image",
			"image/gif": "GIF Image",
			"image/webp": "WebP Image",
			"image/svg+xml": "SVG Image",
			"application/pdf": "PDF Document",
			"text/plain": "Text File",
			"text/markdown": "Markdown",
			"application/json": "JSON",
			"text/html": "HTML",
			"text/css": "CSS",
			"application/javascript": "JavaScript",
			"application/typescript": "TypeScript"
		};
		if (typeMap[mimeType]) return typeMap[mimeType];
		if (mimeType.startsWith("image/")) return "Image";
		if (mimeType.startsWith("text/")) return "Text File";
		if (mimeType.startsWith("application/")) return "Document";
		return mimeType.split("/")[1]?.toUpperCase() || "File";
	}
	formatFileSize(bytes) {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / 1048576).toFixed(1)} MB`;
	}
	revokeAllPreviewUrls(state) {
		try {
			for (const f of state.files) this.revokePreviewUrl(f);
		} catch {}
	}
	isValidUrl(string) {
		try {
			new URL(string);
			return true;
		} catch {
			return false;
		}
	}
	updateDropHint() {
		if (!this.container) return;
		const hintElement = this.container.querySelector("[data-drop-hint]");
		if (!hintElement) return;
		switch (globalThis?.location?.hash) {
			case ROUTE_HASHES.SHARE_TARGET_TEXT:
				hintElement.textContent = "Drop text files or paste text content here";
				break;
			case ROUTE_HASHES.SHARE_TARGET_IMAGE:
				hintElement.textContent = "Drop image files here (PNG, JPG, GIF, WebP, etc.)";
				break;
			case ROUTE_HASHES.SHARE_TARGET_FILES:
				hintElement.textContent = "Drop any files here (images, documents, text files, PDFs, etc.)";
				break;
			case ROUTE_HASHES.SHARE_TARGET_URL:
				hintElement.textContent = "Paste URLs here (file drops not accepted on this route)";
				break;
			default: hintElement.textContent = "Supports: Images, Documents, Text files, PDFs, URLs, Base64 data";
		}
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterPrompts.ts
var WorkCenterPrompts = class {
	container = null;
	deps;
	templates;
	voice;
	constructor(dependencies, templates, voice) {
		this.deps = dependencies;
		this.templates = templates;
		this.voice = voice;
	}
	setContainer(container) {
		this.container = container;
	}
	renderPromptPanel(state) {
		return `
            <div class="prompt-panel">
              <div class="prompt-controls">
                <select class="template-select">
                  <option value="">Select Template...</option>
                  ${state.promptTemplates.map((t) => `<option value="${t.prompt.replace(/"/g, "&quot;")}" ${state.selectedTemplate === t.prompt ? "selected" : ""}>${t.name}</option>`).join("")}
                </select>
                <button class="btn btn-icon" data-action="edit-templates" title="Edit Templates">
                  <ui-icon icon="gear" size="18" icon-style="duotone"></ui-icon>
                  <span class="btn-text">Templates</span>
                </button>
                <button class="btn btn-icon prompt-attach-btn" data-action="select-files" title="Attach files">
                  <ui-icon icon="paperclip" size="18" icon-style="duotone"></ui-icon>
                  <span class="attach-count" data-prompt-file-count>${state.files.length}</span>
                </button>
              </div>

              <div class="prompt-input-group" data-prompt-dropzone data-dropzone="">
                <div class="prompt-input-overlay" data-prompt-drop-hint>
                  <ui-icon icon="paperclip" size="16" icon-style="duotone"></ui-icon>
                  <span>Drop files, links or text to attach</span>
                </div>
                <textarea
                  class="prompt-input"
                  placeholder="Describe what you want to do with the attached content... (or use voice input)"
                  rows="4"
                >${state.currentPrompt}</textarea>
              </div>

              <div class="prompt-actions">
                
                <button class="btn voice-btn ${state.voiceRecording ? "recording" : ""}" data-action="voice-input">
                  <ui-icon icon="microphone" size="20" icon-style="duotone"></ui-icon>
                  ${state.voiceRecording ? "Recording..." : "Hold for Voice"}
                </button>
                <label class="auto-action-label" title="Auto-action (use last successful)">
                  <input type="checkbox" class="auto-action-checkbox" ${state.autoAction ? "checked" : ""}>
                  <ui-icon icon="lightning-a" size="20" icon-style="duotone"></ui-icon>
                </label>
                <button class="btn primary action-btn" data-action="execute">
                  <ui-icon icon="brain" size="20" icon-style="duotone"></ui-icon>
                  <span class="btn-text">Process Content</span>
                </button>
                <button class="btn btn-icon clear-btn" data-action="clear-prompt" title="Clear Prompt">
                  <ui-icon icon="trash" size="18" icon-style="duotone"></ui-icon>
                </button>
              </div>
            </div>
        `;
	}
	renderPromptsSection(state) {
		return `
            <div class="prompts-section">
              ${this.renderPromptPanel(state)}
            </div>
        `;
	}
	/** Populate the instruction selector with custom instructions from settings */
	async populateInstructionSelect(state) {
		if (!this.container) return;
		const select = this.container.querySelector(".instruction-select");
		if (!select) return;
		const instructions = await this.templates.loadInstructions();
		const hasStoredSelection = Boolean(state.selectedInstruction) && instructions.some((i) => i.id === state.selectedInstruction);
		const selectedId = hasStoredSelection ? state.selectedInstruction : this.templates.getActiveInstructionId();
		select.innerHTML = "<option value=\"\">None (default)</option>";
		for (const instr of instructions) {
			const opt = document.createElement("option");
			opt.value = instr.id;
			opt.textContent = instr.label;
			if (instr.id === selectedId) opt.selected = true;
			select.append(opt);
		}
		if ((!state.selectedInstruction || !hasStoredSelection) && selectedId) state.selectedInstruction = selectedId;
	}
	/** Update the instruction selector options (sync, after loadInstructions) */
	updateInstructionSelect(state) {
		if (!this.container) return;
		const select = this.container.querySelector(".instruction-select");
		if (!select) return;
		const instructions = this.templates.getInstructions();
		const selectedId = Boolean(state.selectedInstruction) && instructions.some((i) => i.id === state.selectedInstruction) ? state.selectedInstruction : this.templates.getActiveInstructionId();
		select.innerHTML = "<option value=\"\">None (default)</option>";
		for (const instr of instructions) {
			const opt = document.createElement("option");
			opt.value = instr.id;
			opt.textContent = instr.label;
			if (instr.id === selectedId) opt.selected = true;
			select.append(opt);
		}
	}
	/** Get the currently selected instruction object */
	getSelectedInstruction(state) {
		if (!state.selectedInstruction) return null;
		return this.templates.getInstructionById(state.selectedInstruction) || null;
	}
	updatePromptInput(state) {
		if (!this.container) return;
		const promptInput = this.container.querySelector(".prompt-input");
		if (promptInput) promptInput.value = state.currentPrompt;
	}
	updateTemplateSelect(state) {
		if (!this.container) return;
		const templateSelect = this.container.querySelector(".template-select");
		if (templateSelect) {
			const currentValue = templateSelect.value;
			templateSelect.innerHTML = "<option value=\"\">Select Template...</option>" + state.promptTemplates.map((t) => `<option value="${t.prompt.replace(/"/g, "&quot;")}" ${state.selectedTemplate === t.prompt ? "selected" : ""}>${t.name}</option>`).join("");
			if (state.selectedTemplate && state.promptTemplates.some((t) => t.prompt === state.selectedTemplate)) templateSelect.value = state.selectedTemplate;
			else templateSelect.value = currentValue;
		}
	}
	updateVoiceButton(state) {
		if (!this.container) return;
		const voiceBtn = this.container.querySelector("[data-action=\"voice-input\"]");
		if (voiceBtn) {
			voiceBtn.innerHTML = state.voiceRecording ? "<ui-icon icon=\"microphone\" size=\"20\" icon-style=\"duotone\"></ui-icon> Recording..." : "<ui-icon icon=\"microphone\" size=\"20\" icon-style=\"duotone\"></ui-icon> Hold for Voice";
			voiceBtn.classList.toggle("recording", state.voiceRecording);
		}
	}
	updatePromptFileCount(state) {
		if (!this.container) return;
		const count = this.container.querySelector("[data-prompt-file-count]");
		if (count) count.textContent = String(state.files.length);
	}
	clearPrompt(state) {
		state.currentPrompt = "";
		this.updatePromptInput(state);
	}
	handleTemplateSelection(state, selectedPrompt) {
		state.selectedTemplate = selectedPrompt;
		if (selectedPrompt) {
			state.currentPrompt = selectedPrompt;
			this.updatePromptInput(state);
		}
	}
	handleInstructionSelection(state, instructionId) {
		state.selectedInstruction = instructionId;
	}
	handleAutoActionToggle(state, checked) {
		state.autoAction = checked;
	}
};
//#endregion
//#region src/shared/service/misc/ActionHistory.ts
/** In-memory history store with optional browser persistence and lightweight filtering. */
var ActionHistoryStore = class {
	state;
	storageKey = "rs-action-history";
	constructor(maxEntries = 500, autoSave = true) {
		this.state = {
			entries: [],
			maxEntries,
			autoSave,
			filters: {}
		};
		this.loadHistory();
	}
	/** Insert a new entry at the front of the timeline and enforce the retention limit. */
	addEntry(entry) {
		const fullEntry = {
			...entry,
			id: this.generateId(),
			timestamp: Date.now()
		};
		this.state.entries.unshift(fullEntry);
		if (this.state.entries.length > this.state.maxEntries) this.state.entries = this.state.entries.slice(0, this.state.maxEntries);
		this.saveHistory();
		return fullEntry;
	}
	/**
	* Update an existing entry
	*/
	updateEntry(id, updates) {
		const index = this.state.entries.findIndex((entry) => entry.id === id);
		if (index === -1) return false;
		Object.assign(this.state.entries[index], updates);
		this.saveHistory();
		return true;
	}
	/**
	* Get entry by ID
	*/
	getEntry(id) {
		return this.state.entries.find((entry) => entry.id === id);
	}
	/** Return entries matching the supplied filters without mutating store state. */
	getEntries(filters) {
		let entries = [...this.state.entries];
		if (filters?.source) entries = entries.filter((entry) => entry.context.source === filters.source);
		if (filters?.action) entries = entries.filter((entry) => entry.action === filters.action);
		if (filters?.status) entries = entries.filter((entry) => entry.status === filters.status);
		if (filters?.dateRange) entries = entries.filter((entry) => entry.timestamp >= filters.dateRange.start && entry.timestamp <= filters.dateRange.end);
		return entries;
	}
	/**
	* Get recent entries
	*/
	getRecentEntries(limit = 50) {
		return this.state.entries.slice(0, limit);
	}
	/**
	* Remove entry
	*/
	removeEntry(id) {
		const index = this.state.entries.findIndex((entry) => entry.id === id);
		if (index === -1) return false;
		this.state.entries.splice(index, 1);
		return true;
	}
	/**
	* Clear all entries
	*/
	clearEntries() {
		this.state.entries = [];
	}
	/**
	* Set filters
	*/
	setFilters(filters) {
		Object.assign(this.state.filters, filters);
	}
	/** Summarize history health and distribution by source/action. */
	getStats() {
		const entries = this.state.entries;
		const total = entries.length;
		const completed = entries.filter((e) => e.status === "completed").length;
		const failed = entries.filter((e) => e.status === "failed").length;
		const pending = entries.filter((e) => e.status === "pending" || e.status === "processing").length;
		const bySource = entries.reduce((acc, entry) => {
			acc[entry.context.source] = (acc[entry.context.source] || 0) + 1;
			return acc;
		}, {});
		const byAction = entries.reduce((acc, entry) => {
			acc[entry.action] = (acc[entry.action] || 0) + 1;
			return acc;
		}, {});
		return {
			total,
			completed,
			failed,
			pending,
			successRate: total > 0 ? completed / total * 100 : 0,
			bySource,
			byAction
		};
	}
	/**
	* Export entries
	*/
	exportEntries(format = "json", filters) {
		const entries = this.getEntries(filters);
		if (format === "csv") return [[
			"ID",
			"Timestamp",
			"Source",
			"Action",
			"Status",
			"Input Type",
			"Result Type",
			"Processing Time"
		], ...entries.map((entry) => [
			entry.id,
			new Date(entry.timestamp).toISOString(),
			entry.context.source,
			entry.action,
			entry.status,
			entry.input.type,
			entry.result?.type || "",
			entry.result?.processingTime || ""
		])].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
		return JSON.stringify(entries, null, 2);
	}
	/**
	* Import entries
	*/
	importEntries(data, format = "json") {
		let entries = [];
		if (format === "json") try {
			entries = JSON.parse(data);
		} catch (e) {
			throw new Error("Invalid JSON format");
		}
		else throw new Error("CSV import not implemented yet");
		const validEntries = entries.filter((entry) => entry.id && entry.timestamp && entry.context && entry.action);
		validEntries.forEach((entry) => {
			if (!this.getEntry(entry.id)) this.state.entries.push(entry);
		});
		this.state.entries.sort((a, b) => b.timestamp - a.timestamp);
		if (this.state.entries.length > this.state.maxEntries) this.state.entries = this.state.entries.slice(0, this.state.maxEntries);
		this.saveHistory();
		return validEntries.length;
	}
	generateId() {
		return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
	loadHistory() {
		try {
			if (typeof localStorage === "undefined") return;
			const stored = localStorage.getItem(this.storageKey);
			if (stored) {
				const data = JSON.parse(stored);
				if (Array.isArray(data)) this.state.entries = data.map((entry) => ({
					...entry,
					context: entry.context || { source: "unknown" },
					input: entry.input || { type: "unknown" },
					status: entry.status || "completed"
				}));
			}
		} catch (e) {
			console.warn("Failed to load action history:", e);
			this.state.entries = [];
		}
	}
	saveHistory() {
		if (!this.state.autoSave) return;
		try {
			if (typeof localStorage === "undefined") return;
			localStorage.setItem(this.storageKey, JSON.stringify(this.state.entries));
		} catch (e) {
			console.warn("Failed to save action history:", e);
		}
	}
};
var actionHistory = new ActionHistoryStore();
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterHistory.ts
/**
* Work Center action-history list and overlay.
*
* FIND:workcenter-action-history
*/
var WorkCenterHistory = class {
	container = null;
	deps;
	constructor(dependencies) {
		this.deps = dependencies;
	}
	setContainer(container) {
		this.container = container;
	}
	updateRecentHistory(state) {
		if (!this.container) return;
		const historyContainer = this.container.querySelector("[data-recent-history]");
		if (!historyContainer) return;
		historyContainer.innerHTML = "";
		const recentItems = actionHistory.getRecentEntries(10).filter((entry) => entry.context.source === "workcenter" && entry.status === "completed");
		if (recentItems.length === 0) {
			historyContainer.innerHTML = "<div class=\"wc-history-empty\">No recent activity</div>";
			return;
		}
		recentItems.slice(0, 3).forEach((item) => {
			const historyItem = H`<div class="history-item-compact">
        <div class="history-meta">
          <span class="history-status ${item.result?.type !== "error" ? "success" : "error"}">${item.result?.type !== "error" ? "✓" : "✗"}</span>
          <span class="history-prompt">${item.input.text?.substring(0, 50) || item.action}${item.input.text && item.input.text.length > 50 ? "..." : ""}</span>
          ${item.result?.processingTime ? H`<span class="history-time">${Math.round(item.result.processingTime / 1e3)}s</span>` : ""}
        </div>
        <button class="btn small" data-restore="${item.id}">Use</button>
      </div>`;
			historyItem.querySelector("button")?.addEventListener("click", () => {
				if (item.input.text) {
					state.currentPrompt = item.input.text;
					this.deps.showMessage?.("Restored prompt from history");
				}
			});
			historyContainer.append(historyItem);
		});
	}
	updateActionHistory() {
		if (!this.container) return;
		const statsContainer = this.container.querySelector("[data-action-stats]");
		if (statsContainer) {
			const stats = actionHistory.getStats();
			statsContainer.innerHTML = `
                <div class="stats-item">Total: ${stats.total}</div>
                <div class="stats-item">Success: ${stats.completed}</div>
                <div class="stats-item">Failed: ${stats.failed}</div>
            `;
		}
	}
	showActionHistory() {
		if (!this.container) return;
		const actionEntries = actionHistory.getRecentEntries(50).filter((entry) => entry.context.source === "workcenter");
		const modal = H`<div class="action-history-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Action History</h3>
          <div class="modal-actions">
            <button class="btn btn-icon" data-action="export-history" title="Export History">
              <ui-icon icon="download" size="18" icon-style="duotone"></ui-icon>
            </button>
            <button class="btn btn-icon" data-action="clear-history" title="Clear History">
              <ui-icon icon="trash" size="18" icon-style="duotone"></ui-icon>
            </button>
            <button class="btn" data-action="close-modal">Close</button>
          </div>
        </div>

        <div class="history-stats">
          ${(() => {
			const stats = actionHistory.getStats();
			return H`
              <div class="stat-card">
                <div class="stat-value">${stats.total}</div>
                <div class="stat-label">Total Actions</div>
              </div>
              <div class="stat-card">
                <div class="stat-value success">${stats.completed}</div>
                <div class="stat-label">Completed</div>
              </div>
              <div class="stat-card">
                <div class="stat-value error">${stats.failed}</div>
                <div class="stat-label">Failed</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${stats.byAction["recognize"] || 0}</div>
                <div class="stat-label">Recognitions</div>
              </div>
            `;
		})()}
        </div>

        <div class="history-filters">
          <select class="filter-select" data-filter="status">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="processing">Processing</option>
          </select>
          <select class="filter-select" data-filter="action">
            <option value="">All Actions</option>
            <option value="recognize">Recognize</option>
            <option value="analyze">Analyze</option>
            <option value="process">Process</option>
          </select>
        </div>

        <div class="action-history-list">
          ${actionEntries.length === 0 ? H`<div class="wc-history-empty">No actions found</div>` : actionEntries.map((entry) => H`<div class="action-history-item ${entry.status}">
              <div class="action-header">
                <div class="action-meta">
                  <span class="action-status ${entry.status}">${this.getStatusIcon(entry.status)}</span>
                  <span class="action-type">${entry.action}</span>
                  <span class="action-time">${this.formatTimeAgo(entry.timestamp)}</span>
                  ${entry.result?.processingTime ? H`<span class="action-duration">${Math.round(entry.result.processingTime / 1e3)}s</span>` : ""}
                </div>
                <div class="action-actions">
                  ${entry.result ? H`<button class="btn small" data-restore-action="${entry.id}">Use Result</button>` : ""}
                  <button class="btn small" data-view-details="${entry.id}">Details</button>
                </div>
              </div>

              <div class="action-content">
                <div class="input-preview">
                  <strong>Input:</strong>
                  ${entry.input.files?.length ? `${entry.input.files.length} file(s): ${entry.input.files.map((f) => f.name).join(", ")}` : entry.input.text?.substring(0, 100) || "No input"}
                  ${entry.input.text && entry.input.text.length > 100 ? "..." : ""}
                </div>

                ${entry.result ? H`<div class="result-preview">
                  <strong>Result:</strong>
                  <div class="result-content">${entry.result.content.substring(0, 200)}${entry.result.content.length > 200 ? "..." : ""}</div>
                </div>` : ""}

                ${entry.error ? H`<div class="error-preview">
                  <strong>Error:</strong> ${entry.error}
                </div>` : ""}
              </div>
            </div>`)}
        </div>
      </div>
    </div>`;
		const closeModal = () => {
			window.removeEventListener("keydown", onKey);
			modal.remove();
		};
		const onKey = (event) => {
			if (event.key === "Escape") closeModal();
		};
		window.addEventListener("keydown", onKey);
		modal.addEventListener("click", (e) => {
			const target = e.target;
			if (!target.closest(".modal-content")) {
				closeModal();
				return;
			}
			const action = target.getAttribute("data-action") || target.closest("[data-action]")?.getAttribute("data-action");
			const entryId = target.getAttribute("data-restore-action") || target.getAttribute("data-view-details");
			if (action === "close-modal") closeModal();
			else if (action === "export-history") this.exportActionHistory();
			else if (action === "clear-history") {
				if (confirm("Are you sure you want to clear all action history?")) {
					actionHistory.clearEntries();
					closeModal();
					this.updateRecentHistory({});
				}
			} else if (entryId) {
				const entry = actionHistory.getEntry(entryId);
				if (entry) {
					if (target.hasAttribute("data-restore-action") && entry.result) {
						this.deps.showMessage?.("Result restored from history");
						closeModal();
					} else if (target.hasAttribute("data-view-details")) this.showActionDetails(entry);
				}
			}
		});
		modal.querySelectorAll(".filter-select").forEach((select) => {
			select.addEventListener("change", () => this.applyHistoryFilters(modal));
		});
		this.container.append(modal);
	}
	showActionDetails(entry) {
		const modal = H`<div class="action-details-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Action Details</h3>
          <button class="btn" data-action="close-modal">Close</button>
        </div>

        <div class="details-grid">
          <div class="detail-item">
            <label>ID:</label>
            <span>${entry.id}</span>
          </div>
          <div class="detail-item">
            <label>Timestamp:</label>
            <span>${new Date(entry.timestamp).toLocaleString()}</span>
          </div>
          <div class="detail-item">
            <label>Source:</label>
            <span>${entry.context.source}</span>
          </div>
          <div class="detail-item">
            <label>Action:</label>
            <span>${entry.action}</span>
          </div>
          <div class="detail-item">
            <label>Status:</label>
            <span class="status-${entry.status}">${entry.status}</span>
          </div>
          ${entry.result?.processingTime ? H`<div class="detail-item">
            <label>Processing Time:</label>
            <span>${Math.round(entry.result.processingTime / 1e3)}s</span>
          </div>` : ""}
        </div>

        <div class="details-section">
          <h4>Input</h4>
          <div class="input-details">
            <div>Type: ${entry.input.type}</div>
            ${entry.input.files ? H`<div>Files: ${entry.input.files.map((f) => f.name).join(", ")}</div>` : ""}
            ${entry.input.text ? H`<div>Text: <pre>${entry.input.text}</pre></div>` : ""}
          </div>
        </div>

        ${entry.result ? H`<div class="details-section">
          <h4>Result</h4>
          <div class="result-details">
            <div>Type: ${entry.result.type}</div>
            <div>Auto Copied: ${entry.result.autoCopied ? "Yes" : "No"}</div>
            <div>Content: <pre>${entry.result.content}</pre></div>
          </div>
        </div>` : ""}

        ${entry.error ? H`<div class="details-section">
          <h4>Error</h4>
          <div class="error-details">${entry.error}</div>
        </div>` : ""}
      </div>
    </div>`;
		modal.addEventListener("click", (e) => {
			if (e.target.getAttribute("data-action") === "close-modal") modal.remove();
		});
		document.body.append(modal);
	}
	applyHistoryFilters(modal) {
		const statusFilter = modal.querySelector("[data-filter=\"status\"]").value;
		const actionFilter = modal.querySelector("[data-filter=\"action\"]").value;
		modal.querySelectorAll(".action-history-item").forEach((item) => {
			const status = item.classList[1];
			const action = item.querySelector(".action-type")?.textContent || "";
			const statusMatch = !statusFilter || status === statusFilter;
			const actionMatch = !actionFilter || action === actionFilter;
			item.style.display = statusMatch && actionMatch ? "block" : "none";
		});
	}
	exportActionHistory() {
		const data = actionHistory.exportEntries("json");
		const blob = new Blob([data], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `action-history-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
		document.body.append(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
		this.deps.showMessage?.("History exported successfully");
	}
	getStatusIcon(status) {
		switch (status) {
			case "completed": return "✓";
			case "failed": return "✗";
			case "processing": return "⟳";
			case "pending": return "⏳";
			case "cancelled": return "⊗";
			default: return "?";
		}
	}
	formatTimeAgo(timestamp) {
		const diff = Date.now() - timestamp;
		const minutes = Math.floor(diff / 6e4);
		const hours = Math.floor(diff / 36e5);
		const days = Math.floor(diff / 864e5);
		if (days > 0) return `${days}d ago`;
		if (hours > 0) return `${hours}h ago`;
		if (minutes > 0) return `${minutes}m ago`;
		return "Just now";
	}
	getLastSuccessfulPrompt() {
		return this.deps.history.find((h) => h.ok)?.prompt || "Process the provided content";
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterSession.ts
var emptySnapshot = () => ({
	version: 1,
	draft: {
		content: "",
		attachments: []
	},
	messages: [],
	epoch: 0
});
var createId = (prefix) => `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
var cloneRef = (attachment) => ({ ...attachment });
var cloneMessage = (message) => ({
	...message,
	attachments: message.attachments.map(cloneRef),
	request: message.request ? { ...message.request } : void 0
});
var cloneSnapshot = (snapshot) => ({
	version: 1,
	epoch: snapshot.epoch,
	draft: {
		content: snapshot.draft.content,
		attachments: snapshot.draft.attachments.map(cloneRef)
	},
	messages: snapshot.messages.map(cloneMessage)
});
/** Persist only display fields — GPT envelopes can be huge or cyclic and stall OPFS. */
var slimRawResult = (value) => {
	if (value == null || typeof value !== "object") return value;
	const row = value;
	return {
		ok: row.ok,
		data: typeof row.data === "string" ? row.data : void 0,
		error: typeof row.error === "string" ? row.error : void 0,
		responseId: typeof row.responseId === "string" ? row.responseId : void 0
	};
};
var isSnapshot$1 = (value) => {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return candidate.version === 1 && Array.isArray(candidate.messages) && !!candidate.draft && typeof candidate.draft.content === "string" && Array.isArray(candidate.draft.attachments);
};
var sessionSnapshotHasContent = (snapshot) => Boolean(snapshot && (snapshot.messages.length > 0 || snapshot.draft.attachments.length > 0 || Boolean(snapshot.draft.content.trim())));
/** Higher epoch wins (New chat). Same epoch: longer transcript, then draft attachments. */
var rankSessionSnapshot = (snapshot) => {
	if (!isSnapshot$1(snapshot)) return -1;
	return snapshot.epoch * 1e6 + snapshot.messages.length * 10 + snapshot.draft.attachments.length + (snapshot.draft.content.trim() ? 1 : 0);
};
var pickRichestSessionSnapshot = (...candidates) => {
	let best = null;
	let bestRank = -1;
	for (const candidate of candidates) {
		if (!isSnapshot$1(candidate)) continue;
		const rank = rankSessionSnapshot(candidate);
		if (rank > bestRank) {
			best = candidate;
			bestRank = rank;
		}
	}
	return best;
};
/** LS/IDB beat a stale empty higher-epoch OPFS snapshot. */
var resolveLoadedSessionSnapshot = (local, idb, opfs) => {
	const quick = pickRichestSessionSnapshot(idb, local);
	if (sessionSnapshotHasContent(quick)) return quick;
	return pickRichestSessionSnapshot(opfs, quick);
};
/** Conversation mutation facade that persists every durable transition. */
var WorkCenterSession = class {
	persistence;
	state = emptySnapshot();
	persistGeneration = 0;
	persistTail = Promise.resolve();
	lastPersistedEpoch = 0;
	lastPersistedMessageCount = 0;
	hydrated = false;
	constructor(persistence) {
		this.persistence = persistence;
	}
	async hydrate() {
		const restored = await this.persistence.load();
		if (this.state.messages.length > 0) {
			this.markHydrated();
			return this.snapshot();
		}
		this.state = isSnapshot$1(restored) ? cloneSnapshot(restored) : emptySnapshot();
		this.markHydrated();
		if (this.state.messages.length > 0) this.persist().catch(() => void 0);
		return this.snapshot();
	}
	markHydrated() {
		this.hydrated = true;
		this.lastPersistedEpoch = this.state.epoch;
		this.lastPersistedMessageCount = this.state.messages.length;
		this.persistGeneration += 1;
	}
	snapshot() {
		return cloneSnapshot(this.state);
	}
	epoch() {
		return this.state.epoch;
	}
	latestPendingAssistant() {
		for (let index = this.state.messages.length - 1; index >= 0; index -= 1) {
			const message = this.state.messages[index];
			if (message?.role === "assistant" && message.status === "pending") return cloneMessage(message);
		}
		return null;
	}
	latestCompleteAssistant() {
		for (let index = this.state.messages.length - 1; index >= 0; index -= 1) {
			const message = this.state.messages[index];
			if (message?.role === "assistant" && message.status === "complete") return cloneMessage(message);
		}
		return null;
	}
	setDraft(draft) {
		this.state.draft = {
			content: String(draft.content || ""),
			attachments: (draft.attachments || []).map(cloneRef)
		};
	}
	async persistDraft() {
		await this.persist();
	}
	/**
	* Move the live draft into a user/assistant pair without waiting on OPFS.
	* WHY: A hung attachment `put` must not block the transcript from accepting Send/Enter.
	*/
	commitDraft(request) {
		const now = Date.now();
		const user = {
			id: createId("user"),
			role: "user",
			createdAt: now,
			content: this.state.draft.content,
			attachments: this.state.draft.attachments.map(cloneRef),
			status: "complete",
			request: { ...request }
		};
		const assistant = {
			id: createId("assistant"),
			role: "assistant",
			createdAt: now,
			content: "",
			attachments: [],
			status: "pending",
			request: { ...request },
			parentId: user.id
		};
		this.state.messages.push(user, assistant);
		this.state.draft = {
			content: "",
			attachments: []
		};
		return {
			user: cloneMessage(user),
			assistant: cloneMessage(assistant)
		};
	}
	async submitDraft(request) {
		const submitted = this.commitDraft(request);
		await this.persist();
		return submitted;
	}
	/** In-memory completion so the transcript can paint before OPFS save. */
	applyAssistantCompletion(id, completion) {
		let message = this.state.messages.find((entry) => entry.id === id && entry.role === "assistant");
		if (!message) for (let index = this.state.messages.length - 1; index >= 0; index -= 1) {
			const entry = this.state.messages[index];
			if (entry?.role === "assistant" && entry.status === "pending") {
				message = entry;
				break;
			}
		}
		if (!message) return null;
		message.status = completion.status;
		if (completion.content !== void 0) message.content = completion.content;
		if (completion.rawResult !== void 0) message.rawResult = slimRawResult(completion.rawResult);
		if (completion.error !== void 0) message.error = completion.error;
		return cloneMessage(message);
	}
	async completeAssistant(id, completion) {
		const message = this.applyAssistantCompletion(id, completion);
		if (!message) return null;
		await this.persist();
		return message;
	}
	async markAttachmentError(messageId, attachmentHash, error) {
		const attachment = this.state.messages.find((entry) => entry.id === messageId)?.attachments.find((entry) => entry.hash === attachmentHash);
		if (!attachment) return false;
		attachment.error = error;
		await this.persist();
		return true;
	}
	async retry(assistantId) {
		const original = this.state.messages.find((entry) => entry.id === assistantId && entry.role === "assistant");
		const user = original?.parentId ? this.state.messages.find((entry) => entry.id === original.parentId) : void 0;
		if (!original || !user) throw new Error("The original Work Center turn is unavailable");
		const assistant = {
			id: createId("assistant"),
			role: "assistant",
			createdAt: Date.now(),
			content: "",
			attachments: [],
			status: "pending",
			request: original.request ? { ...original.request } : void 0,
			parentId: user.id
		};
		this.state.messages.push(assistant);
		await this.persist();
		return {
			user: cloneMessage(user),
			assistant: cloneMessage(assistant)
		};
	}
	async cancel(assistantId) {
		return this.completeAssistant(assistantId, {
			status: "cancelled",
			content: "",
			error: "Cancelled"
		});
	}
	/** Visible note for share-target / AI results (legacy pipeline is not in the chat shell). */
	async appendAssistantNote(content) {
		const message = {
			id: createId("assistant"),
			role: "assistant",
			createdAt: Date.now(),
			content: String(content || "").trim(),
			attachments: [],
			status: "complete"
		};
		this.state.messages.push(message);
		await this.persist();
		return cloneMessage(message);
	}
	async newChat() {
		this.state = {
			...emptySnapshot(),
			epoch: this.state.epoch + 1
		};
		this.lastPersistedEpoch = this.state.epoch;
		this.lastPersistedMessageCount = 0;
		await this.persistence.clear();
		await this.persist({ allowEmpty: true });
	}
	persist(opts) {
		if (!this.hydrated && !opts?.allowEmpty) return this.persistTail;
		const generation = ++this.persistGeneration;
		const snapshot = this.snapshot();
		this.persistTail = this.persistTail.catch(() => void 0).then(async () => {
			if (generation !== this.persistGeneration) return;
			if (!opts?.allowEmpty && snapshot.messages.length === 0 && this.lastPersistedMessageCount > 0 && snapshot.epoch === this.lastPersistedEpoch) return;
			await this.persistence.save(snapshot);
			this.lastPersistedEpoch = snapshot.epoch;
			this.lastPersistedMessageCount = snapshot.messages.length;
		});
		return this.persistTail;
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterAttachmentIngress.ts
/**
* Work Center's single attachment mutation path.
*
* FIND:workcenter-attachment-ingress
* INVARIANT: The live draft receives a file before OPFS persistence, so a hung
* worker cannot hide an attachment the user just picked or dropped.
*/
var toRef = (ref) => ({ ...ref });
var asFile = (value) => {
	if (typeof File !== "undefined" && value instanceof File) return value;
	const blob = value;
	return new File([blob], String(value?.name || "attachment"), {
		type: String(value?.type || blob.type || "application/octet-stream"),
		lastModified: Number(value?.lastModified) || Date.now()
	});
};
var toHex = (bytes) => [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
var localHash = async (file) => {
	const bytes = await file.arrayBuffer();
	try {
		if (globalThis.crypto?.subtle) return toHex(await globalThis.crypto.subtle.digest("SHA-256", bytes));
	} catch {}
	let hash = 2166136261;
	for (const byte of new Uint8Array(bytes)) hash = Math.imul(hash ^ byte, 16777619);
	return `fnv-${(hash >>> 0).toString(16)}-${file.size}`;
};
var nameForUrl = (url) => {
	try {
		return new URL(url).hostname || "link";
	} catch {
		return "link";
	}
};
/** Owns draft attachment state, file identity, and preview URL lifecycle. */
var WorkCenterAttachmentIngress = class {
	options;
	previewUrls = /* @__PURE__ */ new WeakMap();
	filesByHash = /* @__PURE__ */ new Map();
	constructor(options) {
		this.options = options;
	}
	async addFiles(files) {
		const added = [];
		for (const incoming of files) {
			const file = asFile(incoming);
			const validation = validateReadableFileForIngress(file);
			if (!validation.ok) {
				this.options.onRejected?.(validation.reason || "Unsupported file");
				continue;
			}
			const hash = await localHash(file);
			const existing = this.options.state.draft.attachments.find((item) => item.hash === hash);
			if (existing || this.filesByHash.has(hash)) {
				added.push(existing || {
					hash,
					path: "",
					name: file.name || "attachment",
					type: file.type || "application/octet-stream",
					size: file.size,
					lastModified: file.lastModified || Date.now()
				});
				continue;
			}
			const ref = {
				hash,
				path: "",
				name: file.name || "attachment",
				type: file.type || "application/octet-stream",
				size: file.size,
				lastModified: file.lastModified || Date.now()
			};
			this.options.state.draft.attachments.push(ref);
			this.options.state.files.push(file);
			this.filesByHash.set(ref.hash, file);
			added.push(ref);
			this.persistInBackground(file, ref);
		}
		if (added.length) this.options.onChanged?.();
		return added;
	}
	async persistInBackground(file, ref) {
		try {
			const stored = toRef(await this.options.store.put(file));
			const draftRef = this.options.state.draft.attachments.find((item) => item.hash === ref.hash);
			if (!draftRef) return;
			if (this.options.state.draft.attachments.find((item) => item !== draftRef && item.hash === stored.hash)) {
				this.remove(ref.hash);
				return;
			}
			this.filesByHash.set(stored.hash, file);
			Object.assign(draftRef, stored);
			this.options.onChanged?.();
		} catch {
			try {
				const hash = await localHash(file);
				const draftRef = this.options.state.draft.attachments.find((item) => item.hash === ref.hash);
				if (draftRef && !this.filesByHash.has(hash)) draftRef.hash = hash;
				this.filesByHash.set(hash, file);
			} catch {}
		}
	}
	/** Store a URL as a local text file while retaining link-card metadata. */
	async addUrl(url) {
		try {
			const parsed = new URL(url);
			if (!["http:", "https:"].includes(parsed.protocol)) return null;
			const file = new File([parsed.toString()], `${nameForUrl(parsed.toString())}.url`, { type: "text/uri-list" });
			const [ref] = await this.addFiles([file]);
			if (!ref) return null;
			ref.url = parsed.toString();
			const draftRef = this.options.state.draft.attachments.find((item) => item.hash === ref.hash);
			if (draftRef) draftRef.url = ref.url;
			this.options.onChanged?.();
			return ref;
		} catch {
			this.options.onRejected?.("Invalid URL attachment");
			return null;
		}
	}
	async hydrate(refs) {
		const files = [];
		for (const ref of refs) {
			const file = await this.resolve(ref);
			if (!file) continue;
			files.push(file);
		}
		return files;
	}
	async resolve(ref) {
		const cached = this.filesByHash.get(ref.hash);
		if (cached) return cached;
		const file = await this.options.store.get(ref);
		if (file) this.filesByHash.set(ref.hash, file);
		return file;
	}
	remove(hash) {
		if (!hash) return;
		const file = this.filesByHash.get(hash);
		if (file) this.revokePreview(file);
		this.filesByHash.delete(hash);
		this.options.state.draft.attachments = this.options.state.draft.attachments.filter((attachment) => attachment.hash !== hash);
		this.options.state.files = this.options.state.draft.attachments.map((attachment) => this.filesByHash.get(attachment.hash)).filter((candidate) => Boolean(candidate));
		this.options.onChanged?.();
	}
	/** Blob URL for any stored file so the viewer can open PDFs and downloads, not only image thumbs. */
	objectUrlFor(file) {
		const existing = this.previewUrls.get(file);
		if (existing) return existing;
		try {
			const url = URL.createObjectURL(file);
			this.previewUrls.set(file, url);
			return url;
		} catch {
			return null;
		}
	}
	getPreviewUrl(file) {
		if (!file.type.startsWith("image/")) return null;
		return this.objectUrlFor(file);
	}
	revokePreview(file) {
		const url = this.previewUrls.get(file);
		if (url) URL.revokeObjectURL(url);
		this.previewUrls.delete(file);
	}
	revokeAllPreviews() {
		for (const file of this.filesByHash.values()) this.revokePreview(file);
	}
	fileFor(ref) {
		return this.filesByHash.get(ref.hash) || null;
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterSessionPersistence.ts
/**
* Durable adapter for the single persisted Work Center conversation.
*
* FIND:workcenter-session-persistence
* WHY: OPFS via the worker bridge times out on process.u2re.space; the
* transcript must still survive reload. File bytes stay content-addressed;
* this adapter never serializes File objects into JSON.
*/
var WORKCENTER_OPFS_NAMESPACE = "/user/workcenter";
var MANIFEST_PATH = "session.json";
var WORKCENTER_SESSION_IDB_NAME = "cwsp-workcenter";
var IDB_STORE = "kv";
var IDB_KEY = "session";
var WORKCENTER_SESSION_LS_KEY = "cwsp-workcenter-session-v1";
var isSnapshot = (value) => {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return candidate.version === 1 && Array.isArray(candidate.messages) && !!candidate.draft && typeof candidate.draft.content === "string" && Array.isArray(candidate.draft.attachments);
};
var readLocalSnapshot = () => {
	try {
		if (typeof localStorage === "undefined") return null;
		const raw = localStorage.getItem(WORKCENTER_SESSION_LS_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		return isSnapshot(parsed) ? parsed : null;
	} catch {
		return null;
	}
};
var writeLocalSnapshot = (snapshot) => {
	try {
		if (typeof localStorage === "undefined") return;
		if (!snapshot) {
			localStorage.removeItem(WORKCENTER_SESSION_LS_KEY);
			return;
		}
		localStorage.setItem(WORKCENTER_SESSION_LS_KEY, JSON.stringify(snapshot));
	} catch {}
};
var openSessionIdb = () => new Promise((resolve, reject) => {
	if (typeof indexedDB === "undefined") {
		reject(/* @__PURE__ */ new Error("IndexedDB unavailable"));
		return;
	}
	const req = indexedDB.open(WORKCENTER_SESSION_IDB_NAME, 1);
	req.onupgradeneeded = () => {
		const db = req.result;
		if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
	};
	req.onsuccess = () => resolve(req.result);
	req.onerror = () => reject(req.error || /* @__PURE__ */ new Error("IndexedDB open failed"));
});
var readIdbSnapshot = async () => {
	try {
		const db = await openSessionIdb();
		return await new Promise((resolve, reject) => {
			const tx = db.transaction(IDB_STORE, "readonly");
			const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
			req.onsuccess = () => {
				const value = req.result;
				resolve(isSnapshot(value) ? value : null);
			};
			req.onerror = () => reject(req.error);
			tx.oncomplete = () => db.close();
		});
	} catch {
		return null;
	}
};
var writeIdbSnapshot = async (snapshot) => {
	const db = await openSessionIdb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(IDB_STORE, "readwrite");
		const store = tx.objectStore(IDB_STORE);
		const req = snapshot ? store.put(snapshot, IDB_KEY) : store.delete(IDB_KEY);
		req.onerror = () => reject(req.error);
		tx.oncomplete = () => {
			db.close();
			resolve();
		};
		tx.onerror = () => reject(tx.error);
	});
};
var withTimeout = (task, ms, fallback) => Promise.race([task, new Promise((resolve) => {
	setTimeout(() => resolve(fallback), ms);
})]);
var createWorkCenterSessionPersistence = (store = createContentAddressedStore(WORKCENTER_OPFS_NAMESPACE)) => ({
	load: async () => {
		const local = readLocalSnapshot();
		const idb = await withTimeout(readIdbSnapshot(), 200, null);
		const quick = resolveLoadedSessionSnapshot(local, idb, null);
		if (sessionSnapshotHasContent(quick)) return quick;
		return resolveLoadedSessionSnapshot(local, idb, await withTimeout(store.readJson(MANIFEST_PATH).catch(() => null), 400, null));
	},
	save: async (snapshot) => {
		writeLocalSnapshot(snapshot);
		await withTimeout(writeIdbSnapshot(snapshot).catch(() => void 0), 250, void 0);
		store.writeJson(MANIFEST_PATH, snapshot).catch(() => void 0);
	},
	clear: async () => {
		writeLocalSnapshot(null);
		await withTimeout(writeIdbSnapshot(null).catch(() => void 0), 250, void 0);
		store.clear().catch(() => void 0);
	}
});
var createWorkCenterAttachmentStore = () => createContentAddressedStore(WORKCENTER_OPFS_NAMESPACE);
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterDocumentPreparation.ts
var extensionOf = (file) => file.name.split(".").pop()?.trim().toLowerCase() || "";
var kindOf = (file) => {
	const type = file.type.toLowerCase();
	const extension = extensionOf(file);
	if (type.startsWith("image/")) return "image";
	if (type.startsWith("text/") || [
		"json",
		"xml",
		"yaml",
		"yml",
		"toml",
		"ini",
		"cfg",
		"conf",
		"js",
		"ts",
		"tsx",
		"jsx",
		"css",
		"scss",
		"html",
		"htm",
		"md"
	].includes(extension)) return "text";
	if (type === "application/pdf" || extension === "pdf") return "pdf";
	if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || extension === "docx") return "docx";
	if (type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || extension === "xlsx") return "xlsx";
	return "unknown";
};
var dataUrlToFile = async (url, name) => {
	try {
		const blob = await (await fetch(url)).blob();
		return new File([blob], name, { type: blob.type || "image/png" });
	} catch {
		return null;
	}
};
var extractPdf = async (file) => {
	const [{ getDocument, GlobalWorkerOptions }, worker] = await Promise.all([import("../vendor/pdfjs-dist.js"), import("../vendor/pdfjs-dist2.js")]);
	if (!GlobalWorkerOptions.workerSrc) GlobalWorkerOptions.workerSrc = worker.default;
	const document = await getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
	const pages = [];
	for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
		const text = (await (await document.getPage(pageNumber)).getTextContent()).items.map((item) => "str" in item ? item.str : "").join(" ").trim();
		if (text) pages.push(`## Page ${pageNumber}\n${text}`);
	}
	return { text: pages.join("\n\n") };
};
var extractDocx = async (file) => {
	const mammothModule = await import("../vendor/underscore.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1));
	const html = (await (mammothModule.default ?? mammothModule).convertToHtml({ arrayBuffer: await file.arrayBuffer() })).value;
	const document = new DOMParser().parseFromString(html, "text/html");
	const images = await Promise.all([...document.querySelectorAll("img[src^='data:image/']")].map((image, index) => dataUrlToFile(image.getAttribute("src") || "", `${file.name.replace(/\.docx$/i, "")}-image-${index + 1}.png`)));
	return {
		text: document.body.textContent?.trim() || "",
		images: images.filter((image) => image instanceof File)
	};
};
var extractXlsx = async (file) => {
	const xlsxModule = await import("../vendor/xlsx.js");
	const xlsx = xlsxModule.default ?? xlsxModule;
	const workbook = xlsx.read(await file.arrayBuffer(), { type: "array" });
	return { text: workbook.SheetNames.map((name) => {
		const sheet = workbook.Sheets[name];
		return `## Sheet: ${name}\n${sheet ? xlsx.utils.sheet_to_csv(sheet) : ""}`.trim();
	}).filter(Boolean).join("\n\n") };
};
var defaultParsers = {
	pdf: extractPdf,
	docx: extractDocx,
	xlsx: extractXlsx
};
/** Local document preparation facade with injectable parsers for contract tests. */
var WorkCenterDocumentPreparer = class {
	parsers;
	constructor(parsers = {}) {
		this.parsers = {
			...defaultParsers,
			...parsers
		};
	}
	async prepare(original) {
		const kind = kindOf(original);
		try {
			if (kind === "image") return {
				original,
				kind,
				images: []
			};
			if (kind === "text") return {
				original,
				kind,
				fallbackText: await original.text(),
				images: []
			};
			if (kind === "unknown") return {
				original,
				kind,
				images: [],
				error: `Unsupported attachment type: ${original.type || original.name}`
			};
			const result = await this.parsers[kind](original);
			return {
				original,
				kind,
				fallbackText: result.text,
				images: result.images ?? []
			};
		} catch (error) {
			return {
				original,
				kind,
				images: [],
				error: error instanceof Error ? error.message : String(error)
			};
		}
	}
};
var isWorkCenterCommand = (value) => {
	if (!value || typeof value !== "object") return false;
	const type = String(value.type || "");
	return type === "hydrate" || type === "snapshot" || type === "draft.set" || type === "draft.commit" || type === "attach.add" || type === "attach.remove" || type === "turn.execute" || type === "turn.cancel" || type === "turn.retry" || type === "ingress.apply";
};
var isWorkCenterCommandEnvelope = (value) => {
	if (!value || typeof value !== "object") return false;
	const row = value;
	return row.type === "workcenter-command" && isWorkCenterCommand(row.command);
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenterCommandBus.ts
var channelNames = () => [BROADCAST_CHANNELS.WORK_CENTER, viewBroadcastChannelName("workcenter")];
var bindWorkCenterCommandBus = (handler) => {
	if (typeof BroadcastChannel === "undefined") return () => {};
	const channels = [];
	const onMessage = (event) => {
		const unwrapped = unwrapSwInteropMessage(event.data);
		const data = unwrapped ? unwrapped.type === "workcenter-command" && unwrapped.command ? {
			type: "workcenter-command",
			command: unwrapped.command
		} : unwrapped.command && isWorkCenterCommand(unwrapped.command) ? {
			type: "workcenter-command",
			command: unwrapped.command
		} : unwrapped.raw : event.data;
		const command = isWorkCenterCommandEnvelope(data) ? data.command : isWorkCenterCommand(data) ? data : null;
		if (!command) return;
		handler(command);
	};
	for (const name of channelNames()) try {
		const channel = new BroadcastChannel(name);
		channel.addEventListener("message", onMessage);
		channels.push(channel);
	} catch {}
	return () => {
		for (const channel of channels) try {
			channel.removeEventListener("message", onMessage);
			channel.close();
		} catch {}
	};
};
//#endregion
//#region ../../modules/views/workcenter-view/src/ts/WorkCenter.ts
configureMarkdownRendering();
/** Composer lives under `cw-shell-*` shadow — `document.querySelector` misses it. */
var queryLiveWorkCenterChats = () => {
	const out = [];
	const add = (node) => {
		if (!(node instanceof HTMLElement) || !node.isConnected) return;
		const host = (node.classList.contains("workcenter-chat") ? node : node.querySelector(".workcenter-chat")) || (node.querySelector("[data-workcenter-composer]") ? node : null);
		if (!host || out.includes(host)) return;
		if (!host.querySelector("[data-workcenter-transcript], [data-workcenter-composer]")) return;
		out.push(host);
	};
	if (typeof document === "undefined") return out;
	add(document.querySelector(".workcenter-chat"));
	document.querySelectorAll("cw-workcenter-view").forEach((ce) => {
		add(ce);
		add(ce.shadowRoot?.querySelector(".workcenter-chat") ?? null);
	});
	document.querySelectorAll("[data-shell], cw-shell-minimal, cw-shell-immersive, cw-shell-content, cw-shell-environment").forEach((shell) => {
		const sr = shell.shadowRoot;
		if (!sr) return;
		sr.querySelectorAll("cw-workcenter-view").forEach((ce) => {
			add(ce);
			add(ce.querySelector(".workcenter-chat"));
			add(ce.shadowRoot?.querySelector(".workcenter-chat") ?? null);
		});
		sr.querySelectorAll(".workcenter-chat, [data-workcenter-composer]").forEach((node) => {
			const chat = node.closest?.(".workcenter-chat") || node;
			add(chat);
		});
	});
	return out;
};
var WorkCenterManager = class {
	state;
	deps;
	ui;
	fileOps;
	shareTarget;
	templates;
	voice;
	actions;
	dataProcessing;
	attachments;
	prompts;
	results;
	history;
	events;
	session;
	attachmentIngress;
	documentPreparer;
	sessionReady;
	processedMessageIds = /* @__PURE__ */ new Set();
	deliveredResultKeys = /* @__PURE__ */ new Set();
	unbindCommandBus = () => {};
	unbindHeldIngress = () => {};
	unbindPagePersist = () => {};
	constructor(dependencies) {
		this.deps = dependencies;
		this.state = WorkCenterStateManager.createDefaultState();
		this.session = new WorkCenterSession(createWorkCenterSessionPersistence());
		this.attachmentIngress = new WorkCenterAttachmentIngress({
			state: this.state,
			store: createWorkCenterAttachmentStore(),
			onChanged: () => {
				this.session.setDraft(this.state.draft);
				this.session.persistDraft().catch(() => {
					this.deps.showMessage("Unable to save the attachment draft");
				});
				this.deps.onFilesChanged?.();
				this.paintLiveConversation("if-idle");
			},
			onRejected: (reason) => this.deps.showMessage(reason)
		});
		this.documentPreparer = new WorkCenterDocumentPreparer();
		this.sessionReady = this.hydrateSession();
		this.dataProcessing = new WorkCenterDataProcessing();
		this.templates = new WorkCenterTemplates(dependencies);
		this.voice = new WorkCenterVoice(dependencies);
		this.fileOps = new WorkCenterFileOps(dependencies);
		this.history = new WorkCenterHistory(dependencies);
		this.attachments = new WorkCenterAttachments(dependencies, this.fileOps);
		this.prompts = new WorkCenterPrompts(dependencies, this.templates, this.voice);
		this.results = new WorkCenterResults(dependencies, this.dataProcessing);
		this.ui = new WorkCenterUI(dependencies, this.attachments, this.prompts, this.results, this.history, {
			fileFor: (ref) => this.attachmentIngress.fileFor(ref),
			getPreviewUrl: (file) => this.attachmentIngress.getPreviewUrl(file)
		});
		this.shareTarget = new WorkCenterShareTarget(dependencies, this.fileOps, async (input) => this.handleIncomingContent(input, "text"));
		this.actions = new WorkCenterActions(dependencies, this.ui, this.fileOps, this.dataProcessing, this.results, this.history, this.templates, {
			session: this.session,
			attachments: this.attachmentIngress,
			documentPreparer: this.documentPreparer,
			syncFromSession: () => this.syncStateFromSession()
		});
		this.events = new WorkCenterEvents(dependencies, this.actions, this.templates, this.voice, this.history, this.attachmentIngress, this.state);
		this.unbindCommandBus = bindWorkCenterCommandBus((command) => this.dispatchCommand(command));
		this.unbindHeldIngress = onHeldIngressFiles((files) => {
			this.handleIncomingContent({
				files,
				fileCount: files.length
			}, "file");
		});
		this.unbindPagePersist = this.bindPagePersist();
		this.shareTarget.initShareTargetListener(this.state);
		registerComponent("workcenter-core", "workcenter");
		this.sessionReady.then(() => this.shareTarget.processQueuedMessages(this.state));
		const pendingMessages = initializeComponent("workcenter-core");
		for (const message of pendingMessages) {
			console.log(`[WorkCenter] Processing pending message:`, message);
			this.handleExternalMessage(message);
		}
		this.sessionReady.then(async () => {
			await replayQueuedMessagesForDestination("workcenter").catch(() => void 0);
			const held = takeHeldIngressFiles();
			if (held.length) await this.handleIncomingContent({
				files: held,
				fileCount: held.length
			}, "file");
		});
		if (typeof globalThis !== "undefined") globalThis?.addEventListener?.("hashchange", () => {
			this.attachments.updateDropHint?.();
		});
	}
	async hydrateSession() {
		try {
			const snapshot = await this.session.hydrate();
			if (snapshot.messages.length > 0 || Boolean(snapshot.draft.content) || snapshot.draft.attachments.length > 0) {
				const refs = [...snapshot.draft.attachments, ...snapshot.messages.flatMap((message) => message.attachments)];
				await this.attachmentIngress.hydrate(refs);
				this.state.files = snapshot.draft.attachments.map((ref) => this.attachmentIngress.fileFor(ref)).filter((file) => file !== null);
			} else if (this.state.draft.content) {
				this.session.setDraft(this.state.draft);
				await this.session.persistDraft();
			}
			this.syncStateFromSession(false);
			this.session.setDraft(this.state.draft);
		} catch (error) {
			console.warn("[WorkCenter] Failed to hydrate local session:", error);
			this.state.sessionHydrated = true;
		} finally {
			this.paintLiveConversation();
			if (typeof requestAnimationFrame === "function") requestAnimationFrame(() => this.paintLiveConversation());
		}
	}
	/** Prefer a connected chat root so GLit remounts do not steal the live composer. */
	adoptLiveRoot(root) {
		this.ui.setContainer(root);
		this.events.setContainer(root);
		this.events.bindLiveChats();
	}
	/** Paint transcript + draft on every live chat root and bind Send/Enter there. */
	paintLiveConversation(syncPrompt = "replace") {
		const hosts = this.liveChatHosts();
		let painted = false;
		for (const host of hosts) {
			if (!host.querySelector("[data-workcenter-transcript]")) continue;
			this.ui.paintConversation(this.state, host, syncPrompt);
			painted = true;
		}
		this.events.bindLiveChats();
		if (!painted) this.deps.render?.();
	}
	liveChatHosts() {
		const hosts = /* @__PURE__ */ new Set();
		const current = this.ui?.getContainer();
		if (current) hosts.add(current);
		for (const chat of queryLiveWorkCenterChats()) hosts.add(chat);
		return hosts;
	}
	/** Paint chips on every live chat root — GLit/shell remounts can leave a detached SoT node. */
	paintDraftAttachments() {
		this.paintLiveConversation();
	}
	syncStateFromSession(render = true) {
		const snapshot = this.session.snapshot();
		const liveAttachments = this.state.draft?.attachments || [];
		this.state.messages = snapshot.messages;
		this.state.draft = snapshot.draft;
		for (const ref of liveAttachments) if (!this.state.draft.attachments.some((item) => item.hash === ref.hash)) this.state.draft.attachments.push(ref);
		this.state.currentPrompt = snapshot.draft.content;
		this.state.sessionEpoch = snapshot.epoch;
		this.state.sessionHydrated = true;
		const last = [...snapshot.messages].reverse().find((message) => message.role === "assistant" && message.status === "complete" && message.content.trim());
		if (last) {
			this.state.lastRawResult = last.rawResult ?? last.content;
			this.state.recognizedData = {
				content: last.content,
				timestamp: last.createdAt,
				source: last.attachments.length ? "files" : "text",
				recognizedAs: "markdown",
				responseId: (() => {
					const raw = last.rawResult;
					if (!raw || typeof raw !== "object") return void 0;
					const id = raw.responseId;
					return typeof id === "string" ? id : void 0;
				})()
			};
		}
		this.deps.onFilesChanged?.();
		if (render) this.paintLiveConversation();
	}
	async whenSessionReady(ms = 400) {
		await Promise.race([this.sessionReady, new Promise((resolve) => {
			setTimeout(resolve, ms);
		})]);
	}
	async addFiles(files) {
		await this.whenSessionReady();
		await this.attachmentIngress.addFiles(files);
	}
	async setPrompt(prompt) {
		await this.sessionReady;
		this.state.draft.content = String(prompt || "");
		this.state.currentPrompt = this.state.draft.content;
		this.session.setDraft(this.state.draft);
		await this.session.persistDraft();
		this.deps.render?.();
	}
	async handleDroppedContent(content, sourceType) {
		await this.sessionReady;
		if (sourceType === "url") {
			await this.attachmentIngress.addUrl(content);
			return;
		}
		await this.appendDraftText(content);
	}
	async handlePastedContent(content, sourceType) {
		return this.handleDroppedContent(content, sourceType);
	}
	async appendDraftText(content) {
		const text = String(content || "").trim();
		if (!text) return;
		this.state.draft.content = [this.state.draft.content, text].filter(Boolean).join(this.state.draft.content ? "\n" : "");
		this.state.currentPrompt = this.state.draft.content;
		this.session.setDraft(this.state.draft);
		await this.session.persistDraft();
		this.deps.render?.();
	}
	async dispatchCommand(command) {
		await this.sessionReady;
		switch (command.type) {
			case "hydrate":
				await this.hydrateSession();
				return;
			case "snapshot": return;
			case "draft.set":
				this.session.setDraft(command.draft);
				this.state.draft = command.draft;
				this.state.currentPrompt = command.draft.content;
				this.paintLiveConversation("if-idle");
				return;
			case "draft.commit":
			case "turn.execute":
				await this.actions.executeUnifiedAction(this.state);
				return;
			case "attach.add":
				if (command.files?.length) await this.addFiles(command.files);
				return;
			case "attach.remove": {
				const next = (this.state.draft.attachments || []).filter((item) => item.hash !== command.hash);
				this.state.draft.attachments = next;
				this.session.setDraft(this.state.draft);
				this.paintLiveConversation("if-idle");
				return;
			}
			case "turn.cancel":
				await this.actions.cancelConversationTurn(this.state, command.assistantId);
				return;
			case "turn.retry":
				await this.actions.retryConversationTurn(this.state, command.assistantId);
				return;
			case "ingress.apply":
				await this.handleExternalMessage(command.payload);
				return;
			default: return;
		}
	}
	resultText(data) {
		if (data == null) return "";
		if (typeof data === "string") return data.trim();
		const row = data;
		return String(readProcessApiResultText(data) || row.content || row.text || (typeof row.data === "string" ? row.data : "") || "").trim();
	}
	rememberResult(text) {
		const key = text.replace(/\s+/g, " ").slice(0, 400);
		if (!key) return false;
		if (this.deliveredResultKeys.has(key)) return false;
		this.deliveredResultKeys.add(key);
		if (this.deliveredResultKeys.size > 32) {
			const first = this.deliveredResultKeys.values().next().value;
			if (first) this.deliveredResultKeys.delete(first);
		}
		return true;
	}
	/** Complete a waiting turn, or append a late SW / share result that missed the fetch. */
	async applyArrivedResult(note, raw, completePendingTurn) {
		if (!note) return;
		const pending = completePendingTurn ? this.session.latestPendingAssistant() : null;
		if (pending) {
			this.session.applyAssistantCompletion(pending.id, {
				status: "complete",
				content: note,
				rawResult: raw
			});
			this.rememberResult(note);
			this.session.persistDraft().catch(() => void 0);
			this.syncStateFromSession(true);
			return;
		}
		const last = this.session.latestCompleteAssistant();
		if (last && last.content.replace(/\s+/g, " ").trim() === note.replace(/\s+/g, " ").trim()) return;
		if (!this.rememberResult(note)) return;
		await this.session.appendAssistantNote(note);
		this.syncStateFromSession(true);
	}
	/** Normalize all channel/share payloads into the active conversation draft. */
	async handleIncomingContent(data, contentType) {
		const action = String(data?.hint?.action || data?.action || "").toLowerCase();
		if (action === "process") return;
		await this.whenSessionReady();
		try {
			const files = [];
			if (Array.isArray(data?.files)) {
				for (const entry of data.files) if (entry instanceof File) files.push(entry);
				else if (typeof Blob !== "undefined" && entry instanceof Blob) files.push(new File([entry], String(data?.filename || data?.title || `attachment-${Date.now()}`), { type: entry.type || "application/octet-stream" }));
			}
			if (data?.file instanceof File) files.push(data.file);
			if (typeof Blob !== "undefined" && data?.blob instanceof Blob) files.push(new File([data.blob], String(data.filename || `attachment-${Date.now()}.${contentType === "markdown" ? "md" : "txt"}`), { type: data.blob.type || "application/octet-stream" }));
			if (Array.isArray(data?.attachments)) for (const attachment of data.attachments) {
				const candidate = attachment?.data;
				if (candidate instanceof File) files.push(candidate);
				else if (typeof Blob !== "undefined" && candidate instanceof Blob) files.push(new File([candidate], String(attachment?.name || `attachment-${Date.now()}`), { type: candidate.type || "application/octet-stream" }));
			}
			if (!files.length) files.push(...takeHeldIngressFiles());
			const rawText = data?.text ?? data?.content;
			const text = rawText === void 0 || rawText === null ? "" : typeof rawText === "string" ? rawText : JSON.stringify(rawText, null, 2);
			if (!files.length && !isAndroidLocalShareUri(text) && !isAndroidLocalShareUri(typeof data?.url === "string" ? data.url : "") && (String(data?.filename || "").trim() || text.trim())) files.push(new File([text], String(data?.filename || data?.title || `shared-${Date.now()}.txt`), { type: contentType === "markdown" ? "text/markdown" : "text/plain" }));
			const attached = await this.attachmentIngress.addFiles(files);
			if (attached.length) dropHeldIngressFiles(files);
			if (typeof data?.url === "string" && !isAndroidLocalShareUri(data.url)) await this.attachmentIngress.addUrl(data.url);
			const source = String(data?.source || data?.route || "").toLowerCase();
			const shareLike = action === "attach" || /share|launch|capacitor|sku-handoff|open-with/.test(source);
			if (text.trim() && attached.length === 0 && !isAndroidLocalShareUri(text)) {
				if (shareLike) {
					const extra = await this.attachmentIngress.addFiles([new File([text], String(data?.filename || data?.title || `shared-${Date.now()}.txt`), { type: contentType === "markdown" ? "text/markdown" : "text/plain" })]);
					if (extra.length) {
						const live = queryLiveWorkCenterChats()[0];
						if (live) this.adoptLiveRoot(live);
						this.paintLiveConversation();
						this.deps.showMessage(extra.length === 1 ? `Attached ${extra[0]?.name || "file"}` : `Attached ${extra.length} files`);
					}
				} else await this.appendDraftText(text);
			}
			if (attached.length) {
				const live = queryLiveWorkCenterChats()[0];
				if (live) this.adoptLiveRoot(live);
				this.paintLiveConversation();
				this.deps.showMessage(attached.length === 1 ? `Attached ${attached[0]?.name || "file"}` : `Attached ${attached.length} files`);
			}
		} catch (error) {
			console.warn("[WorkCenter] Failed to attach incoming content:", error);
			this.deps.showMessage("Failed to attach content");
		}
	}
	/**
	* Public entry for Basic/Main unified-messaging handler and pending inbox replay.
	* Handles share-target inputs/results and general content-share attachment.
	*/
	async handleExternalMessage(message) {
		if (!message) return;
		if (isWorkCenterCommandEnvelope(message)) {
			await this.dispatchCommand(message.command);
			return;
		}
		const unwrapped = unwrapSwInteropMessage(message);
		if (unwrapped?.command && isWorkCenterCommand(unwrapped.command)) {
			await this.dispatchCommand(unwrapped.command);
			return;
		}
		if (unwrapped?.type) message = {
			...message && typeof message === "object" ? message : {},
			type: unwrapped.type,
			data: unwrapped.data ?? message.data
		};
		await this.sessionReady;
		const messageId = typeof message?.id === "string" ? message.id : "";
		if (messageId) {
			if (this.processedMessageIds.has(messageId)) return;
			this.processedMessageIds.add(messageId);
			if (this.processedMessageIds.size > 256) {
				const iter = this.processedMessageIds.values().next();
				if (!iter.done) this.processedMessageIds.delete(iter.value);
			}
		}
		if ((message.type === "share-target-input" || message.type === "share-received") && message.data) {
			await this.handleIncomingContent(message.data, message.contentType || "text");
			return;
		}
		if (message.type === "share-target-result") return;
		if ((message.type === "ai-result" || message.type === "process-api-result") && message.data) {
			const note = this.resultText(message.data);
			if (message.data.success !== false) await this.applyArrivedResult(note, message.data, true);
			await this.shareTarget.handleAIResult(this.state, {
				success: message.data.success !== false,
				data: note || message.data.data || message.data,
				error: message.data.error
			});
			this.ui.updateDataPipeline(this.state);
			this.paintLiveConversation();
			return;
		}
		if ((message.type === "content-share" || message.type === "content-attach" || message.type === "file-attach") && message.data) {
			await this.handleIncomingContent(message.data, message.contentType || "text");
			return;
		}
	}
	getState() {
		return this.state;
	}
	/** Flush transcript + draft when the Process PWA is backgrounded or reloaded. */
	bindPagePersist() {
		if (typeof window === "undefined") return () => {};
		const flush = () => {
			try {
				this.session.setDraft(this.state.draft);
				this.session.persistDraft();
			} catch {}
		};
		const onVisibility = () => {
			if (document.visibilityState === "hidden") flush();
		};
		window.addEventListener("pagehide", flush);
		document.addEventListener("visibilitychange", onVisibility);
		return () => {
			window.removeEventListener("pagehide", flush);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}
	destroy() {
		this.unbindCommandBus();
		this.unbindHeldIngress();
		this.unbindPagePersist();
		this.ui.setContainer(null);
		this.attachments.setContainer(null);
		this.prompts.setContainer(null);
		this.results.setContainer(null);
		this.history.setContainer(null);
		this.attachmentIngress.revokeAllPreviews();
		console.log("[WorkCenter] WorkCenterManager destroyed");
	}
	renderWorkCenterView() {
		const container = this.ui.renderWorkCenterView(this.state);
		this.events.setContainer(container);
		this.events.setupWorkCenterEvents();
		this.ui.updateFileList(this.state);
		this.ui.updateFileCounter(this.state);
		this.history.updateRecentHistory(this.state);
		this.templates.fillInstructionSelects(container, this.state);
		if (this.state.sessionHydrated) this.paintLiveConversation();
		return container;
	}
};
//#endregion
//#region ../../modules/views/workcenter-view/src/scss/_index.scss?inline
var _index_default = "@layer components{.code-highlight-overlay{box-sizing:border-box;color:light-dark(#1f2328,#e6edf3);color-scheme:inherit;display:block;margin:0;overflow:hidden;padding:0;pointer-events:none;user-select:none;-webkit-text-fill-color:initial;opacity:1;tab-size:4;visibility:visible;white-space:pre;z-index:1}.code-highlight-overlay,.code-highlight-overlay__gutter,.code-highlight-overlay__paint,.code-highlight-overlay__paint *{font-family:inherit;font-feature-settings:\"liga\" 0,\"clig\" 0,\"calt\" 0,\"dlig\" 0;font-kerning:none;font-size:inherit;font-stretch:inherit;font-style:inherit;font-synthesis:none;font-variant:inherit;font-variant-ligatures:none;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:max(1.35em,var(--code-line-height,1.45));tab-size:inherit;text-rendering:inherit;word-spacing:inherit;-webkit-text-fill-color:initial}.code-highlight-overlay__gutter{box-sizing:border-box;color:light-dark(#656d76,#8b949e);inline-size:var(--code-gutter,0);inset-block-start:0;inset-inline-start:0;overflow:hidden;padding-inline-end:.5rem;pointer-events:none;position:absolute;text-align:end;user-select:none;white-space:pre}.code-highlight-overlay__paint{margin:0;min-inline-size:0;overflow:visible;overflow-wrap:inherit;padding:0;white-space:inherit;word-break:inherit}.code-highlight-host:has(>.code-highlight-overlay),pre:has(>.code-highlight-overlay){position:relative}.code-highlight-inplace,.code-highlight-source-only,.code-highlight-source:not(textarea),pre>.code-highlight-source,pre>code{background:transparent!important;background-color:initial!important;border-radius:0;box-shadow:none;caret-color:light-dark(#1f2328,#e6edf3);display:block!important;font-feature-settings:\"liga\" 0,\"clig\" 0,\"calt\" 0,\"dlig\" 0;font-kerning:none;font-variant-ligatures:none;line-height:max(1.35em,var(--code-line-height,1.45));overflow-wrap:normal;padding-inline-start:var(--code-gutter,0);white-space:pre;word-break:normal}.code-highlight-host>.code-highlight-source.code-highlight-painted,.code-highlight-source.code-highlight-painted:has(+.code-highlight-overlay),pre:has(>.code-highlight-painted+.code-highlight-overlay)>code.code-highlight-painted{color:transparent;-webkit-text-fill-color:transparent}.code-highlight-host>.code-highlight-source.code-highlight-placeholder+.code-highlight-overlay,.code-highlight-source.code-highlight-placeholder+.code-highlight-overlay{opacity:.62}.code-highlight-source.code-highlight-inplace,.code-highlight-source.code-highlight-source-only{color:#e6edf3;color:light-dark(#1f2328,#e6edf3)}.code-highlight-source.code-highlight-inplace{-webkit-text-fill-color:unset}.code-highlight-overlay__paint,.code-highlight-overlay__paint *{font-style:normal;font-synthesis:none;font-weight:400}.code-highlight-source:not(.code-highlight-inplace)::selection,pre:has(>.code-highlight-overlay)>code:not(.code-highlight-inplace)::selection{background-color:color-mix(in oklab,#79c0ff 32%,transparent);color:transparent;-webkit-text-fill-color:transparent}pre[data-language]:not([data-language=\"\"]){position:relative}pre[data-language]:not([data-language=\"\"]):after{background:color-mix(in oklab,var(--md-bg-code,var(--view-code-bg,Canvas)) 70%,transparent);border-radius:var(--radius-xs,4px);color:light-dark(#656d76,#8b949e);content:attr(data-language);font-family:var(--md-font-sans,var(--font-family,sans-serif));font-size:.7em;inset-block-start:.35rem;inset-inline-end:.5rem;letter-spacing:.02em;line-height:1.2;padding:.1em .45em;pointer-events:none;position:absolute;text-transform:lowercase;z-index:2}.code-highlight-inplace [class*=\" hljs-\"],.code-highlight-inplace [class^=hljs-],.code-highlight-overlay [class*=\" hljs-\"],.code-highlight-overlay [class^=hljs-]{-webkit-text-fill-color:initial}.code-highlight-inplace .hljs-comment,.code-highlight-inplace .hljs-quote,.code-highlight-overlay .hljs-comment,.code-highlight-overlay .hljs-quote{color:#8b949e;color:light-dark(#656d76,#8b949e)}.code-highlight-inplace .hljs-built_in,.code-highlight-inplace .hljs-keyword,.code-highlight-inplace .hljs-literal,.code-highlight-inplace .hljs-selector-tag,.code-highlight-overlay .hljs-built_in,.code-highlight-overlay .hljs-keyword,.code-highlight-overlay .hljs-literal,.code-highlight-overlay .hljs-selector-tag{color:#79c0ff;color:light-dark(#0550ae,#79c0ff)}.code-highlight-inplace .hljs-addition,.code-highlight-inplace .hljs-attr,.code-highlight-inplace .hljs-string,.code-highlight-overlay .hljs-addition,.code-highlight-overlay .hljs-attr,.code-highlight-overlay .hljs-string{color:#a5d6ff;color:light-dark(#0a3069,#a5d6ff)}.code-highlight-inplace .hljs-number,.code-highlight-inplace .hljs-template-variable,.code-highlight-inplace .hljs-type,.code-highlight-inplace .hljs-variable,.code-highlight-overlay .hljs-number,.code-highlight-overlay .hljs-template-variable,.code-highlight-overlay .hljs-type,.code-highlight-overlay .hljs-variable{color:#3fb950;color:light-dark(#116329,#3fb950)}.code-highlight-inplace .hljs-name,.code-highlight-inplace .hljs-section,.code-highlight-inplace .hljs-title,.code-highlight-inplace .hljs-title.function_,.code-highlight-overlay .hljs-name,.code-highlight-overlay .hljs-section,.code-highlight-overlay .hljs-title,.code-highlight-overlay .hljs-title.function_{color:#79c0ff;color:light-dark(#0550ae,#79c0ff)}.code-highlight-inplace .hljs-attribute,.code-highlight-inplace .hljs-property,.code-highlight-inplace .hljs-selector-class,.code-highlight-inplace .hljs-selector-id,.code-highlight-overlay .hljs-attribute,.code-highlight-overlay .hljs-property,.code-highlight-overlay .hljs-selector-class,.code-highlight-overlay .hljs-selector-id{color:#7ee787;color:light-dark(#116329,#7ee787)}.code-highlight-inplace .hljs-doctag,.code-highlight-inplace .hljs-meta,.code-highlight-inplace .hljs-operator,.code-highlight-inplace .hljs-punctuation,.code-highlight-inplace .hljs-tag,.code-highlight-overlay .hljs-doctag,.code-highlight-overlay .hljs-meta,.code-highlight-overlay .hljs-operator,.code-highlight-overlay .hljs-punctuation,.code-highlight-overlay .hljs-tag{color:#c9d1d9;color:light-dark(#656d76,#c9d1d9)}:is(.code-highlight-inplace,.code-highlight-overlay) .hljs-deletion{color:#ffa198;color:light-dark(#cf222e,#ffa198)}.code-highlight-inplace .hljs-emphasis,.code-highlight-inplace .hljs-strong,.code-highlight-overlay .hljs-emphasis,.code-highlight-overlay .hljs-strong{color:inherit}}@layer overrides{::highlight(code-selection){background-color:color-mix(in oklab,#79c0ff 32%,transparent);color:inherit}::highlight(hljs-comment),::highlight(hljs-quote){color:#8b949e}::highlight(hljs-built_in),::highlight(hljs-keyword),::highlight(hljs-literal),::highlight(hljs-name),::highlight(hljs-section),::highlight(hljs-selector-tag),::highlight(hljs-title){color:#79c0ff}::highlight(hljs-addition),::highlight(hljs-attr),::highlight(hljs-string){color:#a5d6ff}::highlight(hljs-number),::highlight(hljs-template-variable),::highlight(hljs-type),::highlight(hljs-variable){color:#3fb950}::highlight(hljs-attribute),::highlight(hljs-property),::highlight(hljs-selector-class),::highlight(hljs-selector-id){color:#7ee787}::highlight(hljs-doctag),::highlight(hljs-meta),::highlight(hljs-operator),::highlight(hljs-punctuation),::highlight(hljs-tag){color:#c9d1d9}::highlight(hljs-deletion){color:#ffa198}@media print{.code-highlight-overlay{display:none!important}.code-highlight-host>.code-highlight-source,.code-highlight-source,.code-highlight-source.code-highlight-painted,pre:has(>.code-highlight-overlay)>code,pre[data-raw-target]>code{color:#111!important;-webkit-text-fill-color:#111!important}}}@layer utilities{@keyframes g{to{transform:rotate(1turn)}}@keyframes h{0%{opacity:0}to{opacity:1}}@keyframes i{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes j{0%,to{opacity:1;transform:scale(1)}50%{opacity:.82;transform:scale(.98)}}@keyframes k{0%,49%{opacity:1}50%,to{opacity:.25}}}@layer tokens{:is(html,body):has([data-view=workcenter]){--view-layout:\"grid\";--view-sidebar-visible:true;--view-toolbar-expanded:true;--view-content-max-width:none}}@layer base{cw-workcenter-view{block-size:100%;box-sizing:border-box;display:block;min-block-size:0;min-inline-size:0}.workcenter-view{animation:i .3s ease-out;background:var(--color-background);block-size:stretch;color:var(--color-on-background);contain:layout;container-type:size;display:grid;flex-direction:column;gap:var(--space-md);grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,max-content) minmax(0,1fr);inline-size:stretch;max-block-size:stretch;max-inline-size:stretch;min-block-size:0;min-inline-size:0;overflow-x:hidden;overflow-y:auto;padding-block:max(var(--space-md),env(safe-area-inset-top,0px)) max(var(--space-md),env(safe-area-inset-bottom,0px));padding-inline:max(var(--space-md),env(safe-area-inset-left,0px)) max(var(--space-md),env(safe-area-inset-right,0px));scrollbar-color:var(--color-outline-variant) transparent;scrollbar-width:thin}.workcenter-view :is(button,input,select,textarea){box-sizing:border-box;max-inline-size:100%}.workcenter-view select{appearance:none;-webkit-appearance:none;-moz-appearance:none;background-color:var(--color-surface-container);background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20stroke%3D%22%2394a3b8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E\");background-position:right var(--space-sm) center;background-repeat:no-repeat;background-size:1rem 1rem;border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);color:var(--color-on-surface);cursor:pointer;font-family:inherit;margin:0;padding-block:var(--space-sm);padding-inline:var(--space-sm) 2rem;transition:border-color var(--motion-fast,.15s ease),background-color var(--motion-fast,.15s ease)}@supports (color:contrast-color(red)){.workcenter-view select{color:contrast-color(var(--color-surface-container))}}.workcenter-view select:hover{background-color:var(--color-surface-container-high);border-color:color-mix(in oklab,var(--color-primary) 35%,var(--color-outline-variant));color:contrast-color(var(--color-surface-container-high))}.workcenter-view select:focus{outline:none}.workcenter-view select:focus-visible{border-color:var(--color-primary);box-shadow:0 0 0 2px color-mix(in oklab,var(--color-primary) 28%,transparent)}.workcenter-view select:disabled{cursor:not-allowed;opacity:.55}.workcenter-view button{flex-wrap:nowrap;overflow:hidden;text-align:center;text-decoration:none;text-overflow:ellipsis;text-rendering:auto;text-shadow:none;text-transform:none;text-wrap:nowrap;white-space:nowrap}.workcenter-view h3{padding:var(--space-sm)}@container (max-inline-size: 1024px){.workcenter-view{gap:var(--space-sm);padding:var(--space-sm)}}@container (max-inline-size: 768px){.workcenter-view{gap:var(--space-xs);padding:var(--space-xs)}}.workcenter-view::-webkit-scrollbar{inline-size:4px}.workcenter-view::-webkit-scrollbar-track{background:transparent}.workcenter-view::-webkit-scrollbar-thumb{background:var(--color-outline-variant);border-radius:2px}.workcenter-view::-webkit-scrollbar-thumb:hover{background:var(--color-outline)}.workcenter-view:focus-visible{outline:2px solid var(--color-primary);outline-offset:-2px}}@layer layout{.workcenter-content{block-size:stretch;contain:layout;flex:1;max-block-size:stretch;min-block-size:0;min-inline-size:0}.workcenter-layout{block-size:stretch;display:grid;flex-direction:column;gap:var(--space-md);grid-auto-flow:row;grid-auto-rows:minmax(min(8rem,100%),1fr);grid-template-columns:minmax(0,1fr);min-block-size:0}.workcenter-layout,.workcenter-layout>*{inline-size:stretch}.workcenter-block{block-size:stretch;display:flex;flex-basis:fit-content;flex-direction:column;flex-grow:1;flex-shrink:1;gap:var(--space-md);max-block-size:stretch;min-block-size:fit-content}.input-tabs-section,.prompts-block{grid-row:2;order:2}.results-block,.results-section{block-size:stretch;grid-row:1;max-block-size:stretch;order:1;overflow:hidden}.results-block,.results-section{flex-basis:fit-content;flex-grow:1;flex-shrink:1}.results-block{min-block-size:calc-size(fit-content,max(size,min(100%,16rem)))}.input-tabs-section,.results-section{align-items:stretch;flex-basis:fit-content;gap:var(--space-md);justify-content:stretch;place-content:stretch;place-items:stretch}.input-tabs-section,.results-section,.results-tabs-section{display:flex;flex-direction:column;flex-shrink:1;max-block-size:stretch;min-block-size:0}.input-tabs-section,.results-tabs-section{block-size:stretch;flex-basis:0;flex-grow:1;flex-wrap:nowrap;gap:var(--space-xs);min-inline-size:0;overflow:hidden}.input-tab-actions,.results-tab-actions{display:flex;gap:var(--space-xs)}.input-tab-actions,.input-tab-actions>*,.results-tab-actions,.results-tab-actions>*{flex-grow:0;flex-shrink:1;flex-wrap:nowrap;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.input-tab-actions>*,.results-tab-actions>*{inline-size:fit-content;max-inline-size:stretch;min-inline-size:0}.tab-btn{background:var(--color-surface-container-low);border:0 solid var(--color-outline-variant);border-radius:var(--radius-sm);color:var(--color-on-surface-variant);cursor:pointer;font-size:var(--text-sm);padding:var(--space-sm) var(--space-md)}.tab-btn.is-active{background:var(--color-primary);border-color:var(--color-primary);color:var(--color-on-primary)}.input-tab-panels,.results-tab-panels{block-size:stretch;display:flex;flex-basis:0;flex-direction:column;flex-grow:1;flex-shrink:1;inline-size:stretch;max-block-size:stretch;min-block-size:0;min-inline-size:0;place-content:stretch;align-content:stretch;justify-content:stretch;place-items:stretch;align-items:stretch;justify-items:stretch}.input-tab-panels{overflow-x:hidden;overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch}.results-tab-panels{flex-basis:fit-content;min-block-size:min(12rem,100%)}.results-tab-panel,.tab-panel{block-size:stretch;display:none;flex-basis:0;flex-grow:1;flex-shrink:1;inline-size:stretch;max-block-size:stretch;min-block-size:0;min-inline-size:0;place-content:stretch;align-content:stretch;justify-content:stretch;place-items:stretch;align-items:stretch;justify-items:stretch}.results-tab-panel.is-active,.tab-panel.is-active{display:flex;flex-direction:column;overflow:hidden}.results-tab-panel>*,.tab-panel>*{flex-basis:0;flex-grow:1;flex-shrink:1;inline-size:stretch;max-block-size:stretch;min-block-size:0;min-inline-size:0}.results-tab-panel,.results-tab-panel[data-results-tab-panel=history]>*,.results-tab-panel[data-results-tab-panel=output]>*,.results-tab-panel[data-results-tab-panel=pipeline]>*{flex-basis:fit-content}@container (min-inline-size: 1120px){.workcenter-layout{align-items:start;grid-auto-flow:row;grid-template-columns:minmax(0,1fr)}.results-block{order:1}.prompts-block{order:2}}}@layer components{.workcenter-header{background:var(--color-surface-container-low);border:1px solid var(--color-outline-variant);border-radius:var(--radius-lg);display:grid;gap:var(--space-sm);grid-template-columns:[logo] minmax(0,max-content) [controls] minmax(0,1fr);inset-block-start:0;padding:var(--space-xs) var(--space-md);place-content:center;justify-content:space-between;place-items:center;position:sticky;z-index:2}.workcenter-header h2{color:var(--color-on-surface);font-size:var(--text-base);font-weight:var(--font-weight-bold);grid-column:logo;letter-spacing:-.01em;margin:0;white-space:nowrap}@container (max-inline-size: 768px){.workcenter-header{gap:var(--space-sm);grid-template-columns:[logo] minmax(0,max-content) [controls] minmax(0,1fr);padding:var(--space-sm)}.workcenter-header h2{font-size:var(--text-sm)}}@container (max-inline-size: 480px){.workcenter-header{gap:var(--space-xs);grid-template-columns:[controls] minmax(0,1fr);padding:var(--space-xs)}.workcenter-header h2{display:none}}.header-controls{border:0;display:block;grid-column:controls;inline-size:stretch;justify-self:end;margin:0;max-inline-size:stretch;min-inline-size:0;padding:0}@container (max-inline-size: 768px){.header-controls{justify-self:stretch}}@media (max-width:768px){.header-controls{inline-size:100%;justify-self:stretch}}.control-selectors{align-items:start;background:var(--color-surface-container-low);border-radius:var(--radius-sm);display:grid;gap:var(--space-md);grid-template-columns:repeat(4,minmax(0,1fr));inline-size:stretch;justify-self:end;max-inline-size:min(min(100%,64rem),round(up,100%,32rem));padding:0}@container (max-inline-size: 1024px){.control-selectors{gap:var(--space-sm);grid-template-columns:repeat(2,minmax(0,1fr));padding:var(--space-sm)}}@container (max-inline-size: 900px){.control-selectors{gap:var(--space-sm);grid-template-columns:repeat(2,minmax(0,1fr));inline-size:stretch}}@container (max-inline-size: 768px){.control-selectors{background:var(--color-surface-container-low);border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);box-shadow:none;gap:var(--space-xs);grid-template-columns:repeat(2,minmax(0,1fr));inset:auto;max-block-size:none;overflow:visible;padding:var(--space-sm);position:static;z-index:auto}}@container (max-inline-size: 360px){.control-selectors{gap:var(--space-xs);grid-template-columns:minmax(0,1fr);inset-inline-end:calc(var(--space-xs) * -1);padding:var(--space-xs)}}.format-selector,.language-selector,.processing-selector,.recognition-selector{background:var(--color-surface);border-radius:var(--radius-sm);color:var(--color-on-surface);display:grid;font-family:var(--font-family);font-size:max(var(--text-sm),.875rem);font-weight:var(--font-weight-medium);gap:var(--space-sm);grid-template-columns:minmax(0,1fr) minmax(0,8rem);inline-size:stretch;max-inline-size:stretch;min-inline-size:fit-content;overflow:hidden;padding:var(--space-xs) var(--space-sm);place-content:center;place-items:center}:is(.format-selector,.language-selector,.processing-selector,.recognition-selector) select{font-size:.875rem;inline-size:100%;line-height:1.2;min-block-size:2.75rem;overflow:hidden;place-content:center;place-items:center;text-align:start;text-overflow:ellipsis;white-space:nowrap}:is(.format-selector,.language-selector,.processing-selector,.recognition-selector) label{color:var(--color-on-surface-variant);flex-wrap:nowrap;font-size:var(--text-xs);justify-self:end;max-inline-size:stretch;overflow:hidden;padding-inline:var(--space-md);place-content:center;place-items:center;text-align:end;text-overflow:ellipsis;white-space:nowrap}@container (max-inline-size: 768px){:is(.format-selector,.language-selector,.processing-selector,.recognition-selector) label{justify-self:start;text-align:start}}@container (max-inline-size: 900px){.format-selector,.language-selector,.processing-selector,.recognition-selector{font-size:var(--text-xs);gap:var(--space-xs);padding:var(--space-xs)}}@container (max-inline-size: 768px){.format-selector,.language-selector,.processing-selector,.recognition-selector{gap:var(--space-sm)}}@container (max-inline-size: 640px){.format-selector,.language-selector,.processing-selector,.recognition-selector{gap:var(--space-xs)}}.workcenter-view :where(button,input,select,textarea){font-size:.875rem;line-height:1.25}}@layer components{.prompt-panel{block-size:stretch;flex-basis:0;flex-grow:1;flex-shrink:1;max-block-size:stretch;min-block-size:0;min-inline-size:0}.prompt-panel,.prompt-section{border:none;border-radius:var(--radius-md);padding:0;position:relative}:is(.prompt-panel,.prompt-section)>:where(.wc-file-drop-overlay){inset:0;opacity:0;pointer-events:none;position:absolute;transition:all var(--motion-normal);visibility:hidden}:is(.prompt-panel,.prompt-section) .prompt-controls{align-items:center;display:flex;flex-wrap:wrap;gap:var(--space-md);place-content:center;place-items:center}@container (max-inline-size: 480px){:is(.prompt-panel,.prompt-section) .prompt-controls .btn-icon span{display:none}}:is(.prompt-panel,.prompt-section) .prompt-controls .icon-btn{align-items:center;background:var(--color-surface-container);block-size:40px;border:none;border-radius:var(--radius-sm);color:var(--color-on-surface);cursor:pointer;display:flex;inline-size:40px;justify-content:center;transition:all var(--motion-fast)}:is(.prompt-panel,.prompt-section) .prompt-controls .icon-btn ui-icon{transition:color var(--motion-fast)}:is(.prompt-panel,.prompt-section) .prompt-controls .icon-btn:hover{background:var(--color-surface-container-high);box-shadow:var(--elev-1)}:is(.prompt-panel,.prompt-section) .prompt-controls .icon-btn:hover ui-icon{color:var(--color-primary)}:is(.prompt-panel,.prompt-section) .prompt-controls .icon-btn:focus-visible{box-shadow:var(--focus-ring);outline:none}@container (max-inline-size: 768px){:is(.prompt-panel,.prompt-section) .prompt-controls .icon-btn{block-size:36px;inline-size:36px}}@container (max-inline-size: 480px){:is(.prompt-panel,.prompt-section) .prompt-controls .icon-btn{block-size:32px;inline-size:32px}}@container (max-inline-size: 768px){:is(.prompt-panel,.prompt-section) .prompt-controls{gap:var(--space-sm)}}@container (max-inline-size: 480px){:is(.prompt-panel,.prompt-section) .prompt-controls{align-items:stretch;gap:var(--space-sm)}}.template-select{background:var(--color-surface);border-radius:var(--radius-sm);color:var(--color-on-surface);cursor:pointer;flex:1;font-family:var(--font-family);font-size:var(--text-sm);font-weight:var(--font-weight-medium);min-block-size:36px;padding:var(--space-sm) var(--space-md)}.template-select:hover{background:var(--color-surface-container-high);border-color:var(--color-primary)}.template-select:focus{border-color:var(--color-primary);outline:none}@container (max-inline-size: 768px){.template-select{min-block-size:40px}}.instruction-selector-row{align-items:center;display:flex;gap:var(--space-sm);padding:var(--space-sm) 0}.instruction-selector-row .instruction-label{align-items:center;color:var(--color-on-surface-variant);display:flex;flex-shrink:0;font-size:var(--text-xs);font-weight:var(--font-weight-medium);gap:var(--space-xs);white-space:nowrap}.instruction-selector-row .instruction-label ui-icon{color:var(--color-primary);opacity:.8}.instruction-selector-row .instruction-select{background:var(--color-surface);border:1px solid var(--color-outline-variant);border-radius:var(--radius-sm);color:var(--color-on-surface);cursor:pointer;flex:1;font-family:var(--font-family);font-size:var(--text-xs);min-block-size:30px;padding:var(--space-xs) var(--space-sm);transition:border-color var(--motion-fast)}.instruction-selector-row .instruction-select:hover{background:var(--color-surface-container-high);border-color:var(--color-primary)}.instruction-selector-row .instruction-select:focus{border-color:var(--color-primary);box-shadow:0 0 0 2px color-mix(in oklab,var(--color-primary) 15%,transparent);outline:none}.instruction-selector-row .btn-sm{align-items:center;background:transparent;border:1px solid var(--color-outline-variant);border-radius:var(--radius-sm);color:var(--color-on-surface-variant);cursor:pointer;display:flex;flex-shrink:0;justify-content:center;min-block-size:28px;min-inline-size:28px;padding:var(--space-xs);transition:all var(--motion-fast)}.instruction-selector-row .btn-sm:hover{background:var(--color-surface-container-high);border-color:var(--color-primary);color:var(--color-primary)}@container (max-inline-size: 480px){.instruction-selector-row{flex-wrap:wrap}.instruction-selector-row .instruction-label{flex-basis:100%}}.prompt-input{background:var(--color-surface);block-size:100%;border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);color:var(--color-on-surface);flex:1 1 auto;flex-basis:0;flex-shrink:1;font-family:var(--font-family-system);font-size:var(--text-sm);inline-size:stretch;line-height:var(--leading-relaxed);max-block-size:100%;min-block-size:0;overflow-y:auto;padding:var(--space-sm) var(--space-md);resize:vertical;scrollbar-color:var(--color-outline-variant) transparent;scrollbar-width:thin}.prompt-input::placeholder{color:var(--color-on-surface-variant);opacity:.8}.prompt-input::-webkit-scrollbar{block-size:4px;inline-size:4px}.prompt-input::-webkit-scrollbar-thumb{background:var(--color-outline-variant)}.prompt-input:hover{background:var(--color-surface-container-low);box-shadow:var(--elev-1)}.prompt-input:focus{background:var(--color-surface-container-high);box-shadow:var(--focus-ring);outline:none}@container (max-inline-size: 1024px){.prompt-input{padding:var(--space-sm)}}@container (max-inline-size: 768px){.prompt-input{padding:var(--space-xs) var(--space-sm)}}.wc-file-drop-overlay{background:var(--color-surface-container-low);border:none;border-radius:var(--radius-md);box-shadow:var(--elev-1);inset:0;opacity:0;padding-block:var(--space-lg);padding-inline:var(--space-lg);pointer-events:none;position:absolute;transition:all var(--motion-normal);visibility:hidden;z-index:6}.wc-file-drop-overlay.drag-over{background:color-mix(in oklab,var(--color-primary) 10%,var(--color-surface-container-low));box-shadow:var(--focus-ring),var(--elev-2);opacity:1;visibility:visible}.wc-file-drop-overlay.drag-over .drop-zone-content{opacity:1;visibility:visible}@container (max-inline-size: 1024px){.wc-file-drop-overlay{padding-block:var(--space-md);padding-inline:var(--space-md)}}@container (max-inline-size: 768px){.wc-file-drop-overlay{padding-block:var(--space-sm);padding-inline:var(--space-sm)}}.prompt-input-group{block-size:stretch;display:flex;flex:1 1 auto;flex-basis:0;flex-direction:column;gap:var(--space-xl);inset:0;max-block-size:stretch;min-block-size:0;min-inline-size:0;place-content:center;place-items:stretch;position:relative}.prompt-input-group[data-dropzone]{position:relative;transition:all var(--motion-normal)}.prompt-input-group .file-drop-zone{align-items:center;display:flex;flex-direction:column;gap:var(--space-lg);pointer-events:none;position:relative;text-align:center}.prompt-input-group .file-drop-zone .drop-zone-content{align-items:center;display:flex;flex-direction:column;gap:var(--space-lg);justify-content:center;opacity:0;transition:all var(--motion-normal);visibility:hidden}.prompt-input-group .file-drop-zone .drop-zone-content .drop-icon{color:var(--color-primary);filter:drop-shadow(0 2px 8px rgba(0,0,0,.15));opacity:.8;transition:all var(--motion-normal)}@container (max-inline-size: 1024px){.prompt-input-group .file-drop-zone .drop-zone-content .drop-icon[size=\"4rem\"]{--icon-size:3.5rem;block-size:4rem;inline-size:4rem}}@container (max-inline-size: 768px){.prompt-input-group .file-drop-zone .drop-zone-content .drop-icon[size=\"4rem\"]{--icon-size:3rem;block-size:4rem;inline-size:4rem}}@container (max-inline-size: 480px){.prompt-input-group .file-drop-zone .drop-zone-content .drop-icon[size=\"4rem\"]{--icon-size:2.5rem;block-size:4rem;inline-size:4rem}}.prompt-input-group .file-drop-zone .drop-zone-content .drop-text{color:var(--color-on-surface);font-size:var(--text-xl);font-variant-emoji:text;font-weight:var(--font-weight-bold);letter-spacing:-.01em;line-height:var(--leading-tight);text-align:center}@container (max-inline-size: 1024px){.prompt-input-group .file-drop-zone .drop-zone-content .drop-text{font-size:var(--text-lg)}}@container (max-inline-size: 768px){.prompt-input-group .file-drop-zone .drop-zone-content .drop-text{font-size:var(--text-base)}}.prompt-input-group .file-drop-zone .drop-zone-content .drop-hint{color:var(--color-on-surface-variant);font-size:var(--text-sm);font-weight:var(--font-weight-medium);line-height:var(--leading-normal);max-inline-size:280px;opacity:.9;text-align:center}@container (max-inline-size: 768px){.prompt-input-group .file-drop-zone .drop-zone-content .drop-hint{font-size:var(--text-xs);max-inline-size:240px}}@container (max-inline-size: 1024px){.prompt-input-group .file-drop-zone .drop-zone-content{gap:var(--space-md)}}@container (max-inline-size: 768px){.prompt-input-group .file-drop-zone .drop-zone-content{gap:var(--space-sm)}}.prompt-input-group .wc-recognized-status{align-items:center;background:color-mix(in oklab,var(--color-success) 5%,transparent);border:none;border-radius:var(--radius-lg);box-shadow:var(--elev-1);color:var(--color-on-surface);display:flex;font-size:var(--text-sm);gap:var(--space-sm);margin-block-start:var(--space-md);padding:var(--space-sm) var(--space-md)}.prompt-input-group .wc-recognized-status .status-icon{color:var(--color-success);flex-shrink:0}.prompt-input-group .wc-recognized-status .clear-recognized{background:transparent;border:none;border-radius:var(--radius-full);box-shadow:none;color:var(--color-on-surface-variant);font-size:var(--text-xs);margin-inline-start:auto;min-block-size:28px;padding:var(--space-xs) var(--space-sm)}.prompt-input-group .wc-recognized-status .clear-recognized:hover{background:color-mix(in oklab,var(--color-error) 5%,transparent);color:var(--color-error)}.prompt-input-group .file-list{box-sizing:border-box;inline-size:stretch;margin-block-start:var(--space-md);max-inline-size:stretch;min-inline-size:0}.prompt-input-group .file-item{background:var(--color-surface-container);border:none;box-shadow:var(--elev-0);padding:var(--space-sm) var(--space-md)}.prompt-input-group .file-item:hover{background:var(--color-surface-container-high);box-shadow:var(--elev-1)}.prompt-input-group .file-info{gap:var(--space-md)}.prompt-input-group .file-icon{align-items:center;background:var(--color-surface-container-high);block-size:32px;border-radius:var(--radius-sm);display:flex;inline-size:32px;justify-content:center}.prompt-input-group .file-icon ui-icon{color:var(--color-primary)}@container (max-inline-size: 768px){.prompt-input-group .file-icon{block-size:28px;inline-size:28px}}.prompt-input-group .remove-btn{background:transparent;block-size:24px;border:none;color:var(--color-error);inline-size:24px;padding:0}.prompt-input-group .remove-btn:hover{background:color-mix(in oklab,var(--color-error) 20%,transparent);color:var(--color-error)}@container (max-inline-size: 1024px){.prompt-input-group{gap:var(--space-lg)}}@container (max-inline-size: 768px){.prompt-input-group{gap:var(--space-md)}}.action-section,.prompt-section,.prompts-section{background:var(--color-surface-container-low);border:1px solid var(--color-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);place-content:center;place-items:center;align-items:stretch}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions{display:grid;gap:var(--space-md);grid-template-columns:minmax(0,1fr) minmax(0,max-content);grid-template-rows:auto auto;place-self:stretch;align-self:stretch;box-sizing:border-box;inline-size:100%;max-inline-size:100%;min-inline-size:0;place-content:stretch;place-items:center}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .voice-btn{align-items:center;background:var(--color-surface-container-high);border:none;border-radius:var(--radius-xl);box-shadow:var(--elev-0);color:var(--color-on-surface);cursor:pointer;display:flex;font-size:var(--text-sm);font-weight:var(--font-weight-medium);grid-column:1;grid-row:1;inline-size:stretch;justify-content:center;min-block-size:44px;padding:var(--space-lg);transition:all var(--motion-normal)}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .voice-btn:hover{background:var(--color-surface-container-highest);box-shadow:var(--elev-1)}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .voice-btn:focus{box-shadow:var(--focus-ring);outline:none}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .voice-btn.recording{animation:j 1.5s infinite;background:var(--color-error);color:var(--color-on-error)}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .voice-btn.recording:before{animation:k 1s infinite;color:var(--color-on-error);content:\"●\";margin-inline-end:var(--space-sm)}@container (max-inline-size: 768px){:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .voice-btn{font-size:var(--text-xs);min-block-size:40px}}@container (max-inline-size: 480px){:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .voice-btn{min-block-size:36px;padding:var(--space-sm)}}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .auto-action-label{background:var(--color-surface-container);block-size:44px;border:none;border-radius:var(--radius-lg);box-shadow:var(--elev-0);cursor:pointer;display:flex;grid-column:2;grid-row:1;inline-size:44px;place-content:center;justify-content:center;padding:.5rem;place-items:center;transition:all var(--motion-fast)}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .auto-action-label>:not(ui-icon){display:none}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .auto-action-label ui-icon{color:var(--color-on-surface-variant);transition:all var(--motion-fast)}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .auto-action-label input[type=checkbox]{block-size:1px;inline-size:1px;margin:-1px;opacity:0;overflow:hidden;padding:0;position:absolute;clip:rect(0,0,0,0);border:0;white-space:nowrap}.action-section .prompt-actions .auto-action-label:has(input[type=checkbox]:checked),.prompt-section .prompt-actions .auto-action-label:has(input[type=checkbox]:checked),.prompts-section .prompt-actions .auto-action-label:has(input[type=checkbox]:checked),input[type=checkbox]:checked~.action-section .prompt-actions .auto-action-label,input[type=checkbox]:checked~.prompt-section .prompt-actions .auto-action-label,input[type=checkbox]:checked~.prompts-section .prompt-actions .auto-action-label{background:var(--color-primary);box-shadow:var(--elev-1)}.action-section .prompt-actions .auto-action-label:has(input[type=checkbox]:checked) ui-icon,.prompt-section .prompt-actions .auto-action-label:has(input[type=checkbox]:checked) ui-icon,.prompts-section .prompt-actions .auto-action-label:has(input[type=checkbox]:checked) ui-icon,input[type=checkbox]:checked~.action-section .prompt-actions .auto-action-label ui-icon,input[type=checkbox]:checked~.prompt-section .prompt-actions .auto-action-label ui-icon,input[type=checkbox]:checked~.prompts-section .prompt-actions .auto-action-label ui-icon{color:var(--color-on-primary)}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .auto-action-label:hover{background:var(--color-surface-container-high);box-shadow:var(--elev-1)}.action-section .prompt-actions .auto-action-label:hover:has(input[type=checkbox]:checked),.prompt-section .prompt-actions .auto-action-label:hover:has(input[type=checkbox]:checked),.prompts-section .prompt-actions .auto-action-label:hover:has(input[type=checkbox]:checked),input[type=checkbox]:checked~.action-section .prompt-actions .auto-action-label:hover,input[type=checkbox]:checked~.prompt-section .prompt-actions .auto-action-label:hover,input[type=checkbox]:checked~.prompts-section .prompt-actions .auto-action-label:hover{background:color-mix(in oklab,var(--color-primary) 90%,black)}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .auto-action-label:focus-within{box-shadow:var(--focus-ring);outline:none}@container (max-inline-size: 768px){:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .auto-action-label{block-size:40px;inline-size:40px}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .auto-action-label ui-icon[size=\"20\"]{--size:18px}}@container (max-inline-size: 480px){:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .auto-action-label{block-size:36px;inline-size:36px}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .auto-action-label ui-icon[size=\"20\"]{--size:16px}}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .action-btn{align-items:center;background:var(--color-primary);border:none;border-radius:var(--radius-md);color:var(--color-on-primary);cursor:pointer;display:flex;font-size:var(--text-sm);font-weight:var(--font-weight-medium);gap:var(--space-xs);grid-column:1;grid-row:2;inline-size:stretch;justify-content:center;max-inline-size:stretch;min-block-size:44px;padding:var(--space-md) var(--space-lg);transition:all var(--motion-normal)}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .action-btn:hover{background:color-mix(in oklab,var(--color-primary) 85%,black);box-shadow:var(--elev-1);transform:translateY(-1px)}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .action-btn:focus{box-shadow:var(--focus-ring);outline:none}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .action-btn:disabled{background:var(--color-surface-container-high);box-shadow:var(--elev-0);color:var(--color-on-surface-variant);cursor:not-allowed;transform:none}@container (max-inline-size: 768px){:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .action-btn ui-icon[size=\"20\"]{--icon-size:16px}}@container (max-inline-size: 640px){:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .action-btn .btn-text{display:none}}@container (max-inline-size: 768px){:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .action-btn{min-block-size:40px;padding:var(--space-sm) var(--space-md)}}@container (max-inline-size: 480px){:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .action-btn{font-size:var(--text-xs);min-block-size:36px;padding:var(--space-xs) var(--space-sm)}}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .clear-btn{align-items:center;aspect-ratio:auto;background:var(--color-surface-container);block-size:max-content;border:none;border-radius:var(--radius-md);color:var(--color-on-surface);cursor:pointer;display:flex;grid-column:2;grid-row:2;inline-size:stretch;justify-content:center;max-block-size:fit-content;max-inline-size:stretch;min-block-size:44px;min-block-size:2.5rem;min-inline-size:44px;transition:all var(--motion-fast)}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .clear-btn:hover{background:var(--color-error-container);color:var(--color-on-error-container)}:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .clear-btn:focus{box-shadow:var(--focus-ring);outline:none}@container (max-inline-size: 768px){:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .clear-btn{min-block-size:40px;min-inline-size:40px}}@container (max-inline-size: 480px){:is(.action-section,.prompt-section,.prompts-section) .prompt-actions .clear-btn{min-block-size:36px;min-inline-size:36px}}@container (max-inline-size: 1024px){.action-section,.prompt-section,.prompts-section{padding:var(--space-md)}}@container (max-inline-size: 768px){.action-section,.prompt-section,.prompts-section{padding:var(--space-sm)}}.prompt-panel{background:var(--color-surface-container-low);border:1px solid var(--color-outline-variant);border-radius:var(--radius-lg);padding:var(--space-lg);place-content:center;place-items:center;align-items:stretch}@container (max-inline-size: 1024px){.prompt-panel{padding:var(--space-md)}}@container (max-inline-size: 768px){.prompt-panel{padding:var(--space-sm)}}.wc-block-header{align-items:center;display:flex;flex-direction:row;flex-wrap:nowrap;gap:var(--space-md);inline-size:stretch;justify-content:space-between;max-inline-size:stretch}.wc-block-header h3{color:var(--color-on-surface);flex-basis:fit-content;flex-grow:1;flex-shrink:1;font-size:var(--text-lg);font-weight:var(--font-weight-medium);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wc-block-header .prompt-actions{align-items:center;flex-wrap:wrap;gap:var(--space-xs)}.instruction-panel,.prompt-panel{display:flex;flex-direction:column;gap:var(--space-md);min-block-size:0;min-inline-size:0}.instruction-panel .instruction-help{background:var(--color-surface-container-high);border-radius:var(--radius-sm);color:var(--color-on-surface-variant);font-size:var(--text-xs);padding:var(--space-sm)}.prompt-panel>.prompt-controls{flex:0 0 auto}.prompt-panel>.prompt-input-group{flex:1 1 auto;flex-basis:0;min-block-size:0;min-inline-size:0;overflow:hidden}.prompt-panel>.prompt-actions{align-content:flex-start;align-items:center;box-sizing:border-box;display:flex;flex:0 0 auto;flex-flow:row wrap;flex-grow:0;flex-shrink:0;gap:var(--space-sm);grid-template-columns:unset;grid-template-rows:unset;inline-size:100%;justify-content:flex-start;margin-block-start:auto;max-inline-size:100%;min-inline-size:0;padding-block-end:max(var(--space-xs),env(safe-area-inset-bottom,0px));place-items:center;place-self:stretch}.prompt-panel>.prompt-actions>*{grid-column:unset;grid-row:unset}.prompt-panel :is(.auto-action-label,.clear-btn,.prompt-attach-btn){flex:0 0 auto}.prompt-panel .voice-btn{flex:1 1 14rem;inline-size:auto;justify-content:center;max-inline-size:100%;min-inline-size:12rem}.prompt-panel .action-btn{flex:0 0 auto;min-inline-size:10.5rem}@container (max-inline-size: 760px){.prompt-panel .voice-btn{flex-basis:100%;min-inline-size:0}.prompt-panel .action-btn{flex:1 1 auto;min-inline-size:0}}.prompt-attach-btn{align-items:center;background:var(--color-surface-container);border:1px solid var(--color-outline-variant);display:inline-flex;gap:var(--space-xs);justify-content:center;min-block-size:44px;min-inline-size:44px}.prompt-attach-btn .attach-count{background:var(--color-primary-container);border-radius:var(--radius-full);color:var(--color-primary);font-size:var(--text-xs);font-weight:var(--font-weight-semibold);min-inline-size:1.35rem;padding:0 .35rem;text-align:center}.prompt-input-group[data-prompt-dropzone]{border:2px dashed transparent;border-radius:var(--radius-md);position:relative;transition:border-color var(--motion-fast),background-color var(--motion-fast)}.prompt-input-group[data-prompt-dropzone].drag-over{background:color-mix(in oklab,var(--color-primary) 7%,transparent);border-color:var(--color-primary)}.prompt-input-overlay{align-items:center;background:color-mix(in oklab,var(--color-primary) 12%,var(--color-surface-container-high));block-size:stretch;border-radius:var(--radius-sm);color:var(--color-on-surface);display:flex;gap:var(--space-xs);inline-size:stretch;inset:var(--space-xs);inset:0;justify-content:center;opacity:0;pointer-events:none;position:absolute!important;transition:opacity var(--motion-fast),visibility var(--motion-fast);visibility:hidden;z-index:3}.prompt-input-overlay.visible{opacity:1;visibility:visible}.prompt-actions .btn,.prompt-actions .clear-btn,.prompt-actions .icon-btn,.prompt-panel .btn,.prompt-panel .clear-btn,.prompt-panel .icon-btn{block-size:2.5rem;block-size:max-content;max-inline-size:fit-content;min-block-size:fit-content;min-inline-size:0;padding:var(--space-sm) var(--space-md)}.prompt-actions .clear-btn,.prompt-actions .voice-btn,.prompt-panel .clear-btn,.prompt-panel .voice-btn{aspect-ratio:auto;inline-size:auto;max-inline-size:stretch}.wc-attachments-section{block-size:fit-content;display:flex;flex-basis:fit-content;flex-grow:1;flex-shrink:1;max-block-size:stretch}.file-attachment-area,.wc-attachments-section{flex-direction:column;gap:var(--space-md);min-block-size:fit-content}.file-attachment-area{block-size:stretch;display:grid;flex:1;flex-basis:fit-content;flex-grow:1;flex-shrink:1;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:stretch;max-inline-size:stretch;min-inline-size:0;overflow-x:hidden;pointer-events:auto}.file-attachment-area>*{grid-area:1/1;grid-column:1/-1;grid-row:1/-1}.file-attachment-area .file-list{block-size:stretch;box-sizing:border-box;flex-basis:fit-content;flex-grow:1;flex-shrink:1;inline-size:stretch;max-inline-size:stretch;min-inline-size:0;pointer-events:none;z-index:2}.file-attachment-area .file-item{pointer-events:none}.file-attachment-area button{pointer-events:auto}.file-attachment-area .file-list:empty,.file-attachment-area .file-list:has(.wc-attachments-empty),.file-attachment-area:has(.file-list .file-item) .file-drop-zone{display:none!important;pointer-events:none!important;visibility:hidden!important}.file-drop-zone{align-items:center;block-size:stretch;border-radius:var(--radius-lg);cursor:pointer;display:flex;flex-basis:fit-content;flex-direction:column;flex-grow:1;flex-shrink:1;gap:var(--space-md);justify-content:center;min-block-size:8rem;overflow:auto;pointer-events:none;position:relative;transition:all var(--motion-normal)}[data-dropzone]{background:var(--color-surface-container-low);border:2px dashed color-mix(in oklab,var(--color-outline-variant) 40%,transparent);border-radius:var(--radius-sm)}[data-dropzone]:hover{background:color-mix(in oklab,var(--color-primary) 5%,var(--color-surface-container-low));border-color:color-mix(in oklab,var(--color-primary) 40%,transparent)}[data-dropzone].drag-over{background:color-mix(in oklab,var(--color-primary) 10%,var(--color-surface-container-low));border-color:var(--color-primary);box-shadow:var(--focus-ring)}[data-dropzone].drag-over:before{background:linear-gradient(45deg,color-mix(in oklab,var(--color-primary) 5%,transparent) 25%,transparent 25%,transparent 50%,color-mix(in oklab,var(--color-primary) 5%,transparent) 50%,color-mix(in oklab,var(--color-primary) 5%,transparent) 75%,transparent 75%);background-size:20px 20px;border-radius:inherit;content:\"\";inset:0;pointer-events:none;position:absolute;z-index:1}[data-dropzone].drag-over>*{position:relative;z-index:2}.drop-zone-content{align-items:center;block-size:max-content;display:flex;flex-direction:column;gap:var(--space-md);text-align:center}.drop-icon{color:var(--color-primary);opacity:.7}.drop-text{color:var(--color-on-surface);font-size:var(--text-lg);font-weight:500}.drop-hint{color:var(--color-on-surface-variant);font-size:var(--text-sm);opacity:.8}.file-list{block-size:max-content;box-sizing:border-box;flex:1;max-block-size:stretch;min-block-size:0;overflow-x:hidden;overflow-y:auto}.file-item,.file-list{inline-size:stretch;max-inline-size:stretch;min-inline-size:0}.file-item{align-items:center;align-self:safe center;background:var(--color-surface-container-high);border:1px solid var(--color-outline-variant);border-radius:var(--radius-sm);display:grid;gap:var(--space-sm);grid-template-columns:[info] minmax(0,1fr) [button] minmax(0,2rem);grid-template-rows:minmax(0,1fr);margin-block-end:var(--space-xs);overflow:hidden;padding:var(--space-sm);place-content:center;align-content:safe center;justify-content:safe center;place-items:center;justify-items:safe center}.file-item .file-info{grid-column:info;grid-row:1/-1}.file-item .remove-btn{aspect-ratio:auto;block-size:stretch;box-sizing:border-box;grid-column:button;grid-row:1/-1;inline-size:stretch;max-block-size:min(2rem,100%)!important;max-inline-size:min(2rem,100%)!important;padding:0}.file-item:hover{background:var(--color-surface-container-highest)}.file-info{align-self:safe center;display:grid;flex:1;gap:var(--space-sm);grid-template-columns:[icon] minmax(0,2rem) [details] minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:stretch;max-inline-size:stretch;min-inline-size:0;overflow:hidden;place-content:center;align-content:safe center;justify-content:safe center;place-items:center;justify-items:safe center;text-align:start;text-overflow:ellipsis;white-space:nowrap}.file-info :is(.file-icon,.file-preview){grid-column:icon;grid-row:1/-1}.file-info .file-details{grid-column:details;grid-row:1/-1}.file-info:has(.file-preview) .file-icon{display:none!important}.file-icon,.file-preview{flex-shrink:0}.file-preview{aspect-ratio:1/1;block-size:2rem;border-radius:var(--radius-sm);inline-size:2rem;object-fit:cover;object-position:center}.file-details{display:grid;gap:var(--space-xs);grid-template-columns:[name] minmax(0,1fr) [size] minmax(0,max-content) [type] minmax(0,max-content);grid-template-rows:minmax(0,1fr);inline-size:stretch;justify-self:start;max-inline-size:stretch;min-inline-size:fit-content;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.file-details .file-name{grid-column:name;grid-row:1/-1}.file-details .file-size{grid-column:size;grid-row:1/-1}.file-details .file-type{grid-column:type;grid-row:1/-1}.file-name{color:var(--color-on-surface);font-size:var(--text-sm);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.file-size,.file-type{color:var(--color-on-surface-variant);font-size:var(--text-xs)}.remove-btn{background:var(--color-error-container);border:none;border-radius:var(--radius-sm);color:var(--color-on-error-container);cursor:pointer;flex-shrink:0;font-size:var(--text-sm);line-height:1;padding:var(--space-xs)}.remove-btn:hover{background:var(--color-error);color:var(--color-on-error)}.wc-attachments-toolbar{align-items:center;display:flex;flex-wrap:wrap;gap:var(--space-sm) var(--space-md);justify-content:space-between}.file-actions{gap:var(--space-md);inline-size:auto;justify-content:flex-start;max-inline-size:100%;min-inline-size:max-content;place-self:center}.file-actions,.file-stats{align-items:center;display:flex}.file-stats{background:var(--color-surface-container-high);border:1px solid var(--color-outline-variant);border-radius:var(--radius-sm);flex-direction:row;flex-grow:1;flex-wrap:wrap;gap:var(--space-sm);padding:var(--space-sm)}.file-stats :is(.data-counter,.file-counter){align-items:center;border-radius:var(--radius-md);display:inline-flex;font-size:var(--text-sm);font-weight:var(--font-weight-medium);gap:var(--space-xs);inline-size:max-content;padding:var(--space-xs) var(--space-sm)}.file-stats :is(.data-counter,.file-counter) .count{min-inline-size:1ch;text-align:center}.file-stats .file-counter{background:var(--color-surface-container-high);border:1px solid color-mix(in oklab,var(--color-outline-variant) 30%,transparent);color:var(--color-on-surface-variant);min-inline-size:calc-size(fit-content,max(size,25px) + .5rem + var(--icon-size,1rem))}.file-stats .file-counter ui-icon{color:var(--color-primary);opacity:.8}.file-stats .file-counter .count{color:var(--color-primary);font-weight:600}.file-stats .file-counter .label{font-size:var(--text-xs)}}@layer components{.file-stats .file-counter:has(.count:empty),.file-stats .file-counter:has(.count:not([data-count]):not(:has-text):not([data-count=\"0\"]):not(:has(.count:empty))){display:none}.file-stats .data-counter{min-inline-size:1.5rem}.file-stats .data-counter ui-icon{font-size:var(--text-sm)}.file-stats .data-counter.recognized{background:var(--color-secondary-container);border:1px solid var(--color-secondary)}.file-stats .data-counter.recognized,.file-stats .data-counter.recognized ui-icon{color:var(--color-on-secondary-container)}.file-stats .data-counter.processed{background:var(--color-tertiary-container);border:1px solid var(--color-tertiary)}.file-stats .data-counter.processed,.file-stats .data-counter.processed ui-icon{color:var(--color-on-tertiary-container)}.wc-recognized-status{align-items:center;background:color-mix(in oklab,var(--color-tertiary) 10%,var(--color-surface-container-high));border:1px solid color-mix(in oklab,var(--color-tertiary) 30%,transparent);border-radius:var(--radius-sm);color:var(--color-on-surface-variant);display:flex;font-size:var(--text-sm);gap:var(--space-sm);padding:var(--space-sm)}.wc-recognized-status .status-icon{color:var(--color-tertiary);flex-shrink:0}.wc-recognized-status .clear-recognized{background:var(--color-tertiary-container);border:none;border-radius:var(--radius-sm);color:var(--color-on-tertiary-container);cursor:pointer;font-size:var(--text-xs);margin-inline-start:auto;padding:var(--space-xs) var(--space-sm)}.wc-recognized-status .clear-recognized:hover{background:var(--color-tertiary);color:var(--color-on-tertiary)}.wc-output-section{block-size:fit-content;display:flex;flex-basis:fit-content;flex-direction:column;flex-grow:1;flex-shrink:1;gap:var(--space-md);max-block-size:stretch;min-block-size:fit-content;overflow:hidden;place-content:center;align-content:stretch;justify-content:stretch;place-items:center}.wc-output-section>*{inline-size:stretch}.wc-output-content{background:var(--color-surface-container-low);block-size:min(10rem,100%);block-size:fit-content;border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);color:var(--color-on-surface);contain:strict;display:flex;flex-basis:fit-content;flex-direction:column;flex-grow:1;flex-shrink:1;font-family:var(--font-family);gap:var(--space-md);line-height:1.6;max-block-size:stretch;min-block-size:fit-content;overflow:auto;padding:var(--space-md);position:relative;text-wrap:pretty;transition:all var(--motion-normal)}.wc-output-content:has(.result-content){min-block-size:10rem}.wc-output-content[data-dropzone]{background:var(--color-surface-container-low);border:2px dashed color-mix(in oklab,var(--color-outline-variant) 30%,transparent);min-block-size:6rem;padding:var(--space-md)}.wc-output-content[data-dropzone]:has(.result-content){border-color:var(--color-outline-variant);border-style:solid;min-block-size:10rem}.wc-output-content[data-dropzone]:hover{background:color-mix(in oklab,var(--color-primary) 5%,var(--color-surface-container-low));border-color:color-mix(in oklab,var(--color-primary) 40%,transparent)}.wc-output-content[data-dropzone].drag-over{background:color-mix(in oklab,var(--color-primary) 10%,var(--color-surface-container-low));border-color:var(--color-primary);box-shadow:var(--focus-ring)}.wc-output-content[data-dropzone].drag-over:before{background:linear-gradient(45deg,color-mix(in oklab,var(--color-primary) 5%,transparent) 25%,transparent 25%,transparent 50%,color-mix(in oklab,var(--color-primary) 5%,transparent) 50%,color-mix(in oklab,var(--color-primary) 5%,transparent) 75%,transparent 75%);background-size:20px 20px;border-radius:inherit;content:\"\";inset:0;pointer-events:none;position:absolute;z-index:1}.wc-output-content[data-dropzone].drag-over>*{position:relative;z-index:2}.history-section .result-actions,.pipeline-actions,.step-actions,.wc-output-actions{align-items:center;display:flex;gap:var(--space-xs)}.pipeline-actions .btn,.wc-output-actions .btn{font-size:var(--text-sm);min-inline-size:auto;padding:var(--space-xs) var(--space-sm)}.results-tabs-header{align-items:center;display:flex;flex-wrap:nowrap;gap:var(--space-sm);justify-content:flex-start;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.results-tabs-header h3{color:var(--color-on-surface);font-size:var(--text-lg);font-weight:600;margin:0;white-space:nowrap}.results-tab-actions{margin-inline-start:var(--space-sm)}.wc-output-header{display:flex;justify-content:flex-end;margin-inline-start:auto}.step-actions{margin-block-start:var(--space-xs)}.step-actions .btn{font-size:var(--text-xs);min-inline-size:auto;padding:var(--space-xs) var(--space-sm)}.history-section{block-size:fit-content;display:flex;flex-basis:fit-content;flex-direction:column;flex-grow:1;flex-shrink:1;gap:var(--space-sm);max-block-size:stretch}.history-section .result-actions .btn{font-size:var(--text-xs);min-inline-size:auto;padding:var(--space-xs) var(--space-sm)}.result-content{background:var(--color-surface-container-high);border-radius:var(--radius-md);color:var(--color-on-surface);font-family:var(--font-family);line-height:1.6;overflow-wrap:break-word;padding:var(--space-md);word-wrap:break-word}.result-content pre{background:var(--color-surface-container-low);border:1px solid var(--color-outline);border-radius:var(--radius-sm);font-family:var(--font-family-mono);font-size:var(--text-sm);line-height:1.4;margin:var(--space-sm) 0;overflow-x:auto;padding:var(--space-sm)}.result-content pre code{background:transparent;border:none;border-radius:0;font-size:inherit;padding:0}.result-content code{background:var(--color-surface-container-low);border:1px solid var(--color-outline);border-radius:var(--radius-sm);color:var(--color-on-surface);font-family:var(--font-family-mono);font-size:.875em;padding:.125em .25em}.result-content .katex{font-size:1em}.result-content .katex-display{margin:var(--space-md) 0;text-align:center}.result-content table{background:var(--color-surface-container-high);border:1px solid var(--color-outline);border-collapse:collapse;border-radius:var(--radius-md);inline-size:100%;margin:var(--space-md) 0;overflow:hidden}.result-content table :is(td,th){border-block-end:1px solid var(--color-outline);border-inline-end:1px solid var(--color-outline);padding:var(--space-sm);text-align:start}.result-content table td:last-child,.result-content table th:last-child{border-inline-end:none}.result-content table th{background:var(--color-surface-container-low);color:var(--color-on-surface);font-weight:600}.result-content table tr:last-child td{border-block-end:none}.result-content :is(ol,ul){margin:var(--space-sm) 0;padding-inline-start:var(--space-lg)}.result-content :is(ol,ul) li{line-height:1.6;margin:var(--space-xs) 0}.result-content blockquote{background:color-mix(in oklab,var(--color-primary) 5%,var(--color-surface-container-low));border-inline-start:4px solid var(--color-primary);border-radius:0 var(--radius-sm) var(--radius-sm) 0;color:var(--color-on-surface-variant);font-style:italic;margin:var(--space-md) 0;padding:var(--space-sm) var(--space-md)}.result-content a{color:var(--color-primary);text-decoration:underline}.result-content a:hover{background:color-mix(in oklab,var(--color-primary) 10%,transparent);color:var(--color-primary-container)}.result-content a:focus{outline:2px solid var(--color-primary);outline-offset:2px}.result-content img{block-size:auto;border-radius:var(--radius-sm);margin:var(--space-sm) 0;max-inline-size:100%}.result-content :is(h1,h2,h3,h4,h5,h6){color:var(--color-on-surface);line-height:1.3;margin:var(--space-lg) 0 var(--space-sm)}.result-content h1:first-child,.result-content h2:first-child,.result-content h3:first-child,.result-content h4:first-child,.result-content h5:first-child,.result-content h6:first-child{margin-block-start:0}.result-content h1{font-size:var(--text-3xl);font-weight:700}.result-content h2{font-size:var(--text-2xl);font-weight:600}.result-content h3{font-size:var(--text-xl);font-weight:600}.result-content h4{font-size:var(--text-lg);font-weight:600}.result-content h5{font-size:var(--text-base);font-weight:600}.result-content h6{font-size:var(--text-sm);font-weight:600}.result-content p{margin:var(--space-sm) 0}.result-content p:first-child{margin-block-start:0}.result-content p:last-child{margin-block-end:0}.result-content hr{border:none;border-block-start:1px solid var(--color-outline);margin:var(--space-lg) 0}.code-result,.raw-result{background:var(--color-surface-container-low);block-size:max-content;border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);color:var(--color-on-surface);font-family:var(--font-family-mono);font-size:var(--text-sm);inline-size:stretch;line-height:1.5;margin:0;max-block-size:calc-size(max-content,min(size,100%));max-inline-size:stretch;min-inline-size:calc-size(fit-content,min(size,100%));overflow:auto;overflow-x:auto;padding:var(--space-md);white-space:pre}.code-result,.data-pipeline-section,.raw-result{min-block-size:calc-size(fit-content,min(size,100%));overflow-y:auto;scrollbar-color:var(--color-outline-variant) transparent;scrollbar-width:thin}.data-pipeline-section{block-size:stretch;contain:strict;container-type:size;display:flex;flex-direction:column;gap:var(--space-sm);max-block-size:stretch;overflow-x:hidden}.pipeline-header{align-items:center;block-size:max-content;display:flex;gap:var(--space-sm);inline-size:stretch;justify-content:space-between;margin-block-end:var(--space-sm);max-block-size:fit-content;min-block-size:calc-size(fit-content,min(size,100%));overflow:hidden;text-overflow:ellipsis}.pipeline-header h3{color:var(--color-on-surface);font-size:var(--text-base);font-weight:600;margin:0}.pipeline-content{block-size:max-content;display:flex;flex-direction:column;gap:var(--space-sm);inline-size:stretch;max-block-size:fit-content;min-block-size:calc-size(fit-content,min(size,100%));overflow:hidden}.pipeline-actions{justify-content:flex-end}.pipeline-steps{gap:var(--space-md)}.pipeline-step,.pipeline-steps{block-size:max-content;display:flex;flex-direction:column;inline-size:stretch;max-block-size:fit-content;min-block-size:calc-size(fit-content,min(size,100%));overflow:hidden}.pipeline-step{background:var(--color-surface-container-high);border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);gap:var(--space-sm);padding:var(--space-sm);text-overflow:ellipsis;transition:all var(--motion-fast)}.pipeline-step:hover{background:var(--color-surface-container-highest);border-color:var(--color-primary)}.pipeline-step.recognized-step{background:color-mix(in oklab,var(--color-secondary) 5%,var(--color-surface-container-high));border-color:var(--color-secondary)}.pipeline-step.processed-step{background:color-mix(in oklab,var(--color-tertiary) 5%,var(--color-surface-container-high));border-color:var(--color-tertiary)}.step-header{align-items:center;display:flex;flex-wrap:wrap;gap:var(--space-sm)}.step-icon{color:var(--color-primary);flex-shrink:0}.step-title{color:var(--color-on-surface);flex:1;font-size:var(--text-sm);font-weight:600}.step-format,.step-source,.step-time{color:var(--color-on-surface-variant);font-size:var(--text-xs)}.step-content{border-inline-start:2px solid var(--color-outline);padding-inline-start:var(--space-lg)}.step-preview{color:var(--color-on-surface-variant);display:-webkit-box;font-size:var(--text-sm);-webkit-line-clamp:3;line-height:1.4;-webkit-box-orient:vertical;overflow:hidden}.history-header{align-items:center;background:var(--color-surface-container-high);border-radius:var(--radius-md);display:grid;gap:var(--space-md);grid-template-columns:1fr max-content;max-block-size:stretch;padding:var(--space-sm) var(--space-md)}.history-header h4{color:var(--color-on-surface);font-size:var(--text-base);font-weight:var(--font-weight-semibold);letter-spacing:-.01em;margin:0}.recent-history{display:flex;flex-direction:column;gap:var(--space-xs);max-block-size:min(300px,100%);max-block-size:stretch;overflow-y:auto}.history-item-compact{align-items:center;background:var(--color-surface-container-high);border:1px solid var(--color-outline-variant);border-radius:var(--radius-sm);display:flex;gap:var(--space-sm);justify-content:space-between;max-block-size:stretch;padding:var(--space-sm);transition:all var(--motion-fast)}.history-item-compact:hover{background:var(--color-surface-container-highest);border-color:var(--color-primary)}.history-meta{align-items:center;display:flex;flex:1;gap:var(--space-sm);max-block-size:stretch;min-inline-size:0}.history-status{flex-shrink:0;font-size:var(--text-sm);font-weight:600;max-block-size:stretch}.history-status.success{color:var(--color-tertiary)}.history-status.error{color:var(--color-error)}.history-prompt{color:var(--color-on-surface);flex:1;font-size:var(--text-sm);max-block-size:stretch;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.history-time{flex-shrink:0;font-size:var(--text-xs);max-block-size:stretch}.history-time,.wc-loading{color:var(--color-on-surface-variant)}.wc-loading{align-items:center;display:flex;font-size:var(--text-base);gap:var(--space-sm);justify-content:center;padding:var(--space-xl)}.wc-loading:before{animation:g 1s linear infinite;block-size:20px;border:2px solid var(--color-primary);border-block-start-color:transparent;border-radius:50%;content:\"\";inline-size:20px}.error{background:color-mix(in oklab,var(--color-error) 10%,var(--color-surface-container-high));border:1px solid var(--color-error);border-radius:var(--radius-md);color:var(--color-error);font-size:var(--text-sm);padding:var(--space-md)}.wc-attachments-empty,.wc-history-empty,.wc-results-empty{align-items:center;color:var(--color-on-surface-variant);display:flex;font-size:var(--text-sm);font-style:italic;justify-content:center;padding:var(--space-lg)}.wc-results-empty{font-size:var(--text-base);padding:var(--space-xl)}}@layer components{@container (max-inline-size: 768px){.results-tabs-header h3{display:none}.results-tab-actions{inline-size:auto;margin-inline-start:0}.results-tab-actions .tab-btn{flex:initial}.result-content{padding:var(--space-sm)}.step-header{align-items:flex-start;flex-direction:column;gap:var(--space-xs)}.history-header h4{font-size:var(--text-sm)}}}@layer components{.workcenter-chat{background:transparent;block-size:100%;container-type:inline-size;display:grid;gap:var(--space-md);grid-template-rows:auto minmax(0,1fr) auto;isolation:isolate;min-block-size:0;overflow:hidden;padding:max(var(--space-md),env(safe-area-inset-top,0px)) max(var(--space-md),env(safe-area-inset-right,0px)) max(var(--space-md),env(safe-area-inset-bottom,0px)) max(var(--space-md),env(safe-area-inset-left,0px));position:relative}.workcenter-chat .workcenter-header{align-items:center;background:transparent;border:0;border-radius:0;display:flex;gap:var(--space-sm);justify-content:space-between;padding:0;position:static}.workcenter-chat .workcenter-header h2{font-size:var(--text-lg);font-weight:var(--font-weight-semibold)}.workcenter-header__actions,.workcenter-message__actions{align-items:center;display:inline-flex;gap:var(--space-xs)}.wc-chip-remove,.wc-icon-button,.wc-quiet-button{align-items:center;background:transparent;border:0;border-radius:var(--radius-full);color:var(--color-on-surface-variant);cursor:pointer;display:inline-flex;justify-content:center;min-block-size:var(--touch-min);min-inline-size:var(--touch-min);padding:var(--space-sm);transition:background-color var(--transition-fast),color var(--transition-fast),box-shadow var(--transition-fast)}.wc-chip-remove:hover,.wc-icon-button:hover,.wc-quiet-button:hover{background:color-mix(in oklab,var(--color-on-surface) var(--state-opacity-hover),transparent);color:var(--color-on-surface)}.wc-chip-remove:focus-visible,.wc-icon-button:focus-visible,.wc-quiet-button:focus-visible{box-shadow:var(--focus-ring);outline:0}.wc-send-button{background:var(--color-primary);color:var(--color-on-primary)}.wc-send-button:hover{background:var(--color-primary-hover);color:var(--color-on-primary)}.wc-send-button ui-icon{pointer-events:none}.workcenter-transcript{align-content:safe center;align-items:safe center;display:flex;flex-direction:column!important;flex-grow:1;flex-wrap:nowrap;gap:var(--space-lg);justify-content:safe center;justify-items:safe center;min-block-size:0;overflow-y:auto;overscroll-behavior:contain;padding:var(--space-sm) max(var(--space-sm),8cqi);position:relative;scrollbar-color:color-mix(in oklab,var(--color-on-surface) 24%,transparent) transparent;scrollbar-width:thin;z-index:0}.workcenter-transcript__empty{color:var(--color-on-surface-variant);font-size:var(--text-sm);margin:auto;max-inline-size:28rem;text-align:center}.workcenter-message{background:var(--color-surface-container-low);border:0;border-radius:var(--shape-medium);box-shadow:var(--elev-0);color:var(--color-on-surface);display:flex;flex-direction:column;gap:var(--space-xs);inline-size:fit-content;max-inline-size:min(48rem,94%);overflow-wrap:anywhere;padding:var(--space-sm) var(--space-md)}.workcenter-message--user{align-self:flex-end;background:var(--color-primary-container);color:var(--color-on-primary-container)}.workcenter-message--assistant{align-self:flex-start;background:var(--color-surface-container-low)}.workcenter-message.is-cancelled,.workcenter-message.is-pending{color:var(--color-on-surface-variant)}.workcenter-message.is-failed{background:color-mix(in oklab,var(--color-error) 8%,var(--color-surface-container-low));color:var(--color-on-surface)}.workcenter-message__header{color:inherit;font-size:var(--text-xs);font-weight:var(--font-weight-semibold);opacity:.7}.workcenter-message__body{font-family:var(--font-family);font-size:var(--text-base);line-height:var(--leading-normal)}.workcenter-message__body>:first-child{margin-block-start:0}.workcenter-message__body>:last-child{margin-block-end:0}.workcenter-message__body :is(blockquote,ol,p,pre,ul){margin-block:var(--space-sm)}.workcenter-message__body :is(ol,ul){padding-inline-start:var(--space-xl)}.workcenter-message__body pre{border-radius:var(--radius-sm);font-size:var(--text-sm);overflow-x:auto;padding:var(--space-sm)}.workcenter-message__body code,.workcenter-message__body pre{background:color-mix(in oklab,var(--color-on-surface) 7%,transparent);font-family:var(--font-family-mono)}.workcenter-message__body code{border-radius:var(--radius-xs);padding-inline:.2em}.workcenter-message__body a{color:var(--color-primary)}.workcenter-message__body a:focus-visible{box-shadow:var(--focus-ring);outline:0}.workcenter-message__body img{block-size:auto;border-radius:var(--shape-small);display:block;max-inline-size:100%}.workcenter-composer__attachments,.workcenter-message__attachments{display:flex;flex-wrap:wrap;gap:var(--space-xs)}.wc-attachment-chip{align-items:stretch;background:color-mix(in oklab,var(--color-on-surface) 6%,transparent);border-radius:var(--shape-medium);font-size:var(--text-xs);gap:var(--space-2xs);max-inline-size:min(18rem,100%);padding:var(--space-xs)}.wc-attachment-chip,.wc-attachment-chip__open{border:0;color:inherit;display:inline-flex;min-inline-size:0}.wc-attachment-chip__open{align-items:center;background:transparent;cursor:pointer;flex:1 1 auto;gap:var(--space-xs);padding:0;text-align:start}.wc-attachment-chip__open:focus-visible{box-shadow:var(--focus-ring);outline:0}.wc-attachment-chip__glyph,.wc-attachment-chip__preview{block-size:2.75rem;border-radius:var(--shape-small);flex:0 0 auto;inline-size:2.75rem;object-fit:cover}.wc-attachment-chip.is-image .wc-attachment-chip__preview{block-size:4.5rem;inline-size:4.5rem}.wc-attachment-chip__glyph{align-items:center;background:color-mix(in oklab,var(--color-on-surface) 8%,transparent);display:inline-flex;justify-content:center}.wc-attachment-chip__copy{display:grid;gap:.1rem;min-inline-size:0}.wc-attachment-chip__label{color:inherit;text-decoration:none}.wc-attachment-chip__label,.wc-attachment-chip__meta{min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wc-attachment-chip__meta{opacity:.65}.wc-attachment-chip__actions{align-items:center;display:inline-flex;flex:0 0 auto}.wc-chip-remove{color:var(--color-on-surface-variant);min-block-size:var(--touch-min);min-inline-size:var(--touch-min);overflow:visible}.workcenter-composer{--wc-composer-min:calc-size(fit-content, 1rem + size);background:var(--color-surface-container);block-size:max-content;border:0;border-radius:var(--shape-extra-large);box-shadow:var(--elev-1);display:flex;flex-direction:column;gap:var(--space-sm);inset:auto;inset-block-end:calc(var(--virtual-keyboard-height, env(keyboard-inset-height, 0px)) + env(safe-area-inset-bottom, 0px));max-block-size:min(72dvh,75%);min-block-size:var(--wc-composer-min,4.5rem);overflow:auto;padding:var(--space-sm);padding-block-start:var(--space-md);position:sticky;transition:background-color var(--transition-fast),box-shadow var(--transition-fast)}.workcenter-composer.is-dragging,.workcenter-composer:has(.prompt-input:focus-visible){background:var(--color-surface-container-high);box-shadow:var(--focus-ring),var(--elev-1)}.workcenter-composer.has-attachments{max-block-size:min(80dvh,88%)}.workcenter-composer__resize{block-size:max(2.5rem,var(--touch-min,2.75rem));cursor:ns-resize;inset-block-start:0;inset-inline:0;position:absolute;touch-action:none;user-select:none;z-index:4}.workcenter-composer__resize:before{background:color-mix(in oklab,var(--color-on-surface) 28%,transparent);block-size:.22rem;border-radius:var(--radius-full);content:\"\";display:block;inline-size:2.5rem;margin:.28rem auto 0}.workcenter-composer__files{background:color-mix(in oklab,var(--color-on-surface) 7%,transparent);border-radius:var(--shape-medium);display:grid;gap:var(--space-xs);padding:var(--space-xs)}.workcenter-composer__files[hidden]{display:none!important}.workcenter-composer__files-head{color:var(--color-primary);font-size:var(--text-xs);font-weight:var(--font-weight-semibold)}.workcenter-composer__attachments:empty{display:none}.wc-attach-button{overflow:visible;position:relative}.wc-attach-button,.wc-attach-button input{cursor:pointer;pointer-events:auto}.wc-attach-button ui-icon{cursor:pointer;pointer-events:none}.wc-attach-button span{display:flex;place-content:center;place-items:center;pointer-events:none}.wc-attach-count{background:var(--color-primary);border-radius:var(--radius-full);color:var(--color-on-primary);font-size:.65rem;font-weight:700;inset-block-start:.15rem;inset-inline-end:.15rem;line-height:1.1rem;min-block-size:1.1rem;min-inline-size:1.1rem;padding-inline:.2rem;position:absolute;text-align:center}.wc-attach-count[hidden]{display:none!important}.wc-file-picker{block-size:100%;cursor:pointer;inline-size:100%;inset:0;margin:0;opacity:0;position:absolute}.workcenter-composer__input-row{align-items:end;block-size:max-content;display:flex;gap:var(--space-xs);max-block-size:stretch}.workcenter-chat .prompt-input{background:transparent;block-size:fit-content;border:0;border-radius:var(--shape-large);box-shadow:none;color:var(--color-on-surface);field-sizing:content;flex:1 1 auto;flex-basis:stretch;font:inherit;line-height:var(--leading-normal);margin-block-start:.5rem;max-block-size:stretch;min-block-size:max(var(--touch-min,100%),100%);min-inline-size:0;overflow-y:auto;padding:var(--space-md);resize:none;z-index:5}.workcenter-chat :is(.prompt-input:focus,.prompt-input:hover){background:color-mix(in oklab,var(--color-on-surface) 4%,transparent);border:0;box-shadow:none;outline:0}.workcenter-chat .prompt-input:focus-visible{outline:0}.workcenter-request-options,.workcenter-secondary-panel{background:var(--color-surface-container-high);border:0;border-radius:var(--shape-large);box-shadow:var(--elev-2);display:grid;gap:var(--space-sm);inline-size:min(24rem,100% - var(--space-lg) * 2);inset-block-start:calc(var(--touch-min) + var(--space-lg));inset-inline-end:var(--space-md);padding:var(--space-md);pointer-events:auto;position:absolute;z-index:var(--z-popover,8)}.workcenter-request-options[hidden],.workcenter-secondary-panel[hidden]{display:none!important}:is(.workcenter-request-options,.workcenter-secondary-panel) label{color:var(--color-on-surface-variant);display:grid;font-size:var(--text-xs);gap:var(--space-2xs)}:is(.workcenter-request-options,.workcenter-secondary-panel) select{background-color:var(--color-surface-container-low);border:0;border-radius:var(--shape-small);min-block-size:var(--touch-min);padding:var(--space-sm) var(--space-md);pointer-events:auto}:is(.workcenter-request-options,.workcenter-secondary-panel) select:focus-visible{border:0;box-shadow:var(--focus-ring)}:is(.workcenter-request-options,.workcenter-secondary-panel) button{max-block-size:2rem;max-inline-size:2rem}.workcenter-secondary-panel{inline-size:fit-content;inset-block-start:calc(var(--touch-min) + var(--space-lg))}.wc-attachment-viewer{background:var(--color-surface-container-high);border:0;border-radius:var(--shape-large);box-shadow:var(--elev-3);color:var(--color-on-surface);inline-size:min(56rem,100% - var(--space-lg) * 2);max-block-size:92dvh;max-inline-size:96vw;padding:0}.wc-attachment-viewer::backdrop{background:color-mix(in oklab,black 56%,transparent)}.wc-attachment-viewer__header{align-items:center;display:flex;gap:var(--space-sm);justify-content:space-between;padding:var(--space-sm) var(--space-md)}.wc-attachment-viewer__header h3{font-size:var(--text-sm);margin:0;min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wc-attachment-viewer__body{max-block-size:80dvh;overflow:auto;padding:0 var(--space-md) var(--space-md)}.wc-attachment-viewer__frame{border:0;display:block;inline-size:100%;max-block-size:80dvh;min-block-size:min(32rem,70dvh);object-fit:contain}.wc-attachment-viewer__frame,.wc-attachment-viewer__text{background:color-mix(in oklab,var(--color-on-surface) 6%,transparent);border-radius:var(--shape-small)}.wc-attachment-viewer__text{font-family:var(--font-family-mono);font-size:var(--text-sm);margin:0;overflow:auto;overflow-wrap:anywhere;padding:var(--space-sm);white-space:pre-wrap}@container (max-inline-size: 640px){.workcenter-chat{gap:var(--space-sm);padding:var(--space-sm)}.workcenter-transcript{padding-inline:0}.workcenter-message{max-inline-size:100%}.workcenter-header h2{font-size:var(--text-base)}.wc-icon-button,.wc-quiet-button,.wc-send-button{min-block-size:2.75rem;min-inline-size:2.75rem}}}@layer components{.action-details-modal,.action-history-modal,.template-editor-modal{align-items:center;display:flex;inset:0;justify-content:center;padding:var(--space-md);position:fixed;z-index:7}.action-details-modal,.action-history-modal{background:rgba(0,0,0,.5)}.template-editor-modal{animation:h var(--motion-fast) ease;backdrop-filter:blur(4px);background:color-mix(in oklab,black 40%,transparent)}:is(.action-details-modal,.action-history-modal,.template-editor-modal) .modal-content{background:var(--color-surface-container-high);border-radius:var(--radius-lg);box-shadow:var(--elev-4);display:flex;flex-direction:column;inline-size:100%;max-block-size:80vh;overflow:hidden}:is(.action-details-modal,.action-history-modal) .modal-content{max-inline-size:90vw}:is(.action-details-modal,.action-history-modal) .modal-header{align-items:center;background:var(--color-surface-container-low);border-block-end:1px solid var(--color-outline-variant);display:flex;justify-content:space-between;padding:var(--space-lg)}:is(.action-details-modal,.action-history-modal) .modal-header h3{color:var(--color-on-surface);font-size:var(--text-lg);font-weight:var(--font-weight-semibold);margin:0}:is(.action-details-modal,.action-history-modal) .modal-header .modal-actions{align-items:center;display:flex;flex-wrap:nowrap;gap:var(--space-sm)}:is(.action-details-modal,.action-history-modal) .modal-body{flex:1;overflow-y:auto;padding:var(--space-lg)}@container (max-inline-size: 768px){:is(.action-details-modal,.action-history-modal) .modal-content{max-block-size:90vh;max-inline-size:95vw}}.template-editor-modal .modal-content{animation:i var(--motion-normal) ease;max-inline-size:640px;padding:var(--space-xl)}@container (max-inline-size: 768px){.template-editor-modal .modal-content{max-block-size:90vh;max-inline-size:95vw;padding:var(--space-lg)}}.template-editor-modal .modal-content .modal-header{display:grid;gap:var(--space-xs);margin-block-end:var(--space-lg)}.template-editor-modal .modal-content .modal-header h3{color:var(--color-on-surface);font-size:var(--text-lg);font-weight:var(--font-weight-semibold);margin:0}.template-editor-modal .modal-content .modal-header .modal-desc{color:var(--color-on-surface-variant);font-size:var(--text-xs);line-height:1.5;margin:0;opacity:.85}.template-editor-modal .modal-content>h3{color:var(--color-on-surface);font-size:var(--text-lg);font-weight:var(--font-weight-semibold);margin:0 0 var(--space-lg) 0}.template-editor-modal .modal-content .template-list{display:flex;flex:1;flex-direction:column;gap:var(--space-md);overflow-y:auto;scrollbar-color:var(--color-outline-variant) transparent;scrollbar-width:thin}.template-editor-modal .modal-content .template-list .template-item{background:var(--color-surface-container);border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);display:flex;flex-direction:column;gap:var(--space-sm);padding:var(--space-md);transition:border-color var(--motion-fast)}.template-editor-modal .modal-content .template-list .template-item:hover{border-color:var(--color-primary)}.template-editor-modal .modal-content .template-list .template-item .template-item-header{align-items:center;display:flex;gap:var(--space-sm)}.template-editor-modal .modal-content .template-list .template-item :is(input,textarea){background:var(--color-surface);border:1px solid var(--color-outline);border-radius:var(--radius-sm);color:var(--color-on-surface);font-family:inherit;font-size:var(--text-sm);padding:var(--space-sm);transition:border-color var(--motion-fast)}.template-editor-modal .modal-content .template-list .template-item :is(input:focus,textarea:focus){border-color:var(--color-primary);box-shadow:0 0 0 2px color-mix(in oklab,var(--color-primary) 20%,transparent);outline:none}.template-editor-modal .modal-content .template-list .template-item input::placeholder,.template-editor-modal .modal-content .template-list .template-item textarea::placeholder{color:var(--color-on-surface-variant);opacity:.6}.template-editor-modal .modal-content .template-list .template-item input{flex:1;font-weight:var(--font-weight-medium)}.template-editor-modal .modal-content .template-list .template-item textarea{font-family:var(--font-family-mono);line-height:1.5;min-block-size:80px;resize:vertical}.template-editor-modal .modal-content .template-list .template-item .remove-template{align-items:center;background:transparent;border:1px solid var(--color-outline-variant);border-radius:var(--radius-sm);color:var(--color-on-surface-variant);cursor:pointer;display:flex;flex-shrink:0;font-size:var(--text-sm);justify-content:center;min-block-size:28px;min-inline-size:28px;padding:var(--space-xs);transition:all var(--motion-fast)}.template-editor-modal .modal-content .template-list .template-item .remove-template:hover{background:color-mix(in oklab,var(--color-error) 12%,transparent);border-color:var(--color-error);color:var(--color-error)}.template-editor-modal .modal-content .modal-actions{border-block-start:1px solid var(--color-outline-variant);justify-content:space-between;padding-block-start:var(--space-lg)}.template-editor-modal .modal-content .modal-actions,.template-editor-modal .modal-content .modal-actions .modal-actions-group{align-items:center;block-size:max-content;display:flex;flex-wrap:nowrap;gap:var(--space-sm);max-block-size:stretch}.template-editor-modal .modal-content .modal-actions .modal-actions-group-start{block-size:max-content;flex:1 1 320px;max-block-size:max-content}.template-editor-modal .modal-content .modal-actions .modal-actions-group-end{justify-content:flex-end}.template-editor-modal .modal-content .modal-actions .btn{align-items:center;border-radius:var(--radius-md);cursor:pointer;display:inline-flex;font-size:var(--text-sm);font-weight:var(--font-weight-medium);gap:var(--space-xs);justify-content:center;line-height:1;min-block-size:2.25rem;padding:var(--space-sm) var(--space-lg);transition:all var(--motion-fast);white-space:nowrap}.template-editor-modal .modal-content .modal-actions .btn.primary{background:var(--color-primary);border:1px solid var(--color-primary);color:var(--color-on-primary)}.template-editor-modal .modal-content .modal-actions .btn.primary:hover{background:color-mix(in oklab,var(--color-primary) 90%,black)}.template-editor-modal .modal-content .modal-actions .btn:not(.primary){background:var(--color-surface-container);border:1px solid var(--color-outline);color:var(--color-on-surface)}.template-editor-modal .modal-content .modal-actions .btn:not(.primary):hover{background:var(--color-surface-container-high)}@container (max-inline-size: 560px){.template-editor-modal .modal-content .modal-actions{align-items:stretch;flex-direction:column}.template-editor-modal .modal-content .modal-actions .modal-actions-group{inline-size:100%}.template-editor-modal .modal-content .modal-actions .btn{flex:1 1 calc(50% - var(--space-sm))}}.action-history-modal .history-stats{display:flex;gap:var(--space-md);margin-block-end:var(--space-lg)}@container (max-inline-size: 768px){.action-history-modal .history-stats{flex-direction:column;gap:var(--space-sm)}}.action-history-modal .history-stats .stat-card{background:var(--color-surface-container);border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);flex:1;padding:var(--space-md);text-align:center}.action-history-modal .history-stats .stat-card .stat-value{color:var(--color-on-surface);display:block;font-size:var(--text-2xl);font-weight:var(--font-weight-bold);margin-block-end:var(--space-xs)}.action-history-modal .history-stats .stat-card .stat-value.success{color:var(--color-success)}.action-history-modal .history-stats .stat-card .stat-value.error{color:var(--color-error)}.action-history-modal .history-stats .stat-card .stat-label{color:var(--color-on-surface-variant);font-size:var(--text-sm);font-weight:var(--font-weight-medium)}.action-history-modal .history-filters{display:flex;gap:var(--space-md);margin-block-end:var(--space-lg)}@container (max-inline-size: 768px){.action-history-modal .history-filters{flex-direction:column;gap:var(--space-sm)}}.action-history-modal .history-filters .filter-select{appearance:none;-webkit-appearance:none;-moz-appearance:none;background-color:var(--color-surface-container);background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20stroke%3D%22%2394a3b8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E\");background-position:right var(--space-sm) center;background-repeat:no-repeat;background-size:1rem 1rem;border:1px solid var(--color-outline);border-radius:var(--radius-md);color:var(--color-on-surface);cursor:pointer;font-size:var(--text-sm);padding-block:var(--space-sm);padding-inline:var(--space-sm) 2rem}@supports (color:contrast-color(red)){.action-history-modal .history-filters .filter-select{color:contrast-color(var(--color-surface-container))}}.action-history-modal .history-filters .filter-select:focus{border-color:var(--color-primary);outline:none}.action-history-modal .action-history-list{display:flex;flex:1;flex-direction:column;gap:var(--space-sm);overflow-y:auto}.action-history-modal .action-history-list .wc-history-empty{color:var(--color-on-surface-variant);font-style:italic;padding:var(--space-xl);text-align:center}.action-history-modal .action-history-list .action-history-item{background:var(--color-surface-container);border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);padding:var(--space-md);transition:all var(--motion-fast)}.action-history-modal .action-history-list .action-history-item:hover{background:var(--color-surface-container-high);box-shadow:var(--elev-1)}.action-history-modal .action-history-list .action-history-item.completed{border-color:var(--color-success)}.action-history-modal .action-history-list .action-history-item.failed{border-color:var(--color-error)}.action-history-modal .action-history-list .action-history-item.processing{animation:j 2s infinite;border-color:var(--color-primary)}.action-history-modal .action-history-list .action-history-item .action-header{align-items:flex-start;display:flex;gap:var(--space-sm);justify-content:space-between;margin-block-end:var(--space-sm)}@container (max-inline-size: 768px){.action-history-modal .action-history-list .action-history-item .action-header{align-items:stretch;flex-direction:column}}.action-history-modal .action-history-list .action-history-item .action-header .action-meta{display:flex;flex:1;flex-direction:column;gap:var(--space-xs)}.action-history-modal .action-history-list .action-history-item .action-header .action-meta .action-status{align-items:center;display:inline-flex;font-size:var(--text-sm);font-weight:var(--font-weight-medium);gap:var(--space-xs)}.action-history-modal .action-history-list .action-history-item .action-header .action-meta .action-status:before{block-size:8px;border-radius:50%;content:\"\";inline-size:8px}.completed .action-history-modal .action-history-list .action-history-item .action-header .action-meta .action-status:before{background:var(--color-success)}.failed .action-history-modal .action-history-list .action-history-item .action-header .action-meta .action-status:before{background:var(--color-error)}.processing .action-history-modal .action-history-list .action-history-item .action-header .action-meta .action-status:before{animation:k 1s infinite;background:var(--color-primary)}.action-history-modal .action-history-list .action-history-item .action-header .action-meta .action-type{color:var(--color-on-surface);font-size:var(--text-sm);font-weight:var(--font-weight-semibold)}.action-history-modal .action-history-list .action-history-item .action-header .action-meta .action-time{color:var(--color-on-surface-variant);font-size:var(--text-xs)}.action-history-modal .action-history-list .action-history-item .action-header .action-meta .action-duration{color:var(--color-primary);font-size:var(--text-xs);font-weight:var(--font-weight-medium)}.action-history-modal .action-history-list .action-history-item .action-header .action-actions{display:flex;flex-shrink:0;gap:var(--space-xs)}.action-history-modal .action-history-list .action-history-item .action-header .action-actions .btn{font-size:var(--text-xs);padding:var(--space-xs) var(--space-sm)}.action-history-modal .action-history-list .action-history-item .action-content{display:flex;flex-direction:column;gap:var(--space-sm)}.action-history-modal .action-history-list .action-history-item .action-content :is(.input-preview,.result-preview){font-size:var(--text-sm)}.action-history-modal .action-history-list .action-history-item .action-content :is(.input-preview,.result-preview) strong{color:var(--color-on-surface);font-weight:var(--font-weight-semibold)}.action-history-modal .action-history-list .action-history-item .action-content :is(.input-preview,.result-preview) .result-content{background:var(--color-surface);border-radius:var(--radius-sm);color:var(--color-on-surface);font-family:var(--font-family-mono);font-size:var(--text-xs);margin-block-start:var(--space-xs);max-block-size:200px;overflow-y:auto;padding:var(--space-sm)}.action-history-modal .action-history-list .action-history-item .action-content .error-preview{background:color-mix(in oklab,var(--color-error) 10%,transparent);border:1px solid color-mix(in oklab,var(--color-error) 30%,transparent);border-radius:var(--radius-sm);color:var(--color-error);font-size:var(--text-sm);padding:var(--space-sm)}.action-history-modal .action-history-list .action-history-item .action-content .error-preview strong{color:var(--color-error)}.action-details-modal .details-grid{display:grid;gap:var(--space-md);grid-template-columns:1fr 1fr;margin-block-end:var(--space-lg)}@container (max-inline-size: 768px){.action-details-modal .details-grid{gap:var(--space-sm);grid-template-columns:1fr}}.action-details-modal .details-grid .detail-item{display:flex;flex-direction:column;gap:var(--space-xs)}.action-details-modal .details-grid .detail-item label{color:var(--color-on-surface);font-size:var(--text-sm);font-weight:var(--font-weight-semibold)}.action-details-modal .details-grid .detail-item span{color:var(--color-on-surface-variant);font-family:var(--font-family-mono);font-size:var(--text-sm)}.action-details-modal .details-grid .detail-item span.status-completed{color:var(--color-success)}.action-details-modal .details-grid .detail-item span.status-failed{color:var(--color-error)}.action-details-modal .details-grid .detail-item span.status-processing{color:var(--color-primary)}.action-details-modal .details-section{margin-block-end:var(--space-lg)}.action-details-modal .details-section:last-child{margin-block-end:0}.action-details-modal .details-section h4{color:var(--color-on-surface);font-size:var(--text-base);font-weight:var(--font-weight-semibold);margin:0 0 var(--space-md) 0}.action-details-modal .details-section :is(.input-details,.result-details){color:var(--color-on-surface-variant);font-size:var(--text-sm);line-height:1.5}.action-details-modal .details-section .error-details{background:color-mix(in oklab,var(--color-error) 10%,transparent);border:1px solid color-mix(in oklab,var(--color-error) 30%,transparent);border-radius:var(--radius-md);color:var(--color-error);font-family:var(--font-family-mono);font-size:var(--text-sm);padding:var(--space-md)}.history-section .history-header{align-items:center;display:flex;justify-content:space-between;margin-block-end:var(--space-md)}.history-section .history-header h3{color:var(--color-on-surface);font-size:var(--text-lg);font-weight:var(--font-weight-semibold);margin:0}.history-section .history-header .history-actions{align-items:center;display:flex;gap:var(--space-sm)}.history-section .recent-history{display:flex;flex-direction:column;gap:var(--space-sm);margin-block-end:var(--space-md)}.history-section .recent-history .wc-history-empty{color:var(--color-on-surface-variant);font-style:italic;padding:var(--space-lg);text-align:center}.history-section .recent-history .history-item-compact{align-items:center;background:var(--color-surface-container);border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);display:flex;justify-content:space-between;padding:var(--space-sm) var(--space-md);transition:all var(--motion-fast)}.history-section .recent-history .history-item-compact:hover{background:var(--color-surface-container-high)}.history-section .recent-history .history-item-compact .history-meta{align-items:center;display:flex;flex:1;gap:var(--space-sm)}.history-section .recent-history .history-item-compact .history-meta .history-status{color:var(--color-success);font-size:var(--text-sm);font-weight:var(--font-weight-medium)}.history-section .recent-history .history-item-compact .history-meta .history-prompt{color:var(--color-on-surface);flex:1;font-size:var(--text-sm)}.history-section .recent-history .history-item-compact .history-meta .history-time{color:var(--color-on-surface-variant);font-size:var(--text-xs);font-weight:var(--font-weight-medium)}.history-section .recent-history .history-item-compact .btn{font-size:var(--text-xs);padding:var(--space-xs) var(--space-sm)}.history-section .action-stats{display:grid;gap:var(--space-sm);grid-template-columns:repeat(auto-fit,minmax(120px,1fr))}.history-section .action-stats .stats-item{background:var(--color-surface-container);border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);padding:var(--space-sm);text-align:center}.history-section .action-stats .stats-item:first-child{background:var(--color-primary-container);border-color:var(--color-primary);color:var(--color-on-primary-container)}.data-pipeline-section{background:var(--color-surface-container);block-size:stretch;border:1px solid var(--color-outline-variant);border-radius:var(--radius-lg);contain:strict;container-type:size;display:flex;flex-direction:column;gap:var(--space-sm);margin-block-start:var(--space-lg);max-block-size:stretch;min-block-size:calc-size(fit-content,min(size,100%));overflow-x:hidden;overflow-y:auto;padding:var(--space-lg);scrollbar-color:var(--color-outline-variant) transparent;scrollbar-width:thin}.data-pipeline-section .pipeline-header{align-items:center;display:flex;justify-content:space-between;margin-block-end:var(--space-lg)}.data-pipeline-section .pipeline-header h3{color:var(--color-on-surface);font-size:var(--text-lg);font-weight:var(--font-weight-semibold);margin:0}.data-pipeline-section .pipeline-header .pipeline-actions{align-items:center;display:flex;gap:var(--space-sm)}.data-pipeline-section .pipeline-steps{display:flex;flex-direction:column;gap:var(--space-md)}.data-pipeline-section .pipeline-steps,.data-pipeline-section .pipeline-steps .pipeline-step{block-size:max-content;inline-size:stretch;max-block-size:fit-content;min-block-size:calc-size(fit-content,min(size,100%));overflow:hidden}.data-pipeline-section .pipeline-steps .pipeline-step{background:var(--color-surface-container-low);border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);padding:var(--space-md);text-overflow:ellipsis}.data-pipeline-section .pipeline-steps .pipeline-step.recognized-step{background:var(--color-secondary-container);border-color:var(--color-secondary)}.data-pipeline-section .pipeline-steps .pipeline-step.processed-step{background:var(--color-tertiary-container);border-color:var(--color-tertiary)}.data-pipeline-section .pipeline-steps .pipeline-step .step-header{align-items:center;display:flex;gap:var(--space-sm);margin-block-end:var(--space-sm)}.data-pipeline-section .pipeline-steps .pipeline-step .step-header ui-icon{color:var(--color-on-surface-variant);flex-shrink:0}.data-pipeline-section .pipeline-steps .pipeline-step .step-header .step-title{color:var(--color-on-surface);flex:1;font-size:var(--text-sm);font-weight:var(--font-weight-semibold)}.data-pipeline-section .pipeline-steps .pipeline-step .step-header .step-time{color:var(--color-on-surface-variant);font-size:var(--text-xs)}.data-pipeline-section .pipeline-steps .pipeline-step .step-header .step-source{color:var(--color-primary);font-size:var(--text-xs);font-weight:var(--font-weight-medium)}.data-pipeline-section .pipeline-steps .pipeline-step .step-header .step-format{color:var(--color-on-surface-variant);font-family:var(--font-family-mono);font-size:var(--text-xs)}.data-pipeline-section .pipeline-steps .pipeline-step .step-header .btn{font-size:var(--text-xs);padding:var(--space-xs) var(--space-sm)}.data-pipeline-section .pipeline-steps .pipeline-step .step-content .step-preview{color:var(--color-on-surface);font-size:var(--text-sm);line-height:1.5;max-block-size:100px;overflow:hidden;text-overflow:ellipsis}}";
//#endregion
//#region ../../modules/views/workcenter-view/src/index.ts
/**
* Work Center View
*
* Shell adapter for the module-based WorkCenter implementation.
*/
var src_exports = /* @__PURE__ */ __exportAll({
	WorkCenterView: () => WorkCenterView,
	createView: () => createView,
	createWorkCenterView: () => createWorkCenterView,
	default: () => createView
});
/**
* WHY: `document.adoptedStyleSheets` entries are global; closing one floating window must not unmount styles for another.
* WHY: `mountViewModule` runs `render()` before `connectedCallback`/`onMount`, so consumers may attach DOM before CE lifecycle runs.
*/
var workcenterDocumentStyles = (() => {
	let consumers = 0;
	let sheet = null;
	return {
		acquire() {
			const next = loadAsAdopted$1(_index_default);
			if (next) sheet = next;
			if (sheet) consumers += 1;
			return sheet;
		},
		release() {
			if (consumers <= 0 || !sheet) return;
			consumers -= 1;
			if (consumers === 0) {
				removeAdopted(sheet);
				sheet = null;
			}
		}
	};
})();
var WorkCenterView = class WorkCenterView extends UIElement {
	id = "workcenter";
	name = "Work Center";
	icon = "lightning";
	options;
	shellContext;
	element = null;
	manager = null;
	deps;
	initializedFromOptions = false;
	lastOutputText = "";
	pendingRenderAfterMount = false;
	resultObserver = null;
	_sheet = null;
	processedInboundMessageIds = /* @__PURE__ */ new Set();
	pendingMessages = [];
	/** True after this instance acquired a refcount on the shared workcenter document stylesheet. */
	leasedDocumentStyles = false;
	unbindFlushHost = null;
	lifecycle = {
		onMount: () => this.onMount(),
		onUnmount: () => this.onUnmount(),
		onShow: () => this.onShow(),
		onHide: () => this.onHide()
	};
	constructor(options = {}) {
		super();
		this.options = options;
		this.shellContext = options.shellContext;
		this.deps = {
			state: {},
			history: [],
			getSpeechPrompt: async () => null,
			showMessage: (message) => this.showMessage(message),
			render: () => this.requestRender(),
			navigate: (viewId) => this.shellContext?.navigate(viewId),
			onFilesChanged: () => this.emitFilesChanged()
		};
	}
	/**
	* GLitElement calls `render(weakRef)` when the host is connected; the shell calls `render(options?)`.
	* Only merge real view options — never a WeakRef from GLit.
	*/
	isGlitterWeakRef(arg) {
		return Boolean(arg && typeof arg.deref === "function");
	}
	/** Ensure constructable sheet is on `document` and optional CE shadow (standalone embedded host). */
	leaseWorkCenterDocumentStyles() {
		if (this.leasedDocumentStyles) return this._sheet;
		const sheet = workcenterDocumentStyles.acquire();
		if (sheet) {
			this._sheet = sheet;
			this.leasedDocumentStyles = true;
		}
		return sheet;
	}
	ensureWorkCenterStylesOnShadow() {
		const sheet = this.leaseWorkCenterDocumentStyles();
		const root = this.shadowRoot;
		if (!sheet || !root?.adoptedStyleSheets) return;
		if (!root.adoptedStyleSheets.includes(sheet)) root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
	}
	onInitialize() {
		const self = super.onInitialize();
		this.ensureWorkCenterStylesOnShadow();
		return self ?? this;
	}
	/** Shell passes `ViewOptions`; GLitElement passes a `WeakRef` — ignore the latter for option merging. */
	render = (weakOrOptions) => {
		const fromGlit = this.isGlitterWeakRef(weakOrOptions);
		const options = fromGlit ? void 0 : weakOrOptions;
		if (options) {
			this.options = {
				...this.options,
				...options
			};
			this.shellContext = options.shellContext || this.shellContext;
		}
		this.manager ??= new WorkCenterManager(this.deps);
		try {
			ensureViewportTracking();
		} catch {}
		if (!this.initializedFromOptions) {
			this.applyInitialOptions();
			this.initializedFromOptions = true;
		}
		this.unbindFlushHost ??= registerWorkCenterFlushHost(this);
		this.leaseWorkCenterDocumentStyles();
		const live = this.connectedChat() ?? this.element;
		if (live?.querySelector("[data-workcenter-composer]")) {
			this.element = live;
			this.manager.adoptLiveRoot(live);
			if (live.isConnected) this.manager.paintLiveConversation();
			this.syncPromptInputFromState();
			this.setupProcessResultObserver();
			this.emitFilesChanged();
			return this.hostForShell(fromGlit);
		}
		this.element = this.manager.renderWorkCenterView();
		this.syncPromptInputFromState();
		this.setupProcessResultObserver();
		this.emitFilesChanged();
		/**
		* Return the CE to the shell. GLit gets a `<slot>` so the chat stays in light DOM.
		* WHY: share/flush/`querySelector("cw-workcenter-view")` missed the disconnected host
		* while the visible tree was only `.workcenter-chat`.
		*/
		return this.hostForShell(fromGlit);
	};
	/** Shell mounts this host; GLit projects light-DOM chat through a shadow slot. */
	hostForShell(fromGlit) {
		this.style.display = "flex";
		this.style.flexDirection = "column";
		this.style.flex = "1";
		this.style.minHeight = "0";
		this.style.height = "100%";
		if (this.element && this.element.parentNode !== this) this.replaceChildren(this.element);
		if (fromGlit) return document.createElement("slot");
		return this;
	}
	getToolbar() {
		return null;
	}
	normalizeInitialDataMessage(initialData) {
		if (!initialData) return null;
		if (typeof initialData === "string") return {
			type: "content-share",
			contentType: "text",
			data: {
				text: initialData,
				content: initialData
			}
		};
		if (initialData instanceof File) return {
			type: "content-share",
			contentType: initialData.type || "application/octet-stream",
			data: {
				file: initialData,
				filename: initialData.name
			}
		};
		if (Array.isArray(initialData)) {
			const files = initialData.filter((entry) => entry instanceof File);
			if (files.length > 0) return {
				type: "content-share",
				contentType: files[0]?.type || "application/octet-stream",
				data: {
					file: files[0],
					files,
					filename: files[0]?.name
				}
			};
			return null;
		}
		if (typeof initialData !== "object") return null;
		const record = initialData;
		const nestedData = record.data && typeof record.data === "object" ? record.data : record;
		const files = Array.isArray(nestedData.files) ? nestedData.files.filter((entry) => entry instanceof File) : void 0;
		const file = nestedData.file instanceof File ? nestedData.file : files?.[0];
		const text = typeof nestedData.text === "string" ? nestedData.text : void 0;
		const content = typeof nestedData.content === "string" ? nestedData.content : void 0;
		const url = typeof nestedData.url === "string" ? nestedData.url : void 0;
		const filename = typeof nestedData.filename === "string" ? nestedData.filename : file?.name;
		const source = typeof nestedData.source === "string" ? nestedData.source : void 0;
		if (!file && !files?.length && !text && !content && !url) return null;
		return {
			type: typeof record.type === "string" ? record.type : "content-share",
			contentType: typeof record.contentType === "string" ? record.contentType : file?.type || "text",
			data: {
				file,
				files,
				text,
				content,
				url,
				filename,
				source
			}
		};
	}
	async addFiles(files) {
		if (!this.manager || files.length === 0) return;
		await this.manager.addFiles(files);
	}
	async setPrompt(prompt) {
		await this.manager?.setPrompt(prompt);
		this.syncPromptInputFromState();
	}
	getFiles() {
		return [...this.manager?.getState().files || []];
	}
	canHandleMessage(messageType) {
		return [
			"content-attach",
			"content-process",
			"file-attach",
			"share-target-input",
			"share-received",
			"share-target-result",
			"ai-result",
			"process-api-result",
			"content-share"
		].includes(messageType);
	}
	async handleMessage(message) {
		const msg = message;
		if (!this.manager) {
			if (this.pendingMessages.length >= 64) this.pendingMessages.shift();
			this.pendingMessages.push(msg);
			return;
		}
		await this.handleMessageWithManager(msg);
	}
	/** Stable imperative entry for channels — mirrors {@link handleMessage} shapes. */
	async invokeChannelApi(action, payload) {
		let data;
		if (payload != null && typeof payload === "object" && !Array.isArray(payload)) data = payload;
		else if (Array.isArray(payload) && payload.length > 0 && payload.every((f) => f instanceof File)) data = { files: payload };
		else if (payload instanceof File) data = { file: payload };
		else if (typeof payload === "string") data = { text: payload };
		await this.handleMessage({
			type: action,
			data
		});
		return true;
	}
	async handleMessageWithManager(msg) {
		if (!this.manager) return;
		const mid = typeof msg.id === "string" ? msg.id.trim() : "";
		if (mid) {
			if (this.processedInboundMessageIds.has(mid)) return;
			this.processedInboundMessageIds.add(mid);
			if (this.processedInboundMessageIds.size > 256) {
				const iter = this.processedInboundMessageIds.values().next();
				if (!iter.done) this.processedInboundMessageIds.delete(iter.value);
			}
		}
		if (msg.type === "share-target-input" || msg.type === "share-received" || msg.type === "share-target-result" || msg.type === "ai-result" || msg.type === "process-api-result") {
			await this.manager.handleExternalMessage(msg);
			this.emitFilesChanged();
			return;
		}
		if (msg.type === "content-share" || msg.type === "content-attach" || msg.type === "file-attach") {
			await this.manager.handleExternalMessage(msg);
			this.emitFilesChanged();
			return;
		}
		if (msg.data?.file) await this.addFiles([msg.data.file]);
		if (msg.data?.files?.length) await this.addFiles(msg.data.files);
		const prompt = msg.data?.text || msg.data?.content || msg.data?.url || "";
		if (prompt.trim()) await this.setPrompt(prompt);
		if (msg.type === "content-process") (this.element?.querySelector("[data-action=\"execute\"]"))?.click();
	}
	async flushPendingMessages() {
		if (!this.manager || this.pendingMessages.length === 0) return;
		const queue = this.pendingMessages.splice(0, this.pendingMessages.length);
		for (const message of queue) {
			const msg = message;
			await this.handleMessageWithManager(msg);
		}
	}
	applyInitialOptions() {
		if (!this.manager) return;
		if (Array.isArray(this.options.initialFiles) && this.options.initialFiles.length > 0) this.pendingMessages.unshift({
			type: "content-attach",
			data: { files: this.options.initialFiles }
		});
		if (typeof this.options.initialPrompt === "string" && this.options.initialPrompt.trim()) this.pendingMessages.unshift({
			type: "content-share",
			data: { text: this.options.initialPrompt }
		});
		const initialMessage = this.normalizeInitialDataMessage(this.options.initialData);
		if (initialMessage) this.pendingMessages.unshift(initialMessage);
		const handoff = takeSkuHandoff("workcenter", "process");
		if (handoff && (handoff.content || handoff.filename)) this.pendingMessages.unshift({
			type: "content-attach",
			contentType: "file",
			data: {
				text: handoff.content,
				filename: handoff.filename,
				source: "sku-handoff",
				hint: {
					action: "attach",
					filename: handoff.filename
				}
			}
		});
	}
	syncPromptInputFromState() {
		const state = this.manager?.getState();
		if (!state || !this.element) return;
		const promptInput = this.element.querySelector(".prompt-input");
		if (promptInput) promptInput.value = state.currentPrompt || "";
	}
	setupProcessResultObserver() {
		this.resultObserver?.disconnect();
		if (!this.element || !this.options.onProcessComplete) return;
		const transcript = this.element.querySelector("[data-workcenter-transcript]");
		if (!transcript) return;
		const emitLatestResult = () => {
			const text = Array.from(transcript.querySelectorAll(".workcenter-message--assistant.is-complete .workcenter-message__body")).at(-1)?.textContent?.trim() || "";
			if (!text || text === this.lastOutputText) return;
			this.lastOutputText = text;
			this.options.onProcessComplete?.(text);
		};
		emitLatestResult();
		this.resultObserver = new MutationObserver(emitLatestResult);
		this.resultObserver.observe(transcript, {
			childList: true,
			subtree: true,
			characterData: true
		});
	}
	emitFilesChanged() {
		const files = this.manager?.getState().files || [];
		this.options.onFilesChange?.([...files]);
	}
	connectedChat() {
		if (this.element?.isConnected) return this.element;
		const live = queryLiveWorkCenterChats()[0];
		if (live) return live;
		if (typeof document === "undefined") return null;
		return document.querySelector(".workcenter-chat[data-view='workcenter']");
	}
	requestRender() {
		if (!this.manager) return;
		const live = this.connectedChat();
		if (live?.querySelector("[data-workcenter-composer]")) {
			this.pendingRenderAfterMount = false;
			this.element = live;
			this.manager.adoptLiveRoot(live);
			this.manager.paintLiveConversation();
			this.syncPromptInputFromState();
			this.setupProcessResultObserver();
			return;
		}
		let currentElement = this.element;
		if (!currentElement?.parentElement) {
			const connected = live;
			if (connected?.parentElement) {
				currentElement = connected;
				this.element = connected;
			}
		}
		const parent = currentElement?.parentElement;
		if (!currentElement || !parent) {
			this.pendingRenderAfterMount = true;
			return;
		}
		this.pendingRenderAfterMount = false;
		const next = this.manager.renderWorkCenterView();
		const activeViewMarker = currentElement.getAttribute("data-view");
		if (activeViewMarker) next.setAttribute("data-view", activeViewMarker);
		next.hidden = currentElement.hidden;
		if (currentElement.hasAttribute("slot")) next.slot = currentElement.slot;
		parent.replaceChild(next, currentElement);
		this.element = next;
		this.syncPromptInputFromState();
		this.setupProcessResultObserver();
	}
	showMessage(message) {
		this.shellContext?.showMessage(message);
	}
	onProcessOpen = (ev) => {
		const detail = ev.detail;
		const content = String(detail?.content || "").trim();
		if (!content) return;
		this.pendingMessages.push({
			type: "content-share",
			contentType: "markdown",
			data: {
				text: content,
				content,
				filename: detail?.filename,
				source: "process-share"
			}
		});
		this.flushPendingMessages();
	};
	onMount() {
		this.leaseWorkCenterDocumentStyles();
		try {
			ensureViewportTracking();
		} catch {}
		window.addEventListener("cwsp:process-open", this.onProcessOpen);
	}
	onUnmount() {
		window.removeEventListener("cwsp:process-open", this.onProcessOpen);
		this.unbindFlushHost?.();
		this.unbindFlushHost = null;
		this.resultObserver?.disconnect();
		this.resultObserver = null;
		this.manager?.destroy();
		this.manager = null;
		if (this.leasedDocumentStyles) {
			try {
				const sr = this.shadowRoot;
				const sh = this._sheet;
				if (sr?.adoptedStyleSheets?.length && sh && sr.adoptedStyleSheets.includes(sh)) sr.adoptedStyleSheets = [...sr.adoptedStyleSheets].filter((s) => s !== sh);
			} catch {}
			workcenterDocumentStyles.release();
			this.leasedDocumentStyles = false;
		}
		this._sheet = null;
	}
	onShow() {
		this.leaseWorkCenterDocumentStyles();
		this.ensureWorkCenterStylesOnShadow();
		if (this.pendingRenderAfterMount) {
			this.pendingRenderAfterMount = false;
			this.requestRender();
		}
		requestAnimationFrame(() => {
			this.flushVisibleAttachments();
		});
	}
	/** Share/launch Files sit in hold; unified delivery can skip handleMessage. Paint the live composer. */
	async flushVisibleAttachments() {
		const live = this.connectedChat();
		if (live && this.manager) {
			this.element = live;
			this.manager.adoptLiveRoot(live);
		}
		await flushHeldIngressToWorkCenter();
		const held = peekHeldIngressFiles();
		if (held.length && this.manager) await this.manager.addFiles(held);
		this.manager?.paintLiveConversation();
		this.emitFilesChanged();
		await this.flushPendingMessages();
	}
	onHide() {}
};
WorkCenterView = __decorate([defineElement("cw-workcenter-view")], WorkCenterView);
function createView(options) {
	return new WorkCenterView(options);
}
var createWorkCenterView = createView;
//#endregion
export { WorkCenterView, fetchSwCachedEntries as a, createView, createView as default, createWorkCenterView, WorkCenterStateManager as i, WorkCenterManager as n, queryLiveWorkCenterChats as r, src_exports as t };
