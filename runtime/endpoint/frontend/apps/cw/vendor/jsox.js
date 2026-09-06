//#region ../../node_modules/jsox/lib/jsox.mjs
var _JSON = JSON;
/**
* JSOX container for all JSOX methods.
* @namespace
*/
var JSOX = {};
JSOX.JSOX = JSOX;
JSOX.version = "1.2.125";
var hasBigInt = typeof BigInt === "function";
var VALUE_UNDEFINED = -1;
var VALUE_UNSET = 0;
var VALUE_NULL = 1;
var VALUE_TRUE = 2;
var VALUE_FALSE = 3;
var VALUE_STRING = 4;
var VALUE_NUMBER = 5;
var VALUE_OBJECT = 6;
var VALUE_NEG_NAN = 7;
var VALUE_NAN = 8;
var VALUE_NEG_INFINITY = 9;
var VALUE_INFINITY = 10;
var VALUE_EMPTY = 12;
var VALUE_ARRAY = 13;
var knownArrayTypeNames = [
	"ab",
	"u8",
	"cu8",
	"s8",
	"u16",
	"s16",
	"u32",
	"s32",
	"u64",
	"s64",
	"f32",
	"f64"
];
var arrayToJSOX = null;
var mapToJSOX = null;
var knownArrayTypes = [
	ArrayBuffer,
	Uint8Array,
	Uint8ClampedArray,
	Int8Array,
	Uint16Array,
	Int16Array,
	Uint32Array,
	Int32Array,
	null,
	null,
	Float32Array,
	Float64Array
];
var WORD_POS_RESET = 0;
var WORD_POS_TRUE_1 = 1;
var WORD_POS_TRUE_2 = 2;
var WORD_POS_TRUE_3 = 3;
var WORD_POS_FALSE_1 = 5;
var WORD_POS_FALSE_2 = 6;
var WORD_POS_FALSE_3 = 7;
var WORD_POS_FALSE_4 = 8;
var WORD_POS_NULL_1 = 9;
var WORD_POS_NULL_2 = 10;
var WORD_POS_NULL_3 = 11;
var WORD_POS_UNDEFINED_1 = 12;
var WORD_POS_UNDEFINED_2 = 13;
var WORD_POS_UNDEFINED_3 = 14;
var WORD_POS_UNDEFINED_4 = 15;
var WORD_POS_UNDEFINED_5 = 16;
var WORD_POS_UNDEFINED_6 = 17;
var WORD_POS_UNDEFINED_7 = 18;
var WORD_POS_UNDEFINED_8 = 19;
var WORD_POS_NAN_1 = 20;
var WORD_POS_NAN_2 = 21;
var WORD_POS_INFINITY_1 = 22;
var WORD_POS_INFINITY_2 = 23;
var WORD_POS_INFINITY_3 = 24;
var WORD_POS_INFINITY_4 = 25;
var WORD_POS_INFINITY_5 = 26;
var WORD_POS_INFINITY_6 = 27;
var WORD_POS_INFINITY_7 = 28;
var WORD_POS_FIELD = 29;
var WORD_POS_AFTER_FIELD = 30;
var WORD_POS_END = 31;
var WORD_POS_AFTER_FIELD_VALUE = 32;
var CONTEXT_UNKNOWN = 0;
var CONTEXT_IN_ARRAY = 1;
var CONTEXT_OBJECT_FIELD = 2;
var CONTEXT_OBJECT_FIELD_VALUE = 3;
var CONTEXT_CLASS_FIELD = 4;
var CONTEXT_CLASS_VALUE = 5;
var CONTEXT_CLASS_FIELD_VALUE = 6;
var keywords = {
	["true"]: true,
	["false"]: false,
	["null"]: null,
	["NaN"]: NaN,
	["Infinity"]: Infinity,
	["undefined"]: void 0
};
var canTagOrBeTagged = (value_type) => value_type === VALUE_UNSET || value_type === VALUE_STRING;
var isKeywordValue = (value_type) => value_type === VALUE_TRUE || value_type === VALUE_FALSE || value_type === VALUE_NULL || value_type === VALUE_UNDEFINED || value_type === VALUE_NAN || value_type === VALUE_NEG_NAN || value_type === VALUE_INFINITY || value_type === VALUE_NEG_INFINITY;
var isWhitespace = (cInt) => cInt === 32 || cInt === 9 || cInt === 10 || cInt === 13 || cInt === 65279 || cInt === 8232 || cInt === 8233;
var isLineTerminator = (cInt) => cInt === 10 || cInt === 13 || cInt === 8232 || cInt === 8233;
/**
* Extend Date type with a nanosecond field.
* @constructor
* @param {Date} original_date
* @param {Number} nanoseconds in milli-seconds of Date ( 0 to 1_000_000 )
*/
var DateNS = class extends Date {
	constructor(a, b) {
		if (a === void 0) super();
		else super(a);
		this.ns = b || 0;
	}
	toString() {
		return dateNSToLocalISO(this);
	}
	toISOString() {
		const base = Date.prototype.toISOString.call(this);
		const frac = (base.slice(-4, -1) + dateNSPad6(this.ns)).replace(/0+$/, "");
		return base.slice(0, -5) + (frac ? "." + frac : "") + "Z";
	}
	toLocalISOString() {
		return dateNSToLocalISO(this);
	}
};
function dateNSPad6(num) {
	const norm = Math.floor(Math.abs(num));
	return (norm < 1e5 ? "0" : "") + (norm < 1e4 ? "0" : "") + (norm < 1e3 ? "0" : "") + (norm < 100 ? "0" : "") + (norm < 10 ? "0" : "") + norm;
}
function dateNSToLocalISO(this_) {
	const tzo = -this_.getTimezoneOffset(), dif = tzo >= 0 ? "+" : "-", pad = function(num) {
		const norm = Math.floor(Math.abs(num));
		return (norm < 10 ? "0" : "") + norm;
	}, pad3 = function(num) {
		const norm = Math.floor(Math.abs(num));
		return (norm < 100 ? "0" : "") + (norm < 10 ? "0" : "") + norm;
	};
	return this_.getFullYear() + "-" + pad(this_.getMonth() + 1) + "-" + pad(this_.getDate()) + "T" + pad(this_.getHours()) + ":" + pad(this_.getMinutes()) + ":" + pad(this_.getSeconds()) + "." + pad3(this_.getMilliseconds()) + dateNSPad6(this_.ns) + dif + pad(Math.abs(tzo) / 60) + ":" + pad(Math.abs(tzo) % 60);
}
JSOX.DateNS = DateNS;
var contexts = [];
/**
* get a context from stack (reuse contexts)
* @internal
*/
function getContext() {
	let ctx = contexts.pop();
	if (!ctx) ctx = {
		context: CONTEXT_UNKNOWN,
		current_proto: null,
		current_class: null,
		current_class_field: 0,
		arrayType: -1,
		valueType: VALUE_UNSET,
		elements: null
	};
	return ctx;
}
/**
* return a context to the stack (reuse contexts)
* @internal
*/
function dropContext(ctx) {
	contexts.push(ctx);
}
/**
* SACK jsox compatibility; hands maps to internal C++ code in other case.
* @internal
*/
JSOX.updateContext = function() {};
var buffers = [];
function getBuffer() {
	let buf = buffers.pop();
	if (!buf) buf = {
		buf: null,
		n: 0
	};
	else buf.n = 0;
	return buf;
}
function dropBuffer(buf) {
	buffers.push(buf);
}
/**
* Provide minimal escapes for a string to be encapsulated as a JSOX string in quotes.
*
* The caller supplies the quotes, and may append the result in segments, so this
* cannot know which of the three quote characters will end up delimiting it; all
* three are escaped regardless.  A parser accepts a foreign quote unescaped -- and
* a raw newline in any quote style -- so this is conservative, not required.
*
* @param {string} string
* @returns {string}
*/
JSOX.escape = function(string) {
	let n;
	let output = "";
	if (!string) return string;
	for (n = 0; n < string.length; n++) {
		if (string[n] == "\"" || string[n] == "\\" || string[n] == "`" || string[n] == "'") output += "\\";
		output += string[n];
	}
	return output;
};
var toProtoTypes = /* @__PURE__ */ new WeakMap();
var toObjectTypes = /* @__PURE__ */ new Map();
var fromProtoTypes = /* @__PURE__ */ new Map();
var commonClasses = [];
/**
* reset JSOX parser entirely; clears all type mappings
*
* @returns {void}
*/
JSOX.reset = function() {
	toProtoTypes = /* @__PURE__ */ new WeakMap();
	toObjectTypes = /* @__PURE__ */ new Map();
	fromProtoTypes = /* @__PURE__ */ new Map();
	commonClasses = [];
	_parse_level = 0;
};
/**
* Placeholder standing in for a reference that could not be resolved while
* parsing -- either it pointed forward at something not built yet, or it pointed
* at an object still open, whose identity is not settled until its revive returns.
* Replaced by resolveDeferredRefs() once the value is complete.
* @internal
*/
var DeferredRef = class {
	constructor(path, cause) {
		this.path = path;
		this.cause = cause;
	}
};
/**
* Second pass: once the value is complete, every reference path resolves by plain
* traversal from the root, so no context-stack guessing is required. Resolves each
* deferred path, then substitutes the placeholders wherever they landed.
* @internal
*/
function resolveDeferredRefs(root, refs, fixups) {
	const resolved = /* @__PURE__ */ new Map();
	const inProgress = /* @__PURE__ */ new Set();
	const deref = (v) => v instanceof DeferredRef ? resolveOne(v) : v;
	function resolveOne(ref) {
		if (resolved.has(ref)) return resolved.get(ref);
		if (inProgress.has(ref)) throw new Error("Reference path is circular through other references: " + ref.path);
		inProgress.add(ref);
		let obj = deref(root);
		for (let i = 0; i < ref.path.length; i++) {
			const key = ref.path[i];
			if (obj === void 0 || obj === null) throw new Error("Reference did not resolve: ref[" + ref.path + "] -- nothing to index at position " + i + " ('" + key + "')");
			obj = deref(obj[key]);
		}
		if (obj === void 0) throw new Error("Reference did not resolve: ref[" + ref.path + "] -- target is undefined");
		inProgress.delete(ref);
		resolved.set(ref, obj);
		return obj;
	}
	for (const ref of refs) resolveOne(ref);
	if (fixups) {
		for (const f of fixups) if (f.container[f.key] === f.ref) f.container[f.key] = resolved.get(f.ref);
	}
	const seen = /* @__PURE__ */ new Set();
	function substitute(node) {
		if (!node || "object" !== typeof node || seen.has(node)) return;
		seen.add(node);
		const keys = Array.isArray(node) ? node.keys() : Object.keys(node);
		for (const k of keys) {
			const v = node[k];
			if (v instanceof DeferredRef) node[k] = resolved.get(v);
			else substitute(v);
		}
	}
	substitute(root);
	for (const ref of refs) substitute(ref.owner);
	return root instanceof DeferredRef ? resolved.get(root) : root;
}
/**
* Create a streaming parser.  Add data with parser.write(data); values that
* are found are dispatched to the callback.
*
* @param {(value:any) => void} [cb]
* @param {(this: any, key: string, value: any) => any} [reviver]
* @returns {JSOXParser}
*/
JSOX.begin = function(cb, reviver) {
	const val = {
		name: null,
		value_type: VALUE_UNSET,
		string: "",
		contains: null,
		className: null
	};
	const pos = {
		line: 1,
		col: 1
	};
	let n = 0;
	let str;
	let localFromProtoTypes = /* @__PURE__ */ new Map();
	let word = WORD_POS_RESET, status = true, redefineClass = false, negative = false, signPending = false, result = null, rootObject = null, deferredRefs = null, deferredFixups = null, elements = void 0, context_stack = {
		first: null,
		last: null,
		saved: null,
		push(node) {
			let recover = this.saved;
			if (recover) {
				this.saved = recover.next;
				recover.node = node;
				recover.next = null;
				recover.prior = this.last;
			} else recover = {
				node,
				next: null,
				prior: this.last
			};
			if (!this.last) this.first = recover;
			else this.last.next = recover;
			this.last = recover;
			this.length++;
		},
		pop() {
			let r = this.last;
			if (!(this.last = r.prior)) this.first = null;
			r.next = this.saved;
			if (this.last) this.last.next = null;
			if (!r.next) r.first = null;
			this.saved = r;
			this.length--;
			return r.node;
		},
		length: 0,
		dump() {
			console.log("STACK LENGTH:", this.length);
			let cur = this.first;
			let level = 0;
			while (cur) {
				console.log("Context:", level, cur.node);
				level++;
				cur = cur.next;
			}
		}
	}, classes = [], protoTypes = {}, current_proto = null, current_class = null, current_class_field = 0, arrayType = -1, parse_context = CONTEXT_UNKNOWN, comment = 0, fromHex = false, decimal = false, exponent = false, exponent_sign = false, exponent_digit = false, inQueue = {
		first: null,
		last: null,
		saved: null,
		push(node) {
			let recover = this.saved;
			if (recover) {
				this.saved = recover.next;
				recover.node = node;
				recover.next = null;
				recover.prior = this.last;
			} else recover = {
				node,
				next: null,
				prior: this.last
			};
			if (!this.last) this.first = recover;
			else this.last.next = recover;
			this.last = recover;
		},
		shift() {
			let r = this.first;
			if (!r) return null;
			if (!(this.first = r.next)) this.last = null;
			r.next = this.saved;
			this.saved = r;
			return r.node;
		},
		unshift(node) {
			let recover = this.saved;
			this.saved = recover.next;
			recover.node = node;
			recover.next = this.first;
			recover.prior = null;
			if (!this.first) this.last = recover;
			this.first = recover;
		}
	}, gatheringStringFirstChar = null, gatheringString = false, gatheringNumber = false, stringEscape = false, cr_escaped = false, unicodeWide = false, stringUnicode = false, stringHex = false, hex_char = 0, hex_char_len = 0, completed = false, date_format = false, isBigInt = false;
	function throwEndError(leader) {
		throw new Error(`${leader} at ${n} [${pos.line}:${pos.col}]`);
	}
	return {
		/**
		* Define a class that can be used to deserialize objects of this type.
		* @param {string} prototypeName 
		* @param {new ():any} o 
		* @param {(any)=>any} f 
		*/
		fromJSOX(prototypeName, o, f) {
			if (localFromProtoTypes.get(prototypeName)) throw new Error("Existing fromJSOX has been registered for prototype");
			function privateProto() {}
			if (!o) o = privateProto;
			if (o && !("constructor" in o)) throw new Error("Please pass a prototype like thing...");
			localFromProtoTypes.set(prototypeName, {
				protoCon: o.prototype.constructor,
				cb: f
			});
		},
		registerFromJSOX(prototypeName, o) {
			throw new Error("registerFromJSOX is deprecated, please update to use fromJSOX instead:" + prototypeName + o.toString());
		},
		finalError() {
			if (comment !== 0) {
				if (comment === 1) throwEndError("Comment began at end of document");
				if (comment === 2);
				if (comment === 3) throwEndError("Open comment '/*' is missing close at end of document");
				if (comment === 4) throwEndError("Incomplete '/* *' close at end of document");
			}
			if (gatheringString) throwEndError("Incomplete string");
		},
		value() {
			this.finalError();
			let r = result;
			result = void 0;
			return r;
		},
		/**
		* Reset the parser to a blank state.
		*/
		reset() {
			word = WORD_POS_RESET;
			status = true;
			result = null;
			if (inQueue.last) inQueue.last.next = inQueue.save;
			inQueue.save = inQueue.first;
			inQueue.first = inQueue.last = null;
			if (context_stack.last) context_stack.last.next = context_stack.save;
			context_stack.length = 0;
			context_stack.save = inQueue.first;
			context_stack.first = context_stack.last = null;
			elements = void 0;
			parse_context = CONTEXT_UNKNOWN;
			classes = [];
			protoTypes = {};
			current_proto = null;
			current_class = null;
			current_class_field = 0;
			val.value_type = VALUE_UNSET;
			val.name = null;
			val.string = "";
			val.className = null;
			val.contains = null;
			pos.line = 1;
			pos.col = 1;
			negative = false;
			comment = 0;
			completed = false;
			gatheringString = false;
			stringEscape = false;
			cr_escaped = false;
			date_format = false;
			arrayType = -1;
			gatheringNumber = false;
			signPending = false;
			redefineClass = false;
			rootObject = null;
			deferredRefs = null;
			deferredFixups = null;
			stringUnicode = false;
			unicodeWide = false;
			stringHex = false;
			hex_char = 0;
			hex_char_len = 0;
		},
		usePrototype(className, protoType) {
			protoTypes[className] = protoType;
		},
		/**
		* Add input to the parser to get parsed.
		* @param {string} msg 
		*/
		write(msg) {
			let retcode;
			if (typeof msg !== "string" && typeof msg !== "undefined") msg = String(msg);
			if (!status) throw new Error("Parser is still in an error state, please reset before resuming");
			for (retcode = this._write(msg, false); retcode > 0; retcode = this._write()) {
				const res = typeof reviver === "function" ? function walk(holder, key) {
					let k, v, value = holder[key];
					if (value && typeof value === "object") {
						for (k in value) if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== void 0) value[k] = v;
							else delete value[k];
						}
					}
					return reviver.call(holder, key, value);
				}({ "": result }, "") : result;
				result = null;
				cb(res);
				if (retcode < 2) break;
			}
		},
		/**
		* Parse a string and return the result.
		* @template T
		* @param {string} msg
		* @param {(key:string,value:any)=>any} [reviver]
		* @returns {T}
		*/
		parse(msg, reviver) {
			if (typeof msg !== "string") msg = String(msg);
			this.reset();
			const writeResult = this._write(msg, true);
			if (writeResult > 0) {
				if (writeResult > 1) {}
				let res = this.value();
				if ("undefined" === typeof res && writeResult > 1) throw new Error("Pending value could not complete");
				res = typeof reviver === "function" ? function walk(holder, key) {
					let k, v, value = holder[key];
					if (value && typeof value === "object") {
						for (k in value) if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== void 0) value[k] = v;
							else delete value[k];
						}
					}
					return reviver.call(holder, key, value);
				}({ "": res }, "") : res;
				result = null;
				return res;
			}
			this.finalError();
		},
		_write(msg, complete_at_end) {
			let cInt;
			let input;
			let buf;
			let retval = 0;
			function throwError(leader, c) {
				throw new Error(`${leader} '${String.fromCodePoint(c)}' unexpected at ${n} (near '${buf.substr(n > 4 ? n - 4 : 0, n > 4 ? 3 : n - 1)}[${String.fromCodePoint(c)}]${buf.substr(n, 10)}') [${pos.line}:${pos.col}]`);
			}
			function RESET_VAL() {
				val.value_type = VALUE_UNSET;
				val.string = "";
				val.contains = null;
			}
			function convertValue() {
				let fp = null;
				switch (val.value_type) {
					case VALUE_NUMBER:
						if ((val.string.length > 13 || val.string.length == 13 && val[0] > "2") && !date_format && !exponent_digit && !exponent_sign && !decimal) isBigInt = true;
						if (isBigInt) {
							if (hasBigInt) return BigInt(val.string);
							else throw new Error("no builtin BigInt()", 0);
						}
						if (date_format) {
							const r = val.string.match(/\.(\d\d\d\d*)/);
							const frac = r ? r[1] : null;
							if (!frac || frac.length < 4) {
								const r = new Date(val.string);
								if (isNaN(r.getTime())) throwError("Bad Date format", cInt);
								return r;
							} else {
								let ns = frac.substr(3);
								while (ns.length < 6) ns = ns + "0";
								const r = new DateNS(val.string, Number(ns));
								if (isNaN(r.getTime())) throwError("Bad DateNS format" + r + r.getTime(), cInt);
								return r;
							}
						}
						return (negative ? -1 : 1) * Number(val.string);
					case VALUE_STRING:
						if (val.className) {
							fp = localFromProtoTypes.get(val.className);
							if (!fp) fp = fromProtoTypes.get(val.className);
							val.className = null;
							if (fp && (fp.cb || !fp.synthetic)) {
								const inst = fp.protoCon ? new fp.protoCon(val.string) : val.string;
								if (fp.cb) {
									const r = fp.cb.call(inst, void 0, val.string);
									return r === void 0 ? inst : r;
								}
								return inst;
							}
							return val.string;
						}
						return val.string;
					case VALUE_TRUE: return true;
					case VALUE_FALSE: return false;
					case VALUE_NEG_NAN: return NaN;
					case VALUE_NAN: return NaN;
					case VALUE_NEG_INFINITY: return -Infinity;
					case VALUE_INFINITY: return Infinity;
					case VALUE_NULL: return null;
					case VALUE_UNDEFINED: return;
					case VALUE_EMPTY: return;
					case VALUE_OBJECT:
						if (val.className) {
							fp = localFromProtoTypes.get(val.className);
							if (!fp) fp = fromProtoTypes.get(val.className);
							val.className = null;
							if (fp && fp.cb) return val.contains = fp.cb.call(val.contains);
						}
						return val.contains;
					case VALUE_ARRAY:
						if (arrayType >= 0) {
							let ab;
							val.className = null;
							if (val.contains.length) {
								if ("string" !== typeof val.contains[0]) throw new Error("Invalid base64 payload in " + knownArrayTypeNames[arrayType] + "[...]; a payload starting with a digit must be quoted");
								ab = DecodeBase64(val.contains[0]);
							} else ab = DecodeBase64(val.string);
							if (arrayType === 0) {
								arrayType = -1;
								return ab;
							} else {
								const per = knownArrayTypes[arrayType].BYTES_PER_ELEMENT;
								if (ab.byteLength % per) throw new Error("bad encoding for typed array data in " + knownArrayTypeNames[arrayType] + "[...]; " + ab.byteLength + " bytes is not a multiple of " + per);
								const newab = new knownArrayTypes[arrayType](ab);
								arrayType = -1;
								return newab;
							}
						} else if (arrayType === -2) {
							const deferPath = val.contains.slice();
							try {
								let obj = rootObject;
								let lvl;
								let lastResume = -1;
								val.className = null;
								const pathlen = val.contains.length;
								for (lvl = 0; lvl < pathlen; lvl++) {
									const idx = val.contains[lvl];
									let nextObj = obj[idx];
									if (!nextObj) {
										let ctx = context_stack.first;
										let p = 0;
										while (ctx && p < pathlen && p < context_stack.length) {
											const thisKey = val.contains[p];
											if (!ctx.next || thisKey !== ctx.next.node.name) break;
											if (ctx.next) {
												if ("number" === typeof thisKey) {
													const actualObject = ctx.next.node.elements;
													if (actualObject && thisKey >= actualObject.length) {
														if (p === context_stack.length - 1) {
															console.log("This is actually at the current object so use that", p, val.contains, elements);
															nextObj = elements;
															p++;
															ctx = ctx.next;
															break;
														} else {
															if (ctx.next.next && thisKey === actualObject.length) {
																nextObj = ctx.next.next.node.elements;
																ctx = ctx.next;
																p++;
																obj = nextObj;
																continue;
															}
															nextObj = elements;
															p++;
															break;
														}
													}
												} else if (thisKey !== ctx.next.node.name) {
													nextObj = ctx.next.node.elements[thisKey];
													lvl = p;
													break;
												} else if (ctx.next.next) nextObj = ctx.next.next.node.elements;
												else nextObj = elements;
											} else nextObj = nextObj[thisKey];
											ctx = ctx.next;
											p++;
										}
										if (p <= lastResume) throw new Error("Path did not resolve properly:" + val.contains + " stalled at " + p + " (no progress)");
										lastResume = p;
										if (p < pathlen) lvl = p - 1;
										else lvl = p;
									}
									if (nextObj === void 0 || nextObj === null) throw new Error("Path did not resolve properly:" + val.contains + " at " + idx + "(" + lvl + ")");
									if (nextObj === val.contains) throw new Error("Reference points at the slot holding it: ref[" + val.contains + "]");
									obj = nextObj;
								}
								arrayType = -3;
								if (isStillOpen(obj)) {
									const placeholder = new DeferredRef(deferPath, null);
									placeholder.owner = elements;
									if (!deferredRefs) deferredRefs = [];
									deferredRefs.push(placeholder);
									return placeholder;
								}
								return obj;
							} catch (err) {
								arrayType = -3;
								const placeholder = new DeferredRef(deferPath, err);
								placeholder.owner = elements;
								if (!deferredRefs) deferredRefs = [];
								deferredRefs.push(placeholder);
								return placeholder;
							}
						}
						if (val.className) {
							fp = localFromProtoTypes.get(val.className);
							if (!fp) fp = fromProtoTypes.get(val.className);
							val.className = null;
							if (fp && fp.cb) return fp.cb.call(val.contains);
						}
						return val.contains;
					default: console.log("Unhandled value conversion.", val);
				}
			}
			function noteDeferred(ref, container, key) {
				if (!deferredFixups) deferredFixups = [];
				deferredFixups.push({
					ref,
					container,
					key
				});
			}
			function isStillOpen(obj) {
				if (!obj || "object" !== typeof obj) return false;
				if (obj === elements) return true;
				for (let ctx = context_stack.first; ctx; ctx = ctx.next) if (ctx.node && ctx.node.elements === obj) return true;
				return false;
			}
			function reviveTaggedArray() {
				if (!val.className) return void 0;
				let fp = localFromProtoTypes.get(val.className);
				if (!fp) fp = fromProtoTypes.get(val.className);
				val.className = null;
				if (fp && fp.cb) return fp.cb.call(val.contains);
			}
			function arrayPush() {
				if (arrayType == -3) {
					if (val.value_type === VALUE_OBJECT) elements.push(val.contains);
					else if (val.value_type === VALUE_ARRAY) {
						const revived = reviveTaggedArray();
						if (revived !== void 0) {
							const idx = elements.lastIndexOf(val.contains);
							if (idx >= 0) elements[idx] = revived;
						}
					}
					arrayType = -1;
					return;
				}
				switch (val.value_type) {
					case VALUE_EMPTY:
						elements.push(void 0);
						delete elements[elements.length - 1];
						break;
					default: {
						const pushed = convertValue();
						elements.push(pushed);
						if (pushed instanceof DeferredRef) noteDeferred(pushed, elements, elements.length - 1);
						if (arrayType === -3) arrayType = -1;
						break;
					}
				}
				RESET_VAL();
			}
			function nextClassField() {
				if (elements && Object.keys(elements).length > current_class_field) throwError("class body mixes named and positional values; fault while parsing;", cInt);
				const name = current_class.fields[current_class_field++];
				if (void 0 === name) throwError("class field has no matching field definitions;", cInt);
				return name;
			}
			function objectPush() {
				if (arrayType === -3 && val.value_type === VALUE_ARRAY) {
					const revived = reviveTaggedArray();
					if (revived !== void 0 && elements[val.name] === val.contains) elements[val.name] = revived;
					RESET_VAL();
					arrayType = -1;
					return;
				}
				if (val.value_type === VALUE_EMPTY) return;
				if (!val.name && current_class) val.name = nextClassField();
				let value = convertValue();
				if (current_proto && current_proto.protoDef && current_proto.protoDef.cb) {
					value = current_proto.protoDef.cb.call(elements, val.name, value);
					if (value !== void 0) elements[val.name] = value;
				} else elements[val.name] = value;
				if (elements[val.name] instanceof DeferredRef) noteDeferred(elements[val.name], elements, val.name);
				RESET_VAL();
			}
			function recoverIdent(cInt) {
				if (word !== WORD_POS_RESET) {
					if (negative) throwError("fault while parsing number;", cInt);
					switch (word) {
						case WORD_POS_END:
							switch (val.value_type) {
								case VALUE_TRUE:
									val.string += "true";
									break;
								case VALUE_FALSE:
									val.string += "false";
									break;
								case VALUE_NULL:
									val.string += "null";
									break;
								case VALUE_INFINITY:
									val.string += "Infinity";
									break;
								case VALUE_NEG_INFINITY:
									throwError("fault while parsing number;", cInt);
									break;
								case VALUE_NAN:
									val.string += "NaN";
									break;
								case VALUE_NEG_NAN:
									throwError("fault while parsing number;", cInt);
									break;
								case VALUE_UNDEFINED:
									val.string += "undefined";
									break;
								case VALUE_STRING: break;
								case VALUE_UNSET: break;
								default: console.log("Value of type " + val.value_type + " is not restored...");
							}
							break;
						case WORD_POS_TRUE_1:
							val.string += "t";
							break;
						case WORD_POS_TRUE_2:
							val.string += "tr";
							break;
						case WORD_POS_TRUE_3:
							val.string += "tru";
							break;
						case WORD_POS_FALSE_1:
							val.string += "f";
							break;
						case WORD_POS_FALSE_2:
							val.string += "fa";
							break;
						case WORD_POS_FALSE_3:
							val.string += "fal";
							break;
						case WORD_POS_FALSE_4:
							val.string += "fals";
							break;
						case WORD_POS_NULL_1:
							val.string += "n";
							break;
						case WORD_POS_NULL_2:
							val.string += "nu";
							break;
						case WORD_POS_NULL_3:
							val.string += "nul";
							break;
						case WORD_POS_UNDEFINED_1:
							val.string += "u";
							break;
						case WORD_POS_UNDEFINED_2:
							val.string += "un";
							break;
						case WORD_POS_UNDEFINED_3:
							val.string += "und";
							break;
						case WORD_POS_UNDEFINED_4:
							val.string += "unde";
							break;
						case WORD_POS_UNDEFINED_5:
							val.string += "undef";
							break;
						case WORD_POS_UNDEFINED_6:
							val.string += "undefi";
							break;
						case WORD_POS_UNDEFINED_7:
							val.string += "undefin";
							break;
						case WORD_POS_UNDEFINED_8:
							val.string += "undefine";
							break;
						case WORD_POS_NAN_1:
							val.string += "N";
							break;
						case WORD_POS_NAN_2:
							val.string += "Na";
							break;
						case WORD_POS_INFINITY_1:
							val.string += "I";
							break;
						case WORD_POS_INFINITY_2:
							val.string += "In";
							break;
						case WORD_POS_INFINITY_3:
							val.string += "Inf";
							break;
						case WORD_POS_INFINITY_4:
							val.string += "Infi";
							break;
						case WORD_POS_INFINITY_5:
							val.string += "Infin";
							break;
						case WORD_POS_INFINITY_6:
							val.string += "Infini";
							break;
						case WORD_POS_INFINITY_7:
							val.string += "Infinit";
							break;
						case WORD_POS_RESET: break;
						case WORD_POS_FIELD: break;
						case WORD_POS_AFTER_FIELD: break;
						case WORD_POS_AFTER_FIELD_VALUE:
					}
					val.value_type = VALUE_STRING;
					if (word < WORD_POS_FIELD) word = WORD_POS_END;
				} else {
					word = WORD_POS_END;
					val.value_type = VALUE_STRING;
				}
				if (cInt == 123) openObject();
				else if (cInt == 91) openArray();
				else if (cInt == 44) {} else {
					if (cInt == 32 || cInt == 13 || cInt == 10 || cInt == 9 || cInt == 65279 || cInt == 8232 || cInt == 8233) return;
					if (cInt == 44 || cInt == 125 || cInt == 93 || cInt == 58);
					else {
						if (word === WORD_POS_AFTER_FIELD || word === WORD_POS_AFTER_FIELD_VALUE) {
							if (val.className) {
								status = false;
								throwError("too many strings in a row; fault while parsing;", cInt);
							}
							getProto();
							if (!val.className) val.className = val.string;
							val.string = "";
							word = WORD_POS_END;
						}
						val.string += str;
					}
				}
			}
			function gatherString(start_c) {
				let retval = 0;
				while (retval == 0 && n < buf.length) {
					str = buf.charAt(n);
					let cInt = buf.codePointAt(n++);
					if (cInt >= 65536) {
						str += buf.charAt(n);
						n++;
					}
					pos.col++;
					if (cInt == start_c) {
						if (stringEscape) {
							if (stringHex) throwError("Incomplete hexidecimal sequence", cInt);
							else if (stringUnicode) throwError("Incomplete long unicode sequence", cInt);
							else if (unicodeWide) throwError("Incomplete unicode sequence", cInt);
							if (cr_escaped) {
								cr_escaped = false;
								retval = 1;
							} else val.string += str;
							stringEscape = false;
						} else retval = 1;
					} else if (stringEscape) {
						if (unicodeWide) {
							if (cInt == 125) {
								val.string += String.fromCodePoint(hex_char);
								unicodeWide = false;
								stringUnicode = false;
								stringEscape = false;
								continue;
							}
							hex_char *= 16;
							if (cInt >= 48 && cInt <= 57) hex_char += cInt - 48;
							else if (cInt >= 65 && cInt <= 70) hex_char += cInt - 65 + 10;
							else if (cInt >= 97 && cInt <= 102) hex_char += cInt - 97 + 10;
							else {
								throwError("(escaped character, parsing hex of \\u)", cInt);
								retval = -1;
								unicodeWide = false;
								stringEscape = false;
								continue;
							}
							continue;
						} else if (stringHex || stringUnicode) {
							if (hex_char_len === 0 && cInt === 123) {
								unicodeWide = true;
								continue;
							}
							if (hex_char_len < 2 || stringUnicode && hex_char_len < 4) {
								hex_char *= 16;
								if (cInt >= 48 && cInt <= 57) hex_char += cInt - 48;
								else if (cInt >= 65 && cInt <= 70) hex_char += cInt - 65 + 10;
								else if (cInt >= 97 && cInt <= 102) hex_char += cInt - 97 + 10;
								else {
									throwError(stringUnicode ? "(escaped character, parsing hex of \\u)" : "(escaped character, parsing hex of \\x)", cInt);
									retval = -1;
									stringHex = false;
									stringEscape = false;
									continue;
								}
								hex_char_len++;
								if (stringUnicode) {
									if (hex_char_len == 4) {
										val.string += String.fromCodePoint(hex_char);
										stringUnicode = false;
										stringEscape = false;
									}
								} else if (hex_char_len == 2) {
									val.string += String.fromCodePoint(hex_char);
									stringHex = false;
									stringEscape = false;
								}
								continue;
							}
						}
						switch (cInt) {
							case 13:
								cr_escaped = true;
								pos.col = 1;
								continue;
							case 8232:
							case 8233: pos.col = 1;
							case 10:
								if (!cr_escaped) pos.col = 1;
								else cr_escaped = false;
								pos.line++;
								break;
							case 116:
								val.string += "	";
								break;
							case 98:
								val.string += "\b";
								break;
							case 110:
								val.string += "\n";
								break;
							case 114:
								val.string += "\r";
								break;
							case 102:
								val.string += "\f";
								break;
							case 118:
								val.string += "\v";
								break;
							case 48:
								val.string += "\0";
								break;
							case 120:
								stringHex = true;
								hex_char_len = 0;
								hex_char = 0;
								continue;
							case 117:
								stringUnicode = true;
								hex_char_len = 0;
								hex_char = 0;
								continue;
							default: val.string += str;
						}
						stringEscape = false;
					} else if (cInt === 92) {
						if (stringEscape) {
							val.string += "\\";
							stringEscape = false;
						} else {
							stringEscape = true;
							hex_char = 0;
							hex_char_len = 0;
						}
					} else {
						if (cr_escaped) {
							cr_escaped = false;
							pos.line++;
							pos.col = 2;
						}
						val.string += str;
					}
				}
				return retval;
			}
			function collectNumber() {
				let _n;
				while ((_n = n) < buf.length) {
					str = buf.charAt(_n);
					let cInt = buf.codePointAt(n++);
					if (cInt >= 256) {
						pos.col -= n - _n;
						n = _n;
						break;
					} else {
						if (cInt == 95) continue;
						pos.col++;
						if (cInt >= 48 && cInt <= 57) {
							if (fromHex && ((val.string[1] === "b" || val.string[1] === "B") && cInt > 49 || (val.string[1] === "o" || val.string[1] === "O") && cInt > 55)) {
								status = false;
								throwError("fault while parsing number;", cInt);
								break;
							}
							if (exponent) exponent_digit = true;
							val.string += str;
						} else if (cInt == 45 || cInt == 43) {
							if (val.string.length == 0 || exponent && !exponent_sign && !exponent_digit) {
								if (cInt == 45 && !exponent) negative = !negative;
								val.string += str;
								exponent_sign = true;
							} else {
								if (negative) {
									val.string = "-" + val.string;
									negative = false;
								}
								val.string += str;
								date_format = true;
							}
						} else if (cInt == 78) {
							if (word == WORD_POS_RESET) {
								gatheringNumber = false;
								word = WORD_POS_NAN_1;
								return;
							}
							throwError("fault while parsing number;", cInt);
							break;
						} else if (cInt == 73) {
							if (word == WORD_POS_RESET) {
								gatheringNumber = false;
								word = WORD_POS_INFINITY_1;
								return;
							}
							throwError("fault while parsing number;", cInt);
							break;
						} else if (cInt == 58 && date_format) {
							if (negative) {
								val.string = "-" + val.string;
								negative = false;
							}
							val.string += str;
							date_format = true;
						} else if (cInt == 84 && date_format) {
							if (negative) {
								val.string = "-" + val.string;
								negative = false;
							}
							val.string += str;
							date_format = true;
						} else if (cInt == 90 && date_format) {
							if (negative) {
								val.string = "-" + val.string;
								negative = false;
							}
							val.string += str;
							date_format = true;
						} else if (cInt == 46) {
							if (!decimal && !fromHex && !exponent) {
								val.string += str;
								decimal = true;
							} else {
								status = false;
								throwError("fault while parsing number;", cInt);
								break;
							}
						} else if (cInt == 110) {
							isBigInt = true;
							break;
						} else if (fromHex && (val.string[1] === "x" || val.string[1] === "X") && (cInt >= 97 && cInt <= 102 || cInt >= 65 && cInt <= 70)) val.string += str;
						else if (cInt == 120 || cInt == 98 || cInt == 111 || cInt == 88 || cInt == 66 || cInt == 79) {
							if (!fromHex && val.string == "0") {
								fromHex = true;
								val.string += str;
							} else {
								status = false;
								throwError("fault while parsing number;", cInt);
								break;
							}
						} else if (cInt == 101 || cInt == 69) {
							if (!exponent) {
								val.string += str;
								exponent = true;
							} else {
								status = false;
								throwError("fault while parsing number;", cInt);
								break;
							}
						} else {
							if (cInt == 160) break;
							if (cInt == 32 || cInt == 13 || cInt == 10 || cInt == 9 || cInt == 47 || cInt == 35 || cInt == 44 || cInt == 125 || cInt == 93 || cInt == 123 || cInt == 91 || cInt == 34 || cInt == 39 || cInt == 96 || cInt == 58) {
								pos.col -= n - _n;
								n = _n;
								break;
							} else {
								if (complete_at_end) {
									status = false;
									throwError("fault while parsing number;", cInt);
								}
								break;
							}
						}
					}
				}
				if (!complete_at_end && n == buf.length) gatheringNumber = true;
				else {
					gatheringNumber = false;
					val.value_type = VALUE_NUMBER;
					if (parse_context == CONTEXT_UNKNOWN) completed = true;
				}
			}
			function openObject() {
				let nextMode = CONTEXT_OBJECT_FIELD;
				let cls = null;
				let tmpobj = {};
				if (word > WORD_POS_RESET && word < WORD_POS_FIELD) recoverIdent(123);
				let protoDef;
				protoDef = getProto();
				if (parse_context == CONTEXT_UNKNOWN) {
					if (word == WORD_POS_FIELD || word == WORD_POS_END && (protoDef || val.string.length)) {
						if (protoDef && protoDef.protoDef && protoDef.protoDef.protoCon) tmpobj = new protoDef.protoDef.protoCon();
						if (!protoDef || !protoDef.protoDef && val.string) {
							cls = classes.find((cls) => cls.name === val.string);
							if (!cls) {
								function privateProto() {}
								classes.push(cls = {
									name: val.string,
									protoCon: protoDef && protoDef.protoDef && protoDef.protoDef.protoCon || privateProto.prototype.constructor,
									fields: []
								});
								nextMode = CONTEXT_CLASS_FIELD;
							} else if (redefineClass) {
								cls.fields.length = 0;
								nextMode = CONTEXT_CLASS_FIELD;
							} else {
								tmpobj = new cls.protoCon();
								nextMode = CONTEXT_CLASS_VALUE;
							}
							redefineClass = false;
						}
						current_class = cls;
						word = WORD_POS_RESET;
					} else word = WORD_POS_FIELD;
				} else if (word == WORD_POS_FIELD || parse_context === CONTEXT_IN_ARRAY || parse_context === CONTEXT_OBJECT_FIELD_VALUE || parse_context == CONTEXT_CLASS_VALUE) {
					if (word != WORD_POS_RESET || val.value_type == VALUE_STRING) {
						if (protoDef && protoDef.protoDef) tmpobj = new protoDef.protoDef.protoCon();
						else {
							cls = classes.find((cls) => cls.name === val.string);
							if (!cls) {
								function privateProto() {}
								localFromProtoTypes.set(val.string, {
									protoCon: privateProto.prototype.constructor,
									cb: null,
									synthetic: true
								});
								tmpobj = new privateProto();
							} else {
								nextMode = CONTEXT_CLASS_VALUE;
								tmpobj = new cls.protoCon();
							}
						}
						word = WORD_POS_RESET;
					} else word = WORD_POS_RESET;
				} else if (parse_context == CONTEXT_OBJECT_FIELD && word == WORD_POS_RESET) {
					throwError("fault while parsing; getting field name unexpected ", cInt);
					status = false;
					return false;
				}
				let old_context = getContext();
				val.value_type = VALUE_OBJECT;
				if (parse_context === CONTEXT_UNKNOWN) elements = tmpobj;
				else if (parse_context == CONTEXT_IN_ARRAY) {
					if (arrayType == -1) {}
					val.name = elements.length;
				} else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE || parse_context == CONTEXT_CLASS_VALUE) {
					if (!val.name && current_class) val.name = nextClassField();
					elements[val.name] = tmpobj;
				}
				old_context.context = parse_context;
				old_context.elements = elements;
				old_context.name = val.name;
				old_context.current_proto = current_proto;
				old_context.current_class = current_class;
				old_context.current_class_field = current_class_field;
				old_context.valueType = val.value_type;
				old_context.arrayType = arrayType;
				old_context.className = val.className;
				val.className = null;
				val.name = null;
				current_proto = protoDef;
				current_class = cls;
				current_class_field = 0;
				elements = tmpobj;
				if (!rootObject) rootObject = elements;
				context_stack.push(old_context);
				RESET_VAL();
				parse_context = nextMode;
				return true;
			}
			function openArray() {
				if (word > WORD_POS_RESET && word < WORD_POS_FIELD) recoverIdent(91);
				if ((word == WORD_POS_END || parse_context !== CONTEXT_UNKNOWN && (word == WORD_POS_AFTER_FIELD || word == WORD_POS_AFTER_FIELD_VALUE) || parse_context == CONTEXT_UNKNOWN && word == WORD_POS_FIELD) && val.string.length) {
					let typeIndex = knownArrayTypeNames.findIndex((type) => type === val.string);
					word = WORD_POS_RESET;
					if (typeIndex >= 0) {
						arrayType = typeIndex;
						val.className = val.string;
						val.string = null;
					} else if (val.string === "ref") {
						val.className = null;
						arrayType = -2;
					} else if (localFromProtoTypes.get(val.string)) val.className = val.string;
					else if (fromProtoTypes.get(val.string)) val.className = val.string;
					else val.className = null;
				} else if (parse_context == CONTEXT_OBJECT_FIELD || word == WORD_POS_FIELD || word == WORD_POS_AFTER_FIELD) {
					throwError("Fault while parsing; while getting field name unexpected", cInt);
					status = false;
					return false;
				}
				{
					let old_context = getContext();
					val.value_type = VALUE_ARRAY;
					let tmparr = [];
					if (parse_context == CONTEXT_UNKNOWN) elements = tmparr;
					else if (parse_context == CONTEXT_IN_ARRAY) {
						if (arrayType == -1) elements.push(tmparr);
						val.name = elements.length;
					} else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) {
						if (!val.name) {
							console.log("This says it's resolved.......");
							arrayType = -3;
						}
						if (current_proto && current_proto.protoDef) {
							if (current_proto.protoDef.cb) {
								const newarr = current_proto.protoDef.cb.call(elements, val.name, tmparr);
								if (newarr !== void 0) tmparr = elements[val.name] = newarr;
							} else elements[val.name] = tmparr;
						} else elements[val.name] = tmparr;
					}
					old_context.context = parse_context;
					old_context.elements = elements;
					old_context.name = val.name;
					old_context.current_proto = current_proto;
					old_context.current_class = current_class;
					old_context.current_class_field = current_class_field;
					old_context.valueType = val.value_type;
					old_context.arrayType = arrayType == -1 ? -3 : arrayType;
					old_context.className = val.className;
					arrayType = -1;
					val.className = null;
					val.name = null;
					current_proto = null;
					current_class = null;
					current_class_field = 0;
					elements = tmparr;
					if (!rootObject) rootObject = tmparr;
					context_stack.push(old_context);
					RESET_VAL();
					parse_context = CONTEXT_IN_ARRAY;
				}
				return true;
			}
			function getProto() {
				const rv = {
					protoDef: null,
					cls: null
				};
				if (rv.protoDef = localFromProtoTypes.get(val.string)) {
					if (!val.className) {
						val.className = val.string;
						val.string = null;
					}
				} else if (rv.protoDef = fromProtoTypes.get(val.string)) {
					if (!val.className) {
						val.className = val.string;
						val.string = null;
					}
				}
				if (val.string) {
					rv.cls = classes.find((cls) => cls.name === val.string);
					if (!rv.protoDef && !rv.cls) {}
				}
				return rv.protoDef || rv.cls ? rv : null;
			}
			if (!status) return -1;
			if (msg && msg.length) {
				input = getBuffer();
				input.buf = msg;
				inQueue.push(input);
			} else {
				if (gatheringNumber) {
					gatheringNumber = false;
					val.value_type = VALUE_NUMBER;
					if (parse_context == CONTEXT_UNKNOWN) completed = true;
					retval = 1;
				}
				if (parse_context !== CONTEXT_UNKNOWN) throwError("Unclosed object at end of stream.", cInt);
			}
			while (status && (input = inQueue.shift())) {
				n = input.n;
				buf = input.buf;
				if (gatheringString) {
					let string_status = gatherString(gatheringStringFirstChar);
					if (string_status < 0) status = false;
					else if (string_status > 0) {
						gatheringString = false;
						if (status) val.value_type = VALUE_STRING;
					}
				}
				if (gatheringNumber) collectNumber();
				while (!completed && status && n < buf.length) {
					str = buf.charAt(n);
					cInt = buf.codePointAt(n++);
					if (cInt >= 65536) {
						str += buf.charAt(n);
						n++;
					}
					const sawSignPending = signPending;
					signPending = false;
					if (sawSignPending && !(cInt >= 48 && cInt <= 57 || cInt == 46 || cInt == 73 || cInt == 78)) return throwError("extra data after token; sign is not followed by a number;", cInt);
					pos.col++;
					if (comment) {
						let loneSolidus = false;
						if (comment == 1) {
							if (cInt == 42) comment = 3;
							else if (cInt == 47) comment = 2;
							else {
								comment = 0;
								loneSolidus = true;
							}
						} else if (comment == 2) {
							if (isLineTerminator(cInt)) comment = 0;
						} else if (comment == 3) {
							if (cInt == 42) comment = 4;
						} else if (cInt == 47) comment = 0;
						else comment = 3;
						if (!loneSolidus) continue;
						{
							const held = str;
							str = "/";
							recoverIdent(47);
							str = held;
						}
					}
					switch (cInt) {
						case 35:
							comment = 2;
							break;
						case 47:
							comment = 1;
							break;
						case 123:
						case 91:
							if (parse_context !== CONTEXT_UNKNOWN && !canTagOrBeTagged(val.value_type)) {
								status = false;
								throwError("fault while parsing; two values with no separator between them;", cInt);
							}
							if (cInt === 123) openObject();
							else openArray();
							break;
						case 58:
							if (parse_context == CONTEXT_CLASS_VALUE) {
								if (current_class_field > 0) {
									status = false;
									throwError("class body mixes named and positional values; fault while parsing;", cInt);
								}
								word = WORD_POS_RESET;
								val.name = val.string;
								val.string = "";
								val.value_type = VALUE_UNSET;
							} else if (parse_context == CONTEXT_OBJECT_FIELD || parse_context == CONTEXT_CLASS_FIELD) {
								if (parse_context == CONTEXT_CLASS_FIELD) {
									if (current_class && current_class.fields.length) {
										status = false;
										throwError("class body mixes named and positional values; fault while parsing;", cInt);
									}
									if (!Object.keys(elements).length) {
										function privateProto() {}
										localFromProtoTypes.set(context_stack.last.node.current_class.name, {
											protoCon: privateProto.prototype.constructor,
											cb: null,
											synthetic: true
										});
										elements = new privateProto();
										parse_context = CONTEXT_OBJECT_FIELD_VALUE;
										val.name = val.string;
										word = WORD_POS_RESET;
										val.string = "";
										val.value_type = VALUE_UNSET;
									}
								} else {
									if (word != WORD_POS_RESET && word != WORD_POS_END && word != WORD_POS_FIELD && word != WORD_POS_AFTER_FIELD) recoverIdent(32);
									word = WORD_POS_RESET;
									val.name = val.string;
									val.string = "";
									parse_context = parse_context === CONTEXT_OBJECT_FIELD ? CONTEXT_OBJECT_FIELD_VALUE : CONTEXT_CLASS_FIELD_VALUE;
									val.value_type = VALUE_UNSET;
								}
							} else if (parse_context == CONTEXT_UNKNOWN) {
								console.log("Override colon found, allow class redefinition", parse_context);
								redefineClass = true;
								break;
							} else {
								if (parse_context == CONTEXT_IN_ARRAY) throwError("(in array, got colon out of string):parsing fault;", cInt);
								else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) throwError("String unexpected", cInt);
								else throwError("(outside any object, got colon out of string):parsing fault;", cInt);
								status = false;
							}
							break;
						case 125:
							if (word == WORD_POS_END) word = WORD_POS_RESET;
							if (parse_context == CONTEXT_CLASS_FIELD) {
								if (current_class) {
									if (val.string) current_class.fields.push(val.string);
									RESET_VAL();
									let old_context = context_stack.pop();
									parse_context = CONTEXT_UNKNOWN;
									word = WORD_POS_RESET;
									val.name = old_context.name;
									elements = old_context.elements;
									current_class = old_context.current_class;
									current_class_field = old_context.current_class_field;
									arrayType = old_context.arrayType;
									val.value_type = old_context.valueType;
									val.className = old_context.className;
									val.value_type = VALUE_UNSET;
									rootObject = null;
									dropContext(old_context);
								} else throwError("State error; gathering class fields, and lost the class", cInt);
							} else if (parse_context == CONTEXT_OBJECT_FIELD || parse_context == CONTEXT_CLASS_VALUE) {
								if (val.value_type != VALUE_UNSET) {
									if (current_class && !val.name) val.name = nextClassField();
									objectPush();
								}
								val.value_type = VALUE_OBJECT;
								if (current_proto && current_proto.protoDef) {
									console.log("SOMETHING SHOULD AHVE BEEN REPLACED HERE??", current_proto);
									console.log("The other version only revives on init");
									elements = new current_proto.protoDef.cb(elements, void 0, void 0);
								}
								val.contains = elements;
								val.string = "";
								let old_context = context_stack.pop();
								parse_context = old_context.context;
								val.name = old_context.name;
								elements = old_context.elements;
								current_class = old_context.current_class;
								current_proto = old_context.current_proto;
								current_class_field = old_context.current_class_field;
								arrayType = old_context.arrayType;
								val.value_type = old_context.valueType;
								val.className = old_context.className;
								dropContext(old_context);
								if (parse_context == CONTEXT_UNKNOWN) completed = true;
							} else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) {
								if (val.value_type === VALUE_UNSET) {
									if (word == WORD_POS_RESET) throwError("Fault while parsing; unexpected", cInt);
									else recoverIdent(cInt);
								}
								objectPush();
								val.value_type = VALUE_OBJECT;
								val.contains = elements;
								word = WORD_POS_RESET;
								let old_context = context_stack.pop();
								parse_context = old_context.context;
								val.name = old_context.name;
								elements = old_context.elements;
								current_proto = old_context.current_proto;
								current_class = old_context.current_class;
								current_class_field = old_context.current_class_field;
								arrayType = old_context.arrayType;
								val.value_type = old_context.valueType;
								val.className = old_context.className;
								dropContext(old_context);
								if (parse_context == CONTEXT_UNKNOWN) completed = true;
							} else {
								throwError("Fault while parsing; unexpected", cInt);
								status = false;
							}
							negative = false;
							break;
						case 93:
							if (word >= WORD_POS_AFTER_FIELD) word = WORD_POS_RESET;
							if (parse_context == CONTEXT_IN_ARRAY) {
								if (val.value_type != VALUE_UNSET) arrayPush();
								else if (word !== WORD_POS_RESET) {
									recoverIdent(cInt);
									arrayPush();
								}
								val.contains = elements;
								{
									let old_context = context_stack.pop();
									val.name = old_context.name;
									val.className = old_context.className;
									parse_context = old_context.context;
									elements = old_context.elements;
									current_proto = old_context.current_proto;
									current_class = old_context.current_class;
									current_class_field = old_context.current_class_field;
									arrayType = old_context.arrayType;
									val.value_type = old_context.valueType;
									dropContext(old_context);
								}
								val.value_type = VALUE_ARRAY;
								if (parse_context == CONTEXT_UNKNOWN) completed = true;
							} else {
								throwError(`bad context ${parse_context}; fault while parsing`, cInt);
								status = false;
							}
							negative = false;
							break;
						case 44:
							if (word < WORD_POS_AFTER_FIELD && word != WORD_POS_RESET) recoverIdent(cInt);
							if (word == WORD_POS_END || word == WORD_POS_FIELD) word = WORD_POS_RESET;
							if (parse_context == CONTEXT_CLASS_FIELD) {
								if (current_class) {
									current_class.fields.push(val.string);
									val.string = "";
									word = WORD_POS_FIELD;
								} else throwError("State error; gathering class fields, and lost the class", cInt);
							} else if (parse_context == CONTEXT_OBJECT_FIELD) {
								if (current_class) {
									val.name = nextClassField();
									if (val.value_type != VALUE_UNSET) {
										objectPush();
										RESET_VAL();
									}
								} else if (val.string || val.value_type) throwError("State error; comma in field name and/or lost the class", cInt);
							} else if (parse_context == CONTEXT_CLASS_VALUE) {
								if (current_class) {
									if (arrayType != -3 && !val.name) val.name = nextClassField();
									if (val.value_type != VALUE_UNSET) {
										if (arrayType != -3) objectPush();
										RESET_VAL();
									}
								} else if (val.value_type != VALUE_UNSET) {
									objectPush();
									RESET_VAL();
								}
								val.name = null;
							} else if (parse_context == CONTEXT_IN_ARRAY) {
								if (val.value_type == VALUE_UNSET) val.value_type = VALUE_EMPTY;
								arrayPush();
								RESET_VAL();
								word = WORD_POS_RESET;
							} else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE && val.value_type != VALUE_UNSET) {
								parse_context = CONTEXT_OBJECT_FIELD;
								if (val.value_type != VALUE_UNSET) {
									objectPush();
									RESET_VAL();
								}
								word = WORD_POS_RESET;
							} else {
								status = false;
								throwError("bad context; excessive commas while parsing;", cInt);
							}
							negative = false;
							break;
						default:
							if (parse_context !== CONTEXT_UNKNOWN && (word === WORD_POS_RESET || word === WORD_POS_AFTER_FIELD || word === WORD_POS_AFTER_FIELD_VALUE) && !canTagOrBeTagged(val.value_type) && !isWhitespace(cInt)) {
								status = false;
								throwError("fault while parsing; two values with no separator between them;", cInt);
							}
							switch (cInt) {
								default:
									if (parse_context == CONTEXT_UNKNOWN || parse_context == CONTEXT_OBJECT_FIELD_VALUE && word == WORD_POS_FIELD || parse_context == CONTEXT_OBJECT_FIELD || word == WORD_POS_FIELD || parse_context == CONTEXT_CLASS_FIELD) switch (cInt) {
										case 96:
										case 34:
										case 39:
											if (word == WORD_POS_RESET || word == WORD_POS_FIELD) {
												if (val.string.length) {
													console.log("IN ARRAY AND FIXING?");
													val.className = val.string;
													val.string = "";
												}
												if (gatherString(cInt)) val.value_type = VALUE_STRING;
												else {
													gatheringStringFirstChar = cInt;
													gatheringString = true;
												}
											} else throwError("fault while parsing; quote not at start of field name", cInt);
											break;
										case 10:
											pos.line++;
											pos.col = 1;
										case 13:
										case 32:
										case 8232:
										case 8233:
										case 9:
										case 65279:
											if (parse_context === CONTEXT_UNKNOWN && word === WORD_POS_END) {
												word = WORD_POS_RESET;
												if (parse_context === CONTEXT_UNKNOWN) completed = true;
												break;
											}
											if (word === WORD_POS_RESET || word === WORD_POS_AFTER_FIELD) {
												if (parse_context == CONTEXT_UNKNOWN && val.value_type) completed = true;
												break;
											} else if (word === WORD_POS_FIELD) {
												if (parse_context === CONTEXT_UNKNOWN) {
													word = WORD_POS_RESET;
													completed = true;
													break;
												}
												if (val.string.length) console.log("STEP TO NEXT TOKEN.");
												word = WORD_POS_AFTER_FIELD;
											} else {
												status = false;
												throwError("fault while parsing; whitepsace unexpected", cInt);
											}
											break;
										default:
											if (word == WORD_POS_RESET && (cInt >= 48 && cInt <= 57 || cInt == 43 || cInt == 46 || cInt == 45)) {
												if (parse_context !== CONTEXT_UNKNOWN && val.value_type !== VALUE_UNSET) {
													status = false;
													throwError("fault while parsing; two values with no separator between them;", cInt);
												}
												fromHex = false;
												exponent = false;
												date_format = false;
												isBigInt = false;
												exponent_sign = false;
												exponent_digit = false;
												decimal = false;
												val.string = str;
												input.n = n;
												collectNumber();
												break;
											}
											if (word === WORD_POS_AFTER_FIELD) {
												status = false;
												throwError("fault while parsing; character unexpected", cInt);
											}
											if (word === WORD_POS_RESET) {
												word = WORD_POS_FIELD;
												val.value_type = VALUE_STRING;
												val.string += str;
												break;
											}
											if (val.value_type == VALUE_UNSET) {
												if (word !== WORD_POS_RESET && word !== WORD_POS_END) recoverIdent(cInt);
											} else {
												if (word === WORD_POS_END || word === WORD_POS_FIELD) {
													if (isKeywordValue(val.value_type)) recoverIdent(cInt);
													else val.string += str;
													break;
												}
												if (parse_context == CONTEXT_OBJECT_FIELD) {
													if (word == WORD_POS_FIELD) {
														val.string += str;
														break;
													}
													throwError("Multiple values found in field name", cInt);
												}
												if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) throwError("String unexpected", cInt);
											}
									}
									else {
										if (word == WORD_POS_RESET && (cInt >= 48 && cInt <= 57 || cInt == 43 || cInt == 46 || cInt == 45)) {
											if (parse_context !== CONTEXT_UNKNOWN && val.value_type !== VALUE_UNSET) {
												status = false;
												throwError("fault while parsing; two values with no separator between them;", cInt);
											}
											fromHex = false;
											exponent = false;
											date_format = false;
											isBigInt = false;
											exponent_sign = false;
											exponent_digit = false;
											decimal = false;
											val.string = str;
											input.n = n;
											collectNumber();
										} else if (val.value_type == VALUE_UNSET) {
											if (word != WORD_POS_RESET) recoverIdent(cInt);
											else {
												word = WORD_POS_END;
												val.string += str;
												val.value_type = VALUE_STRING;
											}
										} else if (parse_context == CONTEXT_OBJECT_FIELD) throwError("Multiple values found in field name", cInt);
										else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) {
											if (val.value_type != VALUE_STRING) {
												if (val.value_type == VALUE_OBJECT || val.value_type == VALUE_ARRAY) throwError("String unexpected", cInt);
												recoverIdent(cInt);
												break;
											}
											if (word == WORD_POS_AFTER_FIELD || word == WORD_POS_AFTER_FIELD_VALUE) {
												if (val.className) {
													status = false;
													throwError("too many strings in a row; fault while parsing;", cInt);
												}
												getProto();
												if (!val.className) val.className = val.string;
												val.string = str;
												word = WORD_POS_END;
												break;
											} else if (word == WORD_POS_END) val.string += str;
											else throwError("String unexpected", cInt);
										} else if (parse_context == CONTEXT_IN_ARRAY) {
											if (word == WORD_POS_AFTER_FIELD) {
												if (val.className) {
													status = false;
													throwError("too many strings in a row; fault while parsing;", cInt);
												}
												if (!val.className) {
													val.className = val.string;
													val.string = "";
													word = WORD_POS_END;
												}
												val.string += str;
												break;
											} else if (word == WORD_POS_END) {
												if (isKeywordValue(val.value_type)) recoverIdent(cInt);
												else val.string += str;
											}
										} else if (parse_context == CONTEXT_CLASS_VALUE) {
											if (word == WORD_POS_END) {
												if (isKeywordValue(val.value_type)) recoverIdent(cInt);
												else val.string += str;
											}
										}
										break;
									}
									break;
								case 96:
								case 34:
								case 39:
									if (parse_context !== CONTEXT_UNKNOWN && !canTagOrBeTagged(val.value_type)) {
										status = false;
										throwError("fault while parsing; two values with no separator between them;", cInt);
									}
									if (val.className) {
										status = false;
										throwError("too many strings in a row; fault while parsing;", cInt);
									}
									if (val.string) val.className = val.string;
									val.string = "";
									if (gatherString(cInt)) {
										val.value_type = VALUE_STRING;
										word = WORD_POS_END;
									} else {
										gatheringStringFirstChar = cInt;
										gatheringString = true;
									}
									break;
								case 10:
									pos.line++;
									pos.col = 1;
								case 32:
								case 9:
								case 13:
								case 8232:
								case 8233:
								case 65279:
									if (word == WORD_POS_END) {
										if (parse_context == CONTEXT_UNKNOWN) {
											word = WORD_POS_RESET;
											completed = true;
											break;
										} else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) {
											word = WORD_POS_AFTER_FIELD_VALUE;
											break;
										} else if (parse_context == CONTEXT_OBJECT_FIELD) {
											word = WORD_POS_AFTER_FIELD;
											break;
										} else if (parse_context == CONTEXT_IN_ARRAY) {
											word = WORD_POS_AFTER_FIELD;
											break;
										}
									}
									if (word == WORD_POS_RESET || word == WORD_POS_AFTER_FIELD) break;
									else if (word == WORD_POS_FIELD) {
										if (val.string.length) word = WORD_POS_AFTER_FIELD;
									} else if (word < WORD_POS_END) recoverIdent(cInt);
									break;
								case 116:
									if (word == WORD_POS_RESET) word = WORD_POS_TRUE_1;
									else if (word == WORD_POS_INFINITY_6) word = WORD_POS_INFINITY_7;
									else recoverIdent(cInt);
									break;
								case 114:
									if (word == WORD_POS_TRUE_1) word = WORD_POS_TRUE_2;
									else recoverIdent(cInt);
									break;
								case 117:
									if (word == WORD_POS_TRUE_2) word = WORD_POS_TRUE_3;
									else if (word == WORD_POS_NULL_1) word = WORD_POS_NULL_2;
									else if (word == WORD_POS_RESET) word = WORD_POS_UNDEFINED_1;
									else recoverIdent(cInt);
									break;
								case 101:
									if (word == WORD_POS_TRUE_3) {
										val.value_type = VALUE_TRUE;
										word = WORD_POS_END;
									} else if (word == WORD_POS_FALSE_4) {
										val.value_type = VALUE_FALSE;
										word = WORD_POS_END;
									} else if (word == WORD_POS_UNDEFINED_3) word = WORD_POS_UNDEFINED_4;
									else if (word == WORD_POS_UNDEFINED_7) word = WORD_POS_UNDEFINED_8;
									else recoverIdent(cInt);
									break;
								case 110:
									if (word == WORD_POS_RESET) word = WORD_POS_NULL_1;
									else if (word == WORD_POS_UNDEFINED_1) word = WORD_POS_UNDEFINED_2;
									else if (word == WORD_POS_UNDEFINED_6) word = WORD_POS_UNDEFINED_7;
									else if (word == WORD_POS_INFINITY_1) word = WORD_POS_INFINITY_2;
									else if (word == WORD_POS_INFINITY_4) word = WORD_POS_INFINITY_5;
									else recoverIdent(cInt);
									break;
								case 100:
									if (word == WORD_POS_UNDEFINED_2) word = WORD_POS_UNDEFINED_3;
									else if (word == WORD_POS_UNDEFINED_8) {
										val.value_type = VALUE_UNDEFINED;
										word = WORD_POS_END;
									} else recoverIdent(cInt);
									break;
								case 105:
									if (word == WORD_POS_UNDEFINED_5) word = WORD_POS_UNDEFINED_6;
									else if (word == WORD_POS_INFINITY_3) word = WORD_POS_INFINITY_4;
									else if (word == WORD_POS_INFINITY_5) word = WORD_POS_INFINITY_6;
									else recoverIdent(cInt);
									break;
								case 108:
									if (word == WORD_POS_NULL_2) word = WORD_POS_NULL_3;
									else if (word == WORD_POS_NULL_3) {
										val.value_type = VALUE_NULL;
										word = WORD_POS_END;
									} else if (word == WORD_POS_FALSE_2) word = WORD_POS_FALSE_3;
									else recoverIdent(cInt);
									break;
								case 102:
									if (word == WORD_POS_RESET) word = WORD_POS_FALSE_1;
									else if (word == WORD_POS_UNDEFINED_4) word = WORD_POS_UNDEFINED_5;
									else if (word == WORD_POS_INFINITY_2) word = WORD_POS_INFINITY_3;
									else recoverIdent(cInt);
									break;
								case 97:
									if (word == WORD_POS_FALSE_1) word = WORD_POS_FALSE_2;
									else if (word == WORD_POS_NAN_1) word = WORD_POS_NAN_2;
									else recoverIdent(cInt);
									break;
								case 115:
									if (word == WORD_POS_FALSE_3) word = WORD_POS_FALSE_4;
									else recoverIdent(cInt);
									break;
								case 73:
									if (word == WORD_POS_RESET) word = WORD_POS_INFINITY_1;
									else recoverIdent(cInt);
									break;
								case 78:
									if (word == WORD_POS_RESET) word = WORD_POS_NAN_1;
									else if (word == WORD_POS_NAN_2) {
										val.value_type = negative ? VALUE_NEG_NAN : VALUE_NAN;
										negative = false;
										word = WORD_POS_END;
									} else recoverIdent(cInt);
									break;
								case 121:
									if (word == WORD_POS_INFINITY_7) {
										val.value_type = negative ? VALUE_NEG_INFINITY : VALUE_INFINITY;
										negative = false;
										word = WORD_POS_END;
									} else recoverIdent(cInt);
									break;
								case 45:
									if (word == WORD_POS_RESET) {
										negative = !negative;
										signPending = true;
									} else recoverIdent(cInt);
									break;
								case 43: if (word !== WORD_POS_RESET) recoverIdent(cInt);
								else signPending = true;
							}
					}
					if (completed) {
						if (word == WORD_POS_END) word = WORD_POS_RESET;
						break;
					}
				}
				if (n == buf.length) {
					dropBuffer(input);
					if (val.value_type == VALUE_UNSET && complete_at_end && word != WORD_POS_RESET) recoverIdent(32);
					if (gatheringString || gatheringNumber || parse_context == CONTEXT_OBJECT_FIELD) retval = 0;
					else if (parse_context == CONTEXT_UNKNOWN && (val.value_type != VALUE_UNSET || result)) {
						completed = true;
						retval = 1;
					}
				} else {
					input.n = n;
					inQueue.unshift(input);
					retval = 2;
				}
				if (completed) {
					rootObject = null;
					break;
				}
			}
			if (!status) return -1;
			if (completed && val.value_type != VALUE_UNSET) {
				word = WORD_POS_RESET;
				result = convertValue();
				if (deferredRefs) {
					const refs = deferredRefs, fixups = deferredFixups;
					deferredRefs = null;
					deferredFixups = null;
					result = resolveDeferredRefs(result, refs, fixups);
				}
				negative = false;
				val.string = "";
				val.value_type = VALUE_UNSET;
			}
			completed = false;
			return retval;
		}
	};
};
var _parser = [Object.freeze(JSOX.begin())];
var _parse_level = 0;
/**
* parse a string resulting with one value from it.
*
* @template T
* @param {string} msg 
* @param {(this: any, key: string, value: any) => any} [reviver] 
* @returns {T}
*/
JSOX.parse = function(msg, reviver) {
	let parse_level = _parse_level++;
	let parser;
	if (_parser.length <= parse_level) _parser.push(Object.freeze(JSOX.begin()));
	parser = _parser[parse_level];
	if (typeof msg !== "string") msg = String(msg);
	parser.reset();
	const writeResult = parser._write(msg, true);
	if (writeResult > 0) {
		if (writeResult > 1) {}
		let value = parser.value();
		if ("undefined" === typeof value && writeResult > 1) throw new Error("Pending value could not complete");
		value = typeof reviver === "function" ? function walk(holder, key) {
			let k, v, value = holder[key];
			if (value && typeof value === "object") {
				for (k in value) if (Object.prototype.hasOwnProperty.call(value, k)) {
					v = walk(value, k);
					if (v !== void 0) value[k] = v;
					else delete value[k];
				}
			}
			return reviver.call(holder, key, value);
		}({ "": value }, "") : value;
		_parse_level--;
		return value;
	}
	parser.finalError();
};
function this_value() {
	return this && this.valueOf();
}
/**
* Define a class to be used for serialization; the class allows emitting the class fields ahead of time, and just provide values later.
* @param {string} name 
* @param {object} obj 
*/
JSOX.defineClass = function(name, obj) {
	let cls;
	let denormKeys = Object.keys(obj);
	for (let i = 1; i < denormKeys.length; i++) {
		let a, b;
		if ((a = denormKeys[i - 1]) > (b = denormKeys[i])) {
			denormKeys[i - 1] = b;
			denormKeys[i] = a;
			if (i) i -= 2;
			else i--;
		}
	}
	commonClasses.push(cls = {
		name,
		tag: denormKeys.toString(),
		proto: Object.getPrototypeOf(obj),
		fields: Object.keys(obj)
	});
	for (let n = 1; n < cls.fields.length; n++) if (cls.fields[n] < cls.fields[n - 1]) {
		let tmp = cls.fields[n - 1];
		cls.fields[n - 1] = cls.fields[n];
		cls.fields[n] = tmp;
		if (n > 1) n -= 2;
	}
	if (cls.proto === Object.getPrototypeOf({})) cls.proto = null;
};
/**
* deprecated; define a class to be used for serialization
*
* @param {string} named
* @param {class} ptype
* @param {(any)=>any} f
*/
JSOX.registerToJSOX = function(name, ptype, f) {
	throw new Error("registerToJSOX deprecated; please use toJSOX:" + prototypeName + prototype.toString());
};
/**
* define a class with special serialization rules.
*
* @param {string} named
* @param {class} ptype
* @param {(any)=>any} f
*/
JSOX.toJSOX = function(name, ptype, f) {
	if (!ptype.prototype || ptype.prototype !== Object.prototype) {
		if (toProtoTypes.get(ptype.prototype)) throw new Error("Existing toJSOX has been registered for prototype " + name + " " + ptype?.name);
		toProtoTypes.set(ptype.prototype, {
			external: true,
			name: name || f.constructor.name,
			cb: f
		});
	} else {
		let key = Object.keys(ptype).toString();
		if (toObjectTypes.get(key)) throw new Error("Existing toJSOX has been registered for object type");
		toObjectTypes.set(key, {
			external: true,
			name,
			cb: f
		});
	}
};
/**
* define a class to be used for deserialization
* @param {string} prototypeName 
* @param {class} o 
* @param {(any)=>any} f 
*/
JSOX.fromJSOX = function(prototypeName, o, f) {
	function privateProto() {}
	if (!o) o = privateProto.prototype;
	if (fromProtoTypes.get(prototypeName)) throw new Error("Existing fromJSOX has been registered for prototype");
	if (o && !("constructor" in o)) throw new Error("Please pass a prototype like thing...");
	fromProtoTypes.set(prototypeName, {
		protoCon: o.prototype.constructor,
		cb: f
	});
};
/**
* deprecated; use fromJSOX instead
*/
JSOX.registerFromJSOX = function(prototypeName, o) {
	throw new Error("deprecated; please adjust code to use fromJSOX:" + prototypeName + o.toString());
};
/**
* Define serialization and deserialization methods for a class.
* This is the same as registering separately with toJSOX and fromJSOX methods.
* 
* @param {string} name - Name used to prefix objects of this type encoded in JSOX
* @param {class} prototype - prototype to match when serializing, and to create instaces of when deserializing.
* @param {(stringifier:JSOXStringifier)=>{string}} to - `this` is the value to convert; function to call to encode JSOX from an object
* @param {(field:string,val:any)=>{any}} from - handle storing revived value in class
*/
JSOX.addType = function(prototypeName, prototype, to, from) {
	JSOX.toJSOX(prototypeName, prototype, to);
	JSOX.fromJSOX(prototypeName, prototype, from);
};
JSOX.registerToFrom = function(prototypeName, prototype) {
	throw new Error("registerToFrom deprecated; please use addType:" + prototypeName + prototype.toString());
};
/**
* Create a stringifier to convert objects to JSOX text.  Allows defining custom serialization for objects.
* @returns {JSOXStringifier}
*/
JSOX.stringifier = function() {
	let classes = [];
	let useQuote = "\"";
	let fieldMap = /* @__PURE__ */ new WeakMap();
	let sortFields = true;
	let depth = 0;
	const path = [];
	let encoding = [];
	const localToProtoTypes = /* @__PURE__ */ new WeakMap();
	const localToObjectTypes = /* @__PURE__ */ new Map();
	let objectToJSOX = null;
	const stringifying = [];
	let ignoreNonEnumerable = false;
	function getIdentifier(s) {
		if ("string" === typeof s && s === "") return "\"\"";
		if ("number" === typeof s && !isNaN(s)) return [
			"'",
			s.toString(),
			"'"
		].join("");
		if (s.includes("﻿")) return useQuote + JSOX.escape(s) + useQuote;
		return s in keywords || /[0-9\-]/.test(s[0]) || /[\n\r\t #\[\]{}()<>\~!+*/.:,\-"'`]/.test(s) ? useQuote + JSOX.escape(s) + useQuote : s;
	}
	if (!toProtoTypes.get(Object.prototype)) {
		toProtoTypes.set(Object.prototype, {
			external: false,
			name: Object.prototype.constructor.name,
			cb: null
		});
		toProtoTypes.set(Date.prototype, {
			external: false,
			name: "Date",
			cb: function() {
				if (this.getTime() === -621672192e5) return "0000-01-01T00:00:00.000Z";
				let tzo = -this.getTimezoneOffset(), dif = tzo >= 0 ? "+" : "-", pad = function(num) {
					let norm = Math.floor(Math.abs(num));
					return (norm < 10 ? "0" : "") + norm;
				}, pad3 = function(num) {
					let norm = Math.floor(Math.abs(num));
					return (norm < 100 ? "0" : "") + (norm < 10 ? "0" : "") + norm;
				};
				return [
					this.getFullYear(),
					"-",
					pad(this.getMonth() + 1),
					"-",
					pad(this.getDate()),
					"T",
					pad(this.getHours()),
					":",
					pad(this.getMinutes()),
					":",
					pad(this.getSeconds()),
					"." + pad3(this.getMilliseconds()) + dif,
					pad(tzo / 60),
					":",
					pad(tzo % 60)
				].join("");
			}
		});
		toProtoTypes.set(DateNS.prototype, {
			external: false,
			name: "DateNS",
			cb: function() {
				let tzo = -this.getTimezoneOffset(), dif = tzo >= 0 ? "+" : "-", pad = function(num) {
					let norm = Math.floor(Math.abs(num));
					return (norm < 10 ? "0" : "") + norm;
				}, pad3 = function(num) {
					let norm = Math.floor(Math.abs(num));
					return (norm < 100 ? "0" : "") + (norm < 10 ? "0" : "") + norm;
				}, pad6 = function(num) {
					let norm = Math.floor(Math.abs(num));
					return (norm < 1e5 ? "0" : "") + (norm < 1e4 ? "0" : "") + (norm < 1e3 ? "0" : "") + (norm < 100 ? "0" : "") + (norm < 10 ? "0" : "") + norm;
				};
				return [
					this.getFullYear(),
					"-",
					pad(this.getMonth() + 1),
					"-",
					pad(this.getDate()),
					"T",
					pad(this.getHours()),
					":",
					pad(this.getMinutes()),
					":",
					pad(this.getSeconds()),
					"." + pad3(this.getMilliseconds()) + pad6(this.ns) + dif,
					pad(tzo / 60),
					":",
					pad(tzo % 60)
				].join("");
			}
		});
		toProtoTypes.set(Boolean.prototype, {
			external: false,
			name: "Boolean",
			cb: this_value
		});
		toProtoTypes.set(Number.prototype, {
			external: false,
			name: "Number",
			cb: function() {
				if (isNaN(this)) return "NaN";
				return isFinite(this) ? String(this) : this < 0 ? "-Infinity" : "Infinity";
			}
		});
		toProtoTypes.set(String.prototype, {
			external: false,
			name: "String",
			cb: function() {
				return "\"" + JSOX.escape(this_value.apply(this)) + "\"";
			}
		});
		if (typeof BigInt === "function") toProtoTypes.set(BigInt.prototype, {
			external: false,
			name: "BigInt",
			cb: function() {
				return this + "n";
			}
		});
		toProtoTypes.set(ArrayBuffer.prototype, {
			external: true,
			name: "ab",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this)) + "]";
			}
		});
		toProtoTypes.set(Uint8Array.prototype, {
			external: true,
			name: "u8",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Uint8ClampedArray.prototype, {
			external: true,
			name: "cu8",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Int8Array.prototype, {
			external: true,
			name: "s8",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Uint16Array.prototype, {
			external: true,
			name: "u16",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Int16Array.prototype, {
			external: true,
			name: "s16",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Uint32Array.prototype, {
			external: true,
			name: "u32",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Int32Array.prototype, {
			external: true,
			name: "s32",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Float32Array.prototype, {
			external: true,
			name: "f32",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Float64Array.prototype, {
			external: true,
			name: "f64",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Float64Array.prototype, {
			external: true,
			name: "f64",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(RegExp.prototype, mapToJSOX = {
			external: true,
			name: "regex",
			cb: function(o, stringifier) {
				return "'" + escape(this.source) + "'";
			}
		});
		fromProtoTypes.set("regex", {
			protoCon: RegExp,
			cb: function(field, val) {
				return new RegExp(this);
			}
		});
		toProtoTypes.set(Map.prototype, mapToJSOX = {
			external: true,
			name: "map",
			cb: null
		});
		fromProtoTypes.set("map", {
			protoCon: Map,
			cb: function(field, val) {
				if (field) {
					this.set(field, val);
					return;
				}
				return this;
			}
		});
		toProtoTypes.set(Array.prototype, arrayToJSOX = {
			external: false,
			name: Array.prototype.constructor.name,
			cb: null
		});
	}
	const stringifier = {
		defineClass(name, obj) {
			let cls;
			let denormKeys = Object.keys(obj);
			for (let i = 1; i < denormKeys.length; i++) {
				let a, b;
				if ((a = denormKeys[i - 1]) > (b = denormKeys[i])) {
					denormKeys[i - 1] = b;
					denormKeys[i] = a;
					if (i) i -= 2;
					else i--;
				}
			}
			classes.push(cls = {
				name,
				tag: denormKeys.toString(),
				proto: Object.getPrototypeOf(obj),
				fields: Object.keys(obj)
			});
			for (let n = 1; n < cls.fields.length; n++) if (cls.fields[n] < cls.fields[n - 1]) {
				let tmp = cls.fields[n - 1];
				cls.fields[n - 1] = cls.fields[n];
				cls.fields[n] = tmp;
				if (n > 1) n -= 2;
			}
			if (cls.proto === Object.getPrototypeOf({})) cls.proto = null;
		},
		setDefaultObjectToJSOX(cb) {
			objectToJSOX = cb;
		},
		isEncoding(o) {
			return !!encoding.find((eo, i) => eo === o && i < encoding.length - 1);
		},
		encodeObject(o) {
			if (objectToJSOX) return objectToJSOX.apply(o, [this]);
			return o;
		},
		stringify(o, r, s) {
			return stringify(o, r, s);
		},
		get sort() {
			return sortFields;
		},
		set sort(v) {
			sortFields = !!v;
		},
		get quote() {
			return useQuote;
		},
		set quote(q) {
			useQuote = q;
		},
		setQuote(q) {
			console.log("JSOX: setQuote() is deprecated, use `stringifier.quote = ...` instead.");
			useQuote = q;
		},
		registerToJSOX(n, p, f) {
			return this.toJSOX(n, p, f);
		},
		toJSOX(name, ptype, f) {
			if (ptype.prototype && ptype.prototype !== Object.prototype) {
				if (localToProtoTypes.get(ptype.prototype)) throw new Error("Existing toJSOX has been registered for prototype");
				localToProtoTypes.set(ptype.prototype, {
					external: true,
					name: name || f.constructor.name,
					cb: f
				});
			} else {
				let key = Object.keys(ptype).toString();
				if (localToObjectTypes.get(key)) throw new Error("Existing toJSOX has been registered for object type");
				localToObjectTypes.set(key, {
					external: true,
					name,
					cb: f
				});
			}
		},
		get ignoreNonEnumerable() {
			return ignoreNonEnumerable;
		},
		set ignoreNonEnumerable(val) {
			ignoreNonEnumerable = val;
		}
	};
	return stringifier;
	/**
	* get a reference to a previously seen object
	* @param {any} here 
	* @returns reference to existing object, or undefined if not found.
	*/
	function getReference(here) {
		if (here === null) return void 0;
		let field = fieldMap.get(here);
		if (!field) {
			fieldMap.set(here, _JSON.stringify(path));
			return;
		}
		return "ref" + field;
	}
	/**
	* find the prototype definition for a class
	* @param {object} o 
	* @param {map} useK 
	* @returns object
	*/
	function matchObject(o, useK) {
		let k;
		let cls;
		let prt = Object.getPrototypeOf(o);
		cls = classes.find((cls) => {
			if (cls.proto && cls.proto === prt) return true;
		});
		if (cls) return cls;
		if (classes.length || commonClasses.length) {
			if (useK) {
				useK = useK.map((v) => {
					if (typeof v === "string") return v;
					else return void 0;
				});
				k = useK.toString();
			} else {
				let denormKeys = Object.keys(o);
				for (let i = 1; i < denormKeys.length; i++) {
					let a, b;
					if ((a = denormKeys[i - 1]) > (b = denormKeys[i])) {
						denormKeys[i - 1] = b;
						denormKeys[i] = a;
						if (i) i -= 2;
						else i--;
					}
				}
				k = denormKeys.toString();
			}
			cls = classes.find((cls) => {
				if (cls.tag === k) return true;
			});
			if (!cls) cls = commonClasses.find((cls) => {
				if (cls.tag === k) return true;
			});
		}
		return cls;
	}
	/**
	* Serialize an object to JSOX text.
	* @param {any} object 
	* @param {(key:string,value:any)=>string} replacer 
	* @param {string|number} space 
	* @returns 
	*/
	function stringify(object, replacer, space) {
		if (object === void 0) return "undefined";
		if (object === null) return;
		let restoreSort;
		let restoreQuote;
		if (replacer && "object" === typeof replacer && !Array.isArray(replacer)) {
			const opts = replacer;
			replacer = opts.replacer;
			if (space === void 0) space = opts.pretty !== void 0 ? opts.pretty : opts.space;
			if (opts.sort !== void 0) {
				restoreSort = sortFields;
				sortFields = !!opts.sort;
			}
			if (opts.quote !== void 0) {
				restoreQuote = useQuote;
				useQuote = opts.quote;
			}
		}
		let gap;
		let indent;
		let rep;
		let i;
		const spaceType = typeof space;
		const repType = typeof replacer;
		gap = "";
		indent = "";
		if (spaceType === "number") for (i = 0; i < space; i += 1) indent += " ";
		else if (spaceType === "string") indent = space;
		rep = replacer;
		if (replacer && repType !== "function" && (repType !== "object" || typeof replacer.length !== "number")) throw new Error("JSOX.stringify");
		if (!depth) {
			path.length = 0;
			fieldMap = /* @__PURE__ */ new WeakMap();
		}
		depth++;
		try {
			return str("", { "": object });
		} finally {
			depth--;
			if (!depth) commonClasses.length = 0;
			if (restoreSort !== void 0) sortFields = restoreSort;
			if (restoreQuote !== void 0) useQuote = restoreQuote;
		}
		function str(key, holder) {
			var mind = gap;
			const doArrayToJSOX_ = arrayToJSOX.cb;
			const mapToObject_ = mapToJSOX.cb;
			arrayToJSOX.cb = doArrayToJSOX;
			mapToJSOX.cb = mapToObject;
			const v = str_(key, holder);
			arrayToJSOX.cb = doArrayToJSOX_;
			mapToJSOX.cb = mapToObject_;
			return v;
			function doArrayToJSOX() {
				let v;
				let partial = [];
				let thisNodeNameIndex = path.length;
				for (let i = 0; i < this.length; i += 1) {
					path[thisNodeNameIndex] = i;
					partial[i] = str(i, this) || "null";
				}
				path.length = thisNodeNameIndex;
				encoding.length = thisNodeNameIndex;
				v = partial.length === 0 ? "[]" : gap ? [
					"[\n",
					gap,
					partial.join(",\n" + gap),
					"\n",
					mind,
					"]"
				].join("") : "[" + partial.join(",") + "]";
				return v;
			}
			function mapToObject() {
				let tmp = { tmp: null };
				let out = "{";
				let first = true;
				for (let [key, value] of this) {
					tmp.tmp = value;
					let thisNodeNameIndex = path.length;
					path[thisNodeNameIndex] = key;
					out += (first ? "" : ",") + getIdentifier(key) + ":" + str("tmp", tmp);
					path.length = thisNodeNameIndex;
					first = false;
				}
				out += "}";
				return out;
			}
			function str_(key, holder) {
				let i;
				let k;
				let v;
				let length;
				let partialClass;
				let partial;
				let thisNodeNameIndex = path.length;
				let isValue = true;
				let value = holder[key];
				let isObject = typeof value === "object";
				let c;
				if (isObject && value !== null) {
					if (objectToJSOX) {
						if (!stringifying.find((val) => val === value)) {
							stringifying.push(value);
							encoding[thisNodeNameIndex] = value;
							isValue = false;
							value = objectToJSOX.apply(value, [stringifier]);
							isObject = typeof value === "object";
							stringifying.pop();
							encoding.length = thisNodeNameIndex;
							isObject = typeof value === "object";
						}
					}
				}
				const objType = value !== void 0 && value !== null && Object.getPrototypeOf(value);
				let protoConverter = objType && (localToProtoTypes.get(objType) || toProtoTypes.get(objType) || null);
				let objectConverter = !protoConverter && value !== void 0 && value !== null && (localToObjectTypes.get(Object.keys(value).toString()) || toObjectTypes.get(Object.keys(value).toString()) || null);
				if (typeof rep === "function") {
					isValue = false;
					value = rep.call(holder, key, value);
				}
				let toJSOX = protoConverter && protoConverter.cb || objectConverter && objectConverter.cb;
				if (value !== void 0 && value !== null && typeof value === "object" && typeof toJSOX === "function") {
					if (!stringifying.find((val) => val === value)) {
						if (typeof value === "object") {
							v = getReference(value);
							if (v) return v;
						}
						stringifying.push(value);
						encoding[thisNodeNameIndex] = value;
						value = toJSOX.call(value, stringifier);
						isValue = false;
						stringifying.pop();
						if (protoConverter && protoConverter.name) {
							if ("string" === typeof value && value[0] !== "-" && (value[0] < "0" || value[0] > "9") && value[0] !== "\"" && value[0] !== "'" && value[0] !== "`" && value[0] !== "[" && value[0] !== "{") value = " " + value;
						}
						encoding.length = thisNodeNameIndex;
					} else v = getReference(value);
				} else if (typeof value === "object") {
					v = getReference(value);
					if (v) return v;
				}
				switch (typeof value) {
					case "bigint": return value + "n";
					case "string": {
						value = isValue ? getIdentifier(value) : value;
						let c = "";
						if (key === "") c = classes.map((cls) => cls.name + "{" + cls.fields.join(",") + "}").join(gap ? "\n" : "") + commonClasses.map((cls) => cls.name + "{" + cls.fields.join(",") + "}").join(gap ? "\n" : "") + (gap ? "\n" : "");
						if (protoConverter && protoConverter.external) return c + protoConverter.name + value;
						if (objectConverter && objectConverter.external) return c + objectConverter.name + value;
						return c + value;
					}
					case "number":
					case "boolean":
					case "null": return String(value);
					case "object":
						if (v) return v;
						if (!value) return "null";
						gap += indent;
						partialClass = null;
						partial = [];
						if (rep && typeof rep === "object") {
							length = rep.length;
							partialClass = matchObject(value, rep);
							for (i = 0; i < length; i += 1) if (typeof rep[i] === "string") {
								k = rep[i];
								path[thisNodeNameIndex] = k;
								v = str(k, value);
								if (v !== void 0) {
									if (partialClass) partial.push(v);
									else partial.push(getIdentifier(k) + (gap ? ": " : ":") + v);
								}
							}
							path.splice(thisNodeNameIndex, 1);
						} else {
							partialClass = matchObject(value);
							let keys = [];
							for (k in value) {
								if (ignoreNonEnumerable) {
									if (!Object.prototype.propertyIsEnumerable.call(value, k)) continue;
								}
								if (Object.prototype.hasOwnProperty.call(value, k)) {
									if (!sortFields && !partialClass) {
										keys.push(k);
										continue;
									}
									let n = 0;
									for (; n < keys.length; n++) if (keys[n] > k) {
										keys.splice(n, 0, k);
										break;
									}
									if (n == keys.length) keys.push(k);
								}
							}
							for (let n = 0; n < keys.length; n++) {
								k = keys[n];
								if (Object.prototype.hasOwnProperty.call(value, k)) {
									path[thisNodeNameIndex] = k;
									v = str(k, value);
									if (v !== void 0) {
										if (partialClass) partial.push(v);
										else partial.push(getIdentifier(k) + (gap ? ": " : ":") + v);
									}
								}
							}
							path.splice(thisNodeNameIndex, 1);
						}
						if (key === "") c = (classes.map((cls) => cls.name + "{" + cls.fields.join(",") + "}").join(gap ? "\n" : "") || commonClasses.map((cls) => cls.name + "{" + cls.fields.join(",") + "}").join(gap ? "\n" : "")) + (gap ? "\n" : "");
						else c = "";
						if (protoConverter && protoConverter.external) c = c + getIdentifier(protoConverter.name);
						let ident = null;
						if (partialClass) ident = getIdentifier(partialClass.name);
						v = c + (partial.length === 0 ? "{}" : gap ? (partialClass ? ident : "") + "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : (partialClass ? ident : "") + "{" + partial.join(",") + "}");
						gap = mind;
						return v;
				}
			}
		}
	}
};
var encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$_";
var decodings = {
	"~": -1,
	"=": -1,
	"$": 62,
	"_": 63,
	"+": 62,
	"-": 62,
	".": 62,
	"/": 63,
	",": 63
};
for (let x = 0; x < 64; x++) decodings[encodings[x]] = x;
Object.freeze(decodings);
function base64ArrayBuffer(arrayBuffer) {
	let base64 = "";
	let bytes = new Uint8Array(arrayBuffer);
	let byteLength = bytes.byteLength;
	let byteRemainder = byteLength % 3;
	let mainLength = byteLength - byteRemainder;
	let a, b, c, d;
	let chunk;
	for (let i = 0; i < mainLength; i = i + 3) {
		chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
		a = (chunk & 16515072) >> 18;
		b = (chunk & 258048) >> 12;
		c = (chunk & 4032) >> 6;
		d = chunk & 63;
		base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
	}
	if (byteRemainder == 1) {
		chunk = bytes[mainLength];
		a = (chunk & 252) >> 2;
		b = (chunk & 3) << 4;
		base64 += encodings[a] + encodings[b] + "==";
	} else if (byteRemainder == 2) {
		chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];
		a = (chunk & 64512) >> 10;
		b = (chunk & 1008) >> 4;
		c = (chunk & 15) << 2;
		base64 += encodings[a] + encodings[b] + encodings[c] + "=";
	}
	return base64;
}
function DecodeBase64(buf) {
	let outsize;
	if (buf.length % 4 == 1) outsize = ((buf.length + 3) / 4 | 0) * 3 - 3;
	else if (buf.length % 4 == 2) outsize = ((buf.length + 3) / 4 | 0) * 3 - 2;
	else if (buf.length % 4 == 3) outsize = ((buf.length + 3) / 4 | 0) * 3 - 1;
	else if (decodings[buf[buf.length - 3]] == -1) outsize = ((buf.length + 3) / 4 | 0) * 3 - 3;
	else if (decodings[buf[buf.length - 2]] == -1) outsize = ((buf.length + 3) / 4 | 0) * 3 - 2;
	else if (decodings[buf[buf.length - 1]] == -1) outsize = ((buf.length + 3) / 4 | 0) * 3 - 1;
	else outsize = ((buf.length + 3) / 4 | 0) * 3;
	let ab = new ArrayBuffer(outsize);
	let out = new Uint8Array(ab);
	let n;
	let l = buf.length + 3 >> 2;
	for (n = 0; n < l; n++) {
		let index0 = decodings[buf[n * 4]];
		let index1 = n * 4 + 1 < buf.length ? decodings[buf[n * 4 + 1]] : -1;
		let index2 = index1 >= 0 && n * 4 + 2 < buf.length ? decodings[buf[n * 4 + 2]] : -1;
		let index3 = index2 >= 0 && n * 4 + 3 < buf.length ? decodings[buf[n * 4 + 3]] : -1;
		if (index1 >= 0) out[n * 3 + 0] = index0 << 2 | index1 >> 4;
		if (index2 >= 0) out[n * 3 + 1] = index1 << 4 | index2 >> 2 & 15;
		if (index3 >= 0) out[n * 3 + 2] = index2 << 6 | index3 & 63;
	}
	return ab;
}
/**
* @param {unknown} object
* @param {((this: unknown, key: string, value: unknown)=>any)|string[]|{replacer?:(this: unknown, key: string, value: unknown)=>any,pretty?:string|number,space?:string|number,sort?:boolean,quote?:string}} [replacer]
*        a replacer function, a field-name array, or an options object; the options
*        object may carry `pretty`/`space` (indent), `sort` (false emits fields in
*        insertion order) and `quote` (the quote to prefer, default `"`), each
*        applying only to this call.
* @param {string | number} [space]
* @returns {string}
*/
JSOX.stringify = function(object, replacer, space) {
	return JSOX.stringifier().stringify(object, replacer, space);
};
[[
	0,
	256,
	[
		16767487,
		16739071,
		130048,
		3670016,
		0,
		16777208,
		16777215,
		8388607
	]
]].map((row) => {
	return {
		firstChar: row[0],
		lastChar: row[1],
		bits: row[2]
	};
});
//#endregion
export { JSOX as t };
