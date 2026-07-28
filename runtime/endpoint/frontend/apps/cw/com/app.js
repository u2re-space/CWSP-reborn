import { n as __exportAll } from "../chunks/rolldown-runtime.js";
import { A as addEventsList, B as setChecked, E as MOCElement, F as isElement, I as isValidParent$1, M as createElementVanilla, P as indexOf, a as handleStyleChange, b as observeBySelector, c as reflectMixins, d as getAdoptedStyleRule, i as handleProperty, j as containsOrSelf, l as reflectStores, n as handleDataset, r as handleHidden, t as handleAttribute, u as reflectBehaviors, v as observeAttribute, y as observeAttributeBySelector } from "../fest/dom.js";
import { A as hasValue, C as $set, D as deref, E as canBeInteger, I as isObservable, L as isPrimitive, S as $getValue, T as camelToKebab, U as toRef, b as isNotEqual, f as addToCallChain, h as $affected, i as iterated, k as handleListeners, m as unwrap, n as affected, t as DoubleWeakMap } from "../fest/object.js";
//#region ../../modules/projects/lur.e/src/lure/core/Binding.ts
var elMap$1 = new DoubleWeakMap();
var alives = new FinalizationRegistry((unsub) => unsub?.());
var $mapped = Symbol.for("@mapped");
var $virtual = Symbol.for("@virtual");
var $behavior = Symbol.for("@behavior");
var isLinkerLike = (value) => {
	return !!value && typeof value == "object" && "ref" in value && typeof value?.unbind == "function";
};
var bindCtrl = (element, ctrlCb) => {
	if (isLinkerLike(ctrlCb)) {
		ctrlCb.bind?.();
		const unsub = () => ctrlCb.unbind?.();
		addToCallChain(element, Symbol.dispose, unsub);
		return unsub;
	}
	const hdl = {
		click: ctrlCb,
		input: ctrlCb,
		change: ctrlCb
	};
	ctrlCb?.({ target: element });
	const unsub = handleListeners?.(element, "addEventListener", hdl);
	addToCallChain(element, Symbol.dispose, unsub);
	return unsub;
};
var reflectControllers = (element, ctrls) => {
	if (ctrls) for (let ctrl of ctrls) bindCtrl(element, ctrl);
	return element;
};
var $observeInput = (element, ref, prop = "value") => {
	const wel = toRef(element);
	const rf = toRef(ref);
	const ctrlCb = (_ev) => {
		$set(rf, "value", deref(wel)?.[prop ?? "value"] ?? $getValue(deref(rf)));
	};
	const hdl = {
		click: ctrlCb,
		input: ctrlCb,
		change: ctrlCb
	};
	ctrlCb?.({ target: element });
	handleListeners?.(element, "addEventListener", hdl);
	$set(rf, "value", element?.[prop ?? "value"] ?? $getValue(deref(ref)));
	return () => handleListeners?.(element, "removeEventListener", hdl);
};
var $observeAttribute = (el, ref, prop = "") => {
	toRef(el);
	const wv = toRef(ref);
	const attrName = camelToKebab(prop);
	const cb = (mutation) => {
		if (mutation.type == "attributes" && mutation.attributeName == attrName) {
			const value = mutation?.target?.getAttribute?.(mutation.attributeName);
			const valRef = deref(wv), reVal = $getValue(valRef);
			if (isNotEqual(mutation.oldValue, value) && valRef != null && (typeof valRef == "object" || typeof valRef == "function")) {
				if (isNotEqual(reVal, value) || reVal == null) $set(valRef, "value", value);
			}
		}
	};
	return observeAttribute(el, attrName, cb);
};
var removeFromBank = (el, handler, prop) => {
	const bank = elMap$1.get([el, handler]);
	if (bank) {
		const old = bank[prop]?.[1];
		delete bank[prop];
		old?.();
	}
};
var addToBank = (el, handler, prop, forLink) => {
	const bank = elMap$1.getOrInsertComputed([el, handler], () => ({}));
	bank?.[prop]?.[1]?.();
	bank[prop] = forLink;
	return true;
};
var bindHandler = (element, value, prop, handler, set, withObserver) => {
	const linker = isLinkerLike(value) ? value : null;
	if (linker) {
		linker.bind?.();
		value = linker.ref;
	}
	const wel = toRef(element);
	element = deref(wel);
	if (!element || !(element instanceof Node || element?.element instanceof Node)) return;
	let controller = void 0;
	if (controller) controller?.abort?.();
	controller = new AbortController();
	const wv = toRef(value);
	handler?.(element, prop, value);
	const un = affected?.([value, "value"], (curr, _p, old) => {
		const valueRef = deref(wv);
		const setRef = deref(set);
		const elementRef = deref(wel);
		const v = $getValue(valueRef) ?? $getValue(curr);
		if (!setRef || setRef?.[prop] == valueRef) if (typeof valueRef?.[$behavior] == "function") valueRef?.[$behavior]?.((_val = curr) => handler(elementRef, prop, v), [
			curr,
			prop,
			old
		], [
			controller?.signal,
			prop,
			wel
		]);
		else handler(elementRef, prop, v);
	});
	let obs = null;
	if (typeof withObserver == "boolean" && withObserver) {
		if (handler == handleAttribute) obs = $observeAttribute(element, value, prop);
		if (handler == handleProperty) obs = $observeInput(element, value, prop);
	}
	if (typeof withObserver == "function") obs = withObserver(element, prop, value);
	const unsub = () => {
		obs?.disconnect?.();
		obs != null && typeof obs == "function" && obs?.();
		linker?.unbind?.();
		un?.();
		controller?.abort?.();
		removeFromBank?.(element, handler, prop);
	};
	addToCallChain(value, Symbol.dispose, unsub);
	alives.register(element, unsub);
	if (!addToBank(element, handler, prop, [value, unsub])) return unsub;
};
var bindWith = (el, prop, value, handler, set, withObserver) => {
	handler(el, prop, isLinkerLike(value) ? value.ref : value);
	return bindHandler(el, value, prop, handler, set, withObserver);
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/misc/Styles.ts
var styleTemplateId = 0;
var CSS_DIMENSION_UNITS = /* @__PURE__ */ new Set([
	"%",
	"px",
	"cm",
	"mm",
	"q",
	"in",
	"pc",
	"pt",
	"em",
	"ex",
	"ch",
	"cap",
	"ic",
	"lh",
	"rem",
	"rex",
	"rch",
	"rcap",
	"ric",
	"rlh",
	"vw",
	"vh",
	"vi",
	"vb",
	"vmin",
	"vmax",
	"svw",
	"svh",
	"svi",
	"svb",
	"svmin",
	"svmax",
	"lvw",
	"lvh",
	"lvi",
	"lvb",
	"lvmin",
	"lvmax",
	"dvw",
	"dvh",
	"dvi",
	"dvb",
	"dvmin",
	"dvmax",
	"cqw",
	"cqh",
	"cqi",
	"cqb",
	"cqmin",
	"cqmax",
	"deg",
	"grad",
	"rad",
	"turn",
	"s",
	"ms",
	"hz",
	"khz",
	"dpi",
	"dpcm",
	"dppx",
	"x",
	"fr"
]);
/**
* True when there is no declaration with a non-empty value.
*/
var isEffectivelyEmptyStyleText = (cssText) => {
	const source = typeof cssText === "string" ? cssText.trim() : "";
	if (!source) return true;
	for (const chunk of source.split(";")) {
		const declaration = chunk.trim();
		if (!declaration) continue;
		const colonIndex = declaration.indexOf(":");
		if (colonIndex < 0) return false;
		if (declaration.slice(colonIndex + 1).trim().length > 0) return false;
	}
	return true;
};
/**
* Removes a useless style attribute left by empty interpolation.
*/
var pruneEmptyStyleAttribute = (element) => {
	if (element == null) return;
	const raw = element.getAttribute("style");
	if (raw == null) return;
	if (isEffectivelyEmptyStyleText(raw)) {
		element.style.cssText = "";
		element.removeAttribute("style");
	}
};
/**
* Sets inline CSS or removes the style attribute when it is empty.
*/
var applyNormalizedInlineStyle = (element, cssText) => {
	if (isEffectivelyEmptyStyleText(cssText)) {
		element.style.cssText = "";
		element.removeAttribute("style");
		return;
	}
	element.style.cssText = cssText;
};
/**
* Detects CSSUnitValue, CSSMathValue and other CSSStyleValue
* descendants, including values created in another Window.
*/
var isNativeCSSStyleValue = (value) => {
	if (value == null || typeof value !== "object") return false;
	try {
		const CSSStyleValueCtor = globalThis.CSSStyleValue;
		if (typeof CSSStyleValueCtor === "function" && value instanceof CSSStyleValueCtor) return true;
		for (let prototype = value; prototype; prototype = Object.getPrototypeOf(prototype)) if (prototype?.constructor?.name === "CSSStyleValue") return true;
	} catch {}
	return false;
};
/**
* Detects the existing reactive `{ value: ... }` contract.
*
* Native CSSStyleValue must be checked first because CSSUnitValue
* also contains a `value` property.
*/
var isReactiveStyleValue = (value) => {
	if (value == null || typeof value !== "object" || isNativeCSSStyleValue(value)) return false;
	try {
		return "value" in value;
	} catch {
		return false;
	}
};
var isStaticStyleInterpolation = (value) => {
	return value == null || typeof value !== "object" && typeof value !== "function";
};
var escapeRegExp = (value) => {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
var containsMarker = (cssValue, marker) => {
	return new RegExp(`var\\(\\s*${escapeRegExp(marker)}\\s*\\)`).test(cssValue);
};
var readAttachedCSSUnit = (text) => {
	const match = /^(%|[a-zA-Z]+)/.exec(text);
	if (!match) return null;
	const authored = match[0];
	const normalized = authored.toLowerCase();
	if (!CSS_DIMENSION_UNITS.has(normalized)) return null;
	return {
		authored,
		normalized,
		length: authored.length
	};
};
var getCSSUnitFactoryName = (unit) => {
	switch (unit.toLowerCase()) {
		case "%": return "percent";
		case "q": return "Q";
		case "hz": return "Hz";
		case "khz": return "kHz";
		case "fr": return "flex";
		default: return unit.toLowerCase();
	}
};
var getCSSUnitConstructorName = (unit) => {
	switch (unit.toLowerCase()) {
		case "%": return "percent";
		default: return unit.toLowerCase();
	}
};
var getWindowConstructor = (win, name) => {
	return win?.[name] ?? globalThis?.[name];
};
/**
* Creates CSS.px(value), CSS.deg(value), CSS.number(value), etc.
*/
var createTypedUnitValue = (win, unit, value) => {
	const CSSNamespace = win?.CSS;
	const factoryName = getCSSUnitFactoryName(unit);
	const factory = CSSNamespace?.[factoryName];
	if (typeof factory === "function") return factory.call(CSSNamespace, value);
	const CSSUnitValueCtor = getWindowConstructor(win, "CSSUnitValue");
	if (typeof CSSUnitValueCtor !== "function") throw new TypeError(`Typed OM does not support CSS unit "${unit}"`);
	return new CSSUnitValueCtor(value, getCSSUnitConstructorName(unit));
};
var readReactiveNumber = (slot) => {
	const current = slot.value?.value;
	const number = typeof current === "number" ? current : Number(current);
	if (!Number.isFinite(number)) throw new TypeError(`Reactive CSS value "${String(current)}" is not finite`);
	return number;
};
var getReactiveInitialNumber = (value) => {
	const number = Number(value?.value);
	return Number.isFinite(number) ? number : 0;
};
var replaceTypedMarkers = (cssValue, slots) => {
	let result = cssValue;
	for (const slot of slots) result = result.replace(new RegExp(`var\\(\\s*${escapeRegExp(slot.marker)}\\s*\\)`, "g"), String(slot.value));
	return result;
};
var isDirectSlotValue = (cssValue, marker) => {
	const escapedMarker = escapeRegExp(marker);
	return new RegExp(`^var\\(\\s*${escapedMarker}\\s*\\)$`).test(cssValue.trim());
};
var isDirectSlotUnitProduct = (cssValue, marker, unit) => {
	if (!unit) return false;
	const escapedMarker = escapeRegExp(marker);
	const escapedUnit = escapeRegExp(unit);
	return new RegExp(`^calc\\(\\s*var\\(\\s*${escapedMarker}\\s*\\)\\s*\\*\\s*1${escapedUnit}\\s*\\)$`, "i").test(cssValue.trim());
};
var setParsedTypedValue = (styleMap, CSSStyleValueCtor, property, cssValue) => {
	if (typeof CSSStyleValueCtor?.parseAll === "function") {
		const values = CSSStyleValueCtor.parseAll(property, cssValue);
		styleMap.set(property, ...values);
		return;
	}
	if (typeof CSSStyleValueCtor?.parse === "function") {
		styleMap.set(property, CSSStyleValueCtor.parse(property, cssValue));
		return;
	}
	styleMap.set(property, cssValue);
};
var tokenizeNumericCSS = (source) => {
	const tokens = [];
	let cursor = 0;
	while (cursor < source.length) {
		const rest = source.slice(cursor);
		const whitespace = /^\s+/.exec(rest);
		if (whitespace) {
			cursor += whitespace[0].length;
			continue;
		}
		const variable = /^var\(\s*(--[a-zA-Z0-9_-]+)\s*\)/.exec(rest);
		if (variable) {
			tokens.push({
				kind: "variable",
				marker: variable[1]
			});
			cursor += variable[0].length;
			continue;
		}
		const number = /^(?:\d*\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?/.exec(rest);
		if (number) {
			cursor += number[0].length;
			const unitMatch = /^(%|[a-zA-Z]+)/.exec(source.slice(cursor));
			const unit = unitMatch?.[0] ?? null;
			if (unitMatch) cursor += unitMatch[0].length;
			tokens.push({
				kind: "number",
				value: Number(number[0]),
				unit: unit == null ? null : unit.toLowerCase()
			});
			continue;
		}
		const identifier = /^[a-zA-Z_][a-zA-Z0-9_-]*/.exec(rest);
		if (identifier) {
			tokens.push({
				kind: "identifier",
				value: identifier[0].toLowerCase()
			});
			cursor += identifier[0].length;
			continue;
		}
		const symbol = rest[0];
		if (symbol === "+" || symbol === "-" || symbol === "*" || symbol === "/" || symbol === "(" || symbol === ")" || symbol === ",") {
			tokens.push({
				kind: "symbol",
				value: symbol
			});
			cursor++;
			continue;
		}
		throw new SyntaxError(`Unsupported Typed OM numeric token near "${rest}"`);
	}
	return tokens;
};
var NumericTypedOMParser = class {
	tokens;
	win;
	reactiveByMarker;
	typedByMarker;
	index = 0;
	leaves = [];
	constructor(tokens, win, reactiveByMarker, typedByMarker) {
		this.tokens = tokens;
		this.win = win;
		this.reactiveByMarker = reactiveByMarker;
		this.typedByMarker = typedByMarker;
	}
	parse() {
		const root = this.parseSum();
		if (this.index !== this.tokens.length) throw new SyntaxError("Unexpected trailing Typed OM expression");
		return {
			root,
			leaves: this.leaves
		};
	}
	current() {
		return this.tokens[this.index];
	}
	consume() {
		const token = this.tokens[this.index];
		if (!token) throw new SyntaxError("Unexpected end of Typed OM expression");
		this.index++;
		return token;
	}
	consumeSymbol(symbol) {
		const token = this.consume();
		if (token.kind !== "symbol" || token.value !== symbol) throw new SyntaxError(`Expected "${symbol}"`);
	}
	matchesSymbol(symbol) {
		const token = this.current();
		return token?.kind === "symbol" && token.value === symbol;
	}
	createMath(name, ...values) {
		const Constructor = getWindowConstructor(this.win, name);
		if (typeof Constructor !== "function") throw new TypeError(`${name} is not supported`);
		return new Constructor(...values);
	}
	parseSum() {
		let value = this.parseProduct();
		while (this.matchesSymbol("+") || this.matchesSymbol("-")) {
			const operator = this.consume();
			const right = this.parseProduct();
			if (operator.kind !== "symbol") throw new SyntaxError("Expected a sum operator");
			if (operator.value === "+") value = this.createMath("CSSMathSum", value, right);
			else value = this.createMath("CSSMathSum", value, this.createMath("CSSMathNegate", right));
		}
		return value;
	}
	parseProduct() {
		let value = this.parseUnary();
		while (this.matchesSymbol("*") || this.matchesSymbol("/")) {
			const operator = this.consume();
			const right = this.parseUnary();
			if (operator.kind !== "symbol") throw new SyntaxError("Expected a product operator");
			if (operator.value === "*") value = this.createMath("CSSMathProduct", value, right);
			else value = this.createMath("CSSMathProduct", value, this.createMath("CSSMathInvert", right));
		}
		return value;
	}
	parseUnary() {
		if (this.matchesSymbol("+")) {
			this.consume();
			return this.parseUnary();
		}
		if (this.matchesSymbol("-")) {
			this.consume();
			return this.createMath("CSSMathNegate", this.parseUnary());
		}
		return this.parsePrimary();
	}
	parsePrimary() {
		const token = this.consume();
		if (token.kind === "number") return createTypedUnitValue(this.win, token.unit ?? "number", token.value);
		if (token.kind === "variable") {
			const reactive = this.reactiveByMarker.get(token.marker);
			if (reactive) {
				if (this.matchesSymbol("*")) {
					const checkpoint = this.index;
					this.consume();
					const rhs = this.current();
					if (rhs?.kind === "number" && rhs.value === 1 && typeof rhs.unit === "string" && (!reactive.multipliedByUnit || reactive.multipliedByUnit === rhs.unit.toLowerCase())) {
						this.consume();
						const leaf = createTypedUnitValue(this.win, rhs.unit.toLowerCase(), readReactiveNumber(reactive));
						this.leaves.push({
							slot: reactive,
							value: leaf
						});
						return leaf;
					}
					this.index = checkpoint;
				}
				const leaf = createTypedUnitValue(this.win, "number", readReactiveNumber(reactive));
				this.leaves.push({
					slot: reactive,
					value: leaf
				});
				return leaf;
			}
			const typed = this.typedByMarker.get(token.marker);
			if (typed) return typed.value;
			throw new SyntaxError(`Unknown style slot "${token.marker}"`);
		}
		if (token.kind === "symbol" && token.value === "(") {
			const value = this.parseSum();
			this.consumeSymbol(")");
			return value;
		}
		if (token.kind === "identifier") return this.parseFunction(token.value);
		throw new SyntaxError("Expected a Typed OM numeric value");
	}
	parseFunction(name) {
		this.consumeSymbol("(");
		if (name === "calc") {
			const value = this.parseSum();
			this.consumeSymbol(")");
			return value;
		}
		const values = [];
		if (!this.matchesSymbol(")")) {
			values.push(this.parseSum());
			while (this.matchesSymbol(",")) {
				this.consume();
				values.push(this.parseSum());
			}
		}
		this.consumeSymbol(")");
		if (name === "min") {
			if (values.length === 0) throw new SyntaxError("min() requires a value");
			return this.createMath("CSSMathMin", ...values);
		}
		if (name === "max") {
			if (values.length === 0) throw new SyntaxError("max() requires a value");
			return this.createMath("CSSMathMax", ...values);
		}
		if (name === "clamp") {
			if (values.length !== 3) throw new SyntaxError("clamp() requires three values");
			return this.createMath("CSSMathClamp", values[0], values[1], values[2]);
		}
		throw new SyntaxError(`Unsupported Typed OM function "${name}"`);
	}
};
var buildNumericTypedOMTree = (cssValue, win, reactiveSlots, typedSlots) => {
	const reactiveByMarker = /* @__PURE__ */ new Map();
	const typedByMarker = /* @__PURE__ */ new Map();
	for (const slot of reactiveSlots) reactiveByMarker.set(slot.marker, slot);
	for (const slot of typedSlots) typedByMarker.set(slot.marker, slot);
	return new NumericTypedOMParser(tokenizeNumericCSS(cssValue), win, reactiveByMarker, typedByMarker).parse();
};
var isTransformStyleProperty = (property) => {
	return property.trim().toLowerCase() === "transform";
};
/**
* Builds CSSTransformValue from a transform list such as
* `translate(calc(var(--fest-ref-0) * 1px), calc(var(--fest-ref-1) * 1px))`.
*
* INVARIANT: reactive `${ref}px` args become mutable CSS.px leaves (via the
* numeric parser collapse), not leftover --fest-ref custom properties.
*/
var buildTransformTypedOMTree = (cssValue, win, reactiveSlots, typedSlots) => {
	const tokens = tokenizeNumericCSS(cssValue);
	const leaves = [];
	const components = [];
	const reactiveByMarker = /* @__PURE__ */ new Map();
	const typedByMarker = /* @__PURE__ */ new Map();
	for (const slot of reactiveSlots) reactiveByMarker.set(slot.marker, slot);
	for (const slot of typedSlots) typedByMarker.set(slot.marker, slot);
	const zeroPx = () => createTypedUnitValue(win, "px", 0);
	const oneNumber = () => createTypedUnitValue(win, "number", 1);
	let index = 0;
	const current = () => tokens[index];
	const consume = () => {
		const token = tokens[index];
		if (!token) throw new SyntaxError("Unexpected end of transform expression");
		index++;
		return token;
	};
	const consumeSymbol = (symbol) => {
		const token = consume();
		if (token.kind !== "symbol" || token.value !== symbol) throw new SyntaxError(`Expected "${symbol}"`);
	};
	const parseArgument = () => {
		const start = index;
		let depth = 0;
		while (index < tokens.length) {
			const token = tokens[index];
			if (token.kind === "symbol" && token.value === "(") {
				depth++;
				index++;
				continue;
			}
			if (token.kind === "symbol" && token.value === ")") {
				if (depth === 0) break;
				depth--;
				index++;
				continue;
			}
			if (token.kind === "symbol" && token.value === "," && depth === 0) break;
			index++;
		}
		const slice = tokens.slice(start, index);
		if (slice.length === 0) throw new SyntaxError("Empty transform function argument");
		const tree = new NumericTypedOMParser(slice, win, reactiveByMarker, typedByMarker).parse();
		leaves.push(...tree.leaves);
		return tree.root;
	};
	const parseArgumentList = () => {
		const args = [];
		consumeSymbol("(");
		if (!(current()?.kind === "symbol" && current()?.value === ")")) {
			args.push(parseArgument());
			while (current()?.kind === "symbol" && current()?.value === ",") {
				consume();
				args.push(parseArgument());
			}
		}
		consumeSymbol(")");
		return args;
	};
	const createComponent = (name, args) => {
		const ctor = (className) => {
			const Ctor = getWindowConstructor(win, className);
			if (typeof Ctor !== "function") throw new TypeError(`${className} is not supported`);
			return Ctor;
		};
		switch (name) {
			case "translate": {
				const Translate = ctor("CSSTranslate");
				if (args.length === 1) return new Translate(args[0], zeroPx());
				if (args.length === 2) return new Translate(args[0], args[1]);
				if (args.length === 3) return new Translate(args[0], args[1], args[2]);
				throw new SyntaxError("translate() expects 1..3 args");
			}
			case "translatex": return new (ctor("CSSTranslate"))(args[0], zeroPx());
			case "translatey": return new (ctor("CSSTranslate"))(zeroPx(), args[0]);
			case "translatez": return new (ctor("CSSTranslate"))(zeroPx(), zeroPx(), args[0]);
			case "translate3d":
				if (args.length !== 3) throw new SyntaxError("translate3d() expects 3 args");
				return new (ctor("CSSTranslate"))(args[0], args[1], args[2]);
			case "scale": {
				const Scale = ctor("CSSScale");
				if (args.length === 1) return new Scale(args[0], args[0]);
				if (args.length === 2) return new Scale(args[0], args[1]);
				if (args.length === 3) return new Scale(args[0], args[1], args[2]);
				throw new SyntaxError("scale() expects 1..3 args");
			}
			case "scalex": return new (ctor("CSSScale"))(args[0], oneNumber());
			case "scaley": return new (ctor("CSSScale"))(oneNumber(), args[0]);
			case "scalez": return new (ctor("CSSScale"))(oneNumber(), oneNumber(), args[0]);
			case "scale3d":
				if (args.length !== 3) throw new SyntaxError("scale3d() expects 3 args");
				return new (ctor("CSSScale"))(args[0], args[1], args[2]);
			case "rotate": {
				const Rotate = ctor("CSSRotate");
				if (args.length === 1) return new Rotate(args[0]);
				if (args.length === 4) return new Rotate(args[0], args[1], args[2], args[3]);
				throw new SyntaxError("rotate() expects 1 or 4 args");
			}
			case "rotatex": return new (ctor("CSSRotate"))(oneNumber(), createTypedUnitValue(win, "number", 0), createTypedUnitValue(win, "number", 0), args[0]);
			case "rotatey": return new (ctor("CSSRotate"))(createTypedUnitValue(win, "number", 0), oneNumber(), createTypedUnitValue(win, "number", 0), args[0]);
			case "rotatez": return new (ctor("CSSRotate"))(createTypedUnitValue(win, "number", 0), createTypedUnitValue(win, "number", 0), oneNumber(), args[0]);
			case "rotate3d":
				if (args.length !== 4) throw new SyntaxError("rotate3d() expects 4 args");
				return new (ctor("CSSRotate"))(args[0], args[1], args[2], args[3]);
			case "skew": {
				const Skew = ctor("CSSSkew");
				if (args.length === 1) return new Skew(args[0], createTypedUnitValue(win, "deg", 0));
				if (args.length === 2) return new Skew(args[0], args[1]);
				throw new SyntaxError("skew() expects 1..2 args");
			}
			case "skewx": return new (ctor("CSSSkewX"))(args[0]);
			case "skewy": return new (ctor("CSSSkewY"))(args[0]);
			case "perspective": return new (ctor("CSSPerspective"))(args[0]);
			default: throw new SyntaxError(`Unsupported transform function "${name}"`);
		}
	};
	while (index < tokens.length) {
		const token = consume();
		if (token.kind !== "identifier") throw new SyntaxError("Expected a transform function name");
		const args = parseArgumentList();
		components.push(createComponent(token.value, args));
	}
	if (components.length === 0) throw new SyntaxError("Empty transform list");
	const CSSTransformValueCtor = getWindowConstructor(win, "CSSTransformValue");
	if (typeof CSSTransformValueCtor !== "function") throw new TypeError("CSSTransformValue is not supported");
	return {
		root: new CSSTransformValueCtor(components),
		leaves
	};
};
var buildTypedOMStyleValue = (property, cssValue, win, reactiveSlots, typedSlots) => {
	if (isTransformStyleProperty(property)) return buildTransformTypedOMTree(cssValue, win, reactiveSlots, typedSlots);
	return buildNumericTypedOMTree(cssValue, win, reactiveSlots, typedSlots);
};
var addMutableLeaves = (target, leaves) => {
	for (const leaf of leaves) {
		const current = target.get(leaf.slot.marker);
		if (current) current.push(leaf);
		else target.set(leaf.slot.marker, [leaf]);
	}
};
/**
* Attach declaration identity onto parser leaves so reactive updates can
* re-set attributeStyleMap after mutating CSSUnitValue.value.
*
* WHY: Chromium keeps the live CSSUnitValue identity, but does not refresh
* the style map / serialization until styleMap.set() is called again.
*/
var attachLeafTargets = (leaves, property, root) => {
	return leaves.map((leaf) => ({
		slot: leaf.slot,
		value: leaf.value,
		property,
		root
	}));
};
/**
* Applies a parsed S-template.
*
* Typed OM objects and their mathematical trees are created once.
* Reactive updates mutate existing CSSUnitValue leaves only.
*/
var applyStyleTemplate = (element, cssText, typedSlots, reactiveSlots, variables) => {
	const probe = element.ownerDocument.createElement("span");
	probe.style.cssText = cssText;
	applyNormalizedInlineStyle(element, "");
	const target = element;
	const styleMap = target.attributeStyleMap ?? target.styleMap;
	const win = element.ownerDocument.defaultView ?? globalThis;
	const CSSStyleValueCtor = win?.CSSStyleValue ?? globalThis.CSSStyleValue;
	const mutableLeaves = /* @__PURE__ */ new Map();
	const requiredCSSVariables = /* @__PURE__ */ new Set();
	const subscriptions = [];
	for (let index = 0; index < probe.style.length; index++) {
		const property = probe.style.item(index);
		const parsedValue = probe.style.getPropertyValue(property);
		const priority = probe.style.getPropertyPriority(property);
		const usedTypedSlots = typedSlots.filter((slot) => containsMarker(parsedValue, slot.marker));
		const usedReactiveSlots = reactiveSlots.filter((slot) => containsMarker(parsedValue, slot.marker));
		if (usedTypedSlots.length === 0 && usedReactiveSlots.length === 0) {
			element.style.setProperty(property, parsedValue, priority);
			continue;
		}
		const canUseTypedOM = styleMap?.set && !priority && !property.startsWith("--");
		let appliedThroughTypedOM = false;
		if (canUseTypedOM && usedReactiveSlots.length > 0) try {
			const directSlot = usedReactiveSlots.length === 1 && usedTypedSlots.length === 0 ? usedReactiveSlots[0] : null;
			if (directSlot && isDirectSlotUnitProduct(parsedValue, directSlot.marker, directSlot.multipliedByUnit)) {
				const linkedValue = createTypedUnitValue(win, directSlot.multipliedByUnit, readReactiveNumber(directSlot));
				styleMap.set(property, linkedValue);
				addMutableLeaves(mutableLeaves, attachLeafTargets([{
					slot: directSlot,
					value: linkedValue
				}], property, linkedValue));
				appliedThroughTypedOM = true;
			} else if (directSlot && isDirectSlotValue(parsedValue, directSlot.marker)) {
				const linkedValue = createTypedUnitValue(win, "number", readReactiveNumber(directSlot));
				styleMap.set(property, linkedValue);
				addMutableLeaves(mutableLeaves, attachLeafTargets([{
					slot: directSlot,
					value: linkedValue
				}], property, linkedValue));
				appliedThroughTypedOM = true;
			} else {
				const tree = buildTypedOMStyleValue(property, parsedValue, win, usedReactiveSlots, usedTypedSlots);
				styleMap.set(property, tree.root);
				addMutableLeaves(mutableLeaves, attachLeafTargets(tree.leaves, property, tree.root));
				appliedThroughTypedOM = true;
			}
		} catch {}
		if (appliedThroughTypedOM) continue;
		if (canUseTypedOM && usedReactiveSlots.length === 0 && usedTypedSlots.length > 0) try {
			const directSlot = usedTypedSlots.length === 1 ? usedTypedSlots[0] : null;
			if (directSlot && isDirectSlotValue(parsedValue, directSlot.marker)) {
				styleMap.set(property, directSlot.value);
				appliedThroughTypedOM = true;
			} else if (directSlot && isDirectSlotUnitProduct(parsedValue, directSlot.marker, directSlot.multipliedByUnit)) {
				const CSSMathProductCtor = getWindowConstructor(win, "CSSMathProduct");
				if (typeof CSSMathProductCtor !== "function") throw new TypeError("CSSMathProduct is not supported");
				const product = new CSSMathProductCtor(directSlot.value, createTypedUnitValue(win, directSlot.multipliedByUnit, 1));
				styleMap.set(property, product);
				appliedThroughTypedOM = true;
			} else {
				try {
					const tree = buildTypedOMStyleValue(property, parsedValue, win, [], usedTypedSlots);
					styleMap.set(property, tree.root);
				} catch {
					setParsedTypedValue(styleMap, CSSStyleValueCtor, property, replaceTypedMarkers(parsedValue, usedTypedSlots));
				}
				appliedThroughTypedOM = true;
			}
		} catch {}
		if (appliedThroughTypedOM) continue;
		const reconstructed = replaceTypedMarkers(parsedValue, usedTypedSlots);
		element.style.setProperty(property, reconstructed, priority);
		for (const slot of usedReactiveSlots) requiredCSSVariables.add(slot.marker);
	}
	for (const slot of reactiveSlots) {
		const leaves = mutableLeaves.get(slot.marker) ?? [];
		const needsCSSVariable = requiredCSSVariables.has(slot.marker);
		if (leaves.length === 0 && !needsCSSVariable) continue;
		const subscription = bindWith(element, slot.marker, slot.value, function(...args) {
			if (leaves.length > 0) try {
				const nextValue = readReactiveNumber(slot);
				const dirtyRoots = /* @__PURE__ */ new Map();
				for (const leaf of leaves) {
					leaf.value.value = nextValue;
					dirtyRoots.set(leaf.property, leaf.root);
				}
				if (styleMap?.set) for (const [propertyName, root] of dirtyRoots) styleMap.set(propertyName, root);
			} catch {}
			if (needsCSSVariable) handleStyleChange.apply(this, args);
		});
		subscriptions.push(subscription);
	}
	for (const name of requiredCSSVariables) {
		if (reactiveSlots.some((slot) => slot.marker === name)) continue;
		const value = variables.get(name);
		if (value == null) continue;
		subscriptions.push(bindWith(element, name, value, handleStyleChange));
	}
	pruneEmptyStyleAttribute(element);
	return () => {
		for (const subscription of subscriptions) subscription?.();
	};
};
/**
* Inline-style tagged template.
*/
var S = (strings, ...values) => {
	const templateId = styleTemplateId++;
	const properties = [];
	const variables = /* @__PURE__ */ new Map();
	const typedSlots = [];
	const reactiveSlots = [];
	const parts = [];
	const consumed = new Array(strings.length).fill(0);
	for (let index = 0; index < strings.length; index++) {
		parts.push(strings[index].slice(consumed[index]));
		if (index >= values.length) continue;
		const value = values[index];
		const attachedUnit = readAttachedCSSUnit(strings[index + 1] ?? "");
		if (isNativeCSSStyleValue(value)) {
			const marker = `--fest-typed-${templateId}-${typedSlots.length}`;
			typedSlots.push({
				marker,
				value,
				multipliedByUnit: attachedUnit?.normalized
			});
			if (attachedUnit) {
				parts.push(`calc(var(${marker}) * 1${attachedUnit.authored})`);
				consumed[index + 1] += attachedUnit.length;
			} else parts.push(`var(${marker})`);
			continue;
		}
		if (isReactiveStyleValue(value)) {
			const marker = `--fest-ref-${templateId}-${reactiveSlots.length}`;
			reactiveSlots.push({
				marker,
				value,
				multipliedByUnit: attachedUnit?.normalized
			});
			if (attachedUnit) {
				parts.push(`calc(var(${marker}) * 1${attachedUnit.authored})`);
				consumed[index + 1] += attachedUnit.length;
			} else parts.push(`var(${marker})`);
			const initialValue = getReactiveInitialNumber(value);
			properties.push(`@property ${marker} { syntax: "<number>"; initial-value: ${initialValue}; inherits: true; };`);
			variables.set(marker, value);
			continue;
		}
		if (typeof value !== "object" && typeof value !== "function" && value != null && String(value).trim() !== "") parts.push(String(value));
	}
	return [
		(element) => {
			return applyStyleTemplate(element, parts.join(""), typedSlots, reactiveSlots, variables);
		},
		properties,
		variables
	];
};
var splitInlineStylePlaceholders = (source, attributes) => {
	const strings = [];
	const values = [];
	const pattern = /#\{(\d+)\}/g;
	let cursor = 0;
	let match;
	while ((match = pattern.exec(source)) != null) {
		const attributeIndex = Number.parseInt(match[1], 10);
		if (!Number.isSafeInteger(attributeIndex) || attributeIndex < 0) continue;
		strings.push(source.slice(cursor, match.index));
		values.push(attributes[attributeIndex]);
		cursor = match.index + match[0].length;
	}
	if (values.length === 0) return null;
	strings.push(source.slice(cursor));
	return {
		strings,
		values
	};
};
var joinStaticInlineStyle = (strings, values) => {
	let result = strings[0] ?? "";
	for (let index = 0; index < values.length; index++) {
		const value = values[index];
		if (value != null) result += String(value);
		result += strings[index + 1] ?? "";
	}
	return result;
};
/**
* Converts an H style attribute containing internal #{n}
* placeholders into static CSS, a direct legacy binding, or S.
*/
var compileInlineStyleAttribute = (source, attributes) => {
	const parsed = splitInlineStylePlaceholders(source, attributes);
	if (!parsed) return null;
	const { strings, values } = parsed;
	if (values.length === 1 && (strings[0] ?? "").trim() === "" && (strings[1] ?? "").trim() === "" && !isStaticStyleInterpolation(values[0]) && !isNativeCSSStyleValue(values[0])) return {
		kind: "direct",
		value: values[0]
	};
	if (values.some((value) => isReactiveStyleValue(value) || isNativeCSSStyleValue(value))) return {
		kind: "template",
		binding: S(strings, ...values)
	};
	if (values.every(isStaticStyleInterpolation)) return {
		kind: "static",
		cssText: joinStaticInlineStyle(strings, values)
	};
	return {
		kind: "template",
		binding: S(strings, ...values)
	};
};
/**
* Applies an S tuple or a standalone S applicator.
*/
var bindStyle = (element, styled) => {
	const apply = Array.isArray(styled) ? styled[0] : styled;
	if (typeof apply !== "function") return () => {};
	const result = apply(element);
	return () => {
		if (typeof result === "function") {
			result();
			return;
		}
		result?.unbind?.();
	};
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/context/ReflectChildren.ts
var makeUpdater = (defaultParent = null, mapper, isArray = true) => {
	const commandBuffer = [];
	const merge = () => {
		commandBuffer?.forEach?.(([fn, args]) => fn?.(...args));
		commandBuffer?.splice?.(0, commandBuffer?.length);
	};
	const updateChildList = (newEl, idx, oldEl, op, boundParent = null) => {
		const $requestor = isValidParent$1(boundParent) ?? isValidParent$1(defaultParent);
		const newNode = getNode(newEl, mapper, idx, $requestor);
		const oldNode = getNode(oldEl, mapper, idx, $requestor);
		let element = isValidParent$1(newNode?.parentElement ?? oldNode?.parentElement) ?? $requestor;
		if (!element) return;
		if (defaultParent != element) defaultParent = element;
		const oldIdx = indexOf(element, oldNode);
		if ([
			"add",
			"set",
			"delete"
		].indexOf(op || "") >= 0 || !op) {
			if (newNode == null && oldNode != null || op == "delete") commandBuffer?.push?.([removeChild, [
				element,
				oldNode,
				null,
				oldIdx >= 0 ? oldIdx : idx
			]]);
			else if (newNode != null && oldNode == null || op == "add") commandBuffer?.push?.([appendChild, [
				element,
				newNode,
				null,
				idx
			]]);
			else if (newNode != null && oldNode != null || op == "set") commandBuffer?.push?.([replaceChildren, [
				element,
				newNode,
				null,
				oldIdx >= 0 ? oldIdx : idx,
				oldNode
			]]);
		}
		if (op && op != "get" && [
			"add",
			"set",
			"delete"
		].indexOf(op) >= 0 || !op && !isArray) merge?.();
	};
	return updateChildList;
};
var asArray$2 = (children) => {
	if (children instanceof Map || children instanceof Set) children = Array.from(children?.values?.());
	return children;
};
var reformChildren = (element, children = [], mapper) => {
	if (!children || !element) return element;
	mapper = (children?.[$mapped] ? children?.mapper : mapper) ?? mapper;
	children = (children?.[$mapped] ? children?.children : children) ?? children;
	const keys = Array.from(children?.keys?.() || []);
	const cvt = asArray$2(children)?.map?.((nd, index) => getNode(nd, mapper, keys?.[index] ?? index, element));
	removeNotExists(element, cvt);
	cvt?.forEach?.((nd) => appendChild(element, nd));
	return element;
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/node/Changeable.ts
var Ch = class {
	#stub = document.createComment("");
	#valueRef;
	#fragments;
	#updater = null;
	#internal = null;
	#updating = false;
	#options = {};
	#oldNode;
	#mapCb = null;
	#T = null;
	#boundParent = null;
	makeUpdater(basisParent = null) {
		if (basisParent) {
			this.#internal?.();
			this.#internal = null;
			this.#updater = null;
			this.#updater ??= makeUpdater(basisParent, null, false);
			this.#internal ??= affected?.([this.#valueRef, "value"], this._onUpdate.bind(this));
		}
	}
	get boundParent() {
		return this.#boundParent;
	}
	set boundParent(value) {
		if (value instanceof HTMLElement && isValidParent$1(value) && value != this.#boundParent) {
			this.#boundParent = value;
			this.makeUpdater(value);
			if (this.#oldNode) {
				this.#oldNode?.parentNode != null && this.#oldNode?.remove?.();
				this.#oldNode = null;
			}
			this.element;
		}
	}
	constructor(valueRef, mapCb = (el) => el, options = null) {
		this.#stub = document.createComment("");
		if (hasValue(mapCb) && (typeof valueRef == "function" || typeof valueRef == "object") && !hasValue(valueRef)) [valueRef, mapCb] = [mapCb, valueRef];
		if (!options && mapCb != null && typeof mapCb == "object" && !hasValue(mapCb)) options = mapCb;
		this.#mapCb = (mapCb != null ? typeof mapCb == "function" ? mapCb : typeof mapCb == "object" ? mapCb?.mapper : null : null) ?? ((el) => el);
		this.#oldNode = null;
		this.#valueRef = (!hasValue(valueRef) ? mapCb?.(valueRef, -1) : valueRef) ?? valueRef;
		this.#fragments = document.createDocumentFragment();
		const $baseOptions = {
			removeNotExistsWhenHasPrimitives: true,
			uniquePrimitives: true,
			preMap: true
		};
		const $newOptions = (isValidParent$1(options) ? null : options) || {};
		this.#options = Object.assign($baseOptions, $newOptions);
		this.boundParent = isValidParent$1(this.#options?.boundParent) ?? isValidParent$1(options) ?? null;
	}
	$getNodeBy(requestor, value) {
		const node = isPrimitive(hasValue(value) ? value?.value : value) ? this.#T ??= T(value) : getNode(value, value == requestor ? null : this.#mapCb, -1, requestor);
		if (this.#T != null && (isPrimitive(value) || hasValue(value))) this.#T.textContent = "" + (value?.value ?? (isPrimitive(value) ? value : ""));
		return node;
	}
	$getNode(requestor, reassignOldNode = true) {
		const node = isPrimitive(this.#valueRef?.value) ? this.#T ??= T(this.#valueRef) : getNode(this.#valueRef?.value, requestor == this.#valueRef?.value ? null : this.#mapCb, -1, requestor);
		if (this.#T != null && (isPrimitive(this.#valueRef) || hasValue(this.#valueRef))) this.#T.textContent = "" + (isPrimitive(this.#valueRef) ? this.#valueRef : this.#valueRef?.value ?? "");
		if (node != null && reassignOldNode) this.#oldNode = node;
		return node;
	}
	get [$mapped]() {
		return true;
	}
	elementForPotentialParent(requestor) {
		Promise.try(() => {
			const element = this.$getNode(requestor);
			if (!element || !requestor || element?.contains?.(requestor) || requestor == element) return;
			if (requestor instanceof HTMLElement && isValidParent$1(requestor)) if (Array.from(requestor?.children).find((node) => node === element)) this.boundParent = requestor;
			else {
				const observer = new MutationObserver((records) => {
					for (const record of records) if (record.type === "childList") {
						if (record.addedNodes.length > 0) {
							if (Array.from(record.addedNodes || []).find((node) => node === element)) {
								this.boundParent = requestor;
								observer.disconnect();
							}
						}
					}
				});
				observer.observe(requestor, { childList: true });
			}
		})?.catch?.(console.warn.bind(console));
		return this.element;
	}
	get self() {
		const existsNode = this.$getNode(this.boundParent) ?? this.#stub;
		const theirParent = isValidParent$1(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
		this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		queueMicrotask(() => {
			const theirParent = isValidParent$1(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
			this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		});
		return theirParent ?? this.boundParent ?? existsNode;
	}
	get element() {
		const children = this.$getNode(this.boundParent) ?? this.#stub;
		const theirParent = isValidParent$1(children?.parentElement) ? children?.parentElement : this.boundParent;
		this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		queueMicrotask(() => {
			const theirParent = isValidParent$1(children?.parentElement) ? children?.parentElement : this.boundParent;
			this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		});
		return children;
	}
	_onUpdate(newVal, idx, oldVal, op) {
		if (isPrimitive(oldVal) && isPrimitive(newVal)) return;
		let oldEl = isPrimitive(oldVal) ? this.#oldNode : this.$getNodeBy(this.boundParent, oldVal);
		let newEl = this.$getNode(this.boundParent, false) ?? this.#stub;
		if (oldEl && !oldEl?.parentNode || this.#oldNode?.parentNode) oldEl = this.#oldNode ?? oldEl;
		let updated = this.#updater?.(newEl, indexOf(this.boundParent, oldEl), oldEl, op, this.boundParent);
		if (newEl != null && newEl != this.#oldNode) this.#oldNode = newEl;
		else if (newEl == null && oldEl != this.#oldNode) this.#oldNode = oldEl;
		return updated;
	}
};
var isWeakCompatible$1 = (key) => {
	return (typeof key == "object" || typeof key == "function" || typeof key == "symbol") && key != null;
};
var C = (observable, mapCb, boundParent = null) => {
	let Te = null;
	if (observable instanceof HTMLElement) return Q(observable);
	if (observable == null) return document.createComment(":NULL:");
	const checkable = (typeof mapCb == "function" ? mapCb(observable, -1) : observable) ?? observable;
	if (isPrimitive(checkable)) return Te ??= T(hasValue(observable) ? observable : checkable);
	if (Te != null && isPrimitive(checkable)) Te.textContent = "" + checkable;
	if (checkable != null && hasValue(checkable) && !mapCb) {
		if (isPrimitive(checkable?.value)) return checkable?.value != null ? Te ??= T(checkable) : document.createComment(":NULL:");
		else if (typeof checkable == "object" || typeof checkable == "function") return elMap.getOrInsertComputed(isWeakCompatible$1(observable) ? observable : checkable, () => {
			return new Ch(observable, mapCb, boundParent);
		});
	}
	return getNode(checkable, null, -1, boundParent);
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/context/Utils.ts
var KIDNAP_WITHOUT_HANG = (el, requestor) => {
	return (requestor && requestor != el && !el?.contains?.(requestor) && isValidParent$1(requestor) ? el?.elementForPotentialParent?.(requestor) : null) ?? el?.element;
};
var isElementValue = (el, requestor) => {
	return KIDNAP_WITHOUT_HANG(el, requestor) ?? (hasValue(el) && isElement(el?.value) ? el?.value : el);
};
var elMap = /* @__PURE__ */ new WeakMap();
var tmMap = /* @__PURE__ */ new WeakMap();
var getMapped = (obj) => {
	if (isPrimitive(obj)) return obj;
	if (hasValue(obj) && isPrimitive(obj?.value)) return tmMap?.get(obj);
	return elMap?.get?.(obj);
};
var $promiseResolvedMap = /* @__PURE__ */ new WeakMap();
var $makePromisePlaceholder = (promised, getNodeCb) => {
	if ($promiseResolvedMap?.has?.(promised)) return $promiseResolvedMap?.get?.(promised);
	const comment = document.createComment(":PROMISE:");
	promised?.then?.((elem) => {
		const element = typeof getNodeCb == "function" ? getNodeCb(elem) : elem;
		$promiseResolvedMap?.set?.(promised, element);
		queueMicrotask(() => {
			try {
				if (typeof comment?.replaceWith == "function") {
					if (!comment?.isConnected) return;
					if (isElement(element)) comment?.replaceWith?.(element);
				} else if (comment?.isConnected && isElement(element)) comment?.parentNode?.replaceChild?.(comment, element);
			} catch (error) {
				if (!comment?.isConnected) return;
				comment?.remove?.();
			}
		});
	});
	return comment;
};
var $getBase = (el, mapper, index = -1, requestor) => {
	if (mapper != null) return el = $getBase(mapper?.(el, index), null, -1, requestor);
	if (el instanceof WeakRef || typeof el?.deref == "function") el = el.deref();
	if (el instanceof Promise || typeof el?.then == "function") return $makePromisePlaceholder(el, (nd) => $getBase(nd, mapper, index, requestor));
	if (isElement(el) && !el?.element) return el;
	else if (isElement(el?.element)) return el;
	else if (hasValue(el)) return (el instanceof HTMLElement ? Q : C)(el);
	else if (typeof el == "object" && el != null) return getMapped(el);
	else if (typeof el == "function") return $getBase(el?.(), mapper, index, requestor);
	if (isPrimitive(el) && el != null) return T(el);
	return document.createComment(":NULL:");
};
var $getLeaf = (el, requestor) => {
	return isElementValue(el, requestor) ?? isElement(el);
};
var $getNode = (el, mapper, index = -1, requestor) => {
	if (mapper != null) return el = getNode(mapper?.(el, index), null, -1, requestor);
	if (el instanceof WeakRef || typeof el?.deref == "function") el = el.deref();
	if (el instanceof Promise || typeof el?.then == "function") return $makePromisePlaceholder(el, (nd) => getNode(nd, mapper, index, requestor));
	if (isElement(el) && !el?.element) return el;
	else if (isElement(el?.element)) return isElementValue(el, requestor);
	else if (hasValue(el)) return (el instanceof HTMLElement ? Q : C)(el)?.element;
	else if (typeof el == "object" && el != null) return getMapped(el);
	else if (typeof el == "function") return getNode(el?.(), mapper, index, requestor);
	else if (isPrimitive(el) && el != null) return T(el);
	return document.createComment(":NULL:");
};
var isWeakCompatible = (el) => {
	return (typeof el == "object" || typeof el == "function" || typeof el == "symbol") && el != null;
};
var __nodeGuard = /* @__PURE__ */ new WeakSet();
var __getNode = (el, mapper, index = -1, requestor) => {
	if (el instanceof WeakRef || typeof el?.deref == "function") el = el.deref();
	if (el instanceof Promise || typeof el?.then == "function") return $makePromisePlaceholder(el, (nd) => __getNode(nd, mapper, index, requestor));
	if (isWeakCompatible(el) && !isElement(el)) {
		if (elMap.has(el)) {
			const obj = getMapped(el) ?? $getBase(el, mapper, index, requestor);
			return $getLeaf(obj instanceof WeakRef ? obj?.deref?.() : obj, requestor);
		}
		const $node = $getBase(el, mapper, index, requestor);
		if (!mapper && $node != null && $node != el && isWeakCompatible(el) && !isElement(el)) elMap.set(el, $node);
		return $getLeaf($node, requestor);
	}
	return $getNode(el, mapper, index, requestor);
};
var getNode = (el, mapper, index = -1, requestor) => {
	if (isWeakCompatible(el) && __nodeGuard.has(el)) return getMapped(el) ?? isElement(el);
	if (isWeakCompatible(el)) __nodeGuard.add(el);
	const result = __getNode(el, mapper, index, requestor);
	if (isWeakCompatible(el)) __nodeGuard.delete(el);
	return result;
};
var appendOrEmplaceByIndex = (parent, child, index = -1) => {
	if (isElement(child) && child != null && child?.parentNode != parent) if (Number.isInteger(index) && index >= 0 && index < parent?.childNodes?.length) parent?.insertBefore?.(child, parent?.childNodes?.[index]);
	else parent?.append?.(child);
};
var appendFix = (parent, child, index = -1) => {
	if (!isElement(child) || parent == child || child?.parentNode == parent) return;
	child = child?._onUpdate ? KIDNAP_WITHOUT_HANG(child, parent) : child;
	if (!child?.parentNode && isElement(child)) {
		appendOrEmplaceByIndex(parent, child, index);
		return;
	}
	if (parent?.parentNode == child?.parentNode) return;
	if (isElement(child)) appendOrEmplaceByIndex(parent, child, index);
};
var asArray$1 = (children) => {
	if (children instanceof Map || children instanceof Set) children = Array.from(children?.values?.());
	return children;
};
var appendArray = (parent, children, mapper, index = -1) => {
	const len = children?.length ?? 0;
	if (Array.isArray(unwrap(children)) || children instanceof Map || children instanceof Set) {
		const list = asArray$1(children)?.map?.((cl, I) => getNode(cl, mapper, I, parent))?.filter?.((el) => el != null);
		const frag = document.createDocumentFragment();
		list?.forEach?.((cl) => appendFix(frag, cl));
		appendFix(parent, frag, index);
	} else {
		const node = getNode(children, mapper, len, parent);
		if (node != null) appendFix(parent, node, index);
	}
};
var appendChild = (element, cp, mapper, index = -1) => {
	if (mapper != null) cp = mapper?.(cp, index);
	if (cp?.children && Array.isArray(unwrap(cp?.children)) && (cp?.[$virtual] || cp?.[$mapped])) appendArray(element, cp?.children, null, index);
	else appendArray(element, cp, null, index);
};
var dePhantomNode = (parent, node, index = -1) => {
	if (!parent) return node;
	if (node?.parentNode == parent && node?.parentNode != null) return node;
	else if (node?.parentNode != parent && !isValidParent$1(node?.parentNode)) {
		if (Number.isInteger(index) && index >= 0 && Array.from(parent?.childNodes || [])?.length > index) return parent.childNodes?.[index];
	}
	return node;
};
var replaceOrSwap = (parent, oldEl, newEl) => {
	if (oldEl?.parentNode) if (oldEl?.parentNode == newEl?.parentNode) {
		parent = oldEl?.parentNode ?? parent;
		if (oldEl.nextSibling === newEl) parent.insertBefore(newEl, oldEl);
		else if (newEl.nextSibling === oldEl) parent.insertBefore(oldEl, newEl);
		else {
			const nextSiblingOfElement1 = oldEl.nextSibling;
			parent.replaceChild(newEl, oldEl);
			parent.insertBefore(oldEl, nextSiblingOfElement1);
		}
	} else oldEl?.replaceWith?.(newEl);
};
var replaceChildren = (element, cp, mapper, index = -1, old) => {
	if (mapper != null) cp = mapper?.(cp, index);
	if (!element) element = old?.parentNode;
	const cn = dePhantomNode(element, getNode(old, mapper, index), index);
	if (cn instanceof Text && typeof cp == "string") cn.textContent = cp;
	else if (cp != null) {
		const node = getNode(cp);
		if (cn?.parentNode == element && cn != node && cn instanceof Text && node instanceof Text) {
			if (cn?.textContent != node?.textContent) cn.textContent = node?.textContent?.trim?.() ?? "";
		} else if (cn?.parentNode == element && cn != node && cn != null && cn?.parentNode != null) replaceOrSwap(element, cn, node);
		else if (cn?.parentNode != element || cn?.parentNode == null) appendChild(element, node, null, index);
	}
};
var removeChild = (element, cp, mapper, index = -1) => {
	const $node = getNode(cp, mapper);
	if (!element) element = $node?.parentNode;
	if (Array.from(element?.childNodes ?? [])?.length < 1) return;
	const whatToRemove = dePhantomNode(element, $node, index);
	if (whatToRemove?.parentNode == element) whatToRemove?.remove?.();
	return element;
};
var removeNotExists = (element, children, mapper) => {
	const list = Array.from(unwrap(children) || [])?.map?.((cp, index) => getNode(cp, mapper, index));
	Array.from(element.childNodes).forEach((nd) => {
		if (!list?.find?.((cp) => !isNotEqual?.(cp, nd))) nd?.remove?.();
	});
	return element;
};
var T = (ref) => {
	if (isPrimitive(ref) && ref != null) return document.createTextNode(ref);
	if (ref == null) return document.createComment(":NULL:");
	return tmMap.getOrInsertComputed(ref, () => {
		const element = document.createTextNode(((hasValue(ref) ? ref?.value : ref) ?? "")?.trim?.() ?? "");
		affected([ref, "value"], (val) => {
			const untrimmed = "" + (val?.innerText ?? val?.textContent ?? val?.value ?? val ?? "");
			element.textContent = untrimmed?.trim?.() ?? "";
		});
		return element;
	});
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/node/Queried.ts
var existsQueries = /* @__PURE__ */ new WeakMap();
var alreadyUsed = /* @__PURE__ */ new WeakMap();
var queryExtensions = {
	logAll(ctx) {
		return () => console.log("attributes:", [...ctx?.attributes].map((x) => ({
			name: x.name,
			value: x.value
		})));
	},
	append(ctx) {
		return (...args) => args?.forEach?.((e) => appendChild(ctx, e, null, -1));
	},
	appendChildren(ctx) {
		return (...args) => args?.forEach?.((e) => appendChild(ctx, e, null, -1));
	},
	removeChildren(ctx) {
		return (...args) => args?.forEach?.((e) => removeChild(ctx, e, null, -1));
	},
	removeChild(ctx) {
		return (e) => removeChild(ctx, e, null, -1);
	},
	replaceChild(ctx) {
		return (e, n) => replaceOrSwap(ctx, e, n);
	},
	remove(ctx) {
		return () => removeChild(ctx?.parentNode, ctx, null, -1);
	},
	replace(ctx) {
		return (newEl) => replaceOrSwap(ctx?.parentNode, ctx, newEl);
	},
	current(ctx) {
		return ctx;
	}
};
var UniversalElementHandler = class {
	direction = "children";
	selector;
	index = 0;
	_eventMap = /* @__PURE__ */ new WeakMap();
	constructor(selector, index = 0, direction = "children") {
		this.index = index;
		this.selector = selector;
		this.direction = direction;
	}
	_observeDOMChange(target, selector, cb) {
		return typeof selector == "string" ? observeBySelector(target, selector, cb) : null;
	}
	_observeAttributes(target, attribute, cb) {
		return typeof this.selector == "string" ? observeAttributeBySelector(target, this.selector, attribute, cb) : observeAttribute(target ?? this.selector, attribute, cb);
	}
	_getArray(target) {
		if (typeof target == "function") target = this.selector || target?.(this.selector);
		if (!this.selector) return [target];
		if (typeof this.selector == "string") {
			const inclusion = typeof target?.matches == "function" && target?.element != null && target?.matches?.(this.selector) ? [target] : [];
			if (this.direction == "children") {
				const list = typeof target?.querySelectorAll == "function" && target?.element != null ? [...target?.querySelectorAll?.(this.selector)] : [];
				return list?.length >= 1 ? [...list] : inclusion;
			} else if (this.direction == "parent") {
				const closest = target?.closest?.(this.selector);
				return closest ? [closest] : inclusion;
			}
			return inclusion;
		}
		return Array.isArray(this.selector) ? this.selector : [this.selector];
	}
	_getSelected(target) {
		const tg = target?.self ?? target;
		const sel = this._selector(target);
		if (typeof sel == "string") {
			if (this.direction == "children") return tg?.matches?.(sel) ? tg : tg?.querySelector?.(sel);
			if (this.direction == "parent") return tg?.matches?.(sel) ? tg : tg?.closest?.(sel);
		}
		return tg == (sel?.element ?? sel) ? sel?.element ?? sel : null;
	}
	_redirectToBubble(eventName) {
		if (typeof this._selector() == "string") return {
			["pointerenter"]: "pointerover",
			["pointerleave"]: "pointerout",
			["mouseenter"]: "mouseover",
			["mouseleave"]: "mouseout",
			["focus"]: "focusin",
			["blur"]: "focusout"
		}[eventName] || eventName;
		return eventName;
	}
	_addEventListener(target, name, cb, option) {
		const selector = this._selector(target);
		if (typeof selector != "string") {
			selector?.addEventListener?.(name, cb, option);
			return cb;
		}
		const eventName = this._redirectToBubble(name);
		const parent = target?.self ?? target;
		const wrap = (ev) => {
			const sel = this._selector(target);
			const rot = ev?.currentTarget ?? parent;
			let tg = null;
			if (ev?.composedPath && typeof ev.composedPath === "function") {
				const path = ev.composedPath();
				for (const node of path) if (node instanceof HTMLElement || node instanceof Element) {
					const nodeEl = node?.element ?? node;
					if (typeof sel == "string") {
						if (MOCElement(nodeEl, sel, ev)) {
							tg = nodeEl;
							break;
						}
					} else if (containsOrSelf(sel, nodeEl, ev)) {
						tg = nodeEl;
						break;
					}
				}
			}
			if (!tg) {
				tg = ev?.target ?? this._getSelected(target) ?? rot;
				tg = tg?.element ?? tg;
			}
			if (typeof sel == "string") {
				if (containsOrSelf(rot, MOCElement(tg, sel, ev), ev)) cb?.call?.(tg, ev);
			} else if (containsOrSelf(rot, sel, ev) && containsOrSelf(sel, tg, ev)) cb?.call?.(tg, ev);
		};
		parent?.addEventListener?.(eventName, wrap, option);
		this._eventMap.getOrInsert(parent, /* @__PURE__ */ new Map()).getOrInsert(eventName, /* @__PURE__ */ new WeakMap()).set(cb, {
			wrap,
			option
		});
		return wrap;
	}
	_removeEventListener(target, name, cb, option) {
		const selector = this._selector(target);
		if (typeof selector != "string") {
			selector?.removeEventListener?.(name, cb, option);
			return cb;
		}
		const parent = target?.self ?? target;
		const eventName = this._redirectToBubble(name), eventMap = this._eventMap.get(parent);
		if (!eventMap) return;
		const cbMap = eventMap.get(eventName), entry = cbMap?.get?.(cb);
		parent?.removeEventListener?.(eventName, entry?.wrap ?? cb, option ?? entry?.option ?? {});
		cbMap?.delete?.(cb);
		if (cbMap?.size != null && cbMap?.size == 0) eventMap?.delete?.(eventName);
		if (eventMap.size == 0) this._eventMap.delete(parent);
	}
	_selector(tg) {
		if (typeof this.selector == "string" && typeof tg?.selector == "string") return ((tg?.selector || "") + " " + this.selector).trim?.();
		return this.selector;
	}
	get(target, name, ctx) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		if (name in queryExtensions) return queryExtensions?.[name]?.(selected);
		if (name == "length" && array?.length != null) return array?.length;
		if (name == "_updateSelector") return (sel) => this.selector = sel || this.selector;
		if (["style", "attributeStyleMap"].indexOf(name) >= 0) {
			const tg = target?.self ?? target;
			const selector = this._selector(target);
			const basis = typeof selector == "string" ? getAdoptedStyleRule(selector, "ux-query", tg) : selected;
			if (name == "attributeStyleMap") return basis?.styleMap ?? basis?.attributeStyleMap;
			return basis?.[name];
		}
		if (name == "self") return target?.self ?? target;
		if (name == "selector") return this._selector(target);
		if (name == "observeAttr") return (name, cb) => this._observeAttributes(target, name, cb);
		if (name == "DOMChange") return (cb) => this._observeDOMChange(target, this.selector, cb);
		if (name == "addEventListener") return (name, cb, opt) => this._addEventListener(target, name, cb, opt);
		if (name == "removeEventListener") return (name, cb, opt) => this._removeEventListener(target, name, cb, opt);
		if (name == "getAttribute") return (key) => {
			const array = this._getArray(target);
			const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
			const query = existsQueries?.get?.(target)?.get?.(this.selector) ?? selected;
			if (elMap$1?.get?.(query)?.get?.(handleAttribute)?.has?.(key)) return elMap$1?.get?.(query)?.get?.(handleAttribute)?.get?.(key)?.[0];
			return selected?.getAttribute?.(key);
		};
		if (name == "setAttribute") return (key, value) => {
			const array = this._getArray(target);
			const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
			if (typeof value == "object" && (value?.value != null || "value" in value)) return bindWith(selected, key, value, handleAttribute, null, true);
			return selected?.setAttribute?.(key, value);
		};
		if (name == "removeAttribute") return (key) => {
			const array = this._getArray(target);
			const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
			const query = existsQueries?.get?.(target)?.get?.(this.selector) ?? selected;
			if (elMap$1?.get?.(query)?.get?.(handleAttribute)?.has?.(key)) return elMap$1?.get?.(query)?.get?.(handleAttribute)?.get?.(key)?.[1]?.();
			return selected?.removeAttribute?.(key);
		};
		if (name == "hasAttribute") return (key) => {
			const array = this._getArray(target);
			const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
			const query = existsQueries?.get?.(target)?.get?.(this.selector) ?? selected;
			if (elMap$1?.get?.(query)?.get?.(handleAttribute)?.has?.(key)) return true;
			return selected?.hasAttribute?.(key);
		};
		if (name == "element") {
			if (array?.length <= 1) return selected?.element ?? selected;
			const fragment = document.createDocumentFragment();
			fragment.append(...array);
			return fragment;
		}
		if (name == Symbol.toPrimitive) {
			if (this.selector?.includes?.("input") || this.selector?.matches?.("input")) return (hint) => {
				if (hint == "number") return (selected?.element ?? selected)?.valueAsNumber ?? parseFloat((selected?.element ?? selected)?.value);
				if (hint == "string") return String((selected?.element ?? selected)?.value ?? selected?.element ?? selected);
				if (hint == "boolean") return (selected?.element ?? selected)?.checked;
				return (selected?.element ?? selected)?.checked ?? (selected?.element ?? selected)?.value ?? selected?.element ?? selected;
			};
		}
		if (name == "checked") {
			if (this.selector?.includes?.("input") || this.selector?.matches?.("input")) return (selected?.element ?? selected)?.checked;
		}
		if (name == "value") {
			if (this.selector?.includes?.("input") || this.selector?.matches?.("input")) return (selected?.element ?? selected)?.valueAsNumber ?? (selected?.element ?? selected)?.valueAsDate ?? (selected?.element ?? selected)?.value ?? (selected?.element ?? selected)?.checked;
		}
		if (name == $affected) {
			if (this.selector?.includes?.("input") || this.selector?.matches?.("input")) return (cb) => {
				let oldValue = selected?.value;
				const evt = [(ev) => {
					const input = this._getSelected(ev?.target);
					cb?.(input?.value, "value", oldValue);
					oldValue = input?.value;
				}, { passive: true }];
				this._addEventListener(target, "change", ...evt);
				return () => this._removeEventListener(target, "change", ...evt);
			};
		}
		if (name == "deref" && (typeof selected == "object" || typeof selected == "function") && selected != null) {
			const wk = new WeakRef(selected);
			return () => wk?.deref?.()?.element ?? wk?.deref?.();
		}
		if (typeof name == "string" && /^\d+$/.test(name)) return array[parseInt(name)];
		const origin = selected;
		if (origin?.[name] != null) return typeof origin[name] == "function" ? origin[name].bind(origin) : origin[name];
		if (array?.[name] != null) return typeof array[name] == "function" ? array[name].bind(array) : array[name];
		return typeof target?.[name] == "function" ? target?.[name].bind(origin) : target?.[name];
	}
	set(target, name, value) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		if (typeof name == "string" && /^\d+$/.test(name)) return false;
		if (array[name] != null) return false;
		if (selected) {
			selected[name] = value;
			return true;
		}
		return true;
	}
	has(target, name) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		return typeof name == "string" && /^\d+$/.test(name) && array[parseInt(name)] != null || array[name] != null || selected && name in selected;
	}
	deleteProperty(target, name) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		if (selected && name in selected) {
			delete selected[name];
			return true;
		}
		return false;
	}
	ownKeys(target) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		const keys = /* @__PURE__ */ new Set();
		array.forEach((el, i) => keys.add(i.toString()));
		Object.getOwnPropertyNames(array).forEach((k) => keys.add(k));
		if (selected) Object.getOwnPropertyNames(selected).forEach((k) => keys.add(k));
		return Array.from(keys);
	}
	defineProperty(target, name, desc) {
		const array = this._getArray(target);
		const selected = array.length > 0 ? array[this.index] : this._getSelected(target);
		if (selected) {
			Object.defineProperty(selected, name, desc);
			return true;
		}
		return false;
	}
	apply(target, self, args) {
		args[0] ||= this.selector;
		const result = target?.apply?.(self, args);
		this.selector = result || this.selector;
		return new Proxy(target, this);
	}
};
var Q = (selector, host = document.documentElement, index = 0, direction = "children") => {
	if ((selector?.element ?? selector) instanceof HTMLElement) {
		const el = selector?.element ?? selector;
		return alreadyUsed.getOrInsert(el, new Proxy(el, new UniversalElementHandler("", index, direction)));
	}
	if (typeof selector == "function") {
		const el = selector;
		return alreadyUsed.getOrInsert(el, new Proxy(el, new UniversalElementHandler("", index, direction)));
	}
	if (host == null || typeof host == "string" || typeof host == "number" || typeof host == "boolean" || typeof host == "symbol" || typeof host == "undefined") return null;
	if (existsQueries?.get?.(host)?.has?.(selector)) return existsQueries?.get?.(host)?.get?.(selector);
	return existsQueries?.getOrInsert?.(host, /* @__PURE__ */ new Map())?.getOrInsertComputed?.(selector, () => {
		return new Proxy(host, new UniversalElementHandler(selector, index, direction));
	});
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/context/Reflect.ts
var $entries = (obj) => {
	if (isPrimitive(obj)) return [];
	if (Array.isArray(obj)) return obj.map((item, idx) => [idx, item]);
	if (obj instanceof Map) return Array.from(obj.entries());
	if (obj instanceof Set) return Array.from(obj.values());
	return Array.from(Object.entries(obj));
};
/**
* Detect StyleBinding from S`...` / css`...`: [apply, @property rules, variables].
* WHY: treating the tuple as a plain array made reflectStyles write indices 0/1/2 as CSS props.
*/
var isStyleBindingTuple = (styles) => {
	return Array.isArray(styles) && typeof styles[0] === "function";
};
var reflectAttributes = (element, attributes) => {
	if (!attributes) return element;
	const weak = new WeakRef(attributes), wel = new WeakRef(element);
	if (typeof attributes == "object" || typeof attributes == "function") {
		$entries(attributes).forEach(([prop, value]) => {
			handleAttribute(wel?.deref?.(), prop, value);
		});
		const usub = affected(attributes, (value, prop) => {
			handleAttribute(wel?.deref?.(), prop, value);
			bindHandler(wel?.deref?.(), value, prop, handleAttribute, weak, true);
		});
		addToCallChain(attributes, Symbol.dispose, usub);
		addToCallChain(element, Symbol.dispose, usub);
	} else console.warn("Invalid attributes object:", attributes);
};
var reflectARIA = (element, aria) => {
	if (!aria) return element;
	const weak = new WeakRef(aria), wel = new WeakRef(element);
	if (typeof aria == "object" || typeof aria == "function") {
		$entries(aria).forEach(([prop, value]) => {
			handleAttribute(wel?.deref?.(), "aria-" + (prop?.toString?.() || prop || ""), value);
		});
		const usub = affected(aria, (value, prop) => {
			handleAttribute(wel?.deref?.(), "aria-" + (prop?.toString?.() || prop || ""), value, true);
			bindHandler(wel, value, prop, handleAttribute, weak, true);
		});
		addToCallChain(aria, Symbol.dispose, usub);
		addToCallChain(element, Symbol.dispose, usub);
	} else console.warn("Invalid ARIA object:", aria);
	return element;
};
var reflectDataset = (element, dataset) => {
	if (!dataset) return element;
	const weak = new WeakRef(dataset), wel = new WeakRef(element);
	if (typeof dataset == "object" || typeof dataset == "function") {
		$entries(dataset).forEach(([prop, value]) => {
			handleDataset(wel?.deref?.(), prop, value);
		});
		const usub = affected(dataset, (value, prop) => {
			handleDataset(wel?.deref?.(), prop, value);
			bindHandler(wel?.deref?.(), value, prop, handleDataset, weak);
		});
		addToCallChain(dataset, Symbol.dispose, usub);
		addToCallChain(element, Symbol.dispose, usub);
	} else console.warn("Invalid dataset object:", dataset);
	return element;
};
var reflectStyles = (element, styles) => {
	if (!styles) return element;
	if (typeof styles == "string") applyNormalizedInlineStyle(element, styles);
	else if (typeof styles?.value == "string") affected([styles, "value"], (val) => {
		applyNormalizedInlineStyle(element, val ?? "");
	});
	else if (isStyleBindingTuple(styles) || typeof styles == "function") bindStyle(element, styles);
	else if (typeof styles == "object") {
		const weak = new WeakRef(styles), wel = new WeakRef(element);
		$entries(styles).forEach(([prop, value]) => {
			handleStyleChange(wel?.deref?.(), prop, value);
		});
		const usub = affected(styles, (value, prop) => {
			handleStyleChange(wel?.deref?.(), prop, value);
			bindHandler(wel?.deref?.(), value, prop, handleStyleChange, weak?.deref?.());
		});
		addToCallChain(styles, Symbol.dispose, usub);
		addToCallChain(element, Symbol.dispose, usub);
	} else console.warn("Invalid styles object:", styles);
	return element;
};
var reflectWithStyleRules = async (element, rule) => {
	return reflectStyles(element, await rule?.(element));
};
var reflectProperties = (element, properties) => {
	if (!properties) return element;
	const weak = new WeakRef(properties), wel = new WeakRef(element);
	const onChange = (ev) => {
		const input = Q("input", ev?.target);
		if (input?.value != null && isNotEqual(input?.value, properties?.value)) properties.value = input?.value;
		if (input?.valueAsNumber != null && isNotEqual(input?.valueAsNumber, properties?.valueAsNumber)) properties.valueAsNumber = input?.valueAsNumber;
		if (input?.checked != null && isNotEqual(input?.checked, properties?.checked)) properties.checked = input?.checked;
	};
	$entries(properties).forEach(([prop, value]) => {
		handleProperty(wel?.deref?.(), prop, value);
	});
	const usub = affected(properties, (value, prop) => {
		const el = wel.deref();
		if (el) if (prop == "checked") setChecked(el, value);
		else bindWith(el, prop, value, handleProperty, weak?.deref?.(), true);
	});
	addToCallChain(properties, Symbol.dispose, usub);
	addToCallChain(element, Symbol.dispose, usub);
	element.addEventListener("change", onChange);
	return element;
};
var reflectClassList = (element, classList) => {
	if (!classList) return element;
	const wel = new WeakRef(element);
	$entries(classList).forEach(([prop, value]) => {
		const el = element;
		if (typeof value == "undefined" || value == null) {
			if (el.classList.contains(value)) el.classList.remove(value);
		} else if (!el.classList.contains(value)) el.classList.add(value);
	});
	const usub = iterated(classList, (value) => {
		const el = wel?.deref?.();
		if (el) {
			if (typeof value == "undefined" || value == null) {
				if (el.classList.contains(value)) el.classList.remove(value);
			} else if (!el.classList.contains(value)) el.classList.add(value);
		}
	});
	addToCallChain(classList, Symbol.dispose, usub);
	addToCallChain(element, Symbol.dispose, usub);
	return element;
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/node/Mapped.ts
var asArray = (children) => {
	if (children instanceof Map || children instanceof Set) children = Array.from(children?.values?.());
	return children;
};
var isElementParent = (value) => value != null && value.nodeType === 1 && value.nodeName !== "BODY" && typeof value.insertBefore === "function";
var Mp = class {
	#observable;
	#fragments;
	#mapCb;
	#reMap;
	#pmMap;
	#mapEntries;
	#updater = null;
	#internal = null;
	#options = {};
	#stub = document.createComment("");
	#renderedNodes = /* @__PURE__ */ new Set();
	#syncQueued = false;
	#parentObserver = null;
	#boundParent = null;
	#collection() {
		const source = this.#observable;
		const value = source?.value ?? source;
		if (value instanceof Map || value instanceof Set) return Array.from(value.values());
		return Array.isArray(value) ? value : [];
	}
	#mapKeyAt(index) {
		const source = this.#observable?.value ?? this.#observable;
		if (!(source instanceof Map) || typeof index !== "number") return index;
		return Array.from(source.keys())[index];
	}
	#pruneMapEntries() {
		const source = this.#observable?.value ?? this.#observable;
		if (!(source instanceof Map)) {
			this.#mapEntries.clear();
			return;
		}
		const activeKeys = new Set(source.keys());
		for (const key of this.#mapEntries.keys()) if (!activeKeys.has(key)) this.#mapEntries.delete(key);
	}
	#disconnectParentObserver() {
		this.#parentObserver?.disconnect();
		this.#parentObserver = null;
	}
	#syncBoundParent() {
		const parent = this.#boundParent;
		if (!parent) return;
		this.#pruneMapEntries();
		const desiredNodes = [];
		this.#collection().forEach((value, index) => {
			const node = getNode(value, this.mapper.bind(this), index, parent);
			if (node instanceof DocumentFragment) desiredNodes.push(...Array.from(node.childNodes));
			else if (node instanceof Node) desiredNodes.push(node);
		});
		const desired = new Set(desiredNodes);
		if (this.#stub.parentNode !== parent) {
			const firstExisting = desiredNodes.find((node) => node.parentNode === parent);
			if (firstExisting) parent.insertBefore(this.#stub, firstExisting);
			else parent.appendChild(this.#stub);
		}
		for (const oldNode of this.#renderedNodes) if (!desired.has(oldNode) && oldNode.parentNode === parent) oldNode.parentNode.removeChild(oldNode);
		let anchor = this.#stub.nextSibling;
		for (const node of desiredNodes) {
			if (node.parentNode !== parent || node !== anchor) parent.insertBefore(node, anchor);
			anchor = node.nextSibling;
		}
		this.#renderedNodes = desired;
	}
	#queueBoundParentSync() {
		if (this.#syncQueued) return;
		this.#syncQueued = true;
		queueMicrotask(() => {
			this.#syncQueued = false;
			this.#syncBoundParent();
		});
	}
	makeUpdater(basisParent = null) {
		if (basisParent) {
			this.#internal?.();
			this.#internal = null;
			this.#updater = null;
			this.#updater ??= makeUpdater(basisParent, this.mapper.bind(this), true);
			this.#internal ??= iterated?.(this.#observable, this._onUpdate.bind(this));
		}
	}
	get boundParent() {
		return this.#boundParent;
	}
	set boundParent(value) {
		if (isElementParent(value) && value != this.#boundParent) {
			this.#disconnectParentObserver();
			const oldParent = this.#boundParent;
			for (const node of this.#renderedNodes) if (node.parentNode === oldParent && oldParent !== value) oldParent?.removeChild(node);
			this.#boundParent = value;
			this.makeUpdater(value);
			this.#syncBoundParent();
		}
	}
	constructor(observable, mapCb = (el) => el, options = null) {
		if (isObservable(mapCb) && (typeof observable == "function" || typeof observable == "object") && !isObservable(observable)) [observable, mapCb] = [mapCb, observable];
		if (!options && mapCb != null && typeof mapCb == "object" && !isObservable(mapCb)) options = mapCb;
		this.#stub = document.createComment("");
		this.#reMap = /* @__PURE__ */ new WeakMap();
		this.#pmMap = /* @__PURE__ */ new Map();
		this.#mapEntries = /* @__PURE__ */ new Map();
		this.#mapCb = (mapCb != null ? typeof mapCb == "function" ? mapCb : typeof mapCb == "object" ? mapCb?.mapper : null : null) ?? ((el) => el);
		this.#observable = (isObservable(observable) ? observable : observable?.iterator ?? mapCb?.iterator ?? observable) ?? [];
		this.#fragments = document.createDocumentFragment();
		const $baseOptions = {
			removeNotExistsWhenHasPrimitives: true,
			uniquePrimitives: true,
			preMap: true
		};
		const $newOptions = (isValidParent$1(options) ? null : options) || {};
		this.#options = Object.assign($baseOptions, $newOptions);
		this.boundParent = isValidParent$1(this.#options?.boundParent) ?? isValidParent$1(options) ?? null;
		if (!this.boundParent) {
			if (this.#options.preMap) {
				reformChildren(this.#fragments, this.#collection(), this.mapper.bind(this));
				if (this.#fragments.childNodes.length === 0) this.#fragments.appendChild(this.#stub);
			}
		}
	}
	get [$mapped]() {
		return true;
	}
	elementForPotentialParent(requestor) {
		try {
			if (this.#collection().length === 0 && isElementParent(requestor)) {
				this.#disconnectParentObserver();
				this.#boundParent = requestor;
				this.makeUpdater(requestor);
				this.#syncBoundParent();
				return this.element;
			}
			const element = getNode(this.#collection()?.[0], this.mapper.bind(this), 0);
			if (!requestor || element?.contains?.(requestor) || requestor == element) return;
			if (isElementParent(requestor)) if (!element) this.boundParent = requestor;
			else if (Array.from(requestor?.children).find((node) => node === element)) this.boundParent = requestor;
			else {
				this.#disconnectParentObserver();
				const observer = new MutationObserver((records) => {
					for (const record of records) if (record.type === "childList") {
						if (record.addedNodes.length > 0) {
							if (Array.from(record.addedNodes || []).find((node) => node === element)) {
								this.boundParent = requestor;
								observer.disconnect();
							}
						}
					}
				});
				this.#parentObserver = observer;
				observer.observe(requestor, { childList: true });
			}
		} catch (error) {
			console.warn(error);
		}
		return this.element;
	}
	get children() {
		return asArray(this.#collection());
	}
	get self() {
		const existsNode = getNode(this.#collection()?.[0], this.mapper.bind(this), 0);
		const theirParent = isValidParent$1(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
		this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		queueMicrotask(() => {
			const theirParent = isValidParent$1(existsNode?.parentElement) ? existsNode?.parentElement : this.boundParent;
			this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		});
		return theirParent ?? this.boundParent ?? reformChildren(this.#fragments, this.#collection(), this.mapper.bind(this));
	}
	get element() {
		const children = this.#fragments?.childNodes?.length > 0 ? this.#fragments : getNode(this.#collection()?.[0], this.mapper.bind(this), 0);
		const theirParent = isValidParent$1(children?.parentElement) ? children?.parentElement : this.boundParent;
		this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		queueMicrotask(() => {
			const theirParent = isValidParent$1(children?.parentElement) ? children?.parentElement : this.boundParent;
			this.boundParent ??= isValidParent$1(theirParent) ?? this.boundParent;
		});
		return children;
	}
	get mapper() {
		return (...args) => {
			const source = this.#observable?.value ?? this.#observable;
			if (args?.[0] == null) return null;
			if (args?.[0] instanceof Node) return args?.[0];
			if (args?.[0] instanceof Promise || typeof (args?.[0])?.then == "function") return null;
			if (source instanceof Map) {
				const mapKey = this.#mapKeyAt(args?.[1]);
				const mapArgs = [
					args?.[0],
					mapKey,
					...args.slice(2)
				];
				const cached = this.#mapEntries.get(mapKey);
				if (cached && Object.is(cached.value, args?.[0])) return cached.node;
				const node = this.#mapCb(...mapArgs);
				this.#mapEntries.set(mapKey, {
					value: args?.[0],
					node
				});
				return node;
			}
			if ((args?.[1] == null || args?.[1] < 0 || typeof args?.[1] != "number" || !canBeInteger(args?.[1])) && (Array.isArray(source) || source instanceof Set)) return;
			if (args?.[0] != null && (typeof args?.[0] == "object" || typeof args?.[0] == "function" || typeof args?.[0] == "symbol")) return this.#reMap.getOrInsert(args?.[0], this.#mapCb(...args));
			if (args?.[0] != null && source instanceof Set) return this.#pmMap.getOrInsert(args?.[0], this.#mapCb(...args));
			if (args?.[0] != null) if (this.#options?.uniquePrimitives && isPrimitive(args?.[0])) return this.#pmMap.getOrInsert(args?.[0], this.#mapCb(...args));
			else return this.#mapCb(...args);
		};
	}
	_onUpdate(newEl, idx, oldEl, op = "") {
		this.#queueBoundParentSync();
	}
	[Symbol.dispose]() {
		this.#internal?.();
		this.#internal = null;
		this.#disconnectParentObserver();
		this.#syncQueued = false;
		for (const node of this.#renderedNodes) if (node.parentNode) node.parentNode.removeChild(node);
		this.#renderedNodes.clear();
		this.#stub.parentNode?.removeChild(this.#stub);
		this.#mapEntries.clear();
		this.#pmMap.clear();
		this.#reMap = /* @__PURE__ */ new WeakMap();
		this.#boundParent = null;
	}
	*[Symbol.iterator]() {
		let i = 0;
		if (this.#collection()) for (let el of this.#collection()) yield this.mapper(el, i++);
	}
};
var M = (observable, mapCb, boundParent = null) => {
	return new Mp(observable, mapCb, boundParent);
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/node/Bindings.ts
var Qp = (ref, host = document.documentElement) => {
	if (ref?.value == null) return Q(ref, host);
	const actual = Q(ref?.value, host);
	affected(ref, (value, prop) => actual?._updateSelector(value));
	return actual;
};
var $createElement = (selector) => {
	if (typeof selector == "string") {
		const nl = Qp(createElementVanilla(selector));
		return nl?.element ?? nl;
	} else if (selector instanceof HTMLElement || selector instanceof Element || selector instanceof DocumentFragment || selector instanceof Document || selector instanceof Node) return selector;
	else return null;
};
var E = (selector, params = {}, children) => {
	const element = getNode(typeof selector == "string" ? $createElement(selector) : selector, null, -1);
	if (element && children) M(children, (el) => el, element);
	if (element && params) {
		if (params.ctrls != null) reflectControllers(element, params.ctrls);
		if (params.attributes != null) reflectAttributes(element, params.attributes);
		if (params.properties != null) reflectProperties(element, params.properties);
		if (params.classList != null) reflectClassList(element, params.classList);
		if (params.behaviors != null) reflectBehaviors(element, params.behaviors);
		if (params.dataset != null) reflectDataset(element, params.dataset);
		if (params.stores != null) reflectStores(element, params.stores);
		if (params.mixins != null) reflectMixins(element, params.mixins);
		if (params.style != null) reflectStyles(element, params.style);
		if (params.aria != null) reflectARIA(element, params.aria);
		if ("value" in params) bindWith(element, "value", params.value, handleProperty, params, true);
		if ("placeholder" in params) bindWith(element, "placeholder", params.placeholder, handleProperty, params, true);
		if (params.is != null) bindWith(element, "is", params.is, handleAttribute, params, true);
		if (params.role != null) bindWith(element, "role", params.role, handleProperty, params);
		if (params.slot != null) bindWith(element, "slot", params.slot, handleProperty, params);
		if (params.part != null) bindWith(element, "part", params.part, handleAttribute, params, true);
		if (params.name != null) bindWith(element, "name", params.name, handleAttribute, params, true);
		if (params.type != null) bindWith(element, "type", params.type, handleAttribute, params, true);
		if (params.icon != null) bindWith(element, "icon", params.icon, handleAttribute, params, true);
		if (params.inert != null) bindWith(element, "inert", params.inert, handleAttribute, params, true);
		if (params.hidden != null) bindWith(element, "hidden", params.visible ?? params.hidden, handleHidden, params);
		if (params.on != null) addEventsList(element, params.on);
		if (params.rules != null) params.rules.forEach?.((rule) => reflectWithStyleRules(element, rule));
	}
	return Q(element);
};
//#endregion
//#region ../../modules/projects/lur.e/src/lure/misc/Normalizer.ts
function getIndentColumns(line, tabWidth = 4) {
	let col = 0;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (ch === " ") col += 1;
		else if (ch === "	") col += tabWidth - col % tabWidth;
		else break;
	}
	return col;
}
function stripIndentColumns(line, columns, tabWidth = 4) {
	let col = 0, i = 0;
	while (i < line.length && col < columns) {
		const ch = line[i];
		if (ch === " ") {
			col += 1;
			i++;
		} else if (ch === "	") {
			col += tabWidth - col % tabWidth;
			i++;
		} else break;
	}
	return line.slice(i);
}
function pickEOL(s) {
	if (s.includes("\r\n")) return "\r\n";
	if (s.includes("\r")) return "\r";
	return "\n";
}
function gcd(a, b) {
	a = Math.abs(a);
	b = Math.abs(b);
	while (b) [a, b] = [b, a % b];
	return a;
}
function detectIndentStep(text, { ignoreFirstLine = true, tabWidth = 4 } = {}) {
	const lines = text.split(/\r\n|\n|\r/);
	const start = ignoreFirstLine ? 1 : 0;
	const indents = [];
	for (let i = start; i < lines.length; i++) {
		const ln = lines[i];
		if (ln.trim() === "") continue;
		indents.push(getIndentColumns(ln, tabWidth));
	}
	if (indents.length === 0) return {
		min: 0,
		step: 0,
		allEven: true,
		allDiv4: true
	};
	const min = Math.min(...indents);
	const shifted = indents.map((v) => v - min).filter((v) => v > 0);
	let step = 0;
	for (const v of shifted) step = step ? gcd(step, v) : v;
	const allEven = indents.every((v) => v % 2 === 0);
	const allDiv4 = indents.every((v) => v % 4 === 0);
	if (step === 0) step = allDiv4 ? 4 : allEven ? 2 : 1;
	else if (step % 4 === 0) step = 4;
	else if (step % 2 === 0) step = 2;
	else step = 1;
	return {
		min,
		step,
		allEven,
		allDiv4
	};
}
function adjustIndentToGrid(line, step, mode = "floor", tabWidth = 4) {
	if (!step || step <= 1) return line;
	const cur = getIndentColumns(line, tabWidth);
	if (cur === 0) return line;
	let target;
	if (mode === "nearest") target = Math.round(cur / step) * step;
	else if (mode === "ceil") target = Math.ceil(cur / step) * step;
	else target = Math.floor(cur / step) * step;
	const delta = cur - target;
	if (delta > 0) return stripIndentColumns(line, delta, tabWidth);
	else if (delta < 0) return " ".repeat(-delta) + line;
	return line;
}
function normalizeStartTagWhitespace(html, { scope = "void-only" } = {}) {
	if (!html || typeof html !== "string") return html;
	const VOID = /* @__PURE__ */ new Set([
		"area",
		"base",
		"br",
		"col",
		"embed",
		"hr",
		"img",
		"input",
		"link",
		"meta",
		"param",
		"source",
		"track",
		"wbr"
	]);
	let out = "";
	let i = 0;
	const n = html.length;
	while (i < n) {
		const ch = html[i];
		if (ch !== "<") {
			out += ch;
			i++;
			continue;
		}
		if (html.startsWith("<!--", i)) {
			const end = html.indexOf("-->", i + 4);
			if (end === -1) {
				out += html.slice(i);
				break;
			}
			out += html.slice(i, end + 3);
			i = end + 3;
			continue;
		}
		if (html[i + 1] === "!" || html[i + 1] === "?") {
			const end = html.indexOf(">", i + 2);
			if (end === -1) {
				out += html.slice(i);
				break;
			}
			out += html.slice(i, end + 1);
			i = end + 1;
			continue;
		}
		if (html[i + 1] === "/") {
			const end = html.indexOf(">", i + 2);
			if (end === -1) {
				out += html.slice(i);
				break;
			}
			out += html.slice(i, end + 1);
			i = end + 1;
			continue;
		}
		let j = i + 1;
		while (j < n && /\s/.test(html[j])) j++;
		const nameStart = j;
		while (j < n && /[A-Za-z0-9:-]/.test(html[j])) j++;
		const tagName = html.slice(nameStart, j).toLowerCase();
		let k = j;
		let quote = null;
		while (k < n) {
			const c = html[k];
			if (quote) {
				if (c === quote) quote = null;
				k++;
			} else if (c === "\"" || c === "'") {
				quote = c;
				k++;
			} else if (c === ">") break;
			else k++;
		}
		if (k >= n) {
			out += html.slice(i);
			break;
		}
		const rawTag = html.slice(i, k + 1);
		if (!(scope === "all" || scope === "input-only" && tagName === "input" || scope === "void-only" && VOID.has(tagName))) {
			out += rawTag;
			i = k + 1;
			continue;
		}
		let res = "";
		let q = null;
		let ws = false;
		for (let p = 0; p < rawTag.length; p++) {
			const c = rawTag[p];
			if (q) {
				res += c;
				if (c === q) q = null;
				continue;
			}
			if (c === "\"" || c === "'") {
				q = c;
				res += c;
				ws = false;
				continue;
			}
			if (c === "\n" || c === "\r" || c === "	" || c === " ") {
				if (!ws) {
					res += " ";
					ws = true;
				}
				continue;
			}
			res += c;
			ws = false;
		}
		res = res.replace(/\s*(\/?)\s*>$/, "$1>");
		out += res;
		i = k + 1;
	}
	return out;
}
function collapseInterTagWhitespaceSmart(html, { preserveCommentGaps = true } = {}) {
	if (!html || typeof html !== "string") return html;
	if (!preserveCommentGaps) return html.replace(/>\s+</g, "><");
	const SENT = "";
	let s = html;
	s = s.replace(/-->([^\S\r\n]+)<!--/g, `-->${SENT}<!--`).replace(/-->([^\S\r\n]+)</g, `-->${SENT}<`).replace(/>([^\S\r\n]+)<!--/g, `>${SENT}<!--`);
	s = s.replace(/>\s+</g, "><");
	s = s.replace(new RegExp(SENT, "g"), " ");
	return s;
}
function cleanupInterTagWhitespaceAndIndent(html, { normalizeIndent = true, ignoreFirstLine = true, tabWidth = 4, alignStep = "auto", quantize = "none" } = {}) {
	if (!html || typeof html !== "string" || html.indexOf("<") === -1) return html;
	html = html?.trim?.();
	const placeholders = [];
	const protectedHtml = html.replace(/<(pre|textarea|script|style)\b[\s\S]*?<\/\1>/gi, (m) => {
		return `\u0000${placeholders.push(m) - 1}\u0000`;
	});
	const eol = pickEOL(protectedHtml);
	const lines = protectedHtml.split(/\r\n|\n|\r/);
	const start = ignoreFirstLine ? 1 : 0;
	const { min, step: autoStep } = detectIndentStep(protectedHtml, {
		ignoreFirstLine,
		tabWidth
	});
	if (normalizeIndent && min > 0) for (let i = start; i < lines.length; i++) {
		const ln = lines[i];
		if (ln.trim() === "") continue;
		lines[i] = stripIndentColumns(ln, min, tabWidth);
	}
	let step = alignStep === "auto" ? autoStep : alignStep;
	if (quantize !== "none" && step > 1) for (let i = start; i < lines.length; i++) {
		const ln = lines[i];
		if (ln.trim() === "") continue;
		lines[i] = adjustIndentToGrid(ln, step, quantize, tabWidth);
	}
	let working = lines.join(eol);
	working = normalizeStartTagWhitespace(working, { scope: "void-only" });
	working = collapseInterTagWhitespaceSmart(working);
	return working.replace(/\u0000(\d+)\u0000/g, (_, i) => placeholders[+i])?.trim?.();
}
function checkInsideTagBlock(contextParts, ...str) {
	const current = str?.[0] ?? "";
	const idx = contextParts.indexOf(current);
	if (idx < 0) {
		const tail = str?.join?.("") ?? "";
		return /<([A-Za-z\/!?])[\w\W]*$/.test(tail) && !/>[\w\W]*$/.test(tail);
	}
	const prefix = contextParts.slice(0, idx + 1).join("");
	let inTag = false, inSingle = false, inDouble = false;
	for (let i = 0; i < prefix.length; i++) {
		const ch = prefix[i];
		const next = prefix[i + 1] ?? "";
		if (!inTag) {
			if (ch === "<") {
				if (/[A-Za-z\/!?]/.test(next)) {
					inTag = true;
					inSingle = false;
					inDouble = false;
				}
			}
			continue;
		}
		if (!inSingle && !inDouble) {
			if (ch === "\"") {
				inDouble = true;
				continue;
			}
			if (ch === "'") {
				inSingle = true;
				continue;
			}
			if (ch === ">") {
				inTag = false;
				continue;
			}
		} else if (inDouble) {
			if (ch === "\"") {
				inDouble = false;
				continue;
			}
		} else if (inSingle) {
			if (ch === "'") {
				inSingle = false;
				continue;
			}
		}
	}
	return inTag;
}
//#endregion
//#region ../../modules/projects/lur.e/src/lure/misc/Syntax.ts
var EMap = /* @__PURE__ */ new WeakMap();
var parseTag = (str) => {
	const match = str.match(/^([a-zA-Z0-9\-]+)?(?:#([a-zA-Z0-9\-_]+))?((?:\.[a-zA-Z0-9\-_]+)*)$/);
	if (!match) return {
		tag: str,
		id: null,
		className: null
	};
	const [, tag = "div", id, classStr] = match;
	return {
		tag,
		id,
		className: classStr ? classStr.replace(/\./g, " ").trim() : null
	};
};
var parseIndex = (value) => {
	if (typeof value != "string" || !value?.trim?.()) return -1;
	const exact = value.match(/^#\{(\d+)\}$/);
	if (exact) return parseInt(exact[1] ?? "-1", 10);
	const embedded = value.match(/#\{(\d+)\}/);
	return embedded ? parseInt(embedded[1] ?? "-1", 10) : -1;
};
var connectElement = (el, atb, psh, mapped) => {
	if (!el) return el;
	const rawStyleAttribute = el.getAttribute("style");
	const inlineStylePlan = rawStyleAttribute != null ? compileInlineStyleAttribute(rawStyleAttribute, atb) : null;
	if (el != null) {
		const entriesIdc = [];
		const addEntryIfExists = (name) => {
			const attr = Array.from(el?.attributes || []).find((attr) => attr.name == name && attr.value?.includes?.("#{"));
			if (attr) {
				const pair = [name, parseIndex(attr?.value) ?? -1];
				entriesIdc.push(pair);
				return pair;
			}
			return [name, -1];
		};
		[
			"dataset",
			"style",
			"classList",
			"visible",
			"aria",
			"value",
			"placeholder",
			"ref"
		].forEach((name) => {
			if (name === "style" && inlineStylePlan != null) return;
			addEntryIfExists(name);
		});
		const makeEntries = (startsWith, except) => {
			const entries = [];
			for (const attr of Array.from(el?.attributes || [])) {
				const allowedNoPrefix = Array.isArray(startsWith) ? startsWith?.some?.((str) => str == "") : startsWith == "";
				const prefix = (Array.isArray(startsWith) ? startsWith.find((start) => attr.name?.startsWith?.(start)) : startsWith = attr.name?.startsWith?.(startsWith) ? startsWith : "") ?? "";
				const trueAttributeName = attr.name.trim()?.replace?.(prefix, "");
				const isPlaceholder = attr.value?.includes?.("#{") && attr.value?.includes?.("}");
				const atbIndex = parseIndex(attr?.value);
				const excepted = Array.isArray(except) ? except?.some?.((str) => trueAttributeName?.startsWith?.(str)) : except == trueAttributeName;
				if (isPlaceholder && (prefix == "" && allowedNoPrefix || prefix != "") && atbIndex >= 0 && !excepted) entries.push([trueAttributeName, atbIndex]);
			}
			return entries;
		};
		const makeCumulativeEntries = (startsWith, except, specific = "") => {
			const entriesMap = /* @__PURE__ */ new Map();
			for (const attr of Array.from(el?.attributes || [])) {
				const allowedNoPrefix = Array.isArray(startsWith) ? startsWith?.some?.((str) => str == "") : startsWith == "";
				const prefix = (Array.isArray(startsWith) ? startsWith.find((start) => attr.name?.startsWith?.(start)) : startsWith = attr.name?.startsWith?.(startsWith) ? startsWith : "") ?? "";
				const trueAttributeName = attr.name.trim()?.replace?.(prefix, "");
				const isPlaceholder = attr.value?.includes?.("#{") && attr.value?.includes?.("}");
				const atbIndex = parseIndex(attr?.value) ?? -1;
				const excepted = Array.isArray(except) ? except?.some?.((str) => trueAttributeName?.startsWith?.(str)) : except == trueAttributeName;
				const isSpecific = (Array.isArray(specific) ? specific?.some?.((str) => attr.name === str) : attr.name === specific) && specific !== "";
				if (isPlaceholder && (prefix == "" && allowedNoPrefix || prefix != "" || isSpecific) && atbIndex >= 0 && !excepted) {
					const key = isSpecific ? attr.name : trueAttributeName;
					if (!entriesMap.has(key)) entriesMap.set(key, []);
					entriesMap.get(key)?.push(atbIndex);
				}
			}
			return Array.from(entriesMap.entries());
		};
		let propertiesEntries = makeEntries(["prop:"], []);
		let onEntries = makeCumulativeEntries(["on:", "@"], [], "");
		let refEntries = makeCumulativeEntries(["ref:"], [], ["ref"]);
		let attributesEntries = makeEntries(["attr:", ""], [
			"ref",
			"value",
			"placeholder"
		]);
		if (inlineStylePlan != null) attributesEntries = attributesEntries.filter(([name]) => name !== "style");
		const bindings = Object.fromEntries(entriesIdc?.filter?.((pair) => pair[1] >= 0)?.map?.((pair) => [pair[0], atb?.[pair[1]] ?? null]) ?? []);
		bindings.attributes = Object.fromEntries(attributesEntries?.filter?.((pair) => pair[1] >= 0)?.map?.((pair) => [pair[0], atb?.[pair[1]] ?? null]) ?? []);
		bindings.properties = Object.fromEntries(propertiesEntries?.filter?.((pair) => pair[1] >= 0)?.map?.((pair) => [pair[0], atb?.[pair[1]] ?? null]) ?? []);
		bindings.on = Object.fromEntries(onEntries?.filter?.((pair) => pair[1]?.some?.((idx) => idx >= 0))?.map?.((pair) => [pair[0], pair[1]?.map?.((idx) => atb?.[idx]).filter((value) => value != null)]) ?? []);
		if (inlineStylePlan?.kind === "direct") bindings.style = inlineStylePlan.value;
		else if (inlineStylePlan?.kind === "template") bindings.style = inlineStylePlan.binding;
		bindings.attributes = Object.fromEntries(attributesEntries?.filter?.((pair) => pair[1] >= 0)?.map?.((pair) => [pair[0], atb?.[pair[1]] ?? null]) ?? []);
		bindings.properties = Object.fromEntries(propertiesEntries?.filter?.((pair) => pair[1] >= 0)?.map?.((pair) => [pair[0], atb?.[pair[1]] ?? null]) ?? []);
		bindings.on = Object.fromEntries(onEntries?.filter?.((pair) => pair[1]?.some?.((idx) => idx >= 0))?.map?.((pair) => [pair[0], pair[1]?.map?.((idx) => atb?.[idx]).filter((v) => v != null)]) ?? []);
		const refIndex = entriesIdc?.find?.((pair) => pair[0] == "ref" && pair[1] >= 0)?.[1];
		if (refIndex != null && refIndex >= 0) {
			const ref = atb?.[refIndex];
			if (typeof ref == "function") ref?.(el);
			else if (ref != null && typeof ref == "object") ref.value = el;
		}
		refEntries?.forEach?.((pair) => {
			(pair?.[1]?.filter?.((idx) => idx != null && idx >= 0)?.map?.((idx) => atb?.[idx])?.filter?.((v) => v != null))?.forEach?.((ref) => {
				if (typeof ref == "function") ref?.(el);
				else if (ref != null && typeof ref == "object") ref.value = el;
			});
		});
		const clearPlaceholdersFromAttributesOfElement = (el) => {
			if (el == null) return;
			const attributeIsInRegistry = (name) => {
				return attributesEntries?.some?.((pair) => pair[0] == name) || entriesIdc?.some?.((pair) => pair[0] == name) || name?.startsWith?.("ref:") || name == "ref";
			};
			for (const attr of Array.from(el?.attributes || [])) if (attr.value?.includes?.("#{") && attr.value?.includes?.("}") && attributeIsInRegistry(attr.name) || attr.value?.startsWith?.("#{") && attr.value?.endsWith?.("}") || attr.name?.includes?.(":") || attr.name?.includes?.("ref:") || attr.name == "ref") el?.removeAttribute?.(attr.name);
			for (const attr of Array.from(el?.attributes || [])) if (typeof attr.value == "string" && /#\{\d+\}/.test(attr.value)) el?.removeAttribute?.(attr.name);
		};
		if (inlineStylePlan?.kind === "static") applyNormalizedInlineStyle(el, inlineStylePlan.cssText);
		clearPlaceholdersFromAttributesOfElement(el);
		pruneEmptyStyleAttribute(el);
		if (!EMap?.has?.(el)) EMap?.set?.(el, E(el, bindings));
	}
	return EMap?.get?.(el) ?? el;
};
var linearBuilder = (strings, ...values) => {
	const nodes = [];
	for (let i = 0; i < strings?.length; i++) {
		const str = strings?.[i];
		const val = values?.[i];
		nodes.push(H(str));
		nodes.push(val);
	}
	if (nodes?.length <= 1) return getNode(nodes?.[0], null, 0);
	const fragment = document.createDocumentFragment();
	fragment.append(...nodes?.filter?.((nd) => nd != null)?.map?.((en, i) => getNode(en, null, i))?.filter?.((nd) => nd != null));
	return fragment;
};
function html(strings, ...values) {
	if (strings?.at?.(0)?.trim?.()?.startsWith?.("<") && strings?.at?.(-1)?.trim?.()?.endsWith?.(">")) return htmlBuilder({ createElement: null })(strings, ...values);
	return linearBuilder(strings, ...values);
}
var isValidParent = (parent) => {
	return parent != null && parent instanceof HTMLElement && !(parent instanceof DocumentFragment || parent instanceof HTMLBodyElement && parent != document.body);
};
var replaceNode = (parent, node, el) => {
	if (el != null) el.boundParent = parent;
	let newNode = getNode(el, null, -1, parent);
	if (isElement(newNode)) {
		if (newNode?.parentNode != parent && !newNode?.contains?.(parent) && newNode != null) node?.replaceWith?.(hasValue(newNode) && (typeof newNode?.value == "object" || typeof newNode?.value == "function") && isElement(newNode?.value) ? newNode?.value : newNode);
	} else node?.remove?.();
};
function htmlBuilder({ createElement = null } = {}) {
	return function(strings, ...values) {
		let parts = [];
		const psh = [], atb = [];
		for (let i = 0; i < strings.length; i++) {
			parts.push(strings?.[i] || "");
			if (i < values.length) if (strings[i]?.trim()?.endsWith?.("<")) {
				const dat = parseTag(values?.[i]);
				parts.push(dat.tag || "div");
				if (dat.id) parts.push(` id="${dat.id}"`);
				if (dat.className) parts.push(` class="${dat.className}"`);
			} else {
				const $inTagOpen = checkInsideTagBlock(strings, strings?.[i] || "", strings?.[i + 1] || "");
				const $afterEquals = /[\w:\-\.\]]\s*=\s*$/.test(strings[i]?.trim?.() ?? "") || strings[i]?.trim?.()?.endsWith?.("=");
				const $isQuoteBegin = strings[i]?.trim?.()?.match?.(/['"]$/);
				const $isQuoteEnd = strings[i + 1]?.trim?.()?.match?.(/^['"]/) ?? $isQuoteBegin;
				const $betweenQuotes = $isQuoteBegin && $isQuoteEnd;
				const $attributePattern = $afterEquals;
				if (($attributePattern || $betweenQuotes) && $inTagOpen) {
					const $needsToQuoteWrap = $attributePattern && !$betweenQuotes;
					const ati = atb.length;
					parts.push((typeof values?.[i] == "string" ? values?.[i]?.trim?.() != "" : values?.[i] != null) ? $needsToQuoteWrap ? `"#{${ati}}"` : `#{${ati}}` : "");
					atb.push(values?.[i]);
				} else if (!$inTagOpen) {
					const psi = psh.length;
					parts.push((typeof values?.[i] == "string" ? values?.[i]?.trim?.() != "" : values?.[i] != null) ? isPrimitive(values?.[i]) ? String(values?.[i])?.trim?.() : `<!--o:${psi}-->` : "");
					psh.push(values?.[i]);
				}
			}
		}
		const sourceCode = cleanupInterTagWhitespaceAndIndent(parts.join("").trim());
		const mapped = /* @__PURE__ */ new WeakMap(), doc = new DOMParser().parseFromString(sourceCode, "text/html");
		const sources = (doc instanceof HTMLTemplateElement || doc?.matches?.("template") ? doc : doc.querySelector("template"))?.content ?? doc.body ?? doc;
		const frag = document.createDocumentFragment();
		const bucket = Array.from(sources.childNodes)?.filter((e) => {
			return e instanceof Node;
		}).map((node) => {
			if (!isValidParent(node?.parentNode) && node?.parentNode != frag) {
				node?.remove?.();
				if (node != null) frag?.append?.(node);
			}
			return node;
		});
		let walkedNodes = [];
		bucket.forEach((nodeSet) => {
			const walker = nodeSet ? document.createTreeWalker(nodeSet, NodeFilter.SHOW_ALL, null) : null;
			do {
				const node = walker?.currentNode;
				walkedNodes.push(node);
			} while (walker?.nextNode?.());
		});
		walkedNodes?.filter?.((node) => node?.nodeType == Node.COMMENT_NODE)?.forEach?.((node) => {
			if (node?.nodeValue?.trim?.()?.includes?.("o:") && Number.isInteger(parseInt(node?.nodeValue?.trim?.()?.slice?.(2) ?? "-1"))) {
				let el = psh?.[parseInt(node?.nodeValue?.trim?.()?.slice?.(2) ?? "-1") ?? -1];
				if (el == null || el === void 0 || (typeof el == "string" ? el : null)?.trim?.() == "") node?.remove?.();
				else {
					const $parent = node?.parentNode;
					if (Array.isArray(el) || el instanceof Map || el instanceof Set) replaceNode?.($parent, node, el = M(el, null, $parent));
					else if (el != null) replaceNode?.($parent, node, el);
				}
			}
			if (node?.isConnected) node?.remove?.();
		});
		walkedNodes?.filter((node) => node.nodeType == Node.ELEMENT_NODE)?.map?.((node) => {
			connectElement(node, atb, psh, mapped);
		});
		return Array.from(frag?.childNodes)?.length > 1 ? frag : frag?.childNodes?.[0];
	};
}
var H = (str, ...values) => {
	if (typeof str == "string") {
		if (str?.trim?.()?.startsWith?.("<") && str?.trim?.()?.endsWith?.(">")) {
			const doc = new DOMParser().parseFromString(cleanupInterTagWhitespaceAndIndent(str?.trim?.()), "text/html");
			const basis = doc.querySelector("template")?.content ?? doc.body;
			if (basis instanceof HTMLBodyElement) {
				const frag = document.createDocumentFragment();
				frag.append(...Array.from(basis.childNodes ?? []));
				return Array.from(frag.childNodes)?.length > 1 ? frag : frag?.childNodes?.[0];
			}
			if (basis instanceof DocumentFragment) return basis;
			if (basis?.childNodes?.length > 1) {
				const frag = document.createDocumentFragment();
				frag.append(...Array.from(basis?.childNodes ?? []));
				return frag;
			}
			return basis?.childNodes?.[0] ?? new Text(str);
		}
		return new Text(str);
	} else if (typeof str == "function") return H(str?.());
	else if (Array.isArray(str) && values) return html(str, ...values);
	else if (str instanceof Node) return str;
	return getNode(str);
};
//#endregion
//#region ../../modules/projects/lur.e/src/interactive/modules/HistoryManager.ts
var HistoryManager_exports = /* @__PURE__ */ __exportAll({
	HistoryManager: () => HistoryManager,
	createHistoryManager: () => createHistoryManager
});
var HistoryManager = class {
	storageKey;
	maxEntries;
	autoSave;
	entries = [];
	constructor(options = {}) {
		this.storageKey = options.storageKey || "rs-basic-history";
		this.maxEntries = options.maxEntries || 100;
		this.autoSave = options.autoSave !== false;
		this.loadHistory();
	}
	/**
	* Add a new history entry
	*/
	addEntry(entry) {
		const fullEntry = {
			...entry,
			id: this.generateId(),
			ts: Date.now()
		};
		this.entries.unshift(fullEntry);
		if (this.entries.length > this.maxEntries) this.entries = this.entries.slice(0, this.maxEntries);
		if (this.autoSave) this.saveHistory();
		return fullEntry;
	}
	/**
	* Get all history entries
	*/
	getAllEntries() {
		return [...this.entries];
	}
	/**
	* Get recent entries (last N)
	*/
	getRecentEntries(limit = 10) {
		return this.entries.slice(0, limit);
	}
	/**
	* Get entry by ID
	*/
	getEntryById(id) {
		return this.entries.find((entry) => entry.id === id);
	}
	/**
	* Remove entry by ID
	*/
	removeEntry(id) {
		const index = this.entries.findIndex((entry) => entry.id === id);
		if (index === -1) return false;
		this.entries.splice(index, 1);
		if (this.autoSave) this.saveHistory();
		return true;
	}
	/**
	* Clear all history
	*/
	clearHistory() {
		this.entries = [];
		if (this.autoSave) this.saveHistory();
	}
	/**
	* Search history entries
	*/
	searchEntries(query) {
		const lowercaseQuery = query.toLowerCase();
		return this.entries.filter((entry) => entry.prompt.toLowerCase().includes(lowercaseQuery) || entry.before.toLowerCase().includes(lowercaseQuery) || entry.after.toLowerCase().includes(lowercaseQuery));
	}
	/**
	* Get successful entries only
	*/
	getSuccessfulEntries() {
		return this.entries.filter((entry) => entry.ok);
	}
	/**
	* Get failed entries only
	*/
	getFailedEntries() {
		return this.entries.filter((entry) => !entry.ok);
	}
	/**
	* Get statistics
	*/
	getStatistics() {
		const total = this.entries.length;
		const successful = this.entries.filter((e) => e.ok).length;
		const failed = total - successful;
		const avgDuration = this.entries.filter((e) => e.duration).reduce((sum, e) => sum + (e.duration || 0), 0) / Math.max(1, this.entries.filter((e) => e.duration).length);
		return {
			total,
			successful,
			failed,
			successRate: total > 0 ? successful / total * 100 : 0,
			averageDuration: avgDuration || 0
		};
	}
	/**
	* Export history as JSON
	*/
	exportHistory() {
		return JSON.stringify(this.entries, null, 2);
	}
	/**
	* Import history from JSON
	*/
	importHistory(jsonData) {
		try {
			const importedEntries = JSON.parse(jsonData);
			if (!Array.isArray(importedEntries)) throw new Error("Invalid history data: not an array");
			for (const entry of importedEntries) if (typeof entry.ts !== "number" || typeof entry.prompt !== "string") throw new Error("Invalid history entry: missing required fields");
			const entriesWithIds = importedEntries.map((entry) => ({
				...entry,
				id: entry.id || this.generateId()
			}));
			const existingIds = new Set(this.entries.map((e) => e.id));
			const newEntries = entriesWithIds.filter((e) => !existingIds.has(e.id));
			this.entries.unshift(...newEntries);
			if (this.entries.length > this.maxEntries) this.entries = this.entries.slice(0, this.maxEntries);
			if (this.autoSave) this.saveHistory();
			return true;
		} catch (error) {
			console.error("Failed to import history:", error);
			return false;
		}
	}
	/**
	* Create history view component
	*/
	createHistoryView(onEntrySelect) {
		const container = H`<div class="history-view">
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
        ${this.entries.length === 0 ? H`<div class="empty-history">No history yet. Start processing some content!</div>` : this.entries.map((entry) => this.createHistoryItem(entry, onEntrySelect))}
      </div>
    </div>`;
		container.addEventListener("click", (e) => {
			const target = e.target;
			const action = target.getAttribute("data-action");
			const entryId = target.getAttribute("data-entry-id");
			if (action === "clear-history") {
				if (confirm("Are you sure you want to clear all history?")) {
					this.clearHistory();
					const newContainer = this.createHistoryView(onEntrySelect);
					container.replaceWith(newContainer);
				}
			} else if (action === "export-history") this.exportHistoryToFile();
			else if (action === "use-entry" && entryId) {
				const entry = this.getEntryById(entryId);
				if (entry) onEntrySelect?.(entry);
			}
		});
		return container;
	}
	/**
	* Create compact history display (for recent activity)
	*/
	createRecentHistoryView(limit = 3, onEntrySelect) {
		const recentEntries = this.getRecentEntries(limit);
		const container = H`<div class="recent-history">
      <div class="recent-header">
        <h4>Recent Activity</h4>
        <button class="btn small" data-action="view-full-history">View All</button>
      </div>

      ${recentEntries.length === 0 ? H`<div class="no-recent">No recent activity</div>` : recentEntries.map((entry) => this.createCompactHistoryItem(entry, onEntrySelect))}
    </div>`;
		container.addEventListener("click", (e) => {
			const target = e.target;
			const action = target.getAttribute("data-action");
			const entryId = target.getAttribute("data-entry-id");
			if (action === "view-full-history") console.log("View full history requested");
			else if (action === "use-entry" && entryId) {
				const entry = this.getEntryById(entryId);
				if (entry) onEntrySelect?.(entry);
			}
		});
		return container;
	}
	createStatsDisplay() {
		const stats = this.getStatistics();
		return H`<div class="stats-grid">
      <div class="stat-item">
        <span class="stat-value">${stats.total}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-item">
        <span class="stat-value success">${stats.successful}</span>
        <span class="stat-label">Success</span>
      </div>
      <div class="stat-item">
        <span class="stat-value error">${stats.failed}</span>
        <span class="stat-label">Failed</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${stats.successRate.toFixed(1)}%</span>
        <span class="stat-label">Success Rate</span>
      </div>
    </div>`;
	}
	createHistoryItem(entry, onEntrySelect) {
		const time = new Date(entry.ts).toLocaleString();
		const duration = entry.duration ? ` (${(entry.duration / 1e3).toFixed(1)}s)` : "";
		return H`<div class="history-item ${entry.ok ? "success" : "error"}">
      <div class="history-meta">
        <span class="history-status ${entry.ok ? "success" : "error"}">
          ${entry.ok ? "✓" : "✗"}
        </span>
        <span class="history-time">${time}${duration}</span>
        ${entry.model ? H`<span class="history-model">${entry.model}</span>` : ""}
      </div>

      <div class="history-content">
        <div class="history-prompt">${entry.prompt}</div>
        <div class="history-input">Input: ${entry.before}</div>
        ${entry.error ? H`<div class="history-error">Error: ${entry.error}</div>` : ""}
      </div>

      <div class="history-actions">
        <button class="btn small" data-action="use-entry" data-entry-id="${entry.id}">Use Prompt</button>
        ${entry.ok ? H`<button class="btn small" data-action="view-result" data-entry-id="${entry.id}">View Result</button>` : ""}
      </div>
    </div>`;
	}
	createCompactHistoryItem(entry, onEntrySelect) {
		const time = new Date(entry.ts).toLocaleString();
		const shortPrompt = entry.prompt.length > 40 ? entry.prompt.substring(0, 40) + "..." : entry.prompt;
		return H`<div class="history-item-compact ${entry.ok ? "success" : "error"}">
      <div class="history-meta">
        <span class="history-status ${entry.ok ? "success" : "error"}">${entry.ok ? "✓" : "✗"}</span>
        <span class="history-prompt">${shortPrompt}</span>
      </div>
      <div class="history-time">${time}</div>
      <button class="btn small" data-action="use-entry" data-entry-id="${entry.id}">Use</button>
    </div>`;
	}
	exportHistoryToFile() {
		const data = this.exportHistory();
		const blob = new Blob([data], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `ai-history-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
		document.body.append(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
	}
	generateId() {
		return `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}
	loadHistory() {
		try {
			if (typeof localStorage === "undefined") return;
			const stored = localStorage.getItem(this.storageKey);
			if (stored) {
				const parsedEntries = JSON.parse(stored);
				this.entries = parsedEntries.map((entry) => ({
					...entry,
					id: entry.id || this.generateId()
				}));
			}
		} catch (error) {
			console.warn("Failed to load history from storage:", error);
			this.entries = [];
		}
	}
	saveHistory() {
		try {
			if (typeof localStorage === "undefined") return;
			localStorage.setItem(this.storageKey, JSON.stringify(this.entries));
		} catch (error) {
			console.warn("Failed to save history to storage:", error);
		}
	}
};
/**
* Utility function to create a history manager
*/
function createHistoryManager(options) {
	return new HistoryManager(options);
}
//#endregion
export { bindWith as A, $observeAttribute as C, alives as D, addToBank as E, reflectControllers as M, removeFromBank as N, bindCtrl as O, $mapped as S, $virtual as T, isEffectivelyEmptyStyleText as _, html as a, pruneEmptyStyleAttribute as b, E as c, Q as d, C as f, compileInlineStyleAttribute as g, bindStyle as h, H as i, elMap$1 as j, bindHandler as k, Qp as l, applyNormalizedInlineStyle as m, HistoryManager_exports as n, htmlBuilder as o, S as p, createHistoryManager as r, $createElement as s, HistoryManager as t, M as u, isNativeCSSStyleValue as v, $observeInput as w, $behavior as x, isReactiveStyleValue as y };
