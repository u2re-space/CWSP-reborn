import { o as normalizeDataAsset } from "../vendor/culori.js";
import { d as sendProtocolMessage, r as createProtocolEnvelope } from "./UnifiedMessaging.js";
//#region ../../modules/projects/subsystem/registry.ts
var ViewBase = class extends HTMLElement {
	id = "view";
	name = "View";
	icon = "square";
	options = {};
	lifecycle = {};
	constructor(options) {
		super();
		if (options) this.options = options;
	}
	render(options) {
		if (options) this.options = {
			...this.options,
			...options
		};
		return this;
	}
};
function createViewConstructor(tagName, build) {
	const existing = globalThis.customElements?.get?.(tagName);
	if (existing) return existing;
	const Ctor = build(ViewBase);
	globalThis.customElements?.define?.(tagName, Ctor);
	return Ctor;
}
//#endregion
//#region ../../modules/projects/subsystem/src/routing/channel/UniformViewTransport.ts
var asDataAssetInput = (raw) => {
	if (typeof raw === "string") return raw;
	if (typeof Blob !== "undefined" && raw instanceof Blob) return raw;
	if (raw && typeof raw === "object" && "data" in raw) {
		const data = raw.data;
		if (typeof data === "string") return data;
		if (data && typeof Blob !== "undefined" && data instanceof Blob) return data;
	}
	return null;
};
var asNamePrefix = (source) => {
	return String(source || "attachment").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") || "attachment";
};
var normalizeIpcAttachments = async (inputs, source = "view-ipc") => {
	const out = [];
	for (const raw of inputs) {
		const candidate = asDataAssetInput(raw);
		if (!candidate) continue;
		try {
			const inferredSource = raw && typeof raw === "object" && "source" in raw ? String(raw.source || source) : source;
			const asset = await normalizeDataAsset(candidate, {
				namePrefix: asNamePrefix(inferredSource),
				uriComponent: true
			});
			out.push({
				hash: String(asset.hash || ""),
				name: String(asset.name || asset.file?.name || "attachment"),
				mimeType: String(asset.type || asset.file?.type || "application/octet-stream"),
				size: Number(asset.size || asset.file?.size || 0),
				source: inferredSource,
				data: asset.file
			});
		} catch (error) {
			console.warn("[UniformViewTransport] Attachment normalization failed:", error);
		}
	}
	return out;
};
var sendViewProtocolMessage = async (input) => {
	const attachments = await normalizeIpcAttachments(input.attachments || [], input.source);
	const data = {
		...input.data || {},
		...attachments.length > 0 ? {
			attachments,
			file: attachments[0]?.data,
			files: attachments.map((entry) => entry.data)
		} : {}
	};
	const envelope = createProtocolEnvelope({
		type: input.type,
		source: input.source,
		destination: input.destination,
		contentType: input.contentType,
		data,
		purpose: input.purpose || (attachments.length > 0 ? ["attach", "deliver"] : ["deliver", "mail"]),
		protocol: "window",
		op: input.op || (attachments.length > 0 ? "attach" : "deliver"),
		srcChannel: input.source,
		dstChannel: input.destination,
		metadata: {
			...input.metadata || {},
			attachmentCount: attachments.length
		}
	});
	return sendProtocolMessage(envelope);
};
//#endregion
export { createViewConstructor as n, sendViewProtocolMessage as t };
