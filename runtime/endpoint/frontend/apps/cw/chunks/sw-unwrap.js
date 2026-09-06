//#region src/shared/routing/api/process-api-result.ts
var asTrimmed = (value) => typeof value === "string" ? value.trim() : "";
var fromChoices = (value) => {
	if (!Array.isArray(value) || !value.length) return "";
	const first = value[0];
	return asTrimmed(first?.message?.content) || asTrimmed(first?.text);
};
var fromRecognized = (value) => {
	const text = asTrimmed(value);
	if (text) return text;
	if (!Array.isArray(value) || !value.length) return "";
	return value.map((item) => typeof item === "string" ? item : item == null ? "" : JSON.stringify(item)).filter(Boolean).join("\n").trim();
};
var fromRecord = (row) => {
	if (row.ok === false || row.success === false) return "";
	const inner = row.result && typeof row.result === "object" ? row.result : null;
	const candidates = [
		row.data,
		inner?.data,
		inner?.text,
		inner?.content,
		row.text,
		row.content,
		row.verbose_data,
		inner?.verbose_data,
		row.output_text,
		inner?.output_text
	];
	for (const item of candidates) {
		const text = asTrimmed(item);
		if (text) return text;
	}
	const recognized = fromRecognized(row.recognized_data ?? inner?.recognized_data);
	if (recognized) return recognized;
	const choices = fromChoices(row.choices ?? inner?.choices);
	if (choices) return choices;
	if (typeof inner?.result === "string") return inner.result.trim();
	return "";
};
/** Display text for chat / pipeline. Empty when the payload is a failed envelope. */
var readProcessApiResultText = (json) => {
	if (json == null) return "";
	if (typeof json === "string") {
		const trimmed = json.trim();
		if (!trimmed) return "";
		if (trimmed.startsWith("{") || trimmed.startsWith("[")) try {
			return readProcessApiResultText(JSON.parse(trimmed)) || trimmed;
		} catch {
			return trimmed;
		}
		return trimmed;
	}
	if (typeof json !== "object") return String(json).trim();
	return fromRecord(json);
};
//#endregion
//#region src/shared/routing/channel/sw-unwrap.ts
var PROTOCOL_MAIL_TYPES = /* @__PURE__ */ new Set([
	"request",
	"response",
	"invoke",
	"ack",
	"act",
	"ask"
]);
var inferMailType = (row, type, data) => {
	if (type && !PROTOCOL_MAIL_TYPES.has(type)) return type;
	const payload = data && typeof data === "object" ? data : null;
	if (row.type === "workcenter-command" || row.command) return "workcenter-command";
	if (Array.isArray(row.operations) || Array.isArray(payload?.operations)) return "pending-operations";
	if (Array.isArray(row.results)) return "commit-to-clipboard";
	if (payload && (payload.rawData != null || payload.source === "share-target") && payload.content != null) return "share-target-result";
	if (row.type === "share-received" || payload?.source === "share-target" || payload?.fileCount != null || Array.isArray(payload?.files)) return type === "share-target-input" ? "share-target-input" : "share-received";
	if (payload && (payload.success === true || payload.success === false || payload.fallback != null)) return "ai-result";
	return type || "ai-result";
};
/**
* Unwrap SW / Uniform envelopes so page listeners see the app verb + payload.
* WHY: workers wrap mail in protocol fields; chat must still see `ai-result`.
*/
var unwrapSwInteropMessage = (value) => {
	if (value == null) return null;
	if (typeof value !== "object") return {
		type: "ai-result",
		data: value,
		raw: { data: value }
	};
	const row = value;
	const nested = row.data && typeof row.data === "object" ? row.data : null;
	return {
		type: inferMailType(row, String(row.what || (typeof row.type === "string" ? row.type : "") || nested?.type || ""), row.data ?? row.payload ?? nested?.data ?? row),
		data: row.data ?? row.payload ?? nested?.data ?? row,
		command: row.command ?? nested?.command,
		operations: row.operations ?? nested?.operations,
		results: row.results ?? nested?.results,
		raw: row
	};
};
//#endregion
export { readProcessApiResultText as n, unwrapSwInteropMessage as t };
