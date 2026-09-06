import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { t as JSOX } from "./jsox.js";
import "../chunks/core.js";
import { a as loadSettings } from "../chunks/Settings.js";
import { t as canParseURL } from "../chunks/Runtime.js";
import { n as getRuntimeSettings } from "../chunks/RuntimeSettings.js";
import { i as buildInstructionPrompt, n as SVG_GRAPHICS_ADDON, o as getIntermediateRecognitionInstruction, r as TRANSLATE_INSTRUCTION, s as getOutputFormatInstruction, t as LANGUAGE_INSTRUCTIONS } from "../chunks/utils.js";
//#region src/shared/service/model/GPT-Config.ts
var typesForKind = {
	"math": "input_text",
	"url": "input_image",
	"text": "input_text",
	"input_text": "input_text",
	"output_text": "input_text",
	"image_url": "input_image",
	"image": "input_image",
	"input_image": "input_image",
	"input_url": "input_image",
	"json": "input_text",
	"markdown": "input_text",
	"code": "input_text",
	"entity": "input_text",
	"structured": "input_text",
	"unknown": "input_text",
	"svg": "input_text",
	"xml": "input_text"
};
var getDataKindByMIMEType = (mime) => {
	if (!mime) return "input_text";
	const lower = mime.toLowerCase();
	if (lower.includes("image")) return "input_image";
	if (lower.includes("json")) return "json";
	if (lower.includes("javascript") || lower.includes("typescript")) return "code";
	if (lower.includes("markdown") || lower.includes("md")) return "markdown";
	if (lower.includes("url")) return "input_url";
	if (lower.includes("text/html")) return "markdown";
	if (lower.includes("text/plain")) return "input_text";
	return "input_text";
};
var detectDataKindFromContent = (content) => {
	if (!content || typeof content !== "string") return "input_text";
	const trimmed = content.trim();
	if (trimmed.startsWith("{") && trimmed.endsWith("}") || trimmed.startsWith("[") && trimmed.endsWith("]")) try {
		JSON.parse(trimmed);
		return "json";
	} catch {}
	if (canParseURL(trimmed)) return "url";
	if (trimmed.includes("<svg") && trimmed.includes("</svg>")) return "xml";
	if (trimmed.startsWith("data:image/") && trimmed.includes(";base64,") && !trimmed.includes("\n")) try {
		const url = new URL(trimmed);
		if (url.protocol === "data:" && url.pathname.startsWith("image/")) return "input_image";
	} catch {}
	if (/\$\$[\s\S]+\$\$|\$[^$]+\$|\\begin\{equation\}/.test(trimmed)) return "math";
	if (/```[\s\S]+```|^(function|const|let|var|class|import|export)\s/m.test(trimmed)) return "code";
	if (/^#{1,6}\s|^\*\*|^-\s|\[.+\]\(.+\)|^>\s/m.test(trimmed)) return "markdown";
	return "input_text";
};
var actionWithDataType = (data) => {
	const context = data?.context;
	const kindType = typesForKind?.[data?.dataKind || "input_text"];
	const contextPrompt = buildContextPrompt(context);
	switch (kindType) {
		case "input_image": return `${contextPrompt}

Recognize data from image, also preferred to orient by fonts in image.

After recognition, do not include or remember image itself.

---

In (\`recognized_data\` key), can be written phone numbers, emails, URLs, dates, times, codes, etc. Additional formatting rules:

In recognized from image data (what you seen in image), do:
- If textual content, format as Markdown string (multiline).
- If phone number, format as as correct phone number (in normalized format).
  - Also, if phone numbers (for example starts with +7, format as 8), replace to correct regional code.
  - Remove brackets, parentheses, spaces or other symbols from phone number.
  - Trim spaces from phone number.
- If email, format as as correct email (in normalized format), and trim spaces from email.
- If URL, format as as correct URL (in normalized format), and unicode codes to human readable, and trim spaces from URL.
- If date, format as as correct date (in normalized format).
- If time, format as as correct time (in normalized format).
- If math (expression, equation, formula), format as $KaTeX$
- If table (or looks alike table), format as | table |
- If image, format as [$image$]($image$)
- If code, format as \`\`\`$code$\`\`\` (multiline) or \`$code$\` (single-line)
- If JSON, format as correct JSON string, and trim spaces from JSON string.
- If other, format as $text$.
- If seen alike list, format as list (in markdown format).

---

Some additional actions:
- Collect some special data tags and keywords (if has any).
- Also, can you provide in markdown pre-formatted free-form analyzed or recognized verbose data (in \`verbose_data\` key).

---

CRITICAL OUTPUT FORMAT: Return ONLY valid JSON. No markdown code blocks, no explanations, no prose.
Your response must start with { or [ and end with } or ].

Expected output structure:
{
    "keywords_and_tags": ["string array"],
    "recognized_data": ["any array"],
    "verbose_data": "markdown string",
    "using_ready": true,
    "confidence": 0.95,
    "suggested_type": "document_type"
}
`;
		case "input_text": return `${contextPrompt}

Analyze text and extract specific or special data from it, also normalize data by those rules...

---

In (\`recognized_data\` key), can be written phone numbers, emails, URLs, dates, times, codes, etc. Additional formatting rules:

Normalize phone numbers, emails, URLs, dates, times, codes, etc for best efforts and by those rules.
- If phone number, format as as correct phone number (in normalized format).
  - If phone numbers (for example starts with +7, format as 8), replace to correct regional code.
  - Trim spaces from phone numbers, emails, URLs, dates, times, codes, etc.
  - Remove brackets, parentheses, spaces or other symbols from phone numbers.
- If email, format as as correct email (in normalized format), and trim spaces from email.
- If URL, format as as correct URL (in normalized format), and unicode codes to human readable, and trim spaces from URL.
- If date, format as as correct date (in normalized format).
- If time, format as as correct time (in normalized format).
- If math, format as $KaTeX$
- If table, format as | table |
- If image, format as [$image$]($image$)
- If code, format as \`\`\`$code$\`\`\` (multiline) or \`$code$\` (single-line)
- If JSON, format as correct JSON string, and trim spaces from JSON string.
- If other, format as $text$.
- If seen alike list, format as list (in markdown format).

---

Some additional actions:
- Collect some special data tags and keywords (if has any).
- Also, can you provide in markdown pre-formatted free-form analyzed or recognized verbose data (in \`verbose_data\` key).
- Detect entity type if applicable (task, event, person, place, service, item, etc.)

---

CRITICAL OUTPUT FORMAT: Return ONLY valid JSON. No markdown code blocks, no explanations, no prose.
Your response must start with { or [ and end with } or ].

Expected output structure:
{
    "keywords_and_tags": ["string array"],
    "recognized_data": ["any array"],
    "verbose_data": "markdown string",
    "using_ready": true,
    "confidence": 0.95,
    "suggested_type": "entity_type",
    "suggested_modifications": []
}
`;
	}
	return contextPrompt || "";
};
var buildContextPrompt = (context) => {
	if (!context) return "";
	const parts = [];
	if (context.operation) parts.push(`Operation: ${{
		create: "Create new data entries based on provided information.",
		modify: "Modify existing data with provided changes while preserving structure.",
		merge: "Intelligently merge new data with existing data, avoiding duplicates.",
		analyze: "Analyze and extract structured information from the data.",
		extract: "Extract specific data points matching the criteria."
	}[context.operation] || context.operation}`);
	if (context.entityType) parts.push(`Target entity type: ${context.entityType}`);
	if (context.existingData) parts.push(`Existing data context provided - consider for merge/update operations.`);
	if (context.filters?.length) {
		const filterDesc = context.filters.map((f) => `${f.field} ${f.operator} ${JSON.stringify(f.value)}`).join(", ");
		parts.push(`Apply filters: ${filterDesc}`);
	}
	if (context.searchTerms?.length) parts.push(`Search terms: ${context.searchTerms.join(", ")}`);
	if (context.priority) parts.push(`Priority level: ${context.priority}`);
	return parts.length ? `Context:\n${parts.join("\n")}\n\n---\n` : "";
};
var buildModificationPrompt = (instructions) => {
	if (!instructions?.length) return "";
	const parts = instructions.map((inst, i) => {
		const condStr = inst.conditions?.length ? ` when ${inst.conditions.map((c) => `${c.field} ${c.operator} ${JSON.stringify(c.value)}`).join(" AND ")}` : "";
		switch (inst.action) {
			case "update": return `${i + 1}. UPDATE field "${inst.target}" to ${JSON.stringify(inst.value)}${condStr}`;
			case "delete": return `${i + 1}. DELETE field "${inst.target}"${condStr}`;
			case "merge": return `${i + 1}. MERGE into "${inst.target}" with ${JSON.stringify(inst.value)}${condStr}`;
			case "append": return `${i + 1}. APPEND ${JSON.stringify(inst.value)} to "${inst.target}"${condStr}`;
			case "replace": return `${i + 1}. REPLACE "${inst.target}" with ${JSON.stringify(inst.value)}${condStr}`;
			case "transform": return `${i + 1}. TRANSFORM "${inst.target}" using: ${inst.transformFn}${condStr}`;
			default: return "";
		}
	}).filter(Boolean);
	return parts.length ? `\nModification instructions:\n${parts.join("\n")}\n` : "";
};
var DATA_MODIFICATION_PROMPT = `
You are a data modification assistant. Your task is to modify existing data based on the provided instructions.

Rules for modification:
1. Preserve the original data structure unless explicitly asked to change it.
2. Apply modifications in order, one by one.
3. Validate data types match the schema.
4. Return the complete modified entity, not just the changes.
5. If a modification cannot be applied, include it in the "errors" array with explanation.

CRITICAL: Output ONLY valid JSON. No markdown code blocks, no explanations, no prose.
Your response must start with { and end with }.

Expected output structure:
{
    "modified_entity": { /* complete modified entity */ },
    "changes_made": [ /* list of applied changes */ ],
    "errors": [ /* list of failed modifications with reasons */ ],
    "warnings": [ /* non-critical issues */ ]
}
`;
var DATA_SELECTION_PROMPT = `
You are a data selection and filtering assistant. Your task is to find and select data matching the criteria.

Selection rules:
1. Apply all filters in order (AND logic by default).
2. Rank results by relevance to search terms.
3. Include confidence scores for fuzzy matches.
4. Group similar results to avoid duplicates.

CRITICAL: Output ONLY valid JSON. No markdown code blocks, no explanations, no prose.
Your response must start with { and end with }.

Expected output structure:
{
    "selected_items": [ /* items matching criteria */ ],
    "total_matches": number,
    "filter_stats": { /* breakdown by filter */ },
    "suggestions": [ /* related items that might be relevant */ ]
}
`;
var ENTITY_MERGE_PROMPT = `
You are an entity merging assistant. Your task is to intelligently merge multiple entities or data sources.

Merge rules:
1. Prefer newer/more complete data when conflicts arise.
2. Combine arrays without duplicates.
3. Merge nested objects recursively.
4. Preserve IDs and relationships.
5. Track the source of each merged field.

CRITICAL: Output ONLY valid JSON. No markdown code blocks, no explanations, no prose.
Your response must start with { and end with }.

Expected output structure:
{
    "merged_entity": { /* result of merge */ },
    "conflicts_resolved": [ /* list of conflicts and how they were resolved */ ],
    "sources_used": [ /* which source contributed what */ ],
    "merge_confidence": number
}
`;
//#endregion
//#region src/shared/other/document/AIResponseParser.ts
/**
* Robust AI Response Parser
*
* Handles extraction of JSON from AI responses that may include:
* - Pure JSON strings
* - JSON wrapped in markdown code blocks (```json ... ```)
* - Multiple JSON code blocks (returns first valid one)
* - JSON with trailing/leading whitespace
* - JSON with BOM characters
* - Partial or malformed JSON (best-effort recovery)
*
* @see https://platform.openai.com/docs/api-reference/responses
*/
/**
* Regex patterns for extracting JSON from various formats.
* Ordered by specificity - most specific patterns first.
*/
var JSON_EXTRACTION_PATTERNS = [
	/```json\s*\n?([\s\S]*?)\n?```/i,
	/```toon\s*\n?([\s\S]*?)\n?```/i,
	/```\s*\n?([\s\S]*?)\n?```/,
	/(\{[\s\S]*\})/,
	/(\[[\s\S]*\])/
];
/**
* Clean raw text from common issues before parsing.
*/
var cleanRawText = (text) => {
	if (!text || typeof text !== "string") return "";
	return text.replace(/^\uFEFF/, "").replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
};
/**
* Attempt to fix common JSON issues.
*/
var attemptJSONRecovery = (text) => {
	let cleaned = text;
	cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1");
	cleaned = cleaned.replace(/:\s*"([^"]*)\n([^"]*)"/g, (match, p1, p2) => {
		return `: "${p1}\\n${p2}"`;
	});
	cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
	return cleaned;
};
/**
* Try to parse JSON using multiple strategies.
*/
var tryParseJSON = (text) => {
	if (!text) return {
		ok: false,
		error: "Empty input"
	};
	try {
		return {
			ok: true,
			data: JSOX.parse(text)
		};
	} catch {}
	try {
		return {
			ok: true,
			data: JSON.parse(text)
		};
	} catch {}
	try {
		const recovered = attemptJSONRecovery(text);
		return {
			ok: true,
			data: JSOX.parse(recovered)
		};
	} catch {}
	try {
		const match = text.match(/^[^{[]*([{\[][\s\S]*[}\]])[^}\]]*$/);
		if (match?.[1]) return {
			ok: true,
			data: JSOX.parse(match[1])
		};
	} catch {}
	return {
		ok: false,
		error: "Failed to parse JSON with all strategies"
	};
};
/**
* Extract JSON from AI response text.
* Handles markdown code blocks, raw JSON, and various edge cases.
*
* @param response - Raw AI response string
* @returns ParseResult with extracted data or error
*/
var extractJSONFromAIResponse = (response) => {
	if (response == null) return {
		ok: false,
		error: "Response is null or undefined"
	};
	if (typeof response !== "string") {
		if (typeof response === "object") return {
			ok: true,
			data: response,
			source: "direct"
		};
		return {
			ok: false,
			error: `Expected string, got ${typeof response}`
		};
	}
	const cleaned = cleanRawText(response);
	if (!cleaned) return {
		ok: false,
		error: "Response is empty after cleaning",
		raw: response
	};
	const directResult = tryParseJSON(cleaned);
	if (directResult.ok) return {
		ok: true,
		data: directResult.data,
		raw: response,
		source: "direct"
	};
	for (const pattern of JSON_EXTRACTION_PATTERNS) {
		const match = cleaned.match(pattern);
		if (match?.[1]) {
			const result = tryParseJSON(cleanRawText(match[1]));
			if (result.ok) return {
				ok: true,
				data: result.data,
				raw: response,
				source: "markdown_block"
			};
		}
	}
	const jsonLikeMatch = cleaned.match(/(\{[\s\S]+\}|\[[\s\S]+\])/);
	if (jsonLikeMatch?.[1]) {
		const result = tryParseJSON(attemptJSONRecovery(jsonLikeMatch[1]));
		if (result.ok) return {
			ok: true,
			data: result.data,
			raw: response,
			source: "recovered"
		};
	}
	return {
		ok: false,
		error: "Could not extract valid JSON from response",
		raw: response
	};
};
/**
* Strict JSON instructions to include in AI prompts.
* Following OpenAI Responses API best practices.
*
* @see https://platform.openai.com/docs/api-reference/responses
*/
var STRICT_JSON_INSTRUCTIONS = `
CRITICAL OUTPUT FORMAT REQUIREMENTS:

1. Your response MUST be ONLY valid JSON - no markdown, no explanations, no prose.
2. Do NOT wrap the JSON in code blocks (\`\`\`json or \`\`\`).
3. Do NOT include any text before or after the JSON object.
4. The response must start with { or [ and end with } or ].
5. All strings must be properly escaped (newlines as \\n, quotes as \\").
6. Use null for missing/unknown values, not undefined or empty strings.
7. Numbers should be unquoted. Booleans should be true/false (lowercase).
8. Arrays should not have trailing commas.
9. The JSON must be parseable by JSON.parse() without modification.

If you cannot provide the requested data, return: {"error": "description of the issue", "ok": false}
`;
//#endregion
//#region ../../node_modules/@toon-format/toon/dist/index.mjs
var NULL_LITERAL = "null";
var DELIMITERS = {
	comma: ",",
	tab: "	",
	pipe: "|"
};
var DEFAULT_DELIMITER = DELIMITERS.comma;
/**
* Escapes special characters in a string for encoding.
*
* @remarks
* Control characters outside `\n`, `\r`, `\t`, `\\`, and `"` are emitted as `\uXXXX`.
*/
function escapeString(value) {
	return value.replace(/\\/g, `\\\\`).replace(/"/g, `\\"`).replace(/\n/g, `\\n`).replace(/\r/g, `\\r`).replace(/\t/g, `\\t`).replace(/[\u0000-\u001F]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
}
function isBooleanOrNullLiteral(token) {
	return token === "true" || token === "false" || token === "null";
}
/**
* Assigns an own data property without invoking inherited accessors.
*
* @remarks
* Plain assignment of `__proto__` would hit the `Object.prototype` setter and
* corrupt the prototype chain; `defineProperty` avoids that but is markedly
* slower, so every other key takes plain assignment.
*/
function setOwnProperty(target, key, value) {
	if (key === "__proto__") {
		Object.defineProperty(target, key, {
			value,
			enumerable: true,
			writable: true,
			configurable: true
		});
		return;
	}
	target[key] = value;
}
var COMMENT_LINE_PATTERN = new RegExp(`(?:^﻿?|\\n) *#`);
/**
* Pre-formatted string that the encoder emits verbatim at a primitive value
* position, bypassing quoting, escaping, and number/keyword detection.
*
* Returned from a replacer for an object or array value, it is ignored and
* the container is encoded normally.
*/
var RawString = class {
	constructor(value) {
		if (COMMENT_LINE_PATTERN.test(value)) throw new TypeError(`Raw string must not contain a line starting with "#": ${JSON.stringify(value)}`);
		this.value = value;
	}
};
function isRawString(value) {
	return value instanceof RawString;
}
var SURROGATE_PATTERN = /[\uD800-\uDFFF]/;
function normalizeValue(value) {
	if (value === null) return null;
	if (isRawString(value)) return value;
	if (typeof value === "object" && value !== null && "toJSON" in value && typeof value.toJSON === "function") {
		const next = value.toJSON();
		if (next !== value) return normalizeValue(next);
	}
	if (typeof value === "string") {
		assertNoLoneSurrogate(value, "string value");
		return value;
	}
	if (typeof value === "boolean") return value;
	if (typeof value === "number") {
		if (Object.is(value, -0)) return 0;
		if (!Number.isFinite(value)) return null;
		return value;
	}
	if (typeof value === "bigint") {
		if (value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER) return Number(value);
		return value.toString();
	}
	if (value instanceof Date) return value.toISOString();
	if (Array.isArray(value)) return value.map(normalizeValue);
	if (value instanceof Set) return Array.from(value).map(normalizeValue);
	if (value instanceof Map) return Object.fromEntries(Array.from(value, ([k, v]) => [String(k), normalizeValue(v)]));
	if (isPlainObject(value)) {
		const encodedValues = {};
		for (const key in value) if (Object.hasOwn(value, key)) {
			assertNoLoneSurrogate(key, "object key");
			setOwnProperty(encodedValues, key, normalizeValue(value[key]));
		}
		return encodedValues;
	}
	return null;
}
function assertNoLoneSurrogate(value, context) {
	if (!SURROGATE_PATTERN.test(value)) return;
	for (let index = 0; index < value.length; index++) {
		const code = value.charCodeAt(index);
		if (code < 55296 || code > 57343) continue;
		const isHighSurrogate = code <= 56319;
		const next = value.charCodeAt(index + 1);
		if (isHighSurrogate && next >= 56320 && next <= 57343) {
			index++;
			continue;
		}
		throw new TypeError(`Cannot encode ${context} containing an unpaired surrogate U+${code.toString(16).toUpperCase()} at index ${index}`);
	}
}
function isJsonPrimitive(value) {
	return value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}
function isEncodablePrimitive(value) {
	return isJsonPrimitive(value) || isRawString(value);
}
function isJsonArray(value) {
	return Array.isArray(value);
}
function isJsonObject(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value) && !isRawString(value);
}
function isEmptyObject(value) {
	return Object.keys(value).length === 0;
}
function isPlainObject(value) {
	if (value === null || typeof value !== "object") return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
}
function isArrayOfPrimitives(value) {
	return value.length === 0 || value.every((item) => isEncodablePrimitive(item));
}
function isArrayOfArrays(value) {
	return value.length === 0 || value.every((item) => isJsonArray(item));
}
function isArrayOfObjects(value) {
	return value.length === 0 || value.every((item) => isJsonObject(item));
}
var NUMERIC_LIKE_PATTERN = /^[+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i;
/** Narrows an arbitrary delimiter option, shared by the library and the CLI so both report it alike. */
function assertValidDelimiter(delimiter) {
	if (!Object.values(DELIMITERS).includes(delimiter)) throw new TypeError(`Invalid delimiter ${JSON.stringify(delimiter)}. Valid delimiters are: comma (,), tab (\\t), pipe (|)`);
}
/**
* Checks if a key can be used without quotes.
*
* @remarks
* Valid unquoted keys must start with a letter or underscore,
* followed by letters, digits, underscores, or dots.
*/
function isValidUnquotedKey(key) {
	return /^[A-Z_][\w.]*$/i.test(key);
}
/**
* Determines if a string value can be safely encoded without quotes.
*
* @remarks
* A string needs quoting if it:
* - Is empty
* - Has leading or trailing whitespace
* - Could be confused with a literal (boolean, null, number)
* - Contains structural characters (colons, brackets, braces)
* - Contains quotes or backslashes (need escaping)
* - Contains control characters (newlines, tabs, etc.)
* - Contains the active delimiter
* - Starts with a list marker (hyphen)
* - Starts with a comment marker (#)
*/
function isSafeUnquoted(value, delimiter = DEFAULT_DELIMITER) {
	if (!value) return false;
	if (/^[ \t]|[ \t]$/.test(value)) return false;
	if (isBooleanOrNullLiteral(value) || isNumericLike(value)) return false;
	if (value.includes(":")) return false;
	if (value.includes("\"") || value.includes("\\")) return false;
	if (/[[\]{}]/.test(value)) return false;
	if (/[\u0000-\u001F]/.test(value)) return false;
	if (value.includes(delimiter)) return false;
	if (value.startsWith("-")) return false;
	if (value.startsWith("#")) return false;
	return true;
}
function isNumericLike(value) {
	return NUMERIC_LIKE_PATTERN.test(value);
}
function encodePrimitive(value, delimiter) {
	if (isRawString(value)) return value.value;
	if (value === null) return NULL_LITERAL;
	if (typeof value === "boolean") return String(value);
	if (typeof value === "number") return String(value);
	return encodeStringLiteral(value, delimiter);
}
function encodeStringLiteral(value, delimiter = DEFAULT_DELIMITER) {
	if (isSafeUnquoted(value, delimiter)) return value;
	return `"${escapeString(value)}"`;
}
function encodeKey(key) {
	if (isValidUnquotedKey(key)) return key;
	return `"${escapeString(key)}"`;
}
function encodeAndJoinPrimitives(values, delimiter = DEFAULT_DELIMITER) {
	return values.map((v) => encodePrimitive(v, delimiter)).join(delimiter);
}
function formatHeader(length, options) {
	const key = options?.key;
	const fields = options?.fields;
	const delimiter = options?.delimiter ?? ",";
	let header = "";
	if (key != null) header += encodeKey(key);
	header += `[${length}${options?.keyed ? ":" : ""}${delimiter !== DEFAULT_DELIMITER ? delimiter : ""}]`;
	if (fields) header += `{${formatFieldSegment(fields, delimiter)}}`;
	header += ":";
	return header;
}
function formatFieldSegment(fields, delimiter) {
	return fields.map((field) => encodeKey(field.name) + (field.children ? `{${formatFieldSegment(field.children, delimiter)}}` : "")).join(delimiter);
}
/** Classifies rows into a tabular field list, or undefined when they are not uniformly tabular. */
function extractTabularFields(rows) {
	if (rows.length === 0) return;
	const firstKeys = Object.keys(rows[0]);
	if (firstKeys.length === 0) return;
	for (const row of rows) {
		if (Object.keys(row).length !== firstKeys.length) return;
		for (const key of firstKeys) if (!Object.hasOwn(row, key)) return;
	}
	const fieldNodes = [];
	for (const key of firstKeys) {
		const fieldNode = classifyColumn(key, rows.map((row) => row[key]));
		if (!fieldNode) return;
		fieldNodes.push(fieldNode);
	}
	return fieldNodes;
}
/** Classifies an object's values as a keyed tabular field list (>=2 uniform non-empty object entries), or undefined. */
function extractKeyedTabularFields(value) {
	const entryValues = Object.values(value);
	if (entryValues.length < 2) return;
	if (!entryValues.every((entryValue) => isJsonObject(entryValue) && !isEmptyObject(entryValue))) return;
	return extractTabularFields(entryValues);
}
/** Reads one row's leaf cells in the field order `extractTabularFields` produced. */
function collectRowLeaves(row, fields) {
	const leaves = [];
	collectLeafValues(row, fields, leaves);
	return leaves;
}
function classifyColumn(name, values) {
	if (values.every((value) => isEncodablePrimitive(value))) return { name };
	if (!values.every((value) => isJsonObject(value) && !isEmptyObject(value))) return;
	const children = extractTabularFields(values);
	if (!children) return;
	return {
		name,
		children
	};
}
function collectLeafValues(row, fields, leaves) {
	for (const field of fields) {
		const value = row[field.name];
		if (field.children) collectLeafValues(value, field.children, leaves);
		else leaves.push(value);
	}
}
function* encodeJsonValue(value, options, depth) {
	if (isEncodablePrimitive(value)) {
		const encodedPrimitive = encodePrimitive(value, options.delimiter);
		if (encodedPrimitive !== "") yield encodedPrimitive;
		return;
	}
	if (isJsonArray(value)) yield* encodeArrayLines(void 0, value, depth, options);
	else if (isJsonObject(value)) {
		const keyedFields = extractKeyedTabularFields(value);
		if (keyedFields) {
			yield* encodeKeyedObjectLines(void 0, value, keyedFields, depth, options);
			return;
		}
		yield* encodeObjectLines(value, depth, options);
	}
}
function* encodeObjectLines(value, depth, options) {
	for (const [key, val] of Object.entries(value)) yield* encodeKeyValuePairLines(key, val, depth, options);
}
function* encodeKeyValuePairLines(key, value, depth, options) {
	const encodedKey = encodeKey(key);
	if (isEncodablePrimitive(value)) yield indentedLine(depth, `${encodedKey}: ${encodePrimitive(value, options.delimiter)}`, options.indentSize);
	else if (isJsonArray(value)) yield* encodeArrayLines(key, value, depth, options);
	else if (isJsonObject(value)) {
		const keyedFields = extractKeyedTabularFields(value);
		if (keyedFields) {
			yield* encodeKeyedObjectLines(key, value, keyedFields, depth, options);
			return;
		}
		yield indentedLine(depth, `${encodedKey}:`, options.indentSize);
		if (!isEmptyObject(value)) yield* encodeObjectLines(value, depth + 1, options);
	}
}
function* encodeKeyedObjectLines(key, value, fields, depth, options) {
	const entries = Object.entries(value);
	yield indentedLine(depth, formatHeader(entries.length, {
		key,
		fields,
		delimiter: options.delimiter,
		keyed: true
	}), options.indentSize);
	yield* encodeKeyedEntryRowsLines(entries, fields, depth + 1, options);
}
function* encodeKeyedEntryRowsLines(entries, fields, depth, options) {
	for (const [entryKey, entryValue] of entries) {
		const leaves = collectRowLeaves(entryValue, fields);
		yield indentedLine(depth, `${encodeKey(entryKey)}: ${encodeAndJoinPrimitives(leaves, options.delimiter)}`, options.indentSize);
	}
}
function* encodeArrayLines(key, value, depth, options) {
	if (value.length === 0) {
		yield indentedLine(depth, key != null ? `${encodeKey(key)}: []` : "[]", options.indentSize);
		return;
	}
	if (isArrayOfPrimitives(value)) {
		yield indentedLine(depth, encodeInlineArrayLine(value, options.delimiter, key), options.indentSize);
		return;
	}
	if (isArrayOfArrays(value)) {
		if (value.every((arr) => isArrayOfPrimitives(arr))) {
			yield* encodeArrayOfArraysAsListItemsLines(key, value, depth, options);
			return;
		}
	}
	if (isArrayOfObjects(value)) {
		const fields = extractTabularFields(value);
		if (fields) yield* encodeArrayOfObjectsAsTabularLines(key, value, fields, depth, options);
		else yield* encodeMixedArrayAsListItemsLines(key, value, depth, options);
		return;
	}
	yield* encodeMixedArrayAsListItemsLines(key, value, depth, options);
}
function* encodeArrayOfArraysAsListItemsLines(prefix, values, depth, options) {
	yield indentedLine(depth, formatHeader(values.length, {
		key: prefix,
		delimiter: options.delimiter
	}), options.indentSize);
	for (const arr of values) if (isArrayOfPrimitives(arr)) {
		const arrayLine = encodeInlineArrayLine(arr, options.delimiter);
		yield indentedListItem(depth + 1, arrayLine, options.indentSize);
	}
}
function encodeInlineArrayLine(values, delimiter, prefix) {
	const header = formatHeader(values.length, {
		key: prefix,
		delimiter
	});
	const joinedValue = encodeAndJoinPrimitives(values, delimiter);
	if (values.length === 0) return header;
	return `${header} ${joinedValue}`;
}
function* encodeArrayOfObjectsAsTabularLines(prefix, rows, fields, depth, options) {
	yield indentedLine(depth, formatHeader(rows.length, {
		key: prefix,
		fields,
		delimiter: options.delimiter
	}), options.indentSize);
	yield* writeTabularRowsLines(rows, fields, depth + 1, options);
}
function* writeTabularRowsLines(rows, fields, depth, options) {
	for (const row of rows) yield indentedLine(depth, encodeAndJoinPrimitives(collectRowLeaves(row, fields), options.delimiter), options.indentSize);
}
function* encodeMixedArrayAsListItemsLines(prefix, items, depth, options) {
	yield indentedLine(depth, formatHeader(items.length, {
		key: prefix,
		delimiter: options.delimiter
	}), options.indentSize);
	for (const item of items) yield* encodeListItemValueLines(item, depth + 1, options);
}
function* encodeObjectAsListItemLines(obj, depth, options) {
	if (isEmptyObject(obj)) {
		yield indentedLine(depth, "-", options.indentSize);
		return;
	}
	const entries = Object.entries(obj);
	const [firstKey, firstValue] = entries[0];
	const restEntries = entries.slice(1);
	if (isJsonArray(firstValue) && isArrayOfObjects(firstValue)) {
		const fields = extractTabularFields(firstValue);
		if (fields) {
			yield indentedListItem(depth, formatHeader(firstValue.length, {
				key: firstKey,
				fields,
				delimiter: options.delimiter
			}), options.indentSize);
			yield* writeTabularRowsLines(firstValue, fields, depth + 2, options);
			if (restEntries.length > 0) yield* encodeObjectLines(Object.fromEntries(restEntries), depth + 1, options);
			return;
		}
	}
	if (isJsonObject(firstValue)) {
		const keyedFields = extractKeyedTabularFields(firstValue);
		if (keyedFields) {
			const keyedEntries = Object.entries(firstValue);
			yield indentedListItem(depth, formatHeader(keyedEntries.length, {
				key: firstKey,
				fields: keyedFields,
				delimiter: options.delimiter,
				keyed: true
			}), options.indentSize);
			yield* encodeKeyedEntryRowsLines(keyedEntries, keyedFields, depth + 2, options);
			if (restEntries.length > 0) yield* encodeObjectLines(Object.fromEntries(restEntries), depth + 1, options);
			return;
		}
	}
	const encodedKey = encodeKey(firstKey);
	if (isEncodablePrimitive(firstValue)) yield indentedListItem(depth, `${encodedKey}: ${encodePrimitive(firstValue, options.delimiter)}`, options.indentSize);
	else if (isJsonArray(firstValue)) if (firstValue.length === 0) yield indentedListItem(depth, `${encodedKey}: []`, options.indentSize);
	else if (isArrayOfPrimitives(firstValue)) yield indentedListItem(depth, `${encodedKey}${encodeInlineArrayLine(firstValue, options.delimiter)}`, options.indentSize);
	else {
		yield indentedListItem(depth, `${encodedKey}${formatHeader(firstValue.length, { delimiter: options.delimiter })}`, options.indentSize);
		for (const item of firstValue) yield* encodeListItemValueLines(item, depth + 2, options);
	}
	else if (isJsonObject(firstValue)) {
		yield indentedListItem(depth, `${encodedKey}:`, options.indentSize);
		if (!isEmptyObject(firstValue)) yield* encodeObjectLines(firstValue, depth + 2, options);
	}
	if (restEntries.length > 0) yield* encodeObjectLines(Object.fromEntries(restEntries), depth + 1, options);
}
function* encodeListItemValueLines(value, depth, options) {
	if (isEncodablePrimitive(value)) yield indentedListItem(depth, encodePrimitive(value, options.delimiter), options.indentSize);
	else if (isJsonArray(value)) if (isArrayOfPrimitives(value)) yield indentedListItem(depth, encodeInlineArrayLine(value, options.delimiter), options.indentSize);
	else {
		yield indentedListItem(depth, formatHeader(value.length, { delimiter: options.delimiter }), options.indentSize);
		for (const item of value) yield* encodeListItemValueLines(item, depth + 1, options);
	}
	else if (isJsonObject(value)) yield* encodeObjectAsListItemLines(value, depth, options);
}
function indentedLine(depth, content, indentSize) {
	return " ".repeat(indentSize * depth) + content;
}
function indentedListItem(depth, content, indentSize) {
	return indentedLine(depth, "- " + content, indentSize);
}
/**
* Applies a replacer function to a `JsonValue` and all its descendants.
*
* The replacer is called for the root (key='', path=[]), every object property
* (key = property name), and every array element (key = string index).
*/
function applyReplacer(root, replacer) {
	const replacedRoot = replacer("", root, []);
	if (replacedRoot === void 0) return transformChildren(root, replacer, []);
	return transformReplaced(root, replacedRoot, replacer, []);
}
/**
* Resolves a replacer's (non-`undefined`) return value at a single position.
*
* A `RawString` only stands in for a primitive: returned for an object or
* array value, it is ignored and the original container is traversed normally.
*/
function transformReplaced(original, replaced, replacer, path) {
	if (isRawString(replaced) && !isEncodablePrimitive(original)) return transformChildren(original, replacer, path);
	return transformChildren(normalizeValue(replaced), replacer, path);
}
function transformChildren(value, replacer, path) {
	if (isJsonObject(value)) return transformObject(value, replacer, path);
	if (isJsonArray(value)) return transformArray(value, replacer, path);
	return value;
}
function transformObject(obj, replacer, path) {
	const result = {};
	for (const [key, value] of Object.entries(obj)) {
		const childPath = [...path, key];
		const replacedValue = replacer(key, value, childPath);
		if (replacedValue === void 0) continue;
		setOwnProperty(result, key, transformReplaced(value, replacedValue, replacer, childPath));
	}
	return result;
}
function transformArray(arr, replacer, path) {
	const result = [];
	for (let i = 0; i < arr.length; i++) {
		const value = arr[i];
		const childPath = [...path, i];
		const replacedValue = replacer(String(i), value, childPath);
		if (replacedValue === void 0) continue;
		result.push(transformReplaced(value, replacedValue, replacer, childPath));
	}
	return result;
}
/**
* Encodes a JavaScript value into TOON format string.
*
* @param input Any JavaScript value (objects, arrays, primitives)
* @param options Optional encoding configuration
* @returns TOON formatted string
*
* @example
* ```ts
* encode({ name: 'Ada', age: 30 })
* // name: Ada
* // age: 30
*
* encode({ users: [{ id: 1 }, { id: 2 }] })
* // users[2]{id}:
* //   1
* //   2
*
* encode({ tags: [] })
* // tags: []
*
* encode(data, { indentSize: 4 })
* ```
*/
function encode(input, options) {
	return Array.from(encodeLines(input, options)).join("\n");
}
/**
* Encodes a JavaScript value into TOON format as a sequence of lines.
*
* This function yields TOON lines one at a time without building the full string,
* making it suitable for streaming large outputs to files, HTTP responses, or process stdout.
*
* @param input Any JavaScript value (objects, arrays, primitives)
* @param options Optional encoding configuration
* @returns Iterable of TOON lines (without trailing newlines)
*
* @example
* ```ts
* // Stream to stdout
* for (const line of encodeLines({ name: 'Ada', age: 30 })) {
*   console.log(line)
* }
*
* // Collect to array
* const lines = Array.from(encodeLines(data))
*
* // Equivalent to encode()
* const toonString = Array.from(encodeLines(data, options)).join('\n')
* ```
*/
function encodeLines(input, options) {
	const normalizedValue = normalizeValue(input);
	const resolvedOptions = resolveOptions(options);
	return encodeJsonValue(resolvedOptions.replacer ? applyReplacer(normalizedValue, resolvedOptions.replacer) : normalizedValue, resolvedOptions, 0);
}
function resolveOptions(options) {
	const delimiter = options?.delimiter ?? DEFAULT_DELIMITER;
	assertValidDelimiter(delimiter);
	return {
		indentSize: options?.indentSize ?? options?.indent ?? 2,
		delimiter,
		replacer: options?.replacer
	};
}
//#endregion
//#region src/shared/service/model/GPT-Responses.ts
var hasFile = () => typeof globalThis.File !== "undefined";
var hasBlob = () => typeof globalThis.Blob !== "undefined";
var DEFAULT_REQUEST_TIMEOUTS = {
	low: 6e4,
	medium: 3e5,
	high: 9e5
};
var RETRY_DELAY = 2e3;
/**
* INVARIANT: `/v1/responses` assistant content is `output_text` | `refusal`.
* Replay of chat history must not send `input_text` on role=assistant.
*/
var normalizeResponsesContentPart = (role, part) => {
	if (!part || typeof part !== "object") return part;
	const type = String(part.type || "");
	if (role === "assistant") {
		if (type === "refusal" || type === "output_text") return part;
		if (type === "input_text" || type === "text" || !type) return {
			...part,
			type: "output_text"
		};
		return part;
	}
	if (type === "output_text" || type === "text") return {
		...part,
		type: "input_text"
	};
	return part;
};
var normalizeResponsesInputItem = (item) => {
	if (!item || typeof item !== "object") return item;
	if (item.type && item.type !== "message") return item;
	const role = String(item.role || "user").toLowerCase();
	if (!Array.isArray(item.content)) return item;
	return {
		...item,
		content: item.content.map((part) => normalizeResponsesContentPart(role, part))
	};
};
var getRuntimeAiSettings = () => {
	return globalThis.runtimeSettings?.ai || {};
};
var normalizeDurationMs = (value, fallback) => {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return fallback;
	if (value < 1e3) return value * 1e3;
	return value;
};
/**
* Get timeout configuration from settings or use defaults
*/
function getTimeoutConfig(effort) {
	const settings = getRuntimeAiSettings();
	const timeoutSettings = settings?.requestTimeout;
	const maxRetries = typeof settings?.maxRetries === "number" ? Math.max(0, Math.floor(settings.maxRetries)) : 2;
	return {
		timeout: normalizeDurationMs(timeoutSettings?.[effort], DEFAULT_REQUEST_TIMEOUTS[effort]),
		maxRetries
	};
}
var toBase64 = (bytes) => {
	if (typeof globalThis.Buffer !== "undefined") return globalThis.Buffer.from(bytes).toString("base64");
	const CHUNK_SIZE = 1048576;
	if (bytes.length > CHUNK_SIZE) {
		let result = "";
		for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
			const chunk = bytes.slice(i, i + CHUNK_SIZE);
			let binary = "";
			for (let j = 0; j < chunk.length; j++) binary += String.fromCharCode(chunk[j]);
			result += typeof btoa === "function" ? btoa(binary) : "";
		}
		return result;
	}
	let binary = "";
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	return typeof btoa === "function" ? btoa(binary) : "";
};
var getUsableData = async (data) => {
	const FileCtor = hasFile() ? globalThis.File : void 0;
	const BlobCtor = hasBlob() ? globalThis.Blob : void 0;
	if (BlobCtor && data?.dataSource instanceof BlobCtor || FileCtor && data?.dataSource instanceof FileCtor) {
		const fileSize = data?.dataSource?.size || 0;
		const MAX_FILE_SIZE = 10485760;
		if (fileSize > MAX_FILE_SIZE) {
			console.warn(`[GPT-Responses] File too large: ${fileSize} bytes > ${MAX_FILE_SIZE} bytes`);
			return {
				"type": "input_text",
				"text": `[File too large: ${(fileSize / 1024 / 1024).toFixed(1)}MB. Maximum allowed: ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB]`
			};
		}
		if (typesForKind?.[data?.dataKind || "input_text"] === "input_image" || data?.dataSource?.type?.startsWith?.("image/")) try {
			const BASE64URL = `data:${data?.dataSource?.type};base64,`;
			const arrayBuffer = await data?.dataSource?.arrayBuffer();
			if (!arrayBuffer) throw new Error("Failed to read file as ArrayBuffer");
			return {
				"type": "input_image",
				"detail": "auto",
				"image_url": BASE64URL + toBase64(new Uint8Array(arrayBuffer))
			};
		} catch (error) {
			console.error("[GPT-Responses] Failed to process image file:", error);
			return {
				"type": "input_text",
				"text": `[Failed to process image file: ${error}]`
			};
		}
		try {
			const text = await data?.dataSource?.text?.();
			if (text) return {
				"type": "input_text",
				"text": text
			};
		} catch (error) {
			console.error("[GPT-Responses] Failed to read text file:", error);
			return {
				"type": "input_text",
				"text": `[Failed to read text file: ${error}]`
			};
		}
	} else if (typeof data?.dataSource == "string") {
		const effectiveKind = data?.dataKind || detectDataKindFromContent(data.dataSource);
		if (typesForKind?.[effectiveKind] == "input_image") {
			const content = data?.dataSource?.trim?.() || "";
			if (content.startsWith("data:image/") && content.includes(";base64,")) try {
				const url = new URL(content);
				if (url.protocol === "data:" && url.pathname.startsWith("image/")) return {
					"type": "input_image",
					"image_url": content,
					"detail": "auto"
				};
			} catch {}
			else if (canParseURL(content)) return {
				"type": "input_image",
				"image_url": content,
				"detail": "auto"
			};
		}
		return {
			"type": "input_text",
			"text": data?.dataSource
		};
	}
	let result = data?.dataSource;
	try {
		result = typeof data?.dataSource != "object" ? data?.dataSource : encode(data?.dataSource);
	} catch (e) {
		console.warn(e);
	}
	return {
		"type": typesForKind?.[data?.dataKind || "input_text"] || "text",
		"text": result
	};
};
var GPTResponses = class {
	apiKey;
	apiSecret;
	apiUrl = "https://api.proxyapi.ru/openai/v1";
	model = "gpt-5.6-luna";
	responseId = null;
	pending = [];
	messages = [];
	tools = /* @__PURE__ */ new Map();
	context = null;
	responseMap = /* @__PURE__ */ new Map();
	constructor(apiKey, apiUrl, apiSecret, model) {
		this.apiKey = apiKey || "";
		this.apiUrl = apiUrl || this.apiUrl;
		this.apiSecret = apiSecret || "";
		this.model = model || this.model;
	}
	setContext(context) {
		this.context = context;
		return this;
	}
	async useMCP(serverLabel, origin, clientKey, secretKey) {
		this.tools.set(origin?.trim?.(), {
			"type": "mcp",
			"server_label": serverLabel,
			"server_url": origin,
			"headers": { "authorization": `Bearer ${clientKey}:${secretKey}` },
			"require_approval": "never"
		});
		return this.tools.get(origin?.trim?.());
	}
	async convertPlainToInput(dataSource, dataKind = null, additionalAction = null) {
		dataKind ??= getDataKindByMIMEType(dataSource?.type) || "input_text";
		const dataInput = {
			dataSource,
			dataKind,
			context: this.context
		};
		const usableData = await getUsableData(dataInput);
		return {
			type: "message",
			role: "user",
			content: [
				{
					type: "input_text",
					text: "What to do: " + actionWithDataType(dataInput)
				},
				additionalAction ? {
					type: "input_text",
					text: "Additional request data: " + additionalAction
				} : null,
				{
					type: "input_text",
					text: "\n === BEGIN:ATTACHED_DATA === \n"
				},
				{ ...usableData },
				{
					type: "input_text",
					text: "\n === END:ATTACHED_DATA === \n"
				}
			].filter?.((item) => item !== null)
		};
	}
	async attachToRequest(dataSource, dataKind = null, firstAction = null) {
		this.pending.push(await this.convertPlainToInput(dataSource, dataKind ??= getDataKindByMIMEType(dataSource?.type) || "input_text"));
		if (firstAction) this.pending.push(await this.askToDoAction(firstAction));
		return this.pending[this.pending.length - 1];
	}
	async attachExistingData(existingData, entityType) {
		this.context = {
			...this.context,
			existingData,
			entityType: entityType || this.context?.entityType
		};
		await this.giveForRequest(`existing_data: \`${encode(existingData)}\`\n`);
		return this;
	}
	async giveForRequest(whatIsIt) {
		if (typeof whatIsIt !== "string") try {
			const dataKind = getDataKindByMIMEType(whatIsIt?.type) || "input_text";
			const usable = await getUsableData({
				dataSource: whatIsIt,
				dataKind,
				context: this.context
			});
			this?.pending?.push?.({
				type: "message",
				role: "user",
				content: [
					{
						type: "input_text",
						text: "Additional data for request:"
					},
					{
						type: "input_text",
						text: "\n === BEGIN:ATTACHED_DATA === \n"
					},
					{ ...usable },
					{
						type: "input_text",
						text: "\n === END:ATTACHED_DATA === \n"
					}
				]
			});
			return this?.pending?.[this?.pending?.length - 1];
		} catch (e) {
			whatIsIt = String(whatIsIt);
		}
		this?.pending?.push?.({
			type: "message",
			role: "user",
			content: [{
				type: "input_text",
				text: "Additional data for request:"
			}, {
				type: "input_text",
				text: String(whatIsIt)
			}]
		});
		return this?.pending?.[this?.pending?.length - 1];
	}
	async askToDoAction(action) {
		this?.pending?.push?.({
			type: "message",
			role: "user",
			content: [{
				type: "input_text",
				text: action
			}]
		});
		return this?.pending?.[this?.pending?.length - 1];
	}
	beginFromResponseId(responseId = null) {
		this.responseId = this.responseId = responseId || this.responseId;
		return this;
	}
	async sendRequest(effort = "low", verbosity = "low", prevResponseId = null, options = {}) {
		effort ??= "low";
		verbosity ??= "low";
		const uniquePending = /* @__PURE__ */ new Map();
		for (const item of this.pending) {
			if (!item) continue;
			try {
				const key = typeof item === "object" ? JSOX.stringify(item) : String(item);
				if (!uniquePending.has(key)) uniquePending.set(key, item);
			} catch (e) {
				uniquePending.set(Math.random().toString(), item);
			}
		}
		const filteredInput = Array.from(uniquePending.values()).map(normalizeResponsesInputItem);
		const jsonInstructions = options?.responseFormat === "json" ? STRICT_JSON_INSTRUCTIONS : void 0;
		const runtimeAi = getRuntimeAiSettings();
		const configuredMaxTokens = typeof runtimeAi?.maxOutputTokens === "number" && Number.isFinite(runtimeAi.maxOutputTokens) ? Math.max(1, Math.floor(runtimeAi.maxOutputTokens)) : void 0;
		const requestBody = {
			model: this.model,
			tools: Array.from(this?.tools?.values?.() || [])?.filter?.((tool) => !!tool),
			input: filteredInput,
			reasoning: { "effort": effort },
			text: { verbosity },
			max_output_tokens: options?.maxTokens || configuredMaxTokens || 4e5,
			previous_response_id: this.responseId = prevResponseId || this?.responseId,
			instructions: jsonInstructions
		};
		if (runtimeAi?.contextTruncation === "auto" || runtimeAi?.contextTruncation === "disabled") requestBody.truncation = runtimeAi.contextTruncation;
		if (runtimeAi?.promptCacheRetention === "in-memory" || runtimeAi?.promptCacheRetention === "24h") requestBody.prompt_cache_retention = runtimeAi.promptCacheRetention;
		if (typeof runtimeAi?.maxToolCalls === "number" && Number.isFinite(runtimeAi.maxToolCalls)) requestBody.max_tool_calls = Math.max(1, Math.floor(runtimeAi.maxToolCalls));
		if (typeof runtimeAi?.parallelToolCalls === "boolean") requestBody.parallel_tool_calls = runtimeAi.parallelToolCalls;
		const { timeout: timeoutMs, maxRetries } = getTimeoutConfig(effort);
		console.log("[GPT] Making request to:", `${this?.apiUrl}/responses`);
		console.log("[GPT] API key present:", !!this?.apiKey);
		console.log("[GPT] Request timeout:", `${timeoutMs}ms (${timeoutMs / 1e3}s) (${effort} effort)`);
		console.log("[GPT] Max retries:", maxRetries);
		console.log("[GPT] Request body size:", JSON.stringify(requestBody).length, "characters");
		console.log("[GPT] Request input count:", filteredInput.length, "items");
		let lastError = null;
		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			if (options.signal?.aborted) throw new DOMException("Cancelled", "AbortError");
			if (attempt > 0) {
				console.log(`[GPT] Retry attempt ${attempt}/${maxRetries} after ${RETRY_DELAY}ms delay`);
				await new Promise((resolve, reject) => {
					const timeout = setTimeout(resolve, RETRY_DELAY);
					const cancel = () => {
						clearTimeout(timeout);
						reject(new DOMException("Cancelled", "AbortError"));
					};
					options.signal?.addEventListener("abort", cancel, { once: true });
				});
			}
			const controller = new AbortController();
			const cancel = () => controller.abort(options.signal?.reason || "cancelled");
			options.signal?.addEventListener("abort", cancel, { once: true });
			const timeoutId = setTimeout(() => {
				console.warn(`[GPT] Request timeout after ${timeoutMs}ms (attempt ${attempt + 1}) - aborting request`);
				controller.abort("timeout");
			}, timeoutMs);
			try {
				console.log(`[GPT] Sending request (attempt ${attempt + 1})...`);
				const response = await fetch(`${this?.apiUrl}/responses`, {
					method: "POST",
					priority: "auto",
					signal: controller.signal,
					headers: {
						"Content-Type": "application/json",
						...this?.apiKey ? { "Authorization": `Bearer ${this?.apiKey}` } : {}
					},
					body: JSON.stringify(requestBody)
				});
				console.log(`[GPT] Request sent successfully (attempt ${attempt + 1})`);
				console.log("[GPT] Response status:", response.status, `(attempt ${attempt + 1})`);
				if (response.status !== 200) {
					const error = await response?.json?.()?.catch?.((e) => {
						console.error("[GPT] Failed to parse error response:", e);
						return null;
					});
					const errorMessage = error?.error?.message || error?.message || `HTTP ${response.status}`;
					lastError = /* @__PURE__ */ new Error(`API error (${response.status}): ${errorMessage}`);
					console.error("[GPT] API error:", errorMessage);
					if (response.status >= 400 && response.status < 500) throw lastError;
					continue;
				}
				return await this.processSuccessfulResponse(response);
			} catch (e) {
				lastError = e instanceof Error ? e : new Error(String(e));
				console.error(`[GPT] Request failed (attempt ${attempt + 1}):`, lastError.message);
				if (options.signal?.aborted || lastError.name === "AbortError" || /API error \(4\d{2}\)/.test(lastError.message)) break;
			} finally {
				clearTimeout(timeoutId);
				options.signal?.removeEventListener("abort", cancel);
			}
		}
		const errorMessage = lastError ? lastError.message : "Unknown error after all retries";
		console.error("[GPT] All retry attempts failed:", errorMessage);
		throw new Error(`Request failed after ${maxRetries + 1} attempts: ${errorMessage}`);
	}
	/**
	* Process a successful response from the API
	*/
	async processSuccessfulResponse(response) {
		const resp = await response?.json?.()?.catch?.((e) => {
			console.warn("[GPT] Failed to parse successful response:", e);
			return null;
		});
		if (!resp) return null;
		console.log("[GPT] Raw API response structure:", {
			type: typeof resp,
			isArray: Array.isArray(resp),
			keys: Object.keys(resp).slice(0, 10),
			keysLength: Object.keys(resp).length,
			sample: JSON.stringify(resp).substring(0, 300)
		});
		this.responseMap.set(this.responseId = resp?.id || resp?.response_id || this.responseId, resp);
		this?.messages?.push?.(...this?.pending || []);
		this?.pending?.splice?.(0, this?.pending?.length);
		this.messages.push(...resp?.output || []);
		const extractText = (r) => {
			try {
				if (!r) return null;
				if (typeof r === "string") {
					if (r.startsWith("\"") && r.endsWith("\"") && r.includes("\\n")) try {
						const parsed = JSON.parse(r);
						console.log("[GPT] Parsed JSON string response:", typeof parsed, parsed?.substring?.(0, 100) || "object");
						if (typeof parsed === "string") return parsed;
						else if (typeof parsed === "object") return extractText(parsed);
					} catch (e) {
						console.log("[GPT] Failed to parse JSON string, treating as plain text");
					}
					return r;
				}
				if (Array.isArray(r)) {
					console.log("[GPT] Response is array with", r.length, "items");
					console.log("[GPT] First few array items:", r.slice(0, 3).map((item) => ({
						type: typeof item,
						keys: typeof item === "object" ? Object.keys(item || {}) : "N/A",
						sample: typeof item === "string" ? item.substring(0, 50) : JSON.stringify(item).substring(0, 100)
					})));
					const texts = [];
					for (const item of r) if (typeof item === "string") texts.push(item);
					else if (item?.text) texts.push(item.text);
					else if (item?.content) texts.push(item.content);
					else if (item?.message?.content) texts.push(item.message.content);
					if (texts.length) return texts.join("\n\n");
				}
				if (typeof r === "object" && Object.keys(r).every((key) => !isNaN(Number(key)))) {
					console.log("[GPT] Response looks like array with", Object.keys(r).length, "numeric keys");
					const texts = [];
					for (const key of Object.keys(r).sort((a, b) => Number(a) - Number(b))) {
						const item = r[key];
						if (typeof item === "string") texts.push(item);
						else if (item?.text) texts.push(item.text);
						else if (item?.content) texts.push(item.content);
						else if (item?.message?.content) texts.push(item.message.content);
					}
					if (texts.length) return texts.join("\n\n");
				}
				if (r.output_text && Array.isArray(r.output_text) && r.output_text.length) return r.output_text.join("\n\n");
				const outputs = r.output || r.choices || [];
				const texts = [];
				for (const msg of outputs) {
					const content = msg?.content || msg?.message?.content || [];
					if (!content) continue;
					if (typeof content === "string") texts.push(content);
					else if (Array.isArray(content)) {
						for (const part of content) if (typeof part?.text === "string") texts.push(part.text);
						else if (part?.text?.value) texts.push(part.text.value);
					}
				}
				if (texts.length) return texts.join("\n\n");
			} catch (e) {
				console.warn("[GPT] Error extracting text:", e);
			}
			return null;
		};
		const text = extractText(resp);
		console.log("[GPT] Extracted text result:", text ? `"${text.substring(0, 100)}..."` : "null");
		if (text != null) return JSON.stringify({
			choices: [{ message: { content: text } }],
			usage: resp?.usage || {},
			id: this.responseId,
			object: "chat.completion"
		});
		try {
			const fallbackText = JSOX.parse(resp?.output ?? resp);
			if (fallbackText) return JSON.stringify({
				choices: [{ message: { content: typeof fallbackText === "string" ? fallbackText : JSON.stringify(fallbackText) } }],
				usage: resp?.usage || {},
				id: this.responseId,
				object: "chat.completion"
			});
		} catch {}
		return JSON.stringify({
			choices: [{ message: { content: "No text content available" } }],
			usage: {},
			id: this.responseId,
			object: "chat.completion"
		});
	}
	async modifyExistingData(existingData, modificationPrompt, instructions = []) {
		try {
			this.setContext({
				operation: "modify",
				existingData
			});
			await this.giveForRequest(DATA_MODIFICATION_PROMPT);
			await this.giveForRequest(`existing_entity: \`${encode(existingData)}\`\n`);
			if (instructions.length) await this.giveForRequest(buildModificationPrompt(instructions));
			await this.askToDoAction(modificationPrompt);
			const parseResult = extractJSONFromAIResponse(await this.sendRequest("high", "medium", null, {
				responseFormat: "json",
				temperature: .2
			}));
			if (!parseResult.ok) {
				console.warn("JSON extraction failed:", parseResult.error, "Raw:", parseResult.raw);
				return {
					ok: false,
					error: parseResult.error || "Failed to parse AI response"
				};
			}
			return {
				ok: true,
				data: parseResult.data?.modified_entity || parseResult.data,
				responseId: this.responseId
			};
		} catch (e) {
			console.error("Error in modifyExistingData:", e);
			return {
				ok: false,
				error: String(e)
			};
		}
	}
	async selectAndFilterData(dataSet, filters, searchTerms = []) {
		try {
			this.setContext({
				operation: "extract",
				filters,
				searchTerms
			});
			await this.giveForRequest(DATA_SELECTION_PROMPT);
			await this.giveForRequest(`data_set: \`${encode(dataSet)}\`\n`);
			const filterDesc = filters.map((f) => `Filter: ${f.field} ${f.operator} ${JSON.stringify(f.value)}`).join("\n");
			await this.askToDoAction(`
Select items from the provided data set matching these criteria:
${filterDesc}
${searchTerms.length ? `\nSearch terms: ${searchTerms.join(", ")}` : ""}

Return matching items with relevance scores.
            `);
			const parseResult = extractJSONFromAIResponse(await this.sendRequest("medium", "low", null, {
				responseFormat: "json",
				temperature: .1
			}));
			if (!parseResult.ok) {
				console.warn("JSON extraction failed:", parseResult.error, "Raw:", parseResult.raw);
				return {
					ok: false,
					error: parseResult.error || "Failed to parse AI response"
				};
			}
			return {
				ok: true,
				data: parseResult.data?.selected_items || parseResult.data,
				responseId: this.responseId
			};
		} catch (e) {
			console.error("Error in selectAndFilterData:", e);
			return {
				ok: false,
				error: String(e)
			};
		}
	}
	async mergeEntities(primary, secondary, mergeStrategy = "prefer_primary") {
		try {
			this.setContext({
				operation: "merge",
				existingData: primary
			});
			await this.giveForRequest(ENTITY_MERGE_PROMPT);
			await this.giveForRequest(`primary_entity: \`${encode(primary)}\`\n`);
			await this.giveForRequest(`secondary_data: \`${encode(secondary)}\`\n`);
			await this.askToDoAction(`
Merge the secondary data into the primary entity using "${mergeStrategy}" strategy:
- prefer_primary: Keep primary values when conflicts occur
- prefer_secondary: Use secondary values when conflicts occur
- prefer_newer: Compare timestamps and use newer values
- merge_all: Combine all unique values (arrays concatenated, objects deeply merged)

Return the merged entity with conflict resolution details.
            `);
			const parseResult = extractJSONFromAIResponse(await this.sendRequest("high", "medium", null, {
				responseFormat: "json",
				temperature: .2
			}));
			if (!parseResult.ok) {
				console.warn("JSON extraction failed:", parseResult.error, "Raw:", parseResult.raw);
				return {
					ok: false,
					error: parseResult.error || "Failed to parse AI response"
				};
			}
			return {
				ok: true,
				data: parseResult.data?.merged_entity || parseResult.data,
				responseId: this.responseId
			};
		} catch (e) {
			console.error("Error in mergeEntities:", e);
			return {
				ok: false,
				error: String(e)
			};
		}
	}
	async searchSimilar(referenceEntity, candidateSet, similarityThreshold = .7) {
		try {
			this.setContext({ operation: "analyze" });
			await this.giveForRequest(`reference_entity: \`${encode(referenceEntity)}\`\n`);
			await this.giveForRequest(`candidate_set: \`${encode(candidateSet)}\`\n`);
			await this.askToDoAction(`
Find items in the candidate set that are similar to the reference entity.
Consider semantic similarity, not just exact matches.
Compare:
- Names/titles (fuzzy match)
- Types/kinds
- Properties overlap
- Relationships

Return items with similarity score >= ${similarityThreshold}

Expected output structure:
{
    "similar_items": [
        { "item": {...}, "similarity": 0.85, "match_reasons": [...] }
    ],
    "potential_duplicates": [...],
    "related_but_different": [...]
}
            `);
			const parseResult = extractJSONFromAIResponse(await this.sendRequest("medium", "medium", null, {
				responseFormat: "json",
				temperature: .3
			}));
			if (!parseResult.ok) {
				console.warn("JSON extraction failed:", parseResult.error, "Raw:", parseResult.raw);
				return {
					ok: false,
					error: parseResult.error || "Failed to parse AI response"
				};
			}
			return {
				ok: true,
				data: parseResult.data?.similar_items || [],
				responseId: this.responseId
			};
		} catch (e) {
			console.error("Error in searchSimilar:", e);
			return {
				ok: false,
				error: String(e)
			};
		}
	}
	async batchProcess(items, operation, batchSize = 10) {
		const results = [];
		const errors = [];
		for (let i = 0; i < items.length; i += batchSize) {
			const batch = items.slice(i, i + batchSize);
			await this.giveForRequest(`batch_items: \`${encode(batch)}\`\n`);
			await this.askToDoAction(`
Process this batch of ${batch.length} items:
${operation}

Return processed items in same order.
Expected output: { "processed": [...], "failed": [...] }
            `);
			const raw = await this.sendRequest("medium", "low", null, { responseFormat: "json" });
			if (raw) {
				const parseResult = extractJSONFromAIResponse(raw);
				if (parseResult.ok && parseResult.data) {
					results.push(...parseResult.data?.processed || []);
					if (parseResult.data?.failed?.length) errors.push(...parseResult.data.failed.map((f) => f?.error || "Unknown error"));
				} else console.warn("Batch parsing failed:", parseResult.error);
			}
		}
		return {
			ok: errors.length === 0,
			data: results,
			error: errors.length ? errors.join("; ") : void 0,
			responseId: this.responseId
		};
	}
	clearPending() {
		this.pending.splice(0, this.pending.length);
		return this;
	}
	getResponseId() {
		return this?.responseId;
	}
	getMessages() {
		return this?.messages;
	}
	getPending() {
		return this?.pending;
	}
	getContext() {
		return this?.context;
	}
	getResponse(responseId) {
		return this?.responseMap?.get?.(responseId);
	}
};
var createGPTInstance = (apiKey, apiUrl, model) => {
	return new GPTResponses(apiKey, apiUrl || "https://api.proxyapi.ru/openai/v1", "", model || "gpt-5.6-luna");
};
var normalizeMcpConfigList = (mcp) => {
	if (!Array.isArray(mcp)) return [];
	const parsed = [];
	for (const item of mcp) {
		const raw = item;
		if (!raw || typeof raw !== "object") continue;
		const origin = String(raw?.origin || "").trim();
		const clientKey = String(raw?.clientKey || "").trim();
		const secretKey = String(raw?.secretKey || "").trim();
		if (!origin || !clientKey || !secretKey) continue;
		const serverLabel = String(raw?.serverLabel || raw?.label || origin).trim() || origin;
		parsed.push({
			id: String(raw?.id || origin),
			serverLabel,
			origin,
			clientKey,
			secretKey
		});
	}
	return parsed;
};
var configureMcpTools = async (gpt, mcpConfigs) => {
	const normalized = normalizeMcpConfigList(mcpConfigs);
	if (!normalized.length) return;
	for (const item of normalized) await gpt.useMCP(item.serverLabel, item.origin, item.clientKey, item.secretKey);
};
var resolveConfiguredModel = (model, customModel) => {
	const selected = String(model || "").trim();
	const custom = String(customModel || "").trim();
	if (selected === "custom") return custom || "gpt-5.6-luna";
	return selected || custom || "gpt-5.6-luna";
};
var getGPTInstance = async (config) => {
	const settings = await loadSettings();
	const apiKey = config?.apiKey || settings?.ai?.apiKey;
	if (!apiKey) return null;
	const gpt = createGPTInstance(apiKey, config?.baseUrl || settings?.ai?.baseUrl || "https://api.proxyapi.ru/openai/v1", resolveConfiguredModel(config?.model || settings?.ai?.model, config?.customModel || settings?.ai?.customModel));
	await configureMcpTools(gpt, config?.mcp ?? settings?.ai?.mcp);
	return gpt;
};
function unwrapUnwantedCodeBlocks(content) {
	if (!content) return content;
	const match = content.trim().match(/^```(?:katex|md|markdown|html|xml|json|text)?\n([\s\S]*?)\n```$/);
	if (match) {
		const unwrapped = match[1].trim();
		const lines = unwrapped.split("\n");
		if (lines.length === 1 || unwrapped.includes("<math") || unwrapped.includes("<span class=\"katex") || unwrapped.includes("<content") || unwrapped.startsWith("<") && unwrapped.endsWith(">") || /^\s*<[^>]+>/.test(unwrapped)) return unwrapped;
		if (lines.length > 3 || lines.some((line) => line.match(/^\s{4,}/) || line.includes("function") || line.includes("const ") || line.includes("let "))) return content;
		return unwrapped;
	}
	return content;
}
function isImageData(data) {
	return data instanceof File && data.type.startsWith("image/") || data instanceof Blob && data.type?.startsWith("image/") || typeof data === "string" && (data.startsWith("data:image/") || data.startsWith("http") || data.startsWith("https://"));
}
function getResponseFormat(format) {
	return [
		"json",
		"xml",
		"yaml"
	].includes(format) ? "json" : "text";
}
//#endregion
//#region src/shared/service/processing/adapters.ts
var detectPlatform = () => {
	try {
		if (typeof chrome !== "undefined" && chrome?.runtime?.id) return "crx";
		if (typeof self !== "undefined" && "ServiceWorkerGlobalScope" in self) return "pwa";
		if (typeof navigator !== "undefined" && "standalone" in navigator) return "pwa";
		return "core";
	} catch {
		return "unknown";
	}
};
//#endregion
//#region src/shared/service/processing/settings.ts
var loadAISettings = async () => {
	const platform = detectPlatform();
	try {
		if (platform === "crx") return await loadSettings();
		else return await getRuntimeSettings();
	} catch (e) {
		console.error(`[AI-Service] Failed to load settings for platform ${platform}:`, e);
		return null;
	}
};
var getActiveCustomInstruction = async () => {
	try {
		const { getActiveInstructionText } = await import("../chunks/CustomInstructions.js").then((n) => n.t);
		return await getActiveInstructionText();
	} catch {
		return "";
	}
};
var getLanguageInstruction = async () => {
	try {
		const settings = await loadAISettings();
		const lang = settings?.ai?.responseLanguage || "auto";
		const translate = settings?.ai?.translateResults || false;
		let instruction = LANGUAGE_INSTRUCTIONS[lang] || "";
		if (translate && lang !== "auto" && lang !== "follow") instruction += TRANSLATE_INSTRUCTION;
		return instruction;
	} catch {
		return "";
	}
};
var getSvgGraphicsAddon = async () => {
	try {
		return (await loadAISettings())?.ai?.generateSvgGraphics ? SVG_GRAPHICS_ADDON : "";
	} catch {
		return "";
	}
};
//#endregion
//#region src/shared/service/recognition/cache.ts
var RecognitionCache = class {
	cache = /* @__PURE__ */ new Map();
	maxEntries = 100;
	ttl = 864e5;
	generateDataHash(data) {
		if (data instanceof File) return `${data.name}-${data.size}-${data.lastModified}`;
		if (typeof data === "string") return btoa(data).substring(0, 32);
		return JSON.stringify(data).substring(0, 32);
	}
	get(data, format) {
		const hash = this.generateDataHash(data);
		const entry = this.cache.get(hash);
		if (!entry) return null;
		if (Date.now() - entry.timestamp > this.ttl) {
			this.cache.delete(hash);
			return null;
		}
		if (format && entry.recognizedAs !== format) return null;
		return entry;
	}
	set(data, recognizedData, recognizedAs, responseId, metadata) {
		const hash = this.generateDataHash(data);
		if (this.cache.size >= this.maxEntries) {
			const oldestKey = Array.from(this.cache.entries()).sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
			this.cache.delete(oldestKey);
		}
		this.cache.set(hash, {
			dataHash: hash,
			recognizedData,
			recognizedAs,
			timestamp: Date.now(),
			responseId,
			metadata
		});
	}
	clear() {
		this.cache.clear();
	}
	getStats() {
		return {
			entries: this.cache.size,
			maxEntries: this.maxEntries,
			ttl: this.ttl
		};
	}
};
//#endregion
//#region src/shared/service/processing/unified.ts
var unified_exports = /* @__PURE__ */ __exportAll({
	processDataWithInstruction: () => processDataWithInstruction,
	recognizeByInstructions: () => recognizeByInstructions
});
var recognitionCache = new RecognitionCache();
var processDataWithInstruction = async (input, options = {}, sendResponse) => {
	const settings = (await loadSettings())?.ai;
	const { instruction = "", outputFormat = "auto", outputLanguage = "auto", enableSVGImageGeneration = "auto", intermediateRecognition, processingEffort = "low", processingVerbosity = "low", customInstruction, useActiveInstruction = false, includeImageRecognition, dataType, signal } = options;
	const token = settings?.apiKey;
	if (!token) {
		const result = {
			ok: false,
			error: "No API key available"
		};
		sendResponse?.(result);
		return result;
	}
	if (!input) {
		const result = {
			ok: false,
			error: "No input provided"
		};
		sendResponse?.(result);
		return result;
	}
	if (signal?.aborted) {
		const result = {
			ok: false,
			error: "Cancelled"
		};
		sendResponse?.(result);
		return result;
	}
	let finalInstruction = instruction;
	if (customInstruction) finalInstruction = buildInstructionPrompt(finalInstruction, customInstruction);
	else if (useActiveInstruction) {
		const activeInstruction = await getActiveCustomInstruction();
		if (activeInstruction) finalInstruction = buildInstructionPrompt(finalInstruction, activeInstruction);
	}
	const languageInstruction = await getLanguageInstruction();
	if (languageInstruction) finalInstruction += languageInstruction;
	if (enableSVGImageGeneration === true || enableSVGImageGeneration === "auto" && outputFormat === "html") {
		const svgAddon = await getSvgGraphicsAddon();
		if (svgAddon) finalInstruction += svgAddon;
	}
	if (outputFormat !== "auto") {
		const formatInstruction = getOutputFormatInstruction(outputFormat);
		if (formatInstruction) finalInstruction += formatInstruction;
	}
	const gpt = await getGPTInstance({
		apiKey: token,
		baseUrl: settings?.baseUrl,
		model: settings?.model,
		mcp: settings?.mcp
	});
	if (!gpt) {
		const result = {
			ok: false,
			error: "AI initialization failed"
		};
		sendResponse?.(result);
		return result;
	}
	gpt.clearPending();
	let processingStages = 1;
	let recognizedImages = false;
	const intermediateRecognizedData = [];
	if (Array.isArray(input) && (input?.[0]?.type === "message" || input?.[0]?.["role"])) await gpt.getPending()?.push(...input);
	else {
		const inputData = Array.isArray(input) ? input : [input];
		for (const item of inputData) {
			let processedItem = item;
			if (typeof item === "string" && dataType === "svg" || typeof item === "string" && item.trim().startsWith("<svg")) processedItem = item;
			else if (isImageData(item)) {
				recognizedImages = true;
				if (intermediateRecognition?.enabled !== false && (intermediateRecognition?.enabled || includeImageRecognition)) {
					processingStages = 2;
					const cachedResult = !intermediateRecognition?.forceRefresh ? recognitionCache.get(item, intermediateRecognition?.outputFormat) : null;
					let recognizedContent;
					let recognitionResponseId;
					if (cachedResult) {
						recognizedContent = cachedResult.recognizedData;
						recognitionResponseId = cachedResult.responseId;
					} else {
						const recognitionResult = await recognizeByInstructions(item, intermediateRecognition?.dataPriorityInstruction || getIntermediateRecognitionInstruction(intermediateRecognition?.outputFormat || "markdown"), void 0, {
							apiKey: token,
							baseUrl: settings?.baseUrl,
							model: settings?.model,
							mcp: settings?.mcp
						}, {
							customInstruction: void 0,
							useActiveInstruction: false
						});
						if (!recognitionResult.ok || !recognitionResult.data) {
							recognizedContent = "";
							recognitionResponseId = "";
						} else {
							recognizedContent = recognitionResult.data;
							recognitionResponseId = recognitionResult.responseId || "";
							if (intermediateRecognition?.cacheResults !== false) {
								const recognizedAs = intermediateRecognition?.outputFormat || "markdown";
								recognitionCache.set(item, recognizedContent, recognizedAs, recognitionResponseId);
							}
						}
					}
					intermediateRecognizedData.push({
						originalData: item,
						recognizedData: recognizedContent,
						recognizedAs: intermediateRecognition?.outputFormat || "markdown",
						responseId: recognitionResponseId
					});
					if (recognizedContent) processedItem = recognizedContent;
				}
			}
			if (processedItem !== null && processedItem !== void 0) {
				const attachKind = dataType === "image" || isImageData(processedItem) ? "input_image" : null;
				await gpt?.attachToRequest?.(processedItem, attachKind);
			}
		}
	}
	await gpt.askToDoAction(finalInstruction);
	let response;
	let error;
	try {
		response = await gpt?.sendRequest?.(processingEffort, processingVerbosity, null, {
			responseFormat: getResponseFormat(outputFormat),
			temperature: .3,
			signal
		});
	} catch (e) {
		error = String(e);
	}
	let parsedResponse = response;
	if (typeof response === "string") try {
		parsedResponse = JSON.parse(response);
	} catch {
		parsedResponse = null;
	}
	const responseContent = parsedResponse?.choices?.[0]?.message?.content;
	let cleanedResponse = responseContent ? unwrapUnwantedCodeBlocks(responseContent.trim()) : null;
	let finalData = cleanedResponse;
	if (cleanedResponse && instruction?.includes("Recognize data from image")) try {
		const parsedJson = JSON.parse(cleanedResponse);
		if (parsedJson?.recognized_data) {
			if (Array.isArray(parsedJson.recognized_data)) finalData = parsedJson.recognized_data.join("\n");
			else if (typeof parsedJson.recognized_data === "string") finalData = parsedJson.recognized_data;
			else finalData = JSON.stringify(parsedJson.recognized_data);
		} else if (parsedJson?.ok === false) finalData = null;
		else finalData = cleanedResponse;
	} catch {
		finalData = cleanedResponse;
	}
	const result = {
		ok: !!finalData && !error,
		data: finalData || void 0,
		error: error || (!finalData ? "No data recognized" : void 0),
		responseId: parsedResponse?.id || gpt?.getResponseId?.(),
		processingStages,
		recognizedImages,
		intermediateRecognizedData: intermediateRecognizedData.length > 0 ? intermediateRecognizedData : void 0
	};
	sendResponse?.(result);
	return result;
};
var recognizeByInstructions = async (input, instructions, sendResponse, config, options) => {
	const result = await processDataWithInstruction(input, {
		instruction: instructions,
		customInstruction: options?.customInstruction,
		useActiveInstruction: options?.useActiveInstruction,
		processingEffort: options?.recognitionEffort || "low",
		processingVerbosity: options?.recognitionVerbosity || "low",
		outputFormat: "auto",
		outputLanguage: "auto",
		enableSVGImageGeneration: "auto"
	});
	const legacyResult = {
		ok: result.ok,
		data: result.data,
		error: result.error,
		responseId: result.responseId
	};
	sendResponse?.(legacyResult);
	return legacyResult;
};
//#endregion
export { unified_exports as n, extractJSONFromAIResponse as r, processDataWithInstruction as t };
