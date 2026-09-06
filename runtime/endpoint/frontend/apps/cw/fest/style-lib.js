import { $avoidTrigger as cr, $getValue as rt, camelToKebab as ce, deref as nt, getOrInsertComputed as ur, hasValue as qe, isVal as fr, isValueUnit as dr, toRef as ot, tryStringAsNumber as At } from "/fest/core.js";
import { addToCallChain as pr, affected as hr } from "/fest/object.js";
var b = (e, t) => globalThis[Symbol.for(e)] ??= t(), W = b("dom.ts@blobURLMap", () => /* @__PURE__ */ new WeakMap()), U = b("dom.ts@cacheMap", () => /* @__PURE__ */ new Map()), H = b("dom.ts@cacheContentMap", () => /* @__PURE__ */ new Map()), de = b("dom.ts@cacheBlobContentMap", () => /* @__PURE__ */ new WeakMap()), it = b("dom.ts@adoptedSelectorMap", () => /* @__PURE__ */ new Map()), st = b("dom.ts@adoptedShadowSelectorMap", () => /* @__PURE__ */ new WeakMap()), at = b("dom.ts@adoptedLayerMap", () => /* @__PURE__ */ new Map()), pe = b("dom.ts@adoptedShadowLayerMap", () => /* @__PURE__ */ new WeakMap()), T = b("dom.ts@adoptedMap", () => /* @__PURE__ */ new Map()), V = b("dom.ts@adoptedBlobMap", () => /* @__PURE__ */ new WeakMap()), D = b("dom.ts@adoptedAppliedText", () => /* @__PURE__ */ new WeakMap()), Rt = b("dom.ts@adoptedFilled", () => /* @__PURE__ */ new WeakSet()), ao = b("dom.ts@layerCounter", () => 0), Tt = b("dom.ts@styleTreeHooks", () => /* @__PURE__ */ new Set()), be = b("dom.ts@styleTreeObserved", () => /* @__PURE__ */ new WeakSet()), yr = b("dom.ts@styleTreeRoots", () => /* @__PURE__ */ new Set()), R = b("style-lib@bakedStyle", () => /* @__PURE__ */ new WeakMap()), I = b("style-lib@bakedLive", () => /* @__PURE__ */ new Set()), L = b("style-lib@bakedCache", () => /* @__PURE__ */ new Map()), Ue = b("style-lib@rebakeBatch", () => /* @__PURE__ */ new Set()), G = b("style-lib@bakedFollowers", () => /* @__PURE__ */ new WeakMap()), Be = b("lur.e@adoptedStyleSheetsCache", () => /* @__PURE__ */ new WeakMap()), mr = b("lur.e@styleCache", () => /* @__PURE__ */ new Map()), Sr = b("lur.e@styleElementCache", () => /* @__PURE__ */ new WeakMap()), Ee = b("style-lib@styleFlushPending", () => /* @__PURE__ */ new WeakSet()), lt = b("style-lib@registeredProperties", () => /* @__PURE__ */ new Set()), Ce = b("style.ts@animKeyframeRefs", () => /* @__PURE__ */ new Map()), vr = [
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
], gr = new Set(vr), wr = {
  "%": "percent",
  q: "Q",
  hz: "Hz",
  khz: "kHz",
  fr: "flex"
}, Lt = /^(%|[a-zA-Z]+)/, $t = [
  "color",
  "background-color",
  "border-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "outline-color",
  "accent-color",
  "caret-color",
  "text-decoration-color",
  "column-rule-color",
  "fill",
  "stroke",
  "flood-color",
  "lighting-color",
  "stop-color"
], br = [
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "font-stretch",
  "line-height",
  "letter-spacing",
  "word-spacing"
], Er = [
  "transition-duration",
  "transition-timing-function",
  "animation-duration",
  "animation-timing-function"
], Pt = [
  "data-theme",
  "data-explorer-color-scheme",
  "data-color-scheme",
  "theme",
  "color-scheme"
], Cr = [
  ...Pt,
  "style",
  "class"
], lo = [
  "tokens",
  "colors",
  "typography",
  "motion"
], xr = [
  "tokens",
  "base",
  "layout",
  "components",
  "utilities",
  "theme",
  "overrides",
  "print"
], kr = ["ux-preload", "ux-layer"], Mr = [
  "rs-md-base",
  "rs-md-system",
  "rs-md-modules",
  "rs-md-user",
  "rs-md-print",
  "rs-md-user-print"
], co = Mr, Ar = /^[a-zA-Z0-9_.-]+$/, Rr = /^@layer\s+([a-zA-Z0-9_.-]+)\s*\{/, uo = "DOM", ct = "data-glit-host-css", Ot = "ux-baked", Tr = ["colors", "tokens"], ze = 3e4, ue = "screen", Lr = [
  "ui-window-frame",
  "ui-modal",
  "app-box",
  ".ui-modal-dialog",
  ".ui-modal-panel"
], It = [
  ".row.c2-surface",
  ".row.c2-surface[data-kind=directory]",
  ".row.c2-surface[data-kind=file]",
  ".row.c2-surface .c.name",
  ".fm-grid-header"
], Ut = [
  ".field",
  ".form-input",
  ".form-select",
  ".field-control"
], $r = [...It, ...Ut], Bt = /* @__PURE__ */ Symbol.for("fest.animatable"), fo = "ux-anim", N = "--fest-t", ge = typeof CSSStyleValue < "u" && typeof CSSUnitValue < "u", Pr = (e) => wr[e.toLowerCase()] ?? e.toLowerCase(), Or = (e) => e.toLowerCase() === "%" ? "percent" : e.toLowerCase(), po = (e) => Ar.test(e), Ir = (e) => `@layer ${e} {}`, Ur = (e) => {
  let t = String(e || "").trim();
  t = t.replace(/^(@charset\s+[^;]+;\s*)+/i, "");
  for (let r = 0; r < 8; r++) {
    const n = t.replace(/^\/\*[\s\S]*?\*\/\s*/, "");
    if (n === t) break;
    t = n.trim();
  }
  return t;
}, ut = (e) => typeof CSSLayerBlockRule < "u" && e instanceof CSSLayerBlockRule, z = () => typeof globalThis < "u" && typeof globalThis.CSSStyleSheet == "function", ft = (e) => typeof e == "string" && /@import\b/i.test(e), _t = (e, t) => typeof e?.then == "function" ? e?.then?.(t) : t(e), Q = (e) => typeof ShadowRoot < "u" && e instanceof ShadowRoot, dt = (e) => typeof Document < "u" && e instanceof Document, Br = (e) => typeof Element < "u" && e instanceof Element, pt = (e) => typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(e) : Array.from(e).map((t) => `\\${t.codePointAt(0).toString(16)} `).join(""), _r = 0, Nr = () => typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `ux-${Date.now().toString(36)}-${(++_r).toString(36)}`, Vr = (e) => {
  try {
    return typeof URL < "u" && typeof URL.canParse == "function" && URL.canParse(e);
  } catch {
    return !1;
  }
}, ho = async (e) => {
  const t = await crypto?.subtle?.digest("SHA-256", typeof e == "string" ? new TextEncoder().encode(e) : e instanceof ArrayBuffer ? e : await e?.arrayBuffer?.());
  return "sha256-" + btoa(String.fromCharCode.apply(null, new Uint8Array(t)));
}, ht = (e, t) => e.endsWith("%") ? parseFloat(e) / 100 * t() : parseFloat(e), Fr = (e, t) => {
  const r = e.split(" ");
  return new DOMPoint(ht(r[0], () => t.clientWidth), ht(r[1], () => t.clientHeight));
}, B = (e, t = 0) => {
  if (typeof e == "number") return e;
  if (!e) return t;
  const r = String(e).trim();
  return r.endsWith("ms") ? parseFloat(r) : r.endsWith("s") ? parseFloat(r) * 1e3 : parseFloat(r) || t;
}, Nt = (e) => e === void 0 ? 1 : e === -1 || e === 1 / 0 ? 1 / 0 : Math.max(1, Math.floor(e)), Dr = (e) => e === -1 || e === 1 / 0 ? 1 / 0 : Math.max(1, e ?? 1), X = (e) => e != null && typeof e == "object" && e.kind === "scroll", ne = (e) => e != null && typeof e == "object" && e.kind === "view", oe = (e) => !e || e.nodeType !== 1 ? !1 : !!(String(e.localName || "").includes("-") || e.shadowRoot || e.styles != null), Vt = (e) => {
  try {
    return e.cssRules.length;
  } catch {
    return null;
  }
}, yo = (e) => {
  if (!e) return !0;
  const t = Vt(e);
  return t === null ? !1 : t === 0;
}, jr = (e) => e === "--base-color" || e.startsWith("--color-") || e.endsWith("-color") || e.endsWith("-fg") || e.endsWith("-bg"), qr = (e) => {
  if (!e.isConnected) return !1;
  if (typeof e.getClientRects != "function") return !0;
  try {
    return e.getClientRects().length > 0;
  } catch {
    return !0;
  }
}, zr = (e) => Array.isArray(e) && typeof e[0] == "function", Ft = (e) => {
  const t = typeof e == "string" ? e.trim() : "";
  if (!t) return !0;
  for (const r of t.split(";")) {
    const n = r.trim();
    if (!n) continue;
    const o = n.indexOf(":");
    if (o < 0 || n.slice(o + 1).trim().length > 0) return !1;
  }
  return !0;
}, Wr = (e) => {
  if (e == null) return;
  const t = e.getAttribute("style");
  t != null && Ft(t) && (e.style.cssText = "", e.removeAttribute("style"));
}, Hr = (e, t) => {
  if (Ft(t)) {
    e.style.cssText = "", e.removeAttribute("style");
    return;
  }
  e.style.cssText = t;
}, $ = (e) => {
  if (e == null || typeof e != "object") return !1;
  try {
    const t = globalThis.CSSStyleValue;
    if (typeof t == "function" && e instanceof t) return !0;
    for (let r = e; r; r = Object.getPrototypeOf(r)) if (r?.constructor?.name === "CSSStyleValue") return !0;
  } catch {
  }
  return !1;
}, fe = (e) => {
  if (e == null || typeof e != "object" || $(e)) return !1;
  try {
    return "value" in e;
  } catch {
    return !1;
  }
}, yt = (e) => e == null || typeof e != "object" && typeof e != "function", ie = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), mt = (e, t) => new RegExp(`var\\(\\s*${ie(t)}\\s*\\)`).test(e), Kr = (e) => {
  const t = Lt.exec(e);
  if (!t) return null;
  const r = t[0], n = r.toLowerCase();
  return gr.has(n) ? {
    authored: r,
    normalized: n,
    length: r.length
  } : null;
}, j = (e, t) => e?.[t] ?? globalThis?.[t], M = (e, t, r) => {
  const n = e?.CSS, o = Pr(t), i = n?.[o];
  if (typeof i == "function") return i.call(n, r);
  const a = j(e, "CSSUnitValue");
  if (typeof a != "function") throw new TypeError(`Typed OM does not support CSS unit "${t}"`);
  return new a(r, Or(t));
}, mo = (e) => ge && e instanceof CSSStyleValue, he = (e) => ge && e instanceof CSSUnitValue, Se = (e, t) => {
  if (!e || !t) return null;
  const n = ((o) => {
    try {
      const i = o.querySelector?.(t);
      return i instanceof HTMLElement ? i : null;
    } catch {
      return null;
    }
  })(e);
  if (n) return n;
  if (e instanceof Element && e.shadowRoot) {
    const o = Se(e.shadowRoot, t);
    if (o) return o;
  }
  if (typeof e.querySelectorAll != "function") return null;
  for (const o of e.querySelectorAll("*")) {
    if (!o.shadowRoot) continue;
    const i = Se(o.shadowRoot, t);
    if (i) return i;
  }
  return null;
}, We = (...e) => {
  const t = /* @__PURE__ */ new Set(), r = [];
  for (const n of e) {
    if (n == null) continue;
    const o = typeof n == "string" ? [n] : n;
    for (const i of o) {
      const a = String(i || "").trim();
      !a || t.has(a) || (t.add(a), r.push(a));
    }
  }
  return r.length ? `@layer ${r.join(", ")};` : "";
}, So = () => We(xr), vo = (e) => We(kr, e), He = (e, t) => {
  const r = (t || "").trim();
  return !e || !r ? "" : `@layer ${e} {
${r}
}`;
}, xe = (e, t) => t ? `@layer ${t} { ${e} }` : e, go = (e, t) => {
  const r = (t || "").trim();
  return r ? /^@layer\b/.test(r) ? r : He(e, r) : "";
}, Yr = (e, t) => {
  const r = e.match(Rr);
  if (!r || t && r[1] !== t) return null;
  const n = r[0].lastIndexOf("{");
  let o = 0;
  for (let i = n; i < e.length; i++) {
    const a = e[i];
    if (a === "{") o++;
    else if (a === "}" && (o--, o === 0))
      return e.slice(i + 1).trim() ? null : e.slice(n + 1, i).trim();
  }
  return null;
}, wo = (e, t) => {
  const r = Ur(e);
  return Yr(r, t) ?? r;
}, Zr = (e, t = "") => `@import url("${e}") ${t && typeof t == "string" ? `layer(${t})` : ""};`, bo = He("ux-preload", ":host { box-sizing: border-box; }"), Ke = (e, t) => {
  if (!e || !t) return;
  const r = Array.from(e.cssRules || []), n = r.find((o) => ut(o) && o.name === t);
  if (n) return n;
  try {
    const o = e.insertRule(Ir(t), r.length), i = e.cssRules?.[o];
    return ut(i) ? i : void 0;
  } catch {
    return;
  }
}, Gr = (e) => {
  const t = [];
  let r = 0;
  for (; r < e.length; ) {
    const n = e.slice(r), o = /^\s+/.exec(n);
    if (o) {
      r += o[0].length;
      continue;
    }
    const i = /^(?:\d*\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?/.exec(n);
    if (i) {
      r += i[0].length;
      const l = Lt.exec(e.slice(r)), c = l?.[0] ?? null;
      l && (r += l[0].length), t.push({
        kind: "number",
        value: Number(i[0]),
        unit: c == null ? null : c.toLowerCase()
      });
      continue;
    }
    const a = /^[a-zA-Z_][a-zA-Z0-9_-]*/.exec(n);
    if (a) {
      t.push({
        kind: "identifier",
        value: a[0].toLowerCase()
      }), r += a[0].length;
      continue;
    }
    const s = n[0];
    if ([
      "+",
      "-",
      "*",
      "/",
      "(",
      ")",
      ","
    ].includes(s)) {
      t.push({
        kind: "symbol",
        value: s
      }), r++;
      continue;
    }
    throw new SyntaxError(`Unsupported token near "${n}"`);
  }
  return t;
}, Qr = class {
  tokens;
  win;
  index = 0;
  constructor(e, t) {
    this.tokens = e, this.win = t;
  }
  parse() {
    const e = this.parseSum();
    if (this.index !== this.tokens.length) throw new SyntaxError("Unexpected trailing expression");
    return e;
  }
  current() {
    return this.tokens[this.index];
  }
  consume() {
    const e = this.tokens[this.index];
    if (!e) throw new SyntaxError("Unexpected end of expression");
    return this.index++, e;
  }
  consumeSymbol(e) {
    const t = this.consume();
    if (t.kind !== "symbol" || t.value !== e) throw new SyntaxError(`Expected "${e}"`);
  }
  matchesSymbol(e) {
    const t = this.current();
    return t?.kind === "symbol" && t.value === e;
  }
  createMath(e, ...t) {
    const r = j(this.win, e);
    if (typeof r != "function") throw new TypeError(`${e} is not supported`);
    return new r(...t);
  }
  parseSum() {
    let e = this.parseProduct();
    for (; this.matchesSymbol("+") || this.matchesSymbol("-"); ) {
      const t = this.consume(), r = this.parseProduct();
      if (t.kind !== "symbol") throw new SyntaxError("Expected sum operator");
      t.value === "+" ? e = this.createMath("CSSMathSum", e, r) : e = this.createMath("CSSMathSum", e, this.createMath("CSSMathNegate", r));
    }
    return e;
  }
  parseProduct() {
    let e = this.parseUnary();
    for (; this.matchesSymbol("*") || this.matchesSymbol("/"); ) {
      const t = this.consume(), r = this.parseUnary();
      if (t.kind !== "symbol") throw new SyntaxError("Expected product operator");
      t.value === "*" ? e = this.createMath("CSSMathProduct", e, r) : e = this.createMath("CSSMathProduct", e, this.createMath("CSSMathInvert", r));
    }
    return e;
  }
  parseUnary() {
    return this.matchesSymbol("+") ? (this.consume(), this.parseUnary()) : this.matchesSymbol("-") ? (this.consume(), this.createMath("CSSMathNegate", this.parseUnary())) : this.parsePrimary();
  }
  parsePrimary() {
    const e = this.consume();
    if (e.kind === "number") return M(this.win, e.unit ?? "number", e.value);
    if (e.kind === "symbol" && e.value === "(") {
      const t = this.parseSum();
      return this.consumeSymbol(")"), t;
    }
    if (e.kind === "identifier") return this.parseFunction(e.value);
    throw new SyntaxError("Expected a numeric value");
  }
  parseFunction(e) {
    if (this.consumeSymbol("("), e === "calc") {
      const r = this.parseSum();
      return this.consumeSymbol(")"), r;
    }
    const t = [];
    if (!this.matchesSymbol(")"))
      for (t.push(this.parseSum()); this.matchesSymbol(","); )
        this.consume(), t.push(this.parseSum());
    if (this.consumeSymbol(")"), e === "min") {
      if (t.length === 0) throw new SyntaxError("min() requires a value");
      return this.createMath("CSSMathMin", ...t);
    }
    if (e === "max") {
      if (t.length === 0) throw new SyntaxError("max() requires a value");
      return this.createMath("CSSMathMax", ...t);
    }
    if (e === "clamp") {
      if (t.length !== 3) throw new SyntaxError("clamp() requires three values");
      return this.createMath("CSSMathClamp", t[0], t[1], t[2]);
    }
    throw new SyntaxError(`Unsupported function "${e}"`);
  }
}, Xr = (e, t) => {
  try {
    const r = Gr(e);
    return new Qr(r, t).parse();
  } catch {
    return null;
  }
}, O = (e, t, r, n = "") => {
  if (!(!e || !t)) {
    if (r == null) {
      e.getPropertyValue(t) !== "" && e.removeProperty(t);
      return;
    }
    e.getPropertyValue(t) !== r && e.setProperty(t, r, n);
  }
}, Jr = (e, t, r, n = "") => {
  if (!e || !t) return e;
  const o = ce(t), i = e.style, a = e.attributeStyleMap ?? e.styleMap;
  if (!ge || !a) return Dt(e, t, r, n);
  const s = e.ownerDocument?.defaultView ?? globalThis;
  let l = qe(r) && fe(r) ? r.value : r;
  if (l == null)
    return a.delete?.(o), i && O(i, o, null, n), e;
  if ($(l)) {
    const c = a.get(o);
    if (he(l) && he(c)) {
      if (c.value === l.value && c.unit === l.unit) return e;
    } else if (c === l) return e;
    return a.set(o, l), e;
  }
  if (typeof l == "number")
    if (CSS?.number && !o.startsWith("--")) {
      const c = CSS.number(l), u = a.get(o);
      return he(u) && u.value === c.value && u.unit === c.unit || a.set(o, c), e;
    } else
      return O(i, o, String(l), n), e;
  if (typeof l == "string") {
    if (/\b(calc|min|max|clamp)\s*\(/.test(l)) {
      const u = Xr(l, s);
      if (u) try {
        return a.set(o, u), e;
      } catch {
      }
    }
    const c = At(l);
    if (typeof c == "number" && CSS?.number && !o.startsWith("--")) {
      const u = CSS.number(c), f = a.get(o);
      return he(f) && f.value === u.value && f.unit === u.unit || a.set(o, u), e;
    }
    return O(i, o, l, n), e;
  }
  return O(i, o, String(l), n), e;
}, Dt = (e, t, r, n = "") => {
  if (!e || !t) return e;
  const o = ce(t), i = e.style;
  if (!i) return e;
  let a = qe(r) && fe(r) ? r.value : r;
  return typeof a == "string" && !$(a) && (a = At(a) ?? a), a == null ? (O(i, o, null, n), e) : ($(a) || typeof a == "number", O(i, o, String(a), n), e);
}, we = (e, t, r, n = "") => ge ? Jr(e, t, r, n) : Dt(e, t, r, n), St = (e, t, r) => {
  const n = e?.style;
  return !t || typeof t != "string" || !e || !n || cr(r, () => {
    fr(r) || qe(r) || dr(r) ? we(e, t, r) : r == null && e.style.removeProperty(ce(t));
  }), e;
}, Eo = (e, t, r) => we(Ze(e), t, r), en = (e, t) => {
  const r = Ze(e);
  return Object.entries(t).forEach(([n, o]) => we(r, n, o)), r;
}, jt = (e, t, r = "", n) => {
  const o = un(e), i = typeof e == "string" && URL.canParse(e) ? e : o;
  return t?.[0] && (t[0].fetchPriority = "high"), t && i && typeof i == "string" && vt(t, i, r), t?.[0] && (!URL.canParse(e) || n) && t?.[0] instanceof HTMLLinkElement, _t(o, (a) => {
    t?.[0] && a && (vt(t, a, r), t?.[0].setAttribute("loaded", ""));
  })?.catch?.((a) => {
    console.warn("Failed to load style sheet:", a);
  });
}, tn = (e) => {
  const t = typeof document < "u" ? document.createElement("link") : null;
  return t && (t.fetchPriority = "high"), t ? (Object.assign(t, {
    rel: "stylesheet",
    type: "text/css",
    crossOrigin: "same-origin"
  }), t.dataset.owner = "DOM", jt(e, [t, "href"]), typeof document < "u" && document.head.append(t), t) : null;
}, P = (e, t = typeof document < "u" ? document?.head : null, r = "") => {
  const n = t?.querySelector?.("head") ?? t;
  if (typeof HTMLHeadElement < "u" && n instanceof HTMLHeadElement) return tn(e);
  const o = typeof document < "u" ? document.createElement("style") : null;
  return o ? (o.dataset.owner = "DOM", jt(e, [o, "innerHTML"], r), n?.prepend?.(o), o) : null;
}, Co = (e, t, r, n = "") => we(e, t, r, n), xo = (e) => qt(e, ""), _e = (e, t) => {
  D.set(e, t), Rt.add(e);
}, F = (e) => {
  if (!e) return null;
  const t = D.get(e);
  if (t) return t;
  for (const [r, n] of T) if (n === e && typeof r == "string") return r;
  return null;
}, se = (e, t) => {
  if (!e) return !1;
  const r = t || F(e), n = Vt(e);
  return n === null ? !1 : n > 0 ? (Rt.add(e), r && !D.has(e) && D.set(e, r), !0) : r && Ne(e, r) ? (_e(e, r), !0) : !1;
}, Ne = (e, t) => {
  if (!e || !t) return !1;
  try {
    return e.replaceSync(t), !0;
  } catch (r) {
    const n = String(r?.message || "").toLowerCase();
    return n.includes("@import rules are not allowed") || n.includes("@import") && n.includes("not allowed") || console.warn("[DOM] Failed to apply adopted stylesheet:", r), !1;
  }
}, rn = (e) => {
  let t = V.get(e);
  return t || (t = new CSSStyleSheet(), V.set(e, t)), t;
}, qt = (e, t = null) => {
  try {
    return nn(e, t);
  } catch (r) {
    return console.warn("[DOM] loadAsAdopted failed", r), typeof e == "string" && P(e, void 0, t || ""), null;
  }
}, nn = (e, t = null) => {
  if (!z())
    return typeof e == "string" && P(e, void 0, t || ""), null;
  if (typeof e == "string" && ft(e))
    return P(e, void 0, t || ""), null;
  if (typeof e == "string" && T?.has?.(e)) {
    const n = T.get(e), o = D.get(n) || xe(e, t);
    return se(n, o), typeof document < "u" && document.adoptedStyleSheets && !document.adoptedStyleSheets.includes(n) && document.adoptedStyleSheets.push(n), n;
  }
  if ((e instanceof Blob || e instanceof File) && V?.has?.(e)) {
    const n = V.get(e);
    return se(n), typeof document < "u" && document.adoptedStyleSheets && !document.adoptedStyleSheets.includes(n) && document.adoptedStyleSheets.push(n), n;
  }
  if (!e) return null;
  const r = typeof e == "string" ? ur(T, e, () => new CSSStyleSheet()) : rn(e);
  if (typeof document < "u" && document.adoptedStyleSheets && !document.adoptedStyleSheets.includes(r) && document.adoptedStyleSheets.push(r), typeof e == "string" && !Vr(e)) {
    const n = xe(e, t);
    return T.set(e, r), Ne(r, n) ? _e(r, n) : (ke(r), T.delete(e), P(e)), r;
  } else _t(fn(e), (n) => {
    if (T.set(n, r), n) {
      if (ft(n))
        return ke(r), T.delete(n), V.delete(e), P(n, void 0, t || ""), r;
      const o = xe(n, t);
      return Ne(r, o) ? _e(r, o) : (ke(r), T.delete(n), V.delete(e), P(n, void 0, t || "")), r;
    }
  });
  return r;
}, zt = (e, t) => {
  if (!(!e || e.nodeType === 3)) {
    if (e.nodeType === 11) {
      for (const r of e.childNodes || []) zt(r, t);
      return;
    }
    if (oe(e) && t.add(e), typeof e.querySelectorAll == "function")
      try {
        for (const r of e.querySelectorAll("*")) oe(r) && t.add(r);
      } catch {
      }
  }
}, on = (e, t = "tree") => {
  for (const r of e)
    if (oe(r))
      for (const n of Tt) n(r, t);
}, Wt = (e) => {
  typeof e == "function" && Tt.add(e);
}, ko = (e) => {
  if (!e || typeof MutationObserver > "u" || be.has(e)) return e;
  be.add(e), yr.add(e);
  const t = new MutationObserver((r) => {
    const n = /* @__PURE__ */ new Set();
    for (const o of r) if (o.type === "childList") {
      for (const a of o.addedNodes) zt(a, n);
      const i = o.target?.getRootNode?.();
      if (i instanceof ShadowRoot && oe(i.host)) {
        const a = i.adoptedStyleSheets;
        (!a || a.length === 0) && n.add(i.host);
      }
    } else o.type === "attributes" && o.target && oe(o.target) && n.add(o.target);
    on(n, "mutation");
  });
  try {
    t.observe(e, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: [...Pt]
    });
  } catch {
    return be.delete(e), e;
  }
  return e;
}, Mo = () => {
  if (typeof document > "u") return;
  const e = typeof URL < "u" && typeof URL.canParse == "function";
  for (const [t, r] of T) {
    if (!r || typeof t != "string" || e && URL.canParse(t)) continue;
    const n = D.get(r) || t;
    se(r, n), document.adoptedStyleSheets && !document.adoptedStyleSheets.includes(r) && document.adoptedStyleSheets.push(r);
  }
}, ke = (e) => {
  if (!e) return !1;
  const t = typeof e == "string" ? T.get(e) : e;
  if (!t || typeof document > "u") return !1;
  const r = document.adoptedStyleSheets, n = r.indexOf(t);
  return n !== -1 ? (r.splice(n, 1), !0) : !1;
}, Ao = (e) => {
  if (e?.computedStyleMap) {
    const t = e.computedStyleMap().get("transform")?.toMatrix?.();
    if (t) return t;
  } else if (e) {
    const t = getComputedStyle(e);
    return new DOMMatrix(t?.getPropertyValue?.("transform"));
  }
  return new DOMMatrix();
}, Ro = (e) => {
  const t = getComputedStyle(e)?.getPropertyValue?.("transform-origin") || "50% 50%";
  return Fr(t, e);
}, Y = (e, t) => {
  if ("computedStyleMap" in e) {
    const r = e?.computedStyleMap?.()?.get(t);
    return r instanceof CSSUnitValue ? r?.value || 0 : r?.toString?.();
  }
  if (e instanceof HTMLElement) {
    const r = getComputedStyle?.(e, "");
    return parseFloat(r?.getPropertyValue?.(t)?.replace?.("px", "")) || 0;
  }
  return parseFloat((e?.style ?? e).getPropertyValue?.(t)?.replace?.("px", "")) || 0;
}, To = (e) => {
  let t = 1, r = e;
  for (; r; ) {
    if ("currentCSSZoom" in r) {
      const o = r.currentCSSZoom;
      if (typeof o == "number") return t *= o;
    }
    const n = getComputedStyle(r);
    if (n.zoom && n.zoom !== "normal") return t *= parseFloat(n.zoom);
    if (n.zoom && n.zoom !== "normal" || "currentCSSZoom" in r) return t;
    r = r?.offsetParent ?? r?.parentElement;
  }
  return t;
}, Lo = (e, t) => Y?.(e, t), $o = (e, t) => t == "inline" ? Y(e, "padding-inline-start") + Y(e, "padding-inline-end") : Y(e, "padding-block-start") + Y(e, "padding-block-end"), J = typeof document < "u" ? document.createElement("style") : null;
J && (document.querySelector("head")?.appendChild?.(J), J.dataset.owner = "DOM");
var vt = (e, t, r = "") => {
  e[0][e[1]] = e[1] == "innerHTML" ? Zr(t, r) : t;
}, Po = (e) => e?.map?.((t) => en(...t)), sn = (e, t) => (t ||= J?.sheet, Ke(t, e)), Ye = (e) => {
  if (e.id) return `#${pt(e.id)}`;
  let t = e.getAttribute("data-style-id");
  return t || (t = Nr(), e.setAttribute("data-style-id", t)), `[data-style-id="${pt(t)}"]`;
}, an = (e, t) => (t = t.trim(), e ? t ? t.startsWith("::") ? `${e}${t}` : `${e} ${t}` : e : t), ln = (e, t, r, n) => {
  const o = Array.from(e?.cssRules || []), i = t.trim(), a = n.trim();
  return o.findIndex((s) => {
    if (!(s instanceof CSSStyleRule)) return !1;
    const l = s.selectorText?.trim?.() ?? "";
    return l === i ? !0 : a && l.endsWith(a) ? l.slice(0, l.length - a.length).trim() === r : !1;
  });
}, Ze = (e, t, r = "ux-query", n = null) => {
  const o = Q(n) || dt(n) ? n : n?.getRootNode?.() ?? (typeof document < "u" ? document : null), i = Br(n) ? n : null;
  let a = "";
  i ? a = Ye(i) : Q(o) ? a = ":host" : dt(o) && (a = ":root");
  let s = null;
  if (Q(o) ? (s = o.querySelector("style[data-ux-query]"), !s && typeof document < "u" && (s = document.createElement("style"), s.setAttribute("data-ux-query", ""), o.appendChild(s))) : s = cn(), t ||= s?.sheet, !t) return;
  if (r) return Ze(e, sn(r, t), null, n);
  const l = an(a, e);
  let c = ln(t, l, a, e);
  return c === -1 && (c = t.insertRule(`${l} {}`)), t.cssRules?.[c];
};
function cn() {
  return J ?? null;
}
var un = (e) => {
  if (!e) return null;
  if (U.has(e)) return U.get(e);
  if (e instanceof Blob || e instanceof File) {
    if (W.has(e)) return W.get(e);
    const t = URL.createObjectURL(e);
    return W.set(e, t), U.set(t, t), t;
  }
  if (URL.canParse(e) || e?.trim?.()?.startsWith?.("./")) {
    const t = fetch(e?.replace?.("?url", "?raw"), {
      cache: "force-cache",
      mode: "same-origin",
      priority: "high"
    })?.then?.(async (r) => {
      const n = await r.blob(), o = URL.createObjectURL(n);
      return W.set(n, o), U.set(e, o), U.set(o, o), o;
    });
    return U.set(e, t), t;
  }
  if (typeof e == "string") {
    const t = new Blob([e], { type: "text/css" }), r = URL.createObjectURL(t);
    return W.set(t, r), U.set(r, r), r;
  }
  return e;
}, fn = (e) => {
  if (!e) return "";
  if (H.has(e)) return H.get(e) ?? "";
  if (e instanceof Blob || e instanceof File) {
    if (de.has(e)) return de.get(e) ?? "";
    const t = e?.text?.()?.then?.((r) => (de.set(e, r), r));
    return de.set(e, t), t;
  }
  if (URL.canParse(e) || e?.trim?.()?.startsWith?.("./")) {
    const t = fetch(e?.replace?.("?url", "?raw"), {
      cache: "force-cache",
      mode: "same-origin",
      priority: "high"
    })?.then?.(async (r) => {
      const n = await r.text();
      return H.set(e, n), n;
    });
    return H.set(e, t), t;
  }
  return typeof e == "string" && H.set(e, e), e;
}, Oo = (e, t = "ux-query", r = null) => {
  if (!e || !z()) return null;
  const n = Q(r) ? r : r?.getRootNode ? r.getRootNode({ composed: !0 }) : null, o = Q(n), i = o ? n.adoptedStyleSheets : typeof document < "u" ? document.adoptedStyleSheets : null;
  if (!i) return null;
  const a = `${t || ""}:${e}`;
  let s;
  if (o) {
    let u = st.get(n);
    u || (u = /* @__PURE__ */ new Map(), st.set(n, u)), s = u.get(a), s || (s = new CSSStyleSheet(), u.set(a, s), i.includes(s) || i.push(s));
  } else
    s = it.get(a), s || (s = new CSSStyleSheet(), it.set(a, s), i.includes(s) || i.push(s));
  if (t) {
    let u;
    if (o) {
      let f = pe.get(n);
      f || (f = /* @__PURE__ */ new Map(), pe.set(n, f)), u = f.get(t);
    } else u = at.get(t);
    if (!u && (u = Ke(s, t), u))
      if (o) {
        let f = pe.get(n);
        f || (f = /* @__PURE__ */ new Map(), pe.set(n, f)), f.set(t, u);
      } else at.set(t, u);
    if (u) {
      let f = Array.from(u.cssRules || []).findIndex((h) => h instanceof CSSStyleRule && h.selectorText?.trim?.() === e?.trim?.());
      if (f === -1) try {
        f = u.insertRule(`${e} {}`, u.cssRules.length);
      } catch {
        return null;
      }
      return u.cssRules[f];
    }
  }
  let l = Array.from(s.cssRules || []).findIndex((u) => u instanceof CSSStyleRule && u.selectorText?.trim?.() === e?.trim?.());
  if (l === -1) try {
    l = s.insertRule(`${e} {}`, s.cssRules.length);
  } catch {
    return null;
  }
  const c = s.cssRules[l];
  return c instanceof CSSStyleRule ? c : null;
}, gt = !1, ee = "", Ve = !1, dn = (e) => {
  const t = [...e?.length ? e : Tr];
  return [...new Set(t.filter(Boolean))];
}, wt = (e, t, r = ue) => `${e}\0${[...t].sort().join(",")}\0${r === !1 ? "" : r}`, ae = (e = typeof document < "u" ? document.documentElement : null, t) => {
  if (!e || typeof getComputedStyle != "function") return "";
  const r = getComputedStyle(e), n = [
    e.getAttribute?.("data-theme") || e.getAttribute?.("theme") || "",
    e.getAttribute?.("data-color-scheme") || e.getAttribute?.("color-scheme") || r.colorScheme || "",
    r.getPropertyValue("--base-color").trim(),
    r.getPropertyValue("--color-primary").trim()
  ];
  if (t && t !== e) {
    const o = getComputedStyle(t);
    n.push(t.getAttribute?.("data-theme") || "", o.getPropertyValue("--base-color").trim());
  }
  return n.join("|");
}, ye = (e, t, r) => {
  const n = t.getPropertyValue(r)?.trim();
  n && e.set(r, n);
}, pn = new Set($t), bt = (e) => e.startsWith("--") ? 2 : pn.has(e) ? 0 : 1, hn = (e, t) => {
  const r = /* @__PURE__ */ new Map(), n = new Set(t);
  if (n.has("colors")) for (const o of $t) ye(r, e, o);
  if (n.has("typography")) for (const o of br) ye(r, e, o);
  if (n.has("motion")) for (const o of Er) ye(r, e, o);
  if (n.has("tokens") || n.has("colors")) for (let o = 0; o < e.length; o++) {
    const i = e.item(o);
    i.startsWith("--") && (n.has("tokens") || jr(i)) && ye(r, e, i);
  }
  return r;
}, yn = (e, t, r = Ot, n = ue) => {
  const o = [], i = [...t].sort((l, c) => bt(l[0]) - bt(c[0]));
  for (const [l, c] of i) {
    if (!l || !c) continue;
    const u = c.replace(/\s*!important\s*$/i, "").trim();
    u && o.push(`${l}: ${u} !important;`);
  }
  if (!o.length) return "";
  const a = `${e} {
${o.join(`
`)}
}`, s = n ? `@media ${n} {
${a}
}` : a;
  return [We(r), He(r, s)].filter(Boolean).join("");
}, Ht = (e) => {
  if (!e || e.nodeType !== 1) return [];
  const t = /* @__PURE__ */ new Set([e]), r = e.closest?.(Lr.join(", "));
  return r instanceof HTMLElement && t.add(r), [...t];
}, Kt = (e) => e ? e.classList?.contains("view-settings") || e.closest?.(".view-settings") ? Ut : e.classList?.contains("view-explorer") || e.closest?.(".view-explorer") || e.querySelector?.("ui-file-manager") ? It : [] : [], mn = (e, t = $r, r = !0) => {
  if (!e || !t.length) return [];
  const n = Ye(e), o = r ? Se : (a, s) => {
    try {
      const l = a.querySelector(s);
      return l instanceof HTMLElement ? l : null;
    } catch {
      return null;
    }
  }, i = /* @__PURE__ */ new Map();
  for (const a of t) {
    const s = String(a || "").trim();
    if (!s) continue;
    const l = o(e, s);
    if (!l || l === e) continue;
    const c = l.getRootNode() === e.getRootNode() ? `${n} ${s}` : s, u = i.get(l);
    u ? u.includes(c) || u.push(c) : i.set(l, [c]);
  }
  return [...i].map(([a, s]) => ({
    el: a,
    selector: s.join(", ")
  }));
}, Yt = (e) => {
  const t = e.getRootNode?.();
  return typeof ShadowRoot < "u" && t instanceof ShadowRoot ? t.adoptedStyleSheets ?? null : typeof document < "u" ? document.adoptedStyleSheets ?? null : null;
}, Zt = (e, t) => {
  const r = e.getRootNode?.();
  try {
    if (typeof ShadowRoot < "u" && r instanceof ShadowRoot) {
      r.adoptedStyleSheets = t;
      return;
    }
    typeof document < "u" && (document.adoptedStyleSheets = t);
  } catch {
  }
}, Gt = (e, t) => {
  if (t.sheet && z()) {
    const r = Yt(e);
    if (!r) return;
    if (r.includes(t.sheet)) {
      t.adopted = !0;
      return;
    }
    try {
      r.push(t.sheet), t.adopted = !0;
      return;
    } catch {
      Zt(e, [...r, t.sheet]), t.adopted = !0;
      return;
    }
  }
  t.styleEl && typeof document < "u" && (t.styleEl.isConnected || document.head?.append(t.styleEl), t.adopted = !0);
}, q = (e, t) => {
  if (t.sheet && z()) {
    const r = Yt(e);
    if (r) {
      const n = r.indexOf(t.sheet);
      if (n !== -1) try {
        r.splice(n, 1);
      } catch {
        Zt(e, r.filter((o) => o !== t.sheet));
      }
    }
  }
  t.styleEl?.remove(), t.adopted = !1;
}, Qt = (e, t) => {
  if (e.cssText = t, !t) return !1;
  if (e.sheet && z()) try {
    return e.sheet.replaceSync(t), !0;
  } catch (r) {
    return console.warn("[style-lib] bake replaceSync failed", r), !1;
  }
  return e.styleEl ? (e.styleEl.textContent = t, !0) : !1;
}, Ge = (e, t) => {
  const r = L.get(e.cacheKey);
  r?.timer && clearTimeout(r.timer);
  const n = {
    cssText: e.cssText,
    fingerprint: e.fingerprint,
    categories: e.categories,
    selector: e.selector,
    expires: Date.now() + t
  };
  t > 0 && typeof setTimeout == "function" && (n.timer = setTimeout(() => {
    L.get(e.cacheKey) === n && L.delete(e.cacheKey);
  }, t)), L.set(e.cacheKey, n);
}, Xt = (e) => {
  const t = L.get(e);
  t?.timer && clearTimeout(t.timer), L.delete(e);
}, Sn = () => {
  for (const e of L.values()) e.timer && clearTimeout(e.timer);
  L.clear();
}, vn = (e, t = ze) => {
  const r = R.get(e);
  r && (r.adopted && q(e, r), I.delete(e), r.cssText && Ge(r, t));
}, gn = (e, t = ze) => {
  const r = R.get(e);
  if (!r || !e.isConnected) return;
  const n = ae(void 0, e), o = L.get(r.cacheKey);
  if (!r.cssText && o && o.fingerprint === n && (Qt(r, o.cssText), r.fingerprint = o.fingerprint), !r.cssText || r.fingerprint !== n) {
    le(e, {
      categories: r.categories,
      cacheMs: t,
      layer: Ot
    });
    return;
  }
  Gt(e, r), I.add(e);
}, Z = null, wn = () => (Z || typeof IntersectionObserver > "u" || (Z = new IntersectionObserver((e) => {
  for (const t of e) {
    const r = t.target;
    R.has(r) && (t.isIntersecting && r.isConnected ? gn(r) : vn(r));
  }
}, { threshold: 0 })), Z), bn = (e, t, r, n = ue) => {
  let o = R.get(e);
  if (o)
    return o.selector = t, o.categories = r, o.media = n, o.cacheKey = wt(t, r, n), o;
  const i = z();
  return o = {
    sheet: i ? new CSSStyleSheet() : null,
    styleEl: i || typeof document > "u" ? null : document.createElement("style"),
    selector: t,
    categories: r,
    cssText: "",
    fingerprint: "",
    adopted: !1,
    cacheKey: wt(t, r, n),
    media: n
  }, o.styleEl && (o.styleEl.dataset.uxBaked = "", o.styleEl.dataset.owner = "style-lib"), R.set(e, o), wn()?.observe(e), o;
}, En = () => {
  Ve = !1;
  const e = [...Ue];
  Ue.clear();
  for (const t of e) {
    if (!t.isConnected || !R.has(t)) continue;
    const r = R.get(t);
    le(t, r ? {
      categories: r.categories,
      selector: r.selector,
      media: r.media
    } : {});
  }
}, Jt = (e) => {
  Ue.add(e), !Ve && (Ve = !0, queueMicrotask(En));
}, Me = (e = "theme") => {
  const t = ae();
  if (!(e !== "force" && t === ee && ee)) {
    ee = t, Sn();
    for (const r of [...I]) {
      const n = R.get(r);
      if (!n) {
        I.delete(r);
        continue;
      }
      q(r, n), n.cssText = "", n.fingerprint = "", Jt(r);
    }
  }
}, Cn = () => {
  if (!(gt || typeof document > "u")) {
    gt = !0, ee = ae(), Wt((e) => {
      if (ae() !== ee) {
        Me("style-tree");
        return;
      }
      e instanceof HTMLElement && R.has(e) && Jt(e);
    });
    try {
      new MutationObserver(() => Me("theme-attr")).observe(document.documentElement, {
        attributes: !0,
        attributeFilter: [...Cr]
      });
    } catch {
    }
    try {
      matchMedia?.("(prefers-color-scheme: dark)")?.addEventListener?.("change", () => Me("color-scheme"));
    } catch {
    }
  }
}, le = (e, t = {}) => {
  if (!e || e.nodeType !== 1 || typeof getComputedStyle != "function") return null;
  Cn();
  const r = dn(t.categories), n = t.layer || "ux-baked", o = t.cacheMs ?? 3e4, i = t.media === void 0 ? ue : t.media, a = t.selector?.trim() || Ye(e), s = ae(void 0, e), l = bn(e, a, r, i);
  l.fingerprint = s;
  const c = L.get(l.cacheKey);
  let u = "";
  if (c && c.fingerprint === s && c.cssText) u = c.cssText;
  else {
    const f = getComputedStyle(e);
    u = yn(a, hn(f, r), n, i);
  }
  return u ? (Qt(l, u), Ge(l, o), qr(e) ? (Gt(e, l), I.add(e)) : (q(e, l), I.delete(e)), l) : (q(e, l), I.delete(e), l);
}, Fe = (e, t = !0) => {
  if (!e) return;
  const r = R.get(e);
  r && (q(e, r), I.delete(e), Z?.unobserve(e), t && r.cssText ? Ge(r, ze) : Xt(r.cacheKey), R.delete(e));
}, Io = (e, t) => {
  if (!e) return null;
  const r = R.get(e);
  return r && (q(e, r), r.cssText = "", Xt(r.cacheKey)), le(e, t ?? (r ? {
    categories: r.categories,
    selector: r.selector,
    media: r.media
  } : {}));
}, Uo = (e) => e ? R.get(e) : void 0, xn = (e, t = {}) => {
  const r = {
    media: ue,
    pierceShadow: t.pierceShadow !== !1,
    ...t
  }, n = Ht(e), o = mn(e, r.also ?? Kt(e), r.pierceShadow !== !1), i = [], a = /* @__PURE__ */ new Set();
  for (const s of n) {
    const l = le(s, r);
    l && i.push(l);
  }
  for (const { el: s, selector: l } of o) {
    if (n.includes(s)) continue;
    const c = le(s, {
      ...r,
      selector: l
    });
    c && i.push(c), a.add(s);
  }
  if (e) {
    const s = G.get(e);
    if (s)
      for (const l of s) !a.has(l) && !n.includes(l) && Fe(l, !0);
    a.size ? G.set(e, a) : G.delete(e);
  }
  return i;
}, Bo = (e, t = !0) => {
  if (!e) return;
  const r = G.get(e);
  G.delete(e);
  for (const n of Ht(e)) Fe(n, t);
  if (r) for (const n of r) Fe(n, t);
}, _o = (e, t) => {
  const r = (n = !0) => {
    if (xn(e, t), !n || !e) return;
    const o = t?.also ?? Kt(e), i = t?.pierceShadow !== !1;
    o.length && o.some((a) => !(i ? Se(e, a) : e.querySelector(a))) && typeof requestAnimationFrame == "function" && requestAnimationFrame(() => r(!1));
  };
  if (!e || typeof requestAnimationFrame != "function") {
    r(!1);
    return;
  }
  requestAnimationFrame(() => r(!0));
}, Qe = (e) => {
  const t = e?.shadowRoot;
  if (!t) return;
  const r = Be.get(e) || [];
  for (const n of r) se(n);
  try {
    const n = t.adoptedStyleSheets || [];
    t.adoptedStyleSheets = [...r.filter((o) => !n.includes(o)), .../* @__PURE__ */ new Set([...n])];
  } catch {
  }
}, Ae = (e, t) => {
  let r = Be.get(e);
  r || Be.set(e, r = []), t && r.indexOf(t) < 0 && r.push(t), se(t), Qe(e);
}, te = (e, t) => {
  const r = e?.shadowRoot;
  if (!r || !t) return null;
  let n = r.querySelector?.(`style[${ct}]`);
  return n ? n.textContent !== t && (n.textContent = t) : (n = P(t, r, ""), n && n.setAttribute(ct, "")), n;
}, No = (e = typeof document < "u" ? document : null) => {
  if (!e) return;
  const t = (n) => {
    n?.shadowRoot && (te(n, er(n)), Qe(n));
  };
  e.nodeType === 1 && t(e);
  const r = (n) => {
    let o = [];
    try {
      o = n.querySelectorAll("*");
    } catch {
      return;
    }
    for (let i = 0; i < o.length; i++) {
      const a = o[i];
      a.shadowRoot && (t(a), r(a.shadowRoot));
    }
  };
  r(e);
}, er = (e) => {
  const t = e?.styles;
  if (typeof t == "string") return t;
  if (typeof t == "function") try {
    const r = t.call(e);
    return typeof r == "string" ? r : F(r);
  } catch {
    return null;
  }
  return F(t);
}, kn = (e) => {
  e && (e.styles != null && tr(e, e.styles), Qe(e), te(e, er(e)));
}, Re = [], Te = !1, Mn = (e) => {
  !e || !(e instanceof Element) || Ee.has(e) || (Ee.add(e), Re.push(e), !Te && (Te = !0, queueMicrotask(() => {
    Te = !1;
    const t = Re;
    Re = [];
    for (const r of t)
      Ee.delete(r), r.isConnected && kn(r);
  })));
};
Wt((e) => Mn(e));
var tr = (e, t) => {
  if (!t) return null;
  let r = t;
  if (typeof t == "function") try {
    const s = new WeakRef(e);
    r = t.call(e, s);
  } catch (s) {
    return console.warn("Error calling styles function:", s), null;
  }
  if (r && typeof CSSStyleSheet < "u" && r instanceof CSSStyleSheet)
    return Ae(e, r), te(e, F(r));
  if (r instanceof Promise)
    return r.then((s) => {
      s instanceof CSSStyleSheet ? Ae(e, s) : s != null && tr(e, s);
    }).catch((s) => {
      console.warn("Error loading adopted stylesheet:", s);
    }), null;
  if (typeof r == "string" || r instanceof Blob || r instanceof File) {
    const s = qt(r, "");
    if (s) {
      const l = (c) => {
        Ae(e, c);
      };
      return s instanceof Promise ? (s.then((c) => {
        l(c), te(e, typeof r == "string" ? r : F(c));
      }).catch((c) => {
        console.warn("Error loading adopted stylesheet:", c);
      }), null) : (l(s), te(e, typeof r == "string" ? r : F(s)));
    }
  }
  const n = typeof t == "function" || typeof t == "object" ? Sr : mr, o = n.get(t);
  let i = o?.styleElement, a = o?.vars;
  if (!o) {
    let s = "", l = [];
    typeof r == "string" ? s = r || "" : typeof r == "object" && r != null && (r instanceof HTMLStyleElement ? i = r : (s = typeof r.css == "string" ? r.css : typeof r == "string" ? r : String(r), l = r?.props ?? l, a = r?.vars ?? a)), !i && s && (i = P(s, e, "ux-layer")), n.set(t, {
      css: s,
      props: l,
      vars: a,
      styleElement: i
    });
  }
  return i;
}, An = (e) => !!e && typeof e == "object" && "ref" in e && typeof e?.unbind == "function", De = (e, t, r, n) => {
  const o = An(r) ? r : null;
  o && (o.bind?.(), r = o.ref), n?.(e, t, r);
  const i = ot(e), a = ot(r), s = hr?.([r, "value"], (c) => {
    const u = nt(i), f = nt(a), h = rt(f) ?? rt(c);
    n?.(u, t, h);
  }), l = () => {
    o?.unbind?.(), s?.();
  };
  return pr(r, Symbol.dispose, l), l;
}, Rn = 0, Vo = (e = {}) => ({
  kind: "scroll",
  ...e
}), Fo = (e = {}) => ({
  kind: "view",
  ...e
}), Tn = class {
  [Bt] = !0;
  id = Rn++;
  #n;
  #e;
  #r;
  #o = /* @__PURE__ */ new Set();
  #i = /* @__PURE__ */ new Set();
  #s(e, t) {
    return e == null || e === "self" ? t : e === "root" ? t.ownerDocument.scrollingElement ?? t.ownerDocument.documentElement : typeof e == "object" && "value" in e && !(e instanceof Element) ? e.value ?? t : e;
  }
  #a(e) {
    for (let t = e.parentElement; t; t = t.parentElement) {
      const r = getComputedStyle(t);
      if (/(auto|scroll|overlay)/.test(r.overflow + r.overflowX + r.overflowY)) return t;
    }
    return e.ownerDocument.scrollingElement ?? e.ownerDocument.documentElement;
  }
  #f(e, t) {
    const r = e.ownerDocument.defaultView ?? globalThis;
    if (X(t)) {
      const o = r.ScrollTimeline;
      return typeof o != "function" ? null : new o({
        source: t.source === "nearest" || t.source == null ? this.#a(e) : this.#s(t.source, e),
        axis: t.axis ?? "block"
      });
    }
    const n = r.ViewTimeline;
    return typeof n != "function" ? null : new n({
      subject: t.subject ? this.#s(t.subject, e) : e,
      axis: t.axis ?? "block",
      inset: t.inset
    });
  }
  #d(e, t, r, n) {
    const o = this.#f(e, n);
    if (!o) return this.#p(e, t, r, n);
    const i = this.#u(), a = e.animate(this.#c(r), {
      ...i,
      duration: "auto",
      delay: 0,
      endDelay: 0,
      iterations: 1,
      fill: this.#e.fill ?? "both",
      timeline: o
    });
    return n.rangeStart && (a.rangeStart = n.rangeStart), n.rangeEnd && (a.rangeEnd = n.rangeEnd), t.animation = a, () => a.cancel();
  }
  constructor(e, t = {}) {
    if (!Array.isArray(e) || e.length < 2) throw new TypeError("animatable() expects at least 2 steps");
    this.#n = e, this.#e = t, this.#r = this.#l(e[0]);
  }
  #p(e, t, r, n) {
    const i = e.animate(this.#c(r), {
      ...this.#u(),
      duration: 1e4,
      delay: 0,
      iterations: 1,
      fill: "both"
    });
    i.pause(), t.animation = i;
    const a = X(n) ? n.source === "nearest" || n.source == null ? this.#a(e) : this.#s(n.source, e) : this.#a(e);
    let s = 0;
    const l = () => {
      if (ne(n)) {
        const C = a === document.scrollingElement ? {
          top: 0,
          height: innerHeight
        } : a.getBoundingClientRect(), S = e.getBoundingClientRect(), p = C.height + S.height;
        return Math.min(1, Math.max(0, (C.top + C.height - S.top) / p));
      }
      const f = a, h = f.scrollHeight - f.clientHeight;
      return h > 0 ? f.scrollTop / h : 0;
    }, c = () => {
      cancelAnimationFrame(s), s = requestAnimationFrame(() => {
        i.currentTime = l() * 1e4;
      });
    }, u = a === document.scrollingElement ? window : a;
    return u.addEventListener("scroll", c, { passive: !0 }), c(), () => {
      cancelAnimationFrame(s), u.removeEventListener("scroll", c), i.cancel();
    };
  }
  get value() {
    return this.#r;
  }
  set value(e) {
    this.#r = e;
    for (const t of this.#o) t(e);
  }
  valueOf() {
    return this.#r;
  }
  toString() {
    const e = this.#r;
    return e == null ? "" : String(e);
  }
  [Symbol.toPrimitive](e) {
    if (e === "number") {
      const t = Number(this.#r);
      return Number.isFinite(t) ? t : 0;
    }
    return this.toString();
  }
  subscribe(e) {
    return this.#o.add(e), () => this.#o.delete(e);
  }
  get options() {
    return this.#e;
  }
  get steps() {
    return this.#n;
  }
  #l(e) {
    return e != null && typeof e == "object" && "value" in e ? e.value : e;
  }
  #c(e) {
    const t = this.#n.map((i) => this.#l(i)), r = t.length, n = this.#e.offsets, o = this.#e.easing;
    return t.map((i, a) => {
      const s = { offset: n?.[a] ?? (r > 1 ? a / (r - 1) : 0) };
      Array.isArray(o) && o[a] && (s.easing = o[a]);
      let l = i;
      return e.mode === "property" && e.unit != null && typeof i == "number" && (l = `${i}${e.unit}`), e.mode === "custom-property" && typeof i != "string" && (l = String(i)), s[e.target] = l, s;
    });
  }
  #u() {
    const e = this.#e;
    return {
      duration: B(e.duration, 300),
      delay: B(e.delay, 0),
      endDelay: e.endDelay ?? 0,
      iterations: Dr(e.iterations),
      direction: e.direction ?? "normal",
      fill: e.fill ?? "both",
      composite: e.composite,
      easing: Array.isArray(e.easing) ? "linear" : e.easing ?? "linear"
    };
  }
  attach(e, t) {
    const r = {
      element: e,
      animation: null,
      cleanup: () => {
      }
    }, n = this.#e.trigger ?? "mount";
    let o;
    if (X(n) || ne(n)) o = this.#d(e, r, t, n);
    else {
      const i = () => {
        r.animation?.cancel();
        const a = e.animate(this.#c(t), this.#u());
        return r.animation = a, this.#h(a, t), a;
      };
      o = this.#y(e, r, i);
    }
    return this.#i.add(r), r.cleanup = () => {
      o(), this.#i.delete(r);
    }, r.cleanup;
  }
  #h(e, t) {
    e.finished.then(() => {
      const r = this.#l(this.#n[this.#n.length - 1]);
      this.value = r;
    }).catch(() => {
    });
  }
  #y(e, t, r) {
    const n = this.#e.trigger ?? "mount", o = this.#e.reverseOnExit ?? !0, i = () => {
      !t.animation || t.animation.playState === "idle" ? r() : (t.animation.playbackRate = Math.abs(t.animation.playbackRate || 1), t.animation.play());
    }, a = () => {
      t.animation && t.animation.reverse();
    };
    if (n === "mount")
      return r(), () => {
      };
    if (n === "manual") return () => {
    };
    if (n === "hover" || n === "focus") {
      const s = n === "hover" ? "pointerenter" : "focusin", l = n === "hover" ? "pointerleave" : "focusout", c = () => i(), u = () => {
        o && a();
      };
      return e.addEventListener(s, c), e.addEventListener(l, u), () => {
        e.removeEventListener(s, c), e.removeEventListener(l, u);
      };
    }
    if (n === "click") {
      let s = !0;
      const l = () => {
        s ? i() : a(), s = !s;
      };
      return e.addEventListener("click", l), () => e.removeEventListener("click", l);
    }
    if (n === "visible") {
      if (typeof IntersectionObserver != "function")
        return r(), () => {
        };
      const s = new IntersectionObserver((l) => {
        for (const c of l) c.isIntersecting ? i() : o && t.animation && a();
      }, this.#e.intersection);
      return s.observe(e), () => s.disconnect();
    }
    if (n != null && typeof n == "object" && "value" in n) {
      const s = (c) => c ? i() : a();
      s(n.value);
      const l = typeof n.subscribe == "function" ? n.subscribe(s) : null;
      return () => l?.();
    }
    if (n === "show" || n === "hide" || n === "remove") {
      const s = n === "show" ? "u2-before-show" : n === "hide" ? "u2-before-hide" : "u2-before-remove", l = n === "remove" ? "data-removing" : "data-hidden", c = n !== "show", u = (h) => {
        h.defaultPrevented || i();
      };
      e.addEventListener(s, u);
      const f = new MutationObserver(() => {
        e.hasAttribute(l) === c ? i() : o && t.animation && a();
      });
      return f.observe(e, {
        attributes: !0,
        attributeFilter: [l]
      }), () => {
        e.removeEventListener(s, u), f.disconnect();
      };
    }
    return () => {
    };
  }
  #t(e) {
    for (const t of this.#i) t.animation && e(t.animation);
    return this;
  }
  play() {
    return this.#t((e) => e.play());
  }
  pause() {
    return this.#t((e) => e.pause());
  }
  reverse() {
    return this.#t((e) => e.reverse());
  }
  cancel() {
    return this.#t((e) => e.cancel());
  }
  finish() {
    return this.#t((e) => e.finish());
  }
  set playbackRate(e) {
    this.#t((t) => {
      t.playbackRate = e;
    });
  }
  get finished() {
    const e = [];
    return this.#t((t) => e.push(t.finished.catch(() => {
    }))), Promise.all(e).then(() => {
    });
  }
}, Do = (e, t) => new Tn(e, t), Ln = (e) => e != null && typeof e == "object" && e[Bt] === !0, $n = 0, re = (e) => {
  const t = e.value?.value, r = typeof t == "number" ? t : Number(t);
  if (!Number.isFinite(r)) throw new TypeError(`Reactive CSS value "${String(t)}" is not finite`);
  return r;
}, Pn = (e) => {
  const t = Number(e?.value);
  return Number.isFinite(t) ? t : 0;
}, Et = (e, t) => {
  let r = e;
  for (const n of t) r = r.replace(new RegExp(`var\\(\\s*${ie(n.marker)}\\s*\\)`, "g"), String(n.value));
  return r;
}, Le = (e, t) => {
  const r = ie(t);
  return new RegExp(`^var\\(\\s*${r}\\s*\\)$`).test(e.trim());
}, Ct = (e, t) => {
  let r = e;
  return r != null && typeof r == "object" && "value" in r && !(r instanceof Element) && (r = r.value), r == null || r === "" ? t ? `0${t}` : "0" : t != null && typeof r == "number" ? `${r}${t}` : String(r);
}, $e = (e, t, r) => {
  if (!r) return !1;
  const n = ie(t), o = ie(r);
  return new RegExp(`^calc\\(\\s*var\\(\\s*${n}\\s*\\)\\s*\\*\\s*1${o}\\s*\\)$`, "i").test(e.trim());
}, On = (e, t, r, n) => {
  if (typeof t?.parseAll == "function") {
    const o = t.parseAll(r, n);
    e.set(r, ...o);
    return;
  }
  if (typeof t?.parse == "function") {
    e.set(r, t.parse(r, n));
    return;
  }
  e.set(r, n);
}, rr = (e) => {
  const t = [];
  let r = 0;
  for (; r < e.length; ) {
    const n = e.slice(r), o = /^\s+/.exec(n);
    if (o) {
      r += o[0].length;
      continue;
    }
    const i = /^var\(\s*(--[a-zA-Z0-9_-]+)\s*\)/.exec(n);
    if (i) {
      t.push({
        kind: "variable",
        marker: i[1]
      }), r += i[0].length;
      continue;
    }
    const a = /^(?:\d*\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?/.exec(n);
    if (a) {
      r += a[0].length;
      const c = /^(%|[a-zA-Z]+)/.exec(e.slice(r)), u = c?.[0] ?? null;
      c && (r += c[0].length), t.push({
        kind: "number",
        value: Number(a[0]),
        unit: u == null ? null : u.toLowerCase()
      });
      continue;
    }
    const s = /^[a-zA-Z_][a-zA-Z0-9_-]*/.exec(n);
    if (s) {
      t.push({
        kind: "identifier",
        value: s[0].toLowerCase()
      }), r += s[0].length;
      continue;
    }
    const l = n[0];
    if (l === "+" || l === "-" || l === "*" || l === "/" || l === "(" || l === ")" || l === ",") {
      t.push({
        kind: "symbol",
        value: l
      }), r++;
      continue;
    }
    throw new SyntaxError(`Unsupported Typed OM numeric token near "${n}"`);
  }
  return t;
}, nr = class {
  tokens;
  win;
  reactiveByMarker;
  typedByMarker;
  index = 0;
  leaves = [];
  constructor(e, t, r, n) {
    this.tokens = e, this.win = t, this.reactiveByMarker = r, this.typedByMarker = n;
  }
  parse() {
    const e = this.parseSum();
    if (this.index !== this.tokens.length) throw new SyntaxError("Unexpected trailing Typed OM expression");
    return {
      root: e,
      leaves: this.leaves
    };
  }
  current() {
    return this.tokens[this.index];
  }
  consume() {
    const e = this.tokens[this.index];
    if (!e) throw new SyntaxError("Unexpected end of Typed OM expression");
    return this.index++, e;
  }
  consumeSymbol(e) {
    const t = this.consume();
    if (t.kind !== "symbol" || t.value !== e) throw new SyntaxError(`Expected "${e}"`);
  }
  matchesSymbol(e) {
    const t = this.current();
    return t?.kind === "symbol" && t.value === e;
  }
  createMath(e, ...t) {
    const r = j(this.win, e);
    if (typeof r != "function") throw new TypeError(`${e} is not supported`);
    return new r(...t);
  }
  parseSum() {
    let e = this.parseProduct();
    for (; this.matchesSymbol("+") || this.matchesSymbol("-"); ) {
      const t = this.consume(), r = this.parseProduct();
      if (t.kind !== "symbol") throw new SyntaxError("Expected a sum operator");
      t.value === "+" ? e = this.createMath("CSSMathSum", e, r) : e = this.createMath("CSSMathSum", e, this.createMath("CSSMathNegate", r));
    }
    return e;
  }
  parseProduct() {
    let e = this.parseUnary();
    for (; this.matchesSymbol("*") || this.matchesSymbol("/"); ) {
      const t = this.consume(), r = this.parseUnary();
      if (t.kind !== "symbol") throw new SyntaxError("Expected a product operator");
      t.value === "*" ? e = this.createMath("CSSMathProduct", e, r) : e = this.createMath("CSSMathProduct", e, this.createMath("CSSMathInvert", r));
    }
    return e;
  }
  parseUnary() {
    return this.matchesSymbol("+") ? (this.consume(), this.parseUnary()) : this.matchesSymbol("-") ? (this.consume(), this.createMath("CSSMathNegate", this.parseUnary())) : this.parsePrimary();
  }
  parsePrimary() {
    const e = this.consume();
    if (e.kind === "number") return M(this.win, e.unit ?? "number", e.value);
    if (e.kind === "variable") {
      const t = this.reactiveByMarker.get(e.marker);
      if (t) {
        if (this.matchesSymbol("*")) {
          const o = this.index;
          this.consume();
          const i = this.current();
          if (i?.kind === "number" && i.value === 1 && typeof i.unit == "string" && (!t.multipliedByUnit || t.multipliedByUnit === i.unit.toLowerCase())) {
            this.consume();
            const a = M(this.win, i.unit.toLowerCase(), re(t));
            return this.leaves.push({
              slot: t,
              value: a
            }), a;
          }
          this.index = o;
        }
        const n = M(this.win, "number", re(t));
        return this.leaves.push({
          slot: t,
          value: n
        }), n;
      }
      const r = this.typedByMarker.get(e.marker);
      if (r) return r.value;
      throw new SyntaxError(`Unknown style slot "${e.marker}"`);
    }
    if (e.kind === "symbol" && e.value === "(") {
      const t = this.parseSum();
      return this.consumeSymbol(")"), t;
    }
    if (e.kind === "identifier") return this.parseFunction(e.value);
    throw new SyntaxError("Expected a Typed OM numeric value");
  }
  parseFunction(e) {
    if (this.consumeSymbol("("), e === "calc") {
      const r = this.parseSum();
      return this.consumeSymbol(")"), r;
    }
    const t = [];
    if (!this.matchesSymbol(")"))
      for (t.push(this.parseSum()); this.matchesSymbol(","); )
        this.consume(), t.push(this.parseSum());
    if (this.consumeSymbol(")"), e === "min") {
      if (t.length === 0) throw new SyntaxError("min() requires a value");
      return this.createMath("CSSMathMin", ...t);
    }
    if (e === "max") {
      if (t.length === 0) throw new SyntaxError("max() requires a value");
      return this.createMath("CSSMathMax", ...t);
    }
    if (e === "clamp") {
      if (t.length !== 3) throw new SyntaxError("clamp() requires three values");
      return this.createMath("CSSMathClamp", t[0], t[1], t[2]);
    }
    throw new SyntaxError(`Unsupported Typed OM function "${e}"`);
  }
}, In = (e, t, r, n) => {
  const o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (const a of r) o.set(a.marker, a);
  for (const a of n) i.set(a.marker, a);
  return new nr(rr(e), t, o, i).parse();
}, Un = (e) => e.trim().toLowerCase() === "transform", Bn = (e, t, r, n) => {
  const o = rr(e), i = [], a = [], s = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
  for (const m of r) s.set(m.marker, m);
  for (const m of n) l.set(m.marker, m);
  const c = () => M(t, "px", 0), u = () => M(t, "number", 1);
  let f = 0;
  const h = () => o[f], C = () => {
    const m = o[f];
    if (!m) throw new SyntaxError("Unexpected end of transform expression");
    return f++, m;
  }, S = (m) => {
    const d = C();
    if (d.kind !== "symbol" || d.value !== m) throw new SyntaxError(`Expected "${m}"`);
  }, p = () => {
    const m = f;
    let d = 0;
    for (; f < o.length; ) {
      const A = o[f];
      if (A.kind === "symbol" && A.value === "(") {
        d++, f++;
        continue;
      }
      if (A.kind === "symbol" && A.value === ")") {
        if (d === 0) break;
        d--, f++;
        continue;
      }
      if (A.kind === "symbol" && A.value === "," && d === 0) break;
      f++;
    }
    const g = o.slice(m, f);
    if (g.length === 0) throw new SyntaxError("Empty transform function argument");
    const v = new nr(g, t, s, l).parse();
    return i.push(...v.leaves), v.root;
  }, y = () => {
    const m = [];
    if (S("("), !(h()?.kind === "symbol" && h()?.value === ")"))
      for (m.push(p()); h()?.kind === "symbol" && h()?.value === ","; )
        C(), m.push(p());
    return S(")"), m;
  }, w = (m, d) => {
    const g = (v) => {
      const A = j(t, v);
      if (typeof A != "function") throw new TypeError(`${v} is not supported`);
      return A;
    };
    switch (m) {
      case "translate": {
        const v = g("CSSTranslate");
        if (d.length === 1) return new v(d[0], c());
        if (d.length === 2) return new v(d[0], d[1]);
        if (d.length === 3) return new v(d[0], d[1], d[2]);
        throw new SyntaxError("translate() expects 1..3 args");
      }
      case "translatex":
        return new (g("CSSTranslate"))(d[0], c());
      case "translatey":
        return new (g("CSSTranslate"))(c(), d[0]);
      case "translatez":
        return new (g("CSSTranslate"))(c(), c(), d[0]);
      case "translate3d":
        if (d.length !== 3) throw new SyntaxError("translate3d() expects 3 args");
        return new (g("CSSTranslate"))(d[0], d[1], d[2]);
      case "scale": {
        const v = g("CSSScale");
        if (d.length === 1) return new v(d[0], d[0]);
        if (d.length === 2) return new v(d[0], d[1]);
        if (d.length === 3) return new v(d[0], d[1], d[2]);
        throw new SyntaxError("scale() expects 1..3 args");
      }
      case "scalex":
        return new (g("CSSScale"))(d[0], u());
      case "scaley":
        return new (g("CSSScale"))(u(), d[0]);
      case "scalez":
        return new (g("CSSScale"))(u(), u(), d[0]);
      case "scale3d":
        if (d.length !== 3) throw new SyntaxError("scale3d() expects 3 args");
        return new (g("CSSScale"))(d[0], d[1], d[2]);
      case "rotate": {
        const v = g("CSSRotate");
        if (d.length === 1) return new v(d[0]);
        if (d.length === 4) return new v(d[0], d[1], d[2], d[3]);
        throw new SyntaxError("rotate() expects 1 or 4 args");
      }
      case "rotatex":
        return new (g("CSSRotate"))(u(), M(t, "number", 0), M(t, "number", 0), d[0]);
      case "rotatey":
        return new (g("CSSRotate"))(M(t, "number", 0), u(), M(t, "number", 0), d[0]);
      case "rotatez":
        return new (g("CSSRotate"))(M(t, "number", 0), M(t, "number", 0), u(), d[0]);
      case "rotate3d":
        if (d.length !== 4) throw new SyntaxError("rotate3d() expects 4 args");
        return new (g("CSSRotate"))(d[0], d[1], d[2], d[3]);
      case "skew": {
        const v = g("CSSSkew");
        if (d.length === 1) return new v(d[0], M(t, "deg", 0));
        if (d.length === 2) return new v(d[0], d[1]);
        throw new SyntaxError("skew() expects 1..2 args");
      }
      case "skewx":
        return new (g("CSSSkewX"))(d[0]);
      case "skewy":
        return new (g("CSSSkewY"))(d[0]);
      case "perspective":
        return new (g("CSSPerspective"))(d[0]);
      default:
        throw new SyntaxError(`Unsupported transform function "${m}"`);
    }
  };
  for (; f < o.length; ) {
    const m = C();
    if (m.kind !== "identifier") throw new SyntaxError("Expected a transform function name");
    const d = y();
    a.push(w(m.value, d));
  }
  if (a.length === 0) throw new SyntaxError("Empty transform list");
  const k = j(t, "CSSTransformValue");
  if (typeof k != "function") throw new TypeError("CSSTransformValue is not supported");
  return {
    root: new k(a),
    leaves: i
  };
}, xt = (e, t, r, n, o) => Un(e) ? Bn(t, r, n, o) : In(t, r, n, o), Pe = (e, t) => {
  for (const r of t) {
    const n = e.get(r.slot.marker);
    n ? n.push(r) : e.set(r.slot.marker, [r]);
  }
}, Oe = (e, t, r) => e.map((n) => ({
  slot: n.slot,
  value: n.value,
  property: t,
  root: r
})), _n = (e, t, r, n, o, i) => {
  const a = e.ownerDocument.createElement("span");
  a.style.cssText = t, Hr(e, "");
  const s = e, l = s.attributeStyleMap ?? s.styleMap, c = e.ownerDocument.defaultView ?? globalThis, u = c?.CSSStyleValue ?? globalThis.CSSStyleValue, f = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Set(), C = [], S = /* @__PURE__ */ new Set();
  for (const p of i) {
    let y = null;
    for (let w = 0; w < a.style.length; w++) {
      const k = a.style.item(w), m = a.style.getPropertyValue(k);
      if (Le(m, p.marker)) {
        y = {
          mode: "property",
          target: k
        }, e.style.setProperty(k, Ct(p.value.value)), S.add(k);
        break;
      }
      if ($e(m, p.marker, p.multipliedByUnit)) {
        y = {
          mode: "property",
          target: k,
          unit: p.multipliedByUnit
        }, e.style.setProperty(k, Ct(p.value.value, p.multipliedByUnit)), S.add(k);
        break;
      }
    }
    if (!y) {
      const w = Number(p.value.value) || 0;
      Fn(c, p.marker, w), e.style.setProperty(p.marker, String(w)), y = {
        mode: "custom-property",
        target: p.marker
      };
    }
    C.push(p.value.attach(e, y));
  }
  for (let p = 0; p < a.style.length; p++) {
    const y = a.style.item(p);
    if (S.has(y)) continue;
    const w = a.style.getPropertyValue(y), k = a.style.getPropertyPriority(y), m = r.filter((E) => mt(w, E.marker)), d = n.filter((E) => mt(w, E.marker));
    if (m.length === 0 && d.length === 0) {
      e.style.setProperty(y, w, k);
      continue;
    }
    const g = l?.set && !k && !y.startsWith("--");
    let v = !1;
    if (g && d.length > 0) try {
      const E = d.length === 1 && m.length === 0 ? d[0] : null;
      if (E && $e(w, E.marker, E.multipliedByUnit)) {
        const x = M(c, E.multipliedByUnit, re(E));
        l.set(y, x), Pe(f, Oe([{
          slot: E,
          value: x
        }], y, x)), v = !0;
      } else if (E && Le(w, E.marker)) {
        const x = M(c, "number", re(E));
        l.set(y, x), Pe(f, Oe([{
          slot: E,
          value: x
        }], y, x)), v = !0;
      } else {
        const x = xt(y, w, c, d, m);
        l.set(y, x.root), Pe(f, Oe(x.leaves, y, x.root)), v = !0;
      }
    } catch {
    }
    if (v) continue;
    if (g && d.length === 0 && m.length > 0) try {
      const E = m.length === 1 ? m[0] : null;
      if (E && Le(w, E.marker))
        l.set(y, E.value), v = !0;
      else if (E && $e(w, E.marker, E.multipliedByUnit)) {
        const x = j(c, "CSSMathProduct");
        if (typeof x != "function") throw new TypeError("CSSMathProduct is not supported");
        const lr = new x(E.value, M(c, E.multipliedByUnit, 1));
        l.set(y, lr), v = !0;
      } else {
        try {
          const x = xt(y, w, c, [], m);
          l.set(y, x.root);
        } catch {
          const x = Et(w, m);
          On(l, u, y, x);
        }
        v = !0;
      }
    } catch {
    }
    if (v) continue;
    const A = Et(w, m);
    e.style.setProperty(y, A, k);
    for (const E of d) h.add(E.marker);
  }
  for (const p of n) {
    const y = f.get(p.marker) ?? [], w = h.has(p.marker);
    if (y.length === 0 && !w) continue;
    const k = De(e, p.marker, p.value, function(...m) {
      if (y.length > 0) try {
        const d = re(p), g = /* @__PURE__ */ new Map();
        for (const v of y)
          v.value.value = d, g.set(v.property, v.root);
        if (l?.set) for (const [v, A] of g) l.set(v, A);
      } catch {
      }
      w && St.apply(this, m);
    });
    C.push(k);
  }
  for (const p of h) {
    if (n.some((w) => w.marker === p)) continue;
    const y = o.get(p);
    y != null && C.push(De(e, p, y, St));
  }
  return Wr(e), () => {
    for (const p of C) p?.();
  };
}, K = (e) => {
  const [t, r, n] = e, o = document.createElement("div");
  return t(o), o.style.cssText;
}, je = (e, ...t) => {
  const r = $n++, n = [], o = /* @__PURE__ */ new Map(), i = [], a = [], s = [], l = [], c = new Array(e.length).fill(0);
  for (let f = 0; f < e.length; f++) {
    if (s.push(e[f].slice(c[f])), f >= t.length) continue;
    const h = t[f], C = e[f + 1] ?? "", S = Kr(C);
    if ($(h)) {
      const p = `--fest-typed-${r}-${i.length}`;
      i.push({
        marker: p,
        value: h,
        multipliedByUnit: S?.normalized
      }), S ? (s.push(`calc(var(${p}) * 1${S.authored})`), c[f + 1] += S.length) : s.push(`var(${p})`);
      continue;
    }
    if (Ln(h)) {
      const p = `--fest-anim-${r}-${l.length}`;
      S ? (s.push(`calc(var(${p}) * 1${S.authored})`), c[f + 1] += S.length) : s.push(`var(${p})`), n.push(`@property ${p} { syntax: "<number>"; initial-value: ${Number(h.value) || 0}; inherits: false; };`), l.push({
        marker: p,
        value: h,
        multipliedByUnit: S?.normalized
      });
      continue;
    }
    if (fe(h)) {
      const p = `--fest-ref-${r}-${a.length}`;
      a.push({
        marker: p,
        value: h,
        multipliedByUnit: S?.normalized
      }), S ? (s.push(`calc(var(${p}) * 1${S.authored})`), c[f + 1] += S.length) : s.push(`var(${p})`);
      const y = Pn(h);
      n.push(`@property ${p} { syntax: "<number>"; initial-value: ${y}; inherits: true; };`), o.set(p, h);
      continue;
    }
    typeof h != "object" && typeof h != "function" && h != null && String(h).trim() !== "" && s.push(String(h));
  }
  const u = [
    (f) => _n(f, s.join(""), i, a, o, l),
    n,
    o
  ];
  return u[Symbol.toStringTag] = () => K(u), u[Symbol.toPrimitive] = (f) => f === "string" ? K(u) : u[0], u.toString = () => K(u), u.valueOf = () => K(u), Object.defineProperty(u, "cssText", {
    get: () => K(u),
    set: (f) => {
      console.log("set cssText", f);
      const [h, C, S] = u, p = document.createElement("div");
      h(p), p.style.cssText = f;
    },
    configurable: !0,
    enumerable: !0
  }), u;
}, jo = (e, ...t) => je(e, ...t), Nn = (e, t) => {
  const r = [], n = [], o = /#\{(\d+)\}/g;
  let i = 0, a;
  for (; (a = o.exec(e)) != null; ) {
    const s = Number.parseInt(a[1], 10);
    !Number.isSafeInteger(s) || s < 0 || (r.push(e.slice(i, a.index)), n.push(t[s]), i = a.index + a[0].length);
  }
  return n.length === 0 ? null : (r.push(e.slice(i)), {
    strings: r,
    values: n
  });
}, Vn = (e, t) => {
  let r = e[0] ?? "";
  for (let n = 0; n < t.length; n++) {
    const o = t[n];
    o != null && (r += String(o)), r += e[n + 1] ?? "";
  }
  return r;
}, qo = (e, t) => {
  const r = Nn(e, t);
  if (!r) return null;
  const { strings: n, values: o } = r;
  return o.length === 1 && (n[0] ?? "").trim() === "" && (n[1] ?? "").trim() === "" && !yt(o[0]) && !$(o[0]) ? zr(o[0]) ? {
    kind: "template",
    binding: o[0]
  } : {
    kind: "direct",
    value: o[0]
  } : o.some((i) => fe(i) || $(i)) ? {
    kind: "template",
    binding: je(n, ...o)
  } : o.every(yt) ? {
    kind: "static",
    cssText: Vn(n, o)
  } : {
    kind: "template",
    binding: je(n, ...o)
  };
}, zo = (e, t) => {
  const r = Array.isArray(t) ? t[0] : t;
  if (typeof r != "function") return () => {
  };
  const n = r(e);
  return () => {
    if (typeof n == "function") {
      n();
      return;
    }
    n?.unbind?.();
  };
}, Fn = (e, t, r) => {
  if (!lt.has(t)) {
    lt.add(t);
    try {
      (e?.CSS ?? CSS)?.registerProperty?.({
        name: t,
        syntax: "<number>",
        initialValue: String(r),
        inherits: !1
      });
    } catch {
    }
  }
}, Xe = (e, t) => {
  if (t instanceof Map && t.size > 0) return Array.from(t.values());
  const r = e.keyframes?.properties;
  if (r instanceof Map && r.size > 0) return Array.from(r.values());
  const n = [];
  if (typeof e.properties == "string") {
    const o = e.properties?.trim?.()?.split?.(";");
    return n.push(...Array.from(o || [])?.map?.((i) => {
      if (i?.includes?.(":")) {
        const a = (i?.split?.(":") ?? [])?.slice?.(1, -1)?.join?.(":");
        return {
          property: i?.[0]?.trim?.(),
          values: [a?.trim?.()]
        };
      }
      return null;
    })?.filter?.((i) => i != null) || []), n;
  }
  return Array.isArray(e.properties) ? e.properties.map((o, i) => {
    if (o && Array.isArray(o.values) && o.property) return o;
    const a = Object.entries(o || {}).filter(([l]) => l !== "offset" && l !== "easing"), s = a[0]?.[1];
    return {
      property: a[0]?.[0] ?? `p${i}`,
      values: s == null ? [] : Array.isArray(s) ? s : [s]
    };
  }) : e.properties && typeof e.properties == "object" ? Object.entries(e.properties).map(([o, i]) => ({
    property: o,
    values: Array.isArray(i) ? i : [i]
  })) : n;
}, Dn = (e, t) => {
  const r = /* @__PURE__ */ new Map();
  let n = "";
  for (let i = 0; i < e.length; i++)
    n += e[i], i < t.length && (n += `__SLOT_${i}__`);
  const o = n.split(";").map((i) => i.trim()).filter(Boolean);
  for (const i of o) {
    const a = i.indexOf(":");
    if (a === -1) continue;
    const s = i.slice(0, a).trim(), l = i.slice(a + 1).trim(), c = /__SLOT_(\d+)__/.exec(l);
    if (!c) continue;
    const u = t[parseInt(c[1], 10)];
    if (!Array.isArray(u)) throw new TypeError(`A\`${s}\` expects an array of values, got ${typeof u}`);
    r.set(s, {
      property: s,
      values: u
    });
  }
  return { properties: r };
}, Je = (e) => {
  const t = [], r = [];
  let n = !1;
  for (let o = 0; o < e.length; o++) {
    const i = e[o];
    fe(i) ? (n = !0, r.push(o), t.push(i.value)) : ($(i), t.push(i));
  }
  return {
    resolved: t,
    hasReactive: n,
    reactiveIndices: r
  };
}, ve = (e, t) => {
  const r = e?.offsets, n = Xe(e, t);
  if (n.length === 0) throw new Error("No animatable properties found in A template");
  const o = Math.max(...n.map((s) => s.values.length)), i = (r?.length > 1 ? r : null) || Array.from({ length: o }, (s, l) => l / (o - 1)), a = [];
  for (let s = 0; s < o; s++) {
    const l = { offset: i[s] ?? s / (o - 1) };
    for (const c of n) {
      const { resolved: u } = Je(c.values), f = ce(c.property);
      let h = u[Math.min(s, u.length - 1)];
      $(h) && (h = String(h)), l[f] = h;
    }
    a.push(l);
  }
  return a;
}, et = (e) => {
  const t = B(e.duration ?? 300), r = B(e.delay ?? 0), n = Nt(e.iterationCount);
  return {
    duration: t,
    delay: r,
    composite: e.composite || "replace",
    iterations: n === "Infinity" ? 1 / 0 : n,
    fill: e.fillMode ?? "none",
    direction: e.direction ?? "normal",
    easing: typeof e.easing == "string" ? e.easing : "linear",
    timeline: e.timeline
  };
}, jn = (e, t) => {
  const r = Xe(t), n = [], o = ve(t), i = et(t), a = e.animate(o, i);
  for (const l of r) {
    const { hasReactive: c, reactiveIndices: u } = Je(l.values);
    if (c)
      for (const f of u) {
        const h = l.values[f], C = De(e, `--anim-${l.property}-${f}`, h, () => {
          const S = ve(t), p = a.currentTime;
          a.effect = new KeyframeEffect(e, S, i), p !== null && (a.currentTime = p);
        });
        n.push(C);
      }
  }
  return {
    animation: a,
    cleanup: () => {
      a.cancel(), n.forEach((l) => l());
    }
  };
}, Wo = (e, ...t) => Dn(e, t), _ = (e, t, r) => {
  const n = e != null && typeof e.animate == "function";
  if (!(typeof Element < "u" && e instanceof Element) && !n) throw new TypeError("doAnimation requires an Element");
  if (Xe(t, r).some((l) => {
    const { hasReactive: c } = Je(l.values);
    return c;
  })) return jn(e, t);
  const o = ve(t, r), i = et(t), a = e.animate(o, i);
  return {
    animation: a,
    cleanup: () => {
      a.cancel();
    }
  };
}, qn = (e, t) => {
  const r = /* @__PURE__ */ new Map(), n = t.properties;
  if (n == null || typeof n == "string" || Array.isArray(n)) return _(e, t);
  for (const [o, i] of Object.entries(n)) {
    if (!Array.isArray(i)) throw new TypeError(`animate() expects arrays of values, got ${typeof i} for ${o}`);
    r.set(o, {
      property: o,
      values: i
    });
  }
  return _(e, { ...t }, r);
}, Ho = (e) => (t) => _(t, e), Ko = async (e, t) => {
  for (const r of t) {
    const { animation: n } = _(e, r);
    await n.finished;
  }
}, Yo = (e, t) => {
  const r = t.map((o) => _(e, o)), n = () => {
    r.forEach((o) => o.cleanup());
  };
  return {
    animations: r.map((o) => o.animation),
    cleanup: n
  };
}, Zo = (e, t, r = 100) => e.map((n, o) => {
  const i = B(t?.delay ?? 0) + o * r;
  return _(n, {
    ...t,
    delay: i
  });
}), zn = (e) => e != null && typeof e == "object" && !X(e) && !ne(e) && "value" in e, Wn = (e) => {
  const t = e.keyframes?.properties;
  if (t instanceof Map) return Array.from(t.values());
  const r = e.properties;
  if (typeof r == "string") throw new TypeError("string properties are not used on the CSS compile path");
  if (Array.isArray(r)) return r.map((n, o) => {
    if (n && Array.isArray(n.values) && n.property) return n;
    const i = Object.entries(n || {}).filter(([a]) => a !== "offset" && a !== "easing");
    return {
      property: i[0]?.[0] ?? `p${o}`,
      values: i[0] ? [i[0][1]] : []
    };
  });
  if (r && typeof r == "object") return Object.entries(r).map(([n, o]) => ({
    property: n,
    values: Array.isArray(o) ? o : [o]
  }));
  throw new TypeError("No animatable properties");
}, Hn = (e) => {
  if (e == null) return "";
  const t = typeof Element < "u" && e instanceof Element;
  return typeof e == "object" && "value" in e && !t ? String(e.value ?? "") : String(e);
}, or = (e) => {
  const t = Wn(e), r = Math.max(2, ...t.map((l) => l.values.length)), n = e.offsets ?? Array.from({ length: r }, (l, c) => c / (r - 1)), o = [];
  for (let l = 0; l < r; l++) {
    const c = [];
    for (const f of t) {
      const h = f.values[Math.min(l, f.values.length - 1)];
      c.push(`${ce(f.property)}: ${Hn(h)}`);
    }
    const u = Math.round((n[l] ?? l / (r - 1)) * 100);
    o.push(`${u}% { ${c.join("; ")}; }`);
  }
  const i = o.join("|");
  let a = 0;
  for (let l = 0; l < i.length; l++) a = a * 31 + i.charCodeAt(l) | 0;
  const s = `fest-anim-${(a >>> 0).toString(36)}`;
  return {
    name: s,
    cssText: `@keyframes ${s} {
${o.join(`
`)}
}`,
    fingerprint: i
  };
}, Kn = (e, t) => {
  const r = t.trigger ?? "mount";
  if (zn(r)) throw new TypeError("reactive { value } trigger is not valid on the CSS path");
  const n = or(t), o = `${B(t.duration, 300)}ms`, i = `${B(t.delay, 0)}ms`, a = Nt(t.iterationCount), s = {
    "animation-name": n.name,
    "animation-duration": o,
    "animation-delay": i,
    "animation-iteration-count": a === "Infinity" || a === 1 / 0 ? "infinite" : String(a),
    "animation-direction": t.direction ?? "normal",
    "animation-fill-mode": t.fillMode ?? "none",
    "animation-timing-function": typeof t.easing == "string" ? t.easing : "linear"
  };
  if (r === "hover")
    return t.reverseOnExit && (s["animation-trigger"] = `${N} play-backwards`), {
      selector: `${e}:hover`,
      properties: s
    };
  if (r === "focus") return {
    selector: `${e}:focus`,
    properties: s
  };
  if (r === "show") return {
    selector: `${e}:not([data-hidden])`,
    properties: s
  };
  if (r === "hide") return {
    selector: `${e}[data-hidden]`,
    properties: s
  };
  if (r === "remove") return {
    selector: `${e}[data-removing]`,
    properties: s
  };
  if (r === "manual")
    return s["animation-play-state"] = "paused", {
      selector: e,
      properties: s
    };
  if (r === "click")
    return s["event-trigger"] = `${N} click`, s["animation-trigger"] = `${N} play`, {
      selector: e,
      properties: s
    };
  if (r === "visible")
    return s["timeline-trigger"] = `${N} view contain`, s["animation-trigger"] = `${N} play`, {
      selector: e,
      properties: s
    };
  if (X(r) || ne(r)) {
    const l = ne(r) ? "view" : "scroll";
    return s["timeline-trigger"] = `${N} ${l}`, r.rangeStart && (s["animation-range-start"] = r.rangeStart), r.rangeEnd && (s["animation-range-end"] = r.rangeEnd), {
      selector: e,
      properties: s
    };
  }
  return {
    selector: e,
    properties: s
  };
}, ir = (e, t) => {
  if (typeof Element < "u" && e instanceof Element) throw new TypeError("bindCssAnimation does not accept Element");
  if (typeof CSSStyleDeclaration < "u" && e instanceof CSSStyleDeclaration) {
    const r = e.parentRule;
    if (!r) throw new TypeError("CSSStyleDeclaration has no parentRule");
    return ir(r, t);
  }
  if (typeof CSSStyleRule < "u" && e instanceof CSSStyleRule) {
    const r = e.parentStyleSheet;
    if (!r) throw new TypeError("CSSStyleRule has no parentStyleSheet");
    return {
      sheet: r,
      rule: e,
      selector: e.selectorText
    };
  }
  if (typeof CSSStyleSheet < "u" && e instanceof CSSStyleSheet) {
    const r = t.selector;
    if (!r) throw new TypeError("CSSStyleSheet bind requires options.selector");
    return {
      sheet: e,
      rule: null,
      selector: r
    };
  }
  throw new TypeError("bindCssAnimation target must be a CSSStyleRule, CSSStyleSheet, or CSSStyleDeclaration");
}, Yn = (e) => Object.entries(e).map(([t, r]) => `${t}: ${r};`).join(" "), Go = (e, t) => {
  const r = or(t);
  let n, o;
  if (e && typeof e.insertRule == "function" && e.cssRules && t.selector)
    n = e, o = t.selector;
  else {
    const S = ir(e, t);
    n = S.sheet, o = S.selector;
  }
  const i = Kn(o, t), a = Ke(n, "ux-anim") ?? n, s = a.insertRule ? a : n;
  let l = Ce.get(r.fingerprint);
  if (l)
    l.hosts.has(s) || (s.insertRule(r.cssText, s.cssRules?.length ?? 0), l.keyframesRule || (l.keyframesRule = s.cssRules?.[s.cssRules.length - 1]));
  else {
    s.insertRule(r.cssText, s.cssRules?.length ?? 0);
    const S = s.cssRules?.[s.cssRules.length - 1];
    l = {
      name: r.name,
      count: 0,
      keyframesRule: S,
      hosts: /* @__PURE__ */ new Set(),
      hostCounts: /* @__PURE__ */ new Map()
    }, Ce.set(r.fingerprint, l);
  }
  l.hostCounts ??= /* @__PURE__ */ new Map(), l.count += 1, l.hosts.add(s), l.hostCounts.set(s, (l.hostCounts.get(s) ?? 0) + 1);
  const c = `${i.selector} { ${Yn(i.properties)} }`, u = s.insertRule(c, s.cssRules?.length ?? 0), f = s.cssRules?.[u], h = (S) => {
    try {
      const p = Array.from(S.cssRules || []);
      let y = p.indexOf(l.keyframesRule);
      y < 0 && (y = p.findIndex((w) => String(w?.cssText || "").includes(`@keyframes ${l.name}`))), y >= 0 && S.deleteRule(y);
    } catch {
    }
  };
  let C = !1;
  return () => {
    if (C) return;
    C = !0;
    try {
      const p = Array.from(s.cssRules || []).indexOf(f);
      p >= 0 && s.deleteRule(p);
    } catch {
    }
    l.count -= 1;
    const S = (l.hostCounts?.get(s) ?? 1) - 1;
    if (S <= 0 ? (l.hostCounts?.delete(s), l.hosts.delete(s), h(s)) : l.hostCounts?.set(s, S), l.count <= 0) {
      for (const p of l.hosts) h(p);
      Ce.delete(r.fingerprint);
    }
  };
}, Zn = /* @__PURE__ */ Symbol.for("dom.ts@onBorderObserve"), Qo = globalThis[Zn] ??= /* @__PURE__ */ new WeakMap(), Gn = /* @__PURE__ */ Symbol.for("dom.ts@onContentObserve"), Xo = globalThis[Gn] ??= /* @__PURE__ */ new WeakMap(), Qn = (e) => (typeof e?.current == "object" && (e = e?.element ?? e?.current ?? (typeof e?.self == "object" ? e?.self : null) ?? e), e), tt = (e, t = "*") => typeof e != "string" ? t : e.trim() || t, Ie = (e, t) => {
  if (!e || typeof e.querySelectorAll != "function") return [];
  const r = tt(t, "");
  if (!r) return [];
  try {
    return Array.from(e.querySelectorAll(r) || []);
  } catch {
    return [];
  }
}, kt = (e, t) => {
  if (!e || typeof e.matches != "function") return !1;
  const r = tt(t, "");
  if (!r) return !1;
  try {
    return !!e.matches(r);
  } catch {
    return !1;
  }
}, Xn = (e, t, r, n) => {
  const o = tt(t), i = new Set([...r.split(",") || [r]].map((s) => s.trim())), a = new MutationObserver((s, l) => {
    for (const c of s) if (c.type == "childList") {
      const u = Array.from(c.addedNodes) || [], f = Array.from(c.removedNodes) || [];
      u.push(...Array.from(c.addedNodes || []).flatMap((h) => Ie(h, o))), f.push(...Array.from(c.removedNodes || []).flatMap((h) => Ie(h, o))), [...new Set(u)].filter((h) => kt(h, o))?.map?.((h) => {
        i.forEach((C) => {
          n({
            target: h,
            type: "attributes",
            attributeName: C,
            oldValue: h?.getAttribute?.(C)
          }, l);
        });
      });
    } else kt(c.target, o) && c.attributeName && i.has(c.attributeName) && n(c, l);
  });
  return a.observe(e = Qn(e), {
    attributeOldValue: !0,
    attributes: !0,
    attributeFilter: [...i],
    childList: !0,
    subtree: !0,
    characterData: !0
  }), Ie(e, o).map((s) => i.forEach((l) => n({
    target: s,
    type: "attributes",
    attributeName: l,
    oldValue: s?.getAttribute?.(l)
  }, a))), a;
};
if (typeof globalThis.CustomEvent != "function") {
  class e {
    type;
    detail;
    bubbles;
    cancelable;
    defaultPrevented = !1;
    constructor(r, n) {
      this.type = r, this.detail = n?.detail, this.bubbles = !!n?.bubbles, this.cancelable = !!n?.cancelable;
    }
    preventDefault() {
      this.cancelable && (this.defaultPrevented = !0);
    }
  }
  globalThis.CustomEvent = e;
}
var Jn = (e) => !!e && (e.properties != null || e.keyframes != null), sr = (e) => e?.hasAttribute?.("data-instant") || typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, Mt = (e, t) => e?.dispatchEvent?.(new CustomEvent(t, {
  detail: {},
  bubbles: !0,
  cancelable: !0
})) !== !1, eo = async (e) => {
  if (sr(e)) return;
  await new Promise((r) => {
    (globalThis.requestAnimationFrame ?? ((n) => setTimeout(() => n(0), 0)))(() => r());
  });
  const t = typeof e?.getAnimations == "function" ? e.getAnimations() : [];
  await Promise.all(t.filter((r) => r.playState === "running" || r.playState === "pending").map((r) => r.finished?.catch?.(() => {
  }) ?? Promise.resolve()));
}, to = (e) => !!e && typeof e == "object" && !Array.isArray(e), me = /* @__PURE__ */ new WeakMap(), ro = (e, t) => {
  try {
    return (to(t.properties) ? qn(e, t) : _(e, t))?.animation ?? null;
  } catch (r) {
    const n = r instanceof Error ? r.message : String(r);
    if (!(r instanceof TypeError && /Element/i.test(n)) || typeof e.animate != "function") throw r;
    return e.animate(ve(t), et(t));
  }
}, ar = async (e, t, r, n, o) => {
  if (typeof Element < "u" && !(e instanceof Element) && typeof e?.animate != "function") throw new TypeError("appear/disappear require an Element");
  if (!Mt(e, n)) return !1;
  const i = me.get(e);
  i && i.kind !== r && i.cancel();
  let a = !1, s;
  const l = new Promise((f) => {
    s = f;
  });
  let c = null;
  const u = {
    kind: r,
    cancel() {
      if (!a) {
        a = !0;
        try {
          c?.cancel?.();
        } catch {
        }
        s();
      }
    }
  };
  me.set(e, u);
  try {
    return Jn(t) && !sr(e) && typeof e.animate == "function" && (c = ro(e, t), c?.finished && await Promise.race([Promise.resolve(c.finished).catch(() => {
    }), l])), a || (await Promise.race([eo(e), l]), a) ? !1 : (Mt(e, o), !0);
  } finally {
    me.get(e) === u && me.delete(e);
  }
}, no = (e, t) => ar(e, t, "show", "u2-before-show", "u2-appear"), oo = (e, t) => ar(e, t, "hide", "u2-before-hide", "u2-hidden"), Jo = {
  properties: {
    "--opacity": [
      0,
      0,
      1
    ],
    "--scale": [
      0.8,
      0.8,
      1
    ],
    display: [
      "none",
      "none",
      "revert-layer"
    ],
    pointerEvents: [
      "none",
      "none",
      "revert-layer"
    ]
  },
  duration: 80,
  easing: "linear"
}, ei = {
  properties: {
    "--opacity": [
      1,
      0,
      0
    ],
    "--scale": [
      1,
      0.8,
      0.8
    ],
    display: [
      "revert-layer",
      "revert-layer",
      "none"
    ],
    pointerEvents: [
      "none",
      "none",
      "none"
    ]
  },
  duration: 120,
  easing: "linear"
}, ti = async (e = typeof document < "u" ? document.body : null, t) => {
  e && Xn(e, "*", "data-hidden", (r) => {
    if (r.attributeName !== "data-hidden") return;
    const n = r.target;
    if (n.getAttribute("data-hidden") === r.oldValue) return;
    const o = n.getAttribute("data-hidden") != null, i = o ? t?.disappear : t?.appear;
    Promise.resolve(o ? oo(n, i) : no(n, i)).catch(console.warn);
  });
};
export {
  Wo as A,
  Bt as ANIMATABLE_BRAND,
  fo as ANIM_LAYER,
  N as ANIM_TRIGGER_NAME,
  Tn as AnimatableValue,
  lo as BAKE_CATEGORIES,
  Ot as BAKE_LAYER,
  $r as BAKE_SCREEN_ALSO,
  It as BAKE_SCREEN_ALSO_EXPLORER,
  Ut as BAKE_SCREEN_ALSO_SETTINGS,
  Lr as BAKE_SCREEN_CHROME,
  ue as BAKE_SCREEN_MEDIA,
  $t as CSS_COLOR_PROPERTIES,
  gr as CSS_DIMENSION_UNITS,
  vr as CSS_DIMENSION_UNITS_LIST,
  Er as CSS_MOTION_PROPERTIES,
  br as CSS_TYPOGRAPHY_PROPERTIES,
  wr as CSS_UNIT_FACTORY_ALIASES,
  Lt as CSS_UNIT_TOKEN_RE,
  ze as DEFAULT_CACHE_MS,
  Tr as DEFAULT_CATEGORIES,
  ct as HOST_CSS_FALLBACK,
  Ar as LAYER_NAME,
  Rr as LAYER_OPEN,
  uo as OWNER,
  je as S,
  Pt as STYLE_THEME_ATTRS,
  Cr as STYLE_THEME_OBSERVE_ATTRS,
  kr as UX_HOST_LAYERS,
  bo as UX_PRELOAD_HOST_CSS,
  xr as VEELA_CASCADE_LAYERS,
  co as VIEWER_CSS_LAYER_ORDER,
  Mr as VIEWER_RUNTIME_LAYERS,
  Ae as addAdoptedSheetToElement,
  D as adoptedAppliedText,
  V as adoptedBlobMap,
  Rt as adoptedFilled,
  at as adoptedLayerMap,
  T as adoptedMap,
  it as adoptedSelectorMap,
  pe as adoptedShadowLayerMap,
  st as adoptedShadowSelectorMap,
  Be as adoptedStyleSheetsCache,
  Ce as animKeyframeRefs,
  Do as animatable,
  qn as animate,
  no as appear,
  Hr as applyNormalizedInlineStyle,
  Kt as bakeAlsoQueriesFor,
  le as bakeComputedStyle,
  xn as bakeScreenColors,
  ae as bakeThemeFingerprint,
  L as bakedCache,
  G as bakedFollowers,
  I as bakedLive,
  R as bakedStyles,
  Go as bindCssAnimation,
  zo as bindStyle,
  W as blobURLMap,
  et as buildAnimationTiming,
  yn as buildBakedCssText,
  ve as buildWebAnimationKeyframes,
  de as cacheBlobContentMap,
  H as cacheContentMap,
  U as cacheMap,
  mn as collectBakeAlsoHosts,
  Ht as collectBakeScreenHosts,
  hn as collectBakedDeclarations,
  qo as compileInlineStyleAttribute,
  or as compileKeyframesCss,
  Kn as compileTriggerCss,
  mt as containsMarker,
  Nr as createStyleId,
  M as createTypedUnitValue,
  jo as css,
  Ir as cssEmptyLayerRule,
  Zr as cssImportWithLayer,
  He as cssLayerBlock,
  We as cssLayerOrder,
  F as cssTextForAdoptedSheet,
  ft as cssTextRequiresInlineStyleElement,
  Or as cssUnitConstructorName,
  Pr as cssUnitFactoryName,
  ei as decorHide,
  Jo as decorShow,
  Ho as defineAnimation,
  oo as disappear,
  Mt as dispatchLifecycleEvent,
  _ as doAnimation,
  se as ensureAdoptedSheetContent,
  kn as ensureHostStyles,
  Ye as ensureStyleScopeSelector,
  pt as escapeCSSIdentifier,
  ie as escapeRegExp,
  un as fetchAndCache,
  fn as fetchAsInline,
  Oo as getAdoptedStyleRule,
  Uo as getBakedStyle,
  To as getElementZoom,
  Ke as getOrCreateLayerRule,
  $o as getPadding,
  Y as getPropertyValue,
  Lo as getPxValue,
  sn as getStyleLayer,
  Ze as getStyleRule,
  Ao as getTransform,
  Ro as getTransformOrigin,
  j as getWindowConstructor,
  ge as hasTypedOM,
  ho as hash,
  ti as initVisibility,
  Me as invalidateBakedStyles,
  yo as isAdoptedSheetEmpty,
  Ln as isAnimatableValue,
  jr as isColorToken,
  Br as isCssElement,
  po as isCssLayerName,
  dt as isDocument,
  Ft as isEffectivelyEmptyStyleText,
  qr as isElementVisible,
  ut as isLayerBlockRule,
  $ as isNativeCSSStyleValue,
  fe as isReactiveStyleValue,
  zn as isReactiveTrigger,
  X as isScrollDriven,
  Q as isShadowRoot,
  yt as isStaticStyleInterpolation,
  zr as isStyleBinding,
  oe as isStyleHost,
  mo as isStyleValue,
  he as isUnitValue,
  ne as isViewDriven,
  ao as layerCounter,
  qt as loadAsAdopted,
  tn as loadBlobStyle,
  tr as loadCachedStyles,
  P as loadInlineStyle,
  jt as loadStyleSheet,
  vo as makeHostLayerOrder,
  go as normalizeCssForLayer,
  Nt as normalizeIterationCount,
  Dr as normalizeIterations,
  on as notifyStyleTreeHosts,
  ko as observeStyleTree,
  Vo as onScroll,
  Fo as onView,
  Yo as parallelAnimations,
  ht as parseLength,
  Fr as parseOrigin,
  B as parseTime,
  xo as preloadStyle,
  _t as promiseOrDirect,
  Wr as pruneEmptyStyleAttribute,
  Se as queryFirstDeep,
  Kr as readAttachedCSSUnit,
  Vt as readSheetRuleCount,
  Ue as rebakeBatch,
  Io as rebakeComputedStyle,
  Wt as registerStyleTreeHook,
  lt as registeredProperties,
  No as rehydrateAdoptedStyleSheets,
  Mo as rehydrateConstructableSheets,
  ke as removeAdopted,
  ir as resolveCssAnimationTarget,
  _o as scheduleBakeScreenColors,
  Mn as scheduleEnsureHostStyles,
  Ko as sequenceAnimations,
  Co as setProperty,
  Eo as setStyleInRule,
  we as setStyleProperty,
  Dt as setStylePropertyFallback,
  Jr as setStylePropertyTyped,
  en as setStyleRule,
  Po as setStyleRules,
  vt as setStyleURL,
  Zo as staggerAnimation,
  Ur as stripCssPreamble,
  mr as styleCache,
  Sr as styleElementCache,
  Ee as styleFlushPending,
  Tt as styleTreeHooks,
  be as styleTreeObserved,
  yr as styleTreeRoots,
  z as supportsConstructableStylesheet,
  Fe as unbakeComputedStyle,
  Bo as unbakeScreenColors,
  wo as unwrapCssLayer,
  Vr as urlCanParse,
  So as veelaCascadeOrder,
  eo as waitElementAnimations,
  xe as wrapCssLayer
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3R5bGUtbGliLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyAkYXZvaWRUcmlnZ2VyLCAkZ2V0VmFsdWUsIGNhbWVsVG9LZWJhYiwgZGVyZWYsIGdldE9ySW5zZXJ0Q29tcHV0ZWQsIGhhc1ZhbHVlLCBpc1ZhbCwgaXNWYWx1ZVVuaXQsIHRvUmVmLCB0cnlTdHJpbmdBc051bWJlciB9IGZyb20gXCJAZmVzdC1saWIvY29yZVwiO1xuaW1wb3J0IHsgYWRkVG9DYWxsQ2hhaW4sIGFmZmVjdGVkIH0gZnJvbSBcIkBmZXN0LWxpYi9vYmplY3RcIjtcblxuLy8jcmVnaW9uIHNyYy9tYXBzLnRzXG52YXIgc2hhcmVkID0gKGtleSwgY3JlYXRlKSA9PiBnbG9iYWxUaGlzW1N5bWJvbC5mb3Ioa2V5KV0gPz89IGNyZWF0ZSgpO1xudmFyIGJsb2JVUkxNYXAgPSBzaGFyZWQoXCJkb20udHNAYmxvYlVSTE1hcFwiLCAoKSA9PiAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKSk7XG52YXIgY2FjaGVNYXAgPSBzaGFyZWQoXCJkb20udHNAY2FjaGVNYXBcIiwgKCkgPT4gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKSk7XG52YXIgY2FjaGVDb250ZW50TWFwID0gc2hhcmVkKFwiZG9tLnRzQGNhY2hlQ29udGVudE1hcFwiLCAoKSA9PiAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpKTtcbnZhciBjYWNoZUJsb2JDb250ZW50TWFwID0gc2hhcmVkKFwiZG9tLnRzQGNhY2hlQmxvYkNvbnRlbnRNYXBcIiwgKCkgPT4gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCkpO1xudmFyIGFkb3B0ZWRTZWxlY3Rvck1hcCA9IHNoYXJlZChcImRvbS50c0BhZG9wdGVkU2VsZWN0b3JNYXBcIiwgKCkgPT4gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKSk7XG52YXIgYWRvcHRlZFNoYWRvd1NlbGVjdG9yTWFwID0gc2hhcmVkKFwiZG9tLnRzQGFkb3B0ZWRTaGFkb3dTZWxlY3Rvck1hcFwiLCAoKSA9PiAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKSk7XG52YXIgYWRvcHRlZExheWVyTWFwID0gc2hhcmVkKFwiZG9tLnRzQGFkb3B0ZWRMYXllck1hcFwiLCAoKSA9PiAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpKTtcbnZhciBhZG9wdGVkU2hhZG93TGF5ZXJNYXAgPSBzaGFyZWQoXCJkb20udHNAYWRvcHRlZFNoYWRvd0xheWVyTWFwXCIsICgpID0+IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpKTtcbnZhciBhZG9wdGVkTWFwID0gc2hhcmVkKFwiZG9tLnRzQGFkb3B0ZWRNYXBcIiwgKCkgPT4gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKSk7XG52YXIgYWRvcHRlZEJsb2JNYXAgPSBzaGFyZWQoXCJkb20udHNAYWRvcHRlZEJsb2JNYXBcIiwgKCkgPT4gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCkpO1xudmFyIGFkb3B0ZWRBcHBsaWVkVGV4dCA9IHNoYXJlZChcImRvbS50c0BhZG9wdGVkQXBwbGllZFRleHRcIiwgKCkgPT4gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCkpO1xudmFyIGFkb3B0ZWRGaWxsZWQgPSBzaGFyZWQoXCJkb20udHNAYWRvcHRlZEZpbGxlZFwiLCAoKSA9PiAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtTZXQoKSk7XG52YXIgbGF5ZXJDb3VudGVyID0gc2hhcmVkKFwiZG9tLnRzQGxheWVyQ291bnRlclwiLCAoKSA9PiAwKTtcbnZhciBzdHlsZVRyZWVIb29rcyA9IHNoYXJlZChcImRvbS50c0BzdHlsZVRyZWVIb29rc1wiLCAoKSA9PiAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKTtcbnZhciBzdHlsZVRyZWVPYnNlcnZlZCA9IHNoYXJlZChcImRvbS50c0BzdHlsZVRyZWVPYnNlcnZlZFwiLCAoKSA9PiAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtTZXQoKSk7XG52YXIgc3R5bGVUcmVlUm9vdHMgPSBzaGFyZWQoXCJkb20udHNAc3R5bGVUcmVlUm9vdHNcIiwgKCkgPT4gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk7XG52YXIgYmFrZWRTdHlsZXMgPSBzaGFyZWQoXCJzdHlsZS1saWJAYmFrZWRTdHlsZVwiLCAoKSA9PiAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKSk7XG52YXIgYmFrZWRMaXZlID0gc2hhcmVkKFwic3R5bGUtbGliQGJha2VkTGl2ZVwiLCAoKSA9PiAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKTtcbnZhciBiYWtlZENhY2hlID0gc2hhcmVkKFwic3R5bGUtbGliQGJha2VkQ2FjaGVcIiwgKCkgPT4gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKSk7XG52YXIgcmViYWtlQmF0Y2ggPSBzaGFyZWQoXCJzdHlsZS1saWJAcmViYWtlQmF0Y2hcIiwgKCkgPT4gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk7XG52YXIgYmFrZWRGb2xsb3dlcnMgPSBzaGFyZWQoXCJzdHlsZS1saWJAYmFrZWRGb2xsb3dlcnNcIiwgKCkgPT4gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCkpO1xudmFyIGFkb3B0ZWRTdHlsZVNoZWV0c0NhY2hlID0gc2hhcmVkKFwibHVyLmVAYWRvcHRlZFN0eWxlU2hlZXRzQ2FjaGVcIiwgKCkgPT4gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCkpO1xudmFyIHN0eWxlQ2FjaGUgPSBzaGFyZWQoXCJsdXIuZUBzdHlsZUNhY2hlXCIsICgpID0+IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCkpO1xudmFyIHN0eWxlRWxlbWVudENhY2hlID0gc2hhcmVkKFwibHVyLmVAc3R5bGVFbGVtZW50Q2FjaGVcIiwgKCkgPT4gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCkpO1xudmFyIHN0eWxlRmx1c2hQZW5kaW5nID0gc2hhcmVkKFwic3R5bGUtbGliQHN0eWxlRmx1c2hQZW5kaW5nXCIsICgpID0+IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha1NldCgpKTtcbnZhciByZWdpc3RlcmVkUHJvcGVydGllcyA9IHNoYXJlZChcInN0eWxlLWxpYkByZWdpc3RlcmVkUHJvcGVydGllc1wiLCAoKSA9PiAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKTtcbnZhciBhbmltS2V5ZnJhbWVSZWZzID0gc2hhcmVkKFwic3R5bGUudHNAYW5pbUtleWZyYW1lUmVmc1wiLCAoKSA9PiAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpKTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2NvbnN0YW50cy50c1xudmFyIENTU19ESU1FTlNJT05fVU5JVFNfTElTVCA9IFtcblx0XCIlXCIsXG5cdFwicHhcIixcblx0XCJjbVwiLFxuXHRcIm1tXCIsXG5cdFwicVwiLFxuXHRcImluXCIsXG5cdFwicGNcIixcblx0XCJwdFwiLFxuXHRcImVtXCIsXG5cdFwiZXhcIixcblx0XCJjaFwiLFxuXHRcImNhcFwiLFxuXHRcImljXCIsXG5cdFwibGhcIixcblx0XCJyZW1cIixcblx0XCJyZXhcIixcblx0XCJyY2hcIixcblx0XCJyY2FwXCIsXG5cdFwicmljXCIsXG5cdFwicmxoXCIsXG5cdFwidndcIixcblx0XCJ2aFwiLFxuXHRcInZpXCIsXG5cdFwidmJcIixcblx0XCJ2bWluXCIsXG5cdFwidm1heFwiLFxuXHRcInN2d1wiLFxuXHRcInN2aFwiLFxuXHRcInN2aVwiLFxuXHRcInN2YlwiLFxuXHRcInN2bWluXCIsXG5cdFwic3ZtYXhcIixcblx0XCJsdndcIixcblx0XCJsdmhcIixcblx0XCJsdmlcIixcblx0XCJsdmJcIixcblx0XCJsdm1pblwiLFxuXHRcImx2bWF4XCIsXG5cdFwiZHZ3XCIsXG5cdFwiZHZoXCIsXG5cdFwiZHZpXCIsXG5cdFwiZHZiXCIsXG5cdFwiZHZtaW5cIixcblx0XCJkdm1heFwiLFxuXHRcImNxd1wiLFxuXHRcImNxaFwiLFxuXHRcImNxaVwiLFxuXHRcImNxYlwiLFxuXHRcImNxbWluXCIsXG5cdFwiY3FtYXhcIixcblx0XCJkZWdcIixcblx0XCJncmFkXCIsXG5cdFwicmFkXCIsXG5cdFwidHVyblwiLFxuXHRcInNcIixcblx0XCJtc1wiLFxuXHRcImh6XCIsXG5cdFwia2h6XCIsXG5cdFwiZHBpXCIsXG5cdFwiZHBjbVwiLFxuXHRcImRwcHhcIixcblx0XCJ4XCIsXG5cdFwiZnJcIlxuXTtcbnZhciBDU1NfRElNRU5TSU9OX1VOSVRTID0gbmV3IFNldChDU1NfRElNRU5TSU9OX1VOSVRTX0xJU1QpO1xudmFyIENTU19VTklUX0ZBQ1RPUllfQUxJQVNFUyA9IHtcblx0XCIlXCI6IFwicGVyY2VudFwiLFxuXHRxOiBcIlFcIixcblx0aHo6IFwiSHpcIixcblx0a2h6OiBcImtIelwiLFxuXHRmcjogXCJmbGV4XCJcbn07XG52YXIgQ1NTX1VOSVRfVE9LRU5fUkUgPSAvXiglfFthLXpBLVpdKykvO1xudmFyIENTU19DT0xPUl9QUk9QRVJUSUVTID0gW1xuXHRcImNvbG9yXCIsXG5cdFwiYmFja2dyb3VuZC1jb2xvclwiLFxuXHRcImJvcmRlci1jb2xvclwiLFxuXHRcImJvcmRlci10b3AtY29sb3JcIixcblx0XCJib3JkZXItcmlnaHQtY29sb3JcIixcblx0XCJib3JkZXItYm90dG9tLWNvbG9yXCIsXG5cdFwiYm9yZGVyLWxlZnQtY29sb3JcIixcblx0XCJvdXRsaW5lLWNvbG9yXCIsXG5cdFwiYWNjZW50LWNvbG9yXCIsXG5cdFwiY2FyZXQtY29sb3JcIixcblx0XCJ0ZXh0LWRlY29yYXRpb24tY29sb3JcIixcblx0XCJjb2x1bW4tcnVsZS1jb2xvclwiLFxuXHRcImZpbGxcIixcblx0XCJzdHJva2VcIixcblx0XCJmbG9vZC1jb2xvclwiLFxuXHRcImxpZ2h0aW5nLWNvbG9yXCIsXG5cdFwic3RvcC1jb2xvclwiXG5dO1xudmFyIENTU19UWVBPR1JBUEhZX1BST1BFUlRJRVMgPSBbXG5cdFwiZm9udC1mYW1pbHlcIixcblx0XCJmb250LXNpemVcIixcblx0XCJmb250LXdlaWdodFwiLFxuXHRcImZvbnQtc3R5bGVcIixcblx0XCJmb250LXN0cmV0Y2hcIixcblx0XCJsaW5lLWhlaWdodFwiLFxuXHRcImxldHRlci1zcGFjaW5nXCIsXG5cdFwid29yZC1zcGFjaW5nXCJcbl07XG52YXIgQ1NTX01PVElPTl9QUk9QRVJUSUVTID0gW1xuXHRcInRyYW5zaXRpb24tZHVyYXRpb25cIixcblx0XCJ0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvblwiLFxuXHRcImFuaW1hdGlvbi1kdXJhdGlvblwiLFxuXHRcImFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb25cIlxuXTtcbnZhciBTVFlMRV9USEVNRV9BVFRSUyA9IFtcblx0XCJkYXRhLXRoZW1lXCIsXG5cdFwiZGF0YS1leHBsb3Jlci1jb2xvci1zY2hlbWVcIixcblx0XCJkYXRhLWNvbG9yLXNjaGVtZVwiLFxuXHRcInRoZW1lXCIsXG5cdFwiY29sb3Itc2NoZW1lXCJcbl07XG52YXIgU1RZTEVfVEhFTUVfT0JTRVJWRV9BVFRSUyA9IFtcblx0Li4uU1RZTEVfVEhFTUVfQVRUUlMsXG5cdFwic3R5bGVcIixcblx0XCJjbGFzc1wiXG5dO1xudmFyIEJBS0VfQ0FURUdPUklFUyA9IFtcblx0XCJ0b2tlbnNcIixcblx0XCJjb2xvcnNcIixcblx0XCJ0eXBvZ3JhcGh5XCIsXG5cdFwibW90aW9uXCJcbl07XG52YXIgVkVFTEFfQ0FTQ0FERV9MQVlFUlMgPSBbXG5cdFwidG9rZW5zXCIsXG5cdFwiYmFzZVwiLFxuXHRcImxheW91dFwiLFxuXHRcImNvbXBvbmVudHNcIixcblx0XCJ1dGlsaXRpZXNcIixcblx0XCJ0aGVtZVwiLFxuXHRcIm92ZXJyaWRlc1wiLFxuXHRcInByaW50XCJcbl07XG52YXIgVVhfSE9TVF9MQVlFUlMgPSBbXCJ1eC1wcmVsb2FkXCIsIFwidXgtbGF5ZXJcIl07XG52YXIgVklFV0VSX1JVTlRJTUVfTEFZRVJTID0gW1xuXHRcInJzLW1kLWJhc2VcIixcblx0XCJycy1tZC1zeXN0ZW1cIixcblx0XCJycy1tZC1tb2R1bGVzXCIsXG5cdFwicnMtbWQtdXNlclwiLFxuXHRcInJzLW1kLXByaW50XCIsXG5cdFwicnMtbWQtdXNlci1wcmludFwiXG5dO1xudmFyIFZJRVdFUl9DU1NfTEFZRVJfT1JERVIgPSBWSUVXRVJfUlVOVElNRV9MQVlFUlM7XG52YXIgTEFZRVJfTkFNRSA9IC9eW2EtekEtWjAtOV8uLV0rJC87XG52YXIgTEFZRVJfT1BFTiA9IC9eQGxheWVyXFxzKyhbYS16QS1aMC05Xy4tXSspXFxzKlxcey87XG52YXIgT1dORVIgPSBcIkRPTVwiO1xudmFyIEhPU1RfQ1NTX0ZBTExCQUNLID0gXCJkYXRhLWdsaXQtaG9zdC1jc3NcIjtcbnZhciBCQUtFX0xBWUVSID0gXCJ1eC1iYWtlZFwiO1xudmFyIERFRkFVTFRfQ0FURUdPUklFUyA9IFtcImNvbG9yc1wiLCBcInRva2Vuc1wiXTtcbnZhciBERUZBVUxUX0NBQ0hFX01TID0gM2U0O1xudmFyIEJBS0VfU0NSRUVOX01FRElBID0gXCJzY3JlZW5cIjtcbnZhciBCQUtFX1NDUkVFTl9DSFJPTUUgPSBbXG5cdFwidWktd2luZG93LWZyYW1lXCIsXG5cdFwidWktbW9kYWxcIixcblx0XCJhcHAtYm94XCIsXG5cdFwiLnVpLW1vZGFsLWRpYWxvZ1wiLFxuXHRcIi51aS1tb2RhbC1wYW5lbFwiXG5dO1xudmFyIEJBS0VfU0NSRUVOX0FMU09fRVhQTE9SRVIgPSBbXG5cdFwiLnJvdy5jMi1zdXJmYWNlXCIsXG5cdFwiLnJvdy5jMi1zdXJmYWNlW2RhdGEta2luZD1kaXJlY3RvcnldXCIsXG5cdFwiLnJvdy5jMi1zdXJmYWNlW2RhdGEta2luZD1maWxlXVwiLFxuXHRcIi5yb3cuYzItc3VyZmFjZSAuYy5uYW1lXCIsXG5cdFwiLmZtLWdyaWQtaGVhZGVyXCJcbl07XG52YXIgQkFLRV9TQ1JFRU5fQUxTT19TRVRUSU5HUyA9IFtcblx0XCIuZmllbGRcIixcblx0XCIuZm9ybS1pbnB1dFwiLFxuXHRcIi5mb3JtLXNlbGVjdFwiLFxuXHRcIi5maWVsZC1jb250cm9sXCJcbl07XG52YXIgQkFLRV9TQ1JFRU5fQUxTTyA9IFsuLi5CQUtFX1NDUkVFTl9BTFNPX0VYUExPUkVSLCAuLi5CQUtFX1NDUkVFTl9BTFNPX1NFVFRJTkdTXTtcbnZhciBBTklNQVRBQkxFX0JSQU5EID0gU3ltYm9sLmZvcihcImZlc3QuYW5pbWF0YWJsZVwiKTtcbnZhciBBTklNX0xBWUVSID0gXCJ1eC1hbmltXCI7XG52YXIgQU5JTV9UUklHR0VSX05BTUUgPSBcIi0tZmVzdC10XCI7XG52YXIgaGFzVHlwZWRPTSA9IHR5cGVvZiBDU1NTdHlsZVZhbHVlICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBDU1NVbml0VmFsdWUgIT09IFwidW5kZWZpbmVkXCI7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy91dGlscy50c1xudmFyIGNzc1VuaXRGYWN0b3J5TmFtZSA9ICh1bml0KSA9PiBDU1NfVU5JVF9GQUNUT1JZX0FMSUFTRVNbdW5pdC50b0xvd2VyQ2FzZSgpXSA/PyB1bml0LnRvTG93ZXJDYXNlKCk7XG52YXIgY3NzVW5pdENvbnN0cnVjdG9yTmFtZSA9ICh1bml0KSA9PiB1bml0LnRvTG93ZXJDYXNlKCkgPT09IFwiJVwiID8gXCJwZXJjZW50XCIgOiB1bml0LnRvTG93ZXJDYXNlKCk7XG52YXIgaXNDc3NMYXllck5hbWUgPSAobmFtZSkgPT4gTEFZRVJfTkFNRS50ZXN0KG5hbWUpO1xudmFyIGNzc0VtcHR5TGF5ZXJSdWxlID0gKGxheWVyTmFtZSkgPT4gYEBsYXllciAke2xheWVyTmFtZX0ge31gO1xudmFyIHN0cmlwQ3NzUHJlYW1ibGUgPSAoY3NzKSA9PiB7XG5cdGxldCBvdXQgPSBTdHJpbmcoY3NzIHx8IFwiXCIpLnRyaW0oKTtcblx0b3V0ID0gb3V0LnJlcGxhY2UoL14oQGNoYXJzZXRcXHMrW147XSs7XFxzKikrL2ksIFwiXCIpO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xuXHRcdGNvbnN0IG5leHQgPSBvdXQucmVwbGFjZSgvXlxcL1xcKltcXHNcXFNdKj9cXCpcXC9cXHMqLywgXCJcIik7XG5cdFx0aWYgKG5leHQgPT09IG91dCkgYnJlYWs7XG5cdFx0b3V0ID0gbmV4dC50cmltKCk7XG5cdH1cblx0cmV0dXJuIG91dDtcbn07XG52YXIgaXNMYXllckJsb2NrUnVsZSA9IChydWxlKSA9PiB0eXBlb2YgQ1NTTGF5ZXJCbG9ja1J1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgcnVsZSBpbnN0YW5jZW9mIENTU0xheWVyQmxvY2tSdWxlO1xudmFyIHN1cHBvcnRzQ29uc3RydWN0YWJsZVN0eWxlc2hlZXQgPSAoKSA9PiB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgZ2xvYmFsVGhpcy5DU1NTdHlsZVNoZWV0ID09PSBcImZ1bmN0aW9uXCI7XG52YXIgY3NzVGV4dFJlcXVpcmVzSW5saW5lU3R5bGVFbGVtZW50ID0gKGNzcykgPT4gdHlwZW9mIGNzcyA9PT0gXCJzdHJpbmdcIiAmJiAvQGltcG9ydFxcYi9pLnRlc3QoY3NzKTtcbnZhciBwcm9taXNlT3JEaXJlY3QgPSAocHJvbWlzZSwgY2IpID0+IHtcblx0aWYgKHR5cGVvZiBwcm9taXNlPy50aGVuID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHByb21pc2U/LnRoZW4/LihjYik7XG5cdHJldHVybiBjYihwcm9taXNlKTtcbn07XG52YXIgaXNTaGFkb3dSb290ID0gKHZhbHVlKSA9PiB0eXBlb2YgU2hhZG93Um9vdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB2YWx1ZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3Q7XG52YXIgaXNEb2N1bWVudCA9ICh2YWx1ZSkgPT4gdHlwZW9mIERvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIHZhbHVlIGluc3RhbmNlb2YgRG9jdW1lbnQ7XG52YXIgaXNDc3NFbGVtZW50ID0gKHZhbHVlKSA9PiB0eXBlb2YgRWxlbWVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB2YWx1ZSBpbnN0YW5jZW9mIEVsZW1lbnQ7XG52YXIgZXNjYXBlQ1NTSWRlbnRpZmllciA9ICh2YWx1ZSkgPT4ge1xuXHRpZiAodHlwZW9mIENTUyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgQ1NTLmVzY2FwZSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gQ1NTLmVzY2FwZSh2YWx1ZSk7XG5cdHJldHVybiBBcnJheS5mcm9tKHZhbHVlKS5tYXAoKGNoYXIpID0+IGBcXFxcJHtjaGFyLmNvZGVQb2ludEF0KDApLnRvU3RyaW5nKDE2KX0gYCkuam9pbihcIlwiKTtcbn07XG52YXIgc3R5bGVJZENvdW50ZXIgPSAwO1xudmFyIGNyZWF0ZVN0eWxlSWQgPSAoKSA9PiB7XG5cdGlmICh0eXBlb2YgY3J5cHRvICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBjcnlwdG8ucmFuZG9tVVVJRCA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gY3J5cHRvLnJhbmRvbVVVSUQoKTtcblx0cmV0dXJuIGB1eC0ke0RhdGUubm93KCkudG9TdHJpbmcoMzYpfS0keygrK3N0eWxlSWRDb3VudGVyKS50b1N0cmluZygzNil9YDtcbn07XG52YXIgdXJsQ2FuUGFyc2UgPSAodmFsdWUpID0+IHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gdHlwZW9mIFVSTCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgVVJMLmNhblBhcnNlID09PSBcImZ1bmN0aW9uXCIgJiYgVVJMLmNhblBhcnNlKHZhbHVlKTtcblx0fSBjYXRjaCB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59O1xudmFyIGhhc2ggPSBhc3luYyAoc3RyaW5nKSA9PiB7XG5cdGNvbnN0IGhhc2hCdWZmZXIgPSBhd2FpdCBjcnlwdG8/LnN1YnRsZT8uZGlnZXN0KFwiU0hBLTI1NlwiLCB0eXBlb2Ygc3RyaW5nID09IFwic3RyaW5nXCIgPyBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoc3RyaW5nKSA6IHN0cmluZyBpbnN0YW5jZW9mIEFycmF5QnVmZmVyID8gc3RyaW5nIDogYXdhaXQgc3RyaW5nPy5hcnJheUJ1ZmZlcj8uKCkpO1xuXHRyZXR1cm4gXCJzaGEyNTYtXCIgKyBidG9hKFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgbmV3IFVpbnQ4QXJyYXkoaGFzaEJ1ZmZlcikpKTtcbn07XG52YXIgcGFyc2VMZW5ndGggPSAodmFsdWUsIHNpemUpID0+IHtcblx0aWYgKHZhbHVlLmVuZHNXaXRoKFwiJVwiKSkgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpIC8gMTAwICogc2l6ZSgpO1xuXHRyZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSk7XG59O1xudmFyIHBhcnNlT3JpZ2luID0gKG9yaWdpbiwgZWxlbWVudCkgPT4ge1xuXHRjb25zdCB2YWx1ZXMgPSBvcmlnaW4uc3BsaXQoXCIgXCIpO1xuXHRyZXR1cm4gbmV3IERPTVBvaW50KHBhcnNlTGVuZ3RoKHZhbHVlc1swXSwgKCkgPT4gZWxlbWVudC5jbGllbnRXaWR0aCksIHBhcnNlTGVuZ3RoKHZhbHVlc1sxXSwgKCkgPT4gZWxlbWVudC5jbGllbnRIZWlnaHQpKTtcbn07XG52YXIgcGFyc2VUaW1lID0gKHYsIGZhbGxiYWNrID0gMCkgPT4ge1xuXHRpZiAodHlwZW9mIHYgPT09IFwibnVtYmVyXCIpIHJldHVybiB2O1xuXHRpZiAoIXYpIHJldHVybiBmYWxsYmFjaztcblx0Y29uc3QgdCA9IFN0cmluZyh2KS50cmltKCk7XG5cdGlmICh0LmVuZHNXaXRoKFwibXNcIikpIHJldHVybiBwYXJzZUZsb2F0KHQpO1xuXHRpZiAodC5lbmRzV2l0aChcInNcIikpIHJldHVybiBwYXJzZUZsb2F0KHQpICogMWUzO1xuXHRyZXR1cm4gcGFyc2VGbG9hdCh0KSB8fCBmYWxsYmFjaztcbn07XG52YXIgbm9ybWFsaXplSXRlcmF0aW9uQ291bnQgPSAoY291bnQpID0+IHtcblx0aWYgKGNvdW50ID09PSB2b2lkIDApIHJldHVybiAxO1xuXHRpZiAoY291bnQgPT09IC0xIHx8IGNvdW50ID09PSBJbmZpbml0eSkgcmV0dXJuIEluZmluaXR5O1xuXHRyZXR1cm4gTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihjb3VudCkpO1xufTtcbnZhciBub3JtYWxpemVJdGVyYXRpb25zID0gKG4pID0+IG4gPT09IC0xIHx8IG4gPT09IEluZmluaXR5ID8gSW5maW5pdHkgOiBNYXRoLm1heCgxLCBuID8/IDEpO1xudmFyIGlzU2Nyb2xsRHJpdmVuID0gKHQpID0+IHQgIT0gbnVsbCAmJiB0eXBlb2YgdCA9PT0gXCJvYmplY3RcIiAmJiB0LmtpbmQgPT09IFwic2Nyb2xsXCI7XG52YXIgaXNWaWV3RHJpdmVuID0gKHQpID0+IHQgIT0gbnVsbCAmJiB0eXBlb2YgdCA9PT0gXCJvYmplY3RcIiAmJiB0LmtpbmQgPT09IFwidmlld1wiO1xudmFyIGlzU3R5bGVIb3N0ID0gKG5vZGUpID0+IHtcblx0aWYgKCFub2RlIHx8IG5vZGUubm9kZVR5cGUgIT09IDEpIHJldHVybiBmYWxzZTtcblx0aWYgKFN0cmluZyhub2RlLmxvY2FsTmFtZSB8fCBcIlwiKS5pbmNsdWRlcyhcIi1cIikpIHJldHVybiB0cnVlO1xuXHRpZiAobm9kZS5zaGFkb3dSb290KSByZXR1cm4gdHJ1ZTtcblx0aWYgKG5vZGUuc3R5bGVzICE9IG51bGwpIHJldHVybiB0cnVlO1xuXHRyZXR1cm4gZmFsc2U7XG59O1xudmFyIHJlYWRTaGVldFJ1bGVDb3VudCA9IChzaGVldCkgPT4ge1xuXHR0cnkge1xuXHRcdHJldHVybiBzaGVldC5jc3NSdWxlcy5sZW5ndGg7XG5cdH0gY2F0Y2gge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG59O1xudmFyIGlzQWRvcHRlZFNoZWV0RW1wdHkgPSAoc2hlZXQpID0+IHtcblx0aWYgKCFzaGVldCkgcmV0dXJuIHRydWU7XG5cdGNvbnN0IGNvdW50ID0gcmVhZFNoZWV0UnVsZUNvdW50KHNoZWV0KTtcblx0aWYgKGNvdW50ID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdHJldHVybiBjb3VudCA9PT0gMDtcbn07XG52YXIgaXNDb2xvclRva2VuID0gKG5hbWUpID0+IG5hbWUgPT09IFwiLS1iYXNlLWNvbG9yXCIgfHwgbmFtZS5zdGFydHNXaXRoKFwiLS1jb2xvci1cIikgfHwgbmFtZS5lbmRzV2l0aChcIi1jb2xvclwiKSB8fCBuYW1lLmVuZHNXaXRoKFwiLWZnXCIpIHx8IG5hbWUuZW5kc1dpdGgoXCItYmdcIik7XG52YXIgaXNFbGVtZW50VmlzaWJsZSA9IChlbCkgPT4ge1xuXHRpZiAoIWVsLmlzQ29ubmVjdGVkKSByZXR1cm4gZmFsc2U7XG5cdGlmICh0eXBlb2YgZWwuZ2V0Q2xpZW50UmVjdHMgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHRydWU7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGVsLmdldENsaWVudFJlY3RzKCkubGVuZ3RoID4gMDtcblx0fSBjYXRjaCB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn07XG52YXIgaXNTdHlsZUJpbmRpbmcgPSAoc3R5bGVzKSA9PiB7XG5cdHJldHVybiBBcnJheS5pc0FycmF5KHN0eWxlcykgJiYgdHlwZW9mIHN0eWxlc1swXSA9PT0gXCJmdW5jdGlvblwiO1xufTtcbnZhciBpc0VmZmVjdGl2ZWx5RW1wdHlTdHlsZVRleHQgPSAoY3NzVGV4dCkgPT4ge1xuXHRjb25zdCBzb3VyY2UgPSB0eXBlb2YgY3NzVGV4dCA9PT0gXCJzdHJpbmdcIiA/IGNzc1RleHQudHJpbSgpIDogXCJcIjtcblx0aWYgKCFzb3VyY2UpIHJldHVybiB0cnVlO1xuXHRmb3IgKGNvbnN0IGNodW5rIG9mIHNvdXJjZS5zcGxpdChcIjtcIikpIHtcblx0XHRjb25zdCBkZWNsYXJhdGlvbiA9IGNodW5rLnRyaW0oKTtcblx0XHRpZiAoIWRlY2xhcmF0aW9uKSBjb250aW51ZTtcblx0XHRjb25zdCBjb2xvbkluZGV4ID0gZGVjbGFyYXRpb24uaW5kZXhPZihcIjpcIik7XG5cdFx0aWYgKGNvbG9uSW5kZXggPCAwKSByZXR1cm4gZmFsc2U7XG5cdFx0aWYgKGRlY2xhcmF0aW9uLnNsaWNlKGNvbG9uSW5kZXggKyAxKS50cmltKCkubGVuZ3RoID4gMCkgcmV0dXJuIGZhbHNlO1xuXHR9XG5cdHJldHVybiB0cnVlO1xufTtcbnZhciBwcnVuZUVtcHR5U3R5bGVBdHRyaWJ1dGUgPSAoZWxlbWVudCkgPT4ge1xuXHRpZiAoZWxlbWVudCA9PSBudWxsKSByZXR1cm47XG5cdGNvbnN0IHJhdyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwic3R5bGVcIik7XG5cdGlmIChyYXcgPT0gbnVsbCkgcmV0dXJuO1xuXHRpZiAoaXNFZmZlY3RpdmVseUVtcHR5U3R5bGVUZXh0KHJhdykpIHtcblx0XHRlbGVtZW50LnN0eWxlLmNzc1RleHQgPSBcIlwiO1xuXHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XG5cdH1cbn07XG52YXIgYXBwbHlOb3JtYWxpemVkSW5saW5lU3R5bGUgPSAoZWxlbWVudCwgY3NzVGV4dCkgPT4ge1xuXHRpZiAoaXNFZmZlY3RpdmVseUVtcHR5U3R5bGVUZXh0KGNzc1RleHQpKSB7XG5cdFx0ZWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gXCJcIjtcblx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xuXHRcdHJldHVybjtcblx0fVxuXHRlbGVtZW50LnN0eWxlLmNzc1RleHQgPSBjc3NUZXh0O1xufTtcbnZhciBpc05hdGl2ZUNTU1N0eWxlVmFsdWUgPSAodmFsdWUpID0+IHtcblx0aWYgKHZhbHVlID09IG51bGwgfHwgdHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiKSByZXR1cm4gZmFsc2U7XG5cdHRyeSB7XG5cdFx0Y29uc3QgQ1NTU3R5bGVWYWx1ZUN0b3IgPSBnbG9iYWxUaGlzLkNTU1N0eWxlVmFsdWU7XG5cdFx0aWYgKHR5cGVvZiBDU1NTdHlsZVZhbHVlQ3RvciA9PT0gXCJmdW5jdGlvblwiICYmIHZhbHVlIGluc3RhbmNlb2YgQ1NTU3R5bGVWYWx1ZUN0b3IpIHJldHVybiB0cnVlO1xuXHRcdGZvciAobGV0IHByb3RvdHlwZSA9IHZhbHVlOyBwcm90b3R5cGU7IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpKSBpZiAocHJvdG90eXBlPy5jb25zdHJ1Y3Rvcj8ubmFtZSA9PT0gXCJDU1NTdHlsZVZhbHVlXCIpIHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIHt9XG5cdHJldHVybiBmYWxzZTtcbn07XG52YXIgaXNSZWFjdGl2ZVN0eWxlVmFsdWUgPSAodmFsdWUpID0+IHtcblx0aWYgKHZhbHVlID09IG51bGwgfHwgdHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiIHx8IGlzTmF0aXZlQ1NTU3R5bGVWYWx1ZSh2YWx1ZSkpIHJldHVybiBmYWxzZTtcblx0dHJ5IHtcblx0XHRyZXR1cm4gXCJ2YWx1ZVwiIGluIHZhbHVlO1xuXHR9IGNhdGNoIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn07XG52YXIgaXNTdGF0aWNTdHlsZUludGVycG9sYXRpb24gPSAodmFsdWUpID0+IHtcblx0cmV0dXJuIHZhbHVlID09IG51bGwgfHwgdHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiO1xufTtcbnZhciBlc2NhcGVSZWdFeHAgPSAodmFsdWUpID0+IHtcblx0cmV0dXJuIHZhbHVlLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcbn07XG52YXIgY29udGFpbnNNYXJrZXIgPSAoY3NzVmFsdWUsIG1hcmtlcikgPT4ge1xuXHRyZXR1cm4gbmV3IFJlZ0V4cChgdmFyXFxcXChcXFxccyoke2VzY2FwZVJlZ0V4cChtYXJrZXIpfVxcXFxzKlxcXFwpYCkudGVzdChjc3NWYWx1ZSk7XG59O1xudmFyIHJlYWRBdHRhY2hlZENTU1VuaXQgPSAodGV4dCkgPT4ge1xuXHRjb25zdCBtYXRjaCA9IENTU19VTklUX1RPS0VOX1JFLmV4ZWModGV4dCk7XG5cdGlmICghbWF0Y2gpIHJldHVybiBudWxsO1xuXHRjb25zdCBhdXRob3JlZCA9IG1hdGNoWzBdO1xuXHRjb25zdCBub3JtYWxpemVkID0gYXV0aG9yZWQudG9Mb3dlckNhc2UoKTtcblx0aWYgKCFDU1NfRElNRU5TSU9OX1VOSVRTLmhhcyhub3JtYWxpemVkKSkgcmV0dXJuIG51bGw7XG5cdHJldHVybiB7XG5cdFx0YXV0aG9yZWQsXG5cdFx0bm9ybWFsaXplZCxcblx0XHRsZW5ndGg6IGF1dGhvcmVkLmxlbmd0aFxuXHR9O1xufTtcbnZhciBnZXRXaW5kb3dDb25zdHJ1Y3RvciA9ICh3aW4sIG5hbWUpID0+IHtcblx0cmV0dXJuIHdpbj8uW25hbWVdID8/IGdsb2JhbFRoaXM/LltuYW1lXTtcbn07XG52YXIgY3JlYXRlVHlwZWRVbml0VmFsdWUgPSAod2luLCB1bml0LCB2YWx1ZSkgPT4ge1xuXHRjb25zdCBDU1NOYW1lc3BhY2UgPSB3aW4/LkNTUztcblx0Y29uc3QgZmFjdG9yeU5hbWUgPSBjc3NVbml0RmFjdG9yeU5hbWUodW5pdCk7XG5cdGNvbnN0IGZhY3RvcnkgPSBDU1NOYW1lc3BhY2U/LltmYWN0b3J5TmFtZV07XG5cdGlmICh0eXBlb2YgZmFjdG9yeSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFjdG9yeS5jYWxsKENTU05hbWVzcGFjZSwgdmFsdWUpO1xuXHRjb25zdCBDU1NVbml0VmFsdWVDdG9yID0gZ2V0V2luZG93Q29uc3RydWN0b3Iod2luLCBcIkNTU1VuaXRWYWx1ZVwiKTtcblx0aWYgKHR5cGVvZiBDU1NVbml0VmFsdWVDdG9yICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoYFR5cGVkIE9NIGRvZXMgbm90IHN1cHBvcnQgQ1NTIHVuaXQgXCIke3VuaXR9XCJgKTtcblx0cmV0dXJuIG5ldyBDU1NVbml0VmFsdWVDdG9yKHZhbHVlLCBjc3NVbml0Q29uc3RydWN0b3JOYW1lKHVuaXQpKTtcbn07XG52YXIgaXNTdHlsZVZhbHVlID0gKHZhbCkgPT4gaGFzVHlwZWRPTSAmJiB2YWwgaW5zdGFuY2VvZiBDU1NTdHlsZVZhbHVlO1xudmFyIGlzVW5pdFZhbHVlID0gKHZhbCkgPT4gaGFzVHlwZWRPTSAmJiB2YWwgaW5zdGFuY2VvZiBDU1NVbml0VmFsdWU7XG52YXIgcXVlcnlGaXJzdERlZXAgPSAocm9vdCwgc2VsZWN0b3IpID0+IHtcblx0aWYgKCFyb290IHx8ICFzZWxlY3RvcikgcmV0dXJuIG51bGw7XG5cdGNvbnN0IHRyeVF1ZXJ5ID0gKHNjb3BlKSA9PiB7XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IGhpdCA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3I/LihzZWxlY3Rvcik7XG5cdFx0XHRyZXR1cm4gaGl0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgPyBoaXQgOiBudWxsO1xuXHRcdH0gY2F0Y2gge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9O1xuXHRjb25zdCBkaXJlY3QgPSB0cnlRdWVyeShyb290KTtcblx0aWYgKGRpcmVjdCkgcmV0dXJuIGRpcmVjdDtcblx0aWYgKHJvb3QgaW5zdGFuY2VvZiBFbGVtZW50ICYmIHJvb3Quc2hhZG93Um9vdCkge1xuXHRcdGNvbnN0IGlubmVyID0gcXVlcnlGaXJzdERlZXAocm9vdC5zaGFkb3dSb290LCBzZWxlY3Rvcik7XG5cdFx0aWYgKGlubmVyKSByZXR1cm4gaW5uZXI7XG5cdH1cblx0aWYgKHR5cGVvZiByb290LnF1ZXJ5U2VsZWN0b3JBbGwgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG51bGw7XG5cdGZvciAoY29uc3QgZWwgb2Ygcm9vdC5xdWVyeVNlbGVjdG9yQWxsKFwiKlwiKSkge1xuXHRcdGlmICghZWwuc2hhZG93Um9vdCkgY29udGludWU7XG5cdFx0Y29uc3QgaGl0ID0gcXVlcnlGaXJzdERlZXAoZWwuc2hhZG93Um9vdCwgc2VsZWN0b3IpO1xuXHRcdGlmIChoaXQpIHJldHVybiBoaXQ7XG5cdH1cblx0cmV0dXJuIG51bGw7XG59O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvbGF5ZXJzLnRzXG52YXIgY3NzTGF5ZXJPcmRlciA9ICguLi5ncm91cHMpID0+IHtcblx0Y29uc3Qgc2VlbiA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdGNvbnN0IG5hbWVzID0gW107XG5cdGZvciAoY29uc3QgZ3JvdXAgb2YgZ3JvdXBzKSB7XG5cdFx0aWYgKGdyb3VwID09IG51bGwpIGNvbnRpbnVlO1xuXHRcdGNvbnN0IGxpc3QgPSB0eXBlb2YgZ3JvdXAgPT09IFwic3RyaW5nXCIgPyBbZ3JvdXBdIDogZ3JvdXA7XG5cdFx0Zm9yIChjb25zdCByYXcgb2YgbGlzdCkge1xuXHRcdFx0Y29uc3QgbmFtZSA9IFN0cmluZyhyYXcgfHwgXCJcIikudHJpbSgpO1xuXHRcdFx0aWYgKCFuYW1lIHx8IHNlZW4uaGFzKG5hbWUpKSBjb250aW51ZTtcblx0XHRcdHNlZW4uYWRkKG5hbWUpO1xuXHRcdFx0bmFtZXMucHVzaChuYW1lKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG5hbWVzLmxlbmd0aCA/IGBAbGF5ZXIgJHtuYW1lcy5qb2luKFwiLCBcIil9O2AgOiBcIlwiO1xufTtcbnZhciB2ZWVsYUNhc2NhZGVPcmRlciA9ICgpID0+IGNzc0xheWVyT3JkZXIoVkVFTEFfQ0FTQ0FERV9MQVlFUlMpO1xudmFyIG1ha2VIb3N0TGF5ZXJPcmRlciA9IChleHRyYSkgPT4gY3NzTGF5ZXJPcmRlcihVWF9IT1NUX0xBWUVSUywgZXh0cmEpO1xudmFyIGNzc0xheWVyQmxvY2sgPSAobGF5ZXJOYW1lLCBjc3NUZXh0KSA9PiB7XG5cdGNvbnN0IGJvZHkgPSAoY3NzVGV4dCB8fCBcIlwiKS50cmltKCk7XG5cdGlmICghbGF5ZXJOYW1lIHx8ICFib2R5KSByZXR1cm4gXCJcIjtcblx0cmV0dXJuIGBAbGF5ZXIgJHtsYXllck5hbWV9IHtcXG4ke2JvZHl9XFxufWA7XG59O1xudmFyIHdyYXBDc3NMYXllciA9IChjc3NUZXh0LCBsYXllck5hbWUpID0+IGxheWVyTmFtZSA/IGBAbGF5ZXIgJHtsYXllck5hbWV9IHsgJHtjc3NUZXh0fSB9YCA6IGNzc1RleHQ7XG52YXIgbm9ybWFsaXplQ3NzRm9yTGF5ZXIgPSAobGF5ZXJOYW1lLCBjc3NUZXh0KSA9PiB7XG5cdGNvbnN0IHRyaW1tZWQgPSAoY3NzVGV4dCB8fCBcIlwiKS50cmltKCk7XG5cdGlmICghdHJpbW1lZCkgcmV0dXJuIFwiXCI7XG5cdGlmICgvXkBsYXllclxcYi8udGVzdCh0cmltbWVkKSkgcmV0dXJuIHRyaW1tZWQ7XG5cdHJldHVybiBjc3NMYXllckJsb2NrKGxheWVyTmFtZSwgdHJpbW1lZCk7XG59O1xudmFyIHVud3JhcE91dGVyTGF5ZXJCbG9jayA9IChjc3MsIGV4cGVjdGVkTmFtZSkgPT4ge1xuXHRjb25zdCBtYXRjaCA9IGNzcy5tYXRjaChMQVlFUl9PUEVOKTtcblx0aWYgKCFtYXRjaCkgcmV0dXJuIG51bGw7XG5cdGlmIChleHBlY3RlZE5hbWUgJiYgbWF0Y2hbMV0gIT09IGV4cGVjdGVkTmFtZSkgcmV0dXJuIG51bGw7XG5cdGNvbnN0IG9wZW4gPSBtYXRjaFswXS5sYXN0SW5kZXhPZihcIntcIik7XG5cdGxldCBkZXB0aCA9IDA7XG5cdGZvciAobGV0IGkgPSBvcGVuOyBpIDwgY3NzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3QgY2ggPSBjc3NbaV07XG5cdFx0aWYgKGNoID09PSBcIntcIikgZGVwdGgrKztcblx0XHRlbHNlIGlmIChjaCA9PT0gXCJ9XCIpIHtcblx0XHRcdGRlcHRoLS07XG5cdFx0XHRpZiAoZGVwdGggPT09IDApIHtcblx0XHRcdFx0aWYgKGNzcy5zbGljZShpICsgMSkudHJpbSgpKSByZXR1cm4gbnVsbDtcblx0XHRcdFx0cmV0dXJuIGNzcy5zbGljZShvcGVuICsgMSwgaSkudHJpbSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gbnVsbDtcbn07XG52YXIgdW53cmFwQ3NzTGF5ZXIgPSAoY3NzVGV4dCwgbGF5ZXJOYW1lKSA9PiB7XG5cdGNvbnN0IHN0cmlwcGVkID0gc3RyaXBDc3NQcmVhbWJsZShjc3NUZXh0KTtcblx0cmV0dXJuIHVud3JhcE91dGVyTGF5ZXJCbG9jayhzdHJpcHBlZCwgbGF5ZXJOYW1lKSA/PyBzdHJpcHBlZDtcbn07XG52YXIgY3NzSW1wb3J0V2l0aExheWVyID0gKHVybCwgbGF5ZXIgPSBcIlwiKSA9PiBgQGltcG9ydCB1cmwoXCIke3VybH1cIikgJHtsYXllciAmJiB0eXBlb2YgbGF5ZXIgPT09IFwic3RyaW5nXCIgPyBgbGF5ZXIoJHtsYXllcn0pYCA6IFwiXCJ9O2A7XG52YXIgVVhfUFJFTE9BRF9IT1NUX0NTUyA9IGNzc0xheWVyQmxvY2soXCJ1eC1wcmVsb2FkXCIsIFwiOmhvc3QgeyBib3gtc2l6aW5nOiBib3JkZXItYm94OyB9XCIpO1xudmFyIGdldE9yQ3JlYXRlTGF5ZXJSdWxlID0gKHNoZWV0LCBsYXllck5hbWUpID0+IHtcblx0aWYgKCFzaGVldCB8fCAhbGF5ZXJOYW1lKSByZXR1cm4gdm9pZCAwO1xuXHRjb25zdCBydWxlcyA9IEFycmF5LmZyb20oc2hlZXQuY3NzUnVsZXMgfHwgW10pO1xuXHRjb25zdCBleGlzdGluZyA9IHJ1bGVzLmZpbmQoKHJ1bGUpID0+IGlzTGF5ZXJCbG9ja1J1bGUocnVsZSkgJiYgcnVsZS5uYW1lID09PSBsYXllck5hbWUpO1xuXHRpZiAoZXhpc3RpbmcpIHJldHVybiBleGlzdGluZztcblx0dHJ5IHtcblx0XHRjb25zdCBydWxlSW5kZXggPSBzaGVldC5pbnNlcnRSdWxlKGNzc0VtcHR5TGF5ZXJSdWxlKGxheWVyTmFtZSksIHJ1bGVzLmxlbmd0aCk7XG5cdFx0Y29uc3QgY3JlYXRlZCA9IHNoZWV0LmNzc1J1bGVzPy5bcnVsZUluZGV4XTtcblx0XHRyZXR1cm4gaXNMYXllckJsb2NrUnVsZShjcmVhdGVkKSA/IGNyZWF0ZWQgOiB2b2lkIDA7XG5cdH0gY2F0Y2gge1xuXHRcdHJldHVybjtcblx0fVxufTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3Byb3BlcnR5LnRzXG52YXIgdG9rZW5pemVOdW1lcmljQ1NTJDEgPSAoc291cmNlKSA9PiB7XG5cdGNvbnN0IHRva2VucyA9IFtdO1xuXHRsZXQgY3Vyc29yID0gMDtcblx0d2hpbGUgKGN1cnNvciA8IHNvdXJjZS5sZW5ndGgpIHtcblx0XHRjb25zdCByZXN0ID0gc291cmNlLnNsaWNlKGN1cnNvcik7XG5cdFx0Y29uc3Qgd2hpdGVzcGFjZSA9IC9eXFxzKy8uZXhlYyhyZXN0KTtcblx0XHRpZiAod2hpdGVzcGFjZSkge1xuXHRcdFx0Y3Vyc29yICs9IHdoaXRlc3BhY2VbMF0ubGVuZ3RoO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGNvbnN0IG51bWJlciA9IC9eKD86XFxkKlxcLlxcZCt8XFxkK1xcLj9cXGQqKSg/OltlRV1bKy1dP1xcZCspPy8uZXhlYyhyZXN0KTtcblx0XHRpZiAobnVtYmVyKSB7XG5cdFx0XHRjdXJzb3IgKz0gbnVtYmVyWzBdLmxlbmd0aDtcblx0XHRcdGNvbnN0IHVuaXRNYXRjaCA9IENTU19VTklUX1RPS0VOX1JFLmV4ZWMoc291cmNlLnNsaWNlKGN1cnNvcikpO1xuXHRcdFx0Y29uc3QgdW5pdCA9IHVuaXRNYXRjaD8uWzBdID8/IG51bGw7XG5cdFx0XHRpZiAodW5pdE1hdGNoKSBjdXJzb3IgKz0gdW5pdE1hdGNoWzBdLmxlbmd0aDtcblx0XHRcdHRva2Vucy5wdXNoKHtcblx0XHRcdFx0a2luZDogXCJudW1iZXJcIixcblx0XHRcdFx0dmFsdWU6IE51bWJlcihudW1iZXJbMF0pLFxuXHRcdFx0XHR1bml0OiB1bml0ID09IG51bGwgPyBudWxsIDogdW5pdC50b0xvd2VyQ2FzZSgpXG5cdFx0XHR9KTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRjb25zdCBpZGVudGlmaWVyID0gL15bYS16QS1aX11bYS16QS1aMC05Xy1dKi8uZXhlYyhyZXN0KTtcblx0XHRpZiAoaWRlbnRpZmllcikge1xuXHRcdFx0dG9rZW5zLnB1c2goe1xuXHRcdFx0XHRraW5kOiBcImlkZW50aWZpZXJcIixcblx0XHRcdFx0dmFsdWU6IGlkZW50aWZpZXJbMF0udG9Mb3dlckNhc2UoKVxuXHRcdFx0fSk7XG5cdFx0XHRjdXJzb3IgKz0gaWRlbnRpZmllclswXS5sZW5ndGg7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0Y29uc3Qgc3ltYm9sID0gcmVzdFswXTtcblx0XHRpZiAoW1xuXHRcdFx0XCIrXCIsXG5cdFx0XHRcIi1cIixcblx0XHRcdFwiKlwiLFxuXHRcdFx0XCIvXCIsXG5cdFx0XHRcIihcIixcblx0XHRcdFwiKVwiLFxuXHRcdFx0XCIsXCJcblx0XHRdLmluY2x1ZGVzKHN5bWJvbCkpIHtcblx0XHRcdHRva2Vucy5wdXNoKHtcblx0XHRcdFx0a2luZDogXCJzeW1ib2xcIixcblx0XHRcdFx0dmFsdWU6IHN5bWJvbFxuXHRcdFx0fSk7XG5cdFx0XHRjdXJzb3IrKztcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoYFVuc3VwcG9ydGVkIHRva2VuIG5lYXIgXCIke3Jlc3R9XCJgKTtcblx0fVxuXHRyZXR1cm4gdG9rZW5zO1xufTtcbnZhciBOdW1lcmljVHlwZWRPTVBhcnNlciQxID0gY2xhc3Mge1xuXHR0b2tlbnM7XG5cdHdpbjtcblx0aW5kZXggPSAwO1xuXHRjb25zdHJ1Y3Rvcih0b2tlbnMsIHdpbikge1xuXHRcdHRoaXMudG9rZW5zID0gdG9rZW5zO1xuXHRcdHRoaXMud2luID0gd2luO1xuXHR9XG5cdHBhcnNlKCkge1xuXHRcdGNvbnN0IHJvb3QgPSB0aGlzLnBhcnNlU3VtKCk7XG5cdFx0aWYgKHRoaXMuaW5kZXggIT09IHRoaXMudG9rZW5zLmxlbmd0aCkgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiVW5leHBlY3RlZCB0cmFpbGluZyBleHByZXNzaW9uXCIpO1xuXHRcdHJldHVybiByb290O1xuXHR9XG5cdGN1cnJlbnQoKSB7XG5cdFx0cmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuaW5kZXhdO1xuXHR9XG5cdGNvbnN1bWUoKSB7XG5cdFx0Y29uc3QgdG9rZW4gPSB0aGlzLnRva2Vuc1t0aGlzLmluZGV4XTtcblx0XHRpZiAoIXRva2VuKSB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJVbmV4cGVjdGVkIGVuZCBvZiBleHByZXNzaW9uXCIpO1xuXHRcdHRoaXMuaW5kZXgrKztcblx0XHRyZXR1cm4gdG9rZW47XG5cdH1cblx0Y29uc3VtZVN5bWJvbChzeW1ib2wpIHtcblx0XHRjb25zdCB0b2tlbiA9IHRoaXMuY29uc3VtZSgpO1xuXHRcdGlmICh0b2tlbi5raW5kICE9PSBcInN5bWJvbFwiIHx8IHRva2VuLnZhbHVlICE9PSBzeW1ib2wpIHRocm93IG5ldyBTeW50YXhFcnJvcihgRXhwZWN0ZWQgXCIke3N5bWJvbH1cImApO1xuXHR9XG5cdG1hdGNoZXNTeW1ib2woc3ltYm9sKSB7XG5cdFx0Y29uc3QgdG9rZW4gPSB0aGlzLmN1cnJlbnQoKTtcblx0XHRyZXR1cm4gdG9rZW4/LmtpbmQgPT09IFwic3ltYm9sXCIgJiYgdG9rZW4udmFsdWUgPT09IHN5bWJvbDtcblx0fVxuXHRjcmVhdGVNYXRoKG5hbWUsIC4uLnZhbHVlcykge1xuXHRcdGNvbnN0IENvbnN0cnVjdG9yID0gZ2V0V2luZG93Q29uc3RydWN0b3IodGhpcy53aW4sIG5hbWUpO1xuXHRcdGlmICh0eXBlb2YgQ29uc3RydWN0b3IgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHtuYW1lfSBpcyBub3Qgc3VwcG9ydGVkYCk7XG5cdFx0cmV0dXJuIG5ldyBDb25zdHJ1Y3RvciguLi52YWx1ZXMpO1xuXHR9XG5cdHBhcnNlU3VtKCkge1xuXHRcdGxldCB2YWx1ZSA9IHRoaXMucGFyc2VQcm9kdWN0KCk7XG5cdFx0d2hpbGUgKHRoaXMubWF0Y2hlc1N5bWJvbChcIitcIikgfHwgdGhpcy5tYXRjaGVzU3ltYm9sKFwiLVwiKSkge1xuXHRcdFx0Y29uc3Qgb3BlcmF0b3IgPSB0aGlzLmNvbnN1bWUoKTtcblx0XHRcdGNvbnN0IHJpZ2h0ID0gdGhpcy5wYXJzZVByb2R1Y3QoKTtcblx0XHRcdGlmIChvcGVyYXRvci5raW5kICE9PSBcInN5bWJvbFwiKSB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJFeHBlY3RlZCBzdW0gb3BlcmF0b3JcIik7XG5cdFx0XHRpZiAob3BlcmF0b3IudmFsdWUgPT09IFwiK1wiKSB2YWx1ZSA9IHRoaXMuY3JlYXRlTWF0aChcIkNTU01hdGhTdW1cIiwgdmFsdWUsIHJpZ2h0KTtcblx0XHRcdGVsc2UgdmFsdWUgPSB0aGlzLmNyZWF0ZU1hdGgoXCJDU1NNYXRoU3VtXCIsIHZhbHVlLCB0aGlzLmNyZWF0ZU1hdGgoXCJDU1NNYXRoTmVnYXRlXCIsIHJpZ2h0KSk7XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXHRwYXJzZVByb2R1Y3QoKSB7XG5cdFx0bGV0IHZhbHVlID0gdGhpcy5wYXJzZVVuYXJ5KCk7XG5cdFx0d2hpbGUgKHRoaXMubWF0Y2hlc1N5bWJvbChcIipcIikgfHwgdGhpcy5tYXRjaGVzU3ltYm9sKFwiL1wiKSkge1xuXHRcdFx0Y29uc3Qgb3BlcmF0b3IgPSB0aGlzLmNvbnN1bWUoKTtcblx0XHRcdGNvbnN0IHJpZ2h0ID0gdGhpcy5wYXJzZVVuYXJ5KCk7XG5cdFx0XHRpZiAob3BlcmF0b3Iua2luZCAhPT0gXCJzeW1ib2xcIikgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiRXhwZWN0ZWQgcHJvZHVjdCBvcGVyYXRvclwiKTtcblx0XHRcdGlmIChvcGVyYXRvci52YWx1ZSA9PT0gXCIqXCIpIHZhbHVlID0gdGhpcy5jcmVhdGVNYXRoKFwiQ1NTTWF0aFByb2R1Y3RcIiwgdmFsdWUsIHJpZ2h0KTtcblx0XHRcdGVsc2UgdmFsdWUgPSB0aGlzLmNyZWF0ZU1hdGgoXCJDU1NNYXRoUHJvZHVjdFwiLCB2YWx1ZSwgdGhpcy5jcmVhdGVNYXRoKFwiQ1NTTWF0aEludmVydFwiLCByaWdodCkpO1xuXHRcdH1cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH1cblx0cGFyc2VVbmFyeSgpIHtcblx0XHRpZiAodGhpcy5tYXRjaGVzU3ltYm9sKFwiK1wiKSkge1xuXHRcdFx0dGhpcy5jb25zdW1lKCk7XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZVVuYXJ5KCk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLm1hdGNoZXNTeW1ib2woXCItXCIpKSB7XG5cdFx0XHR0aGlzLmNvbnN1bWUoKTtcblx0XHRcdHJldHVybiB0aGlzLmNyZWF0ZU1hdGgoXCJDU1NNYXRoTmVnYXRlXCIsIHRoaXMucGFyc2VVbmFyeSgpKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMucGFyc2VQcmltYXJ5KCk7XG5cdH1cblx0cGFyc2VQcmltYXJ5KCkge1xuXHRcdGNvbnN0IHRva2VuID0gdGhpcy5jb25zdW1lKCk7XG5cdFx0aWYgKHRva2VuLmtpbmQgPT09IFwibnVtYmVyXCIpIHJldHVybiBjcmVhdGVUeXBlZFVuaXRWYWx1ZSh0aGlzLndpbiwgdG9rZW4udW5pdCA/PyBcIm51bWJlclwiLCB0b2tlbi52YWx1ZSk7XG5cdFx0aWYgKHRva2VuLmtpbmQgPT09IFwic3ltYm9sXCIgJiYgdG9rZW4udmFsdWUgPT09IFwiKFwiKSB7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VTdW0oKTtcblx0XHRcdHRoaXMuY29uc3VtZVN5bWJvbChcIilcIik7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fVxuXHRcdGlmICh0b2tlbi5raW5kID09PSBcImlkZW50aWZpZXJcIikgcmV0dXJuIHRoaXMucGFyc2VGdW5jdGlvbih0b2tlbi52YWx1ZSk7XG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwiRXhwZWN0ZWQgYSBudW1lcmljIHZhbHVlXCIpO1xuXHR9XG5cdHBhcnNlRnVuY3Rpb24obmFtZSkge1xuXHRcdHRoaXMuY29uc3VtZVN5bWJvbChcIihcIik7XG5cdFx0aWYgKG5hbWUgPT09IFwiY2FsY1wiKSB7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VTdW0oKTtcblx0XHRcdHRoaXMuY29uc3VtZVN5bWJvbChcIilcIik7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fVxuXHRcdGNvbnN0IHZhbHVlcyA9IFtdO1xuXHRcdGlmICghdGhpcy5tYXRjaGVzU3ltYm9sKFwiKVwiKSkge1xuXHRcdFx0dmFsdWVzLnB1c2godGhpcy5wYXJzZVN1bSgpKTtcblx0XHRcdHdoaWxlICh0aGlzLm1hdGNoZXNTeW1ib2woXCIsXCIpKSB7XG5cdFx0XHRcdHRoaXMuY29uc3VtZSgpO1xuXHRcdFx0XHR2YWx1ZXMucHVzaCh0aGlzLnBhcnNlU3VtKCkpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLmNvbnN1bWVTeW1ib2woXCIpXCIpO1xuXHRcdGlmIChuYW1lID09PSBcIm1pblwiKSB7XG5cdFx0XHRpZiAodmFsdWVzLmxlbmd0aCA9PT0gMCkgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwibWluKCkgcmVxdWlyZXMgYSB2YWx1ZVwiKTtcblx0XHRcdHJldHVybiB0aGlzLmNyZWF0ZU1hdGgoXCJDU1NNYXRoTWluXCIsIC4uLnZhbHVlcyk7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09PSBcIm1heFwiKSB7XG5cdFx0XHRpZiAodmFsdWVzLmxlbmd0aCA9PT0gMCkgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwibWF4KCkgcmVxdWlyZXMgYSB2YWx1ZVwiKTtcblx0XHRcdHJldHVybiB0aGlzLmNyZWF0ZU1hdGgoXCJDU1NNYXRoTWF4XCIsIC4uLnZhbHVlcyk7XG5cdFx0fVxuXHRcdGlmIChuYW1lID09PSBcImNsYW1wXCIpIHtcblx0XHRcdGlmICh2YWx1ZXMubGVuZ3RoICE9PSAzKSB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJjbGFtcCgpIHJlcXVpcmVzIHRocmVlIHZhbHVlc1wiKTtcblx0XHRcdHJldHVybiB0aGlzLmNyZWF0ZU1hdGgoXCJDU1NNYXRoQ2xhbXBcIiwgdmFsdWVzWzBdLCB2YWx1ZXNbMV0sIHZhbHVlc1syXSk7XG5cdFx0fVxuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihgVW5zdXBwb3J0ZWQgZnVuY3Rpb24gXCIke25hbWV9XCJgKTtcblx0fVxufTtcbnZhciBwYXJzZVRvVHlwZWRPTSA9IChjc3NWYWx1ZSwgd2luKSA9PiB7XG5cdHRyeSB7XG5cdFx0Y29uc3QgdG9rZW5zID0gdG9rZW5pemVOdW1lcmljQ1NTJDEoY3NzVmFsdWUpO1xuXHRcdHJldHVybiBuZXcgTnVtZXJpY1R5cGVkT01QYXJzZXIkMSh0b2tlbnMsIHdpbikucGFyc2UoKTtcblx0fSBjYXRjaCB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn07XG52YXIgc2V0UHJvcGVydHlJZk5vdEVxdWFsID0gKHN0eWxlUmVmLCBrZWJhYiwgdmFsdWUsIGltcG9ydGFuY2UgPSBcIlwiKSA9PiB7XG5cdGlmICghc3R5bGVSZWYgfHwgIWtlYmFiKSByZXR1cm47XG5cdGlmICh2YWx1ZSA9PSBudWxsKSB7XG5cdFx0aWYgKHN0eWxlUmVmLmdldFByb3BlcnR5VmFsdWUoa2ViYWIpICE9PSBcIlwiKSBzdHlsZVJlZi5yZW1vdmVQcm9wZXJ0eShrZWJhYik7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGlmIChzdHlsZVJlZi5nZXRQcm9wZXJ0eVZhbHVlKGtlYmFiKSAhPT0gdmFsdWUpIHN0eWxlUmVmLnNldFByb3BlcnR5KGtlYmFiLCB2YWx1ZSwgaW1wb3J0YW5jZSk7XG59O1xudmFyIHNldFN0eWxlUHJvcGVydHlUeXBlZCA9IChlbGVtZW50LCBuYW1lLCB2YWx1ZSwgaW1wb3J0YW5jZSA9IFwiXCIpID0+IHtcblx0aWYgKCFlbGVtZW50IHx8ICFuYW1lKSByZXR1cm4gZWxlbWVudDtcblx0Y29uc3Qga2ViYWIgPSBjYW1lbFRvS2ViYWIobmFtZSk7XG5cdGNvbnN0IHN0eWxlUmVmID0gZWxlbWVudC5zdHlsZTtcblx0Y29uc3Qgc3R5bGVNYXBSZWYgPSBlbGVtZW50LmF0dHJpYnV0ZVN0eWxlTWFwID8/IGVsZW1lbnQuc3R5bGVNYXA7XG5cdGlmICghaGFzVHlwZWRPTSB8fCAhc3R5bGVNYXBSZWYpIHJldHVybiBzZXRTdHlsZVByb3BlcnR5RmFsbGJhY2soZWxlbWVudCwgbmFtZSwgdmFsdWUsIGltcG9ydGFuY2UpO1xuXHRjb25zdCB3aW4gPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQ/LmRlZmF1bHRWaWV3ID8/IGdsb2JhbFRoaXM7XG5cdGxldCB2YWwgPSBoYXNWYWx1ZSh2YWx1ZSkgJiYgaXNSZWFjdGl2ZVN0eWxlVmFsdWUodmFsdWUpID8gdmFsdWUudmFsdWUgOiB2YWx1ZTtcblx0aWYgKHZhbCA9PSBudWxsKSB7XG5cdFx0c3R5bGVNYXBSZWYuZGVsZXRlPy4oa2ViYWIpO1xuXHRcdGlmIChzdHlsZVJlZikgc2V0UHJvcGVydHlJZk5vdEVxdWFsKHN0eWxlUmVmLCBrZWJhYiwgbnVsbCwgaW1wb3J0YW5jZSk7XG5cdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdH1cblx0aWYgKGlzTmF0aXZlQ1NTU3R5bGVWYWx1ZSh2YWwpKSB7XG5cdFx0Y29uc3Qgb2xkID0gc3R5bGVNYXBSZWYuZ2V0KGtlYmFiKTtcblx0XHRpZiAoaXNVbml0VmFsdWUodmFsKSAmJiBpc1VuaXRWYWx1ZShvbGQpKSB7XG5cdFx0XHRpZiAob2xkLnZhbHVlID09PSB2YWwudmFsdWUgJiYgb2xkLnVuaXQgPT09IHZhbC51bml0KSByZXR1cm4gZWxlbWVudDtcblx0XHR9IGVsc2UgaWYgKG9sZCA9PT0gdmFsKSByZXR1cm4gZWxlbWVudDtcblx0XHRzdHlsZU1hcFJlZi5zZXQoa2ViYWIsIHZhbCk7XG5cdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdH1cblx0aWYgKHR5cGVvZiB2YWwgPT09IFwibnVtYmVyXCIpIHtcblx0XHRpZiAoQ1NTPy5udW1iZXIgJiYgIWtlYmFiLnN0YXJ0c1dpdGgoXCItLVwiKSkge1xuXHRcdFx0Y29uc3QgbmV3VmFsID0gQ1NTLm51bWJlcih2YWwpO1xuXHRcdFx0Y29uc3Qgb2xkID0gc3R5bGVNYXBSZWYuZ2V0KGtlYmFiKTtcblx0XHRcdGlmIChpc1VuaXRWYWx1ZShvbGQpICYmIG9sZC52YWx1ZSA9PT0gbmV3VmFsLnZhbHVlICYmIG9sZC51bml0ID09PSBuZXdWYWwudW5pdCkgcmV0dXJuIGVsZW1lbnQ7XG5cdFx0XHRzdHlsZU1hcFJlZi5zZXQoa2ViYWIsIG5ld1ZhbCk7XG5cdFx0XHRyZXR1cm4gZWxlbWVudDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2V0UHJvcGVydHlJZk5vdEVxdWFsKHN0eWxlUmVmLCBrZWJhYiwgU3RyaW5nKHZhbCksIGltcG9ydGFuY2UpO1xuXHRcdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdFx0fVxuXHR9XG5cdGlmICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiKSB7XG5cdFx0aWYgKC9cXGIoY2FsY3xtaW58bWF4fGNsYW1wKVxccypcXCgvLnRlc3QodmFsKSkge1xuXHRcdFx0Y29uc3QgcGFyc2VkID0gcGFyc2VUb1R5cGVkT00odmFsLCB3aW4pO1xuXHRcdFx0aWYgKHBhcnNlZCkgdHJ5IHtcblx0XHRcdFx0c3R5bGVNYXBSZWYuc2V0KGtlYmFiLCBwYXJzZWQpO1xuXHRcdFx0XHRyZXR1cm4gZWxlbWVudDtcblx0XHRcdH0gY2F0Y2gge31cblx0XHR9XG5cdFx0Y29uc3QgbWF5YmVOdW0gPSB0cnlTdHJpbmdBc051bWJlcih2YWwpO1xuXHRcdGlmICh0eXBlb2YgbWF5YmVOdW0gPT09IFwibnVtYmVyXCIgJiYgQ1NTPy5udW1iZXIgJiYgIWtlYmFiLnN0YXJ0c1dpdGgoXCItLVwiKSkge1xuXHRcdFx0Y29uc3QgbmV3VmFsID0gQ1NTLm51bWJlcihtYXliZU51bSk7XG5cdFx0XHRjb25zdCBvbGQgPSBzdHlsZU1hcFJlZi5nZXQoa2ViYWIpO1xuXHRcdFx0aWYgKGlzVW5pdFZhbHVlKG9sZCkgJiYgb2xkLnZhbHVlID09PSBuZXdWYWwudmFsdWUgJiYgb2xkLnVuaXQgPT09IG5ld1ZhbC51bml0KSByZXR1cm4gZWxlbWVudDtcblx0XHRcdHN0eWxlTWFwUmVmLnNldChrZWJhYiwgbmV3VmFsKTtcblx0XHRcdHJldHVybiBlbGVtZW50O1xuXHRcdH1cblx0XHRzZXRQcm9wZXJ0eUlmTm90RXF1YWwoc3R5bGVSZWYsIGtlYmFiLCB2YWwsIGltcG9ydGFuY2UpO1xuXHRcdHJldHVybiBlbGVtZW50O1xuXHR9XG5cdHNldFByb3BlcnR5SWZOb3RFcXVhbChzdHlsZVJlZiwga2ViYWIsIFN0cmluZyh2YWwpLCBpbXBvcnRhbmNlKTtcblx0cmV0dXJuIGVsZW1lbnQ7XG59O1xudmFyIHNldFN0eWxlUHJvcGVydHlGYWxsYmFjayA9IChlbGVtZW50LCBuYW1lLCB2YWx1ZSwgaW1wb3J0YW5jZSA9IFwiXCIpID0+IHtcblx0aWYgKCFlbGVtZW50IHx8ICFuYW1lKSByZXR1cm4gZWxlbWVudDtcblx0Y29uc3Qga2ViYWIgPSBjYW1lbFRvS2ViYWIobmFtZSk7XG5cdGNvbnN0IHN0eWxlUmVmID0gZWxlbWVudC5zdHlsZTtcblx0aWYgKCFzdHlsZVJlZikgcmV0dXJuIGVsZW1lbnQ7XG5cdGxldCB2YWwgPSBoYXNWYWx1ZSh2YWx1ZSkgJiYgaXNSZWFjdGl2ZVN0eWxlVmFsdWUodmFsdWUpID8gdmFsdWUudmFsdWUgOiB2YWx1ZTtcblx0aWYgKHR5cGVvZiB2YWwgPT09IFwic3RyaW5nXCIgJiYgIWlzTmF0aXZlQ1NTU3R5bGVWYWx1ZSh2YWwpKSB2YWwgPSB0cnlTdHJpbmdBc051bWJlcih2YWwpID8/IHZhbDtcblx0aWYgKHZhbCA9PSBudWxsKSB7XG5cdFx0c2V0UHJvcGVydHlJZk5vdEVxdWFsKHN0eWxlUmVmLCBrZWJhYiwgbnVsbCwgaW1wb3J0YW5jZSk7XG5cdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdH1cblx0aWYgKGlzTmF0aXZlQ1NTU3R5bGVWYWx1ZSh2YWwpKSB7XG5cdFx0c2V0UHJvcGVydHlJZk5vdEVxdWFsKHN0eWxlUmVmLCBrZWJhYiwgU3RyaW5nKHZhbCksIGltcG9ydGFuY2UpO1xuXHRcdHJldHVybiBlbGVtZW50O1xuXHR9XG5cdGlmICh0eXBlb2YgdmFsID09PSBcIm51bWJlclwiKSB7XG5cdFx0c2V0UHJvcGVydHlJZk5vdEVxdWFsKHN0eWxlUmVmLCBrZWJhYiwgU3RyaW5nKHZhbCksIGltcG9ydGFuY2UpO1xuXHRcdHJldHVybiBlbGVtZW50O1xuXHR9XG5cdHNldFByb3BlcnR5SWZOb3RFcXVhbChzdHlsZVJlZiwga2ViYWIsIFN0cmluZyh2YWwpLCBpbXBvcnRhbmNlKTtcblx0cmV0dXJuIGVsZW1lbnQ7XG59O1xudmFyIHNldFN0eWxlUHJvcGVydHkgPSAoZWxlbWVudCwgbmFtZSwgdmFsdWUsIGltcG9ydGFuY2UgPSBcIlwiKSA9PiB7XG5cdHJldHVybiBoYXNUeXBlZE9NID8gc2V0U3R5bGVQcm9wZXJ0eVR5cGVkKGVsZW1lbnQsIG5hbWUsIHZhbHVlLCBpbXBvcnRhbmNlKSA6IHNldFN0eWxlUHJvcGVydHlGYWxsYmFjayhlbGVtZW50LCBuYW1lLCB2YWx1ZSwgaW1wb3J0YW5jZSk7XG59O1xudmFyIGhhbmRsZVN0eWxlQ2hhbmdlID0gKGVsLCBwcm9wLCB2YWwpID0+IHtcblx0Y29uc3Qgc3R5bGVSZWYgPSBlbD8uc3R5bGU7XG5cdGlmICghcHJvcCB8fCB0eXBlb2YgcHJvcCAhPT0gXCJzdHJpbmdcIiB8fCAhZWwgfHwgIXN0eWxlUmVmKSByZXR1cm4gZWw7XG5cdCRhdm9pZFRyaWdnZXIodmFsLCAoKSA9PiB7XG5cdFx0aWYgKGlzVmFsKHZhbCkgfHwgaGFzVmFsdWUodmFsKSB8fCBpc1ZhbHVlVW5pdCh2YWwpKSBzZXRTdHlsZVByb3BlcnR5KGVsLCBwcm9wLCB2YWwpO1xuXHRcdGVsc2UgaWYgKHZhbCA9PSBudWxsKSBlbC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShjYW1lbFRvS2ViYWIocHJvcCkpO1xuXHR9KTtcblx0cmV0dXJuIGVsO1xufTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3NoZWV0cy50c1xudmFyIHNldFN0eWxlSW5SdWxlID0gKHNlbGVjdG9yLCBuYW1lLCB2YWx1ZSkgPT4ge1xuXHRyZXR1cm4gc2V0U3R5bGVQcm9wZXJ0eShnZXRTdHlsZVJ1bGUoc2VsZWN0b3IpLCBuYW1lLCB2YWx1ZSk7XG59O1xudmFyIHNldFN0eWxlUnVsZSA9IChzZWxlY3Rvciwgc2hlZXQpID0+IHtcblx0Y29uc3QgcnVsZSA9IGdldFN0eWxlUnVsZShzZWxlY3Rvcik7XG5cdE9iamVjdC5lbnRyaWVzKHNoZWV0KS5mb3JFYWNoKChbcHJvcE5hbWUsIHByb3BWYWx1ZV0pID0+IHNldFN0eWxlUHJvcGVydHkocnVsZSwgcHJvcE5hbWUsIHByb3BWYWx1ZSkpO1xuXHRyZXR1cm4gcnVsZTtcbn07XG52YXIgbG9hZFN0eWxlU2hlZXQgPSAoaW5saW5lLCBiYXNlLCBsYXllciA9IFwiXCIsIGludGVncml0eSkgPT4ge1xuXHRjb25zdCBsb2FkID0gZmV0Y2hBbmRDYWNoZShpbmxpbmUpO1xuXHRjb25zdCB1cmwgPSB0eXBlb2YgaW5saW5lID09IFwic3RyaW5nXCIgPyBVUkwuY2FuUGFyc2UoaW5saW5lKSA/IGlubGluZSA6IGxvYWQgOiBsb2FkO1xuXHRpZiAoYmFzZT8uWzBdKSBiYXNlWzBdLmZldGNoUHJpb3JpdHkgPSBcImhpZ2hcIjtcblx0aWYgKGJhc2UgJiYgdXJsICYmIHR5cGVvZiB1cmwgPT0gXCJzdHJpbmdcIikgc2V0U3R5bGVVUkwoYmFzZSwgdXJsLCBsYXllcik7XG5cdGlmIChiYXNlPy5bMF0gJiYgKCFVUkwuY2FuUGFyc2UoaW5saW5lKSB8fCBpbnRlZ3JpdHkpICYmIGJhc2U/LlswXSBpbnN0YW5jZW9mIEhUTUxMaW5rRWxlbWVudCkge31cblx0cmV0dXJuIHByb21pc2VPckRpcmVjdChsb2FkLCAocmVzKSA9PiB7XG5cdFx0aWYgKGJhc2U/LlswXSAmJiByZXMpIHtcblx0XHRcdHNldFN0eWxlVVJMKGJhc2UsIHJlcywgbGF5ZXIpO1xuXHRcdFx0YmFzZT8uWzBdLnNldEF0dHJpYnV0ZShcImxvYWRlZFwiLCBcIlwiKTtcblx0XHR9XG5cdH0pPy5jYXRjaD8uKChlcnJvcikgPT4ge1xuXHRcdGNvbnNvbGUud2FybihcIkZhaWxlZCB0byBsb2FkIHN0eWxlIHNoZWV0OlwiLCBlcnJvcik7XG5cdH0pO1xufTtcbnZhciBsb2FkQmxvYlN0eWxlID0gKGlubGluZSkgPT4ge1xuXHRjb25zdCBzdHlsZSA9IHR5cGVvZiBkb2N1bWVudCAhPSBcInVuZGVmaW5lZFwiID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIikgOiBudWxsO1xuXHRpZiAoc3R5bGUpIHN0eWxlLmZldGNoUHJpb3JpdHkgPSBcImhpZ2hcIjtcblx0aWYgKHN0eWxlKSB7XG5cdFx0T2JqZWN0LmFzc2lnbihzdHlsZSwge1xuXHRcdFx0cmVsOiBcInN0eWxlc2hlZXRcIixcblx0XHRcdHR5cGU6IFwidGV4dC9jc3NcIixcblx0XHRcdGNyb3NzT3JpZ2luOiBcInNhbWUtb3JpZ2luXCJcblx0XHR9KTtcblx0XHRzdHlsZS5kYXRhc2V0Lm93bmVyID0gXCJET01cIjtcblx0XHRsb2FkU3R5bGVTaGVldChpbmxpbmUsIFtzdHlsZSwgXCJocmVmXCJdKTtcblx0XHR0eXBlb2YgZG9jdW1lbnQgIT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudC5oZWFkLmFwcGVuZChzdHlsZSk7XG5cdFx0cmV0dXJuIHN0eWxlO1xuXHR9XG5cdHJldHVybiBudWxsO1xufTtcbnZhciBsb2FkSW5saW5lU3R5bGUgPSAoaW5saW5lLCByb290RWxlbWVudCA9IHR5cGVvZiBkb2N1bWVudCAhPSBcInVuZGVmaW5lZFwiID8gZG9jdW1lbnQ/LmhlYWQgOiBudWxsLCBsYXllciA9IFwiXCIpID0+IHtcblx0Y29uc3QgUExBQ0UgPSByb290RWxlbWVudD8ucXVlcnlTZWxlY3Rvcj8uKFwiaGVhZFwiKSA/PyByb290RWxlbWVudDtcblx0aWYgKHR5cGVvZiBIVE1MSGVhZEVsZW1lbnQgIT0gXCJ1bmRlZmluZWRcIiAmJiBQTEFDRSBpbnN0YW5jZW9mIEhUTUxIZWFkRWxlbWVudCkgcmV0dXJuIGxvYWRCbG9iU3R5bGUoaW5saW5lKTtcblx0Y29uc3Qgc3R5bGUgPSB0eXBlb2YgZG9jdW1lbnQgIT0gXCJ1bmRlZmluZWRcIiA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKSA6IG51bGw7XG5cdGlmIChzdHlsZSkge1xuXHRcdHN0eWxlLmRhdGFzZXQub3duZXIgPSBcIkRPTVwiO1xuXHRcdGxvYWRTdHlsZVNoZWV0KGlubGluZSwgW3N0eWxlLCBcImlubmVySFRNTFwiXSwgbGF5ZXIpO1xuXHRcdFBMQUNFPy5wcmVwZW5kPy4oc3R5bGUpO1xuXHRcdHJldHVybiBzdHlsZTtcblx0fVxuXHRyZXR1cm4gbnVsbDtcbn07XG52YXIgc2V0UHJvcGVydHkgPSAodGFyZ2V0LCBuYW1lLCB2YWx1ZSwgaW1wb3J0YW5jZSA9IFwiXCIpID0+IHtcblx0cmV0dXJuIHNldFN0eWxlUHJvcGVydHkodGFyZ2V0LCBuYW1lLCB2YWx1ZSwgaW1wb3J0YW5jZSk7XG59O1xudmFyIHByZWxvYWRTdHlsZSA9IChzdHlsZXMpID0+IHtcblx0cmV0dXJuIGxvYWRBc0Fkb3B0ZWQoc3R5bGVzLCBcIlwiKTtcbn07XG52YXIgcmVtZW1iZXJBZG9wdGVkVGV4dCA9IChzaGVldCwgY3NzVGV4dCkgPT4ge1xuXHRhZG9wdGVkQXBwbGllZFRleHQuc2V0KHNoZWV0LCBjc3NUZXh0KTtcblx0YWRvcHRlZEZpbGxlZC5hZGQoc2hlZXQpO1xufTtcbnZhciBjc3NUZXh0Rm9yQWRvcHRlZFNoZWV0ID0gKHNoZWV0KSA9PiB7XG5cdGlmICghc2hlZXQpIHJldHVybiBudWxsO1xuXHRjb25zdCBzdG9yZWQgPSBhZG9wdGVkQXBwbGllZFRleHQuZ2V0KHNoZWV0KTtcblx0aWYgKHN0b3JlZCkgcmV0dXJuIHN0b3JlZDtcblx0Zm9yIChjb25zdCBba2V5LCBtYXBwZWRdIG9mIGFkb3B0ZWRNYXApIGlmIChtYXBwZWQgPT09IHNoZWV0ICYmIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIpIHJldHVybiBrZXk7XG5cdHJldHVybiBudWxsO1xufTtcbnZhciBlbnN1cmVBZG9wdGVkU2hlZXRDb250ZW50ID0gKHNoZWV0LCBjc3NUZXh0KSA9PiB7XG5cdGlmICghc2hlZXQpIHJldHVybiBmYWxzZTtcblx0Y29uc3QgdGV4dCA9IGNzc1RleHQgfHwgY3NzVGV4dEZvckFkb3B0ZWRTaGVldChzaGVldCk7XG5cdGNvbnN0IGNvdW50ID0gcmVhZFNoZWV0UnVsZUNvdW50KHNoZWV0KTtcblx0aWYgKGNvdW50ID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdGlmIChjb3VudCA+IDApIHtcblx0XHRhZG9wdGVkRmlsbGVkLmFkZChzaGVldCk7XG5cdFx0aWYgKHRleHQgJiYgIWFkb3B0ZWRBcHBsaWVkVGV4dC5oYXMoc2hlZXQpKSBhZG9wdGVkQXBwbGllZFRleHQuc2V0KHNoZWV0LCB0ZXh0KTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRpZiAoIXRleHQpIHJldHVybiBmYWxzZTtcblx0aWYgKGFwcGx5QWRvcHRlZFN0eWxlVGV4dChzaGVldCwgdGV4dCkpIHtcblx0XHRyZW1lbWJlckFkb3B0ZWRUZXh0KHNoZWV0LCB0ZXh0KTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59O1xudmFyIGFwcGx5QWRvcHRlZFN0eWxlVGV4dCA9IChzaGVldCwgY3NzVGV4dCkgPT4ge1xuXHRpZiAoIXNoZWV0IHx8ICFjc3NUZXh0KSByZXR1cm4gZmFsc2U7XG5cdHRyeSB7XG5cdFx0c2hlZXQucmVwbGFjZVN5bmMoY3NzVGV4dCk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc3QgbWVzc2FnZSA9IFN0cmluZyhlcnJvcj8ubWVzc2FnZSB8fCBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuXHRcdGlmICghKG1lc3NhZ2UuaW5jbHVkZXMoXCJAaW1wb3J0IHJ1bGVzIGFyZSBub3QgYWxsb3dlZFwiKSB8fCBtZXNzYWdlLmluY2x1ZGVzKFwiQGltcG9ydFwiKSAmJiBtZXNzYWdlLmluY2x1ZGVzKFwibm90IGFsbG93ZWRcIikpKSBjb25zb2xlLndhcm4oXCJbRE9NXSBGYWlsZWQgdG8gYXBwbHkgYWRvcHRlZCBzdHlsZXNoZWV0OlwiLCBlcnJvcik7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59O1xudmFyIHNoZWV0Rm9yQmxvYiA9IChibG9iKSA9PiB7XG5cdGxldCBzaGVldCA9IGFkb3B0ZWRCbG9iTWFwLmdldChibG9iKTtcblx0aWYgKCFzaGVldCkge1xuXHRcdHNoZWV0ID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcblx0XHRhZG9wdGVkQmxvYk1hcC5zZXQoYmxvYiwgc2hlZXQpO1xuXHR9XG5cdHJldHVybiBzaGVldDtcbn07XG52YXIgbG9hZEFzQWRvcHRlZCA9IChzdHlsZXMsIGxheWVyTmFtZSA9IG51bGwpID0+IHtcblx0dHJ5IHtcblx0XHRyZXR1cm4gbG9hZEFzQWRvcHRlZFVuc2FmZShzdHlsZXMsIGxheWVyTmFtZSk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS53YXJuKFwiW0RPTV0gbG9hZEFzQWRvcHRlZCBmYWlsZWRcIiwgZXJyb3IpO1xuXHRcdGlmICh0eXBlb2Ygc3R5bGVzID09PSBcInN0cmluZ1wiKSBsb2FkSW5saW5lU3R5bGUoc3R5bGVzLCB2b2lkIDAsIGxheWVyTmFtZSB8fCBcIlwiKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufTtcbnZhciBsb2FkQXNBZG9wdGVkVW5zYWZlID0gKHN0eWxlcywgbGF5ZXJOYW1lID0gbnVsbCkgPT4ge1xuXHRpZiAoIXN1cHBvcnRzQ29uc3RydWN0YWJsZVN0eWxlc2hlZXQoKSkge1xuXHRcdGlmICh0eXBlb2Ygc3R5bGVzID09PSBcInN0cmluZ1wiKSBsb2FkSW5saW5lU3R5bGUoc3R5bGVzLCB2b2lkIDAsIGxheWVyTmFtZSB8fCBcIlwiKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRpZiAodHlwZW9mIHN0eWxlcyA9PT0gXCJzdHJpbmdcIiAmJiBjc3NUZXh0UmVxdWlyZXNJbmxpbmVTdHlsZUVsZW1lbnQoc3R5bGVzKSkge1xuXHRcdGxvYWRJbmxpbmVTdHlsZShzdHlsZXMsIHZvaWQgMCwgbGF5ZXJOYW1lIHx8IFwiXCIpO1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGlmICh0eXBlb2Ygc3R5bGVzID09IFwic3RyaW5nXCIgJiYgYWRvcHRlZE1hcD8uaGFzPy4oc3R5bGVzKSkge1xuXHRcdGNvbnN0IGNhY2hlZCA9IGFkb3B0ZWRNYXAuZ2V0KHN0eWxlcyk7XG5cdFx0Y29uc3QgYXBwbGllZCA9IGFkb3B0ZWRBcHBsaWVkVGV4dC5nZXQoY2FjaGVkKSB8fCB3cmFwQ3NzTGF5ZXIoc3R5bGVzLCBsYXllck5hbWUpO1xuXHRcdGVuc3VyZUFkb3B0ZWRTaGVldENvbnRlbnQoY2FjaGVkLCBhcHBsaWVkKTtcblx0XHRpZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50LmFkb3B0ZWRTdHlsZVNoZWV0cyAmJiAhZG9jdW1lbnQuYWRvcHRlZFN0eWxlU2hlZXRzLmluY2x1ZGVzKGNhY2hlZCkpIGRvY3VtZW50LmFkb3B0ZWRTdHlsZVNoZWV0cy5wdXNoKGNhY2hlZCk7XG5cdFx0cmV0dXJuIGNhY2hlZDtcblx0fVxuXHRpZiAoKHN0eWxlcyBpbnN0YW5jZW9mIEJsb2IgfHwgc3R5bGVzIGluc3RhbmNlb2YgRmlsZSkgJiYgYWRvcHRlZEJsb2JNYXA/Lmhhcz8uKHN0eWxlcykpIHtcblx0XHRjb25zdCBjYWNoZWQgPSBhZG9wdGVkQmxvYk1hcC5nZXQoc3R5bGVzKTtcblx0XHRlbnN1cmVBZG9wdGVkU2hlZXRDb250ZW50KGNhY2hlZCk7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMgJiYgIWRvY3VtZW50LmFkb3B0ZWRTdHlsZVNoZWV0cy5pbmNsdWRlcyhjYWNoZWQpKSBkb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChjYWNoZWQpO1xuXHRcdHJldHVybiBjYWNoZWQ7XG5cdH1cblx0aWYgKCFzdHlsZXMpIHJldHVybiBudWxsO1xuXHRjb25zdCBzaGVldCA9IHR5cGVvZiBzdHlsZXMgPT0gXCJzdHJpbmdcIiA/IGdldE9ySW5zZXJ0Q29tcHV0ZWQoYWRvcHRlZE1hcCwgc3R5bGVzLCAoKSA9PiBuZXcgQ1NTU3R5bGVTaGVldCgpKSA6IHNoZWV0Rm9yQmxvYihzdHlsZXMpO1xuXHRpZiAodHlwZW9mIGRvY3VtZW50ICE9IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnQuYWRvcHRlZFN0eWxlU2hlZXRzICYmICFkb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMuaW5jbHVkZXMoc2hlZXQpKSBkb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChzaGVldCk7XG5cdGlmICh0eXBlb2Ygc3R5bGVzID09IFwic3RyaW5nXCIgJiYgIXVybENhblBhcnNlKHN0eWxlcykpIHtcblx0XHRjb25zdCBsYXllcldyYXBwZWQgPSB3cmFwQ3NzTGF5ZXIoc3R5bGVzLCBsYXllck5hbWUpO1xuXHRcdGFkb3B0ZWRNYXAuc2V0KHN0eWxlcywgc2hlZXQpO1xuXHRcdGlmICghYXBwbHlBZG9wdGVkU3R5bGVUZXh0KHNoZWV0LCBsYXllcldyYXBwZWQpKSB7XG5cdFx0XHRyZW1vdmVBZG9wdGVkKHNoZWV0KTtcblx0XHRcdGFkb3B0ZWRNYXAuZGVsZXRlKHN0eWxlcyk7XG5cdFx0XHRsb2FkSW5saW5lU3R5bGUoc3R5bGVzKTtcblx0XHR9IGVsc2UgcmVtZW1iZXJBZG9wdGVkVGV4dChzaGVldCwgbGF5ZXJXcmFwcGVkKTtcblx0XHRyZXR1cm4gc2hlZXQ7XG5cdH0gZWxzZSBwcm9taXNlT3JEaXJlY3QoZmV0Y2hBc0lubGluZShzdHlsZXMpLCAoY2FjaGVkKSA9PiB7XG5cdFx0YWRvcHRlZE1hcC5zZXQoY2FjaGVkLCBzaGVldCk7XG5cdFx0aWYgKGNhY2hlZCkge1xuXHRcdFx0aWYgKGNzc1RleHRSZXF1aXJlc0lubGluZVN0eWxlRWxlbWVudChjYWNoZWQpKSB7XG5cdFx0XHRcdHJlbW92ZUFkb3B0ZWQoc2hlZXQpO1xuXHRcdFx0XHRhZG9wdGVkTWFwLmRlbGV0ZShjYWNoZWQpO1xuXHRcdFx0XHRhZG9wdGVkQmxvYk1hcC5kZWxldGUoc3R5bGVzKTtcblx0XHRcdFx0bG9hZElubGluZVN0eWxlKGNhY2hlZCwgdm9pZCAwLCBsYXllck5hbWUgfHwgXCJcIik7XG5cdFx0XHRcdHJldHVybiBzaGVldDtcblx0XHRcdH1cblx0XHRcdGNvbnN0IGxheWVyV3JhcHBlZCA9IHdyYXBDc3NMYXllcihjYWNoZWQsIGxheWVyTmFtZSk7XG5cdFx0XHRpZiAoIWFwcGx5QWRvcHRlZFN0eWxlVGV4dChzaGVldCwgbGF5ZXJXcmFwcGVkKSkge1xuXHRcdFx0XHRyZW1vdmVBZG9wdGVkKHNoZWV0KTtcblx0XHRcdFx0YWRvcHRlZE1hcC5kZWxldGUoY2FjaGVkKTtcblx0XHRcdFx0YWRvcHRlZEJsb2JNYXAuZGVsZXRlKHN0eWxlcyk7XG5cdFx0XHRcdGxvYWRJbmxpbmVTdHlsZShjYWNoZWQsIHZvaWQgMCwgbGF5ZXJOYW1lIHx8IFwiXCIpO1xuXHRcdFx0fSBlbHNlIHJlbWVtYmVyQWRvcHRlZFRleHQoc2hlZXQsIGxheWVyV3JhcHBlZCk7XG5cdFx0XHRyZXR1cm4gc2hlZXQ7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIHNoZWV0O1xufTtcbnZhciBjb2xsZWN0U3R5bGVIb3N0cyA9IChub2RlLCBpbnRvKSA9PiB7XG5cdGlmICghbm9kZSB8fCBub2RlLm5vZGVUeXBlID09PSAzKSByZXR1cm47XG5cdGlmIChub2RlLm5vZGVUeXBlID09PSAxMSkge1xuXHRcdGZvciAoY29uc3QgY2hpbGQgb2Ygbm9kZS5jaGlsZE5vZGVzIHx8IFtdKSBjb2xsZWN0U3R5bGVIb3N0cyhjaGlsZCwgaW50byk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGlmIChpc1N0eWxlSG9zdChub2RlKSkgaW50by5hZGQobm9kZSk7XG5cdGlmICh0eXBlb2Ygbm9kZS5xdWVyeVNlbGVjdG9yQWxsICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybjtcblx0dHJ5IHtcblx0XHRmb3IgKGNvbnN0IGVsIG9mIG5vZGUucXVlcnlTZWxlY3RvckFsbChcIipcIikpIGlmIChpc1N0eWxlSG9zdChlbCkpIGludG8uYWRkKGVsKTtcblx0fSBjYXRjaCB7fVxufTtcbnZhciBub3RpZnlTdHlsZVRyZWVIb3N0cyA9IChob3N0cywgcmVhc29uID0gXCJ0cmVlXCIpID0+IHtcblx0Zm9yIChjb25zdCBlbCBvZiBob3N0cykge1xuXHRcdGlmICghaXNTdHlsZUhvc3QoZWwpKSBjb250aW51ZTtcblx0XHRmb3IgKGNvbnN0IGZuIG9mIHN0eWxlVHJlZUhvb2tzKSBmbihlbCwgcmVhc29uKTtcblx0fVxufTtcbnZhciByZWdpc3RlclN0eWxlVHJlZUhvb2sgPSAoZm4pID0+IHtcblx0aWYgKHR5cGVvZiBmbiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm47XG5cdHN0eWxlVHJlZUhvb2tzLmFkZChmbik7XG59O1xudmFyIG9ic2VydmVTdHlsZVRyZWUgPSAocm9vdCkgPT4ge1xuXHRpZiAoIXJvb3QgfHwgdHlwZW9mIE11dGF0aW9uT2JzZXJ2ZXIgPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiByb290O1xuXHRpZiAoc3R5bGVUcmVlT2JzZXJ2ZWQuaGFzKHJvb3QpKSByZXR1cm4gcm9vdDtcblx0c3R5bGVUcmVlT2JzZXJ2ZWQuYWRkKHJvb3QpO1xuXHRzdHlsZVRyZWVSb290cy5hZGQocm9vdCk7XG5cdGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKHJlY29yZHMpID0+IHtcblx0XHRjb25zdCBob3N0cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdFx0Zm9yIChjb25zdCByZWMgb2YgcmVjb3JkcykgaWYgKHJlYy50eXBlID09PSBcImNoaWxkTGlzdFwiKSB7XG5cdFx0XHRmb3IgKGNvbnN0IG5vZGUgb2YgcmVjLmFkZGVkTm9kZXMpIGNvbGxlY3RTdHlsZUhvc3RzKG5vZGUsIGhvc3RzKTtcblx0XHRcdGNvbnN0IHNjb3BlID0gcmVjLnRhcmdldD8uZ2V0Um9vdE5vZGU/LigpO1xuXHRcdFx0aWYgKHNjb3BlIGluc3RhbmNlb2YgU2hhZG93Um9vdCAmJiBpc1N0eWxlSG9zdChzY29wZS5ob3N0KSkge1xuXHRcdFx0XHRjb25zdCBzaGVldHMgPSBzY29wZS5hZG9wdGVkU3R5bGVTaGVldHM7XG5cdFx0XHRcdGlmICghc2hlZXRzIHx8IHNoZWV0cy5sZW5ndGggPT09IDApIGhvc3RzLmFkZChzY29wZS5ob3N0KTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHJlYy50eXBlID09PSBcImF0dHJpYnV0ZXNcIiAmJiByZWMudGFyZ2V0KSB7XG5cdFx0XHRpZiAoaXNTdHlsZUhvc3QocmVjLnRhcmdldCkpIGhvc3RzLmFkZChyZWMudGFyZ2V0KTtcblx0XHR9XG5cdFx0bm90aWZ5U3R5bGVUcmVlSG9zdHMoaG9zdHMsIFwibXV0YXRpb25cIik7XG5cdH0pO1xuXHR0cnkge1xuXHRcdG9ic2VydmVyLm9ic2VydmUocm9vdCwge1xuXHRcdFx0Y2hpbGRMaXN0OiB0cnVlLFxuXHRcdFx0c3VidHJlZTogdHJ1ZSxcblx0XHRcdGF0dHJpYnV0ZXM6IHRydWUsXG5cdFx0XHRhdHRyaWJ1dGVGaWx0ZXI6IFsuLi5TVFlMRV9USEVNRV9BVFRSU11cblx0XHR9KTtcblx0fSBjYXRjaCB7XG5cdFx0c3R5bGVUcmVlT2JzZXJ2ZWQuZGVsZXRlKHJvb3QpO1xuXHRcdHJldHVybiByb290O1xuXHR9XG5cdHJldHVybiByb290O1xufTtcbnZhciByZWh5ZHJhdGVDb25zdHJ1Y3RhYmxlU2hlZXRzID0gKCkgPT4ge1xuXHRpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm47XG5cdGNvbnN0IGNhblBhcnNlID0gdHlwZW9mIFVSTCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgVVJMLmNhblBhcnNlID09PSBcImZ1bmN0aW9uXCI7XG5cdGZvciAoY29uc3QgW2tleSwgc2hlZXRdIG9mIGFkb3B0ZWRNYXApIHtcblx0XHRpZiAoIXNoZWV0IHx8IHR5cGVvZiBrZXkgIT09IFwic3RyaW5nXCIpIGNvbnRpbnVlO1xuXHRcdGlmIChjYW5QYXJzZSAmJiBVUkwuY2FuUGFyc2Uoa2V5KSkgY29udGludWU7XG5cdFx0Y29uc3QgdGV4dCA9IGFkb3B0ZWRBcHBsaWVkVGV4dC5nZXQoc2hlZXQpIHx8IGtleTtcblx0XHRlbnN1cmVBZG9wdGVkU2hlZXRDb250ZW50KHNoZWV0LCB0ZXh0KTtcblx0XHRpZiAoZG9jdW1lbnQuYWRvcHRlZFN0eWxlU2hlZXRzICYmICFkb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMuaW5jbHVkZXMoc2hlZXQpKSBkb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMucHVzaChzaGVldCk7XG5cdH1cbn07XG52YXIgcmVtb3ZlQWRvcHRlZCA9IChzaGVldCkgPT4ge1xuXHRpZiAoIXNoZWV0KSByZXR1cm4gZmFsc2U7XG5cdGNvbnN0IHRhcmdldCA9IHR5cGVvZiBzaGVldCA9PT0gXCJzdHJpbmdcIiA/IGFkb3B0ZWRNYXAuZ2V0KHNoZWV0KSA6IHNoZWV0O1xuXHRpZiAoIXRhcmdldCB8fCB0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBmYWxzZTtcblx0Y29uc3Qgc2hlZXRzID0gZG9jdW1lbnQuYWRvcHRlZFN0eWxlU2hlZXRzO1xuXHRjb25zdCBpZHggPSBzaGVldHMuaW5kZXhPZih0YXJnZXQpO1xuXHRpZiAoaWR4ICE9PSAtMSkge1xuXHRcdHNoZWV0cy5zcGxpY2UoaWR4LCAxKTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59O1xudmFyIGdldFRyYW5zZm9ybSA9IChlbCkgPT4ge1xuXHRpZiAoZWw/LmNvbXB1dGVkU3R5bGVNYXApIHtcblx0XHRjb25zdCBtYXRyaXggPSBlbC5jb21wdXRlZFN0eWxlTWFwKCkuZ2V0KFwidHJhbnNmb3JtXCIpPy50b01hdHJpeD8uKCk7XG5cdFx0aWYgKG1hdHJpeCkgcmV0dXJuIG1hdHJpeDtcblx0fSBlbHNlIGlmIChlbCkge1xuXHRcdGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG5cdFx0cmV0dXJuIG5ldyBET01NYXRyaXgoc3R5bGU/LmdldFByb3BlcnR5VmFsdWU/LihcInRyYW5zZm9ybVwiKSk7XG5cdH1cblx0cmV0dXJuIG5ldyBET01NYXRyaXgoKTtcbn07XG52YXIgZ2V0VHJhbnNmb3JtT3JpZ2luID0gKGVsKSA9PiB7XG5cdGNvbnN0IGNzc09yaWdpbiA9IGdldENvbXB1dGVkU3R5bGUoZWwpPy5nZXRQcm9wZXJ0eVZhbHVlPy4oXCJ0cmFuc2Zvcm0tb3JpZ2luXCIpIHx8IGA1MCUgNTAlYDtcblx0cmV0dXJuIHBhcnNlT3JpZ2luKGNzc09yaWdpbiwgZWwpO1xufTtcbnZhciBnZXRQcm9wZXJ0eVZhbHVlID0gKHNyYywgbmFtZSkgPT4ge1xuXHRpZiAoXCJjb21wdXRlZFN0eWxlTWFwXCIgaW4gc3JjKSB7XG5cdFx0Y29uc3QgdmFsID0gc3JjPy5jb21wdXRlZFN0eWxlTWFwPy4oKT8uZ2V0KG5hbWUpO1xuXHRcdHJldHVybiB2YWwgaW5zdGFuY2VvZiBDU1NVbml0VmFsdWUgPyB2YWw/LnZhbHVlIHx8IDAgOiB2YWw/LnRvU3RyaW5nPy4oKTtcblx0fVxuXHRpZiAoc3JjIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcblx0XHRjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGU/LihzcmMsIFwiXCIpO1xuXHRcdHJldHVybiBwYXJzZUZsb2F0KGNzPy5nZXRQcm9wZXJ0eVZhbHVlPy4obmFtZSk/LnJlcGxhY2U/LihcInB4XCIsIFwiXCIpKSB8fCAwO1xuXHR9XG5cdHJldHVybiBwYXJzZUZsb2F0KChzcmM/LnN0eWxlID8/IHNyYykuZ2V0UHJvcGVydHlWYWx1ZT8uKG5hbWUpPy5yZXBsYWNlPy4oXCJweFwiLCBcIlwiKSkgfHwgMDtcbn07XG52YXIgZ2V0RWxlbWVudFpvb20gPSAoZWxlbWVudCkgPT4ge1xuXHRsZXQgem9vbSA9IDEsIGN1cnJlbnRFbGVtZW50ID0gZWxlbWVudDtcblx0d2hpbGUgKGN1cnJlbnRFbGVtZW50KSB7XG5cdFx0aWYgKFwiY3VycmVudENTU1pvb21cIiBpbiBjdXJyZW50RWxlbWVudCkge1xuXHRcdFx0Y29uc3QgY3VycmVudENTU1pvb20gPSBjdXJyZW50RWxlbWVudC5jdXJyZW50Q1NTWm9vbTtcblx0XHRcdGlmICh0eXBlb2YgY3VycmVudENTU1pvb20gPT09IFwibnVtYmVyXCIpIHJldHVybiB6b29tICo9IGN1cnJlbnRDU1Nab29tO1xuXHRcdH1cblx0XHRjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoY3VycmVudEVsZW1lbnQpO1xuXHRcdGlmIChzdHlsZS56b29tICYmIHN0eWxlLnpvb20gIT09IFwibm9ybWFsXCIpIHJldHVybiB6b29tICo9IHBhcnNlRmxvYXQoc3R5bGUuem9vbSk7XG5cdFx0aWYgKHN0eWxlLnpvb20gJiYgc3R5bGUuem9vbSAhPT0gXCJub3JtYWxcIiB8fCBcImN1cnJlbnRDU1Nab29tXCIgaW4gY3VycmVudEVsZW1lbnQpIHJldHVybiB6b29tO1xuXHRcdGN1cnJlbnRFbGVtZW50ID0gY3VycmVudEVsZW1lbnQ/Lm9mZnNldFBhcmVudCA/PyBjdXJyZW50RWxlbWVudD8ucGFyZW50RWxlbWVudDtcblx0fVxuXHRyZXR1cm4gem9vbTtcbn07XG52YXIgZ2V0UHhWYWx1ZSA9IChlbGVtZW50LCBuYW1lKSA9PiB7XG5cdHJldHVybiBnZXRQcm9wZXJ0eVZhbHVlPy4oZWxlbWVudCwgbmFtZSk7XG59O1xudmFyIGdldFBhZGRpbmcgPSAoc3JjLCBheGlzKSA9PiB7XG5cdGlmIChheGlzID09IFwiaW5saW5lXCIpIHJldHVybiBnZXRQcm9wZXJ0eVZhbHVlKHNyYywgXCJwYWRkaW5nLWlubGluZS1zdGFydFwiKSArIGdldFByb3BlcnR5VmFsdWUoc3JjLCBcInBhZGRpbmctaW5saW5lLWVuZFwiKTtcblx0cmV0dXJuIGdldFByb3BlcnR5VmFsdWUoc3JjLCBcInBhZGRpbmctYmxvY2stc3RhcnRcIikgKyBnZXRQcm9wZXJ0eVZhbHVlKHNyYywgXCJwYWRkaW5nLWJsb2NrLWVuZFwiKTtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jc3NvbS50c1xudmFyIHN0eWxlRWxlbWVudCA9IHR5cGVvZiBkb2N1bWVudCAhPSBcInVuZGVmaW5lZFwiID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpIDogbnVsbDtcbmlmIChzdHlsZUVsZW1lbnQpIHtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImhlYWRcIik/LmFwcGVuZENoaWxkPy4oc3R5bGVFbGVtZW50KTtcblx0c3R5bGVFbGVtZW50LmRhdGFzZXQub3duZXIgPSBcIkRPTVwiO1xufVxudmFyIHNldFN0eWxlVVJMID0gKGJhc2UsIHVybCwgbGF5ZXIgPSBcIlwiKSA9PiB7XG5cdGJhc2VbMF1bYmFzZVsxXV0gPSBiYXNlWzFdID09IFwiaW5uZXJIVE1MXCIgPyBjc3NJbXBvcnRXaXRoTGF5ZXIodXJsLCBsYXllcikgOiB1cmw7XG59O1xudmFyIHNldFN0eWxlUnVsZXMgPSAoY2xhc3NlcykgPT4ge1xuXHRyZXR1cm4gY2xhc3Nlcz8ubWFwPy4oKGFyZ3MpID0+IHNldFN0eWxlUnVsZSguLi5hcmdzKSk7XG59O1xudmFyIGdldFN0eWxlTGF5ZXIgPSAobGF5ZXJOYW1lLCBzaGVldCkgPT4ge1xuXHRzaGVldCB8fD0gc3R5bGVFbGVtZW50Py5zaGVldDtcblx0cmV0dXJuIGdldE9yQ3JlYXRlTGF5ZXJSdWxlKHNoZWV0LCBsYXllck5hbWUpO1xufTtcbnZhciBlbnN1cmVTdHlsZVNjb3BlU2VsZWN0b3IgPSAoZWxlbWVudCkgPT4ge1xuXHRpZiAoZWxlbWVudC5pZCkgcmV0dXJuIGAjJHtlc2NhcGVDU1NJZGVudGlmaWVyKGVsZW1lbnQuaWQpfWA7XG5cdGxldCBzdHlsZUlkID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN0eWxlLWlkXCIpO1xuXHRpZiAoIXN0eWxlSWQpIHtcblx0XHRzdHlsZUlkID0gY3JlYXRlU3R5bGVJZCgpO1xuXHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1zdHlsZS1pZFwiLCBzdHlsZUlkKTtcblx0fVxuXHRyZXR1cm4gYFtkYXRhLXN0eWxlLWlkPVwiJHtlc2NhcGVDU1NJZGVudGlmaWVyKHN0eWxlSWQpfVwiXWA7XG59O1xudmFyIGpvaW5TY29wZWRTZWxlY3RvciA9IChzY29wZSwgc2VsZWN0b3IpID0+IHtcblx0c2VsZWN0b3IgPSBzZWxlY3Rvci50cmltKCk7XG5cdGlmICghc2NvcGUpIHJldHVybiBzZWxlY3Rvcjtcblx0aWYgKCFzZWxlY3RvcikgcmV0dXJuIHNjb3BlO1xuXHRpZiAoc2VsZWN0b3Iuc3RhcnRzV2l0aChcIjo6XCIpKSByZXR1cm4gYCR7c2NvcGV9JHtzZWxlY3Rvcn1gO1xuXHRyZXR1cm4gYCR7c2NvcGV9ICR7c2VsZWN0b3J9YDtcbn07XG52YXIgZmluZFN0eWxlUnVsZSA9IChzaGVldCwgZnVsbFNlbGVjdG9yLCBzY29wZSwgc2VsZWN0b3IpID0+IHtcblx0Y29uc3QgcnVsZXMgPSBBcnJheS5mcm9tKHNoZWV0Py5jc3NSdWxlcyB8fCBbXSk7XG5cdGNvbnN0IGV4cGVjdGVkID0gZnVsbFNlbGVjdG9yLnRyaW0oKTtcblx0Y29uc3QgcmVxdWVzdGVkID0gc2VsZWN0b3IudHJpbSgpO1xuXHRyZXR1cm4gcnVsZXMuZmluZEluZGV4KChydWxlKSA9PiB7XG5cdFx0aWYgKCEocnVsZSBpbnN0YW5jZW9mIENTU1N0eWxlUnVsZSkpIHJldHVybiBmYWxzZTtcblx0XHRjb25zdCBhY3R1YWwgPSBydWxlLnNlbGVjdG9yVGV4dD8udHJpbT8uKCkgPz8gXCJcIjtcblx0XHRpZiAoYWN0dWFsID09PSBleHBlY3RlZCkgcmV0dXJuIHRydWU7XG5cdFx0aWYgKHJlcXVlc3RlZCAmJiBhY3R1YWwuZW5kc1dpdGgocmVxdWVzdGVkKSkgcmV0dXJuIGFjdHVhbC5zbGljZSgwLCBhY3R1YWwubGVuZ3RoIC0gcmVxdWVzdGVkLmxlbmd0aCkudHJpbSgpID09PSBzY29wZTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0pO1xufTtcbnZhciBnZXRTdHlsZVJ1bGUgPSAoc2VsZWN0b3IsIHNoZWV0LCBsYXllck5hbWUgPSBcInV4LXF1ZXJ5XCIsIGJhc2lzID0gbnVsbCkgPT4ge1xuXHRjb25zdCByb290ID0gaXNTaGFkb3dSb290KGJhc2lzKSB8fCBpc0RvY3VtZW50KGJhc2lzKSA/IGJhc2lzIDogYmFzaXM/LmdldFJvb3ROb2RlPy4oKSA/PyAodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiID8gZG9jdW1lbnQgOiBudWxsKTtcblx0Y29uc3QgYmFzaXNFbGVtZW50ID0gaXNDc3NFbGVtZW50KGJhc2lzKSA/IGJhc2lzIDogbnVsbDtcblx0bGV0IHNjb3BlID0gXCJcIjtcblx0aWYgKGJhc2lzRWxlbWVudCkgc2NvcGUgPSBlbnN1cmVTdHlsZVNjb3BlU2VsZWN0b3IoYmFzaXNFbGVtZW50KTtcblx0ZWxzZSBpZiAoaXNTaGFkb3dSb290KHJvb3QpKSBzY29wZSA9IFwiOmhvc3RcIjtcblx0ZWxzZSBpZiAoaXNEb2N1bWVudChyb290KSkgc2NvcGUgPSBcIjpyb290XCI7XG5cdGxldCBzdHlsZUVsZW1lbnQgPSBudWxsO1xuXHRpZiAoaXNTaGFkb3dSb290KHJvb3QpKSB7XG5cdFx0c3R5bGVFbGVtZW50ID0gcm9vdC5xdWVyeVNlbGVjdG9yKFwic3R5bGVbZGF0YS11eC1xdWVyeV1cIik7XG5cdFx0aWYgKCFzdHlsZUVsZW1lbnQgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cdFx0XHRzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS11eC1xdWVyeVwiLCBcIlwiKTtcblx0XHRcdHJvb3QuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0XHR9XG5cdH0gZWxzZSBzdHlsZUVsZW1lbnQgPSBzdHlsZUVsZW1lbnRHbG9iYWwoKTtcblx0c2hlZXQgfHw9IHN0eWxlRWxlbWVudD8uc2hlZXQ7XG5cdGlmICghc2hlZXQpIHJldHVybjtcblx0aWYgKGxheWVyTmFtZSkgcmV0dXJuIGdldFN0eWxlUnVsZShzZWxlY3RvciwgZ2V0U3R5bGVMYXllcihsYXllck5hbWUsIHNoZWV0KSwgbnVsbCwgYmFzaXMpO1xuXHRjb25zdCBmdWxsU2VsZWN0b3IgPSBqb2luU2NvcGVkU2VsZWN0b3Ioc2NvcGUsIHNlbGVjdG9yKTtcblx0bGV0IHJ1bGVJZCA9IGZpbmRTdHlsZVJ1bGUoc2hlZXQsIGZ1bGxTZWxlY3Rvciwgc2NvcGUsIHNlbGVjdG9yKTtcblx0aWYgKHJ1bGVJZCA9PT0gLTEpIHJ1bGVJZCA9IHNoZWV0Lmluc2VydFJ1bGUoYCR7ZnVsbFNlbGVjdG9yfSB7fWApO1xuXHRyZXR1cm4gc2hlZXQuY3NzUnVsZXM/LltydWxlSWRdO1xufTtcbmZ1bmN0aW9uIHN0eWxlRWxlbWVudEdsb2JhbCgpIHtcblx0cmV0dXJuIHN0eWxlRWxlbWVudCA/PyBudWxsO1xufVxudmFyIGZldGNoQW5kQ2FjaGUgPSAodXJsKSA9PiB7XG5cdGlmICghdXJsKSByZXR1cm4gbnVsbDtcblx0aWYgKGNhY2hlTWFwLmhhcyh1cmwpKSByZXR1cm4gY2FjaGVNYXAuZ2V0KHVybCk7XG5cdGlmICh1cmwgaW5zdGFuY2VvZiBCbG9iIHx8IHVybCBpbnN0YW5jZW9mIEZpbGUpIHtcblx0XHRpZiAoYmxvYlVSTE1hcC5oYXModXJsKSkgcmV0dXJuIGJsb2JVUkxNYXAuZ2V0KHVybCk7XG5cdFx0Y29uc3QgYnVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwodXJsKTtcblx0XHRibG9iVVJMTWFwLnNldCh1cmwsIGJ1cmwpO1xuXHRcdGNhY2hlTWFwLnNldChidXJsLCBidXJsKTtcblx0XHRyZXR1cm4gYnVybDtcblx0fVxuXHRpZiAoVVJMLmNhblBhcnNlKHVybCkgfHwgdXJsPy50cmltPy4oKT8uc3RhcnRzV2l0aD8uKFwiLi9cIikpIHtcblx0XHRjb25zdCBwcm9taXNlZCA9IGZldGNoKHVybD8ucmVwbGFjZT8uKFwiP3VybFwiLCBcIj9yYXdcIiksIHtcblx0XHRcdGNhY2hlOiBcImZvcmNlLWNhY2hlXCIsXG5cdFx0XHRtb2RlOiBcInNhbWUtb3JpZ2luXCIsXG5cdFx0XHRwcmlvcml0eTogXCJoaWdoXCJcblx0XHR9KT8udGhlbj8uKGFzeW5jIChyZXMpID0+IHtcblx0XHRcdGNvbnN0IGJsb2IgPSBhd2FpdCByZXMuYmxvYigpO1xuXHRcdFx0Y29uc3QgYnVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cdFx0XHRibG9iVVJMTWFwLnNldChibG9iLCBidXJsKTtcblx0XHRcdGNhY2hlTWFwLnNldCh1cmwsIGJ1cmwpO1xuXHRcdFx0Y2FjaGVNYXAuc2V0KGJ1cmwsIGJ1cmwpO1xuXHRcdFx0cmV0dXJuIGJ1cmw7XG5cdFx0fSk7XG5cdFx0Y2FjaGVNYXAuc2V0KHVybCwgcHJvbWlzZWQpO1xuXHRcdHJldHVybiBwcm9taXNlZDtcblx0fVxuXHRpZiAodHlwZW9mIHVybCA9PSBcInN0cmluZ1wiKSB7XG5cdFx0Y29uc3QgYmxvYiA9IG5ldyBCbG9iKFt1cmxdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcblx0XHRjb25zdCBidXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblx0XHRibG9iVVJMTWFwLnNldChibG9iLCBidXJsKTtcblx0XHRjYWNoZU1hcC5zZXQoYnVybCwgYnVybCk7XG5cdFx0cmV0dXJuIGJ1cmw7XG5cdH1cblx0cmV0dXJuIHVybDtcbn07XG52YXIgZmV0Y2hBc0lubGluZSA9ICh1cmwpID0+IHtcblx0aWYgKCF1cmwpIHJldHVybiBcIlwiO1xuXHRpZiAoY2FjaGVDb250ZW50TWFwLmhhcyh1cmwpKSByZXR1cm4gY2FjaGVDb250ZW50TWFwLmdldCh1cmwpID8/IFwiXCI7XG5cdGlmICh1cmwgaW5zdGFuY2VvZiBCbG9iIHx8IHVybCBpbnN0YW5jZW9mIEZpbGUpIHtcblx0XHRpZiAoY2FjaGVCbG9iQ29udGVudE1hcC5oYXModXJsKSkgcmV0dXJuIGNhY2hlQmxvYkNvbnRlbnRNYXAuZ2V0KHVybCkgPz8gXCJcIjtcblx0XHRjb25zdCBwcm9taXNlZCA9IHVybD8udGV4dD8uKCk/LnRoZW4/LigodGV4dCkgPT4ge1xuXHRcdFx0Y2FjaGVCbG9iQ29udGVudE1hcC5zZXQodXJsLCB0ZXh0KTtcblx0XHRcdHJldHVybiB0ZXh0O1xuXHRcdH0pO1xuXHRcdGNhY2hlQmxvYkNvbnRlbnRNYXAuc2V0KHVybCwgcHJvbWlzZWQpO1xuXHRcdHJldHVybiBwcm9taXNlZDtcblx0fVxuXHRpZiAoVVJMLmNhblBhcnNlKHVybCkgfHwgdXJsPy50cmltPy4oKT8uc3RhcnRzV2l0aD8uKFwiLi9cIikpIHtcblx0XHRjb25zdCBwcm9taXNlZCA9IGZldGNoKHVybD8ucmVwbGFjZT8uKFwiP3VybFwiLCBcIj9yYXdcIiksIHtcblx0XHRcdGNhY2hlOiBcImZvcmNlLWNhY2hlXCIsXG5cdFx0XHRtb2RlOiBcInNhbWUtb3JpZ2luXCIsXG5cdFx0XHRwcmlvcml0eTogXCJoaWdoXCJcblx0XHR9KT8udGhlbj8uKGFzeW5jIChyZXMpID0+IHtcblx0XHRcdGNvbnN0IHRleHQgPSBhd2FpdCByZXMudGV4dCgpO1xuXHRcdFx0Y2FjaGVDb250ZW50TWFwLnNldCh1cmwsIHRleHQpO1xuXHRcdFx0cmV0dXJuIHRleHQ7XG5cdFx0fSk7XG5cdFx0Y2FjaGVDb250ZW50TWFwLnNldCh1cmwsIHByb21pc2VkKTtcblx0XHRyZXR1cm4gcHJvbWlzZWQ7XG5cdH1cblx0aWYgKHR5cGVvZiB1cmwgPT0gXCJzdHJpbmdcIikge1xuXHRcdGNhY2hlQ29udGVudE1hcC5zZXQodXJsLCB1cmwpO1xuXHRcdHJldHVybiB1cmw7XG5cdH1cblx0cmV0dXJuIHVybDtcbn07XG52YXIgZ2V0QWRvcHRlZFN0eWxlUnVsZSA9IChzZWxlY3RvciwgbGF5ZXJOYW1lID0gXCJ1eC1xdWVyeVwiLCBiYXNpcyA9IG51bGwpID0+IHtcblx0aWYgKCFzZWxlY3RvcikgcmV0dXJuIG51bGw7XG5cdGlmICghc3VwcG9ydHNDb25zdHJ1Y3RhYmxlU3R5bGVzaGVldCgpKSByZXR1cm4gbnVsbDtcblx0Y29uc3Qgcm9vdCA9IGlzU2hhZG93Um9vdChiYXNpcykgPyBiYXNpcyA6IGJhc2lzPy5nZXRSb290Tm9kZSA/IGJhc2lzLmdldFJvb3ROb2RlKHsgY29tcG9zZWQ6IHRydWUgfSkgOiBudWxsO1xuXHRjb25zdCBpblNoYWRvdyA9IGlzU2hhZG93Um9vdChyb290KTtcblx0Y29uc3QgdGFyZ2V0QWRvcHRlZFNoZWV0cyA9IGluU2hhZG93ID8gcm9vdC5hZG9wdGVkU3R5bGVTaGVldHMgOiB0eXBlb2YgZG9jdW1lbnQgIT0gXCJ1bmRlZmluZWRcIiA/IGRvY3VtZW50LmFkb3B0ZWRTdHlsZVNoZWV0cyA6IG51bGw7XG5cdGlmICghdGFyZ2V0QWRvcHRlZFNoZWV0cykgcmV0dXJuIG51bGw7XG5cdGNvbnN0IHNlbGVjdG9yS2V5ID0gYCR7bGF5ZXJOYW1lIHx8IFwiXCJ9OiR7c2VsZWN0b3J9YDtcblx0bGV0IHNoZWV0O1xuXHRpZiAoaW5TaGFkb3cpIHtcblx0XHRsZXQgc2hhZG93TWFwID0gYWRvcHRlZFNoYWRvd1NlbGVjdG9yTWFwLmdldChyb290KTtcblx0XHRpZiAoIXNoYWRvd01hcCkge1xuXHRcdFx0c2hhZG93TWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRcdGFkb3B0ZWRTaGFkb3dTZWxlY3Rvck1hcC5zZXQocm9vdCwgc2hhZG93TWFwKTtcblx0XHR9XG5cdFx0c2hlZXQgPSBzaGFkb3dNYXAuZ2V0KHNlbGVjdG9yS2V5KTtcblx0XHRpZiAoIXNoZWV0KSB7XG5cdFx0XHRzaGVldCA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG5cdFx0XHRzaGFkb3dNYXAuc2V0KHNlbGVjdG9yS2V5LCBzaGVldCk7XG5cdFx0XHRpZiAoIXRhcmdldEFkb3B0ZWRTaGVldHMuaW5jbHVkZXMoc2hlZXQpKSB0YXJnZXRBZG9wdGVkU2hlZXRzLnB1c2goc2hlZXQpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRzaGVldCA9IGFkb3B0ZWRTZWxlY3Rvck1hcC5nZXQoc2VsZWN0b3JLZXkpO1xuXHRcdGlmICghc2hlZXQpIHtcblx0XHRcdHNoZWV0ID0gbmV3IENTU1N0eWxlU2hlZXQoKTtcblx0XHRcdGFkb3B0ZWRTZWxlY3Rvck1hcC5zZXQoc2VsZWN0b3JLZXksIHNoZWV0KTtcblx0XHRcdGlmICghdGFyZ2V0QWRvcHRlZFNoZWV0cy5pbmNsdWRlcyhzaGVldCkpIHRhcmdldEFkb3B0ZWRTaGVldHMucHVzaChzaGVldCk7XG5cdFx0fVxuXHR9XG5cdGlmIChsYXllck5hbWUpIHtcblx0XHRsZXQgbGF5ZXJSdWxlO1xuXHRcdGlmIChpblNoYWRvdykge1xuXHRcdFx0bGV0IHNoYWRvd0xheWVyTWFwID0gYWRvcHRlZFNoYWRvd0xheWVyTWFwLmdldChyb290KTtcblx0XHRcdGlmICghc2hhZG93TGF5ZXJNYXApIHtcblx0XHRcdFx0c2hhZG93TGF5ZXJNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdFx0XHRhZG9wdGVkU2hhZG93TGF5ZXJNYXAuc2V0KHJvb3QsIHNoYWRvd0xheWVyTWFwKTtcblx0XHRcdH1cblx0XHRcdGxheWVyUnVsZSA9IHNoYWRvd0xheWVyTWFwLmdldChsYXllck5hbWUpO1xuXHRcdH0gZWxzZSBsYXllclJ1bGUgPSBhZG9wdGVkTGF5ZXJNYXAuZ2V0KGxheWVyTmFtZSk7XG5cdFx0aWYgKCFsYXllclJ1bGUpIHtcblx0XHRcdGxheWVyUnVsZSA9IGdldE9yQ3JlYXRlTGF5ZXJSdWxlKHNoZWV0LCBsYXllck5hbWUpO1xuXHRcdFx0aWYgKGxheWVyUnVsZSkge1xuXHRcdFx0XHRpZiAoaW5TaGFkb3cpIHtcblx0XHRcdFx0XHRsZXQgc2hhZG93TGF5ZXJNYXAgPSBhZG9wdGVkU2hhZG93TGF5ZXJNYXAuZ2V0KHJvb3QpO1xuXHRcdFx0XHRcdGlmICghc2hhZG93TGF5ZXJNYXApIHtcblx0XHRcdFx0XHRcdHNoYWRvd0xheWVyTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRcdFx0XHRcdGFkb3B0ZWRTaGFkb3dMYXllck1hcC5zZXQocm9vdCwgc2hhZG93TGF5ZXJNYXApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzaGFkb3dMYXllck1hcC5zZXQobGF5ZXJOYW1lLCBsYXllclJ1bGUpO1xuXHRcdFx0XHR9IGVsc2UgYWRvcHRlZExheWVyTWFwLnNldChsYXllck5hbWUsIGxheWVyUnVsZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChsYXllclJ1bGUpIHtcblx0XHRcdGxldCBsYXllclJ1bGVJbmRleCA9IEFycmF5LmZyb20obGF5ZXJSdWxlLmNzc1J1bGVzIHx8IFtdKS5maW5kSW5kZXgoKHIpID0+IHIgaW5zdGFuY2VvZiBDU1NTdHlsZVJ1bGUgJiYgci5zZWxlY3RvclRleHQ/LnRyaW0/LigpID09PSBzZWxlY3Rvcj8udHJpbT8uKCkpO1xuXHRcdFx0aWYgKGxheWVyUnVsZUluZGV4ID09PSAtMSkgdHJ5IHtcblx0XHRcdFx0bGF5ZXJSdWxlSW5kZXggPSBsYXllclJ1bGUuaW5zZXJ0UnVsZShgJHtzZWxlY3Rvcn0ge31gLCBsYXllclJ1bGUuY3NzUnVsZXMubGVuZ3RoKTtcblx0XHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbGF5ZXJSdWxlLmNzc1J1bGVzW2xheWVyUnVsZUluZGV4XTtcblx0XHR9XG5cdH1cblx0bGV0IHJ1bGVJbmRleCA9IEFycmF5LmZyb20oc2hlZXQuY3NzUnVsZXMgfHwgW10pLmZpbmRJbmRleCgocnVsZSkgPT4gcnVsZSBpbnN0YW5jZW9mIENTU1N0eWxlUnVsZSAmJiBydWxlLnNlbGVjdG9yVGV4dD8udHJpbT8uKCkgPT09IHNlbGVjdG9yPy50cmltPy4oKSk7XG5cdGlmIChydWxlSW5kZXggPT09IC0xKSB0cnkge1xuXHRcdHJ1bGVJbmRleCA9IHNoZWV0Lmluc2VydFJ1bGUoYCR7c2VsZWN0b3J9IHt9YCwgc2hlZXQuY3NzUnVsZXMubGVuZ3RoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGNvbnN0IHJ1bGUgPSBzaGVldC5jc3NSdWxlc1tydWxlSW5kZXhdO1xuXHRpZiAocnVsZSBpbnN0YW5jZW9mIENTU1N0eWxlUnVsZSkgcmV0dXJuIHJ1bGU7XG5cdHJldHVybiBudWxsO1xufTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2Jha2VyLnRzXG52YXIgaW52YWxpZGF0aW9uUmVhZHkgPSBmYWxzZTtcbnZhciBsYXN0RmluZ2VycHJpbnQgPSBcIlwiO1xudmFyIHJlYmFrZVF1ZXVlZCA9IGZhbHNlO1xudmFyIG5vcm1hbGl6ZUNhdGVnb3JpZXMgPSAoY2F0ZWdvcmllcykgPT4ge1xuXHRjb25zdCBsaXN0ID0gWy4uLmNhdGVnb3JpZXM/Lmxlbmd0aCA/IGNhdGVnb3JpZXMgOiBERUZBVUxUX0NBVEVHT1JJRVNdO1xuXHRyZXR1cm4gWy4uLm5ldyBTZXQobGlzdC5maWx0ZXIoQm9vbGVhbikpXTtcbn07XG52YXIgY2FjaGVLZXlGb3IgPSAoc2VsZWN0b3IsIGNhdGVnb3JpZXMsIG1lZGlhID0gQkFLRV9TQ1JFRU5fTUVESUEpID0+IGAke3NlbGVjdG9yfVxcMCR7Wy4uLmNhdGVnb3JpZXNdLnNvcnQoKS5qb2luKFwiLFwiKX1cXDAke21lZGlhID09PSBmYWxzZSA/IFwiXCIgOiBtZWRpYX1gO1xudmFyIGJha2VUaGVtZUZpbmdlcnByaW50ID0gKHJvb3QgPSB0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIgPyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgOiBudWxsLCBlbCkgPT4ge1xuXHRpZiAoIXJvb3QgfHwgdHlwZW9mIGdldENvbXB1dGVkU3R5bGUgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFwiXCI7XG5cdGNvbnN0IGNzID0gZ2V0Q29tcHV0ZWRTdHlsZShyb290KTtcblx0Y29uc3QgcGFydHMgPSBbXG5cdFx0cm9vdC5nZXRBdHRyaWJ1dGU/LihcImRhdGEtdGhlbWVcIikgfHwgcm9vdC5nZXRBdHRyaWJ1dGU/LihcInRoZW1lXCIpIHx8IFwiXCIsXG5cdFx0cm9vdC5nZXRBdHRyaWJ1dGU/LihcImRhdGEtY29sb3Itc2NoZW1lXCIpIHx8IHJvb3QuZ2V0QXR0cmlidXRlPy4oXCJjb2xvci1zY2hlbWVcIikgfHwgY3MuY29sb3JTY2hlbWUgfHwgXCJcIixcblx0XHRjcy5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1iYXNlLWNvbG9yXCIpLnRyaW0oKSxcblx0XHRjcy5nZXRQcm9wZXJ0eVZhbHVlKFwiLS1jb2xvci1wcmltYXJ5XCIpLnRyaW0oKVxuXHRdO1xuXHRpZiAoZWwgJiYgZWwgIT09IHJvb3QpIHtcblx0XHRjb25zdCBsb2NhbCA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuXHRcdHBhcnRzLnB1c2goZWwuZ2V0QXR0cmlidXRlPy4oXCJkYXRhLXRoZW1lXCIpIHx8IFwiXCIsIGxvY2FsLmdldFByb3BlcnR5VmFsdWUoXCItLWJhc2UtY29sb3JcIikudHJpbSgpKTtcblx0fVxuXHRyZXR1cm4gcGFydHMuam9pbihcInxcIik7XG59O1xudmFyIHRha2VQcm9wID0gKGludG8sIGNzLCBuYW1lKSA9PiB7XG5cdGNvbnN0IHZhbHVlID0gY3MuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKT8udHJpbSgpO1xuXHRpZiAoIXZhbHVlKSByZXR1cm47XG5cdGludG8uc2V0KG5hbWUsIHZhbHVlKTtcbn07XG52YXIgQ09MT1JfUFJPUF9TRVQgPSBuZXcgU2V0KENTU19DT0xPUl9QUk9QRVJUSUVTKTtcbnZhciBiYWtlRGVjbFJhbmsgPSAobmFtZSkgPT4ge1xuXHRpZiAobmFtZS5zdGFydHNXaXRoKFwiLS1cIikpIHJldHVybiAyO1xuXHRpZiAoQ09MT1JfUFJPUF9TRVQuaGFzKG5hbWUpKSByZXR1cm4gMDtcblx0cmV0dXJuIDE7XG59O1xudmFyIGNvbGxlY3RCYWtlZERlY2xhcmF0aW9ucyA9IChjcywgY2F0ZWdvcmllcykgPT4ge1xuXHRjb25zdCBpbnRvID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0Y29uc3Qgc2V0ID0gbmV3IFNldChjYXRlZ29yaWVzKTtcblx0aWYgKHNldC5oYXMoXCJjb2xvcnNcIikpIGZvciAoY29uc3QgbmFtZSBvZiBDU1NfQ09MT1JfUFJPUEVSVElFUykgdGFrZVByb3AoaW50bywgY3MsIG5hbWUpO1xuXHRpZiAoc2V0LmhhcyhcInR5cG9ncmFwaHlcIikpIGZvciAoY29uc3QgbmFtZSBvZiBDU1NfVFlQT0dSQVBIWV9QUk9QRVJUSUVTKSB0YWtlUHJvcChpbnRvLCBjcywgbmFtZSk7XG5cdGlmIChzZXQuaGFzKFwibW90aW9uXCIpKSBmb3IgKGNvbnN0IG5hbWUgb2YgQ1NTX01PVElPTl9QUk9QRVJUSUVTKSB0YWtlUHJvcChpbnRvLCBjcywgbmFtZSk7XG5cdGlmIChzZXQuaGFzKFwidG9rZW5zXCIpIHx8IHNldC5oYXMoXCJjb2xvcnNcIikpIGZvciAobGV0IGkgPSAwOyBpIDwgY3MubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBuYW1lID0gY3MuaXRlbShpKTtcblx0XHRpZiAoIW5hbWUuc3RhcnRzV2l0aChcIi0tXCIpKSBjb250aW51ZTtcblx0XHRpZiAoc2V0LmhhcyhcInRva2Vuc1wiKSB8fCBpc0NvbG9yVG9rZW4obmFtZSkpIHRha2VQcm9wKGludG8sIGNzLCBuYW1lKTtcblx0fVxuXHRyZXR1cm4gaW50bztcbn07XG52YXIgYnVpbGRCYWtlZENzc1RleHQgPSAoc2VsZWN0b3IsIGRlY2xhcmF0aW9ucywgbGF5ZXIgPSBCQUtFX0xBWUVSLCBtZWRpYSA9IEJBS0VfU0NSRUVOX01FRElBKSA9PiB7XG5cdGNvbnN0IGJvZHkgPSBbXTtcblx0Y29uc3Qgcm93cyA9IFsuLi5kZWNsYXJhdGlvbnNdLnNvcnQoKGEsIGIpID0+IGJha2VEZWNsUmFuayhhWzBdKSAtIGJha2VEZWNsUmFuayhiWzBdKSk7XG5cdGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiByb3dzKSB7XG5cdFx0aWYgKCFuYW1lIHx8ICF2YWx1ZSkgY29udGludWU7XG5cdFx0Y29uc3QgYmFrZWQgPSB2YWx1ZS5yZXBsYWNlKC9cXHMqIWltcG9ydGFudFxccyokL2ksIFwiXCIpLnRyaW0oKTtcblx0XHRpZiAoIWJha2VkKSBjb250aW51ZTtcblx0XHRib2R5LnB1c2goYCR7bmFtZX06ICR7YmFrZWR9ICFpbXBvcnRhbnQ7YCk7XG5cdH1cblx0aWYgKCFib2R5Lmxlbmd0aCkgcmV0dXJuIFwiXCI7XG5cdGNvbnN0IHJ1bGUgPSBgJHtzZWxlY3Rvcn0ge1xcbiR7Ym9keS5qb2luKFwiXFxuXCIpfVxcbn1gO1xuXHRjb25zdCBpbm5lciA9IG1lZGlhID8gYEBtZWRpYSAke21lZGlhfSB7XFxuJHtydWxlfVxcbn1gIDogcnVsZTtcblx0cmV0dXJuIFtjc3NMYXllck9yZGVyKGxheWVyKSwgY3NzTGF5ZXJCbG9jayhsYXllciwgaW5uZXIpXS5maWx0ZXIoQm9vbGVhbikuam9pbihcIlwiKTtcbn07XG52YXIgY29sbGVjdEJha2VTY3JlZW5Ib3N0cyA9IChyb290KSA9PiB7XG5cdGlmICghcm9vdCB8fCByb290Lm5vZGVUeXBlICE9PSAxKSByZXR1cm4gW107XG5cdGNvbnN0IGhvc3RzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoW3Jvb3RdKTtcblx0Y29uc3QgY2hyb21lID0gcm9vdC5jbG9zZXN0Py4oQkFLRV9TQ1JFRU5fQ0hST01FLmpvaW4oXCIsIFwiKSk7XG5cdGlmIChjaHJvbWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgaG9zdHMuYWRkKGNocm9tZSk7XG5cdHJldHVybiBbLi4uaG9zdHNdO1xufTtcbnZhciBiYWtlQWxzb1F1ZXJpZXNGb3IgPSAocm9vdCkgPT4ge1xuXHRpZiAoIXJvb3QpIHJldHVybiBbXTtcblx0aWYgKHJvb3QuY2xhc3NMaXN0Py5jb250YWlucyhcInZpZXctc2V0dGluZ3NcIikgfHwgcm9vdC5jbG9zZXN0Py4oXCIudmlldy1zZXR0aW5nc1wiKSkgcmV0dXJuIEJBS0VfU0NSRUVOX0FMU09fU0VUVElOR1M7XG5cdGlmIChyb290LmNsYXNzTGlzdD8uY29udGFpbnMoXCJ2aWV3LWV4cGxvcmVyXCIpIHx8IHJvb3QuY2xvc2VzdD8uKFwiLnZpZXctZXhwbG9yZXJcIikgfHwgcm9vdC5xdWVyeVNlbGVjdG9yPy4oXCJ1aS1maWxlLW1hbmFnZXJcIikpIHJldHVybiBCQUtFX1NDUkVFTl9BTFNPX0VYUExPUkVSO1xuXHRyZXR1cm4gW107XG59O1xudmFyIGNvbGxlY3RCYWtlQWxzb0hvc3RzID0gKHJvb3QsIHF1ZXJpZXMgPSBCQUtFX1NDUkVFTl9BTFNPLCBwaWVyY2VTaGFkb3cgPSB0cnVlKSA9PiB7XG5cdGlmICghcm9vdCB8fCAhcXVlcmllcy5sZW5ndGgpIHJldHVybiBbXTtcblx0Y29uc3Qgcm9vdFNlbCA9IGVuc3VyZVN0eWxlU2NvcGVTZWxlY3Rvcihyb290KTtcblx0Y29uc3QgZmluZCA9IHBpZXJjZVNoYWRvdyA/IHF1ZXJ5Rmlyc3REZWVwIDogKHNjb3BlLCBzZWwpID0+IHtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgaGl0ID0gc2NvcGUucXVlcnlTZWxlY3RvcihzZWwpO1xuXHRcdFx0cmV0dXJuIGhpdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ID8gaGl0IDogbnVsbDtcblx0XHR9IGNhdGNoIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fTtcblx0Y29uc3QgZ3JvdXBlZCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdGZvciAoY29uc3QgcXVlcnkgb2YgcXVlcmllcykge1xuXHRcdGNvbnN0IHEgPSBTdHJpbmcocXVlcnkgfHwgXCJcIikudHJpbSgpO1xuXHRcdGlmICghcSkgY29udGludWU7XG5cdFx0Y29uc3QgZWwgPSBmaW5kKHJvb3QsIHEpO1xuXHRcdGlmICghZWwgfHwgZWwgPT09IHJvb3QpIGNvbnRpbnVlO1xuXHRcdGNvbnN0IHNlbCA9IGVsLmdldFJvb3ROb2RlKCkgPT09IHJvb3QuZ2V0Um9vdE5vZGUoKSA/IGAke3Jvb3RTZWx9ICR7cX1gIDogcTtcblx0XHRjb25zdCBsaXN0ID0gZ3JvdXBlZC5nZXQoZWwpO1xuXHRcdGlmIChsaXN0KSB7XG5cdFx0XHRpZiAoIWxpc3QuaW5jbHVkZXMoc2VsKSkgbGlzdC5wdXNoKHNlbCk7XG5cdFx0fSBlbHNlIGdyb3VwZWQuc2V0KGVsLCBbc2VsXSk7XG5cdH1cblx0cmV0dXJuIFsuLi5ncm91cGVkXS5tYXAoKFtlbCwgc2Vsc10pID0+ICh7XG5cdFx0ZWwsXG5cdFx0c2VsZWN0b3I6IHNlbHMuam9pbihcIiwgXCIpXG5cdH0pKTtcbn07XG52YXIgYWRvcHRlZExpc3QgPSAoZWwpID0+IHtcblx0Y29uc3Qgcm9vdCA9IGVsLmdldFJvb3ROb2RlPy4oKTtcblx0aWYgKHR5cGVvZiBTaGFkb3dSb290ICE9PSBcInVuZGVmaW5lZFwiICYmIHJvb3QgaW5zdGFuY2VvZiBTaGFkb3dSb290KSByZXR1cm4gcm9vdC5hZG9wdGVkU3R5bGVTaGVldHMgPz8gbnVsbDtcblx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIGRvY3VtZW50LmFkb3B0ZWRTdHlsZVNoZWV0cyA/PyBudWxsO1xuXHRyZXR1cm4gbnVsbDtcbn07XG52YXIgYXNzaWduQWRvcHRlZCA9IChlbCwgbmV4dCkgPT4ge1xuXHRjb25zdCByb290ID0gZWwuZ2V0Um9vdE5vZGU/LigpO1xuXHR0cnkge1xuXHRcdGlmICh0eXBlb2YgU2hhZG93Um9vdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiByb290IGluc3RhbmNlb2YgU2hhZG93Um9vdCkge1xuXHRcdFx0cm9vdC5hZG9wdGVkU3R5bGVTaGVldHMgPSBuZXh0O1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiKSBkb2N1bWVudC5hZG9wdGVkU3R5bGVTaGVldHMgPSBuZXh0O1xuXHR9IGNhdGNoIHt9XG59O1xudmFyIGFkb3B0U2hlZXQgPSAoZWwsIGJha2VkKSA9PiB7XG5cdGlmIChiYWtlZC5zaGVldCAmJiBzdXBwb3J0c0NvbnN0cnVjdGFibGVTdHlsZXNoZWV0KCkpIHtcblx0XHRjb25zdCBsaXN0ID0gYWRvcHRlZExpc3QoZWwpO1xuXHRcdGlmICghbGlzdCkgcmV0dXJuO1xuXHRcdGlmIChsaXN0LmluY2x1ZGVzKGJha2VkLnNoZWV0KSkge1xuXHRcdFx0YmFrZWQuYWRvcHRlZCA9IHRydWU7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRyeSB7XG5cdFx0XHRsaXN0LnB1c2goYmFrZWQuc2hlZXQpO1xuXHRcdFx0YmFrZWQuYWRvcHRlZCA9IHRydWU7XG5cdFx0XHRyZXR1cm47XG5cdFx0fSBjYXRjaCB7XG5cdFx0XHRhc3NpZ25BZG9wdGVkKGVsLCBbLi4ubGlzdCwgYmFrZWQuc2hlZXRdKTtcblx0XHRcdGJha2VkLmFkb3B0ZWQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHRpZiAoYmFrZWQuc3R5bGVFbCAmJiB0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRpZiAoIWJha2VkLnN0eWxlRWwuaXNDb25uZWN0ZWQpIGRvY3VtZW50LmhlYWQ/LmFwcGVuZChiYWtlZC5zdHlsZUVsKTtcblx0XHRiYWtlZC5hZG9wdGVkID0gdHJ1ZTtcblx0fVxufTtcbnZhciB1bmFkb3B0U2hlZXQgPSAoZWwsIGJha2VkKSA9PiB7XG5cdGlmIChiYWtlZC5zaGVldCAmJiBzdXBwb3J0c0NvbnN0cnVjdGFibGVTdHlsZXNoZWV0KCkpIHtcblx0XHRjb25zdCBsaXN0ID0gYWRvcHRlZExpc3QoZWwpO1xuXHRcdGlmIChsaXN0KSB7XG5cdFx0XHRjb25zdCBpZHggPSBsaXN0LmluZGV4T2YoYmFrZWQuc2hlZXQpO1xuXHRcdFx0aWYgKGlkeCAhPT0gLTEpIHRyeSB7XG5cdFx0XHRcdGxpc3Quc3BsaWNlKGlkeCwgMSk7XG5cdFx0XHR9IGNhdGNoIHtcblx0XHRcdFx0YXNzaWduQWRvcHRlZChlbCwgbGlzdC5maWx0ZXIoKHNoZWV0KSA9PiBzaGVldCAhPT0gYmFrZWQuc2hlZXQpKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0YmFrZWQuc3R5bGVFbD8ucmVtb3ZlKCk7XG5cdGJha2VkLmFkb3B0ZWQgPSBmYWxzZTtcbn07XG52YXIgd3JpdGVCYWtlZENzcyA9IChiYWtlZCwgY3NzVGV4dCkgPT4ge1xuXHRiYWtlZC5jc3NUZXh0ID0gY3NzVGV4dDtcblx0aWYgKCFjc3NUZXh0KSByZXR1cm4gZmFsc2U7XG5cdGlmIChiYWtlZC5zaGVldCAmJiBzdXBwb3J0c0NvbnN0cnVjdGFibGVTdHlsZXNoZWV0KCkpIHRyeSB7XG5cdFx0YmFrZWQuc2hlZXQucmVwbGFjZVN5bmMoY3NzVGV4dCk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0Y29uc29sZS53YXJuKFwiW3N0eWxlLWxpYl0gYmFrZSByZXBsYWNlU3luYyBmYWlsZWRcIiwgZXJyb3IpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpZiAoYmFrZWQuc3R5bGVFbCkge1xuXHRcdGJha2VkLnN0eWxlRWwudGV4dENvbnRlbnQgPSBjc3NUZXh0O1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdHJldHVybiBmYWxzZTtcbn07XG52YXIgcmVtZW1iZXJDYWNoZSA9IChiYWtlZCwgY2FjaGVNcykgPT4ge1xuXHRjb25zdCBwcmV2ID0gYmFrZWRDYWNoZS5nZXQoYmFrZWQuY2FjaGVLZXkpO1xuXHRpZiAocHJldj8udGltZXIpIGNsZWFyVGltZW91dChwcmV2LnRpbWVyKTtcblx0Y29uc3QgZW50cnkgPSB7XG5cdFx0Y3NzVGV4dDogYmFrZWQuY3NzVGV4dCxcblx0XHRmaW5nZXJwcmludDogYmFrZWQuZmluZ2VycHJpbnQsXG5cdFx0Y2F0ZWdvcmllczogYmFrZWQuY2F0ZWdvcmllcyxcblx0XHRzZWxlY3RvcjogYmFrZWQuc2VsZWN0b3IsXG5cdFx0ZXhwaXJlczogRGF0ZS5ub3coKSArIGNhY2hlTXNcblx0fTtcblx0aWYgKGNhY2hlTXMgPiAwICYmIHR5cGVvZiBzZXRUaW1lb3V0ID09PSBcImZ1bmN0aW9uXCIpIGVudHJ5LnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0aWYgKGJha2VkQ2FjaGUuZ2V0KGJha2VkLmNhY2hlS2V5KSA9PT0gZW50cnkpIGJha2VkQ2FjaGUuZGVsZXRlKGJha2VkLmNhY2hlS2V5KTtcblx0fSwgY2FjaGVNcyk7XG5cdGJha2VkQ2FjaGUuc2V0KGJha2VkLmNhY2hlS2V5LCBlbnRyeSk7XG59O1xudmFyIGRyb3BDYWNoZSA9IChjYWNoZUtleSkgPT4ge1xuXHRjb25zdCBwcmV2ID0gYmFrZWRDYWNoZS5nZXQoY2FjaGVLZXkpO1xuXHRpZiAocHJldj8udGltZXIpIGNsZWFyVGltZW91dChwcmV2LnRpbWVyKTtcblx0YmFrZWRDYWNoZS5kZWxldGUoY2FjaGVLZXkpO1xufTtcbnZhciBjbGVhckFsbENhY2hlID0gKCkgPT4ge1xuXHRmb3IgKGNvbnN0IGVudHJ5IG9mIGJha2VkQ2FjaGUudmFsdWVzKCkpIGlmIChlbnRyeS50aW1lcikgY2xlYXJUaW1lb3V0KGVudHJ5LnRpbWVyKTtcblx0YmFrZWRDYWNoZS5jbGVhcigpO1xufTtcbnZhciBwYXJrQmFrZWQgPSAoZWwsIGNhY2hlTXMgPSBERUZBVUxUX0NBQ0hFX01TKSA9PiB7XG5cdGNvbnN0IGJha2VkID0gYmFrZWRTdHlsZXMuZ2V0KGVsKTtcblx0aWYgKCFiYWtlZCkgcmV0dXJuO1xuXHRpZiAoYmFrZWQuYWRvcHRlZCkgdW5hZG9wdFNoZWV0KGVsLCBiYWtlZCk7XG5cdGJha2VkTGl2ZS5kZWxldGUoZWwpO1xuXHRpZiAoYmFrZWQuY3NzVGV4dCkgcmVtZW1iZXJDYWNoZShiYWtlZCwgY2FjaGVNcyk7XG59O1xudmFyIHJlc3VtZUJha2VkID0gKGVsLCBjYWNoZU1zID0gREVGQVVMVF9DQUNIRV9NUykgPT4ge1xuXHRjb25zdCBiYWtlZCA9IGJha2VkU3R5bGVzLmdldChlbCk7XG5cdGlmICghYmFrZWQgfHwgIWVsLmlzQ29ubmVjdGVkKSByZXR1cm47XG5cdGNvbnN0IGZpbmdlcnByaW50ID0gYmFrZVRoZW1lRmluZ2VycHJpbnQodm9pZCAwLCBlbCk7XG5cdGNvbnN0IGNhY2hlZCA9IGJha2VkQ2FjaGUuZ2V0KGJha2VkLmNhY2hlS2V5KTtcblx0aWYgKCFiYWtlZC5jc3NUZXh0ICYmIGNhY2hlZCAmJiBjYWNoZWQuZmluZ2VycHJpbnQgPT09IGZpbmdlcnByaW50KSB7XG5cdFx0d3JpdGVCYWtlZENzcyhiYWtlZCwgY2FjaGVkLmNzc1RleHQpO1xuXHRcdGJha2VkLmZpbmdlcnByaW50ID0gY2FjaGVkLmZpbmdlcnByaW50O1xuXHR9XG5cdGlmICghYmFrZWQuY3NzVGV4dCB8fCBiYWtlZC5maW5nZXJwcmludCAhPT0gZmluZ2VycHJpbnQpIHtcblx0XHRiYWtlQ29tcHV0ZWRTdHlsZShlbCwge1xuXHRcdFx0Y2F0ZWdvcmllczogYmFrZWQuY2F0ZWdvcmllcyxcblx0XHRcdGNhY2hlTXMsXG5cdFx0XHRsYXllcjogQkFLRV9MQVlFUlxuXHRcdH0pO1xuXHRcdHJldHVybjtcblx0fVxuXHRhZG9wdFNoZWV0KGVsLCBiYWtlZCk7XG5cdGJha2VkTGl2ZS5hZGQoZWwpO1xufTtcbnZhciBiYWtlSU8gPSBudWxsO1xudmFyIGVuc3VyZUJha2VJTyA9ICgpID0+IHtcblx0aWYgKGJha2VJTyB8fCB0eXBlb2YgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBiYWtlSU87XG5cdGJha2VJTyA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcigoZW50cmllcykgPT4ge1xuXHRcdGZvciAoY29uc3QgZW50cnkgb2YgZW50cmllcykge1xuXHRcdFx0Y29uc3QgZWwgPSBlbnRyeS50YXJnZXQ7XG5cdFx0XHRpZiAoIWJha2VkU3R5bGVzLmhhcyhlbCkpIGNvbnRpbnVlO1xuXHRcdFx0aWYgKGVudHJ5LmlzSW50ZXJzZWN0aW5nICYmIGVsLmlzQ29ubmVjdGVkKSByZXN1bWVCYWtlZChlbCk7XG5cdFx0XHRlbHNlIHBhcmtCYWtlZChlbCk7XG5cdFx0fVxuXHR9LCB7IHRocmVzaG9sZDogMCB9KTtcblx0cmV0dXJuIGJha2VJTztcbn07XG52YXIgZW5zdXJlQmFrZWRSZWNvcmQgPSAoZWwsIHNlbGVjdG9yLCBjYXRlZ29yaWVzLCBtZWRpYSA9IEJBS0VfU0NSRUVOX01FRElBKSA9PiB7XG5cdGxldCBiYWtlZCA9IGJha2VkU3R5bGVzLmdldChlbCk7XG5cdGlmIChiYWtlZCkge1xuXHRcdGJha2VkLnNlbGVjdG9yID0gc2VsZWN0b3I7XG5cdFx0YmFrZWQuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG5cdFx0YmFrZWQubWVkaWEgPSBtZWRpYTtcblx0XHRiYWtlZC5jYWNoZUtleSA9IGNhY2hlS2V5Rm9yKHNlbGVjdG9yLCBjYXRlZ29yaWVzLCBtZWRpYSk7XG5cdFx0cmV0dXJuIGJha2VkO1xuXHR9XG5cdGNvbnN0IGNhbkNvbnN0cnVjdCA9IHN1cHBvcnRzQ29uc3RydWN0YWJsZVN0eWxlc2hlZXQoKTtcblx0YmFrZWQgPSB7XG5cdFx0c2hlZXQ6IGNhbkNvbnN0cnVjdCA/IG5ldyBDU1NTdHlsZVNoZWV0KCkgOiBudWxsLFxuXHRcdHN0eWxlRWw6IGNhbkNvbnN0cnVjdCB8fCB0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIgPyBudWxsIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpLFxuXHRcdHNlbGVjdG9yLFxuXHRcdGNhdGVnb3JpZXMsXG5cdFx0Y3NzVGV4dDogXCJcIixcblx0XHRmaW5nZXJwcmludDogXCJcIixcblx0XHRhZG9wdGVkOiBmYWxzZSxcblx0XHRjYWNoZUtleTogY2FjaGVLZXlGb3Ioc2VsZWN0b3IsIGNhdGVnb3JpZXMsIG1lZGlhKSxcblx0XHRtZWRpYVxuXHR9O1xuXHRpZiAoYmFrZWQuc3R5bGVFbCkge1xuXHRcdGJha2VkLnN0eWxlRWwuZGF0YXNldC51eEJha2VkID0gXCJcIjtcblx0XHRiYWtlZC5zdHlsZUVsLmRhdGFzZXQub3duZXIgPSBcInN0eWxlLWxpYlwiO1xuXHR9XG5cdGJha2VkU3R5bGVzLnNldChlbCwgYmFrZWQpO1xuXHRlbnN1cmVCYWtlSU8oKT8ub2JzZXJ2ZShlbCk7XG5cdHJldHVybiBiYWtlZDtcbn07XG52YXIgZmx1c2hSZWJha2UgPSAoKSA9PiB7XG5cdHJlYmFrZVF1ZXVlZCA9IGZhbHNlO1xuXHRjb25zdCBiYXRjaCA9IFsuLi5yZWJha2VCYXRjaF07XG5cdHJlYmFrZUJhdGNoLmNsZWFyKCk7XG5cdGZvciAoY29uc3QgZWwgb2YgYmF0Y2gpIHtcblx0XHRpZiAoIWVsLmlzQ29ubmVjdGVkIHx8ICFiYWtlZFN0eWxlcy5oYXMoZWwpKSBjb250aW51ZTtcblx0XHRjb25zdCBiYWtlZCA9IGJha2VkU3R5bGVzLmdldChlbCk7XG5cdFx0YmFrZUNvbXB1dGVkU3R5bGUoZWwsIGJha2VkID8ge1xuXHRcdFx0Y2F0ZWdvcmllczogYmFrZWQuY2F0ZWdvcmllcyxcblx0XHRcdHNlbGVjdG9yOiBiYWtlZC5zZWxlY3Rvcixcblx0XHRcdG1lZGlhOiBiYWtlZC5tZWRpYVxuXHRcdH0gOiB7fSk7XG5cdH1cbn07XG52YXIgc2NoZWR1bGVSZWJha2UgPSAoZWwpID0+IHtcblx0cmViYWtlQmF0Y2guYWRkKGVsKTtcblx0aWYgKHJlYmFrZVF1ZXVlZCkgcmV0dXJuO1xuXHRyZWJha2VRdWV1ZWQgPSB0cnVlO1xuXHRxdWV1ZU1pY3JvdGFzayhmbHVzaFJlYmFrZSk7XG59O1xudmFyIGludmFsaWRhdGVCYWtlZFN0eWxlcyA9IChyZWFzb24gPSBcInRoZW1lXCIpID0+IHtcblx0Y29uc3QgZmluZ2VycHJpbnQgPSBiYWtlVGhlbWVGaW5nZXJwcmludCgpO1xuXHRpZiAocmVhc29uICE9PSBcImZvcmNlXCIgJiYgZmluZ2VycHJpbnQgPT09IGxhc3RGaW5nZXJwcmludCAmJiBsYXN0RmluZ2VycHJpbnQpIHJldHVybjtcblx0bGFzdEZpbmdlcnByaW50ID0gZmluZ2VycHJpbnQ7XG5cdGNsZWFyQWxsQ2FjaGUoKTtcblx0Zm9yIChjb25zdCBlbCBvZiBbLi4uYmFrZWRMaXZlXSkge1xuXHRcdGNvbnN0IGJha2VkID0gYmFrZWRTdHlsZXMuZ2V0KGVsKTtcblx0XHRpZiAoIWJha2VkKSB7XG5cdFx0XHRiYWtlZExpdmUuZGVsZXRlKGVsKTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHR1bmFkb3B0U2hlZXQoZWwsIGJha2VkKTtcblx0XHRiYWtlZC5jc3NUZXh0ID0gXCJcIjtcblx0XHRiYWtlZC5maW5nZXJwcmludCA9IFwiXCI7XG5cdFx0c2NoZWR1bGVSZWJha2UoZWwpO1xuXHR9XG59O1xudmFyIGVuc3VyZUJha2VJbnZhbGlkYXRpb24gPSAoKSA9PiB7XG5cdGlmIChpbnZhbGlkYXRpb25SZWFkeSB8fCB0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHJldHVybjtcblx0aW52YWxpZGF0aW9uUmVhZHkgPSB0cnVlO1xuXHRsYXN0RmluZ2VycHJpbnQgPSBiYWtlVGhlbWVGaW5nZXJwcmludCgpO1xuXHRyZWdpc3RlclN0eWxlVHJlZUhvb2soKGhvc3QpID0+IHtcblx0XHRpZiAoYmFrZVRoZW1lRmluZ2VycHJpbnQoKSAhPT0gbGFzdEZpbmdlcnByaW50KSB7XG5cdFx0XHRpbnZhbGlkYXRlQmFrZWRTdHlsZXMoXCJzdHlsZS10cmVlXCIpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRpZiAoaG9zdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIGJha2VkU3R5bGVzLmhhcyhob3N0KSkgc2NoZWR1bGVSZWJha2UoaG9zdCk7XG5cdH0pO1xuXHR0cnkge1xuXHRcdG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IGludmFsaWRhdGVCYWtlZFN0eWxlcyhcInRoZW1lLWF0dHJcIikpLm9ic2VydmUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB7XG5cdFx0XHRhdHRyaWJ1dGVzOiB0cnVlLFxuXHRcdFx0YXR0cmlidXRlRmlsdGVyOiBbLi4uU1RZTEVfVEhFTUVfT0JTRVJWRV9BVFRSU11cblx0XHR9KTtcblx0fSBjYXRjaCB7fVxuXHR0cnkge1xuXHRcdChtYXRjaE1lZGlhPy4oXCIocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspXCIpKT8uYWRkRXZlbnRMaXN0ZW5lcj8uKFwiY2hhbmdlXCIsICgpID0+IGludmFsaWRhdGVCYWtlZFN0eWxlcyhcImNvbG9yLXNjaGVtZVwiKSk7XG5cdH0gY2F0Y2gge31cbn07XG52YXIgYmFrZUNvbXB1dGVkU3R5bGUgPSAoZWwsIG9wdGlvbnMgPSB7fSkgPT4ge1xuXHRpZiAoIWVsIHx8IGVsLm5vZGVUeXBlICE9PSAxKSByZXR1cm4gbnVsbDtcblx0aWYgKHR5cGVvZiBnZXRDb21wdXRlZFN0eWxlICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBudWxsO1xuXHRlbnN1cmVCYWtlSW52YWxpZGF0aW9uKCk7XG5cdGNvbnN0IGNhdGVnb3JpZXMgPSBub3JtYWxpemVDYXRlZ29yaWVzKG9wdGlvbnMuY2F0ZWdvcmllcyk7XG5cdGNvbnN0IGxheWVyID0gb3B0aW9ucy5sYXllciB8fCBcInV4LWJha2VkXCI7XG5cdGNvbnN0IGNhY2hlTXMgPSBvcHRpb25zLmNhY2hlTXMgPz8gM2U0O1xuXHRjb25zdCBtZWRpYSA9IG9wdGlvbnMubWVkaWEgPT09IHZvaWQgMCA/IEJBS0VfU0NSRUVOX01FRElBIDogb3B0aW9ucy5tZWRpYTtcblx0Y29uc3Qgc2VsZWN0b3IgPSBvcHRpb25zLnNlbGVjdG9yPy50cmltKCkgfHwgZW5zdXJlU3R5bGVTY29wZVNlbGVjdG9yKGVsKTtcblx0Y29uc3QgZmluZ2VycHJpbnQgPSBiYWtlVGhlbWVGaW5nZXJwcmludCh2b2lkIDAsIGVsKTtcblx0Y29uc3QgYmFrZWQgPSBlbnN1cmVCYWtlZFJlY29yZChlbCwgc2VsZWN0b3IsIGNhdGVnb3JpZXMsIG1lZGlhKTtcblx0YmFrZWQuZmluZ2VycHJpbnQgPSBmaW5nZXJwcmludDtcblx0Y29uc3QgY2FjaGVkID0gYmFrZWRDYWNoZS5nZXQoYmFrZWQuY2FjaGVLZXkpO1xuXHRsZXQgY3NzVGV4dCA9IFwiXCI7XG5cdGlmIChjYWNoZWQgJiYgY2FjaGVkLmZpbmdlcnByaW50ID09PSBmaW5nZXJwcmludCAmJiBjYWNoZWQuY3NzVGV4dCkgY3NzVGV4dCA9IGNhY2hlZC5jc3NUZXh0O1xuXHRlbHNlIHtcblx0XHRjb25zdCBjcyA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuXHRcdGNzc1RleHQgPSBidWlsZEJha2VkQ3NzVGV4dChzZWxlY3RvciwgY29sbGVjdEJha2VkRGVjbGFyYXRpb25zKGNzLCBjYXRlZ29yaWVzKSwgbGF5ZXIsIG1lZGlhKTtcblx0fVxuXHRpZiAoIWNzc1RleHQpIHtcblx0XHR1bmFkb3B0U2hlZXQoZWwsIGJha2VkKTtcblx0XHRiYWtlZExpdmUuZGVsZXRlKGVsKTtcblx0XHRyZXR1cm4gYmFrZWQ7XG5cdH1cblx0d3JpdGVCYWtlZENzcyhiYWtlZCwgY3NzVGV4dCk7XG5cdHJlbWVtYmVyQ2FjaGUoYmFrZWQsIGNhY2hlTXMpO1xuXHRpZiAoaXNFbGVtZW50VmlzaWJsZShlbCkpIHtcblx0XHRhZG9wdFNoZWV0KGVsLCBiYWtlZCk7XG5cdFx0YmFrZWRMaXZlLmFkZChlbCk7XG5cdH0gZWxzZSB7XG5cdFx0dW5hZG9wdFNoZWV0KGVsLCBiYWtlZCk7XG5cdFx0YmFrZWRMaXZlLmRlbGV0ZShlbCk7XG5cdH1cblx0cmV0dXJuIGJha2VkO1xufTtcbnZhciB1bmJha2VDb21wdXRlZFN0eWxlID0gKGVsLCBrZWVwQ2FjaGUgPSB0cnVlKSA9PiB7XG5cdGlmICghZWwpIHJldHVybjtcblx0Y29uc3QgYmFrZWQgPSBiYWtlZFN0eWxlcy5nZXQoZWwpO1xuXHRpZiAoIWJha2VkKSByZXR1cm47XG5cdHVuYWRvcHRTaGVldChlbCwgYmFrZWQpO1xuXHRiYWtlZExpdmUuZGVsZXRlKGVsKTtcblx0YmFrZUlPPy51bm9ic2VydmUoZWwpO1xuXHRpZiAoa2VlcENhY2hlICYmIGJha2VkLmNzc1RleHQpIHJlbWVtYmVyQ2FjaGUoYmFrZWQsIERFRkFVTFRfQ0FDSEVfTVMpO1xuXHRlbHNlIGRyb3BDYWNoZShiYWtlZC5jYWNoZUtleSk7XG5cdGJha2VkU3R5bGVzLmRlbGV0ZShlbCk7XG59O1xudmFyIHJlYmFrZUNvbXB1dGVkU3R5bGUgPSAoZWwsIG9wdGlvbnMpID0+IHtcblx0aWYgKCFlbCkgcmV0dXJuIG51bGw7XG5cdGNvbnN0IGJha2VkID0gYmFrZWRTdHlsZXMuZ2V0KGVsKTtcblx0aWYgKGJha2VkKSB7XG5cdFx0dW5hZG9wdFNoZWV0KGVsLCBiYWtlZCk7XG5cdFx0YmFrZWQuY3NzVGV4dCA9IFwiXCI7XG5cdFx0ZHJvcENhY2hlKGJha2VkLmNhY2hlS2V5KTtcblx0fVxuXHRyZXR1cm4gYmFrZUNvbXB1dGVkU3R5bGUoZWwsIG9wdGlvbnMgPz8gKGJha2VkID8ge1xuXHRcdGNhdGVnb3JpZXM6IGJha2VkLmNhdGVnb3JpZXMsXG5cdFx0c2VsZWN0b3I6IGJha2VkLnNlbGVjdG9yLFxuXHRcdG1lZGlhOiBiYWtlZC5tZWRpYVxuXHR9IDoge30pKTtcbn07XG52YXIgZ2V0QmFrZWRTdHlsZSA9IChlbCkgPT4gZWwgPyBiYWtlZFN0eWxlcy5nZXQoZWwpIDogdm9pZCAwO1xudmFyIGJha2VTY3JlZW5Db2xvcnMgPSAocm9vdCwgb3B0aW9ucyA9IHt9KSA9PiB7XG5cdGNvbnN0IG9wdHMgPSB7XG5cdFx0bWVkaWE6IEJBS0VfU0NSRUVOX01FRElBLFxuXHRcdHBpZXJjZVNoYWRvdzogb3B0aW9ucy5waWVyY2VTaGFkb3cgIT09IGZhbHNlLFxuXHRcdC4uLm9wdGlvbnNcblx0fTtcblx0Y29uc3QgaG9zdHMgPSBjb2xsZWN0QmFrZVNjcmVlbkhvc3RzKHJvb3QpO1xuXHRjb25zdCBleHRyYXMgPSBjb2xsZWN0QmFrZUFsc29Ib3N0cyhyb290LCBvcHRzLmFsc28gPz8gYmFrZUFsc29RdWVyaWVzRm9yKHJvb3QpLCBvcHRzLnBpZXJjZVNoYWRvdyAhPT0gZmFsc2UpO1xuXHRjb25zdCBvdXQgPSBbXTtcblx0Y29uc3QgZm9sbG93ZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcblx0Zm9yIChjb25zdCBlbCBvZiBob3N0cykge1xuXHRcdGNvbnN0IGJha2VkID0gYmFrZUNvbXB1dGVkU3R5bGUoZWwsIG9wdHMpO1xuXHRcdGlmIChiYWtlZCkgb3V0LnB1c2goYmFrZWQpO1xuXHR9XG5cdGZvciAoY29uc3QgeyBlbCwgc2VsZWN0b3IgfSBvZiBleHRyYXMpIHtcblx0XHRpZiAoaG9zdHMuaW5jbHVkZXMoZWwpKSBjb250aW51ZTtcblx0XHRjb25zdCBiYWtlZCA9IGJha2VDb21wdXRlZFN0eWxlKGVsLCB7XG5cdFx0XHQuLi5vcHRzLFxuXHRcdFx0c2VsZWN0b3Jcblx0XHR9KTtcblx0XHRpZiAoYmFrZWQpIG91dC5wdXNoKGJha2VkKTtcblx0XHRmb2xsb3dlcnMuYWRkKGVsKTtcblx0fVxuXHRpZiAocm9vdCkge1xuXHRcdGNvbnN0IHByZXYgPSBiYWtlZEZvbGxvd2Vycy5nZXQocm9vdCk7XG5cdFx0aWYgKHByZXYpIHtcblx0XHRcdGZvciAoY29uc3QgZWwgb2YgcHJldikgaWYgKCFmb2xsb3dlcnMuaGFzKGVsKSAmJiAhaG9zdHMuaW5jbHVkZXMoZWwpKSB1bmJha2VDb21wdXRlZFN0eWxlKGVsLCB0cnVlKTtcblx0XHR9XG5cdFx0aWYgKGZvbGxvd2Vycy5zaXplKSBiYWtlZEZvbGxvd2Vycy5zZXQocm9vdCwgZm9sbG93ZXJzKTtcblx0XHRlbHNlIGJha2VkRm9sbG93ZXJzLmRlbGV0ZShyb290KTtcblx0fVxuXHRyZXR1cm4gb3V0O1xufTtcbnZhciB1bmJha2VTY3JlZW5Db2xvcnMgPSAocm9vdCwga2VlcENhY2hlID0gdHJ1ZSkgPT4ge1xuXHRpZiAoIXJvb3QpIHJldHVybjtcblx0Y29uc3QgZm9sbG93ZXJzID0gYmFrZWRGb2xsb3dlcnMuZ2V0KHJvb3QpO1xuXHRiYWtlZEZvbGxvd2Vycy5kZWxldGUocm9vdCk7XG5cdGZvciAoY29uc3QgZWwgb2YgY29sbGVjdEJha2VTY3JlZW5Ib3N0cyhyb290KSkgdW5iYWtlQ29tcHV0ZWRTdHlsZShlbCwga2VlcENhY2hlKTtcblx0aWYgKGZvbGxvd2VycykgZm9yIChjb25zdCBlbCBvZiBmb2xsb3dlcnMpIHVuYmFrZUNvbXB1dGVkU3R5bGUoZWwsIGtlZXBDYWNoZSk7XG59O1xudmFyIHNjaGVkdWxlQmFrZVNjcmVlbkNvbG9ycyA9IChyb290LCBvcHRpb25zKSA9PiB7XG5cdGNvbnN0IHJ1biA9IChyZXRyeU1pc3MgPSB0cnVlKSA9PiB7XG5cdFx0YmFrZVNjcmVlbkNvbG9ycyhyb290LCBvcHRpb25zKTtcblx0XHRpZiAoIXJldHJ5TWlzcyB8fCAhcm9vdCkgcmV0dXJuO1xuXHRcdGNvbnN0IHF1ZXJpZXMgPSBvcHRpb25zPy5hbHNvID8/IGJha2VBbHNvUXVlcmllc0Zvcihyb290KTtcblx0XHRjb25zdCBwaWVyY2UgPSBvcHRpb25zPy5waWVyY2VTaGFkb3cgIT09IGZhbHNlO1xuXHRcdGlmICghcXVlcmllcy5sZW5ndGgpIHJldHVybjtcblx0XHRpZiAocXVlcmllcy5zb21lKChzZWwpID0+ICEocGllcmNlID8gcXVlcnlGaXJzdERlZXAocm9vdCwgc2VsKSA6IHJvb3QucXVlcnlTZWxlY3RvcihzZWwpKSkgJiYgdHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gXCJmdW5jdGlvblwiKSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gcnVuKGZhbHNlKSk7XG5cdH07XG5cdGlmICghcm9vdCB8fCB0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICE9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRydW4oZmFsc2UpO1xuXHRcdHJldHVybjtcblx0fVxuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gcnVuKHRydWUpKTtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9jb21wb25lbnQudHNcbnZhciBzeW5jQWRvcHRlZFNoZWV0c1RvU2hhZG93ID0gKGJUbykgPT4ge1xuXHRjb25zdCByb290ID0gYlRvPy5zaGFkb3dSb290O1xuXHRpZiAoIXJvb3QpIHJldHVybjtcblx0Y29uc3QgYWRvcHRlZFNoZWV0cyA9IGFkb3B0ZWRTdHlsZVNoZWV0c0NhY2hlLmdldChiVG8pIHx8IFtdO1xuXHRmb3IgKGNvbnN0IHNoZWV0IG9mIGFkb3B0ZWRTaGVldHMpIGVuc3VyZUFkb3B0ZWRTaGVldENvbnRlbnQoc2hlZXQpO1xuXHR0cnkge1xuXHRcdGNvbnN0IGxpdmUgPSByb290LmFkb3B0ZWRTdHlsZVNoZWV0cyB8fCBbXTtcblx0XHRyb290LmFkb3B0ZWRTdHlsZVNoZWV0cyA9IFsuLi5hZG9wdGVkU2hlZXRzLmZpbHRlcigocykgPT4gIWxpdmUuaW5jbHVkZXMocykpLCAuLi4vKiBAX19QVVJFX18gKi8gbmV3IFNldChbLi4ubGl2ZV0pXTtcblx0fSBjYXRjaCB7fVxufTtcbnZhciBhZGRBZG9wdGVkU2hlZXRUb0VsZW1lbnQgPSAoYlRvLCBzaGVldCkgPT4ge1xuXHRsZXQgYWRvcHRlZFNoZWV0cyA9IGFkb3B0ZWRTdHlsZVNoZWV0c0NhY2hlLmdldChiVG8pO1xuXHRpZiAoIWFkb3B0ZWRTaGVldHMpIGFkb3B0ZWRTdHlsZVNoZWV0c0NhY2hlLnNldChiVG8sIGFkb3B0ZWRTaGVldHMgPSBbXSk7XG5cdGlmIChzaGVldCAmJiBhZG9wdGVkU2hlZXRzLmluZGV4T2Yoc2hlZXQpIDwgMCkgYWRvcHRlZFNoZWV0cy5wdXNoKHNoZWV0KTtcblx0ZW5zdXJlQWRvcHRlZFNoZWV0Q29udGVudChzaGVldCk7XG5cdHN5bmNBZG9wdGVkU2hlZXRzVG9TaGFkb3coYlRvKTtcbn07XG52YXIgZW5zdXJlU2hhZG93Q3NzRmFsbGJhY2sgPSAoYlRvLCBjc3NUZXh0KSA9PiB7XG5cdGNvbnN0IHJvb3QgPSBiVG8/LnNoYWRvd1Jvb3Q7XG5cdGlmICghcm9vdCB8fCAhY3NzVGV4dCkgcmV0dXJuIG51bGw7XG5cdGxldCBzdHlsZSA9IHJvb3QucXVlcnlTZWxlY3Rvcj8uKGBzdHlsZVske0hPU1RfQ1NTX0ZBTExCQUNLfV1gKTtcblx0aWYgKCFzdHlsZSkge1xuXHRcdHN0eWxlID0gbG9hZElubGluZVN0eWxlKGNzc1RleHQsIHJvb3QsIFwiXCIpO1xuXHRcdGlmIChzdHlsZSkgc3R5bGUuc2V0QXR0cmlidXRlKEhPU1RfQ1NTX0ZBTExCQUNLLCBcIlwiKTtcblx0fSBlbHNlIGlmIChzdHlsZS50ZXh0Q29udGVudCAhPT0gY3NzVGV4dCkgc3R5bGUudGV4dENvbnRlbnQgPSBjc3NUZXh0O1xuXHRyZXR1cm4gc3R5bGU7XG59O1xudmFyIHJlaHlkcmF0ZUFkb3B0ZWRTdHlsZVNoZWV0cyA9IChyb290ID0gdHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiID8gZG9jdW1lbnQgOiBudWxsKSA9PiB7XG5cdGlmICghcm9vdCkgcmV0dXJuO1xuXHRjb25zdCByZXN0b3JlID0gKGhvc3QpID0+IHtcblx0XHRpZiAoIWhvc3Q/LnNoYWRvd1Jvb3QpIHJldHVybjtcblx0XHRlbnN1cmVTaGFkb3dDc3NGYWxsYmFjayhob3N0LCBob3N0Q3NzVGV4dChob3N0KSk7XG5cdFx0c3luY0Fkb3B0ZWRTaGVldHNUb1NoYWRvdyhob3N0KTtcblx0fTtcblx0aWYgKHJvb3Qubm9kZVR5cGUgPT09IDEpIHJlc3RvcmUocm9vdCk7XG5cdGNvbnN0IHZpc2l0ID0gKG5vZGUpID0+IHtcblx0XHRsZXQgY2hpbGRyZW4gPSBbXTtcblx0XHR0cnkge1xuXHRcdFx0Y2hpbGRyZW4gPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoXCIqXCIpO1xuXHRcdH0gY2F0Y2gge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBob3N0ID0gY2hpbGRyZW5baV07XG5cdFx0XHRpZiAoaG9zdC5zaGFkb3dSb290KSB7XG5cdFx0XHRcdHJlc3RvcmUoaG9zdCk7XG5cdFx0XHRcdHZpc2l0KGhvc3Quc2hhZG93Um9vdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHR2aXNpdChyb290KTtcbn07XG52YXIgaG9zdENzc1RleHQgPSAoYlRvKSA9PiB7XG5cdGNvbnN0IHNyYyA9IGJUbz8uc3R5bGVzO1xuXHRpZiAodHlwZW9mIHNyYyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIHNyYztcblx0aWYgKHR5cGVvZiBzcmMgPT09IFwiZnVuY3Rpb25cIikgdHJ5IHtcblx0XHRjb25zdCBvdXQgPSBzcmMuY2FsbChiVG8pO1xuXHRcdGlmICh0eXBlb2Ygb3V0ID09PSBcInN0cmluZ1wiKSByZXR1cm4gb3V0O1xuXHRcdHJldHVybiBjc3NUZXh0Rm9yQWRvcHRlZFNoZWV0KG91dCk7XG5cdH0gY2F0Y2gge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdHJldHVybiBjc3NUZXh0Rm9yQWRvcHRlZFNoZWV0KHNyYyk7XG59O1xudmFyIGVuc3VyZUhvc3RTdHlsZXMgPSAoYlRvKSA9PiB7XG5cdGlmICghYlRvKSByZXR1cm47XG5cdGlmIChiVG8uc3R5bGVzICE9IG51bGwpIGxvYWRDYWNoZWRTdHlsZXMoYlRvLCBiVG8uc3R5bGVzKTtcblx0c3luY0Fkb3B0ZWRTaGVldHNUb1NoYWRvdyhiVG8pO1xuXHRlbnN1cmVTaGFkb3dDc3NGYWxsYmFjayhiVG8sIGhvc3RDc3NUZXh0KGJUbykpO1xufTtcbnZhciBzdHlsZUZsdXNoQmF0Y2ggPSBbXTtcbnZhciBzdHlsZUZsdXNoU2NoZWR1bGVkID0gZmFsc2U7XG52YXIgc2NoZWR1bGVFbnN1cmVIb3N0U3R5bGVzID0gKGJUbykgPT4ge1xuXHRpZiAoIWJUbyB8fCAhKGJUbyBpbnN0YW5jZW9mIEVsZW1lbnQpIHx8IHN0eWxlRmx1c2hQZW5kaW5nLmhhcyhiVG8pKSByZXR1cm47XG5cdHN0eWxlRmx1c2hQZW5kaW5nLmFkZChiVG8pO1xuXHRzdHlsZUZsdXNoQmF0Y2gucHVzaChiVG8pO1xuXHRpZiAoc3R5bGVGbHVzaFNjaGVkdWxlZCkgcmV0dXJuO1xuXHRzdHlsZUZsdXNoU2NoZWR1bGVkID0gdHJ1ZTtcblx0cXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuXHRcdHN0eWxlRmx1c2hTY2hlZHVsZWQgPSBmYWxzZTtcblx0XHRjb25zdCBiYXRjaCA9IHN0eWxlRmx1c2hCYXRjaDtcblx0XHRzdHlsZUZsdXNoQmF0Y2ggPSBbXTtcblx0XHRmb3IgKGNvbnN0IGhvc3Qgb2YgYmF0Y2gpIHtcblx0XHRcdHN0eWxlRmx1c2hQZW5kaW5nLmRlbGV0ZShob3N0KTtcblx0XHRcdGlmIChob3N0LmlzQ29ubmVjdGVkKSBlbnN1cmVIb3N0U3R5bGVzKGhvc3QpO1xuXHRcdH1cblx0fSk7XG59O1xucmVnaXN0ZXJTdHlsZVRyZWVIb29rKChlbCkgPT4gc2NoZWR1bGVFbnN1cmVIb3N0U3R5bGVzKGVsKSk7XG52YXIgbG9hZENhY2hlZFN0eWxlcyA9IChiVG8sIHNyYykgPT4ge1xuXHRpZiAoIXNyYykgcmV0dXJuIG51bGw7XG5cdGxldCByZXNvbHZlZFNyYyA9IHNyYztcblx0aWYgKHR5cGVvZiBzcmMgPT0gXCJmdW5jdGlvblwiKSB0cnkge1xuXHRcdGNvbnN0IHdlYWsgPSBuZXcgV2Vha1JlZihiVG8pO1xuXHRcdHJlc29sdmVkU3JjID0gc3JjLmNhbGwoYlRvLCB3ZWFrKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGNvbnNvbGUud2FybihcIkVycm9yIGNhbGxpbmcgc3R5bGVzIGZ1bmN0aW9uOlwiLCBlKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRpZiAocmVzb2x2ZWRTcmMgJiYgdHlwZW9mIENTU1N0eWxlU2hlZXQgIT0gXCJ1bmRlZmluZWRcIiAmJiByZXNvbHZlZFNyYyBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQpIHtcblx0XHRhZGRBZG9wdGVkU2hlZXRUb0VsZW1lbnQoYlRvLCByZXNvbHZlZFNyYyk7XG5cdFx0cmV0dXJuIGVuc3VyZVNoYWRvd0Nzc0ZhbGxiYWNrKGJUbywgY3NzVGV4dEZvckFkb3B0ZWRTaGVldChyZXNvbHZlZFNyYykpO1xuXHR9XG5cdGlmIChyZXNvbHZlZFNyYyBpbnN0YW5jZW9mIFByb21pc2UpIHtcblx0XHRyZXNvbHZlZFNyYy50aGVuKChyZXN1bHQpID0+IHtcblx0XHRcdGlmIChyZXN1bHQgaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0KSBhZGRBZG9wdGVkU2hlZXRUb0VsZW1lbnQoYlRvLCByZXN1bHQpO1xuXHRcdFx0ZWxzZSBpZiAocmVzdWx0ICE9IG51bGwpIGxvYWRDYWNoZWRTdHlsZXMoYlRvLCByZXN1bHQpO1xuXHRcdH0pLmNhdGNoKChlKSA9PiB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJFcnJvciBsb2FkaW5nIGFkb3B0ZWQgc3R5bGVzaGVldDpcIiwgZSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0aWYgKHR5cGVvZiByZXNvbHZlZFNyYyA9PSBcInN0cmluZ1wiIHx8IHJlc29sdmVkU3JjIGluc3RhbmNlb2YgQmxvYiB8fCByZXNvbHZlZFNyYyBpbnN0YW5jZW9mIEZpbGUpIHtcblx0XHRjb25zdCBhZG9wdGVkID0gbG9hZEFzQWRvcHRlZChyZXNvbHZlZFNyYywgXCJcIik7XG5cdFx0aWYgKGFkb3B0ZWQpIHtcblx0XHRcdGNvbnN0IGFkZEFkb3B0ZWRTaGVldCA9IChzaGVldCkgPT4ge1xuXHRcdFx0XHRhZGRBZG9wdGVkU2hlZXRUb0VsZW1lbnQoYlRvLCBzaGVldCk7XG5cdFx0XHR9O1xuXHRcdFx0aWYgKGFkb3B0ZWQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG5cdFx0XHRcdGFkb3B0ZWQudGhlbigoc2hlZXQpID0+IHtcblx0XHRcdFx0XHRhZGRBZG9wdGVkU2hlZXQoc2hlZXQpO1xuXHRcdFx0XHRcdGVuc3VyZVNoYWRvd0Nzc0ZhbGxiYWNrKGJUbywgdHlwZW9mIHJlc29sdmVkU3JjID09IFwic3RyaW5nXCIgPyByZXNvbHZlZFNyYyA6IGNzc1RleHRGb3JBZG9wdGVkU2hlZXQoc2hlZXQpKTtcblx0XHRcdFx0fSkuY2F0Y2goKGUpID0+IHtcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oXCJFcnJvciBsb2FkaW5nIGFkb3B0ZWQgc3R5bGVzaGVldDpcIiwgZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFkZEFkb3B0ZWRTaGVldChhZG9wdGVkKTtcblx0XHRcdFx0cmV0dXJuIGVuc3VyZVNoYWRvd0Nzc0ZhbGxiYWNrKGJUbywgdHlwZW9mIHJlc29sdmVkU3JjID09IFwic3RyaW5nXCIgPyByZXNvbHZlZFNyYyA6IGNzc1RleHRGb3JBZG9wdGVkU2hlZXQoYWRvcHRlZCkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRjb25zdCBzb3VyY2UgPSB0eXBlb2Ygc3JjID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2Ygc3JjID09IFwib2JqZWN0XCIgPyBzdHlsZUVsZW1lbnRDYWNoZSA6IHN0eWxlQ2FjaGU7XG5cdGNvbnN0IGNhY2hlZCA9IHNvdXJjZS5nZXQoc3JjKTtcblx0bGV0IHN0eWxlRWxlbWVudCA9IGNhY2hlZD8uc3R5bGVFbGVtZW50O1xuXHRsZXQgdmFycyA9IGNhY2hlZD8udmFycztcblx0aWYgKCFjYWNoZWQpIHtcblx0XHRsZXQgc3R5bGVzID0gYGA7XG5cdFx0bGV0IHByb3BzID0gW107XG5cdFx0aWYgKHR5cGVvZiByZXNvbHZlZFNyYyA9PSBcInN0cmluZ1wiKSBzdHlsZXMgPSByZXNvbHZlZFNyYyB8fCBcIlwiO1xuXHRcdGVsc2UgaWYgKHR5cGVvZiByZXNvbHZlZFNyYyA9PSBcIm9iamVjdFwiICYmIHJlc29sdmVkU3JjICE9IG51bGwpIHtcblx0XHRcdGlmIChyZXNvbHZlZFNyYyBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpIHN0eWxlRWxlbWVudCA9IHJlc29sdmVkU3JjO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHN0eWxlcyA9IHR5cGVvZiByZXNvbHZlZFNyYy5jc3MgPT0gXCJzdHJpbmdcIiA/IHJlc29sdmVkU3JjLmNzcyA6IHR5cGVvZiByZXNvbHZlZFNyYyA9PSBcInN0cmluZ1wiID8gcmVzb2x2ZWRTcmMgOiBTdHJpbmcocmVzb2x2ZWRTcmMpO1xuXHRcdFx0XHRwcm9wcyA9IHJlc29sdmVkU3JjPy5wcm9wcyA/PyBwcm9wcztcblx0XHRcdFx0dmFycyA9IHJlc29sdmVkU3JjPy52YXJzID8/IHZhcnM7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICghc3R5bGVFbGVtZW50ICYmIHN0eWxlcykgc3R5bGVFbGVtZW50ID0gbG9hZElubGluZVN0eWxlKHN0eWxlcywgYlRvLCBcInV4LWxheWVyXCIpO1xuXHRcdHNvdXJjZS5zZXQoc3JjLCB7XG5cdFx0XHRjc3M6IHN0eWxlcyxcblx0XHRcdHByb3BzLFxuXHRcdFx0dmFycyxcblx0XHRcdHN0eWxlRWxlbWVudFxuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBzdHlsZUVsZW1lbnQ7XG59O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvYmluZC50c1xudmFyIGlzTGlua2VyTGlrZSA9ICh2YWx1ZSkgPT4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgXCJyZWZcIiBpbiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWU/LnVuYmluZCA9PT0gXCJmdW5jdGlvblwiO1xudmFyIGJpbmRXaXRoID0gKGVsLCBwcm9wLCB2YWx1ZSwgaGFuZGxlcikgPT4ge1xuXHRjb25zdCBsaW5rZXIgPSBpc0xpbmtlckxpa2UodmFsdWUpID8gdmFsdWUgOiBudWxsO1xuXHRpZiAobGlua2VyKSB7XG5cdFx0bGlua2VyLmJpbmQ/LigpO1xuXHRcdHZhbHVlID0gbGlua2VyLnJlZjtcblx0fVxuXHRoYW5kbGVyPy4oZWwsIHByb3AsIHZhbHVlKTtcblx0Y29uc3Qgd2VsID0gdG9SZWYoZWwpO1xuXHRjb25zdCB3diA9IHRvUmVmKHZhbHVlKTtcblx0Y29uc3QgdW4gPSBhZmZlY3RlZD8uKFt2YWx1ZSwgXCJ2YWx1ZVwiXSwgKGN1cnIpID0+IHtcblx0XHRjb25zdCBlbGVtZW50UmVmID0gZGVyZWYod2VsKTtcblx0XHRjb25zdCB2YWx1ZVJlZiA9IGRlcmVmKHd2KTtcblx0XHRjb25zdCB2ID0gJGdldFZhbHVlKHZhbHVlUmVmKSA/PyAkZ2V0VmFsdWUoY3Vycik7XG5cdFx0aGFuZGxlcj8uKGVsZW1lbnRSZWYsIHByb3AsIHYpO1xuXHR9KTtcblx0Y29uc3QgdW5zdWIgPSAoKSA9PiB7XG5cdFx0bGlua2VyPy51bmJpbmQ/LigpO1xuXHRcdHVuPy4oKTtcblx0fTtcblx0YWRkVG9DYWxsQ2hhaW4odmFsdWUsIFN5bWJvbC5kaXNwb3NlLCB1bnN1Yik7XG5cdHJldHVybiB1bnN1Yjtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9BbmltYXRhYmxlLnRzXG52YXIgYW5pbWF0YWJsZUlkID0gMDtcbnZhciBvblNjcm9sbCA9IChvID0ge30pID0+ICh7XG5cdGtpbmQ6IFwic2Nyb2xsXCIsXG5cdC4uLm9cbn0pO1xudmFyIG9uVmlldyA9IChvID0ge30pID0+ICh7XG5cdGtpbmQ6IFwidmlld1wiLFxuXHQuLi5vXG59KTtcbnZhciBBbmltYXRhYmxlVmFsdWUgPSBjbGFzcyB7XG5cdFtBTklNQVRBQkxFX0JSQU5EXSA9IHRydWU7XG5cdGlkID0gYW5pbWF0YWJsZUlkKys7XG5cdCNzdGVwcztcblx0I29wdGlvbnM7XG5cdCNjdXJyZW50O1xuXHQjc3Vic2NyaWJlcnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHQjYXR0YWNobWVudHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHQjcmVzb2x2ZUVsZW1lbnRSZWYodiwgc2VsZikge1xuXHRcdGlmICh2ID09IG51bGwgfHwgdiA9PT0gXCJzZWxmXCIpIHJldHVybiBzZWxmO1xuXHRcdGlmICh2ID09PSBcInJvb3RcIikgcmV0dXJuIHNlbGYub3duZXJEb2N1bWVudC5zY3JvbGxpbmdFbGVtZW50ID8/IHNlbGYub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cdFx0aWYgKHR5cGVvZiB2ID09PSBcIm9iamVjdFwiICYmIFwidmFsdWVcIiBpbiB2ICYmICEodiBpbnN0YW5jZW9mIEVsZW1lbnQpKSByZXR1cm4gdi52YWx1ZSA/PyBzZWxmO1xuXHRcdHJldHVybiB2O1xuXHR9XG5cdCNmaW5kTmVhcmVzdFNjcm9sbGVyKGVsKSB7XG5cdFx0Zm9yIChsZXQgbm9kZSA9IGVsLnBhcmVudEVsZW1lbnQ7IG5vZGU7IG5vZGUgPSBub2RlLnBhcmVudEVsZW1lbnQpIHtcblx0XHRcdGNvbnN0IHMgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xuXHRcdFx0aWYgKC8oYXV0b3xzY3JvbGx8b3ZlcmxheSkvLnRlc3Qocy5vdmVyZmxvdyArIHMub3ZlcmZsb3dYICsgcy5vdmVyZmxvd1kpKSByZXR1cm4gbm9kZTtcblx0XHR9XG5cdFx0cmV0dXJuIGVsLm93bmVyRG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudCA/PyBlbC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblx0fVxuXHQjY3JlYXRlVGltZWxpbmUoZWxlbWVudCwgdHJpZ2dlcikge1xuXHRcdGNvbnN0IHdpbiA9IGVsZW1lbnQub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldyA/PyBnbG9iYWxUaGlzO1xuXHRcdGlmIChpc1Njcm9sbERyaXZlbih0cmlnZ2VyKSkge1xuXHRcdFx0Y29uc3QgU2Nyb2xsVGltZWxpbmVDdG9yID0gd2luLlNjcm9sbFRpbWVsaW5lO1xuXHRcdFx0aWYgKHR5cGVvZiBTY3JvbGxUaW1lbGluZUN0b3IgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIG51bGw7XG5cdFx0XHRyZXR1cm4gbmV3IFNjcm9sbFRpbWVsaW5lQ3Rvcih7XG5cdFx0XHRcdHNvdXJjZTogdHJpZ2dlci5zb3VyY2UgPT09IFwibmVhcmVzdFwiIHx8IHRyaWdnZXIuc291cmNlID09IG51bGwgPyB0aGlzLiNmaW5kTmVhcmVzdFNjcm9sbGVyKGVsZW1lbnQpIDogdGhpcy4jcmVzb2x2ZUVsZW1lbnRSZWYodHJpZ2dlci5zb3VyY2UsIGVsZW1lbnQpLFxuXHRcdFx0XHRheGlzOiB0cmlnZ2VyLmF4aXMgPz8gXCJibG9ja1wiXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0Y29uc3QgVmlld1RpbWVsaW5lQ3RvciA9IHdpbi5WaWV3VGltZWxpbmU7XG5cdFx0aWYgKHR5cGVvZiBWaWV3VGltZWxpbmVDdG9yICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBudWxsO1xuXHRcdHJldHVybiBuZXcgVmlld1RpbWVsaW5lQ3Rvcih7XG5cdFx0XHRzdWJqZWN0OiB0cmlnZ2VyLnN1YmplY3QgPyB0aGlzLiNyZXNvbHZlRWxlbWVudFJlZih0cmlnZ2VyLnN1YmplY3QsIGVsZW1lbnQpIDogZWxlbWVudCxcblx0XHRcdGF4aXM6IHRyaWdnZXIuYXhpcyA/PyBcImJsb2NrXCIsXG5cdFx0XHRpbnNldDogdHJpZ2dlci5pbnNldFxuXHRcdH0pO1xuXHR9XG5cdCNzdGFydFRpbWVsaW5lRHJpdmVuKGVsZW1lbnQsIGF0dGFjaG1lbnQsIHBsYW4sIHRyaWdnZXIpIHtcblx0XHRjb25zdCB0aW1lbGluZSA9IHRoaXMuI2NyZWF0ZVRpbWVsaW5lKGVsZW1lbnQsIHRyaWdnZXIpO1xuXHRcdGlmICghdGltZWxpbmUpIHJldHVybiB0aGlzLiNzdGFydFRpbWVsaW5lRmFsbGJhY2soZWxlbWVudCwgYXR0YWNobWVudCwgcGxhbiwgdHJpZ2dlcik7XG5cdFx0Y29uc3QgdGltaW5nID0gdGhpcy4jYnVpbGRUaW1pbmcoKTtcblx0XHRjb25zdCBhbmltYXRpb24gPSBlbGVtZW50LmFuaW1hdGUodGhpcy4jYnVpbGRLZXlmcmFtZXMocGxhbiksIHtcblx0XHRcdC4uLnRpbWluZyxcblx0XHRcdGR1cmF0aW9uOiBcImF1dG9cIixcblx0XHRcdGRlbGF5OiAwLFxuXHRcdFx0ZW5kRGVsYXk6IDAsXG5cdFx0XHRpdGVyYXRpb25zOiAxLFxuXHRcdFx0ZmlsbDogdGhpcy4jb3B0aW9ucy5maWxsID8/IFwiYm90aFwiLFxuXHRcdFx0dGltZWxpbmVcblx0XHR9KTtcblx0XHRpZiAodHJpZ2dlci5yYW5nZVN0YXJ0KSBhbmltYXRpb24ucmFuZ2VTdGFydCA9IHRyaWdnZXIucmFuZ2VTdGFydDtcblx0XHRpZiAodHJpZ2dlci5yYW5nZUVuZCkgYW5pbWF0aW9uLnJhbmdlRW5kID0gdHJpZ2dlci5yYW5nZUVuZDtcblx0XHRhdHRhY2htZW50LmFuaW1hdGlvbiA9IGFuaW1hdGlvbjtcblx0XHRyZXR1cm4gKCkgPT4gYW5pbWF0aW9uLmNhbmNlbCgpO1xuXHR9XG5cdGNvbnN0cnVjdG9yKHN0ZXBzLCBvcHRpb25zID0ge30pIHtcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkoc3RlcHMpIHx8IHN0ZXBzLmxlbmd0aCA8IDIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhbmltYXRhYmxlKCkgZXhwZWN0cyBhdCBsZWFzdCAyIHN0ZXBzXCIpO1xuXHRcdHRoaXMuI3N0ZXBzID0gc3RlcHM7XG5cdFx0dGhpcy4jb3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0dGhpcy4jY3VycmVudCA9IHRoaXMuI3Jlc29sdmVTdGVwKHN0ZXBzWzBdKTtcblx0fVxuXHQjc3RhcnRUaW1lbGluZUZhbGxiYWNrKGVsZW1lbnQsIGF0dGFjaG1lbnQsIHBsYW4sIHRyaWdnZXIpIHtcblx0XHRjb25zdCBEVVJBVElPTiA9IDFlNDtcblx0XHRjb25zdCBhbmltYXRpb24gPSBlbGVtZW50LmFuaW1hdGUodGhpcy4jYnVpbGRLZXlmcmFtZXMocGxhbiksIHtcblx0XHRcdC4uLnRoaXMuI2J1aWxkVGltaW5nKCksXG5cdFx0XHRkdXJhdGlvbjogRFVSQVRJT04sXG5cdFx0XHRkZWxheTogMCxcblx0XHRcdGl0ZXJhdGlvbnM6IDEsXG5cdFx0XHRmaWxsOiBcImJvdGhcIlxuXHRcdH0pO1xuXHRcdGFuaW1hdGlvbi5wYXVzZSgpO1xuXHRcdGF0dGFjaG1lbnQuYW5pbWF0aW9uID0gYW5pbWF0aW9uO1xuXHRcdGNvbnN0IHNjcm9sbGVyID0gaXNTY3JvbGxEcml2ZW4odHJpZ2dlcikgPyB0cmlnZ2VyLnNvdXJjZSA9PT0gXCJuZWFyZXN0XCIgfHwgdHJpZ2dlci5zb3VyY2UgPT0gbnVsbCA/IHRoaXMuI2ZpbmROZWFyZXN0U2Nyb2xsZXIoZWxlbWVudCkgOiB0aGlzLiNyZXNvbHZlRWxlbWVudFJlZih0cmlnZ2VyLnNvdXJjZSwgZWxlbWVudCkgOiB0aGlzLiNmaW5kTmVhcmVzdFNjcm9sbGVyKGVsZW1lbnQpO1xuXHRcdGxldCByYWZJZCA9IDA7XG5cdFx0Y29uc3QgY29tcHV0ZVByb2dyZXNzID0gKCkgPT4ge1xuXHRcdFx0aWYgKGlzVmlld0RyaXZlbih0cmlnZ2VyKSkge1xuXHRcdFx0XHRjb25zdCB2cCA9IHNjcm9sbGVyID09PSBkb2N1bWVudC5zY3JvbGxpbmdFbGVtZW50ID8ge1xuXHRcdFx0XHRcdHRvcDogMCxcblx0XHRcdFx0XHRoZWlnaHQ6IGlubmVySGVpZ2h0XG5cdFx0XHRcdH0gOiBzY3JvbGxlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRcdFx0Y29uc3QgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHRcdGNvbnN0IHRvdGFsID0gdnAuaGVpZ2h0ICsgcmVjdC5oZWlnaHQ7XG5cdFx0XHRcdHJldHVybiBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCAodnAudG9wICsgdnAuaGVpZ2h0IC0gcmVjdC50b3ApIC8gdG90YWwpKTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IGVsID0gc2Nyb2xsZXI7XG5cdFx0XHRjb25zdCBtYXggPSBlbC5zY3JvbGxIZWlnaHQgLSBlbC5jbGllbnRIZWlnaHQ7XG5cdFx0XHRyZXR1cm4gbWF4ID4gMCA/IGVsLnNjcm9sbFRvcCAvIG1heCA6IDA7XG5cdFx0fTtcblx0XHRjb25zdCBvblNjcm9sbCA9ICgpID0+IHtcblx0XHRcdGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZklkKTtcblx0XHRcdHJhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcblx0XHRcdFx0YW5pbWF0aW9uLmN1cnJlbnRUaW1lID0gY29tcHV0ZVByb2dyZXNzKCkgKiBEVVJBVElPTjtcblx0XHRcdH0pO1xuXHRcdH07XG5cdFx0Y29uc3QgbGlzdGVuVGFyZ2V0ID0gc2Nyb2xsZXIgPT09IGRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQgPyB3aW5kb3cgOiBzY3JvbGxlcjtcblx0XHRsaXN0ZW5UYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBvblNjcm9sbCwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuXHRcdG9uU2Nyb2xsKCk7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZklkKTtcblx0XHRcdGxpc3RlblRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIG9uU2Nyb2xsKTtcblx0XHRcdGFuaW1hdGlvbi5jYW5jZWwoKTtcblx0XHR9O1xuXHR9XG5cdGdldCB2YWx1ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy4jY3VycmVudDtcblx0fVxuXHRzZXQgdmFsdWUobmV4dCkge1xuXHRcdHRoaXMuI2N1cnJlbnQgPSBuZXh0O1xuXHRcdGZvciAoY29uc3QgY2Igb2YgdGhpcy4jc3Vic2NyaWJlcnMpIGNiKG5leHQpO1xuXHR9XG5cdHZhbHVlT2YoKSB7XG5cdFx0cmV0dXJuIHRoaXMuI2N1cnJlbnQ7XG5cdH1cblx0dG9TdHJpbmcoKSB7XG5cdFx0Y29uc3QgdiA9IHRoaXMuI2N1cnJlbnQ7XG5cdFx0cmV0dXJuIHYgPT0gbnVsbCA/IFwiXCIgOiBTdHJpbmcodik7XG5cdH1cblx0W1N5bWJvbC50b1ByaW1pdGl2ZV0oaGludCkge1xuXHRcdGlmIChoaW50ID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRjb25zdCBuID0gTnVtYmVyKHRoaXMuI2N1cnJlbnQpO1xuXHRcdFx0cmV0dXJuIE51bWJlci5pc0Zpbml0ZShuKSA/IG4gOiAwO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy50b1N0cmluZygpO1xuXHR9XG5cdHN1YnNjcmliZShjYikge1xuXHRcdHRoaXMuI3N1YnNjcmliZXJzLmFkZChjYik7XG5cdFx0cmV0dXJuICgpID0+IHRoaXMuI3N1YnNjcmliZXJzLmRlbGV0ZShjYik7XG5cdH1cblx0Z2V0IG9wdGlvbnMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuI29wdGlvbnM7XG5cdH1cblx0Z2V0IHN0ZXBzKCkge1xuXHRcdHJldHVybiB0aGlzLiNzdGVwcztcblx0fVxuXHQjcmVzb2x2ZVN0ZXAoc3RlcCkge1xuXHRcdGlmIChzdGVwICE9IG51bGwgJiYgdHlwZW9mIHN0ZXAgPT09IFwib2JqZWN0XCIgJiYgXCJ2YWx1ZVwiIGluIHN0ZXApIHJldHVybiBzdGVwLnZhbHVlO1xuXHRcdHJldHVybiBzdGVwO1xuXHR9XG5cdCNidWlsZEtleWZyYW1lcyhwbGFuKSB7XG5cdFx0Y29uc3Qgc3RlcHMgPSB0aGlzLiNzdGVwcy5tYXAoKHMpID0+IHRoaXMuI3Jlc29sdmVTdGVwKHMpKTtcblx0XHRjb25zdCBjb3VudCA9IHN0ZXBzLmxlbmd0aDtcblx0XHRjb25zdCBvZmZzZXRzID0gdGhpcy4jb3B0aW9ucy5vZmZzZXRzO1xuXHRcdGNvbnN0IGVhc2luZyA9IHRoaXMuI29wdGlvbnMuZWFzaW5nO1xuXHRcdHJldHVybiBzdGVwcy5tYXAoKHJhdywgaSkgPT4ge1xuXHRcdFx0Y29uc3QgZnJhbWUgPSB7IG9mZnNldDogb2Zmc2V0cz8uW2ldID8/IChjb3VudCA+IDEgPyBpIC8gKGNvdW50IC0gMSkgOiAwKSB9O1xuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoZWFzaW5nKSkge1xuXHRcdFx0XHRpZiAoZWFzaW5nW2ldKSBmcmFtZS5lYXNpbmcgPSBlYXNpbmdbaV07XG5cdFx0XHR9XG5cdFx0XHRsZXQgdmFsdWUgPSByYXc7XG5cdFx0XHRpZiAocGxhbi5tb2RlID09PSBcInByb3BlcnR5XCIgJiYgcGxhbi51bml0ICE9IG51bGwgJiYgdHlwZW9mIHJhdyA9PT0gXCJudW1iZXJcIikgdmFsdWUgPSBgJHtyYXd9JHtwbGFuLnVuaXR9YDtcblx0XHRcdGlmIChwbGFuLm1vZGUgPT09IFwiY3VzdG9tLXByb3BlcnR5XCIgJiYgdHlwZW9mIHJhdyAhPT0gXCJzdHJpbmdcIikgdmFsdWUgPSBTdHJpbmcocmF3KTtcblx0XHRcdGZyYW1lW3BsYW4udGFyZ2V0XSA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIGZyYW1lO1xuXHRcdH0pO1xuXHR9XG5cdCNidWlsZFRpbWluZygpIHtcblx0XHRjb25zdCBvID0gdGhpcy4jb3B0aW9ucztcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZHVyYXRpb246IHBhcnNlVGltZShvLmR1cmF0aW9uLCAzMDApLFxuXHRcdFx0ZGVsYXk6IHBhcnNlVGltZShvLmRlbGF5LCAwKSxcblx0XHRcdGVuZERlbGF5OiBvLmVuZERlbGF5ID8/IDAsXG5cdFx0XHRpdGVyYXRpb25zOiBub3JtYWxpemVJdGVyYXRpb25zKG8uaXRlcmF0aW9ucyksXG5cdFx0XHRkaXJlY3Rpb246IG8uZGlyZWN0aW9uID8/IFwibm9ybWFsXCIsXG5cdFx0XHRmaWxsOiBvLmZpbGwgPz8gXCJib3RoXCIsXG5cdFx0XHRjb21wb3NpdGU6IG8uY29tcG9zaXRlLFxuXHRcdFx0ZWFzaW5nOiBBcnJheS5pc0FycmF5KG8uZWFzaW5nKSA/IFwibGluZWFyXCIgOiBvLmVhc2luZyA/PyBcImxpbmVhclwiXG5cdFx0fTtcblx0fVxuXHRhdHRhY2goZWxlbWVudCwgcGxhbikge1xuXHRcdGNvbnN0IGF0dGFjaG1lbnQgPSB7XG5cdFx0XHRlbGVtZW50LFxuXHRcdFx0YW5pbWF0aW9uOiBudWxsLFxuXHRcdFx0Y2xlYW51cDogKCkgPT4ge31cblx0XHR9O1xuXHRcdGNvbnN0IHRyaWdnZXIgPSB0aGlzLiNvcHRpb25zLnRyaWdnZXIgPz8gXCJtb3VudFwiO1xuXHRcdGxldCBpbm5lcjtcblx0XHRpZiAoaXNTY3JvbGxEcml2ZW4odHJpZ2dlcikgfHwgaXNWaWV3RHJpdmVuKHRyaWdnZXIpKSBpbm5lciA9IHRoaXMuI3N0YXJ0VGltZWxpbmVEcml2ZW4oZWxlbWVudCwgYXR0YWNobWVudCwgcGxhbiwgdHJpZ2dlcik7XG5cdFx0ZWxzZSB7XG5cdFx0XHRjb25zdCBzdGFydCA9ICgpID0+IHtcblx0XHRcdFx0YXR0YWNobWVudC5hbmltYXRpb24/LmNhbmNlbCgpO1xuXHRcdFx0XHRjb25zdCBhbmltYXRpb24gPSBlbGVtZW50LmFuaW1hdGUodGhpcy4jYnVpbGRLZXlmcmFtZXMocGxhbiksIHRoaXMuI2J1aWxkVGltaW5nKCkpO1xuXHRcdFx0XHRhdHRhY2htZW50LmFuaW1hdGlvbiA9IGFuaW1hdGlvbjtcblx0XHRcdFx0dGhpcy4jdHJhY2tQcm9ncmVzcyhhbmltYXRpb24sIHBsYW4pO1xuXHRcdFx0XHRyZXR1cm4gYW5pbWF0aW9uO1xuXHRcdFx0fTtcblx0XHRcdGlubmVyID0gdGhpcy4jd2lyZVRyaWdnZXIoZWxlbWVudCwgYXR0YWNobWVudCwgc3RhcnQpO1xuXHRcdH1cblx0XHR0aGlzLiNhdHRhY2htZW50cy5hZGQoYXR0YWNobWVudCk7XG5cdFx0YXR0YWNobWVudC5jbGVhbnVwID0gKCkgPT4ge1xuXHRcdFx0aW5uZXIoKTtcblx0XHRcdHRoaXMuI2F0dGFjaG1lbnRzLmRlbGV0ZShhdHRhY2htZW50KTtcblx0XHR9O1xuXHRcdHJldHVybiBhdHRhY2htZW50LmNsZWFudXA7XG5cdH1cblx0I3RyYWNrUHJvZ3Jlc3MoYW5pbWF0aW9uLCBwbGFuKSB7XG5cdFx0YW5pbWF0aW9uLmZpbmlzaGVkLnRoZW4oKCkgPT4ge1xuXHRcdFx0Y29uc3QgbGFzdCA9IHRoaXMuI3Jlc29sdmVTdGVwKHRoaXMuI3N0ZXBzW3RoaXMuI3N0ZXBzLmxlbmd0aCAtIDFdKTtcblx0XHRcdHRoaXMudmFsdWUgPSBsYXN0O1xuXHRcdH0pLmNhdGNoKCgpID0+IHt9KTtcblx0fVxuXHQjd2lyZVRyaWdnZXIoZWxlbWVudCwgYXR0YWNobWVudCwgc3RhcnQpIHtcblx0XHRjb25zdCB0cmlnZ2VyID0gdGhpcy4jb3B0aW9ucy50cmlnZ2VyID8/IFwibW91bnRcIjtcblx0XHRjb25zdCByZXZlcnNlT25FeGl0ID0gdGhpcy4jb3B0aW9ucy5yZXZlcnNlT25FeGl0ID8/IHRydWU7XG5cdFx0Y29uc3QgcGxheUZvcndhcmQgPSAoKSA9PiB7XG5cdFx0XHRpZiAoIWF0dGFjaG1lbnQuYW5pbWF0aW9uIHx8IGF0dGFjaG1lbnQuYW5pbWF0aW9uLnBsYXlTdGF0ZSA9PT0gXCJpZGxlXCIpIHN0YXJ0KCk7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0YXR0YWNobWVudC5hbmltYXRpb24ucGxheWJhY2tSYXRlID0gTWF0aC5hYnMoYXR0YWNobWVudC5hbmltYXRpb24ucGxheWJhY2tSYXRlIHx8IDEpO1xuXHRcdFx0XHRhdHRhY2htZW50LmFuaW1hdGlvbi5wbGF5KCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRjb25zdCBwbGF5QmFja3dhcmQgPSAoKSA9PiB7XG5cdFx0XHRpZiAoIWF0dGFjaG1lbnQuYW5pbWF0aW9uKSByZXR1cm47XG5cdFx0XHRhdHRhY2htZW50LmFuaW1hdGlvbi5yZXZlcnNlKCk7XG5cdFx0fTtcblx0XHRpZiAodHJpZ2dlciA9PT0gXCJtb3VudFwiKSB7XG5cdFx0XHRzdGFydCgpO1xuXHRcdFx0cmV0dXJuICgpID0+IHt9O1xuXHRcdH1cblx0XHRpZiAodHJpZ2dlciA9PT0gXCJtYW51YWxcIikgcmV0dXJuICgpID0+IHt9O1xuXHRcdGlmICh0cmlnZ2VyID09PSBcImhvdmVyXCIgfHwgdHJpZ2dlciA9PT0gXCJmb2N1c1wiKSB7XG5cdFx0XHRjb25zdCBlbnRlciA9IHRyaWdnZXIgPT09IFwiaG92ZXJcIiA/IFwicG9pbnRlcmVudGVyXCIgOiBcImZvY3VzaW5cIjtcblx0XHRcdGNvbnN0IGxlYXZlID0gdHJpZ2dlciA9PT0gXCJob3ZlclwiID8gXCJwb2ludGVybGVhdmVcIiA6IFwiZm9jdXNvdXRcIjtcblx0XHRcdGNvbnN0IG9uRW50ZXIgPSAoKSA9PiBwbGF5Rm9yd2FyZCgpO1xuXHRcdFx0Y29uc3Qgb25MZWF2ZSA9ICgpID0+IHtcblx0XHRcdFx0aWYgKHJldmVyc2VPbkV4aXQpIHBsYXlCYWNrd2FyZCgpO1xuXHRcdFx0fTtcblx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihlbnRlciwgb25FbnRlcik7XG5cdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIobGVhdmUsIG9uTGVhdmUpO1xuXHRcdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGVudGVyLCBvbkVudGVyKTtcblx0XHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGxlYXZlLCBvbkxlYXZlKTtcblx0XHRcdH07XG5cdFx0fVxuXHRcdGlmICh0cmlnZ2VyID09PSBcImNsaWNrXCIpIHtcblx0XHRcdGxldCBmb3J3YXJkID0gdHJ1ZTtcblx0XHRcdGNvbnN0IG9uQ2xpY2sgPSAoKSA9PiB7XG5cdFx0XHRcdGZvcndhcmQgPyBwbGF5Rm9yd2FyZCgpIDogcGxheUJhY2t3YXJkKCk7XG5cdFx0XHRcdGZvcndhcmQgPSAhZm9yd2FyZDtcblx0XHRcdH07XG5cdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBvbkNsaWNrKTtcblx0XHRcdHJldHVybiAoKSA9PiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBvbkNsaWNrKTtcblx0XHR9XG5cdFx0aWYgKHRyaWdnZXIgPT09IFwidmlzaWJsZVwiKSB7XG5cdFx0XHRpZiAodHlwZW9mIEludGVyc2VjdGlvbk9ic2VydmVyICE9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0c3RhcnQoKTtcblx0XHRcdFx0cmV0dXJuICgpID0+IHt9O1xuXHRcdFx0fVxuXHRcdFx0Y29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKGVudHJpZXMpID0+IHtcblx0XHRcdFx0Zm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSBpZiAoZW50cnkuaXNJbnRlcnNlY3RpbmcpIHBsYXlGb3J3YXJkKCk7XG5cdFx0XHRcdGVsc2UgaWYgKHJldmVyc2VPbkV4aXQgJiYgYXR0YWNobWVudC5hbmltYXRpb24pIHBsYXlCYWNrd2FyZCgpO1xuXHRcdFx0fSwgdGhpcy4jb3B0aW9ucy5pbnRlcnNlY3Rpb24pO1xuXHRcdFx0b2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50KTtcblx0XHRcdHJldHVybiAoKSA9PiBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cdFx0fVxuXHRcdGlmICh0cmlnZ2VyICE9IG51bGwgJiYgdHlwZW9mIHRyaWdnZXIgPT09IFwib2JqZWN0XCIgJiYgXCJ2YWx1ZVwiIGluIHRyaWdnZXIpIHtcblx0XHRcdGNvbnN0IGFwcGx5ID0gKHYpID0+IHYgPyBwbGF5Rm9yd2FyZCgpIDogcGxheUJhY2t3YXJkKCk7XG5cdFx0XHRhcHBseSh0cmlnZ2VyLnZhbHVlKTtcblx0XHRcdGNvbnN0IHVuc3Vic2NyaWJlID0gdHlwZW9mIHRyaWdnZXIuc3Vic2NyaWJlID09PSBcImZ1bmN0aW9uXCIgPyB0cmlnZ2VyLnN1YnNjcmliZShhcHBseSkgOiBudWxsO1xuXHRcdFx0cmV0dXJuICgpID0+IHVuc3Vic2NyaWJlPy4oKTtcblx0XHR9XG5cdFx0aWYgKHRyaWdnZXIgPT09IFwic2hvd1wiIHx8IHRyaWdnZXIgPT09IFwiaGlkZVwiIHx8IHRyaWdnZXIgPT09IFwicmVtb3ZlXCIpIHtcblx0XHRcdGNvbnN0IGV2ZW50TmFtZSA9IHRyaWdnZXIgPT09IFwic2hvd1wiID8gXCJ1Mi1iZWZvcmUtc2hvd1wiIDogdHJpZ2dlciA9PT0gXCJoaWRlXCIgPyBcInUyLWJlZm9yZS1oaWRlXCIgOiBcInUyLWJlZm9yZS1yZW1vdmVcIjtcblx0XHRcdGNvbnN0IGF0dHIgPSB0cmlnZ2VyID09PSBcInJlbW92ZVwiID8gXCJkYXRhLXJlbW92aW5nXCIgOiBcImRhdGEtaGlkZGVuXCI7XG5cdFx0XHRjb25zdCB3YW50UHJlc2VudCA9IHRyaWdnZXIgIT09IFwic2hvd1wiO1xuXHRcdFx0Y29uc3Qgb25FdmVudCA9IChldikgPT4ge1xuXHRcdFx0XHRpZiAoZXYuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xuXHRcdFx0XHRwbGF5Rm9yd2FyZCgpO1xuXHRcdFx0fTtcblx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIG9uRXZlbnQpO1xuXHRcdFx0Y29uc3QgbW8gPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG5cdFx0XHRcdGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZShhdHRyKSA9PT0gd2FudFByZXNlbnQpIHBsYXlGb3J3YXJkKCk7XG5cdFx0XHRcdGVsc2UgaWYgKHJldmVyc2VPbkV4aXQgJiYgYXR0YWNobWVudC5hbmltYXRpb24pIHBsYXlCYWNrd2FyZCgpO1xuXHRcdFx0fSk7XG5cdFx0XHRtby5vYnNlcnZlKGVsZW1lbnQsIHtcblx0XHRcdFx0YXR0cmlidXRlczogdHJ1ZSxcblx0XHRcdFx0YXR0cmlidXRlRmlsdGVyOiBbYXR0cl1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgb25FdmVudCk7XG5cdFx0XHRcdG1vLmRpc2Nvbm5lY3QoKTtcblx0XHRcdH07XG5cdFx0fVxuXHRcdHJldHVybiAoKSA9PiB7fTtcblx0fVxuXHQjZWFjaChmbikge1xuXHRcdGZvciAoY29uc3QgYXQgb2YgdGhpcy4jYXR0YWNobWVudHMpIGlmIChhdC5hbmltYXRpb24pIGZuKGF0LmFuaW1hdGlvbik7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0cGxheSgpIHtcblx0XHRyZXR1cm4gdGhpcy4jZWFjaCgoYSkgPT4gYS5wbGF5KCkpO1xuXHR9XG5cdHBhdXNlKCkge1xuXHRcdHJldHVybiB0aGlzLiNlYWNoKChhKSA9PiBhLnBhdXNlKCkpO1xuXHR9XG5cdHJldmVyc2UoKSB7XG5cdFx0cmV0dXJuIHRoaXMuI2VhY2goKGEpID0+IGEucmV2ZXJzZSgpKTtcblx0fVxuXHRjYW5jZWwoKSB7XG5cdFx0cmV0dXJuIHRoaXMuI2VhY2goKGEpID0+IGEuY2FuY2VsKCkpO1xuXHR9XG5cdGZpbmlzaCgpIHtcblx0XHRyZXR1cm4gdGhpcy4jZWFjaCgoYSkgPT4gYS5maW5pc2goKSk7XG5cdH1cblx0c2V0IHBsYXliYWNrUmF0ZShyYXRlKSB7XG5cdFx0dGhpcy4jZWFjaCgoYSkgPT4ge1xuXHRcdFx0YS5wbGF5YmFja1JhdGUgPSByYXRlO1xuXHRcdH0pO1xuXHR9XG5cdGdldCBmaW5pc2hlZCgpIHtcblx0XHRjb25zdCBsaXN0ID0gW107XG5cdFx0dGhpcy4jZWFjaCgoYSkgPT4gbGlzdC5wdXNoKGEuZmluaXNoZWQuY2F0Y2goKCkgPT4ge30pKSk7XG5cdFx0cmV0dXJuIFByb21pc2UuYWxsKGxpc3QpLnRoZW4oKCkgPT4ge30pO1xuXHR9XG59O1xudmFyIGFuaW1hdGFibGUgPSAoc3RlcHMsIG9wdGlvbnMpID0+IG5ldyBBbmltYXRhYmxlVmFsdWUoc3RlcHMsIG9wdGlvbnMpO1xudmFyIGlzQW5pbWF0YWJsZVZhbHVlID0gKHZhbHVlKSA9PiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZVtBTklNQVRBQkxFX0JSQU5EXSA9PT0gdHJ1ZTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL1N0eWxlcy50c1xudmFyIHN0eWxlVGVtcGxhdGVJZCA9IDA7XG52YXIgcmVhZFJlYWN0aXZlTnVtYmVyID0gKHNsb3QpID0+IHtcblx0Y29uc3QgY3VycmVudCA9IHNsb3QudmFsdWU/LnZhbHVlO1xuXHRjb25zdCBudW1iZXIgPSB0eXBlb2YgY3VycmVudCA9PT0gXCJudW1iZXJcIiA/IGN1cnJlbnQgOiBOdW1iZXIoY3VycmVudCk7XG5cdGlmICghTnVtYmVyLmlzRmluaXRlKG51bWJlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoYFJlYWN0aXZlIENTUyB2YWx1ZSBcIiR7U3RyaW5nKGN1cnJlbnQpfVwiIGlzIG5vdCBmaW5pdGVgKTtcblx0cmV0dXJuIG51bWJlcjtcbn07XG52YXIgZ2V0UmVhY3RpdmVJbml0aWFsTnVtYmVyID0gKHZhbHVlKSA9PiB7XG5cdGNvbnN0IG51bWJlciA9IE51bWJlcih2YWx1ZT8udmFsdWUpO1xuXHRyZXR1cm4gTnVtYmVyLmlzRmluaXRlKG51bWJlcikgPyBudW1iZXIgOiAwO1xufTtcbnZhciByZXBsYWNlVHlwZWRNYXJrZXJzID0gKGNzc1ZhbHVlLCBzbG90cykgPT4ge1xuXHRsZXQgcmVzdWx0ID0gY3NzVmFsdWU7XG5cdGZvciAoY29uc3Qgc2xvdCBvZiBzbG90cykgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UobmV3IFJlZ0V4cChgdmFyXFxcXChcXFxccyoke2VzY2FwZVJlZ0V4cChzbG90Lm1hcmtlcil9XFxcXHMqXFxcXClgLCBcImdcIiksIFN0cmluZyhzbG90LnZhbHVlKSk7XG5cdHJldHVybiByZXN1bHQ7XG59O1xudmFyIGlzRGlyZWN0U2xvdFZhbHVlID0gKGNzc1ZhbHVlLCBtYXJrZXIpID0+IHtcblx0Y29uc3QgZXNjYXBlZE1hcmtlciA9IGVzY2FwZVJlZ0V4cChtYXJrZXIpO1xuXHRyZXR1cm4gbmV3IFJlZ0V4cChgXnZhclxcXFwoXFxcXHMqJHtlc2NhcGVkTWFya2VyfVxcXFxzKlxcXFwpJGApLnRlc3QoY3NzVmFsdWUudHJpbSgpKTtcbn07XG52YXIgc2VyaWFsaXplQW5pbWF0YWJsZUNzc1ZhbHVlID0gKHJhdywgdW5pdCkgPT4ge1xuXHRsZXQgdmFsdWUgPSByYXc7XG5cdGlmICh2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiBcInZhbHVlXCIgaW4gdmFsdWUgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIEVsZW1lbnQpKSB2YWx1ZSA9IHZhbHVlLnZhbHVlO1xuXHRpZiAodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSA9PT0gXCJcIikgcmV0dXJuIHVuaXQgPyBgMCR7dW5pdH1gIDogXCIwXCI7XG5cdGlmICh1bml0ICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiKSByZXR1cm4gYCR7dmFsdWV9JHt1bml0fWA7XG5cdHJldHVybiBTdHJpbmcodmFsdWUpO1xufTtcbnZhciBpc0RpcmVjdFNsb3RVbml0UHJvZHVjdCA9IChjc3NWYWx1ZSwgbWFya2VyLCB1bml0KSA9PiB7XG5cdGlmICghdW5pdCkgcmV0dXJuIGZhbHNlO1xuXHRjb25zdCBlc2NhcGVkTWFya2VyID0gZXNjYXBlUmVnRXhwKG1hcmtlcik7XG5cdGNvbnN0IGVzY2FwZWRVbml0ID0gZXNjYXBlUmVnRXhwKHVuaXQpO1xuXHRyZXR1cm4gbmV3IFJlZ0V4cChgXmNhbGNcXFxcKFxcXFxzKnZhclxcXFwoXFxcXHMqJHtlc2NhcGVkTWFya2VyfVxcXFxzKlxcXFwpXFxcXHMqXFxcXCpcXFxccyoxJHtlc2NhcGVkVW5pdH1cXFxccypcXFxcKSRgLCBcImlcIikudGVzdChjc3NWYWx1ZS50cmltKCkpO1xufTtcbnZhciBzZXRQYXJzZWRUeXBlZFZhbHVlID0gKHN0eWxlTWFwLCBDU1NTdHlsZVZhbHVlQ3RvciwgcHJvcGVydHksIGNzc1ZhbHVlKSA9PiB7XG5cdGlmICh0eXBlb2YgQ1NTU3R5bGVWYWx1ZUN0b3I/LnBhcnNlQWxsID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRjb25zdCB2YWx1ZXMgPSBDU1NTdHlsZVZhbHVlQ3Rvci5wYXJzZUFsbChwcm9wZXJ0eSwgY3NzVmFsdWUpO1xuXHRcdHN0eWxlTWFwLnNldChwcm9wZXJ0eSwgLi4udmFsdWVzKTtcblx0XHRyZXR1cm47XG5cdH1cblx0aWYgKHR5cGVvZiBDU1NTdHlsZVZhbHVlQ3Rvcj8ucGFyc2UgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdHN0eWxlTWFwLnNldChwcm9wZXJ0eSwgQ1NTU3R5bGVWYWx1ZUN0b3IucGFyc2UocHJvcGVydHksIGNzc1ZhbHVlKSk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHN0eWxlTWFwLnNldChwcm9wZXJ0eSwgY3NzVmFsdWUpO1xufTtcbnZhciB0b2tlbml6ZU51bWVyaWNDU1MgPSAoc291cmNlKSA9PiB7XG5cdGNvbnN0IHRva2VucyA9IFtdO1xuXHRsZXQgY3Vyc29yID0gMDtcblx0d2hpbGUgKGN1cnNvciA8IHNvdXJjZS5sZW5ndGgpIHtcblx0XHRjb25zdCByZXN0ID0gc291cmNlLnNsaWNlKGN1cnNvcik7XG5cdFx0Y29uc3Qgd2hpdGVzcGFjZSA9IC9eXFxzKy8uZXhlYyhyZXN0KTtcblx0XHRpZiAod2hpdGVzcGFjZSkge1xuXHRcdFx0Y3Vyc29yICs9IHdoaXRlc3BhY2VbMF0ubGVuZ3RoO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGNvbnN0IHZhcmlhYmxlID0gL152YXJcXChcXHMqKC0tW2EtekEtWjAtOV8tXSspXFxzKlxcKS8uZXhlYyhyZXN0KTtcblx0XHRpZiAodmFyaWFibGUpIHtcblx0XHRcdHRva2Vucy5wdXNoKHtcblx0XHRcdFx0a2luZDogXCJ2YXJpYWJsZVwiLFxuXHRcdFx0XHRtYXJrZXI6IHZhcmlhYmxlWzFdXG5cdFx0XHR9KTtcblx0XHRcdGN1cnNvciArPSB2YXJpYWJsZVswXS5sZW5ndGg7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0Y29uc3QgbnVtYmVyID0gL14oPzpcXGQqXFwuXFxkK3xcXGQrXFwuP1xcZCopKD86W2VFXVsrLV0/XFxkKyk/Ly5leGVjKHJlc3QpO1xuXHRcdGlmIChudW1iZXIpIHtcblx0XHRcdGN1cnNvciArPSBudW1iZXJbMF0ubGVuZ3RoO1xuXHRcdFx0Y29uc3QgdW5pdE1hdGNoID0gL14oJXxbYS16QS1aXSspLy5leGVjKHNvdXJjZS5zbGljZShjdXJzb3IpKTtcblx0XHRcdGNvbnN0IHVuaXQgPSB1bml0TWF0Y2g/LlswXSA/PyBudWxsO1xuXHRcdFx0aWYgKHVuaXRNYXRjaCkgY3Vyc29yICs9IHVuaXRNYXRjaFswXS5sZW5ndGg7XG5cdFx0XHR0b2tlbnMucHVzaCh7XG5cdFx0XHRcdGtpbmQ6IFwibnVtYmVyXCIsXG5cdFx0XHRcdHZhbHVlOiBOdW1iZXIobnVtYmVyWzBdKSxcblx0XHRcdFx0dW5pdDogdW5pdCA9PSBudWxsID8gbnVsbCA6IHVuaXQudG9Mb3dlckNhc2UoKVxuXHRcdFx0fSk7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cdFx0Y29uc3QgaWRlbnRpZmllciA9IC9eW2EtekEtWl9dW2EtekEtWjAtOV8tXSovLmV4ZWMocmVzdCk7XG5cdFx0aWYgKGlkZW50aWZpZXIpIHtcblx0XHRcdHRva2Vucy5wdXNoKHtcblx0XHRcdFx0a2luZDogXCJpZGVudGlmaWVyXCIsXG5cdFx0XHRcdHZhbHVlOiBpZGVudGlmaWVyWzBdLnRvTG93ZXJDYXNlKClcblx0XHRcdH0pO1xuXHRcdFx0Y3Vyc29yICs9IGlkZW50aWZpZXJbMF0ubGVuZ3RoO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGNvbnN0IHN5bWJvbCA9IHJlc3RbMF07XG5cdFx0aWYgKHN5bWJvbCA9PT0gXCIrXCIgfHwgc3ltYm9sID09PSBcIi1cIiB8fCBzeW1ib2wgPT09IFwiKlwiIHx8IHN5bWJvbCA9PT0gXCIvXCIgfHwgc3ltYm9sID09PSBcIihcIiB8fCBzeW1ib2wgPT09IFwiKVwiIHx8IHN5bWJvbCA9PT0gXCIsXCIpIHtcblx0XHRcdHRva2Vucy5wdXNoKHtcblx0XHRcdFx0a2luZDogXCJzeW1ib2xcIixcblx0XHRcdFx0dmFsdWU6IHN5bWJvbFxuXHRcdFx0fSk7XG5cdFx0XHRjdXJzb3IrKztcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoYFVuc3VwcG9ydGVkIFR5cGVkIE9NIG51bWVyaWMgdG9rZW4gbmVhciBcIiR7cmVzdH1cImApO1xuXHR9XG5cdHJldHVybiB0b2tlbnM7XG59O1xudmFyIE51bWVyaWNUeXBlZE9NUGFyc2VyID0gY2xhc3Mge1xuXHR0b2tlbnM7XG5cdHdpbjtcblx0cmVhY3RpdmVCeU1hcmtlcjtcblx0dHlwZWRCeU1hcmtlcjtcblx0aW5kZXggPSAwO1xuXHRsZWF2ZXMgPSBbXTtcblx0Y29uc3RydWN0b3IodG9rZW5zLCB3aW4sIHJlYWN0aXZlQnlNYXJrZXIsIHR5cGVkQnlNYXJrZXIpIHtcblx0XHR0aGlzLnRva2VucyA9IHRva2Vucztcblx0XHR0aGlzLndpbiA9IHdpbjtcblx0XHR0aGlzLnJlYWN0aXZlQnlNYXJrZXIgPSByZWFjdGl2ZUJ5TWFya2VyO1xuXHRcdHRoaXMudHlwZWRCeU1hcmtlciA9IHR5cGVkQnlNYXJrZXI7XG5cdH1cblx0cGFyc2UoKSB7XG5cdFx0Y29uc3Qgcm9vdCA9IHRoaXMucGFyc2VTdW0oKTtcblx0XHRpZiAodGhpcy5pbmRleCAhPT0gdGhpcy50b2tlbnMubGVuZ3RoKSB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJVbmV4cGVjdGVkIHRyYWlsaW5nIFR5cGVkIE9NIGV4cHJlc3Npb25cIik7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJvb3QsXG5cdFx0XHRsZWF2ZXM6IHRoaXMubGVhdmVzXG5cdFx0fTtcblx0fVxuXHRjdXJyZW50KCkge1xuXHRcdHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmluZGV4XTtcblx0fVxuXHRjb25zdW1lKCkge1xuXHRcdGNvbnN0IHRva2VuID0gdGhpcy50b2tlbnNbdGhpcy5pbmRleF07XG5cdFx0aWYgKCF0b2tlbikgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiVW5leHBlY3RlZCBlbmQgb2YgVHlwZWQgT00gZXhwcmVzc2lvblwiKTtcblx0XHR0aGlzLmluZGV4Kys7XG5cdFx0cmV0dXJuIHRva2VuO1xuXHR9XG5cdGNvbnN1bWVTeW1ib2woc3ltYm9sKSB7XG5cdFx0Y29uc3QgdG9rZW4gPSB0aGlzLmNvbnN1bWUoKTtcblx0XHRpZiAodG9rZW4ua2luZCAhPT0gXCJzeW1ib2xcIiB8fCB0b2tlbi52YWx1ZSAhPT0gc3ltYm9sKSB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYEV4cGVjdGVkIFwiJHtzeW1ib2x9XCJgKTtcblx0fVxuXHRtYXRjaGVzU3ltYm9sKHN5bWJvbCkge1xuXHRcdGNvbnN0IHRva2VuID0gdGhpcy5jdXJyZW50KCk7XG5cdFx0cmV0dXJuIHRva2VuPy5raW5kID09PSBcInN5bWJvbFwiICYmIHRva2VuLnZhbHVlID09PSBzeW1ib2w7XG5cdH1cblx0Y3JlYXRlTWF0aChuYW1lLCAuLi52YWx1ZXMpIHtcblx0XHRjb25zdCBDb25zdHJ1Y3RvciA9IGdldFdpbmRvd0NvbnN0cnVjdG9yKHRoaXMud2luLCBuYW1lKTtcblx0XHRpZiAodHlwZW9mIENvbnN0cnVjdG9yICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoYCR7bmFtZX0gaXMgbm90IHN1cHBvcnRlZGApO1xuXHRcdHJldHVybiBuZXcgQ29uc3RydWN0b3IoLi4udmFsdWVzKTtcblx0fVxuXHRwYXJzZVN1bSgpIHtcblx0XHRsZXQgdmFsdWUgPSB0aGlzLnBhcnNlUHJvZHVjdCgpO1xuXHRcdHdoaWxlICh0aGlzLm1hdGNoZXNTeW1ib2woXCIrXCIpIHx8IHRoaXMubWF0Y2hlc1N5bWJvbChcIi1cIikpIHtcblx0XHRcdGNvbnN0IG9wZXJhdG9yID0gdGhpcy5jb25zdW1lKCk7XG5cdFx0XHRjb25zdCByaWdodCA9IHRoaXMucGFyc2VQcm9kdWN0KCk7XG5cdFx0XHRpZiAob3BlcmF0b3Iua2luZCAhPT0gXCJzeW1ib2xcIikgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiRXhwZWN0ZWQgYSBzdW0gb3BlcmF0b3JcIik7XG5cdFx0XHRpZiAob3BlcmF0b3IudmFsdWUgPT09IFwiK1wiKSB2YWx1ZSA9IHRoaXMuY3JlYXRlTWF0aChcIkNTU01hdGhTdW1cIiwgdmFsdWUsIHJpZ2h0KTtcblx0XHRcdGVsc2UgdmFsdWUgPSB0aGlzLmNyZWF0ZU1hdGgoXCJDU1NNYXRoU3VtXCIsIHZhbHVlLCB0aGlzLmNyZWF0ZU1hdGgoXCJDU1NNYXRoTmVnYXRlXCIsIHJpZ2h0KSk7XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXHRwYXJzZVByb2R1Y3QoKSB7XG5cdFx0bGV0IHZhbHVlID0gdGhpcy5wYXJzZVVuYXJ5KCk7XG5cdFx0d2hpbGUgKHRoaXMubWF0Y2hlc1N5bWJvbChcIipcIikgfHwgdGhpcy5tYXRjaGVzU3ltYm9sKFwiL1wiKSkge1xuXHRcdFx0Y29uc3Qgb3BlcmF0b3IgPSB0aGlzLmNvbnN1bWUoKTtcblx0XHRcdGNvbnN0IHJpZ2h0ID0gdGhpcy5wYXJzZVVuYXJ5KCk7XG5cdFx0XHRpZiAob3BlcmF0b3Iua2luZCAhPT0gXCJzeW1ib2xcIikgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiRXhwZWN0ZWQgYSBwcm9kdWN0IG9wZXJhdG9yXCIpO1xuXHRcdFx0aWYgKG9wZXJhdG9yLnZhbHVlID09PSBcIipcIikgdmFsdWUgPSB0aGlzLmNyZWF0ZU1hdGgoXCJDU1NNYXRoUHJvZHVjdFwiLCB2YWx1ZSwgcmlnaHQpO1xuXHRcdFx0ZWxzZSB2YWx1ZSA9IHRoaXMuY3JlYXRlTWF0aChcIkNTU01hdGhQcm9kdWN0XCIsIHZhbHVlLCB0aGlzLmNyZWF0ZU1hdGgoXCJDU1NNYXRoSW52ZXJ0XCIsIHJpZ2h0KSk7XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXHRwYXJzZVVuYXJ5KCkge1xuXHRcdGlmICh0aGlzLm1hdGNoZXNTeW1ib2woXCIrXCIpKSB7XG5cdFx0XHR0aGlzLmNvbnN1bWUoKTtcblx0XHRcdHJldHVybiB0aGlzLnBhcnNlVW5hcnkoKTtcblx0XHR9XG5cdFx0aWYgKHRoaXMubWF0Y2hlc1N5bWJvbChcIi1cIikpIHtcblx0XHRcdHRoaXMuY29uc3VtZSgpO1xuXHRcdFx0cmV0dXJuIHRoaXMuY3JlYXRlTWF0aChcIkNTU01hdGhOZWdhdGVcIiwgdGhpcy5wYXJzZVVuYXJ5KCkpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5wYXJzZVByaW1hcnkoKTtcblx0fVxuXHRwYXJzZVByaW1hcnkoKSB7XG5cdFx0Y29uc3QgdG9rZW4gPSB0aGlzLmNvbnN1bWUoKTtcblx0XHRpZiAodG9rZW4ua2luZCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIGNyZWF0ZVR5cGVkVW5pdFZhbHVlKHRoaXMud2luLCB0b2tlbi51bml0ID8/IFwibnVtYmVyXCIsIHRva2VuLnZhbHVlKTtcblx0XHRpZiAodG9rZW4ua2luZCA9PT0gXCJ2YXJpYWJsZVwiKSB7XG5cdFx0XHRjb25zdCByZWFjdGl2ZSA9IHRoaXMucmVhY3RpdmVCeU1hcmtlci5nZXQodG9rZW4ubWFya2VyKTtcblx0XHRcdGlmIChyZWFjdGl2ZSkge1xuXHRcdFx0XHRpZiAodGhpcy5tYXRjaGVzU3ltYm9sKFwiKlwiKSkge1xuXHRcdFx0XHRcdGNvbnN0IGNoZWNrcG9pbnQgPSB0aGlzLmluZGV4O1xuXHRcdFx0XHRcdHRoaXMuY29uc3VtZSgpO1xuXHRcdFx0XHRcdGNvbnN0IHJocyA9IHRoaXMuY3VycmVudCgpO1xuXHRcdFx0XHRcdGlmIChyaHM/LmtpbmQgPT09IFwibnVtYmVyXCIgJiYgcmhzLnZhbHVlID09PSAxICYmIHR5cGVvZiByaHMudW5pdCA9PT0gXCJzdHJpbmdcIiAmJiAoIXJlYWN0aXZlLm11bHRpcGxpZWRCeVVuaXQgfHwgcmVhY3RpdmUubXVsdGlwbGllZEJ5VW5pdCA9PT0gcmhzLnVuaXQudG9Mb3dlckNhc2UoKSkpIHtcblx0XHRcdFx0XHRcdHRoaXMuY29uc3VtZSgpO1xuXHRcdFx0XHRcdFx0Y29uc3QgbGVhZiA9IGNyZWF0ZVR5cGVkVW5pdFZhbHVlKHRoaXMud2luLCByaHMudW5pdC50b0xvd2VyQ2FzZSgpLCByZWFkUmVhY3RpdmVOdW1iZXIocmVhY3RpdmUpKTtcblx0XHRcdFx0XHRcdHRoaXMubGVhdmVzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHRzbG90OiByZWFjdGl2ZSxcblx0XHRcdFx0XHRcdFx0dmFsdWU6IGxlYWZcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGxlYWY7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuaW5kZXggPSBjaGVja3BvaW50O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IGxlYWYgPSBjcmVhdGVUeXBlZFVuaXRWYWx1ZSh0aGlzLndpbiwgXCJudW1iZXJcIiwgcmVhZFJlYWN0aXZlTnVtYmVyKHJlYWN0aXZlKSk7XG5cdFx0XHRcdHRoaXMubGVhdmVzLnB1c2goe1xuXHRcdFx0XHRcdHNsb3Q6IHJlYWN0aXZlLFxuXHRcdFx0XHRcdHZhbHVlOiBsZWFmXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gbGVhZjtcblx0XHRcdH1cblx0XHRcdGNvbnN0IHR5cGVkID0gdGhpcy50eXBlZEJ5TWFya2VyLmdldCh0b2tlbi5tYXJrZXIpO1xuXHRcdFx0aWYgKHR5cGVkKSByZXR1cm4gdHlwZWQudmFsdWU7XG5cdFx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoYFVua25vd24gc3R5bGUgc2xvdCBcIiR7dG9rZW4ubWFya2VyfVwiYCk7XG5cdFx0fVxuXHRcdGlmICh0b2tlbi5raW5kID09PSBcInN5bWJvbFwiICYmIHRva2VuLnZhbHVlID09PSBcIihcIikge1xuXHRcdFx0Y29uc3QgdmFsdWUgPSB0aGlzLnBhcnNlU3VtKCk7XG5cdFx0XHR0aGlzLmNvbnN1bWVTeW1ib2woXCIpXCIpO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH1cblx0XHRpZiAodG9rZW4ua2luZCA9PT0gXCJpZGVudGlmaWVyXCIpIHJldHVybiB0aGlzLnBhcnNlRnVuY3Rpb24odG9rZW4udmFsdWUpO1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihcIkV4cGVjdGVkIGEgVHlwZWQgT00gbnVtZXJpYyB2YWx1ZVwiKTtcblx0fVxuXHRwYXJzZUZ1bmN0aW9uKG5hbWUpIHtcblx0XHR0aGlzLmNvbnN1bWVTeW1ib2woXCIoXCIpO1xuXHRcdGlmIChuYW1lID09PSBcImNhbGNcIikge1xuXHRcdFx0Y29uc3QgdmFsdWUgPSB0aGlzLnBhcnNlU3VtKCk7XG5cdFx0XHR0aGlzLmNvbnN1bWVTeW1ib2woXCIpXCIpO1xuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH1cblx0XHRjb25zdCB2YWx1ZXMgPSBbXTtcblx0XHRpZiAoIXRoaXMubWF0Y2hlc1N5bWJvbChcIilcIikpIHtcblx0XHRcdHZhbHVlcy5wdXNoKHRoaXMucGFyc2VTdW0oKSk7XG5cdFx0XHR3aGlsZSAodGhpcy5tYXRjaGVzU3ltYm9sKFwiLFwiKSkge1xuXHRcdFx0XHR0aGlzLmNvbnN1bWUoKTtcblx0XHRcdFx0dmFsdWVzLnB1c2godGhpcy5wYXJzZVN1bSgpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5jb25zdW1lU3ltYm9sKFwiKVwiKTtcblx0XHRpZiAobmFtZSA9PT0gXCJtaW5cIikge1xuXHRcdFx0aWYgKHZhbHVlcy5sZW5ndGggPT09IDApIHRocm93IG5ldyBTeW50YXhFcnJvcihcIm1pbigpIHJlcXVpcmVzIGEgdmFsdWVcIik7XG5cdFx0XHRyZXR1cm4gdGhpcy5jcmVhdGVNYXRoKFwiQ1NTTWF0aE1pblwiLCAuLi52YWx1ZXMpO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PT0gXCJtYXhcIikge1xuXHRcdFx0aWYgKHZhbHVlcy5sZW5ndGggPT09IDApIHRocm93IG5ldyBTeW50YXhFcnJvcihcIm1heCgpIHJlcXVpcmVzIGEgdmFsdWVcIik7XG5cdFx0XHRyZXR1cm4gdGhpcy5jcmVhdGVNYXRoKFwiQ1NTTWF0aE1heFwiLCAuLi52YWx1ZXMpO1xuXHRcdH1cblx0XHRpZiAobmFtZSA9PT0gXCJjbGFtcFwiKSB7XG5cdFx0XHRpZiAodmFsdWVzLmxlbmd0aCAhPT0gMykgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiY2xhbXAoKSByZXF1aXJlcyB0aHJlZSB2YWx1ZXNcIik7XG5cdFx0XHRyZXR1cm4gdGhpcy5jcmVhdGVNYXRoKFwiQ1NTTWF0aENsYW1wXCIsIHZhbHVlc1swXSwgdmFsdWVzWzFdLCB2YWx1ZXNbMl0pO1xuXHRcdH1cblx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoYFVuc3VwcG9ydGVkIFR5cGVkIE9NIGZ1bmN0aW9uIFwiJHtuYW1lfVwiYCk7XG5cdH1cbn07XG52YXIgYnVpbGROdW1lcmljVHlwZWRPTVRyZWUgPSAoY3NzVmFsdWUsIHdpbiwgcmVhY3RpdmVTbG90cywgdHlwZWRTbG90cykgPT4ge1xuXHRjb25zdCByZWFjdGl2ZUJ5TWFya2VyID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0Y29uc3QgdHlwZWRCeU1hcmtlciA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdGZvciAoY29uc3Qgc2xvdCBvZiByZWFjdGl2ZVNsb3RzKSByZWFjdGl2ZUJ5TWFya2VyLnNldChzbG90Lm1hcmtlciwgc2xvdCk7XG5cdGZvciAoY29uc3Qgc2xvdCBvZiB0eXBlZFNsb3RzKSB0eXBlZEJ5TWFya2VyLnNldChzbG90Lm1hcmtlciwgc2xvdCk7XG5cdHJldHVybiBuZXcgTnVtZXJpY1R5cGVkT01QYXJzZXIodG9rZW5pemVOdW1lcmljQ1NTKGNzc1ZhbHVlKSwgd2luLCByZWFjdGl2ZUJ5TWFya2VyLCB0eXBlZEJ5TWFya2VyKS5wYXJzZSgpO1xufTtcbnZhciBpc1RyYW5zZm9ybVN0eWxlUHJvcGVydHkgPSAocHJvcGVydHkpID0+IHtcblx0cmV0dXJuIHByb3BlcnR5LnRyaW0oKS50b0xvd2VyQ2FzZSgpID09PSBcInRyYW5zZm9ybVwiO1xufTtcbnZhciBidWlsZFRyYW5zZm9ybVR5cGVkT01UcmVlID0gKGNzc1ZhbHVlLCB3aW4sIHJlYWN0aXZlU2xvdHMsIHR5cGVkU2xvdHMpID0+IHtcblx0Y29uc3QgdG9rZW5zID0gdG9rZW5pemVOdW1lcmljQ1NTKGNzc1ZhbHVlKTtcblx0Y29uc3QgbGVhdmVzID0gW107XG5cdGNvbnN0IGNvbXBvbmVudHMgPSBbXTtcblx0Y29uc3QgcmVhY3RpdmVCeU1hcmtlciA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdGNvbnN0IHR5cGVkQnlNYXJrZXIgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRmb3IgKGNvbnN0IHNsb3Qgb2YgcmVhY3RpdmVTbG90cykgcmVhY3RpdmVCeU1hcmtlci5zZXQoc2xvdC5tYXJrZXIsIHNsb3QpO1xuXHRmb3IgKGNvbnN0IHNsb3Qgb2YgdHlwZWRTbG90cykgdHlwZWRCeU1hcmtlci5zZXQoc2xvdC5tYXJrZXIsIHNsb3QpO1xuXHRjb25zdCB6ZXJvUHggPSAoKSA9PiBjcmVhdGVUeXBlZFVuaXRWYWx1ZSh3aW4sIFwicHhcIiwgMCk7XG5cdGNvbnN0IG9uZU51bWJlciA9ICgpID0+IGNyZWF0ZVR5cGVkVW5pdFZhbHVlKHdpbiwgXCJudW1iZXJcIiwgMSk7XG5cdGxldCBpbmRleCA9IDA7XG5cdGNvbnN0IGN1cnJlbnQgPSAoKSA9PiB0b2tlbnNbaW5kZXhdO1xuXHRjb25zdCBjb25zdW1lID0gKCkgPT4ge1xuXHRcdGNvbnN0IHRva2VuID0gdG9rZW5zW2luZGV4XTtcblx0XHRpZiAoIXRva2VuKSB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJVbmV4cGVjdGVkIGVuZCBvZiB0cmFuc2Zvcm0gZXhwcmVzc2lvblwiKTtcblx0XHRpbmRleCsrO1xuXHRcdHJldHVybiB0b2tlbjtcblx0fTtcblx0Y29uc3QgY29uc3VtZVN5bWJvbCA9IChzeW1ib2wpID0+IHtcblx0XHRjb25zdCB0b2tlbiA9IGNvbnN1bWUoKTtcblx0XHRpZiAodG9rZW4ua2luZCAhPT0gXCJzeW1ib2xcIiB8fCB0b2tlbi52YWx1ZSAhPT0gc3ltYm9sKSB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYEV4cGVjdGVkIFwiJHtzeW1ib2x9XCJgKTtcblx0fTtcblx0Y29uc3QgcGFyc2VBcmd1bWVudCA9ICgpID0+IHtcblx0XHRjb25zdCBzdGFydCA9IGluZGV4O1xuXHRcdGxldCBkZXB0aCA9IDA7XG5cdFx0d2hpbGUgKGluZGV4IDwgdG9rZW5zLmxlbmd0aCkge1xuXHRcdFx0Y29uc3QgdG9rZW4gPSB0b2tlbnNbaW5kZXhdO1xuXHRcdFx0aWYgKHRva2VuLmtpbmQgPT09IFwic3ltYm9sXCIgJiYgdG9rZW4udmFsdWUgPT09IFwiKFwiKSB7XG5cdFx0XHRcdGRlcHRoKys7XG5cdFx0XHRcdGluZGV4Kys7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRva2VuLmtpbmQgPT09IFwic3ltYm9sXCIgJiYgdG9rZW4udmFsdWUgPT09IFwiKVwiKSB7XG5cdFx0XHRcdGlmIChkZXB0aCA9PT0gMCkgYnJlYWs7XG5cdFx0XHRcdGRlcHRoLS07XG5cdFx0XHRcdGluZGV4Kys7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRva2VuLmtpbmQgPT09IFwic3ltYm9sXCIgJiYgdG9rZW4udmFsdWUgPT09IFwiLFwiICYmIGRlcHRoID09PSAwKSBicmVhaztcblx0XHRcdGluZGV4Kys7XG5cdFx0fVxuXHRcdGNvbnN0IHNsaWNlID0gdG9rZW5zLnNsaWNlKHN0YXJ0LCBpbmRleCk7XG5cdFx0aWYgKHNsaWNlLmxlbmd0aCA9PT0gMCkgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiRW1wdHkgdHJhbnNmb3JtIGZ1bmN0aW9uIGFyZ3VtZW50XCIpO1xuXHRcdGNvbnN0IHRyZWUgPSBuZXcgTnVtZXJpY1R5cGVkT01QYXJzZXIoc2xpY2UsIHdpbiwgcmVhY3RpdmVCeU1hcmtlciwgdHlwZWRCeU1hcmtlcikucGFyc2UoKTtcblx0XHRsZWF2ZXMucHVzaCguLi50cmVlLmxlYXZlcyk7XG5cdFx0cmV0dXJuIHRyZWUucm9vdDtcblx0fTtcblx0Y29uc3QgcGFyc2VBcmd1bWVudExpc3QgPSAoKSA9PiB7XG5cdFx0Y29uc3QgYXJncyA9IFtdO1xuXHRcdGNvbnN1bWVTeW1ib2woXCIoXCIpO1xuXHRcdGlmICghKGN1cnJlbnQoKT8ua2luZCA9PT0gXCJzeW1ib2xcIiAmJiBjdXJyZW50KCk/LnZhbHVlID09PSBcIilcIikpIHtcblx0XHRcdGFyZ3MucHVzaChwYXJzZUFyZ3VtZW50KCkpO1xuXHRcdFx0d2hpbGUgKGN1cnJlbnQoKT8ua2luZCA9PT0gXCJzeW1ib2xcIiAmJiBjdXJyZW50KCk/LnZhbHVlID09PSBcIixcIikge1xuXHRcdFx0XHRjb25zdW1lKCk7XG5cdFx0XHRcdGFyZ3MucHVzaChwYXJzZUFyZ3VtZW50KCkpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRjb25zdW1lU3ltYm9sKFwiKVwiKTtcblx0XHRyZXR1cm4gYXJncztcblx0fTtcblx0Y29uc3QgY3JlYXRlQ29tcG9uZW50ID0gKG5hbWUsIGFyZ3MpID0+IHtcblx0XHRjb25zdCBjdG9yID0gKGNsYXNzTmFtZSkgPT4ge1xuXHRcdFx0Y29uc3QgQ3RvciA9IGdldFdpbmRvd0NvbnN0cnVjdG9yKHdpbiwgY2xhc3NOYW1lKTtcblx0XHRcdGlmICh0eXBlb2YgQ3RvciAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKGAke2NsYXNzTmFtZX0gaXMgbm90IHN1cHBvcnRlZGApO1xuXHRcdFx0cmV0dXJuIEN0b3I7XG5cdFx0fTtcblx0XHRzd2l0Y2ggKG5hbWUpIHtcblx0XHRcdGNhc2UgXCJ0cmFuc2xhdGVcIjoge1xuXHRcdFx0XHRjb25zdCBUcmFuc2xhdGUgPSBjdG9yKFwiQ1NTVHJhbnNsYXRlXCIpO1xuXHRcdFx0XHRpZiAoYXJncy5sZW5ndGggPT09IDEpIHJldHVybiBuZXcgVHJhbnNsYXRlKGFyZ3NbMF0sIHplcm9QeCgpKTtcblx0XHRcdFx0aWYgKGFyZ3MubGVuZ3RoID09PSAyKSByZXR1cm4gbmV3IFRyYW5zbGF0ZShhcmdzWzBdLCBhcmdzWzFdKTtcblx0XHRcdFx0aWYgKGFyZ3MubGVuZ3RoID09PSAzKSByZXR1cm4gbmV3IFRyYW5zbGF0ZShhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcblx0XHRcdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwidHJhbnNsYXRlKCkgZXhwZWN0cyAxLi4zIGFyZ3NcIik7XG5cdFx0XHR9XG5cdFx0XHRjYXNlIFwidHJhbnNsYXRleFwiOiByZXR1cm4gbmV3IChjdG9yKFwiQ1NTVHJhbnNsYXRlXCIpKShhcmdzWzBdLCB6ZXJvUHgoKSk7XG5cdFx0XHRjYXNlIFwidHJhbnNsYXRleVwiOiByZXR1cm4gbmV3IChjdG9yKFwiQ1NTVHJhbnNsYXRlXCIpKSh6ZXJvUHgoKSwgYXJnc1swXSk7XG5cdFx0XHRjYXNlIFwidHJhbnNsYXRlelwiOiByZXR1cm4gbmV3IChjdG9yKFwiQ1NTVHJhbnNsYXRlXCIpKSh6ZXJvUHgoKSwgemVyb1B4KCksIGFyZ3NbMF0pO1xuXHRcdFx0Y2FzZSBcInRyYW5zbGF0ZTNkXCI6XG5cdFx0XHRcdGlmIChhcmdzLmxlbmd0aCAhPT0gMykgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwidHJhbnNsYXRlM2QoKSBleHBlY3RzIDMgYXJnc1wiKTtcblx0XHRcdFx0cmV0dXJuIG5ldyAoY3RvcihcIkNTU1RyYW5zbGF0ZVwiKSkoYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG5cdFx0XHRjYXNlIFwic2NhbGVcIjoge1xuXHRcdFx0XHRjb25zdCBTY2FsZSA9IGN0b3IoXCJDU1NTY2FsZVwiKTtcblx0XHRcdFx0aWYgKGFyZ3MubGVuZ3RoID09PSAxKSByZXR1cm4gbmV3IFNjYWxlKGFyZ3NbMF0sIGFyZ3NbMF0pO1xuXHRcdFx0XHRpZiAoYXJncy5sZW5ndGggPT09IDIpIHJldHVybiBuZXcgU2NhbGUoYXJnc1swXSwgYXJnc1sxXSk7XG5cdFx0XHRcdGlmIChhcmdzLmxlbmd0aCA9PT0gMykgcmV0dXJuIG5ldyBTY2FsZShhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcblx0XHRcdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwic2NhbGUoKSBleHBlY3RzIDEuLjMgYXJnc1wiKTtcblx0XHRcdH1cblx0XHRcdGNhc2UgXCJzY2FsZXhcIjogcmV0dXJuIG5ldyAoY3RvcihcIkNTU1NjYWxlXCIpKShhcmdzWzBdLCBvbmVOdW1iZXIoKSk7XG5cdFx0XHRjYXNlIFwic2NhbGV5XCI6IHJldHVybiBuZXcgKGN0b3IoXCJDU1NTY2FsZVwiKSkob25lTnVtYmVyKCksIGFyZ3NbMF0pO1xuXHRcdFx0Y2FzZSBcInNjYWxlelwiOiByZXR1cm4gbmV3IChjdG9yKFwiQ1NTU2NhbGVcIikpKG9uZU51bWJlcigpLCBvbmVOdW1iZXIoKSwgYXJnc1swXSk7XG5cdFx0XHRjYXNlIFwic2NhbGUzZFwiOlxuXHRcdFx0XHRpZiAoYXJncy5sZW5ndGggIT09IDMpIHRocm93IG5ldyBTeW50YXhFcnJvcihcInNjYWxlM2QoKSBleHBlY3RzIDMgYXJnc1wiKTtcblx0XHRcdFx0cmV0dXJuIG5ldyAoY3RvcihcIkNTU1NjYWxlXCIpKShhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcblx0XHRcdGNhc2UgXCJyb3RhdGVcIjoge1xuXHRcdFx0XHRjb25zdCBSb3RhdGUgPSBjdG9yKFwiQ1NTUm90YXRlXCIpO1xuXHRcdFx0XHRpZiAoYXJncy5sZW5ndGggPT09IDEpIHJldHVybiBuZXcgUm90YXRlKGFyZ3NbMF0pO1xuXHRcdFx0XHRpZiAoYXJncy5sZW5ndGggPT09IDQpIHJldHVybiBuZXcgUm90YXRlKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuXHRcdFx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJyb3RhdGUoKSBleHBlY3RzIDEgb3IgNCBhcmdzXCIpO1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSBcInJvdGF0ZXhcIjogcmV0dXJuIG5ldyAoY3RvcihcIkNTU1JvdGF0ZVwiKSkob25lTnVtYmVyKCksIGNyZWF0ZVR5cGVkVW5pdFZhbHVlKHdpbiwgXCJudW1iZXJcIiwgMCksIGNyZWF0ZVR5cGVkVW5pdFZhbHVlKHdpbiwgXCJudW1iZXJcIiwgMCksIGFyZ3NbMF0pO1xuXHRcdFx0Y2FzZSBcInJvdGF0ZXlcIjogcmV0dXJuIG5ldyAoY3RvcihcIkNTU1JvdGF0ZVwiKSkoY3JlYXRlVHlwZWRVbml0VmFsdWUod2luLCBcIm51bWJlclwiLCAwKSwgb25lTnVtYmVyKCksIGNyZWF0ZVR5cGVkVW5pdFZhbHVlKHdpbiwgXCJudW1iZXJcIiwgMCksIGFyZ3NbMF0pO1xuXHRcdFx0Y2FzZSBcInJvdGF0ZXpcIjogcmV0dXJuIG5ldyAoY3RvcihcIkNTU1JvdGF0ZVwiKSkoY3JlYXRlVHlwZWRVbml0VmFsdWUod2luLCBcIm51bWJlclwiLCAwKSwgY3JlYXRlVHlwZWRVbml0VmFsdWUod2luLCBcIm51bWJlclwiLCAwKSwgb25lTnVtYmVyKCksIGFyZ3NbMF0pO1xuXHRcdFx0Y2FzZSBcInJvdGF0ZTNkXCI6XG5cdFx0XHRcdGlmIChhcmdzLmxlbmd0aCAhPT0gNCkgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwicm90YXRlM2QoKSBleHBlY3RzIDQgYXJnc1wiKTtcblx0XHRcdFx0cmV0dXJuIG5ldyAoY3RvcihcIkNTU1JvdGF0ZVwiKSkoYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG5cdFx0XHRjYXNlIFwic2tld1wiOiB7XG5cdFx0XHRcdGNvbnN0IFNrZXcgPSBjdG9yKFwiQ1NTU2tld1wiKTtcblx0XHRcdFx0aWYgKGFyZ3MubGVuZ3RoID09PSAxKSByZXR1cm4gbmV3IFNrZXcoYXJnc1swXSwgY3JlYXRlVHlwZWRVbml0VmFsdWUod2luLCBcImRlZ1wiLCAwKSk7XG5cdFx0XHRcdGlmIChhcmdzLmxlbmd0aCA9PT0gMikgcmV0dXJuIG5ldyBTa2V3KGFyZ3NbMF0sIGFyZ3NbMV0pO1xuXHRcdFx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJza2V3KCkgZXhwZWN0cyAxLi4yIGFyZ3NcIik7XG5cdFx0XHR9XG5cdFx0XHRjYXNlIFwic2tld3hcIjogcmV0dXJuIG5ldyAoY3RvcihcIkNTU1NrZXdYXCIpKShhcmdzWzBdKTtcblx0XHRcdGNhc2UgXCJza2V3eVwiOiByZXR1cm4gbmV3IChjdG9yKFwiQ1NTU2tld1lcIikpKGFyZ3NbMF0pO1xuXHRcdFx0Y2FzZSBcInBlcnNwZWN0aXZlXCI6IHJldHVybiBuZXcgKGN0b3IoXCJDU1NQZXJzcGVjdGl2ZVwiKSkoYXJnc1swXSk7XG5cdFx0XHRkZWZhdWx0OiB0aHJvdyBuZXcgU3ludGF4RXJyb3IoYFVuc3VwcG9ydGVkIHRyYW5zZm9ybSBmdW5jdGlvbiBcIiR7bmFtZX1cImApO1xuXHRcdH1cblx0fTtcblx0d2hpbGUgKGluZGV4IDwgdG9rZW5zLmxlbmd0aCkge1xuXHRcdGNvbnN0IHRva2VuID0gY29uc3VtZSgpO1xuXHRcdGlmICh0b2tlbi5raW5kICE9PSBcImlkZW50aWZpZXJcIikgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiRXhwZWN0ZWQgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gbmFtZVwiKTtcblx0XHRjb25zdCBhcmdzID0gcGFyc2VBcmd1bWVudExpc3QoKTtcblx0XHRjb21wb25lbnRzLnB1c2goY3JlYXRlQ29tcG9uZW50KHRva2VuLnZhbHVlLCBhcmdzKSk7XG5cdH1cblx0aWYgKGNvbXBvbmVudHMubGVuZ3RoID09PSAwKSB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJFbXB0eSB0cmFuc2Zvcm0gbGlzdFwiKTtcblx0Y29uc3QgQ1NTVHJhbnNmb3JtVmFsdWVDdG9yID0gZ2V0V2luZG93Q29uc3RydWN0b3Iod2luLCBcIkNTU1RyYW5zZm9ybVZhbHVlXCIpO1xuXHRpZiAodHlwZW9mIENTU1RyYW5zZm9ybVZhbHVlQ3RvciAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ1NTVHJhbnNmb3JtVmFsdWUgaXMgbm90IHN1cHBvcnRlZFwiKTtcblx0cmV0dXJuIHtcblx0XHRyb290OiBuZXcgQ1NTVHJhbnNmb3JtVmFsdWVDdG9yKGNvbXBvbmVudHMpLFxuXHRcdGxlYXZlc1xuXHR9O1xufTtcbnZhciBidWlsZFR5cGVkT01TdHlsZVZhbHVlID0gKHByb3BlcnR5LCBjc3NWYWx1ZSwgd2luLCByZWFjdGl2ZVNsb3RzLCB0eXBlZFNsb3RzKSA9PiB7XG5cdGlmIChpc1RyYW5zZm9ybVN0eWxlUHJvcGVydHkocHJvcGVydHkpKSByZXR1cm4gYnVpbGRUcmFuc2Zvcm1UeXBlZE9NVHJlZShjc3NWYWx1ZSwgd2luLCByZWFjdGl2ZVNsb3RzLCB0eXBlZFNsb3RzKTtcblx0cmV0dXJuIGJ1aWxkTnVtZXJpY1R5cGVkT01UcmVlKGNzc1ZhbHVlLCB3aW4sIHJlYWN0aXZlU2xvdHMsIHR5cGVkU2xvdHMpO1xufTtcbnZhciBhZGRNdXRhYmxlTGVhdmVzID0gKHRhcmdldCwgbGVhdmVzKSA9PiB7XG5cdGZvciAoY29uc3QgbGVhZiBvZiBsZWF2ZXMpIHtcblx0XHRjb25zdCBjdXJyZW50ID0gdGFyZ2V0LmdldChsZWFmLnNsb3QubWFya2VyKTtcblx0XHRpZiAoY3VycmVudCkgY3VycmVudC5wdXNoKGxlYWYpO1xuXHRcdGVsc2UgdGFyZ2V0LnNldChsZWFmLnNsb3QubWFya2VyLCBbbGVhZl0pO1xuXHR9XG59O1xudmFyIGF0dGFjaExlYWZUYXJnZXRzID0gKGxlYXZlcywgcHJvcGVydHksIHJvb3QpID0+IHtcblx0cmV0dXJuIGxlYXZlcy5tYXAoKGxlYWYpID0+ICh7XG5cdFx0c2xvdDogbGVhZi5zbG90LFxuXHRcdHZhbHVlOiBsZWFmLnZhbHVlLFxuXHRcdHByb3BlcnR5LFxuXHRcdHJvb3Rcblx0fSkpO1xufTtcbnZhciBhcHBseVN0eWxlVGVtcGxhdGUgPSAoZWxlbWVudCwgY3NzVGV4dCwgdHlwZWRTbG90cywgcmVhY3RpdmVTbG90cywgdmFyaWFibGVzLCBhbmltYXRhYmxlU2xvdHMpID0+IHtcblx0Y29uc3QgcHJvYmUgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG5cdHByb2JlLnN0eWxlLmNzc1RleHQgPSBjc3NUZXh0O1xuXHRhcHBseU5vcm1hbGl6ZWRJbmxpbmVTdHlsZShlbGVtZW50LCBcIlwiKTtcblx0Y29uc3QgdGFyZ2V0ID0gZWxlbWVudDtcblx0Y29uc3Qgc3R5bGVNYXAgPSB0YXJnZXQuYXR0cmlidXRlU3R5bGVNYXAgPz8gdGFyZ2V0LnN0eWxlTWFwO1xuXHRjb25zdCB3aW4gPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcgPz8gZ2xvYmFsVGhpcztcblx0Y29uc3QgQ1NTU3R5bGVWYWx1ZUN0b3IgPSB3aW4/LkNTU1N0eWxlVmFsdWUgPz8gZ2xvYmFsVGhpcy5DU1NTdHlsZVZhbHVlO1xuXHRjb25zdCBtdXRhYmxlTGVhdmVzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0Y29uc3QgcmVxdWlyZWRDU1NWYXJpYWJsZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHRjb25zdCBzdWJzY3JpcHRpb25zID0gW107XG5cdGNvbnN0IHByb3BlcnR5TW9kZU93bmVkID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcblx0Zm9yIChjb25zdCBzbG90IG9mIGFuaW1hdGFibGVTbG90cykge1xuXHRcdGxldCBwbGFuID0gbnVsbDtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHByb2JlLnN0eWxlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0eSA9IHByb2JlLnN0eWxlLml0ZW0oaSk7XG5cdFx0XHRjb25zdCBwYXJzZWRWYWx1ZSA9IHByb2JlLnN0eWxlLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHkpO1xuXHRcdFx0aWYgKGlzRGlyZWN0U2xvdFZhbHVlKHBhcnNlZFZhbHVlLCBzbG90Lm1hcmtlcikpIHtcblx0XHRcdFx0cGxhbiA9IHtcblx0XHRcdFx0XHRtb2RlOiBcInByb3BlcnR5XCIsXG5cdFx0XHRcdFx0dGFyZ2V0OiBwcm9wZXJ0eVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KHByb3BlcnR5LCBzZXJpYWxpemVBbmltYXRhYmxlQ3NzVmFsdWUoc2xvdC52YWx1ZS52YWx1ZSkpO1xuXHRcdFx0XHRwcm9wZXJ0eU1vZGVPd25lZC5hZGQocHJvcGVydHkpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGlmIChpc0RpcmVjdFNsb3RVbml0UHJvZHVjdChwYXJzZWRWYWx1ZSwgc2xvdC5tYXJrZXIsIHNsb3QubXVsdGlwbGllZEJ5VW5pdCkpIHtcblx0XHRcdFx0cGxhbiA9IHtcblx0XHRcdFx0XHRtb2RlOiBcInByb3BlcnR5XCIsXG5cdFx0XHRcdFx0dGFyZ2V0OiBwcm9wZXJ0eSxcblx0XHRcdFx0XHR1bml0OiBzbG90Lm11bHRpcGxpZWRCeVVuaXRcblx0XHRcdFx0fTtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wZXJ0eSwgc2VyaWFsaXplQW5pbWF0YWJsZUNzc1ZhbHVlKHNsb3QudmFsdWUudmFsdWUsIHNsb3QubXVsdGlwbGllZEJ5VW5pdCkpO1xuXHRcdFx0XHRwcm9wZXJ0eU1vZGVPd25lZC5hZGQocHJvcGVydHkpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCFwbGFuKSB7XG5cdFx0XHRjb25zdCBpbml0aWFsTnVtYmVyID0gTnVtYmVyKHNsb3QudmFsdWUudmFsdWUpIHx8IDA7XG5cdFx0XHRlbnN1cmVSZWdpc3RlcmVkTnVtYmVyUHJvcGVydHkod2luLCBzbG90Lm1hcmtlciwgaW5pdGlhbE51bWJlcik7XG5cdFx0XHRlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KHNsb3QubWFya2VyLCBTdHJpbmcoaW5pdGlhbE51bWJlcikpO1xuXHRcdFx0cGxhbiA9IHtcblx0XHRcdFx0bW9kZTogXCJjdXN0b20tcHJvcGVydHlcIixcblx0XHRcdFx0dGFyZ2V0OiBzbG90Lm1hcmtlclxuXHRcdFx0fTtcblx0XHR9XG5cdFx0c3Vic2NyaXB0aW9ucy5wdXNoKHNsb3QudmFsdWUuYXR0YWNoKGVsZW1lbnQsIHBsYW4pKTtcblx0fVxuXHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgcHJvYmUuc3R5bGUubGVuZ3RoOyBpbmRleCsrKSB7XG5cdFx0Y29uc3QgcHJvcGVydHkgPSBwcm9iZS5zdHlsZS5pdGVtKGluZGV4KTtcblx0XHRpZiAocHJvcGVydHlNb2RlT3duZWQuaGFzKHByb3BlcnR5KSkgY29udGludWU7XG5cdFx0Y29uc3QgcGFyc2VkVmFsdWUgPSBwcm9iZS5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KTtcblx0XHRjb25zdCBwcmlvcml0eSA9IHByb2JlLnN0eWxlLmdldFByb3BlcnR5UHJpb3JpdHkocHJvcGVydHkpO1xuXHRcdGNvbnN0IHVzZWRUeXBlZFNsb3RzID0gdHlwZWRTbG90cy5maWx0ZXIoKHNsb3QpID0+IGNvbnRhaW5zTWFya2VyKHBhcnNlZFZhbHVlLCBzbG90Lm1hcmtlcikpO1xuXHRcdGNvbnN0IHVzZWRSZWFjdGl2ZVNsb3RzID0gcmVhY3RpdmVTbG90cy5maWx0ZXIoKHNsb3QpID0+IGNvbnRhaW5zTWFya2VyKHBhcnNlZFZhbHVlLCBzbG90Lm1hcmtlcikpO1xuXHRcdGlmICh1c2VkVHlwZWRTbG90cy5sZW5ndGggPT09IDAgJiYgdXNlZFJlYWN0aXZlU2xvdHMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KHByb3BlcnR5LCBwYXJzZWRWYWx1ZSwgcHJpb3JpdHkpO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGNvbnN0IGNhblVzZVR5cGVkT00gPSBzdHlsZU1hcD8uc2V0ICYmICFwcmlvcml0eSAmJiAhcHJvcGVydHkuc3RhcnRzV2l0aChcIi0tXCIpO1xuXHRcdGxldCBhcHBsaWVkVGhyb3VnaFR5cGVkT00gPSBmYWxzZTtcblx0XHRpZiAoY2FuVXNlVHlwZWRPTSAmJiB1c2VkUmVhY3RpdmVTbG90cy5sZW5ndGggPiAwKSB0cnkge1xuXHRcdFx0Y29uc3QgZGlyZWN0U2xvdCA9IHVzZWRSZWFjdGl2ZVNsb3RzLmxlbmd0aCA9PT0gMSAmJiB1c2VkVHlwZWRTbG90cy5sZW5ndGggPT09IDAgPyB1c2VkUmVhY3RpdmVTbG90c1swXSA6IG51bGw7XG5cdFx0XHRpZiAoZGlyZWN0U2xvdCAmJiBpc0RpcmVjdFNsb3RVbml0UHJvZHVjdChwYXJzZWRWYWx1ZSwgZGlyZWN0U2xvdC5tYXJrZXIsIGRpcmVjdFNsb3QubXVsdGlwbGllZEJ5VW5pdCkpIHtcblx0XHRcdFx0Y29uc3QgbGlua2VkVmFsdWUgPSBjcmVhdGVUeXBlZFVuaXRWYWx1ZSh3aW4sIGRpcmVjdFNsb3QubXVsdGlwbGllZEJ5VW5pdCwgcmVhZFJlYWN0aXZlTnVtYmVyKGRpcmVjdFNsb3QpKTtcblx0XHRcdFx0c3R5bGVNYXAuc2V0KHByb3BlcnR5LCBsaW5rZWRWYWx1ZSk7XG5cdFx0XHRcdGFkZE11dGFibGVMZWF2ZXMobXV0YWJsZUxlYXZlcywgYXR0YWNoTGVhZlRhcmdldHMoW3tcblx0XHRcdFx0XHRzbG90OiBkaXJlY3RTbG90LFxuXHRcdFx0XHRcdHZhbHVlOiBsaW5rZWRWYWx1ZVxuXHRcdFx0XHR9XSwgcHJvcGVydHksIGxpbmtlZFZhbHVlKSk7XG5cdFx0XHRcdGFwcGxpZWRUaHJvdWdoVHlwZWRPTSA9IHRydWU7XG5cdFx0XHR9IGVsc2UgaWYgKGRpcmVjdFNsb3QgJiYgaXNEaXJlY3RTbG90VmFsdWUocGFyc2VkVmFsdWUsIGRpcmVjdFNsb3QubWFya2VyKSkge1xuXHRcdFx0XHRjb25zdCBsaW5rZWRWYWx1ZSA9IGNyZWF0ZVR5cGVkVW5pdFZhbHVlKHdpbiwgXCJudW1iZXJcIiwgcmVhZFJlYWN0aXZlTnVtYmVyKGRpcmVjdFNsb3QpKTtcblx0XHRcdFx0c3R5bGVNYXAuc2V0KHByb3BlcnR5LCBsaW5rZWRWYWx1ZSk7XG5cdFx0XHRcdGFkZE11dGFibGVMZWF2ZXMobXV0YWJsZUxlYXZlcywgYXR0YWNoTGVhZlRhcmdldHMoW3tcblx0XHRcdFx0XHRzbG90OiBkaXJlY3RTbG90LFxuXHRcdFx0XHRcdHZhbHVlOiBsaW5rZWRWYWx1ZVxuXHRcdFx0XHR9XSwgcHJvcGVydHksIGxpbmtlZFZhbHVlKSk7XG5cdFx0XHRcdGFwcGxpZWRUaHJvdWdoVHlwZWRPTSA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCB0cmVlID0gYnVpbGRUeXBlZE9NU3R5bGVWYWx1ZShwcm9wZXJ0eSwgcGFyc2VkVmFsdWUsIHdpbiwgdXNlZFJlYWN0aXZlU2xvdHMsIHVzZWRUeXBlZFNsb3RzKTtcblx0XHRcdFx0c3R5bGVNYXAuc2V0KHByb3BlcnR5LCB0cmVlLnJvb3QpO1xuXHRcdFx0XHRhZGRNdXRhYmxlTGVhdmVzKG11dGFibGVMZWF2ZXMsIGF0dGFjaExlYWZUYXJnZXRzKHRyZWUubGVhdmVzLCBwcm9wZXJ0eSwgdHJlZS5yb290KSk7XG5cdFx0XHRcdGFwcGxpZWRUaHJvdWdoVHlwZWRPTSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCB7fVxuXHRcdGlmIChhcHBsaWVkVGhyb3VnaFR5cGVkT00pIGNvbnRpbnVlO1xuXHRcdGlmIChjYW5Vc2VUeXBlZE9NICYmIHVzZWRSZWFjdGl2ZVNsb3RzLmxlbmd0aCA9PT0gMCAmJiB1c2VkVHlwZWRTbG90cy5sZW5ndGggPiAwKSB0cnkge1xuXHRcdFx0Y29uc3QgZGlyZWN0U2xvdCA9IHVzZWRUeXBlZFNsb3RzLmxlbmd0aCA9PT0gMSA/IHVzZWRUeXBlZFNsb3RzWzBdIDogbnVsbDtcblx0XHRcdGlmIChkaXJlY3RTbG90ICYmIGlzRGlyZWN0U2xvdFZhbHVlKHBhcnNlZFZhbHVlLCBkaXJlY3RTbG90Lm1hcmtlcikpIHtcblx0XHRcdFx0c3R5bGVNYXAuc2V0KHByb3BlcnR5LCBkaXJlY3RTbG90LnZhbHVlKTtcblx0XHRcdFx0YXBwbGllZFRocm91Z2hUeXBlZE9NID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSBpZiAoZGlyZWN0U2xvdCAmJiBpc0RpcmVjdFNsb3RVbml0UHJvZHVjdChwYXJzZWRWYWx1ZSwgZGlyZWN0U2xvdC5tYXJrZXIsIGRpcmVjdFNsb3QubXVsdGlwbGllZEJ5VW5pdCkpIHtcblx0XHRcdFx0Y29uc3QgQ1NTTWF0aFByb2R1Y3RDdG9yID0gZ2V0V2luZG93Q29uc3RydWN0b3Iod2luLCBcIkNTU01hdGhQcm9kdWN0XCIpO1xuXHRcdFx0XHRpZiAodHlwZW9mIENTU01hdGhQcm9kdWN0Q3RvciAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ1NTTWF0aFByb2R1Y3QgaXMgbm90IHN1cHBvcnRlZFwiKTtcblx0XHRcdFx0Y29uc3QgcHJvZHVjdCA9IG5ldyBDU1NNYXRoUHJvZHVjdEN0b3IoZGlyZWN0U2xvdC52YWx1ZSwgY3JlYXRlVHlwZWRVbml0VmFsdWUod2luLCBkaXJlY3RTbG90Lm11bHRpcGxpZWRCeVVuaXQsIDEpKTtcblx0XHRcdFx0c3R5bGVNYXAuc2V0KHByb3BlcnR5LCBwcm9kdWN0KTtcblx0XHRcdFx0YXBwbGllZFRocm91Z2hUeXBlZE9NID0gdHJ1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3QgdHJlZSA9IGJ1aWxkVHlwZWRPTVN0eWxlVmFsdWUocHJvcGVydHksIHBhcnNlZFZhbHVlLCB3aW4sIFtdLCB1c2VkVHlwZWRTbG90cyk7XG5cdFx0XHRcdFx0c3R5bGVNYXAuc2V0KHByb3BlcnR5LCB0cmVlLnJvb3QpO1xuXHRcdFx0XHR9IGNhdGNoIHtcblx0XHRcdFx0XHRjb25zdCByZWNvbnN0cnVjdGVkID0gcmVwbGFjZVR5cGVkTWFya2VycyhwYXJzZWRWYWx1ZSwgdXNlZFR5cGVkU2xvdHMpO1xuXHRcdFx0XHRcdHNldFBhcnNlZFR5cGVkVmFsdWUoc3R5bGVNYXAsIENTU1N0eWxlVmFsdWVDdG9yLCBwcm9wZXJ0eSwgcmVjb25zdHJ1Y3RlZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YXBwbGllZFRocm91Z2hUeXBlZE9NID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9IGNhdGNoIHt9XG5cdFx0aWYgKGFwcGxpZWRUaHJvdWdoVHlwZWRPTSkgY29udGludWU7XG5cdFx0Y29uc3QgcmVjb25zdHJ1Y3RlZCA9IHJlcGxhY2VUeXBlZE1hcmtlcnMocGFyc2VkVmFsdWUsIHVzZWRUeXBlZFNsb3RzKTtcblx0XHRlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KHByb3BlcnR5LCByZWNvbnN0cnVjdGVkLCBwcmlvcml0eSk7XG5cdFx0Zm9yIChjb25zdCBzbG90IG9mIHVzZWRSZWFjdGl2ZVNsb3RzKSByZXF1aXJlZENTU1ZhcmlhYmxlcy5hZGQoc2xvdC5tYXJrZXIpO1xuXHR9XG5cdGZvciAoY29uc3Qgc2xvdCBvZiByZWFjdGl2ZVNsb3RzKSB7XG5cdFx0Y29uc3QgbGVhdmVzID0gbXV0YWJsZUxlYXZlcy5nZXQoc2xvdC5tYXJrZXIpID8/IFtdO1xuXHRcdGNvbnN0IG5lZWRzQ1NTVmFyaWFibGUgPSByZXF1aXJlZENTU1ZhcmlhYmxlcy5oYXMoc2xvdC5tYXJrZXIpO1xuXHRcdGlmIChsZWF2ZXMubGVuZ3RoID09PSAwICYmICFuZWVkc0NTU1ZhcmlhYmxlKSBjb250aW51ZTtcblx0XHRjb25zdCBzdWJzY3JpcHRpb24gPSBiaW5kV2l0aChlbGVtZW50LCBzbG90Lm1hcmtlciwgc2xvdC52YWx1ZSwgZnVuY3Rpb24oLi4uYXJncykge1xuXHRcdFx0aWYgKGxlYXZlcy5sZW5ndGggPiAwKSB0cnkge1xuXHRcdFx0XHRjb25zdCBuZXh0VmFsdWUgPSByZWFkUmVhY3RpdmVOdW1iZXIoc2xvdCk7XG5cdFx0XHRcdGNvbnN0IGRpcnR5Um9vdHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdFx0XHRmb3IgKGNvbnN0IGxlYWYgb2YgbGVhdmVzKSB7XG5cdFx0XHRcdFx0bGVhZi52YWx1ZS52YWx1ZSA9IG5leHRWYWx1ZTtcblx0XHRcdFx0XHRkaXJ0eVJvb3RzLnNldChsZWFmLnByb3BlcnR5LCBsZWFmLnJvb3QpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzdHlsZU1hcD8uc2V0KSBmb3IgKGNvbnN0IFtwcm9wZXJ0eU5hbWUsIHJvb3RdIG9mIGRpcnR5Um9vdHMpIHN0eWxlTWFwLnNldChwcm9wZXJ0eU5hbWUsIHJvb3QpO1xuXHRcdFx0fSBjYXRjaCB7fVxuXHRcdFx0aWYgKG5lZWRzQ1NTVmFyaWFibGUpIGhhbmRsZVN0eWxlQ2hhbmdlLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHRcdH0pO1xuXHRcdHN1YnNjcmlwdGlvbnMucHVzaChzdWJzY3JpcHRpb24pO1xuXHR9XG5cdGZvciAoY29uc3QgbmFtZSBvZiByZXF1aXJlZENTU1ZhcmlhYmxlcykge1xuXHRcdGlmIChyZWFjdGl2ZVNsb3RzLnNvbWUoKHNsb3QpID0+IHNsb3QubWFya2VyID09PSBuYW1lKSkgY29udGludWU7XG5cdFx0Y29uc3QgdmFsdWUgPSB2YXJpYWJsZXMuZ2V0KG5hbWUpO1xuXHRcdGlmICh2YWx1ZSA9PSBudWxsKSBjb250aW51ZTtcblx0XHRzdWJzY3JpcHRpb25zLnB1c2goYmluZFdpdGgoZWxlbWVudCwgbmFtZSwgdmFsdWUsIGhhbmRsZVN0eWxlQ2hhbmdlKSk7XG5cdH1cblx0cHJ1bmVFbXB0eVN0eWxlQXR0cmlidXRlKGVsZW1lbnQpO1xuXHRyZXR1cm4gKCkgPT4ge1xuXHRcdGZvciAoY29uc3Qgc3Vic2NyaXB0aW9uIG9mIHN1YnNjcmlwdGlvbnMpIHN1YnNjcmlwdGlvbj8uKCk7XG5cdH07XG59O1xudmFyIGNvbXBsaWxlU3RhdGljQ1NTVGV4dCA9IChmb3JSZXR1cm4pID0+IHtcblx0Y29uc3QgW2FwcGx5LCBwcm9wZXJ0aWVzLCB2YXJpYWJsZXNdID0gZm9yUmV0dXJuO1xuXHRjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0YXBwbHkoZWxlbWVudCk7XG5cdHJldHVybiBlbGVtZW50LnN0eWxlLmNzc1RleHQ7XG59O1xudmFyIFMgPSAoc3RyaW5ncywgLi4udmFsdWVzKSA9PiB7XG5cdGNvbnN0IHRlbXBsYXRlSWQgPSBzdHlsZVRlbXBsYXRlSWQrKztcblx0Y29uc3QgcHJvcGVydGllcyA9IFtdO1xuXHRjb25zdCB2YXJpYWJsZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRjb25zdCB0eXBlZFNsb3RzID0gW107XG5cdGNvbnN0IHJlYWN0aXZlU2xvdHMgPSBbXTtcblx0Y29uc3QgcGFydHMgPSBbXTtcblx0Y29uc3QgYW5pbWF0YWJsZVNsb3RzID0gW107XG5cdGNvbnN0IGNvbnN1bWVkID0gbmV3IEFycmF5KHN0cmluZ3MubGVuZ3RoKS5maWxsKDApO1xuXHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgc3RyaW5ncy5sZW5ndGg7IGluZGV4KyspIHtcblx0XHRwYXJ0cy5wdXNoKHN0cmluZ3NbaW5kZXhdLnNsaWNlKGNvbnN1bWVkW2luZGV4XSkpO1xuXHRcdGlmIChpbmRleCA+PSB2YWx1ZXMubGVuZ3RoKSBjb250aW51ZTtcblx0XHRjb25zdCB2YWx1ZSA9IHZhbHVlc1tpbmRleF07XG5cdFx0Y29uc3QgbmV4dFRleHQgPSBzdHJpbmdzW2luZGV4ICsgMV0gPz8gXCJcIjtcblx0XHRjb25zdCBhdHRhY2hlZFVuaXQgPSByZWFkQXR0YWNoZWRDU1NVbml0KG5leHRUZXh0KTtcblx0XHRpZiAoaXNOYXRpdmVDU1NTdHlsZVZhbHVlKHZhbHVlKSkge1xuXHRcdFx0Y29uc3QgbWFya2VyID0gYC0tZmVzdC10eXBlZC0ke3RlbXBsYXRlSWR9LSR7dHlwZWRTbG90cy5sZW5ndGh9YDtcblx0XHRcdHR5cGVkU2xvdHMucHVzaCh7XG5cdFx0XHRcdG1hcmtlcixcblx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdG11bHRpcGxpZWRCeVVuaXQ6IGF0dGFjaGVkVW5pdD8ubm9ybWFsaXplZFxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoYXR0YWNoZWRVbml0KSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goYGNhbGModmFyKCR7bWFya2VyfSkgKiAxJHthdHRhY2hlZFVuaXQuYXV0aG9yZWR9KWApO1xuXHRcdFx0XHRjb25zdW1lZFtpbmRleCArIDFdICs9IGF0dGFjaGVkVW5pdC5sZW5ndGg7XG5cdFx0XHR9IGVsc2UgcGFydHMucHVzaChgdmFyKCR7bWFya2VyfSlgKTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRpZiAoaXNBbmltYXRhYmxlVmFsdWUodmFsdWUpKSB7XG5cdFx0XHRjb25zdCBtYXJrZXIgPSBgLS1mZXN0LWFuaW0tJHt0ZW1wbGF0ZUlkfS0ke2FuaW1hdGFibGVTbG90cy5sZW5ndGh9YDtcblx0XHRcdGlmIChhdHRhY2hlZFVuaXQpIHtcblx0XHRcdFx0cGFydHMucHVzaChgY2FsYyh2YXIoJHttYXJrZXJ9KSAqIDEke2F0dGFjaGVkVW5pdC5hdXRob3JlZH0pYCk7XG5cdFx0XHRcdGNvbnN1bWVkW2luZGV4ICsgMV0gKz0gYXR0YWNoZWRVbml0Lmxlbmd0aDtcblx0XHRcdH0gZWxzZSBwYXJ0cy5wdXNoKGB2YXIoJHttYXJrZXJ9KWApO1xuXHRcdFx0cHJvcGVydGllcy5wdXNoKGBAcHJvcGVydHkgJHttYXJrZXJ9IHsgc3ludGF4OiBcIjxudW1iZXI+XCI7IGluaXRpYWwtdmFsdWU6ICR7TnVtYmVyKHZhbHVlLnZhbHVlKSB8fCAwfTsgaW5oZXJpdHM6IGZhbHNlOyB9O2ApO1xuXHRcdFx0YW5pbWF0YWJsZVNsb3RzLnB1c2goe1xuXHRcdFx0XHRtYXJrZXIsXG5cdFx0XHRcdHZhbHVlLFxuXHRcdFx0XHRtdWx0aXBsaWVkQnlVbml0OiBhdHRhY2hlZFVuaXQ/Lm5vcm1hbGl6ZWRcblx0XHRcdH0pO1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXHRcdGlmIChpc1JlYWN0aXZlU3R5bGVWYWx1ZSh2YWx1ZSkpIHtcblx0XHRcdGNvbnN0IG1hcmtlciA9IGAtLWZlc3QtcmVmLSR7dGVtcGxhdGVJZH0tJHtyZWFjdGl2ZVNsb3RzLmxlbmd0aH1gO1xuXHRcdFx0cmVhY3RpdmVTbG90cy5wdXNoKHtcblx0XHRcdFx0bWFya2VyLFxuXHRcdFx0XHR2YWx1ZSxcblx0XHRcdFx0bXVsdGlwbGllZEJ5VW5pdDogYXR0YWNoZWRVbml0Py5ub3JtYWxpemVkXG5cdFx0XHR9KTtcblx0XHRcdGlmIChhdHRhY2hlZFVuaXQpIHtcblx0XHRcdFx0cGFydHMucHVzaChgY2FsYyh2YXIoJHttYXJrZXJ9KSAqIDEke2F0dGFjaGVkVW5pdC5hdXRob3JlZH0pYCk7XG5cdFx0XHRcdGNvbnN1bWVkW2luZGV4ICsgMV0gKz0gYXR0YWNoZWRVbml0Lmxlbmd0aDtcblx0XHRcdH0gZWxzZSBwYXJ0cy5wdXNoKGB2YXIoJHttYXJrZXJ9KWApO1xuXHRcdFx0Y29uc3QgaW5pdGlhbFZhbHVlID0gZ2V0UmVhY3RpdmVJbml0aWFsTnVtYmVyKHZhbHVlKTtcblx0XHRcdHByb3BlcnRpZXMucHVzaChgQHByb3BlcnR5ICR7bWFya2VyfSB7IHN5bnRheDogXCI8bnVtYmVyPlwiOyBpbml0aWFsLXZhbHVlOiAke2luaXRpYWxWYWx1ZX07IGluaGVyaXRzOiB0cnVlOyB9O2ApO1xuXHRcdFx0dmFyaWFibGVzLnNldChtYXJrZXIsIHZhbHVlKTtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRpZiAodHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiICYmIHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiICYmIHZhbHVlICE9IG51bGwgJiYgU3RyaW5nKHZhbHVlKS50cmltKCkgIT09IFwiXCIpIHBhcnRzLnB1c2goU3RyaW5nKHZhbHVlKSk7XG5cdH1cblx0Y29uc3QgZm9yUmV0dXJuID0gW1xuXHRcdChlbGVtZW50KSA9PiB7XG5cdFx0XHRyZXR1cm4gYXBwbHlTdHlsZVRlbXBsYXRlKGVsZW1lbnQsIHBhcnRzLmpvaW4oXCJcIiksIHR5cGVkU2xvdHMsIHJlYWN0aXZlU2xvdHMsIHZhcmlhYmxlcywgYW5pbWF0YWJsZVNsb3RzKTtcblx0XHR9LFxuXHRcdHByb3BlcnRpZXMsXG5cdFx0dmFyaWFibGVzXG5cdF07XG5cdGZvclJldHVybltTeW1ib2wudG9TdHJpbmdUYWddID0gKCkgPT4gY29tcGxpbGVTdGF0aWNDU1NUZXh0KGZvclJldHVybik7XG5cdGZvclJldHVybltTeW1ib2wudG9QcmltaXRpdmVdID0gKHR5cGUpID0+IHtcblx0XHRpZiAodHlwZSA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIGNvbXBsaWxlU3RhdGljQ1NTVGV4dChmb3JSZXR1cm4pO1xuXHRcdHJldHVybiBmb3JSZXR1cm5bMF07XG5cdH07XG5cdGZvclJldHVybi50b1N0cmluZyA9ICgpID0+IGNvbXBsaWxlU3RhdGljQ1NTVGV4dChmb3JSZXR1cm4pO1xuXHRmb3JSZXR1cm4udmFsdWVPZiA9ICgpID0+IGNvbXBsaWxlU3RhdGljQ1NTVGV4dChmb3JSZXR1cm4pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm9yUmV0dXJuLCBcImNzc1RleHRcIiwge1xuXHRcdGdldDogKCkgPT4gY29tcGxpbGVTdGF0aWNDU1NUZXh0KGZvclJldHVybiksXG5cdFx0c2V0OiAodmFsdWUpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwic2V0IGNzc1RleHRcIiwgdmFsdWUpO1xuXHRcdFx0Y29uc3QgW2FwcGx5LCBwcm9wZXJ0aWVzLCB2YXJpYWJsZXNdID0gZm9yUmV0dXJuO1xuXHRcdFx0Y29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRhcHBseShlbGVtZW50KTtcblx0XHRcdGVsZW1lbnQuc3R5bGUuY3NzVGV4dCA9IHZhbHVlO1xuXHRcdH0sXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdGVudW1lcmFibGU6IHRydWVcblx0fSk7XG5cdHJldHVybiBmb3JSZXR1cm47XG59O1xudmFyIGNzcyA9IChzdHJpbmdzLCAuLi52YWx1ZXMpID0+IHtcblx0cmV0dXJuIFMoc3RyaW5ncywgLi4udmFsdWVzKTtcbn07XG52YXIgc3BsaXRJbmxpbmVTdHlsZVBsYWNlaG9sZGVycyA9IChzb3VyY2UsIGF0dHJpYnV0ZXMpID0+IHtcblx0Y29uc3Qgc3RyaW5ncyA9IFtdO1xuXHRjb25zdCB2YWx1ZXMgPSBbXTtcblx0Y29uc3QgcGF0dGVybiA9IC8jXFx7KFxcZCspXFx9L2c7XG5cdGxldCBjdXJzb3IgPSAwO1xuXHRsZXQgbWF0Y2g7XG5cdHdoaWxlICgobWF0Y2ggPSBwYXR0ZXJuLmV4ZWMoc291cmNlKSkgIT0gbnVsbCkge1xuXHRcdGNvbnN0IGF0dHJpYnV0ZUluZGV4ID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzFdLCAxMCk7XG5cdFx0aWYgKCFOdW1iZXIuaXNTYWZlSW50ZWdlcihhdHRyaWJ1dGVJbmRleCkgfHwgYXR0cmlidXRlSW5kZXggPCAwKSBjb250aW51ZTtcblx0XHRzdHJpbmdzLnB1c2goc291cmNlLnNsaWNlKGN1cnNvciwgbWF0Y2guaW5kZXgpKTtcblx0XHR2YWx1ZXMucHVzaChhdHRyaWJ1dGVzW2F0dHJpYnV0ZUluZGV4XSk7XG5cdFx0Y3Vyc29yID0gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGg7XG5cdH1cblx0aWYgKHZhbHVlcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXHRzdHJpbmdzLnB1c2goc291cmNlLnNsaWNlKGN1cnNvcikpO1xuXHRyZXR1cm4ge1xuXHRcdHN0cmluZ3MsXG5cdFx0dmFsdWVzXG5cdH07XG59O1xudmFyIGpvaW5TdGF0aWNJbmxpbmVTdHlsZSA9IChzdHJpbmdzLCB2YWx1ZXMpID0+IHtcblx0bGV0IHJlc3VsdCA9IHN0cmluZ3NbMF0gPz8gXCJcIjtcblx0Zm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHZhbHVlcy5sZW5ndGg7IGluZGV4KyspIHtcblx0XHRjb25zdCB2YWx1ZSA9IHZhbHVlc1tpbmRleF07XG5cdFx0aWYgKHZhbHVlICE9IG51bGwpIHJlc3VsdCArPSBTdHJpbmcodmFsdWUpO1xuXHRcdHJlc3VsdCArPSBzdHJpbmdzW2luZGV4ICsgMV0gPz8gXCJcIjtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTtcbnZhciBjb21waWxlSW5saW5lU3R5bGVBdHRyaWJ1dGUgPSAoc291cmNlLCBhdHRyaWJ1dGVzKSA9PiB7XG5cdGNvbnN0IHBhcnNlZCA9IHNwbGl0SW5saW5lU3R5bGVQbGFjZWhvbGRlcnMoc291cmNlLCBhdHRyaWJ1dGVzKTtcblx0aWYgKCFwYXJzZWQpIHJldHVybiBudWxsO1xuXHRjb25zdCB7IHN0cmluZ3MsIHZhbHVlcyB9ID0gcGFyc2VkO1xuXHRpZiAodmFsdWVzLmxlbmd0aCA9PT0gMSAmJiAoc3RyaW5nc1swXSA/PyBcIlwiKS50cmltKCkgPT09IFwiXCIgJiYgKHN0cmluZ3NbMV0gPz8gXCJcIikudHJpbSgpID09PSBcIlwiICYmICFpc1N0YXRpY1N0eWxlSW50ZXJwb2xhdGlvbih2YWx1ZXNbMF0pICYmICFpc05hdGl2ZUNTU1N0eWxlVmFsdWUodmFsdWVzWzBdKSkge1xuXHRcdGlmIChpc1N0eWxlQmluZGluZyh2YWx1ZXNbMF0pKSByZXR1cm4ge1xuXHRcdFx0a2luZDogXCJ0ZW1wbGF0ZVwiLFxuXHRcdFx0YmluZGluZzogdmFsdWVzWzBdXG5cdFx0fTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0a2luZDogXCJkaXJlY3RcIixcblx0XHRcdHZhbHVlOiB2YWx1ZXNbMF1cblx0XHR9O1xuXHR9XG5cdGlmICh2YWx1ZXMuc29tZSgodmFsdWUpID0+IGlzUmVhY3RpdmVTdHlsZVZhbHVlKHZhbHVlKSB8fCBpc05hdGl2ZUNTU1N0eWxlVmFsdWUodmFsdWUpKSkgcmV0dXJuIHtcblx0XHRraW5kOiBcInRlbXBsYXRlXCIsXG5cdFx0YmluZGluZzogUyhzdHJpbmdzLCAuLi52YWx1ZXMpXG5cdH07XG5cdGlmICh2YWx1ZXMuZXZlcnkoaXNTdGF0aWNTdHlsZUludGVycG9sYXRpb24pKSByZXR1cm4ge1xuXHRcdGtpbmQ6IFwic3RhdGljXCIsXG5cdFx0Y3NzVGV4dDogam9pblN0YXRpY0lubGluZVN0eWxlKHN0cmluZ3MsIHZhbHVlcylcblx0fTtcblx0cmV0dXJuIHtcblx0XHRraW5kOiBcInRlbXBsYXRlXCIsXG5cdFx0YmluZGluZzogUyhzdHJpbmdzLCAuLi52YWx1ZXMpXG5cdH07XG59O1xudmFyIGJpbmRTdHlsZSA9IChlbGVtZW50LCBzdHlsZWQpID0+IHtcblx0Y29uc3QgYXBwbHkgPSBBcnJheS5pc0FycmF5KHN0eWxlZCkgPyBzdHlsZWRbMF0gOiBzdHlsZWQ7XG5cdGlmICh0eXBlb2YgYXBwbHkgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuICgpID0+IHt9O1xuXHRjb25zdCByZXN1bHQgPSBhcHBseShlbGVtZW50KTtcblx0cmV0dXJuICgpID0+IHtcblx0XHRpZiAodHlwZW9mIHJlc3VsdCA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRyZXN1bHQoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0cmVzdWx0Py51bmJpbmQ/LigpO1xuXHR9O1xufTtcbnZhciBlbnN1cmVSZWdpc3RlcmVkTnVtYmVyUHJvcGVydHkgPSAod2luLCBuYW1lLCBpbml0aWFsVmFsdWUpID0+IHtcblx0aWYgKHJlZ2lzdGVyZWRQcm9wZXJ0aWVzLmhhcyhuYW1lKSkgcmV0dXJuO1xuXHRyZWdpc3RlcmVkUHJvcGVydGllcy5hZGQobmFtZSk7XG5cdHRyeSB7XG5cdFx0KHdpbj8uQ1NTID8/IENTUyk/LnJlZ2lzdGVyUHJvcGVydHk/Lih7XG5cdFx0XHRuYW1lLFxuXHRcdFx0c3ludGF4OiBcIjxudW1iZXI+XCIsXG5cdFx0XHRpbml0aWFsVmFsdWU6IFN0cmluZyhpbml0aWFsVmFsdWUpLFxuXHRcdFx0aW5oZXJpdHM6IGZhbHNlXG5cdFx0fSk7XG5cdH0gY2F0Y2gge31cbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9BbmltYXRlLnRzXG52YXIgcGFyc2VQcm9wZXJ0eUxpc3QgPSAob3B0aW9ucywgZXh0cmEpID0+IHtcblx0aWYgKGV4dHJhIGluc3RhbmNlb2YgTWFwICYmIGV4dHJhLnNpemUgPiAwKSByZXR1cm4gQXJyYXkuZnJvbShleHRyYS52YWx1ZXMoKSk7XG5cdGNvbnN0IGZyb21LZXlmcmFtZXMgPSBvcHRpb25zLmtleWZyYW1lcz8ucHJvcGVydGllcztcblx0aWYgKGZyb21LZXlmcmFtZXMgaW5zdGFuY2VvZiBNYXAgJiYgZnJvbUtleWZyYW1lcy5zaXplID4gMCkgcmV0dXJuIEFycmF5LmZyb20oZnJvbUtleWZyYW1lcy52YWx1ZXMoKSk7XG5cdGNvbnN0IGZyb21TdHJpbmcgPSBbXTtcblx0aWYgKHR5cGVvZiBvcHRpb25zLnByb3BlcnRpZXMgPT0gXCJzdHJpbmdcIikge1xuXHRcdGNvbnN0IHByb3BzID0gb3B0aW9ucy5wcm9wZXJ0aWVzPy50cmltPy4oKT8uc3BsaXQ/LihcIjtcIik7XG5cdFx0ZnJvbVN0cmluZy5wdXNoKC4uLkFycmF5LmZyb20ocHJvcHMgfHwgW10pPy5tYXA/LigoJHBhaXIpID0+IHtcblx0XHRcdGlmICgkcGFpcj8uaW5jbHVkZXM/LihcIjpcIikpIHtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSAoJHBhaXI/LnNwbGl0Py4oXCI6XCIpID8/IFtdKT8uc2xpY2U/LigxLCAtMSk/LmpvaW4/LihcIjpcIik7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0cHJvcGVydHk6ICgkcGFpcj8uWzBdKT8udHJpbT8uKCksXG5cdFx0XHRcdFx0dmFsdWVzOiBbdmFsdWU/LnRyaW0/LigpXVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSk/LmZpbHRlcj8uKChhKSA9PiBhICE9IG51bGwpIHx8IFtdKTtcblx0XHRyZXR1cm4gZnJvbVN0cmluZztcblx0fVxuXHRpZiAoQXJyYXkuaXNBcnJheShvcHRpb25zLnByb3BlcnRpZXMpKSByZXR1cm4gb3B0aW9ucy5wcm9wZXJ0aWVzLm1hcCgoaXRlbSwgaSkgPT4ge1xuXHRcdGlmIChpdGVtICYmIEFycmF5LmlzQXJyYXkoaXRlbS52YWx1ZXMpICYmIGl0ZW0ucHJvcGVydHkpIHJldHVybiBpdGVtO1xuXHRcdGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhpdGVtIHx8IHt9KS5maWx0ZXIoKFtrXSkgPT4gayAhPT0gXCJvZmZzZXRcIiAmJiBrICE9PSBcImVhc2luZ1wiKTtcblx0XHRjb25zdCB2YWx1ZSA9IGVudHJpZXNbMF0/LlsxXTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJvcGVydHk6IGVudHJpZXNbMF0/LlswXSA/PyBgcCR7aX1gLFxuXHRcdFx0dmFsdWVzOiB2YWx1ZSA9PSBudWxsID8gW10gOiBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW3ZhbHVlXVxuXHRcdH07XG5cdH0pO1xuXHRpZiAob3B0aW9ucy5wcm9wZXJ0aWVzICYmIHR5cGVvZiBvcHRpb25zLnByb3BlcnRpZXMgPT09IFwib2JqZWN0XCIpIHJldHVybiBPYmplY3QuZW50cmllcyhvcHRpb25zLnByb3BlcnRpZXMpLm1hcCgoW3Byb3BlcnR5LCB2YWx1ZXNdKSA9PiAoe1xuXHRcdHByb3BlcnR5LFxuXHRcdHZhbHVlczogQXJyYXkuaXNBcnJheSh2YWx1ZXMpID8gdmFsdWVzIDogW3ZhbHVlc11cblx0fSkpO1xuXHRyZXR1cm4gZnJvbVN0cmluZztcbn07XG52YXIgcGFyc2VBbmltYXRpb25UZW1wbGF0ZSA9IChzdHJpbmdzLCB2YWx1ZXMpID0+IHtcblx0Y29uc3QgcHJvcGVydGllcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdGxldCBmdWxsVGV4dCA9IFwiXCI7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgc3RyaW5ncy5sZW5ndGg7IGkrKykge1xuXHRcdGZ1bGxUZXh0ICs9IHN0cmluZ3NbaV07XG5cdFx0aWYgKGkgPCB2YWx1ZXMubGVuZ3RoKSBmdWxsVGV4dCArPSBgX19TTE9UXyR7aX1fX2A7XG5cdH1cblx0Y29uc3QgZGVjbGFyYXRpb25zID0gZnVsbFRleHQuc3BsaXQoXCI7XCIpLm1hcCgocykgPT4gcy50cmltKCkpLmZpbHRlcihCb29sZWFuKTtcblx0Zm9yIChjb25zdCBkZWNsYXJhdGlvbiBvZiBkZWNsYXJhdGlvbnMpIHtcblx0XHRjb25zdCBjb2xvbkluZGV4ID0gZGVjbGFyYXRpb24uaW5kZXhPZihcIjpcIik7XG5cdFx0aWYgKGNvbG9uSW5kZXggPT09IC0xKSBjb250aW51ZTtcblx0XHRjb25zdCBwcm9wZXJ0eSA9IGRlY2xhcmF0aW9uLnNsaWNlKDAsIGNvbG9uSW5kZXgpLnRyaW0oKTtcblx0XHRjb25zdCB2YWx1ZVRleHQgPSBkZWNsYXJhdGlvbi5zbGljZShjb2xvbkluZGV4ICsgMSkudHJpbSgpO1xuXHRcdGNvbnN0IHNsb3RNYXRjaCA9IC9fX1NMT1RfKFxcZCspX18vLmV4ZWModmFsdWVUZXh0KTtcblx0XHRpZiAoIXNsb3RNYXRjaCkgY29udGludWU7XG5cdFx0Y29uc3Qgc2xvdFZhbHVlID0gdmFsdWVzW3BhcnNlSW50KHNsb3RNYXRjaFsxXSwgMTApXTtcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkoc2xvdFZhbHVlKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihgQVxcYCR7cHJvcGVydHl9XFxgIGV4cGVjdHMgYW4gYXJyYXkgb2YgdmFsdWVzLCBnb3QgJHt0eXBlb2Ygc2xvdFZhbHVlfWApO1xuXHRcdHByb3BlcnRpZXMuc2V0KHByb3BlcnR5LCB7XG5cdFx0XHRwcm9wZXJ0eSxcblx0XHRcdHZhbHVlczogc2xvdFZhbHVlXG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIHsgcHJvcGVydGllcyB9O1xufTtcbnZhciBwcm9jZXNzQW5pbWF0aW9uVmFsdWVzID0gKHZhbHVlcykgPT4ge1xuXHRjb25zdCByZXNvbHZlZCA9IFtdO1xuXHRjb25zdCByZWFjdGl2ZUluZGljZXMgPSBbXTtcblx0bGV0IGhhc1JlYWN0aXZlID0gZmFsc2U7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSB2YWx1ZXNbaV07XG5cdFx0aWYgKGlzUmVhY3RpdmVTdHlsZVZhbHVlKHZhbHVlKSkge1xuXHRcdFx0aGFzUmVhY3RpdmUgPSB0cnVlO1xuXHRcdFx0cmVhY3RpdmVJbmRpY2VzLnB1c2goaSk7XG5cdFx0XHRyZXNvbHZlZC5wdXNoKHZhbHVlLnZhbHVlKTtcblx0XHR9IGVsc2UgaWYgKGlzTmF0aXZlQ1NTU3R5bGVWYWx1ZSh2YWx1ZSkpIHJlc29sdmVkLnB1c2godmFsdWUpO1xuXHRcdGVsc2UgcmVzb2x2ZWQucHVzaCh2YWx1ZSk7XG5cdH1cblx0cmV0dXJuIHtcblx0XHRyZXNvbHZlZCxcblx0XHRoYXNSZWFjdGl2ZSxcblx0XHRyZWFjdGl2ZUluZGljZXNcblx0fTtcbn07XG52YXIgYnVpbGRXZWJBbmltYXRpb25LZXlmcmFtZXMgPSAob3B0aW9ucywgZXh0cmEpID0+IHtcblx0Y29uc3QgZ2xvYmFsT2Zmc2V0cyA9IG9wdGlvbnM/Lm9mZnNldHM7XG5cdGNvbnN0IHByb3BlcnR5TGlzdCA9IHBhcnNlUHJvcGVydHlMaXN0KG9wdGlvbnMsIGV4dHJhKTtcblx0aWYgKHByb3BlcnR5TGlzdC5sZW5ndGggPT09IDApIHRocm93IG5ldyBFcnJvcihcIk5vIGFuaW1hdGFibGUgcHJvcGVydGllcyBmb3VuZCBpbiBBIHRlbXBsYXRlXCIpO1xuXHRjb25zdCBtYXhMZW5ndGggPSBNYXRoLm1heCguLi5wcm9wZXJ0eUxpc3QubWFwKChwKSA9PiBwLnZhbHVlcy5sZW5ndGgpKTtcblx0Y29uc3Qgb2Zmc2V0cyA9IChnbG9iYWxPZmZzZXRzPy5sZW5ndGggPiAxID8gZ2xvYmFsT2Zmc2V0cyA6IG51bGwpIHx8IEFycmF5LmZyb20oeyBsZW5ndGg6IG1heExlbmd0aCB9LCAoXywgaSkgPT4gaSAvIChtYXhMZW5ndGggLSAxKSk7XG5cdGNvbnN0IGZyYW1lcyA9IFtdO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IG1heExlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3QgZnJhbWUgPSB7IG9mZnNldDogb2Zmc2V0c1tpXSA/PyBpIC8gKG1heExlbmd0aCAtIDEpIH07XG5cdFx0Zm9yIChjb25zdCBwcm9wIG9mIHByb3BlcnR5TGlzdCkge1xuXHRcdFx0Y29uc3QgeyByZXNvbHZlZCB9ID0gcHJvY2Vzc0FuaW1hdGlvblZhbHVlcyhwcm9wLnZhbHVlcyk7XG5cdFx0XHRjb25zdCBrZWJhYlByb3AgPSBjYW1lbFRvS2ViYWIocHJvcC5wcm9wZXJ0eSk7XG5cdFx0XHRsZXQgdmFsdWUgPSByZXNvbHZlZFtNYXRoLm1pbihpLCByZXNvbHZlZC5sZW5ndGggLSAxKV07XG5cdFx0XHRpZiAoaXNOYXRpdmVDU1NTdHlsZVZhbHVlKHZhbHVlKSkgdmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuXHRcdFx0ZnJhbWVba2ViYWJQcm9wXSA9IHZhbHVlO1xuXHRcdH1cblx0XHRmcmFtZXMucHVzaChmcmFtZSk7XG5cdH1cblx0cmV0dXJuIGZyYW1lcztcbn07XG52YXIgYnVpbGRBbmltYXRpb25UaW1pbmcgPSAob3B0aW9ucykgPT4ge1xuXHRjb25zdCBkdXJhdGlvbiA9IHBhcnNlVGltZShvcHRpb25zLmR1cmF0aW9uID8/IDMwMCk7XG5cdGNvbnN0IGRlbGF5ID0gcGFyc2VUaW1lKG9wdGlvbnMuZGVsYXkgPz8gMCk7XG5cdGNvbnN0IGl0ZXJhdGlvbnMgPSBub3JtYWxpemVJdGVyYXRpb25Db3VudChvcHRpb25zLml0ZXJhdGlvbkNvdW50KTtcblx0cmV0dXJuIHtcblx0XHRkdXJhdGlvbixcblx0XHRkZWxheSxcblx0XHRjb21wb3NpdGU6IG9wdGlvbnMuY29tcG9zaXRlIHx8IFwicmVwbGFjZVwiLFxuXHRcdGl0ZXJhdGlvbnM6IGl0ZXJhdGlvbnMgPT09IFwiSW5maW5pdHlcIiA/IEluZmluaXR5IDogaXRlcmF0aW9ucyxcblx0XHRmaWxsOiBvcHRpb25zLmZpbGxNb2RlID8/IFwibm9uZVwiLFxuXHRcdGRpcmVjdGlvbjogb3B0aW9ucy5kaXJlY3Rpb24gPz8gXCJub3JtYWxcIixcblx0XHRlYXNpbmc6IHR5cGVvZiBvcHRpb25zLmVhc2luZyA9PT0gXCJzdHJpbmdcIiA/IG9wdGlvbnMuZWFzaW5nIDogXCJsaW5lYXJcIixcblx0XHR0aW1lbGluZTogb3B0aW9ucy50aW1lbGluZVxuXHR9O1xufTtcbnZhciBjcmVhdGVSZWFjdGl2ZUFuaW1hdGlvbiA9IChlbGVtZW50LCBvcHRpb25zKSA9PiB7XG5cdGNvbnN0IHByb3BlcnR5TGlzdCA9IHBhcnNlUHJvcGVydHlMaXN0KG9wdGlvbnMpO1xuXHRjb25zdCBzdWJzY3JpcHRpb25zID0gW107XG5cdGNvbnN0IGZyYW1lcyA9IGJ1aWxkV2ViQW5pbWF0aW9uS2V5ZnJhbWVzKG9wdGlvbnMpO1xuXHRjb25zdCB0aW1pbmcgPSBidWlsZEFuaW1hdGlvblRpbWluZyhvcHRpb25zKTtcblx0Y29uc3QgYW5pbWF0aW9uID0gZWxlbWVudC5hbmltYXRlKGZyYW1lcywgdGltaW5nKTtcblx0Zm9yIChjb25zdCBwcm9wIG9mIHByb3BlcnR5TGlzdCkge1xuXHRcdGNvbnN0IHsgaGFzUmVhY3RpdmUsIHJlYWN0aXZlSW5kaWNlcyB9ID0gcHJvY2Vzc0FuaW1hdGlvblZhbHVlcyhwcm9wLnZhbHVlcyk7XG5cdFx0aWYgKCFoYXNSZWFjdGl2ZSkgY29udGludWU7XG5cdFx0Zm9yIChjb25zdCBpbmRleCBvZiByZWFjdGl2ZUluZGljZXMpIHtcblx0XHRcdGNvbnN0IHJlYWN0aXZlVmFsdWUgPSBwcm9wLnZhbHVlc1tpbmRleF07XG5cdFx0XHRjb25zdCBzdWJzY3JpcHRpb24gPSBiaW5kV2l0aChlbGVtZW50LCBgLS1hbmltLSR7cHJvcC5wcm9wZXJ0eX0tJHtpbmRleH1gLCByZWFjdGl2ZVZhbHVlLCAoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IG5ld0ZyYW1lcyA9IGJ1aWxkV2ViQW5pbWF0aW9uS2V5ZnJhbWVzKG9wdGlvbnMpO1xuXHRcdFx0XHRjb25zdCBjdXJyZW50VGltZSA9IGFuaW1hdGlvbi5jdXJyZW50VGltZTtcblx0XHRcdFx0YW5pbWF0aW9uLmVmZmVjdCA9IG5ldyBLZXlmcmFtZUVmZmVjdChlbGVtZW50LCBuZXdGcmFtZXMsIHRpbWluZyk7XG5cdFx0XHRcdGlmIChjdXJyZW50VGltZSAhPT0gbnVsbCkgYW5pbWF0aW9uLmN1cnJlbnRUaW1lID0gY3VycmVudFRpbWU7XG5cdFx0XHR9KTtcblx0XHRcdHN1YnNjcmlwdGlvbnMucHVzaChzdWJzY3JpcHRpb24pO1xuXHRcdH1cblx0fVxuXHRjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xuXHRcdGFuaW1hdGlvbi5jYW5jZWwoKTtcblx0XHRzdWJzY3JpcHRpb25zLmZvckVhY2goKHN1YikgPT4gc3ViKCkpO1xuXHR9O1xuXHRyZXR1cm4ge1xuXHRcdGFuaW1hdGlvbixcblx0XHRjbGVhbnVwXG5cdH07XG59O1xudmFyIEEgPSAoc3RyaW5ncywgLi4udmFsdWVzKSA9PiB7XG5cdHJldHVybiBwYXJzZUFuaW1hdGlvblRlbXBsYXRlKHN0cmluZ3MsIHZhbHVlcyk7XG59O1xudmFyIGRvQW5pbWF0aW9uID0gKGVsZW1lbnQsIGNvbmZpZywga2V5ZnJhbWVzKSA9PiB7XG5cdGNvbnN0IGNhbkFuaW1hdGUgPSBlbGVtZW50ICE9IG51bGwgJiYgdHlwZW9mIGVsZW1lbnQuYW5pbWF0ZSA9PT0gXCJmdW5jdGlvblwiO1xuXHRpZiAoISh0eXBlb2YgRWxlbWVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBlbGVtZW50IGluc3RhbmNlb2YgRWxlbWVudCkgJiYgIWNhbkFuaW1hdGUpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJkb0FuaW1hdGlvbiByZXF1aXJlcyBhbiBFbGVtZW50XCIpO1xuXHRpZiAocGFyc2VQcm9wZXJ0eUxpc3QoY29uZmlnLCBrZXlmcmFtZXMpLnNvbWUoKHByb3ApID0+IHtcblx0XHRjb25zdCB7IGhhc1JlYWN0aXZlIH0gPSBwcm9jZXNzQW5pbWF0aW9uVmFsdWVzKHByb3AudmFsdWVzKTtcblx0XHRyZXR1cm4gaGFzUmVhY3RpdmU7XG5cdH0pKSByZXR1cm4gY3JlYXRlUmVhY3RpdmVBbmltYXRpb24oZWxlbWVudCwgY29uZmlnKTtcblx0Y29uc3QgZnJhbWVzID0gYnVpbGRXZWJBbmltYXRpb25LZXlmcmFtZXMoY29uZmlnLCBrZXlmcmFtZXMpO1xuXHRjb25zdCB0aW1pbmcgPSBidWlsZEFuaW1hdGlvblRpbWluZyhjb25maWcpO1xuXHRjb25zdCBhbmltYXRpb24gPSBlbGVtZW50LmFuaW1hdGUoZnJhbWVzLCB0aW1pbmcpO1xuXHRjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xuXHRcdGFuaW1hdGlvbi5jYW5jZWwoKTtcblx0fTtcblx0cmV0dXJuIHtcblx0XHRhbmltYXRpb24sXG5cdFx0Y2xlYW51cFxuXHR9O1xufTtcbnZhciBhbmltYXRlID0gKGVsZW1lbnQsIG9wdGlvbnMpID0+IHtcblx0Y29uc3QgcHJvcGVydGllcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdGNvbnN0IHJlY29yZCA9IG9wdGlvbnMucHJvcGVydGllcztcblx0aWYgKHJlY29yZCA9PSBudWxsIHx8IHR5cGVvZiByZWNvcmQgPT09IFwic3RyaW5nXCIgfHwgQXJyYXkuaXNBcnJheShyZWNvcmQpKSByZXR1cm4gZG9BbmltYXRpb24oZWxlbWVudCwgb3B0aW9ucyk7XG5cdGZvciAoY29uc3QgW3Byb3BlcnR5LCB2YWx1ZXNdIG9mIE9iamVjdC5lbnRyaWVzKHJlY29yZCkpIHtcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkodmFsdWVzKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihgYW5pbWF0ZSgpIGV4cGVjdHMgYXJyYXlzIG9mIHZhbHVlcywgZ290ICR7dHlwZW9mIHZhbHVlc30gZm9yICR7cHJvcGVydHl9YCk7XG5cdFx0cHJvcGVydGllcy5zZXQocHJvcGVydHksIHtcblx0XHRcdHByb3BlcnR5LFxuXHRcdFx0dmFsdWVzXG5cdFx0fSk7XG5cdH1cblx0cmV0dXJuIGRvQW5pbWF0aW9uKGVsZW1lbnQsIHsgLi4ub3B0aW9ucyB9LCBwcm9wZXJ0aWVzKTtcbn07XG52YXIgZGVmaW5lQW5pbWF0aW9uID0gKG9wdGlvbnMpID0+IHtcblx0cmV0dXJuIChlbGVtZW50KSA9PiB7XG5cdFx0cmV0dXJuIGRvQW5pbWF0aW9uKGVsZW1lbnQsIG9wdGlvbnMpO1xuXHR9O1xufTtcbnZhciBzZXF1ZW5jZUFuaW1hdGlvbnMgPSBhc3luYyAoZWxlbWVudCwgc2VxdWVuY2UpID0+IHtcblx0Zm9yIChjb25zdCBjb25maWcgb2Ygc2VxdWVuY2UpIHtcblx0XHRjb25zdCB7IGFuaW1hdGlvbiB9ID0gZG9BbmltYXRpb24oZWxlbWVudCwgY29uZmlnKTtcblx0XHRhd2FpdCBhbmltYXRpb24uZmluaXNoZWQ7XG5cdH1cbn07XG52YXIgcGFyYWxsZWxBbmltYXRpb25zID0gKGVsZW1lbnQsIGFuaW1hdGlvbnMpID0+IHtcblx0Y29uc3QgcmVzdWx0cyA9IGFuaW1hdGlvbnMubWFwKChjb25maWcpID0+IGRvQW5pbWF0aW9uKGVsZW1lbnQsIGNvbmZpZykpO1xuXHRjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xuXHRcdHJlc3VsdHMuZm9yRWFjaCgocikgPT4gci5jbGVhbnVwKCkpO1xuXHR9O1xuXHRyZXR1cm4ge1xuXHRcdGFuaW1hdGlvbnM6IHJlc3VsdHMubWFwKChyKSA9PiByLmFuaW1hdGlvbiksXG5cdFx0Y2xlYW51cFxuXHR9O1xufTtcbnZhciBzdGFnZ2VyQW5pbWF0aW9uID0gKGVsZW1lbnRzLCBvcHRpb25zLCBzdGFnZ2VyRGVsYXkgPSAxMDApID0+IHtcblx0cmV0dXJuIGVsZW1lbnRzLm1hcCgoZWxlbWVudCwgaW5kZXgpID0+IHtcblx0XHRjb25zdCBkZWxheSA9IHBhcnNlVGltZShvcHRpb25zPy5kZWxheSA/PyAwKSArIGluZGV4ICogc3RhZ2dlckRlbGF5O1xuXHRcdHJldHVybiBkb0FuaW1hdGlvbihlbGVtZW50LCB7XG5cdFx0XHQuLi5vcHRpb25zLFxuXHRcdFx0ZGVsYXlcblx0XHR9KTtcblx0fSk7XG59O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvY3NzLWFuaW1hdGlvbi50c1xudmFyIGlzUmVhY3RpdmVUcmlnZ2VyID0gKHQpID0+IHQgIT0gbnVsbCAmJiB0eXBlb2YgdCA9PT0gXCJvYmplY3RcIiAmJiAhaXNTY3JvbGxEcml2ZW4odCkgJiYgIWlzVmlld0RyaXZlbih0KSAmJiBcInZhbHVlXCIgaW4gdDtcbnZhciBhc1Byb3BlcnR5TGlzdCA9IChvcHRpb25zKSA9PiB7XG5cdGNvbnN0IGtmID0gb3B0aW9ucy5rZXlmcmFtZXM/LnByb3BlcnRpZXM7XG5cdGlmIChrZiBpbnN0YW5jZW9mIE1hcCkgcmV0dXJuIEFycmF5LmZyb20oa2YudmFsdWVzKCkpO1xuXHRjb25zdCBwcm9wcyA9IG9wdGlvbnMucHJvcGVydGllcztcblx0aWYgKHR5cGVvZiBwcm9wcyA9PT0gXCJzdHJpbmdcIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcInN0cmluZyBwcm9wZXJ0aWVzIGFyZSBub3QgdXNlZCBvbiB0aGUgQ1NTIGNvbXBpbGUgcGF0aFwiKTtcblx0aWYgKEFycmF5LmlzQXJyYXkocHJvcHMpKSByZXR1cm4gcHJvcHMubWFwKChpdGVtLCBpKSA9PiB7XG5cdFx0aWYgKGl0ZW0gJiYgQXJyYXkuaXNBcnJheShpdGVtLnZhbHVlcykgJiYgaXRlbS5wcm9wZXJ0eSkgcmV0dXJuIGl0ZW07XG5cdFx0Y29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKGl0ZW0gfHwge30pLmZpbHRlcigoW2tdKSA9PiBrICE9PSBcIm9mZnNldFwiICYmIGsgIT09IFwiZWFzaW5nXCIpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRwcm9wZXJ0eTogZW50cmllc1swXT8uWzBdID8/IGBwJHtpfWAsXG5cdFx0XHR2YWx1ZXM6IGVudHJpZXNbMF0gPyBbZW50cmllc1swXVsxXV0gOiBbXVxuXHRcdH07XG5cdH0pO1xuXHRpZiAocHJvcHMgJiYgdHlwZW9mIHByb3BzID09PSBcIm9iamVjdFwiKSByZXR1cm4gT2JqZWN0LmVudHJpZXMocHJvcHMpLm1hcCgoW3Byb3BlcnR5LCB2YWx1ZXNdKSA9PiAoe1xuXHRcdHByb3BlcnR5LFxuXHRcdHZhbHVlczogQXJyYXkuaXNBcnJheSh2YWx1ZXMpID8gdmFsdWVzIDogW3ZhbHVlc11cblx0fSkpO1xuXHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiTm8gYW5pbWF0YWJsZSBwcm9wZXJ0aWVzXCIpO1xufTtcbnZhciBzZXJpYWxpemVWYWx1ZSA9ICh2YWx1ZSkgPT4ge1xuXHRpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG5cdGNvbnN0IGlzRWxlbWVudCA9IHR5cGVvZiBFbGVtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIHZhbHVlIGluc3RhbmNlb2YgRWxlbWVudDtcblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiBcInZhbHVlXCIgaW4gdmFsdWUgJiYgIWlzRWxlbWVudCkgcmV0dXJuIFN0cmluZyh2YWx1ZS52YWx1ZSA/PyBcIlwiKTtcblx0cmV0dXJuIFN0cmluZyh2YWx1ZSk7XG59O1xudmFyIGNvbXBpbGVLZXlmcmFtZXNDc3MgPSAob3B0aW9ucykgPT4ge1xuXHRjb25zdCBsaXN0ID0gYXNQcm9wZXJ0eUxpc3Qob3B0aW9ucyk7XG5cdGNvbnN0IG1heExlbmd0aCA9IE1hdGgubWF4KDIsIC4uLmxpc3QubWFwKChwKSA9PiBwLnZhbHVlcy5sZW5ndGgpKTtcblx0Y29uc3Qgb2Zmc2V0cyA9IG9wdGlvbnMub2Zmc2V0cyA/PyBBcnJheS5mcm9tKHsgbGVuZ3RoOiBtYXhMZW5ndGggfSwgKF8sIGkpID0+IGkgLyAobWF4TGVuZ3RoIC0gMSkpO1xuXHRjb25zdCBmcmFtZXMgPSBbXTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBtYXhMZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IGRlY2xzID0gW107XG5cdFx0Zm9yIChjb25zdCBwcm9wIG9mIGxpc3QpIHtcblx0XHRcdGNvbnN0IHJhdyA9IHByb3AudmFsdWVzW01hdGgubWluKGksIHByb3AudmFsdWVzLmxlbmd0aCAtIDEpXTtcblx0XHRcdGRlY2xzLnB1c2goYCR7Y2FtZWxUb0tlYmFiKHByb3AucHJvcGVydHkpfTogJHtzZXJpYWxpemVWYWx1ZShyYXcpfWApO1xuXHRcdH1cblx0XHRjb25zdCBwY3QgPSBNYXRoLnJvdW5kKChvZmZzZXRzW2ldID8/IGkgLyAobWF4TGVuZ3RoIC0gMSkpICogMTAwKTtcblx0XHRmcmFtZXMucHVzaChgJHtwY3R9JSB7ICR7ZGVjbHMuam9pbihcIjsgXCIpfTsgfWApO1xuXHR9XG5cdGNvbnN0IGZpbmdlcnByaW50ID0gZnJhbWVzLmpvaW4oXCJ8XCIpO1xuXHRsZXQgaGFzaCA9IDA7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgZmluZ2VycHJpbnQubGVuZ3RoOyBpKyspIGhhc2ggPSBoYXNoICogMzEgKyBmaW5nZXJwcmludC5jaGFyQ29kZUF0KGkpIHwgMDtcblx0Y29uc3QgbmFtZSA9IGBmZXN0LWFuaW0tJHsoaGFzaCA+Pj4gMCkudG9TdHJpbmcoMzYpfWA7XG5cdHJldHVybiB7XG5cdFx0bmFtZSxcblx0XHRjc3NUZXh0OiBgQGtleWZyYW1lcyAke25hbWV9IHtcXG4ke2ZyYW1lcy5qb2luKFwiXFxuXCIpfVxcbn1gLFxuXHRcdGZpbmdlcnByaW50XG5cdH07XG59O1xudmFyIGNvbXBpbGVUcmlnZ2VyQ3NzID0gKHNlbGVjdG9yLCBvcHRpb25zKSA9PiB7XG5cdGNvbnN0IHRyaWdnZXIgPSBvcHRpb25zLnRyaWdnZXIgPz8gXCJtb3VudFwiO1xuXHRpZiAoaXNSZWFjdGl2ZVRyaWdnZXIodHJpZ2dlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJyZWFjdGl2ZSB7IHZhbHVlIH0gdHJpZ2dlciBpcyBub3QgdmFsaWQgb24gdGhlIENTUyBwYXRoXCIpO1xuXHRjb25zdCBjb21waWxlZCA9IGNvbXBpbGVLZXlmcmFtZXNDc3Mob3B0aW9ucyk7XG5cdGNvbnN0IGR1cmF0aW9uID0gYCR7cGFyc2VUaW1lKG9wdGlvbnMuZHVyYXRpb24sIDMwMCl9bXNgO1xuXHRjb25zdCBkZWxheSA9IGAke3BhcnNlVGltZShvcHRpb25zLmRlbGF5LCAwKX1tc2A7XG5cdGNvbnN0IGl0ZXJhdGlvbnMgPSBub3JtYWxpemVJdGVyYXRpb25Db3VudChvcHRpb25zLml0ZXJhdGlvbkNvdW50KTtcblx0Y29uc3QgcHJvcGVydGllcyA9IHtcblx0XHRcImFuaW1hdGlvbi1uYW1lXCI6IGNvbXBpbGVkLm5hbWUsXG5cdFx0XCJhbmltYXRpb24tZHVyYXRpb25cIjogZHVyYXRpb24sXG5cdFx0XCJhbmltYXRpb24tZGVsYXlcIjogZGVsYXksXG5cdFx0XCJhbmltYXRpb24taXRlcmF0aW9uLWNvdW50XCI6IGl0ZXJhdGlvbnMgPT09IFwiSW5maW5pdHlcIiB8fCBpdGVyYXRpb25zID09PSBJbmZpbml0eSA/IFwiaW5maW5pdGVcIiA6IFN0cmluZyhpdGVyYXRpb25zKSxcblx0XHRcImFuaW1hdGlvbi1kaXJlY3Rpb25cIjogb3B0aW9ucy5kaXJlY3Rpb24gPz8gXCJub3JtYWxcIixcblx0XHRcImFuaW1hdGlvbi1maWxsLW1vZGVcIjogb3B0aW9ucy5maWxsTW9kZSA/PyBcIm5vbmVcIixcblx0XHRcImFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb25cIjogdHlwZW9mIG9wdGlvbnMuZWFzaW5nID09PSBcInN0cmluZ1wiID8gb3B0aW9ucy5lYXNpbmcgOiBcImxpbmVhclwiXG5cdH07XG5cdGlmICh0cmlnZ2VyID09PSBcImhvdmVyXCIpIHtcblx0XHRpZiAob3B0aW9ucy5yZXZlcnNlT25FeGl0KSBwcm9wZXJ0aWVzW1wiYW5pbWF0aW9uLXRyaWdnZXJcIl0gPSBgJHtBTklNX1RSSUdHRVJfTkFNRX0gcGxheS1iYWNrd2FyZHNgO1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3RvcjogYCR7c2VsZWN0b3J9OmhvdmVyYCxcblx0XHRcdHByb3BlcnRpZXNcblx0XHR9O1xuXHR9XG5cdGlmICh0cmlnZ2VyID09PSBcImZvY3VzXCIpIHJldHVybiB7XG5cdFx0c2VsZWN0b3I6IGAke3NlbGVjdG9yfTpmb2N1c2AsXG5cdFx0cHJvcGVydGllc1xuXHR9O1xuXHRpZiAodHJpZ2dlciA9PT0gXCJzaG93XCIpIHJldHVybiB7XG5cdFx0c2VsZWN0b3I6IGAke3NlbGVjdG9yfTpub3QoW2RhdGEtaGlkZGVuXSlgLFxuXHRcdHByb3BlcnRpZXNcblx0fTtcblx0aWYgKHRyaWdnZXIgPT09IFwiaGlkZVwiKSByZXR1cm4ge1xuXHRcdHNlbGVjdG9yOiBgJHtzZWxlY3Rvcn1bZGF0YS1oaWRkZW5dYCxcblx0XHRwcm9wZXJ0aWVzXG5cdH07XG5cdGlmICh0cmlnZ2VyID09PSBcInJlbW92ZVwiKSByZXR1cm4ge1xuXHRcdHNlbGVjdG9yOiBgJHtzZWxlY3Rvcn1bZGF0YS1yZW1vdmluZ11gLFxuXHRcdHByb3BlcnRpZXNcblx0fTtcblx0aWYgKHRyaWdnZXIgPT09IFwibWFudWFsXCIpIHtcblx0XHRwcm9wZXJ0aWVzW1wiYW5pbWF0aW9uLXBsYXktc3RhdGVcIl0gPSBcInBhdXNlZFwiO1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3Rvcixcblx0XHRcdHByb3BlcnRpZXNcblx0XHR9O1xuXHR9XG5cdGlmICh0cmlnZ2VyID09PSBcImNsaWNrXCIpIHtcblx0XHRwcm9wZXJ0aWVzW1wiZXZlbnQtdHJpZ2dlclwiXSA9IGAke0FOSU1fVFJJR0dFUl9OQU1FfSBjbGlja2A7XG5cdFx0cHJvcGVydGllc1tcImFuaW1hdGlvbi10cmlnZ2VyXCJdID0gYCR7QU5JTV9UUklHR0VSX05BTUV9IHBsYXlgO1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3Rvcixcblx0XHRcdHByb3BlcnRpZXNcblx0XHR9O1xuXHR9XG5cdGlmICh0cmlnZ2VyID09PSBcInZpc2libGVcIikge1xuXHRcdHByb3BlcnRpZXNbXCJ0aW1lbGluZS10cmlnZ2VyXCJdID0gYCR7QU5JTV9UUklHR0VSX05BTUV9IHZpZXcgY29udGFpbmA7XG5cdFx0cHJvcGVydGllc1tcImFuaW1hdGlvbi10cmlnZ2VyXCJdID0gYCR7QU5JTV9UUklHR0VSX05BTUV9IHBsYXlgO1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3Rvcixcblx0XHRcdHByb3BlcnRpZXNcblx0XHR9O1xuXHR9XG5cdGlmIChpc1Njcm9sbERyaXZlbih0cmlnZ2VyKSB8fCBpc1ZpZXdEcml2ZW4odHJpZ2dlcikpIHtcblx0XHRjb25zdCBraW5kID0gaXNWaWV3RHJpdmVuKHRyaWdnZXIpID8gXCJ2aWV3XCIgOiBcInNjcm9sbFwiO1xuXHRcdHByb3BlcnRpZXNbXCJ0aW1lbGluZS10cmlnZ2VyXCJdID0gYCR7QU5JTV9UUklHR0VSX05BTUV9ICR7a2luZH1gO1xuXHRcdGlmICh0cmlnZ2VyLnJhbmdlU3RhcnQpIHByb3BlcnRpZXNbXCJhbmltYXRpb24tcmFuZ2Utc3RhcnRcIl0gPSB0cmlnZ2VyLnJhbmdlU3RhcnQ7XG5cdFx0aWYgKHRyaWdnZXIucmFuZ2VFbmQpIHByb3BlcnRpZXNbXCJhbmltYXRpb24tcmFuZ2UtZW5kXCJdID0gdHJpZ2dlci5yYW5nZUVuZDtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2VsZWN0b3IsXG5cdFx0XHRwcm9wZXJ0aWVzXG5cdFx0fTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdHNlbGVjdG9yLFxuXHRcdHByb3BlcnRpZXNcblx0fTtcbn07XG52YXIgcmVzb2x2ZUNzc0FuaW1hdGlvblRhcmdldCA9ICh0YXJnZXQsIG9wdGlvbnMpID0+IHtcblx0aWYgKHR5cGVvZiBFbGVtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIHRhcmdldCBpbnN0YW5jZW9mIEVsZW1lbnQpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJiaW5kQ3NzQW5pbWF0aW9uIGRvZXMgbm90IGFjY2VwdCBFbGVtZW50XCIpO1xuXHRpZiAodHlwZW9mIENTU1N0eWxlRGVjbGFyYXRpb24gIT09IFwidW5kZWZpbmVkXCIgJiYgdGFyZ2V0IGluc3RhbmNlb2YgQ1NTU3R5bGVEZWNsYXJhdGlvbikge1xuXHRcdGNvbnN0IHJ1bGUgPSB0YXJnZXQucGFyZW50UnVsZTtcblx0XHRpZiAoIXJ1bGUpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDU1NTdHlsZURlY2xhcmF0aW9uIGhhcyBubyBwYXJlbnRSdWxlXCIpO1xuXHRcdHJldHVybiByZXNvbHZlQ3NzQW5pbWF0aW9uVGFyZ2V0KHJ1bGUsIG9wdGlvbnMpO1xuXHR9XG5cdGlmICh0eXBlb2YgQ1NTU3R5bGVSdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIHRhcmdldCBpbnN0YW5jZW9mIENTU1N0eWxlUnVsZSkge1xuXHRcdGNvbnN0IHNoZWV0ID0gdGFyZ2V0LnBhcmVudFN0eWxlU2hlZXQ7XG5cdFx0aWYgKCFzaGVldCkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNTU1N0eWxlUnVsZSBoYXMgbm8gcGFyZW50U3R5bGVTaGVldFwiKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2hlZXQsXG5cdFx0XHRydWxlOiB0YXJnZXQsXG5cdFx0XHRzZWxlY3RvcjogdGFyZ2V0LnNlbGVjdG9yVGV4dFxuXHRcdH07XG5cdH1cblx0aWYgKHR5cGVvZiBDU1NTdHlsZVNoZWV0ICE9PSBcInVuZGVmaW5lZFwiICYmIHRhcmdldCBpbnN0YW5jZW9mIENTU1N0eWxlU2hlZXQpIHtcblx0XHRjb25zdCBzZWxlY3RvciA9IG9wdGlvbnMuc2VsZWN0b3I7XG5cdFx0aWYgKCFzZWxlY3RvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNTU1N0eWxlU2hlZXQgYmluZCByZXF1aXJlcyBvcHRpb25zLnNlbGVjdG9yXCIpO1xuXHRcdHJldHVybiB7XG5cdFx0XHRzaGVldDogdGFyZ2V0LFxuXHRcdFx0cnVsZTogbnVsbCxcblx0XHRcdHNlbGVjdG9yXG5cdFx0fTtcblx0fVxuXHR0aHJvdyBuZXcgVHlwZUVycm9yKFwiYmluZENzc0FuaW1hdGlvbiB0YXJnZXQgbXVzdCBiZSBhIENTU1N0eWxlUnVsZSwgQ1NTU3R5bGVTaGVldCwgb3IgQ1NTU3R5bGVEZWNsYXJhdGlvblwiKTtcbn07XG52YXIgZGVjbGFyYXRpb25zVG9UZXh0ID0gKHByb3BlcnRpZXMpID0+IE9iamVjdC5lbnRyaWVzKHByb3BlcnRpZXMpLm1hcCgoW2ssIHZdKSA9PiBgJHtrfTogJHt2fTtgKS5qb2luKFwiIFwiKTtcbnZhciBiaW5kQ3NzQW5pbWF0aW9uID0gKHRhcmdldCwgb3B0aW9ucykgPT4ge1xuXHRjb25zdCBjb21waWxlZCA9IGNvbXBpbGVLZXlmcmFtZXNDc3Mob3B0aW9ucyk7XG5cdGxldCBzaGVldDtcblx0bGV0IHNlbGVjdG9yO1xuXHRpZiAodGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQuaW5zZXJ0UnVsZSA9PT0gXCJmdW5jdGlvblwiICYmIHRhcmdldC5jc3NSdWxlcyAmJiBvcHRpb25zLnNlbGVjdG9yKSB7XG5cdFx0c2hlZXQgPSB0YXJnZXQ7XG5cdFx0c2VsZWN0b3IgPSBvcHRpb25zLnNlbGVjdG9yO1xuXHR9IGVsc2Uge1xuXHRcdGNvbnN0IHJlc29sdmVkID0gcmVzb2x2ZUNzc0FuaW1hdGlvblRhcmdldCh0YXJnZXQsIG9wdGlvbnMpO1xuXHRcdHNoZWV0ID0gcmVzb2x2ZWQuc2hlZXQ7XG5cdFx0c2VsZWN0b3IgPSByZXNvbHZlZC5zZWxlY3Rvcjtcblx0fVxuXHRjb25zdCB0cmlnZ2VyID0gY29tcGlsZVRyaWdnZXJDc3Moc2VsZWN0b3IsIG9wdGlvbnMpO1xuXHRjb25zdCBsYXllciA9IGdldE9yQ3JlYXRlTGF5ZXJSdWxlKHNoZWV0LCBcInV4LWFuaW1cIikgPz8gc2hlZXQ7XG5cdGNvbnN0IGhvc3QgPSBsYXllci5pbnNlcnRSdWxlID8gbGF5ZXIgOiBzaGVldDtcblx0bGV0IGVudHJ5ID0gYW5pbUtleWZyYW1lUmVmcy5nZXQoY29tcGlsZWQuZmluZ2VycHJpbnQpO1xuXHRpZiAoIWVudHJ5KSB7XG5cdFx0aG9zdC5pbnNlcnRSdWxlKGNvbXBpbGVkLmNzc1RleHQsIGhvc3QuY3NzUnVsZXM/Lmxlbmd0aCA/PyAwKTtcblx0XHRjb25zdCBrZXlmcmFtZXNSdWxlID0gaG9zdC5jc3NSdWxlcz8uW2hvc3QuY3NzUnVsZXMubGVuZ3RoIC0gMV07XG5cdFx0ZW50cnkgPSB7XG5cdFx0XHRuYW1lOiBjb21waWxlZC5uYW1lLFxuXHRcdFx0Y291bnQ6IDAsXG5cdFx0XHRrZXlmcmFtZXNSdWxlLFxuXHRcdFx0aG9zdHM6IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCksXG5cdFx0XHRob3N0Q291bnRzOiAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpXG5cdFx0fTtcblx0XHRhbmltS2V5ZnJhbWVSZWZzLnNldChjb21waWxlZC5maW5nZXJwcmludCwgZW50cnkpO1xuXHR9IGVsc2UgaWYgKCFlbnRyeS5ob3N0cy5oYXMoaG9zdCkpIHtcblx0XHRob3N0Lmluc2VydFJ1bGUoY29tcGlsZWQuY3NzVGV4dCwgaG9zdC5jc3NSdWxlcz8ubGVuZ3RoID8/IDApO1xuXHRcdGlmICghZW50cnkua2V5ZnJhbWVzUnVsZSkgZW50cnkua2V5ZnJhbWVzUnVsZSA9IGhvc3QuY3NzUnVsZXM/Lltob3N0LmNzc1J1bGVzLmxlbmd0aCAtIDFdO1xuXHR9XG5cdGVudHJ5Lmhvc3RDb3VudHMgPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdGVudHJ5LmNvdW50ICs9IDE7XG5cdGVudHJ5Lmhvc3RzLmFkZChob3N0KTtcblx0ZW50cnkuaG9zdENvdW50cy5zZXQoaG9zdCwgKGVudHJ5Lmhvc3RDb3VudHMuZ2V0KGhvc3QpID8/IDApICsgMSk7XG5cdGNvbnN0IGNvbXBhbmlvblRleHQgPSBgJHt0cmlnZ2VyLnNlbGVjdG9yfSB7ICR7ZGVjbGFyYXRpb25zVG9UZXh0KHRyaWdnZXIucHJvcGVydGllcyl9IH1gO1xuXHRjb25zdCBjb21wYW5pb25JbmRleCA9IGhvc3QuaW5zZXJ0UnVsZShjb21wYW5pb25UZXh0LCBob3N0LmNzc1J1bGVzPy5sZW5ndGggPz8gMCk7XG5cdGNvbnN0IGNvbXBhbmlvblJ1bGUgPSBob3N0LmNzc1J1bGVzPy5bY29tcGFuaW9uSW5kZXhdO1xuXHRjb25zdCBkZWxldGVLZXlmcmFtZXNGcm9tID0gKHNoZWV0SG9zdCkgPT4ge1xuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBydWxlcyA9IEFycmF5LmZyb20oc2hlZXRIb3N0LmNzc1J1bGVzIHx8IFtdKTtcblx0XHRcdGxldCBpZHggPSBydWxlcy5pbmRleE9mKGVudHJ5LmtleWZyYW1lc1J1bGUpO1xuXHRcdFx0aWYgKGlkeCA8IDApIGlkeCA9IHJ1bGVzLmZpbmRJbmRleCgocikgPT4gU3RyaW5nKHI/LmNzc1RleHQgfHwgXCJcIikuaW5jbHVkZXMoYEBrZXlmcmFtZXMgJHtlbnRyeS5uYW1lfWApKTtcblx0XHRcdGlmIChpZHggPj0gMCkgc2hlZXRIb3N0LmRlbGV0ZVJ1bGUoaWR4KTtcblx0XHR9IGNhdGNoIHt9XG5cdH07XG5cdGxldCBkZWFkID0gZmFsc2U7XG5cdHJldHVybiAoKSA9PiB7XG5cdFx0aWYgKGRlYWQpIHJldHVybjtcblx0XHRkZWFkID0gdHJ1ZTtcblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgaWR4ID0gQXJyYXkuZnJvbShob3N0LmNzc1J1bGVzIHx8IFtdKS5pbmRleE9mKGNvbXBhbmlvblJ1bGUpO1xuXHRcdFx0aWYgKGlkeCA+PSAwKSBob3N0LmRlbGV0ZVJ1bGUoaWR4KTtcblx0XHR9IGNhdGNoIHt9XG5cdFx0ZW50cnkuY291bnQgLT0gMTtcblx0XHRjb25zdCBuZXh0SG9zdENvdW50ID0gKGVudHJ5Lmhvc3RDb3VudHM/LmdldChob3N0KSA/PyAxKSAtIDE7XG5cdFx0aWYgKG5leHRIb3N0Q291bnQgPD0gMCkge1xuXHRcdFx0ZW50cnkuaG9zdENvdW50cz8uZGVsZXRlKGhvc3QpO1xuXHRcdFx0ZW50cnkuaG9zdHMuZGVsZXRlKGhvc3QpO1xuXHRcdFx0ZGVsZXRlS2V5ZnJhbWVzRnJvbShob3N0KTtcblx0XHR9IGVsc2UgZW50cnkuaG9zdENvdW50cz8uc2V0KGhvc3QsIG5leHRIb3N0Q291bnQpO1xuXHRcdGlmIChlbnRyeS5jb3VudCA8PSAwKSB7XG5cdFx0XHRmb3IgKGNvbnN0IGxlZnRvdmVyIG9mIGVudHJ5Lmhvc3RzKSBkZWxldGVLZXlmcmFtZXNGcm9tKGxlZnRvdmVyKTtcblx0XHRcdGFuaW1LZXlmcmFtZVJlZnMuZGVsZXRlKGNvbXBpbGVkLmZpbmdlcnByaW50KTtcblx0XHR9XG5cdH07XG59O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiAuLi9kb20udHMvc3JjL21peGluL09ic2VydmVyLnRzXG52YXIgb25Cb3JkZXJPYnNlcnZlU3ltYm9sID0gU3ltYm9sLmZvcihcImRvbS50c0BvbkJvcmRlck9ic2VydmVcIik7XG52YXIgb25Cb3JkZXJPYnNlcnZlID0gZ2xvYmFsVGhpc1tvbkJvcmRlck9ic2VydmVTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBvbkNvbnRlbnRPYnNlcnZlU3ltYm9sID0gU3ltYm9sLmZvcihcImRvbS50c0BvbkNvbnRlbnRPYnNlcnZlXCIpO1xudmFyIG9uQ29udGVudE9ic2VydmUgPSBnbG9iYWxUaGlzW29uQ29udGVudE9ic2VydmVTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciB1bndyYXBGcm9tUXVlcnkgPSAoZWxlbWVudCkgPT4ge1xuXHRpZiAodHlwZW9mIGVsZW1lbnQ/LmN1cnJlbnQgPT0gXCJvYmplY3RcIikgZWxlbWVudCA9IGVsZW1lbnQ/LmVsZW1lbnQgPz8gZWxlbWVudD8uY3VycmVudCA/PyAodHlwZW9mIGVsZW1lbnQ/LnNlbGYgPT0gXCJvYmplY3RcIiA/IGVsZW1lbnQ/LnNlbGYgOiBudWxsKSA/PyBlbGVtZW50O1xuXHRyZXR1cm4gZWxlbWVudDtcbn07XG52YXIgbm9ybWFsaXplU2VsZWN0b3IgPSAoc2VsZWN0b3IsIGZhbGxiYWNrID0gXCIqXCIpID0+IHtcblx0aWYgKHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIGZhbGxiYWNrO1xuXHRyZXR1cm4gc2VsZWN0b3IudHJpbSgpIHx8IGZhbGxiYWNrO1xufTtcbnZhciBzYWZlUXVlcnlTZWxlY3RvckFsbCA9IChlbCwgc2VsZWN0b3IpID0+IHtcblx0aWYgKCFlbCB8fCB0eXBlb2YgZWwucXVlcnlTZWxlY3RvckFsbCAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gW107XG5cdGNvbnN0IHNlbCA9IG5vcm1hbGl6ZVNlbGVjdG9yKHNlbGVjdG9yLCBcIlwiKTtcblx0aWYgKCFzZWwpIHJldHVybiBbXTtcblx0dHJ5IHtcblx0XHRyZXR1cm4gQXJyYXkuZnJvbShlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkgfHwgW10pO1xuXHR9IGNhdGNoIHtcblx0XHRyZXR1cm4gW107XG5cdH1cbn07XG52YXIgc2FmZU1hdGNoZXMgPSAoZWwsIHNlbGVjdG9yKSA9PiB7XG5cdGlmICghZWwgfHwgdHlwZW9mIGVsLm1hdGNoZXMgIT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xuXHRjb25zdCBzZWwgPSBub3JtYWxpemVTZWxlY3RvcihzZWxlY3RvciwgXCJcIik7XG5cdGlmICghc2VsKSByZXR1cm4gZmFsc2U7XG5cdHRyeSB7XG5cdFx0cmV0dXJuICEhZWwubWF0Y2hlcyhzZWwpO1xuXHR9IGNhdGNoIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn07XG52YXIgb2JzZXJ2ZUF0dHJpYnV0ZUJ5U2VsZWN0b3IgPSAoZWxlbWVudCwgc2VsZWN0b3IsIGF0dHJpYnV0ZSwgY2IpID0+IHtcblx0Y29uc3Qgc2VsID0gbm9ybWFsaXplU2VsZWN0b3Ioc2VsZWN0b3IpO1xuXHRjb25zdCBhdHRyaWJ1dGVMaXN0ID0gbmV3IFNldChbLi4uYXR0cmlidXRlLnNwbGl0KFwiLFwiKSB8fCBbYXR0cmlidXRlXV0ubWFwKChzKSA9PiBzLnRyaW0oKSkpO1xuXHRjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbkxpc3QsIG9ic2VydmVyKSA9PiB7XG5cdFx0Zm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbkxpc3QpIGlmIChtdXRhdGlvbi50eXBlID09IFwiY2hpbGRMaXN0XCIpIHtcblx0XHRcdGNvbnN0IGFkZGVkTm9kZXMgPSBBcnJheS5mcm9tKG11dGF0aW9uLmFkZGVkTm9kZXMpIHx8IFtdO1xuXHRcdFx0Y29uc3QgcmVtb3ZlZE5vZGVzID0gQXJyYXkuZnJvbShtdXRhdGlvbi5yZW1vdmVkTm9kZXMpIHx8IFtdO1xuXHRcdFx0YWRkZWROb2Rlcy5wdXNoKC4uLkFycmF5LmZyb20obXV0YXRpb24uYWRkZWROb2RlcyB8fCBbXSkuZmxhdE1hcCgoZWwpID0+IHNhZmVRdWVyeVNlbGVjdG9yQWxsKGVsLCBzZWwpKSk7XG5cdFx0XHRyZW1vdmVkTm9kZXMucHVzaCguLi5BcnJheS5mcm9tKG11dGF0aW9uLnJlbW92ZWROb2RlcyB8fCBbXSkuZmxhdE1hcCgoZWwpID0+IHNhZmVRdWVyeVNlbGVjdG9yQWxsKGVsLCBzZWwpKSk7XG5cdFx0XHRbLi4ubmV3IFNldChhZGRlZE5vZGVzKV0uZmlsdGVyKChlbCkgPT4gc2FmZU1hdGNoZXMoZWwsIHNlbCkpPy5tYXA/LigodGFyZ2V0KSA9PiB7XG5cdFx0XHRcdGF0dHJpYnV0ZUxpc3QuZm9yRWFjaCgoYXR0cmlidXRlKSA9PiB7XG5cdFx0XHRcdFx0Y2Ioe1xuXHRcdFx0XHRcdFx0dGFyZ2V0LFxuXHRcdFx0XHRcdFx0dHlwZTogXCJhdHRyaWJ1dGVzXCIsXG5cdFx0XHRcdFx0XHRhdHRyaWJ1dGVOYW1lOiBhdHRyaWJ1dGUsXG5cdFx0XHRcdFx0XHRvbGRWYWx1ZTogdGFyZ2V0Py5nZXRBdHRyaWJ1dGU/LihhdHRyaWJ1dGUpXG5cdFx0XHRcdFx0fSwgb2JzZXJ2ZXIpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSBpZiAoc2FmZU1hdGNoZXMobXV0YXRpb24udGFyZ2V0LCBzZWwpICYmIG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgJiYgYXR0cmlidXRlTGlzdC5oYXMobXV0YXRpb24uYXR0cmlidXRlTmFtZSkpIGNiKG11dGF0aW9uLCBvYnNlcnZlcik7XG5cdH0pO1xuXHRvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQgPSB1bndyYXBGcm9tUXVlcnkoZWxlbWVudCksIHtcblx0XHRhdHRyaWJ1dGVPbGRWYWx1ZTogdHJ1ZSxcblx0XHRhdHRyaWJ1dGVzOiB0cnVlLFxuXHRcdGF0dHJpYnV0ZUZpbHRlcjogWy4uLmF0dHJpYnV0ZUxpc3RdLFxuXHRcdGNoaWxkTGlzdDogdHJ1ZSxcblx0XHRzdWJ0cmVlOiB0cnVlLFxuXHRcdGNoYXJhY3RlckRhdGE6IHRydWVcblx0fSk7XG5cdHNhZmVRdWVyeVNlbGVjdG9yQWxsKGVsZW1lbnQsIHNlbCkubWFwKCh0YXJnZXQpID0+IGF0dHJpYnV0ZUxpc3QuZm9yRWFjaCgoYXR0cmlidXRlKSA9PiBjYih7XG5cdFx0dGFyZ2V0LFxuXHRcdHR5cGU6IFwiYXR0cmlidXRlc1wiLFxuXHRcdGF0dHJpYnV0ZU5hbWU6IGF0dHJpYnV0ZSxcblx0XHRvbGRWYWx1ZTogdGFyZ2V0Py5nZXRBdHRyaWJ1dGU/LihhdHRyaWJ1dGUpXG5cdH0sIG9ic2VydmVyKSkpO1xuXHRyZXR1cm4gb2JzZXJ2ZXI7XG59O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvbGlmZWN5Y2xlLnRzXG5pZiAodHlwZW9mIGdsb2JhbFRoaXMuQ3VzdG9tRXZlbnQgIT09IFwiZnVuY3Rpb25cIikge1xuXHRjbGFzcyBQb2x5ZmlsbEN1c3RvbUV2ZW50IHtcblx0XHR0eXBlO1xuXHRcdGRldGFpbDtcblx0XHRidWJibGVzO1xuXHRcdGNhbmNlbGFibGU7XG5cdFx0ZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xuXHRcdGNvbnN0cnVjdG9yKHR5cGUsIGluaXQpIHtcblx0XHRcdHRoaXMudHlwZSA9IHR5cGU7XG5cdFx0XHR0aGlzLmRldGFpbCA9IGluaXQ/LmRldGFpbDtcblx0XHRcdHRoaXMuYnViYmxlcyA9ICEhaW5pdD8uYnViYmxlcztcblx0XHRcdHRoaXMuY2FuY2VsYWJsZSA9ICEhaW5pdD8uY2FuY2VsYWJsZTtcblx0XHR9XG5cdFx0cHJldmVudERlZmF1bHQoKSB7XG5cdFx0XHRpZiAodGhpcy5jYW5jZWxhYmxlKSB0aGlzLmRlZmF1bHRQcmV2ZW50ZWQgPSB0cnVlO1xuXHRcdH1cblx0fVxuXHRnbG9iYWxUaGlzLkN1c3RvbUV2ZW50ID0gUG9seWZpbGxDdXN0b21FdmVudDtcbn1cbnZhciBoYXNQYXlsb2FkID0gKG9wdGlvbnMpID0+ICEhb3B0aW9ucyAmJiAob3B0aW9ucy5wcm9wZXJ0aWVzICE9IG51bGwgfHwgb3B0aW9ucy5rZXlmcmFtZXMgIT0gbnVsbCk7XG52YXIgcmVkdWNlZCA9IChlbCkgPT4gZWw/Lmhhc0F0dHJpYnV0ZT8uKFwiZGF0YS1pbnN0YW50XCIpIHx8IHR5cGVvZiBtYXRjaE1lZGlhID09PSBcImZ1bmN0aW9uXCIgJiYgbWF0Y2hNZWRpYShcIihwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpXCIpLm1hdGNoZXM7XG52YXIgZGlzcGF0Y2hMaWZlY3ljbGVFdmVudCA9IChlbCwgdHlwZSkgPT4gZWw/LmRpc3BhdGNoRXZlbnQ/LihuZXcgQ3VzdG9tRXZlbnQodHlwZSwge1xuXHRkZXRhaWw6IHt9LFxuXHRidWJibGVzOiB0cnVlLFxuXHRjYW5jZWxhYmxlOiB0cnVlXG59KSkgIT09IGZhbHNlO1xudmFyIHdhaXRFbGVtZW50QW5pbWF0aW9ucyA9IGFzeW5jIChlbCkgPT4ge1xuXHRpZiAocmVkdWNlZChlbCkpIHJldHVybjtcblx0YXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHQoZ2xvYmFsVGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPz8gKChjYikgPT4gc2V0VGltZW91dCgoKSA9PiBjYigwKSwgMCkpKSgoKSA9PiByZXNvbHZlKCkpO1xuXHR9KTtcblx0Y29uc3QgbGlzdCA9IHR5cGVvZiBlbD8uZ2V0QW5pbWF0aW9ucyA9PT0gXCJmdW5jdGlvblwiID8gZWwuZ2V0QW5pbWF0aW9ucygpIDogW107XG5cdGF3YWl0IFByb21pc2UuYWxsKGxpc3QuZmlsdGVyKChhKSA9PiBhLnBsYXlTdGF0ZSA9PT0gXCJydW5uaW5nXCIgfHwgYS5wbGF5U3RhdGUgPT09IFwicGVuZGluZ1wiKS5tYXAoKGEpID0+IGEuZmluaXNoZWQ/LmNhdGNoPy4oKCkgPT4ge30pID8/IFByb21pc2UucmVzb2x2ZSgpKSk7XG59O1xudmFyIGlzUmVjb3JkUHJvcGVydGllcyA9IChwcm9wZXJ0aWVzKSA9PiAhIXByb3BlcnRpZXMgJiYgdHlwZW9mIHByb3BlcnRpZXMgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkocHJvcGVydGllcyk7XG52YXIgZmxpZ2h0cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHN0YXJ0UGxheWVyID0gKGVsLCBvcHRpb25zKSA9PiB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIChpc1JlY29yZFByb3BlcnRpZXMob3B0aW9ucy5wcm9wZXJ0aWVzKSA/IGFuaW1hdGUoZWwsIG9wdGlvbnMpIDogZG9BbmltYXRpb24oZWwsIG9wdGlvbnMpKT8uYW5pbWF0aW9uID8/IG51bGw7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdGNvbnN0IG1zZyA9IGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKTtcblx0XHRpZiAoIShlcnIgaW5zdGFuY2VvZiBUeXBlRXJyb3IgJiYgL0VsZW1lbnQvaS50ZXN0KG1zZykpIHx8IHR5cGVvZiBlbC5hbmltYXRlICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IGVycjtcblx0XHRyZXR1cm4gZWwuYW5pbWF0ZShidWlsZFdlYkFuaW1hdGlvbktleWZyYW1lcyhvcHRpb25zKSwgYnVpbGRBbmltYXRpb25UaW1pbmcob3B0aW9ucykpO1xuXHR9XG59O1xudmFyIHBsYXkgPSBhc3luYyAoZWwsIG9wdGlvbnMsIGtpbmQsIGJlZm9yZSwgYWZ0ZXIpID0+IHtcblx0aWYgKHR5cGVvZiBFbGVtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmICEoZWwgaW5zdGFuY2VvZiBFbGVtZW50KSAmJiB0eXBlb2YgZWw/LmFuaW1hdGUgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcImFwcGVhci9kaXNhcHBlYXIgcmVxdWlyZSBhbiBFbGVtZW50XCIpO1xuXHRpZiAoIWRpc3BhdGNoTGlmZWN5Y2xlRXZlbnQoZWwsIGJlZm9yZSkpIHJldHVybiBmYWxzZTtcblx0Y29uc3QgcHJpb3IgPSBmbGlnaHRzLmdldChlbCk7XG5cdGlmIChwcmlvciAmJiBwcmlvci5raW5kICE9PSBraW5kKSBwcmlvci5jYW5jZWwoKTtcblx0bGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuXHRsZXQgc2V0dGxlO1xuXHRjb25zdCBhYm9ydGVkID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRzZXR0bGUgPSByZXNvbHZlO1xuXHR9KTtcblx0bGV0IHBsYXllciA9IG51bGw7XG5cdGNvbnN0IGZsaWdodCA9IHtcblx0XHRraW5kLFxuXHRcdGNhbmNlbCgpIHtcblx0XHRcdGlmIChjYW5jZWxsZWQpIHJldHVybjtcblx0XHRcdGNhbmNlbGxlZCA9IHRydWU7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRwbGF5ZXI/LmNhbmNlbD8uKCk7XG5cdFx0XHR9IGNhdGNoIHt9XG5cdFx0XHRzZXR0bGUoKTtcblx0XHR9XG5cdH07XG5cdGZsaWdodHMuc2V0KGVsLCBmbGlnaHQpO1xuXHR0cnkge1xuXHRcdGlmIChoYXNQYXlsb2FkKG9wdGlvbnMpICYmICFyZWR1Y2VkKGVsKSAmJiB0eXBlb2YgZWwuYW5pbWF0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRwbGF5ZXIgPSBzdGFydFBsYXllcihlbCwgb3B0aW9ucyk7XG5cdFx0XHRpZiAocGxheWVyPy5maW5pc2hlZCkgYXdhaXQgUHJvbWlzZS5yYWNlKFtQcm9taXNlLnJlc29sdmUocGxheWVyLmZpbmlzaGVkKS5jYXRjaCgoKSA9PiB7fSksIGFib3J0ZWRdKTtcblx0XHR9XG5cdFx0aWYgKGNhbmNlbGxlZCkgcmV0dXJuIGZhbHNlO1xuXHRcdGF3YWl0IFByb21pc2UucmFjZShbd2FpdEVsZW1lbnRBbmltYXRpb25zKGVsKSwgYWJvcnRlZF0pO1xuXHRcdGlmIChjYW5jZWxsZWQpIHJldHVybiBmYWxzZTtcblx0XHRkaXNwYXRjaExpZmVjeWNsZUV2ZW50KGVsLCBhZnRlcik7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gZmluYWxseSB7XG5cdFx0aWYgKGZsaWdodHMuZ2V0KGVsKSA9PT0gZmxpZ2h0KSBmbGlnaHRzLmRlbGV0ZShlbCk7XG5cdH1cbn07XG52YXIgYXBwZWFyID0gKGVsLCBvcHRpb25zKSA9PiBwbGF5KGVsLCBvcHRpb25zLCBcInNob3dcIiwgXCJ1Mi1iZWZvcmUtc2hvd1wiLCBcInUyLWFwcGVhclwiKTtcbnZhciBkaXNhcHBlYXIgPSAoZWwsIG9wdGlvbnMpID0+IHBsYXkoZWwsIG9wdGlvbnMsIFwiaGlkZVwiLCBcInUyLWJlZm9yZS1oaWRlXCIsIFwidTItaGlkZGVuXCIpO1xudmFyIGRlY29yU2hvdyA9IHtcblx0cHJvcGVydGllczoge1xuXHRcdFwiLS1vcGFjaXR5XCI6IFtcblx0XHRcdDAsXG5cdFx0XHQwLFxuXHRcdFx0MVxuXHRcdF0sXG5cdFx0XCItLXNjYWxlXCI6IFtcblx0XHRcdC44LFxuXHRcdFx0LjgsXG5cdFx0XHQxXG5cdFx0XSxcblx0XHRkaXNwbGF5OiBbXG5cdFx0XHRcIm5vbmVcIixcblx0XHRcdFwibm9uZVwiLFxuXHRcdFx0XCJyZXZlcnQtbGF5ZXJcIlxuXHRcdF0sXG5cdFx0cG9pbnRlckV2ZW50czogW1xuXHRcdFx0XCJub25lXCIsXG5cdFx0XHRcIm5vbmVcIixcblx0XHRcdFwicmV2ZXJ0LWxheWVyXCJcblx0XHRdXG5cdH0sXG5cdGR1cmF0aW9uOiA4MCxcblx0ZWFzaW5nOiBcImxpbmVhclwiXG59O1xudmFyIGRlY29ySGlkZSA9IHtcblx0cHJvcGVydGllczoge1xuXHRcdFwiLS1vcGFjaXR5XCI6IFtcblx0XHRcdDEsXG5cdFx0XHQwLFxuXHRcdFx0MFxuXHRcdF0sXG5cdFx0XCItLXNjYWxlXCI6IFtcblx0XHRcdDEsXG5cdFx0XHQuOCxcblx0XHRcdC44XG5cdFx0XSxcblx0XHRkaXNwbGF5OiBbXG5cdFx0XHRcInJldmVydC1sYXllclwiLFxuXHRcdFx0XCJyZXZlcnQtbGF5ZXJcIixcblx0XHRcdFwibm9uZVwiXG5cdFx0XSxcblx0XHRwb2ludGVyRXZlbnRzOiBbXG5cdFx0XHRcIm5vbmVcIixcblx0XHRcdFwibm9uZVwiLFxuXHRcdFx0XCJub25lXCJcblx0XHRdXG5cdH0sXG5cdGR1cmF0aW9uOiAxMjAsXG5cdGVhc2luZzogXCJsaW5lYXJcIlxufTtcbnZhciBpbml0VmlzaWJpbGl0eSA9IGFzeW5jIChST09UID0gdHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiID8gZG9jdW1lbnQuYm9keSA6IG51bGwsIGFuaW1hdGlvbnMpID0+IHtcblx0aWYgKCFST09UKSByZXR1cm47XG5cdG9ic2VydmVBdHRyaWJ1dGVCeVNlbGVjdG9yKFJPT1QsIFwiKlwiLCBcImRhdGEtaGlkZGVuXCIsIChtdXRhdGlvbikgPT4ge1xuXHRcdGlmIChtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lICE9PSBcImRhdGEtaGlkZGVuXCIpIHJldHVybjtcblx0XHRjb25zdCB0YXJnZXQgPSBtdXRhdGlvbi50YXJnZXQ7XG5cdFx0aWYgKHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWhpZGRlblwiKSA9PT0gbXV0YXRpb24ub2xkVmFsdWUpIHJldHVybjtcblx0XHRjb25zdCBoaWRkZW4gPSB0YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1oaWRkZW5cIikgIT0gbnVsbDtcblx0XHRjb25zdCBvcHRzID0gaGlkZGVuID8gYW5pbWF0aW9ucz8uZGlzYXBwZWFyIDogYW5pbWF0aW9ucz8uYXBwZWFyO1xuXHRcdFByb21pc2UucmVzb2x2ZShoaWRkZW4gPyBkaXNhcHBlYXIodGFyZ2V0LCBvcHRzKSA6IGFwcGVhcih0YXJnZXQsIG9wdHMpKS5jYXRjaChjb25zb2xlLndhcm4pO1xuXHR9KTtcbn07XG5cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgQSwgQU5JTUFUQUJMRV9CUkFORCwgQU5JTV9MQVlFUiwgQU5JTV9UUklHR0VSX05BTUUsIEFuaW1hdGFibGVWYWx1ZSwgQkFLRV9DQVRFR09SSUVTLCBCQUtFX0xBWUVSLCBCQUtFX1NDUkVFTl9BTFNPLCBCQUtFX1NDUkVFTl9BTFNPX0VYUExPUkVSLCBCQUtFX1NDUkVFTl9BTFNPX1NFVFRJTkdTLCBCQUtFX1NDUkVFTl9DSFJPTUUsIEJBS0VfU0NSRUVOX01FRElBLCBDU1NfQ09MT1JfUFJPUEVSVElFUywgQ1NTX0RJTUVOU0lPTl9VTklUUywgQ1NTX0RJTUVOU0lPTl9VTklUU19MSVNULCBDU1NfTU9USU9OX1BST1BFUlRJRVMsIENTU19UWVBPR1JBUEhZX1BST1BFUlRJRVMsIENTU19VTklUX0ZBQ1RPUllfQUxJQVNFUywgQ1NTX1VOSVRfVE9LRU5fUkUsIERFRkFVTFRfQ0FDSEVfTVMsIERFRkFVTFRfQ0FURUdPUklFUywgSE9TVF9DU1NfRkFMTEJBQ0ssIExBWUVSX05BTUUsIExBWUVSX09QRU4sIE9XTkVSLCBTLCBTVFlMRV9USEVNRV9BVFRSUywgU1RZTEVfVEhFTUVfT0JTRVJWRV9BVFRSUywgVVhfSE9TVF9MQVlFUlMsIFVYX1BSRUxPQURfSE9TVF9DU1MsIFZFRUxBX0NBU0NBREVfTEFZRVJTLCBWSUVXRVJfQ1NTX0xBWUVSX09SREVSLCBWSUVXRVJfUlVOVElNRV9MQVlFUlMsIGFkZEFkb3B0ZWRTaGVldFRvRWxlbWVudCwgYWRvcHRlZEFwcGxpZWRUZXh0LCBhZG9wdGVkQmxvYk1hcCwgYWRvcHRlZEZpbGxlZCwgYWRvcHRlZExheWVyTWFwLCBhZG9wdGVkTWFwLCBhZG9wdGVkU2VsZWN0b3JNYXAsIGFkb3B0ZWRTaGFkb3dMYXllck1hcCwgYWRvcHRlZFNoYWRvd1NlbGVjdG9yTWFwLCBhZG9wdGVkU3R5bGVTaGVldHNDYWNoZSwgYW5pbUtleWZyYW1lUmVmcywgYW5pbWF0YWJsZSwgYW5pbWF0ZSwgYXBwZWFyLCBhcHBseU5vcm1hbGl6ZWRJbmxpbmVTdHlsZSwgYmFrZUFsc29RdWVyaWVzRm9yLCBiYWtlQ29tcHV0ZWRTdHlsZSwgYmFrZVNjcmVlbkNvbG9ycywgYmFrZVRoZW1lRmluZ2VycHJpbnQsIGJha2VkQ2FjaGUsIGJha2VkRm9sbG93ZXJzLCBiYWtlZExpdmUsIGJha2VkU3R5bGVzLCBiaW5kQ3NzQW5pbWF0aW9uLCBiaW5kU3R5bGUsIGJsb2JVUkxNYXAsIGJ1aWxkQW5pbWF0aW9uVGltaW5nLCBidWlsZEJha2VkQ3NzVGV4dCwgYnVpbGRXZWJBbmltYXRpb25LZXlmcmFtZXMsIGNhY2hlQmxvYkNvbnRlbnRNYXAsIGNhY2hlQ29udGVudE1hcCwgY2FjaGVNYXAsIGNvbGxlY3RCYWtlQWxzb0hvc3RzLCBjb2xsZWN0QmFrZVNjcmVlbkhvc3RzLCBjb2xsZWN0QmFrZWREZWNsYXJhdGlvbnMsIGNvbXBpbGVJbmxpbmVTdHlsZUF0dHJpYnV0ZSwgY29tcGlsZUtleWZyYW1lc0NzcywgY29tcGlsZVRyaWdnZXJDc3MsIGNvbnRhaW5zTWFya2VyLCBjcmVhdGVTdHlsZUlkLCBjcmVhdGVUeXBlZFVuaXRWYWx1ZSwgY3NzLCBjc3NFbXB0eUxheWVyUnVsZSwgY3NzSW1wb3J0V2l0aExheWVyLCBjc3NMYXllckJsb2NrLCBjc3NMYXllck9yZGVyLCBjc3NUZXh0Rm9yQWRvcHRlZFNoZWV0LCBjc3NUZXh0UmVxdWlyZXNJbmxpbmVTdHlsZUVsZW1lbnQsIGNzc1VuaXRDb25zdHJ1Y3Rvck5hbWUsIGNzc1VuaXRGYWN0b3J5TmFtZSwgZGVjb3JIaWRlLCBkZWNvclNob3csIGRlZmluZUFuaW1hdGlvbiwgZGlzYXBwZWFyLCBkaXNwYXRjaExpZmVjeWNsZUV2ZW50LCBkb0FuaW1hdGlvbiwgZW5zdXJlQWRvcHRlZFNoZWV0Q29udGVudCwgZW5zdXJlSG9zdFN0eWxlcywgZW5zdXJlU3R5bGVTY29wZVNlbGVjdG9yLCBlc2NhcGVDU1NJZGVudGlmaWVyLCBlc2NhcGVSZWdFeHAsIGZldGNoQW5kQ2FjaGUsIGZldGNoQXNJbmxpbmUsIGdldEFkb3B0ZWRTdHlsZVJ1bGUsIGdldEJha2VkU3R5bGUsIGdldEVsZW1lbnRab29tLCBnZXRPckNyZWF0ZUxheWVyUnVsZSwgZ2V0UGFkZGluZywgZ2V0UHJvcGVydHlWYWx1ZSwgZ2V0UHhWYWx1ZSwgZ2V0U3R5bGVMYXllciwgZ2V0U3R5bGVSdWxlLCBnZXRUcmFuc2Zvcm0sIGdldFRyYW5zZm9ybU9yaWdpbiwgZ2V0V2luZG93Q29uc3RydWN0b3IsIGhhc1R5cGVkT00sIGhhc2gsIGluaXRWaXNpYmlsaXR5LCBpbnZhbGlkYXRlQmFrZWRTdHlsZXMsIGlzQWRvcHRlZFNoZWV0RW1wdHksIGlzQW5pbWF0YWJsZVZhbHVlLCBpc0NvbG9yVG9rZW4sIGlzQ3NzRWxlbWVudCwgaXNDc3NMYXllck5hbWUsIGlzRG9jdW1lbnQsIGlzRWZmZWN0aXZlbHlFbXB0eVN0eWxlVGV4dCwgaXNFbGVtZW50VmlzaWJsZSwgaXNMYXllckJsb2NrUnVsZSwgaXNOYXRpdmVDU1NTdHlsZVZhbHVlLCBpc1JlYWN0aXZlU3R5bGVWYWx1ZSwgaXNSZWFjdGl2ZVRyaWdnZXIsIGlzU2Nyb2xsRHJpdmVuLCBpc1NoYWRvd1Jvb3QsIGlzU3RhdGljU3R5bGVJbnRlcnBvbGF0aW9uLCBpc1N0eWxlQmluZGluZywgaXNTdHlsZUhvc3QsIGlzU3R5bGVWYWx1ZSwgaXNVbml0VmFsdWUsIGlzVmlld0RyaXZlbiwgbGF5ZXJDb3VudGVyLCBsb2FkQXNBZG9wdGVkLCBsb2FkQmxvYlN0eWxlLCBsb2FkQ2FjaGVkU3R5bGVzLCBsb2FkSW5saW5lU3R5bGUsIGxvYWRTdHlsZVNoZWV0LCBtYWtlSG9zdExheWVyT3JkZXIsIG5vcm1hbGl6ZUNzc0ZvckxheWVyLCBub3JtYWxpemVJdGVyYXRpb25Db3VudCwgbm9ybWFsaXplSXRlcmF0aW9ucywgbm90aWZ5U3R5bGVUcmVlSG9zdHMsIG9ic2VydmVTdHlsZVRyZWUsIG9uU2Nyb2xsLCBvblZpZXcsIHBhcmFsbGVsQW5pbWF0aW9ucywgcGFyc2VMZW5ndGgsIHBhcnNlT3JpZ2luLCBwYXJzZVRpbWUsIHByZWxvYWRTdHlsZSwgcHJvbWlzZU9yRGlyZWN0LCBwcnVuZUVtcHR5U3R5bGVBdHRyaWJ1dGUsIHF1ZXJ5Rmlyc3REZWVwLCByZWFkQXR0YWNoZWRDU1NVbml0LCByZWFkU2hlZXRSdWxlQ291bnQsIHJlYmFrZUJhdGNoLCByZWJha2VDb21wdXRlZFN0eWxlLCByZWdpc3RlclN0eWxlVHJlZUhvb2ssIHJlZ2lzdGVyZWRQcm9wZXJ0aWVzLCByZWh5ZHJhdGVBZG9wdGVkU3R5bGVTaGVldHMsIHJlaHlkcmF0ZUNvbnN0cnVjdGFibGVTaGVldHMsIHJlbW92ZUFkb3B0ZWQsIHJlc29sdmVDc3NBbmltYXRpb25UYXJnZXQsIHNjaGVkdWxlQmFrZVNjcmVlbkNvbG9ycywgc2NoZWR1bGVFbnN1cmVIb3N0U3R5bGVzLCBzZXF1ZW5jZUFuaW1hdGlvbnMsIHNldFByb3BlcnR5LCBzZXRTdHlsZUluUnVsZSwgc2V0U3R5bGVQcm9wZXJ0eSwgc2V0U3R5bGVQcm9wZXJ0eUZhbGxiYWNrLCBzZXRTdHlsZVByb3BlcnR5VHlwZWQsIHNldFN0eWxlUnVsZSwgc2V0U3R5bGVSdWxlcywgc2V0U3R5bGVVUkwsIHN0YWdnZXJBbmltYXRpb24sIHN0cmlwQ3NzUHJlYW1ibGUsIHN0eWxlQ2FjaGUsIHN0eWxlRWxlbWVudENhY2hlLCBzdHlsZUZsdXNoUGVuZGluZywgc3R5bGVUcmVlSG9va3MsIHN0eWxlVHJlZU9ic2VydmVkLCBzdHlsZVRyZWVSb290cywgc3VwcG9ydHNDb25zdHJ1Y3RhYmxlU3R5bGVzaGVldCwgdW5iYWtlQ29tcHV0ZWRTdHlsZSwgdW5iYWtlU2NyZWVuQ29sb3JzLCB1bndyYXBDc3NMYXllciwgdXJsQ2FuUGFyc2UsIHZlZWxhQ2FzY2FkZU9yZGVyLCB3YWl0RWxlbWVudEFuaW1hdGlvbnMsIHdyYXBDc3NMYXllciB9OyJdLAogICJtYXBwaW5ncyI6ICJBQUFBLFNBQVMsaUJBQUFBLElBQWUsYUFBQUMsSUFBVyxnQkFBQUMsSUFBYyxTQUFBQyxJQUFPLHVCQUFBQyxJQUFxQixZQUFBQyxJQUFVLFNBQUFDLElBQU8sZUFBQUMsSUFBYSxTQUFBQyxJQUFPLHFCQUFBQyxVQUF5QjtBQUMzSSxTQUFTLGtCQUFBQyxJQUFnQixZQUFBQyxVQUFnQjtBQUd6QyxJQUFJQyxJQUFTLENBQUNDLEdBQUtDLE1BQVcsV0FBVyxPQUFPLElBQUlELENBQUcsQ0FBQyxNQUFNQyxFQUFPLEdBQ2pFQyxJQUFhSCxFQUFPLHFCQUFxQixNQUFzQixvQkFBSSxRQUFRLENBQUMsR0FDNUVJLElBQVdKLEVBQU8sbUJBQW1CLE1BQXNCLG9CQUFJLElBQUksQ0FBQyxHQUNwRUssSUFBa0JMLEVBQU8sMEJBQTBCLE1BQXNCLG9CQUFJLElBQUksQ0FBQyxHQUNsRk0sS0FBc0JOLEVBQU8sOEJBQThCLE1BQXNCLG9CQUFJLFFBQVEsQ0FB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QUFRO0FBQ1QsR0FDSUMsS0FBaUIsT0FBT0MsSUFBTyxPQUFPLFdBQWEsTUFBYyxTQUFTLE9BQU8sTUFBTXRFLE1BQWU7QUFDekcsRUFBS3NFLEtBQ0xqQyxHQUEyQmlDLEdBQU0sS0FBSyxlQUFlLENBQUM3QixNQUFhO0FBQ2xFLFFBQUlBLEVBQVMsa0JBQWtCLGNBQWU7QUFDOUMsVUFBTXBiLElBQVNvYixFQUFTO0FBQ3hCLFFBQUlwYixFQUFPLGFBQWEsYUFBYSxNQUFNb2IsRUFBUyxTQUFVO0FBQzlELFVBQU04QixJQUFTbGQsRUFBTyxhQUFhLGFBQWEsS0FBSyxNQUMvQytJLElBQU9tVSxJQUFTdkUsR0FBWSxZQUFZQSxHQUFZO0FBQzFELFlBQVEsUUFBUXVFLElBQVNMLEdBQVU3YyxHQUFRK0ksQ0FBSSxJQUFJNlQsR0FBTzVjLEdBQVErSSxDQUFJLENBQUMsRUFBRSxNQUFNLFFBQVEsSUFBSTtBQUFBLEVBQzVGLENBQUM7QUFDRjsiLAogICJuYW1lcyI6IFsiJGF2b2lkVHJpZ2dlciIsICIkZ2V0VmFsdWUiLCAiY2FtZWxUb0tlYmFiIiwgImRlcmVmIiwgImdldE9ySW5zZXJ0Q29tcHV0ZWQiLCAiaGFzVmFsdWUiLCAiaXNWYWwiLCAiaXNWYWx1ZVVuaXQiLCAidG9SZWYiLCAidHJ5U3RyaW5nQXNOdW1iZXIiLCAiYWRkVG9DYWxsQ2hhaW4iLCAiYWZmZWN0ZWQiLCAic2hhcmVkIiwgImtleSIsICJjcmVhdGUiLCAiYmxvYlVSTE1hcCIsICJjYWNoZU1hcCIsICJjYWNoZUNvbnRlbnRNYXAiLCAiY2FjaGVCbG9iQ29udGVudE1hcCIsICJhZG9wdGVkU2VsZWN0b3JNYXAiLCAiYWRvcHRlZFNoYWRvd1NlbGVjdG9yTWFwIiwgImFkb3B0ZWRMYXllck1hcCIsICJhZG9wdGVkU2hhZG93TGF5ZXJNYXAiLCAiYWRvcHRlZE1hcCIsICJhZG9wdGVkQmxvYk1hcCIsICJhZG9wdGVkQXBwbGllZFRleHQiLCAiYWRvcHRlZEZpbGxlZCIsICJsYXllckNvdW50ZXIiLCAic3R5bGVUcmVlSG9va3MiLCAic3R5bGVUcmVlT2JzZXJ2ZWQiLCAic3R5bGVUcmVlUm9vdHMiLCAiYmFrZWRTdHlsZXMiLCAiYmFrZWRMaXZlIiwgImJha2VkQ2FjaGUiLCAicmViYWtlQmF0Y2giLCAiYmFrZWRGb2xsb3dlcnMiLCAiYWRvcHRlZFN0eWxlU2hlZXRzQ2FjaGUiLCAic3R5bGVDYWNoZSIsICJzdHlsZUVsZW1lbnRDYWNoZSIsICJzdHlsZUZsdXNoUGVuZGluZyIsICJyZWdpc3RlcmVkUHJvcGVydGllcyIsICJhbmltS2V5ZnJhbWVSZWZzIiwgIkNTU19ESU1FTlNJT05fVU5JVFNfTElTVCIsICJDU1NfRElNRU5TSU9OX1VOSVRTIiwgIkNTU19VTklUX0ZBQ1RPUllfQUxJQVNFUyIsICJDU1NfVU5JVF9UT0tFTl9SRSIsICJDU1NfQ09MT1JfUFJPUEVSVElFUyIsICJDU1NfVFlQT0dSQVBIWV9QUk9QRVJUSUVTIiwgIkNTU19NT1RJT05fUFJPUEVSVElFUyIsICJTVFlMRV9USEVNRV9BVFRSUyIsICJTVFlMRV9USEVNRV9PQlNFUlZFX0FUVFJTIiwgIkJBS0VfQ0FURUdPUklFUyIsICJWRUVMQV9DQVNDQURFX0xBWUVSUyIsICJVWF9IT1NUX0xBWUVSUyIsICJWSUVXRVJfUlVOVElNRV9MQVlFUlMiLCAiVklFV0VSX0NTU19MQVlFUl9PUkRFUiIsICJMQVlFUl9OQU1FIiwgIkxBWUVSX09QRU4iLCAiT1dORVIiLCAiSE9TVF9DU1NfRkFMTEJBQ0siLCAiQkFLRV9MQVlFUiIsICJERUZBVUxUX0NBVEVHT1JJRVMiLCAiREVGQVVMVF9DQUNIRV9NUyIsICJCQUtFX1NDUkVFTl9NRURJQSIsICJCQUtFX1NDUkVFTl9DSFJPTUUiLCAiQkFLRV9TQ1JFRU5fQUxTT19FWFBMT1JFUiIsICJCQUtFX1NDUkVFTl9BTFNPX1NFVFRJTkdTIiwgIkJBS0VfU0NSRUVOX0FMU08iLCAiQU5JTUFUQUJMRV9CUkFORCIsICJBTklNX0xBWUVSIiwgIkFOSU1fVFJJR0dFUl9OQU1FIiwgImhhc1R5cGVkT00iLCAiY3NzVW5pdEZhY3RvcnlOYW1lIiwgInVuaXQiLCAiY3NzVW5pdENvbnN0cnVjdG9yTmFtZSIsICJpc0Nzc0xheWVyTmFtZSIsICJuYW1lIiwgImNzc0VtcHR5TGF5ZXJSdWxlIiwgImxheWVyTmFtZSIsICJzdHJpcENzc1ByZWFtYmxlIiwgImNzcyIsICJvdXQiLCAiaSIsICJuZXh0IiwgImlzTGF5ZXJCbG9ja1J1bGUiLCAicnVsZSIsICJzdXBwb3J0c0NvbnN0cnVjdGFibGVTdHlsZXNoZWV0IiwgImNzc1RleHRSZXF1aXJlc0lubGluZVN0eWxlRWxlbWVudCIsICJwcm9taXNlT3JEaXJlY3QiLCAicHJvbWlzZSIsICJjYiIsICJpc1NoYWRvd1Jvb3QiLCAidmFsdWUiLCAiaXNEb2N1bWVudCIsICJpc0Nzc0VsZW1lbnQiLCAiZXNjYXBlQ1NTSWRlbnRpZmllciIsICJjaGFyIiwgInN0eWxlSWRDb3VudGVyIiwgImNyZWF0ZVN0eWxlSWQiLCAidXJsQ2FuUGFyc2UiLCAiaGFzaCIsICJzdHJpbmciLCAiaGFzaEJ1ZmZlciIsICJwYXJzZUxlbmd0aCIsICJzaXplIiwgInBhcnNlT3JpZ2luIiwgIm9yaWdpbiIsICJlbGVtZW50IiwgInZhbHVlcyIsICJwYXJzZVRpbWUiLCAidiIsICJmYWxsYmFjayIsICJ0IiwgIm5vcm1hbGl6ZUl0ZXJhdGlvbkNvdW50IiwgImNvdW50IiwgIm5vcm1hbGl6ZUl0ZXJhdGlvbnMiLCAibiIsICJpc1Njcm9sbERyaXZlbiIsICJpc1ZpZXdEcml2ZW4iLCAiaXNTdHlsZUhvc3QiLCAibm9kZSIsICJyZWFkU2hlZXRSdWxlQ291bnQiLCAic2hlZXQiLCAiaXNBZG9wdGVkU2hlZXRFbXB0eSIsICJpc0NvbG9yVG9rZW4iLCAiaXNFbGVtZW50VmlzaWJsZSIsICJlbCIsICJpc1N0eWxlQmluZGluZyIsICJzdHlsZXMiLCAiaXNFZmZlY3RpdmVseUVtcHR5U3R5bGVUZXh0IiwgImNzc1RleHQiLCAic291cmNlIiwgImNodW5rIiwgImRlY2xhcmF0aW9uIiwgImNvbG9uSW5kZXgiLCAicHJ1bmVFbXB0eVN0eWxlQXR0cmlidXRlIiwgInJhdyIsICJhcHBseU5vcm1hbGl6ZWRJbmxpbmVTdHlsZSIsICJpc05hdGl2ZUNTU1N0eWxlVmFsdWUiLCAiQ1NTU3R5bGVWYWx1ZUN0b3IiLCAicHJvdG90eXBlIiwgImlzUmVhY3RpdmVTdHlsZVZhbHVlIiwgImlzU3RhdGljU3R5bGVJbnRlcnBvbGF0aW9uIiwgImVzY2FwZVJlZ0V4cCIsICJjb250YWluc01hcmtlciIsICJjc3NWYWx1ZSIsICJtYXJrZXIiLCAicmVhZEF0dGFjaGVkQ1NTVW5pdCIsICJ0ZXh0IiwgIm1hdGNoIiwgImF1dGhvcmVkIiwgIm5vcm1hbGl6ZWQiLCAiZ2V0V2luZG93Q29uc3RydWN0b3IiLCAid2luIiwgImNyZWF0ZVR5cGVkVW5pdFZhbHVlIiwgIkNTU05hbWVzcGFjZSIsICJmYWN0b3J5TmFtZSIsICJmYWN0b3J5IiwgIkNTU1VuaXRWYWx1ZUN0b3IiLCAiaXNTdHlsZVZhbHVlIiwgInZhbCIsICJpc1VuaXRWYWx1ZSIsICJxdWVyeUZpcnN0RGVlcCIsICJyb290IiwgInNlbGVjdG9yIiwgImRpcmVjdCIsICJzY29wZSIsICJoaXQiLCAiaW5uZXIiLCAiY3NzTGF5ZXJPcmRlciIsICJncm91cHMiLCAic2VlbiIsICJuYW1lcyIsICJncm91cCIsICJsaXN0IiwgInZlZWxhQ2FzY2FkZU9yZGVyIiwgIm1ha2VIb3N0TGF5ZXJPcmRlciIsICJleHRyYSIsICJjc3NMYXllckJsb2NrIiwgImJvZHkiLCAid3JhcENzc0xheWVyIiwgIm5vcm1hbGl6ZUNzc0ZvckxheWVyIiwgInRyaW1tZWQiLCAidW53cmFwT3V0ZXJMYXllckJsb2NrIiwgImV4cGVjdGVkTmFtZSIsICJvcGVuIiwgImRlcHRoIiwgImNoIiwgInVud3JhcENzc0xheWVyIiwgInN0cmlwcGVkIiwgImNzc0ltcG9ydFdpdGhMYXllciIsICJ1cmwiLCAibGF5ZXIiLCAiVVhfUFJFTE9BRF9IT1NUX0NTUyIsICJnZXRPckNyZWF0ZUxheWVyUnVsZSIsICJydWxlcyIsICJleGlzdGluZyIsICJydWxlSW5kZXgiLCAiY3JlYXRlZCIsICJ0b2tlbml6ZU51bWVyaWNDU1MkMSIsICJ0b2tlbnMiLCAiY3Vyc29yIiwgInJlc3QiLCAid2hpdGVzcGFjZSIsICJudW1iZXIiLCAidW5pdE1hdGNoIiwgImlkZW50aWZpZXIiLCAic3ltYm9sIiwgIk51bWVyaWNUeXBlZE9NUGFyc2VyJDEiLCAidG9rZW4iLCAiQ29uc3RydWN0b3IiLCAib3BlcmF0b3IiLCAicmlnaHQiLCAicGFyc2VUb1R5cGVkT00iLCAic2V0UHJvcGVydHlJZk5vdEVxdWFsIiwgInN0eWxlUmVmIiwgImtlYmFiIiwgImltcG9ydGFuY2UiLCAic2V0U3R5bGVQcm9wZXJ0eVR5cGVkIiwgInN0eWxlTWFwUmVmIiwgInNldFN0eWxlUHJvcGVydHlGYWxsYmFjayIsICJvbGQiLCAibmV3VmFsIiwgInBhcnNlZCIsICJtYXliZU51bSIsICJzZXRTdHlsZVByb3BlcnR5IiwgImhhbmRsZVN0eWxlQ2hhbmdlIiwgInByb3AiLCAic2V0U3R5bGVJblJ1bGUiLCAiZ2V0U3R5bGVSdWxlIiwgInNldFN0eWxlUnVsZSIsICJwcm9wTmFtZSIsICJwcm9wVmFsdWUiLCAibG9hZFN0eWxlU2hlZXQiLCAiaW5saW5lIiwgImJhc2UiLCAiaW50ZWdyaXR5IiwgImxvYWQiLCAiZmV0Y2hBbmRDYWNoZSIsICJzZXRTdHlsZVVSTCIsICJyZXMiLCAiZXJyb3IiLCAibG9hZEJsb2JTdHlsZSIsICJzdHlsZSIsICJsb2FkSW5saW5lU3R5bGUiLCAicm9vdEVsZW1lbnQiLCAiUExBQ0UiLCAic2V0UHJvcGVydHkiLCAidGFyZ2V0IiwgInByZWxvYWRTdHlsZSIsICJsb2FkQXNBZG9wdGVkIiwgInJlbWVtYmVyQWRvcHRlZFRleHQiLCAiY3NzVGV4dEZvckFkb3B0ZWRTaGVldCIsICJzdG9yZWQiLCAibWFwcGVkIiwgImVuc3VyZUFkb3B0ZWRTaGVldENvbnRlbnQiLCAiYXBwbHlBZG9wdGVkU3R5bGVUZXh0IiwgIm1lc3NhZ2UiLCAic2hlZXRGb3JCbG9iIiwgImJsb2IiLCAibG9hZEFzQWRvcHRlZFVuc2FmZSIsICJjYWNoZWQiLCAiYXBwbGllZCIsICJsYXllcldyYXBwZWQiLCAicmVtb3ZlQWRvcHRlZCIsICJmZXRjaEFzSW5saW5lIiwgImNvbGxlY3RTdHlsZUhvc3RzIiwgImludG8iLCAiY2hpbGQiLCAibm90aWZ5U3R5bGVUcmVlSG9zdHMiLCAiaG9zdHMiLCAicmVhc29uIiwgImZuIiwgInJlZ2lzdGVyU3R5bGVUcmVlSG9vayIsICJvYnNlcnZlU3R5bGVUcmVlIiwgIm9ic2VydmVyIiwgInJlY29yZHMiLCAicmVjIiwgInNoZWV0cyIsICJyZWh5ZHJhdGVDb25zdHJ1Y3RhYmxlU2hlZXRzIiwgImNhblBhcnNlIiwgImlkeCIsICJnZXRUcmFuc2Zvcm0iLCAibWF0cml4IiwgImdldFRyYW5zZm9ybU9yaWdpbiIsICJjc3NPcmlnaW4iLCAiZ2V0UHJvcGVydHlWYWx1ZSIsICJzcmMiLCAiY3MiLCAiZ2V0RWxlbWVudFpvb20iLCAiem9vbSIsICJjdXJyZW50RWxlbWVudCIsICJjdXJyZW50Q1NTWm9vbSIsICJnZXRQeFZhbHVlIiwgImdldFBhZGRpbmciLCAiYXhpcyIsICJzdHlsZUVsZW1lbnQiLCAic2V0U3R5bGVSdWxlcyIsICJjbGFzc2VzIiwgImFyZ3MiLCAiZ2V0U3R5bGVMYXllciIsICJlbnN1cmVTdHlsZVNjb3BlU2VsZWN0b3IiLCAic3R5bGVJZCIsICJqb2luU2NvcGVkU2VsZWN0b3IiLCAiZmluZFN0eWxlUnVsZSIsICJmdWxsU2VsZWN0b3IiLCAiZXhwZWN0ZWQiLCAicmVxdWVzdGVkIiwgImFjdHVhbCIsICJiYXNpcyIsICJiYXNpc0VsZW1lbnQiLCAic3R5bGVFbGVtZW50R2xvYmFsIiwgInJ1bGVJZCIsICJidXJsIiwgInByb21pc2VkIiwgImdldEFkb3B0ZWRTdHlsZVJ1bGUiLCAiaW5TaGFkb3ciLCAidGFyZ2V0QWRvcHRlZFNoZWV0cyIsICJzZWxlY3RvcktleSIsICJzaGFkb3dNYXAiLCAibGF5ZXJSdWxlIiwgInNoYWRvd0xheWVyTWFwIiwgImxheWVyUnVsZUluZGV4IiwgInIiLCAiaW52YWxpZGF0aW9uUmVhZHkiLCAibGFzdEZpbmdlcnByaW50IiwgInJlYmFrZVF1ZXVlZCIsICJub3JtYWxpemVDYXRlZ29yaWVzIiwgImNhdGVnb3JpZXMiLCAiY2FjaGVLZXlGb3IiLCAibWVkaWEiLCAiYmFrZVRoZW1lRmluZ2VycHJpbnQiLCAicGFydHMiLCAibG9jYWwiLCAidGFrZVByb3AiLCAiQ09MT1JfUFJPUF9TRVQiLCAiYmFrZURlY2xSYW5rIiwgImNvbGxlY3RCYWtlZERlY2xhcmF0aW9ucyIsICJzZXQiLCAiYnVpbGRCYWtlZENzc1RleHQiLCAiZGVjbGFyYXRpb25zIiwgInJvd3MiLCAiYSIsICJiIiwgImJha2VkIiwgImNvbGxlY3RCYWtlU2NyZWVuSG9zdHMiLCAiY2hyb21lIiwgImJha2VBbHNvUXVlcmllc0ZvciIsICJjb2xsZWN0QmFrZUFsc29Ib3N0cyIsICJxdWVyaWVzIiwgInBpZXJjZVNoYWRvdyIsICJyb290U2VsIiwgImZpbmQiLCAic2VsIiwgImdyb3VwZWQiLCAicXVlcnkiLCAicSIsICJzZWxzIiwgImFkb3B0ZWRMaXN0IiwgImFzc2lnbkFkb3B0ZWQiLCAiYWRvcHRTaGVldCIsICJ1bmFkb3B0U2hlZXQiLCAid3JpdGVCYWtlZENzcyIsICJyZW1lbWJlckNhY2hlIiwgImNhY2hlTXMiLCAicHJldiIsICJlbnRyeSIsICJkcm9wQ2FjaGUiLCAiY2FjaGVLZXkiLCAiY2xlYXJBbGxDYWNoZSIsICJwYXJrQmFrZWQiLCAicmVzdW1lQmFrZWQiLCAiZmluZ2VycHJpbnQiLCAiYmFrZUNvbXB1dGVkU3R5bGUiLCAiYmFrZUlPIiwgImVuc3VyZUJha2VJTyIsICJlbnRyaWVzIiwgImVuc3VyZUJha2VkUmVjb3JkIiwgImNhbkNvbnN0cnVjdCIsICJmbHVzaFJlYmFrZSIsICJiYXRjaCIsICJzY2hlZHVsZVJlYmFrZSIsICJpbnZhbGlkYXRlQmFrZWRTdHlsZXMiLCAiZW5zdXJlQmFrZUludmFsaWRhdGlvbiIsICJob3N0IiwgIm9wdGlvbnMiLCAidW5iYWtlQ29tcHV0ZWRTdHlsZSIsICJrZWVwQ2FjaGUiLCAicmViYWtlQ29tcHV0ZWRTdHlsZSIsICJnZXRCYWtlZFN0eWxlIiwgImJha2VTY3JlZW5Db2xvcnMiLCAib3B0cyIsICJleHRyYXMiLCAiZm9sbG93ZXJzIiwgInVuYmFrZVNjcmVlbkNvbG9ycyIsICJzY2hlZHVsZUJha2VTY3JlZW5Db2xvcnMiLCAicnVuIiwgInJldHJ5TWlzcyIsICJwaWVyY2UiLCAic3luY0Fkb3B0ZWRTaGVldHNUb1NoYWRvdyIsICJiVG8iLCAiYWRvcHRlZFNoZWV0cyIsICJsaXZlIiwgInMiLCAiYWRkQWRvcHRlZFNoZWV0VG9FbGVtZW50IiwgImVuc3VyZVNoYWRvd0Nzc0ZhbGxiYWNrIiwgInJlaHlkcmF0ZUFkb3B0ZWRTdHlsZVNoZWV0cyIsICJyZXN0b3JlIiwgImhvc3RDc3NUZXh0IiwgInZpc2l0IiwgImNoaWxkcmVuIiwgImVuc3VyZUhvc3RTdHlsZXMiLCAibG9hZENhY2hlZFN0eWxlcyIsICJzdHlsZUZsdXNoQmF0Y2giLCAic3R5bGVGbHVzaFNjaGVkdWxlZCIsICJzY2hlZHVsZUVuc3VyZUhvc3RTdHlsZXMiLCAicmVzb2x2ZWRTcmMiLCAid2VhayIsICJlIiwgInJlc3VsdCIsICJhZG9wdGVkIiwgImFkZEFkb3B0ZWRTaGVldCIsICJ2YXJzIiwgInByb3BzIiwgImlzTGlua2VyTGlrZSIsICJiaW5kV2l0aCIsICJoYW5kbGVyIiwgImxpbmtlciIsICJ3ZWwiLCAid3YiLCAidW4iLCAiY3VyciIsICJlbGVtZW50UmVmIiwgInZhbHVlUmVmIiwgInVuc3ViIiwgImFuaW1hdGFibGVJZCIsICJvblNjcm9sbCIsICJvIiwgIm9uVmlldyIsICJBbmltYXRhYmxlVmFsdWUiLCAiI3N0ZXBzIiwgIiNvcHRpb25zIiwgIiNjdXJyZW50IiwgIiNzdWJzY3JpYmVycyIsICIjYXR0YWNobWVudHMiLCAiI3Jlc29sdmVFbGVtZW50UmVmIiwgInNlbGYiLCAiI2ZpbmROZWFyZXN0U2Nyb2xsZXIiLCAiI2NyZWF0ZVRpbWVsaW5lIiwgInRyaWdnZXIiLCAiU2Nyb2xsVGltZWxpbmVDdG9yIiwgIlZpZXdUaW1lbGluZUN0b3IiLCAiI3N0YXJ0VGltZWxpbmVEcml2ZW4iLCAiYXR0YWNobWVudCIsICJwbGFuIiwgInRpbWVsaW5lIiwgIiNzdGFydFRpbWVsaW5lRmFsbGJhY2siLCAidGltaW5nIiwgIiNidWlsZFRpbWluZyIsICJhbmltYXRpb24iLCAiI2J1aWxkS2V5ZnJhbWVzIiwgInN0ZXBzIiwgIiNyZXNvbHZlU3RlcCIsICJzY3JvbGxlciIsICJyYWZJZCIsICJjb21wdXRlUHJvZ3Jlc3MiLCAidnAiLCAicmVjdCIsICJ0b3RhbCIsICJtYXgiLCAibGlzdGVuVGFyZ2V0IiwgImhpbnQiLCAic3RlcCIsICJvZmZzZXRzIiwgImVhc2luZyIsICJmcmFtZSIsICJzdGFydCIsICIjdHJhY2tQcm9ncmVzcyIsICIjd2lyZVRyaWdnZXIiLCAibGFzdCIsICJyZXZlcnNlT25FeGl0IiwgInBsYXlGb3J3YXJkIiwgInBsYXlCYWNrd2FyZCIsICJlbnRlciIsICJsZWF2ZSIsICJvbkVudGVyIiwgIm9uTGVhdmUiLCAiZm9yd2FyZCIsICJvbkNsaWNrIiwgImFwcGx5IiwgInVuc3Vic2NyaWJlIiwgImV2ZW50TmFtZSIsICJhdHRyIiwgIndhbnRQcmVzZW50IiwgIm9uRXZlbnQiLCAiZXYiLCAibW8iLCAiI2VhY2giLCAiYXQiLCAicmF0ZSIsICJhbmltYXRhYmxlIiwgImlzQW5pbWF0YWJsZVZhbHVlIiwgInN0eWxlVGVtcGxhdGVJZCIsICJyZWFkUmVhY3RpdmVOdW1iZXIiLCAic2xvdCIsICJjdXJyZW50IiwgImdldFJlYWN0aXZlSW5pdGlhbE51bWJlciIsICJyZXBsYWNlVHlwZWRNYXJrZXJzIiwgInNsb3RzIiwgImlzRGlyZWN0U2xvdFZhbHVlIiwgImVzY2FwZWRNYXJrZXIiLCAic2VyaWFsaXplQW5pbWF0YWJsZUNzc1ZhbHVlIiwgImlzRGlyZWN0U2xvdFVuaXRQcm9kdWN0IiwgImVzY2FwZWRVbml0IiwgInNldFBhcnNlZFR5cGVkVmFsdWUiLCAic3R5bGVNYXAiLCAicHJvcGVydHkiLCAidG9rZW5pemVOdW1lcmljQ1NTIiwgInZhcmlhYmxlIiwgIk51bWVyaWNUeXBlZE9NUGFyc2VyIiwgInJlYWN0aXZlQnlNYXJrZXIiLCAidHlwZWRCeU1hcmtlciIsICJyZWFjdGl2ZSIsICJjaGVja3BvaW50IiwgInJocyIsICJsZWFmIiwgInR5cGVkIiwgImJ1aWxkTnVtZXJpY1R5cGVkT01UcmVlIiwgInJlYWN0aXZlU2xvdHMiLCAidHlwZWRTbG90cyIsICJpc1RyYW5zZm9ybVN0eWxlUHJvcGVydHkiLCAiYnVpbGRUcmFuc2Zvcm1UeXBlZE9NVHJlZSIsICJsZWF2ZXMiLCAiY29tcG9uZW50cyIsICJ6ZXJvUHgiLCAib25lTnVtYmVyIiwgImluZGV4IiwgImNvbnN1bWUiLCAiY29uc3VtZVN5bWJvbCIsICJwYXJzZUFyZ3VtZW50IiwgInNsaWNlIiwgInRyZWUiLCAicGFyc2VBcmd1bWVudExpc3QiLCAiY3JlYXRlQ29tcG9uZW50IiwgImN0b3IiLCAiY2xhc3NOYW1lIiwgIkN0b3IiLCAiVHJhbnNsYXRlIiwgIlNjYWxlIiwgIlJvdGF0ZSIsICJTa2V3IiwgIkNTU1RyYW5zZm9ybVZhbHVlQ3RvciIsICJidWlsZFR5cGVkT01TdHlsZVZhbHVlIiwgImFkZE11dGFibGVMZWF2ZXMiLCAiYXR0YWNoTGVhZlRhcmdldHMiLCAiYXBwbHlTdHlsZVRlbXBsYXRlIiwgInZhcmlhYmxlcyIsICJhbmltYXRhYmxlU2xvdHMiLCAicHJvYmUiLCAibXV0YWJsZUxlYXZlcyIsICJyZXF1aXJlZENTU1ZhcmlhYmxlcyIsICJzdWJzY3JpcHRpb25zIiwgInByb3BlcnR5TW9kZU93bmVkIiwgInBhcnNlZFZhbHVlIiwgImluaXRpYWxOdW1iZXIiLCAiZW5zdXJlUmVnaXN0ZXJlZE51bWJlclByb3BlcnR5IiwgInByaW9yaXR5IiwgInVzZWRUeXBlZFNsb3RzIiwgInVzZWRSZWFjdGl2ZVNsb3RzIiwgImNhblVzZVR5cGVkT00iLCAiYXBwbGllZFRocm91Z2hUeXBlZE9NIiwgImRpcmVjdFNsb3QiLCAibGlua2VkVmFsdWUiLCAiQ1NTTWF0aFByb2R1Y3RDdG9yIiwgInByb2R1Y3QiLCAicmVjb25zdHJ1Y3RlZCIsICJuZWVkc0NTU1ZhcmlhYmxlIiwgInN1YnNjcmlwdGlvbiIsICJuZXh0VmFsdWUiLCAiZGlydHlSb290cyIsICJwcm9wZXJ0eU5hbWUiLCAiY29tcGxpbGVTdGF0aWNDU1NUZXh0IiwgImZvclJldHVybiIsICJwcm9wZXJ0aWVzIiwgIlMiLCAic3RyaW5ncyIsICJ0ZW1wbGF0ZUlkIiwgImNvbnN1bWVkIiwgIm5leHRUZXh0IiwgImF0dGFjaGVkVW5pdCIsICJpbml0aWFsVmFsdWUiLCAidHlwZSIsICJzcGxpdElubGluZVN0eWxlUGxhY2Vob2xkZXJzIiwgImF0dHJpYnV0ZXMiLCAicGF0dGVybiIsICJhdHRyaWJ1dGVJbmRleCIsICJqb2luU3RhdGljSW5saW5lU3R5bGUiLCAiY29tcGlsZUlubGluZVN0eWxlQXR0cmlidXRlIiwgImJpbmRTdHlsZSIsICJzdHlsZWQiLCAicGFyc2VQcm9wZXJ0eUxpc3QiLCAiZnJvbUtleWZyYW1lcyIsICJmcm9tU3RyaW5nIiwgIiRwYWlyIiwgIml0ZW0iLCAiayIsICJwYXJzZUFuaW1hdGlvblRlbXBsYXRlIiwgImZ1bGxUZXh0IiwgInZhbHVlVGV4dCIsICJzbG90TWF0Y2giLCAic2xvdFZhbHVlIiwgInByb2Nlc3NBbmltYXRpb25WYWx1ZXMiLCAicmVzb2x2ZWQiLCAicmVhY3RpdmVJbmRpY2VzIiwgImhhc1JlYWN0aXZlIiwgImJ1aWxkV2ViQW5pbWF0aW9uS2V5ZnJhbWVzIiwgImdsb2JhbE9mZnNldHMiLCAicHJvcGVydHlMaXN0IiwgIm1heExlbmd0aCIsICJwIiwgIl8iLCAiZnJhbWVzIiwgImtlYmFiUHJvcCIsICJidWlsZEFuaW1hdGlvblRpbWluZyIsICJkdXJhdGlvbiIsICJkZWxheSIsICJpdGVyYXRpb25zIiwgImNyZWF0ZVJlYWN0aXZlQW5pbWF0aW9uIiwgInJlYWN0aXZlVmFsdWUiLCAibmV3RnJhbWVzIiwgImN1cnJlbnRUaW1lIiwgInN1YiIsICJBIiwgImRvQW5pbWF0aW9uIiwgImNvbmZpZyIsICJrZXlmcmFtZXMiLCAiY2FuQW5pbWF0ZSIsICJhbmltYXRlIiwgInJlY29yZCIsICJkZWZpbmVBbmltYXRpb24iLCAic2VxdWVuY2VBbmltYXRpb25zIiwgInNlcXVlbmNlIiwgInBhcmFsbGVsQW5pbWF0aW9ucyIsICJhbmltYXRpb25zIiwgInJlc3VsdHMiLCAiY2xlYW51cCIsICJzdGFnZ2VyQW5pbWF0aW9uIiwgImVsZW1lbnRzIiwgInN0YWdnZXJEZWxheSIsICJpc1JlYWN0aXZlVHJpZ2dlciIsICJhc1Byb3BlcnR5TGlzdCIsICJrZiIsICJzZXJpYWxpemVWYWx1ZSIsICJpc0VsZW1lbnQiLCAiY29tcGlsZUtleWZyYW1lc0NzcyIsICJkZWNscyIsICJwY3QiLCAiY29tcGlsZVRyaWdnZXJDc3MiLCAiY29tcGlsZWQiLCAia2luZCIsICJyZXNvbHZlQ3NzQW5pbWF0aW9uVGFyZ2V0IiwgImRlY2xhcmF0aW9uc1RvVGV4dCIsICJiaW5kQ3NzQW5pbWF0aW9uIiwgImtleWZyYW1lc1J1bGUiLCAiY29tcGFuaW9uVGV4dCIsICJjb21wYW5pb25JbmRleCIsICJjb21wYW5pb25SdWxlIiwgImRlbGV0ZUtleWZyYW1lc0Zyb20iLCAic2hlZXRIb3N0IiwgImRlYWQiLCAibmV4dEhvc3RDb3VudCIsICJsZWZ0b3ZlciIsICJvbkJvcmRlck9ic2VydmVTeW1ib2wiLCAib25Cb3JkZXJPYnNlcnZlIiwgIm9uQ29udGVudE9ic2VydmVTeW1ib2wiLCAib25Db250ZW50T2JzZXJ2ZSIsICJ1bndyYXBGcm9tUXVlcnkiLCAibm9ybWFsaXplU2VsZWN0b3IiLCAic2FmZVF1ZXJ5U2VsZWN0b3JBbGwiLCAic2FmZU1hdGNoZXMiLCAib2JzZXJ2ZUF0dHJpYnV0ZUJ5U2VsZWN0b3IiLCAiYXR0cmlidXRlIiwgImF0dHJpYnV0ZUxpc3QiLCAibXV0YXRpb25MaXN0IiwgIm11dGF0aW9uIiwgImFkZGVkTm9kZXMiLCAicmVtb3ZlZE5vZGVzIiwgIlBvbHlmaWxsQ3VzdG9tRXZlbnQiLCAiaW5pdCIsICJoYXNQYXlsb2FkIiwgInJlZHVjZWQiLCAiZGlzcGF0Y2hMaWZlY3ljbGVFdmVudCIsICJ3YWl0RWxlbWVudEFuaW1hdGlvbnMiLCAicmVzb2x2ZSIsICJpc1JlY29yZFByb3BlcnRpZXMiLCAiZmxpZ2h0cyIsICJzdGFydFBsYXllciIsICJlcnIiLCAibXNnIiwgInBsYXkiLCAiYmVmb3JlIiwgImFmdGVyIiwgInByaW9yIiwgImNhbmNlbGxlZCIsICJzZXR0bGUiLCAiYWJvcnRlZCIsICJwbGF5ZXIiLCAiZmxpZ2h0IiwgImFwcGVhciIsICJkaXNhcHBlYXIiLCAiZGVjb3JTaG93IiwgImRlY29ySGlkZSIsICJpbml0VmlzaWJpbGl0eSIsICJST09UIiwgImhpZGRlbiJdCn0K
