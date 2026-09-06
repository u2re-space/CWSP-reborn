function ae() {
  const e = globalThis;
  if (typeof e.HTMLElement == "function") return;
  const t = class {
  }, r = (n) => {
    typeof e[n] != "function" && (e[n] = t);
  };
  r("EventTarget"), r("Node"), r("Element"), r("HTMLElement"), r("SVGElement"), r("Text"), r("Comment"), r("DocumentFragment"), r("ShadowRoot"), r("HTMLDocument"), r("Document"), r("HTMLBodyElement"), r("HTMLHeadElement"), r("HTMLCanvasElement"), r("HTMLInputElement"), r("HTMLLinkElement"), r("HTMLStyleElement"), r("HTMLPreElement"), r("HTMLDivElement"), r("CSSStyleRule"), r("CSSLayerBlockRule");
}
var X = /* @__PURE__ */ Symbol.for("@fix"), qe = (e) => e?.some?.(m), Ge = (e) => Array.isArray(e) || e instanceof Set || e instanceof Map, m = (e) => typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" || typeof e > "u" || e == null, ce = (e, t) => m(e) ? t == "number" ? Number(e) || 0 : t == "string" ? String(e) || "" : t == "boolean" ? !!e : e : null, U = (e, t = "value") => (typeof e == "object" || typeof e == "function") && e != null && (t in e || e?.[t] != null), Y = (e) => U(e, "value"), le = (e) => m(e) ? e : Y(e) ? e?.value : e, l = (e, t) => e?.[X] ?? e ?? t ?? t, W = (e) => e != null && (typeof e == "object" || typeof e == "function") && (e instanceof WeakRef || typeof e?.deref == "function") ? W(e?.deref?.()) : e, ue = (e) => {
  if (typeof e == "function" || e == null) return e;
  const t = function() {
  };
  return t[X] = e, t;
}, Je = (e, t, r) => (e = W(e), e != null && (typeof e == "object" || typeof e == "function") ? e[t] = le(r = W(r)) : e), ye = (e) => crypto?.getRandomValues ? crypto?.getRandomValues?.(e) : (() => {
  const t = new Uint8Array(e.length);
  for (let r = 0; r < e.length; r++) t[r] = Math.floor(Math.random() * 256);
  return t;
})();
function Xe(e, t, r) {
  return Math.min(Math.max(e, t), r);
}
var Ye = (e, t, r) => Math.max(e, Math.min(t, r)), Ze = (e, t) => typeof t == "function" ? t?.bind?.(e) ?? t : t, Qe = () => crypto?.randomUUID ? crypto?.randomUUID?.() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (e) => (+e ^ ye?.(/* @__PURE__ */ new Uint8Array(1))?.[0] & 15 >> +e / 4).toString(16)), et = (e) => e && e?.replace?.(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), tt = (e) => e && e?.replace?.(/-([a-z])/g, (t, r) => r.toUpperCase()), rt = (e, t = 0) => {
  const r = Number(e);
  return Number.isFinite(r) ? r : t;
}, nt = (e, t) => !Number.isFinite(t) || t <= 0 || !Number.isFinite(e) ? 0 : Math.min(Math.max(e, 0), t), P = (e, t = 1) => Math.round(e * t) / t, st = (e, t = 1) => Math.floor(e * t) / t, it = (e, t = 1) => Math.ceil(e * t) / t, ot = (e) => typeof CSSStyleValue < "u" && e instanceof CSSStyleValue, ft = (e) => e != null && (typeof e == "boolean" ? e !== !1 : !0) && typeof e != "object" && typeof e != "function", at = (e) => typeof e == "boolean" ? e ? "" : null : typeof e == "number" ? String(e) : e, z = /* @__PURE__ */ Symbol.for("@trigger-lock"), ct = (e, t, r = "value") => {
  U(e, r) && (e[z] = !0);
  let n;
  try {
    n = t?.();
  } finally {
    U(e, r) && delete e[z];
  }
  return n;
}, lt = (e) => {
  if (typeof e != "string") return null;
  const t = [...e?.matchAll?.(/^\d+(\.\d+)?$/g)];
  if (t?.length != 1) return null;
  const r = parseFloat(t[0][0]);
  return !Number.isNaN(r) && Number.isFinite(r) ? r : null;
}, he = /^\d+$/g, de = (e) => {
  if (typeof e != "string" || (e = e?.trim?.(), e == "" || e == null)) return null;
  const t = [...e?.matchAll?.(he)];
  if (t?.length != 1) return null;
  const r = parseInt(t[0][0]);
  return !Number.isNaN(r) && Number.isInteger(r) ? r : null;
}, ut = (e) => typeof e == "number" && !Number.isNaN(e), yt = (e) => typeof e == "string" ? de(e) != null : typeof e == "number" && Number.isInteger(e) && e >= 0, ht = (e) => Array.isArray(e) || e != null && typeof e == "object" && typeof e[Symbol.iterator] == "function", dt = (e, t, r) => {
  e = e instanceof WeakRef ? e.deref() : e;
  const n = [...Object.entries(r)].map?.(([s, i]) => e?.[t]?.call?.(e, s, i));
  return () => {
    n?.forEach?.((s) => s?.());
  };
}, Z = (e) => e instanceof WeakRef || typeof e?.deref == "function", mt = (e) => Z(e) ? W(e) : e, pt = (e) => e != null ? Z(e) ? e : typeof e == "function" || typeof e == "object" ? new WeakRef(e) : e : e, St = (e) => (typeof e == "object" || typeof e == "function") && (e?.value != null || e != null && "value" in e), gt = (e) => e != null && (typeof e == "object" || typeof e == "function"), Pt = (e) => Y(e) ? e?.value : e, bt = (e, t) => e instanceof Promise || typeof e?.then == "function" ? e?.then?.(t) : t?.(e), Mt = (e, t) => e instanceof Promise || typeof e?.then == "function" ? e?.then?.(t) : t?.(e), vt = function(e) {
  return (t) => {
    e[z] = !0;
    let r;
    try {
      r = t?.();
    } finally {
      e[z] = !1;
    }
    return r;
  };
}, Q = (e) => Array.isArray(e) ? e?.flatMap?.((t) => Array.isArray(t) ? Q(t) : t) : e, me = (e) => Q(e)?.every?.(E), E = (e) => m(e) || typeof SharedArrayBuffer == "function" && e instanceof SharedArrayBuffer || pe(e) || Array.isArray(e) && me(e), pe = (e) => ArrayBuffer.isView(e) && !(e instanceof DataView), At = (e) => typeof e == "symbol" || typeof e == "object" && Object.prototype.toString.call(e) == "[object Symbol]", Tt = (e) => e instanceof Promise || typeof e?.then == "function", wt = (e) => m(e) || typeof ArrayBuffer == "function" && e instanceof ArrayBuffer || typeof MessagePort == "function" && e instanceof MessagePort || typeof ReadableStream == "function" && e instanceof ReadableStream || typeof WritableStream == "function" && e instanceof WritableStream || typeof TransformStream == "function" && e instanceof TransformStream || typeof ImageBitmap == "function" && e instanceof ImageBitmap || typeof VideoFrame == "function" && e instanceof VideoFrame || typeof OffscreenCanvas == "function" && e instanceof OffscreenCanvas || typeof RTCDataChannel == "function" && e instanceof RTCDataChannel || typeof AudioData == "function" && e instanceof AudioData || typeof WebTransportReceiveStream == "function" && e instanceof WebTransportReceiveStream || typeof WebTransportSendStream == "function" && e instanceof WebTransportSendStream || typeof WebTransportReceiveStream == "function" && e instanceof WebTransportReceiveStream, xt = (e) => {
  switch (typeof e) {
    case "number":
      return 0;
    case "string":
      return "";
    case "boolean":
      return !1;
    case "object":
      return null;
    case "function":
      return null;
    case "symbol":
      return null;
    case "bigint":
      return 0n;
  }
}, $ = /* @__PURE__ */ Symbol.for("@promise"), Se = /* @__PURE__ */ new Set([
  /* @__PURE__ */ Symbol.for("@extract"),
  /* @__PURE__ */ Symbol.for("@origin"),
  /* @__PURE__ */ Symbol.for("@registry"),
  /* @__PURE__ */ Symbol.for("@value"),
  /* @__PURE__ */ Symbol.for("@promise"),
  /* @__PURE__ */ Symbol.for("@behavior"),
  /* @__PURE__ */ Symbol.for("@trigger"),
  /* @__PURE__ */ Symbol.for("@subscribe"),
  /* @__PURE__ */ Symbol.for("@realProp"),
  /* @__PURE__ */ Symbol.for("@trigger-lock"),
  /* @__PURE__ */ Symbol.for("@trigger-less"),
  /* @__PURE__ */ Symbol.for("@trigger-control"),
  /* @__PURE__ */ Symbol.for("@isNotEqual"),
  /* @__PURE__ */ Symbol.for("@fix"),
  /* @__PURE__ */ Symbol.for("@target"),
  /* @__PURE__ */ Symbol.for("@resolved")
]), O = (e) => e instanceof Promise || typeof e?.then == "function", j = (e) => Promise.resolve(e).then((t) => ({
  status: "fulfilled",
  value: t
}), (t) => ({
  status: "rejected",
  reason: t
})), ee = (e) => Reflect.ownKeys(e).filter((t) => {
  if (Se.has(t)) return !1;
  const r = Object.getOwnPropertyDescriptor(e, t);
  return r !== void 0 && r.enumerable;
}), x = (e, t) => {
  if (e == null || m(e)) return !1;
  if (O(e) || O(e?.[$])) return !0;
  if (typeof e != "object" && typeof e != "function") return !1;
  const r = t ?? /* @__PURE__ */ new WeakSet();
  return r.has(e) ? !1 : (r.add(e), Array.isArray(e) ? e.some((n) => x(n, r)) : e instanceof Map ? [...e.values()].some((n) => x(n, r)) : e instanceof Set ? [...e.values()].some((n) => x(n, r)) : ee(e).some((n) => x(e[n], r)));
};
function _(e, t, r) {
  if (e == null || m(e) || typeof e == "symbol" || O(e)) return e;
  const n = e?.[$];
  if (O(n)) return n;
  if (typeof e != "object" && typeof e != "function" || r.has(e)) return e;
  if (r.add(e), Array.isArray(e)) {
    const i = e.map((o) => _(o, t, r));
    return t == "settled" ? Promise.allSettled(i) : Promise.all(i);
  }
  if (e instanceof Set) {
    const i = [...e.values()].map((o) => _(o, t, r));
    return t == "settled" ? Promise.allSettled(i) : Promise.all(i);
  }
  const s = {};
  if (e instanceof Map) for (const [i, o] of e.entries()) s[i] = _(o, t, r);
  else for (const i of ee(e)) s[i] = _(e[i], t, r);
  return t == "settled" ? Promise.allSettledKeyed(s) : Promise.allKeyed(s);
}
function p(e, t = "all") {
  if (O(e)) return t == "settled" ? j(e) : Promise.resolve(e);
  const r = e?.[$];
  return O(r) ? t == "settled" ? j(r) : Promise.resolve(r) : Promise.resolve(_(e, t, /* @__PURE__ */ new WeakSet()));
}
p.all = (e) => p(e, "all");
p.allSettled = (e) => p(e, "settled");
p.allKeyed = (e) => Promise.allKeyed(e);
p.allSettledKeyed = (e) => Promise.allSettledKeyed(e);
p.try = (e, ...t) => Promise.try(e, ...t).then((r) => p(r, "all"));
var ge = (e) => e instanceof Promise || typeof e?.then == "function";
function Ct(e) {
  return Promise.allKeyed(e);
}
function Ot(e) {
  return Promise.allSettledKeyed(e);
}
function Rt() {
  let e, t, r = !1, n = !1;
  return {
    promise: new Promise((s, i) => {
      e = (o) => {
        !r && !n && (r = !0, s(o));
      }, t = (o) => {
        !r && !n && (n = !0, i(o));
      };
    }),
    resolve: e,
    reject: t,
    get isResolved() {
      return r;
    },
    get isRejected() {
      return n;
    }
  };
}
var Et = class {
  queue = [];
  processing = !1;
  async add(e) {
    return new Promise((t, r) => {
      this.queue.push(async () => {
        try {
          t(await e());
        } catch (n) {
          r(n);
        }
      }), this.process();
    });
  }
  async process() {
    if (!(this.processing || this.queue.length === 0)) {
      for (this.processing = !0; this.queue.length > 0; ) await this.queue.shift()();
      this.processing = !1;
    }
  }
  get length() {
    return this.queue.length;
  }
  get isProcessing() {
    return this.processing;
  }
};
function _t(e, t, r = "Operation timed out") {
  const n = ge(e) ? e : p(e), s = new Promise((i, o) => {
    setTimeout(() => o(new Error(r)), t);
  });
  return Promise.race([n, s]);
}
async function It(e, t = 3, r = 1e3, n = 2) {
  let s;
  for (let i = 0; i <= t; i++) try {
    return await e();
  } catch (o) {
    if (s = o, i < t) {
      const f = r * Math.pow(n, i);
      await new Promise((a) => setTimeout(a, f));
    }
  }
  throw s;
}
async function Dt(e, t) {
  const r = [], n = [];
  for (let s = 0; s < e.length; s++) {
    const i = e[s], o = Promise.resolve().then(async () => {
      try {
        const f = await i();
        r[s] = f;
      } catch (f) {
        throw f;
      }
    });
    r[s] = void 0, n.push(o), n.length >= t && (await Promise.race(n), n.splice(n.findIndex((f) => f === o), 1));
  }
  return await Promise.all(n), r;
}
var Pe = class {
  channels = /* @__PURE__ */ new Map();
  listeners = /* @__PURE__ */ new Map();
  register(e, t) {
    this.channels.set(e, t);
    const r = this.listeners.get(e);
    if (r) for (const n of r) try {
      n(t);
    } catch (s) {
      console.error(`[ChannelRegistry] Listener error for ${e}:`, s);
    }
    return t;
  }
  get(e) {
    return this.channels.get(e);
  }
  has(e) {
    return this.channels.has(e);
  }
  unregister(e) {
    const t = this.channels.delete(e);
    if (t) {
      const r = this.listeners.get(e);
      if (r) for (const n of r) try {
        n(null);
      } catch (s) {
        console.error(`[ChannelRegistry] Unregister listener error for ${e}:`, s);
      }
    }
    return t;
  }
  onChannelChange(e, t) {
    this.listeners.has(e) || this.listeners.set(e, /* @__PURE__ */ new Set());
    const r = this.listeners.get(e);
    if (r.add(t), this.channels.has(e)) try {
      t(this.channels.get(e));
    } catch (n) {
      console.error(`[ChannelRegistry] Initial listener error for ${e}:`, n);
    }
    return () => {
      r.delete(t), r.size === 0 && this.listeners.delete(e);
    };
  }
  getChannelNames() {
    return Array.from(this.channels.keys());
  }
  clear() {
    this.channels.clear(), this.listeners.clear();
  }
}, kt = new Pe();
function Nt(e, t) {
  const r = {};
  for (const n of t) r[n] = (...s) => e.request(n, s);
  return r;
}
var be = class {
  healthChecks = /* @__PURE__ */ new Map();
  intervals = /* @__PURE__ */ new Map();
  healthStatus = /* @__PURE__ */ new Map();
  registerHealthCheck(e, t, r = 3e4) {
    this.healthChecks.set(e, t);
    const n = this.intervals.get(e);
    n && clearInterval(n);
    const s = setInterval(async () => {
      try {
        const i = await t();
        this.healthStatus.set(e, i), i || console.warn(`[ChannelHealth] Channel '${e}' is unhealthy`);
      } catch (i) {
        console.error(`[ChannelHealth] Health check failed for '${e}':`, i), this.healthStatus.set(e, !1);
      }
    }, r);
    this.intervals.set(e, s), t().then((i) => {
      this.healthStatus.set(e, i);
    }).catch(() => {
      this.healthStatus.set(e, !1);
    });
  }
  isHealthy(e) {
    return this.healthStatus.get(e) ?? !1;
  }
  getAllHealthStatuses() {
    const e = {};
    for (const [t, r] of this.healthStatus) e[t] = r;
    return e;
  }
  stopMonitoring(e) {
    const t = this.intervals.get(e);
    t && (clearInterval(t), this.intervals.delete(e)), this.healthChecks.delete(e), this.healthStatus.delete(e);
  }
  stopAllMonitoring() {
    for (const e of this.intervals.values()) clearInterval(e);
    this.intervals.clear(), this.healthChecks.clear(), this.healthStatus.clear();
  }
}, Wt = new be(), zt = (e, t, r = () => null) => e?.getOrInsertComputed?.(t, () => r?.()), Ht = (e, t, r = () => null) => e?.getOrInsertComputed?.(t, r), C = (e) => typeof e?.[Symbol.iterator] == "function", Ft = (e) => [
  "symbol",
  "string",
  "number"
].indexOf(typeof e) >= 0, Lt = (e) => e != null && (typeof e == "function" || typeof e == "object") && !(e instanceof WeakRef), Ut = (e, t = "id") => {
  const r = Array.from(e?.values?.()).map((s) => [s?.[t], s]), n = new Map(r);
  return Array.from(n?.values?.() || []);
}, Me = (e, t, r = null) => {
  const n = r != null && (typeof e == "object" || typeof e == "function") ? e?.[r] ?? e : e;
  let s = [];
  t instanceof Set || t instanceof Map || Array.isArray(t) || C(t) ? s = (n instanceof Set || n instanceof WeakSet ? t?.values?.() : t?.entries?.()) || (Array.isArray(t) || C(t) ? t : []) : (typeof t == "object" || typeof t == "function") && (s = n instanceof Set || n instanceof WeakSet ? Object.values(t) : Object.entries(t));
  let i = [];
  Array.isArray(n) ? i = n.entries() : n instanceof Map || n instanceof WeakMap ? i = n?.entries?.() : n instanceof Set || n instanceof WeakSet ? i = n?.values?.() : (typeof n == "object" || typeof n == "function") && (i = Object.entries(n));
  const o = new Set(Array.from(s).map((c) => c?.[0])), f = new Set(Array.from(i).map((c) => c?.[0])), a = o?.difference?.(f);
  if (Array.isArray(n)) {
    const c = n.filter((y, v) => !a.has(v));
    n.splice(0, n.length), n.push(...c);
  } else if (n instanceof Map || n instanceof Set || n instanceof WeakMap || n instanceof WeakSet) for (const c of a) n.delete(c);
  else if (typeof n == "function" || typeof n == "object") for (const c of a) delete n[c];
  return n;
}, ve = (e, t, r = null, n = !0, s = "id") => {
  const i = r != null && (typeof e == "object" || typeof e == "function") ? e?.[r] ?? e : e;
  let o = null;
  if (n && Me(i, t), t instanceof Set || t instanceof Map || Array.isArray(t) || C(t) ? o = (i instanceof Set || i instanceof WeakSet ? t?.values?.() : t?.entries?.()) || (Array.isArray(t) || C(t) ? t : []) : (typeof t == "object" || typeof t == "function") && (o = i instanceof Set || i instanceof WeakSet ? Object.values(t) : Object.entries(t)), i && o && (typeof o == "object" || typeof o == "function")) {
    if (i instanceof Map || i instanceof WeakMap) {
      for (const f of o) i.set(...f);
      return i;
    }
    if (i instanceof Set || i instanceof WeakSet) {
      for (const f of o) {
        const a = f?.[s] ? Array.from(i?.values?.() || []).find((c) => !H?.(c?.[s], f?.[s])) : null;
        a != null ? ve(a, f, null, n, s) : i.add(f);
      }
      return i;
    }
    if (typeof i == "object" || typeof i == "function") {
      if (Array.isArray(i) || C(i)) {
        let f = 0;
        for (const a of o) f < i.length ? i[f++] = a?.[1] : i?.push?.(a?.[1]);
        return i;
      }
      return Object.assign(i, Object.fromEntries([...o || []].filter((f) => typeof f != "symbol")));
    }
  }
  return r != null ? (Reflect.set(e, r, t), e) : typeof t == "object" || typeof t == "function" ? Object.assign(e, t) : t;
}, Ae = (e, t) => we.getOrInsert(e, /* @__PURE__ */ new WeakMap()).getOrInsert(t, t?.bind?.(e)), Bt = (e, t) => (typeof t == "function" ? Ae(e, t) : t) ?? t, F = (e, t, r, n) => {
  if (t == Symbol.iterator) return Te(e, r, n);
  if (t == null || typeof t == "symbol" || typeof t == "object" || typeof t == "function") return;
  const s = (i, ...o) => {
    if (i != null) return r?.(i, ...o);
  };
  if (e instanceof Map || e instanceof WeakMap) {
    if (e.has(t)) return s?.(e.get(t), t, null, "@set");
  } else if (e instanceof Set || e instanceof WeakSet) {
    if (e.has(t)) return s?.(t, t, null, "@add");
  } else if (Array.isArray(e) && typeof t == "string" && [...t?.matchAll?.(/^\d+$/g)].length == 1 && Number.isInteger(typeof t == "string" ? parseInt(t) : t)) {
    const i = typeof t == "string" ? parseInt(t) : t;
    return s?.(e?.[i], i, null, "@add");
  } else if (typeof e == "function" || typeof e == "object") return s?.(e?.[t], t, null, "@set");
}, $t = (e, t = {}) => (Object.entries(t)?.forEach?.(([r, n]) => {
  H(n, e[r]) && (e[r] = n);
}), e), Te = (e, t, r) => {
  if (e == null) return;
  let n = [];
  if (e instanceof Set || e instanceof Map || typeof e?.keys == "function") return [...e?.keys?.() || n].forEach?.((s) => F(e, s, t, r));
  if (Array.isArray(e) || C(e)) return [...e].forEach?.((s, i) => F(e, i, t, r));
  if (typeof e == "object" || typeof e == "function") return [...Object.keys(e) || n].forEach?.((s) => F(e, s, t, r));
}, Kt = (e, t) => e == null && t == null ? !1 : e == null || t == null ? !0 : e instanceof Map || e instanceof WeakMap ? e.size != t.size || Array.from(e.entries()).some(([r, n]) => !t.has(r) || !H(n, t.get(r))) : e instanceof Set || e instanceof WeakSet ? e.size != t.size || Array.from(e.values()).some((r) => !t.has(r)) : Array.isArray(e) || Array.isArray(t) ? e.length != t.length || e.some((r, n) => !H(r, t[n])) : typeof e == "object" || typeof t == "object" ? JSON.stringify(e) != JSON.stringify(t) : e != t, H = (e, t) => e == null && t == null ? !1 : e == null || t == null ? !0 : typeof e == "boolean" && typeof t == "boolean" ? e != t : typeof e == "number" && typeof t == "number" ? !(e == t || Math.abs(e - t) < 1e-9) : typeof e == "string" && typeof t == "string" ? e != "" && t != "" && e != t || e !== t : typeof e != typeof t ? e !== t : e && t && e != t || e !== t, te = /* @__PURE__ */ Symbol.for("object.boundCtx");
globalThis[te] ??= /* @__PURE__ */ new WeakMap();
var we = globalThis[te], Vt = (e, t) => {
  const r = e == null || e < 0 || typeof e != "number" || e == Symbol.iterator || (t != null ? e >= (t?.length || 0) : !1);
  return t != null ? Array.isArray(t) && r : !1;
}, jt = /* @__PURE__ */ new WeakMap(), qt = (e, t) => typeof e?.[t] == "function" ? e?.[t]?.bind?.(e) : e?.[t], D = (e, t, r) => {
  if (Array.isArray(e))
    return e.every(E) ? e.map(t) : e.map((n, s) => D(n, t, [e, s]));
  if (e instanceof Map) {
    const n = Array.from(e.entries());
    return n.map(([s, i]) => i).every(E) ? new Map(n.map(([s, i]) => [s, t(i, s, e)])) : new Map(n.map(([s, i]) => [s, D(i, t, [e, s])]));
  }
  if (e instanceof Set) {
    const n = Array.from(e.entries()), s = n.map(([i, o]) => o);
    return n.every(E) ? new Set(s.map(t)) : new Set(s.map((i) => D(i, t, [e, i])));
  }
  if (typeof e == "object" && e?.constructor == Object && Object.prototype.toString.call(e) == "[object Object]") {
    const n = Array.from(Object.entries(e));
    return n.map(([s, i]) => i).every(E) ? Object.fromEntries(n.map(([s, i]) => [s, t(i, s, e)])) : Object.fromEntries(n.map(([s, i]) => [s, D(i, t, [e, s])]));
  }
  return t(e, r?.[1] ?? "", r?.[0] ?? null);
}, Gt = (e, t, r) => {
  if (e?.[t] != null) {
    const n = e[t];
    return Array.isArray(r) ? n.add(...r) : typeof r == "function" && n.add(r), e;
  }
  return e[t] ??= Array.isArray(r) ? new Set(r) : typeof r == "function" ? /* @__PURE__ */ new Set([r]) : r, e;
}, re = /* @__PURE__ */ Symbol.for("@resolved-promise"), ne = /* @__PURE__ */ Symbol.for("@handled-promise");
globalThis[re] ??= /* @__PURE__ */ new WeakMap();
globalThis[ne] ??= /* @__PURE__ */ new WeakMap();
var g = globalThis[re], q = globalThis[ne], xe = /* @__PURE__ */ Symbol.for("@extract"), B = (e) => e instanceof Promise || typeof e?.then == "function", d = (e, t) => B(e) ? g?.has?.(e) ? t(g?.get?.(e)) : Promise.try?.(async () => {
  const r = await e;
  return g?.set?.(e, r), r;
})?.then?.(t) : t(e), Ce = class {
  #e;
  #t;
  constructor(e, t) {
    this.#e = e, this.#t = t;
  }
  defineProperty(e, t, r) {
    return l(e) instanceof Promise ? Reflect.defineProperty(e, t, r) : d(l(e), (n) => Reflect.defineProperty(n, t, r));
  }
  deleteProperty(e, t) {
    return l(e) instanceof Promise ? Reflect.deleteProperty(e, t) : d(l(e), (r) => Reflect.deleteProperty(r, t));
  }
  getPrototypeOf(e) {
    return l(e) instanceof Promise ? Reflect.getPrototypeOf(e) : d(l(e), (t) => Reflect.getPrototypeOf(t));
  }
  setPrototypeOf(e, t) {
    return l(e) instanceof Promise ? Reflect.setPrototypeOf(e, t) : d(l(e), (r) => Reflect.setPrototypeOf(r, t));
  }
  isExtensible(e) {
    return l(e) instanceof Promise ? Reflect.isExtensible(e) : d(l(e), (t) => Reflect.isExtensible(t));
  }
  preventExtensions(e) {
    return l(e) instanceof Promise ? Reflect.ownKeys(e) : d(l(e), (t) => Reflect.preventExtensions(t));
  }
  ownKeys(e) {
    const t = l(e);
    return t instanceof Promise ? Object.keys(t) : d(t, (r) => (typeof r == "object" || typeof r == "function") && r != null ? Object.keys(r) : []) ?? [];
  }
  getOwnPropertyDescriptor(e, t) {
    return l(e) instanceof Promise ? Reflect.getOwnPropertyDescriptor(e, t) : d(l(e), (r) => Reflect.getOwnPropertyDescriptor(r, t));
  }
  construct(e, t, r) {
    return d(l(e), (n) => Reflect.construct(n, t, r));
  }
  has(e, t) {
    return l(e) instanceof Promise ? Reflect.has(e, t) : d(l(e), (r) => Reflect.has(r, t));
  }
  get(e, t, r) {
    if (e = l(e), t == "promise") return e;
    if (t == "resolve" && this.#e) return (...s) => {
      const i = this.#e?.(...s);
      return this.#e = null, i;
    };
    if (t == "reject" && this.#t) return (...s) => {
      const i = this.#t?.(...s);
      return this.#t = null, i;
    };
    if (t == "then" || t == "catch" || t == "finally") {
      if (e instanceof Promise) return e?.[t]?.bind?.(e);
      {
        const s = Promise.try(() => e);
        return s?.[t]?.bind?.(s);
      }
    }
    let n;
    return g?.has?.(e) && (n = g?.get?.(e))?.[t] != null ? n = g?.get?.(e)?.[t] : n = T(d(e, async (s) => {
      if (l(s) instanceof Promise) return Reflect.get(s, t, r);
      if (m(s)) return t == Symbol.toPrimitive || t == Symbol.toStringTag ? s : void 0;
      let i;
      try {
        i = Reflect.get(s, t, r);
      } catch {
        i = e?.[t];
      }
      return typeof i == "function" ? i?.bind?.(s) : i;
    })), t == Symbol.toStringTag ? m(n) ? String(n ?? "") || "" : n?.[Symbol.toStringTag]?.() || String(n ?? "") || "" : t == Symbol.toPrimitive ? (s) => {
      if (m(n)) return ce(n, s);
    } : n;
  }
  set(e, t, r) {
    return d(l(e), (n) => Reflect.set(n, t, r));
  }
  apply(e, t, r) {
    if (this.#e) {
      const n = this.#e?.(...r);
      return this.#e = null, n;
    }
    return d(l(e, this.#e), (n) => {
      if (typeof n == "function")
        return l(n) instanceof Promise, Reflect.apply(n, t, r);
    });
  }
};
function T(e, t, r) {
  return e != null && typeof e?.resolved == "function" && e[xe] != null && x(e) ? T(e.resolved(), t, r) : !B(e) && x(e) ? T(p(e), t, r) : B(e) ? g?.has?.(e) ? g?.get?.(e) : (q?.has?.(e) || e?.then?.((n) => g?.set?.(e, n)), q.getOrInsertComputed(e, () => new Proxy(ue(e), new Ce(t, r)))) : e;
}
T.allKeyed = function(e, t, r) {
  return T(Promise.allKeyed(e), t, r);
};
T.allSettledKeyed = function(e, t, r) {
  return T(Promise.allSettledKeyed(e), t, r);
};
var L = /* @__PURE__ */ new WeakMap(), Oe = class {
  _deref(e) {
    return e instanceof WeakRef || typeof e?.deref == "function" ? e?.deref?.() : e;
  }
  get(e, t, r) {
    const n = this._deref(e), s = n?.[t];
    return (t == "element" || t == "value") && n && (s == null || !(t in n)) ? n : t == "deref" ? () => this._deref(e) : typeof s == "function" ? (...i) => this._deref(e)?.[t]?.(...i) : s;
  }
  set(e, t, r, n) {
    const s = this._deref(e);
    return s ? Reflect.set(s, t, r) : !0;
  }
  has(e, t) {
    const r = this._deref(e);
    return r ? t in r : !1;
  }
  ownKeys(e) {
    const t = this._deref(e);
    return t ? Reflect.ownKeys(t) : [];
  }
  getOwnPropertyDescriptor(e, t) {
    const r = this._deref(e);
    if (r)
      return Object.getOwnPropertyDescriptor(r, t);
  }
  deleteProperty(e, t) {
    const r = this._deref(e);
    return r ? Reflect.deleteProperty(r, t) : !0;
  }
  defineProperty(e, t, r) {
    const n = this._deref(e);
    return n ? Reflect.defineProperty(n, t, r) : !0;
  }
  getPrototypeOf(e) {
    const t = this._deref(e);
    return t ? Object.getPrototypeOf(t) : null;
  }
  setPrototypeOf(e, t) {
    const r = this._deref(e);
    return r ? Reflect.setPrototypeOf(r, t) : !0;
  }
  isExtensible(e) {
    const t = this._deref(e);
    return t ? Reflect.isExtensible(t) : !1;
  }
  preventExtensions(e) {
    const t = this._deref(e);
    return t ? Reflect.preventExtensions(t) : !0;
  }
};
function Jt(e) {
  if (!(typeof e == "object" || typeof e == "function") || typeof e == "symbol") return e;
  const t = e instanceof WeakRef || typeof e?.deref == "function";
  if (e = t ? e?.deref?.() : e, e != null && L.has(e)) return L.get(e);
  const r = new Oe(), n = new Proxy(t ? e : new WeakRef(e), r);
  return L.set(e, n), n;
}
var se = (e, t, r = 0) => {
  const n = [...t], s = [...e];
  return r % 2 && (s.reverse(), n.reverse()), [(r == 0 || r == 3 ? s[0] : n[0] - s[0]) || 0, (r == 0 || r == 1 ? s[1] : n[1] - s[1]) || 0];
}, Xt = (e, t, r = 0) => {
  const n = [...t], s = [...e];
  r % 2 && n.reverse();
  const i = [(r == 0 || r == 3 ? s[0] : n[0] - s[0]) || 0, (r == 0 || r == 1 ? s[1] : n[1] - s[1]) || 0];
  return r % 2 && i.reverse(), i;
}, Yt = (e, t = 0) => {
  const r = [...e];
  return t % 2 && r.reverse(), [(t == 0 || t == 3 ? r[0] : -r[0]) || 0, (t == 0 || t == 1 ? r[1] : -r[1]) || 0];
}, Zt = (e, t = 0) => {
  const r = [...e], n = [(t == 0 || t == 3 ? r[0] : -r[0]) || 0, (t == 0 || t == 1 ? r[1] : -r[1]) || 0];
  return t % 2 && n.reverse(), n;
}, b = (e, t = [4, 8]) => {
  if (Array.isArray(e) && e.length >= 2) return [Math.max(1, Math.floor(Number(e[0]) || t[0])), Math.max(1, Math.floor(Number(e[1]) || t[1]))];
  if (e && typeof e == "object") {
    const r = e;
    return [Math.max(1, Math.floor(Number(r.columns) || t[0])), Math.max(1, Math.floor(Number(r.rows) || t[1]))];
  }
  return [t[0], t[1]];
}, Re = (e, t) => {
  const [r, n] = b(t);
  return [Math.max(0, Math.min(r - 1, Math.floor(Number(e[0]) || 0))), Math.max(0, Math.min(n - 1, Math.floor(Number(e[1]) || 0)))];
}, Qt = (e, t, r, n, s) => {
  const i = b(r), o = Math.max(1, t[0] || 1), f = Math.max(1, t[1] || 1), a = se(e, [o, f], n), c = {
    item: s?.redirect?.item ?? { id: "" },
    list: s?.redirect?.list ?? [],
    items: s?.redirect?.items ?? /* @__PURE__ */ new Map(),
    layout: i,
    size: [o, f]
  }, y = Ie(a, c, n), v = (s?.mode ?? "floor") === "round" ? [Math.round(y[0]), Math.round(y[1])] : [Math.floor(y[0]), Math.floor(y[1])], w = _e(v, c);
  return Re(w, i);
}, Ee = (e) => e == null ? [] : Array.isArray(e) ? e : e instanceof Map ? Array.from(e.values()) : e instanceof Set || typeof e[Symbol.iterator] == "function" ? Array.from(e) : [], er = (e, t) => {
  const r = e.style.getPropertyValue(["--ox-c-span", "--ox-r-span"][t]), n = (parseFloat(r || "1") || 1) - 1;
  return Math.min(Math.max(n - 1, 0), 1);
}, _e = (e, t) => {
  const r = b(t?.layout ?? [4, 8]), n = {
    ...t,
    layout: r
  }, s = Ee(n?.items), i = n?.item || {}, o = (S) => s.filter((R) => !(R == i || R?.id == i?.id)).some((R) => (R?.cell?.[0] || 0) == (S[0] || 0) && (R?.cell?.[1] || 0) == (S[1] || 0)), f = [...e];
  if (!o(f)) return [...f];
  const a = r[0] || 4, c = r[1] || 8, y = ([
    [f[0] + 1, f[1]],
    [f[0] - 1, f[1]],
    [f[0], f[1] + 1],
    [f[0], f[1] - 1]
  ].filter((S) => S[0] >= 0 && S[0] < a && S[1] >= 0 && S[1] < c) || []).find((S) => !o(S));
  if (y) return [...y];
  let v = 0, w = !0, h = [...f];
  for (; w && v++ < a * c; ) {
    if (!(w = o(h))) return [...h];
    h[0]++, h[0] >= a && (h[0] = 0, h[1]++, h[1] >= c && (h[1] = 0));
  }
  return [...f];
}, tr = (e, t, r = 0) => {
  const n = [...t.size], s = [...e], i = b(t.layout ?? [4, 8]);
  return r % 2 && n.reverse(), [P(s[0], n[0] / i[0]), P(s[1], n[1] / i[1])];
}, Ie = (e, t, r = 0) => {
  const n = [...t.size], s = [...e], i = b(t.layout ?? [4, 8]);
  r % 2 && n.reverse();
  const o = [i[0] / n[0], i[1] / n[1]];
  return [s[0] * o[0], s[1] * o[1]];
}, rr = (e, t, r = 0) => {
  const n = [...e], s = [...t.size], i = b(t.layout ?? [4, 8]);
  r % 2 && s.reverse();
  const o = [s[0] / i[0], s[1] / i[1]];
  return [P(n[0], o[0]), P(n[1], o[1])];
}, nr = (e, t) => {
  const r = b(t.layout ?? [4, 8]);
  return [Math.min(Math.max(P(e[0]), 0), r[0] - 1), Math.min(Math.max(P(e[1]), 0), r[1] - 1)];
}, sr = (e, t, r = 0) => {
  const n = [...e], s = [...t.size], i = b(t.layout ?? [4, 8]), o = se(n, s, r), f = r % 2 ? [s[1], s[0]] : [s[0], s[1]];
  return [Math.min(Math.max(P(o[0] / f[0] * i[0], 1), 0), i[0] - 1), Math.min(Math.max(P(o[1] / f[1] * i[1], 1), 0), i[1] - 1)];
}, M = (e) => {
  const t = String(e ?? "").trim();
  return t ? (t.startsWith("/") ? t : `/${t}`).replace(/\/+/g, "/") : "/";
}, K = (e) => {
  const t = M(e);
  return t === "/user" || t.startsWith("/user/");
}, V = (e) => {
  const t = M(e);
  return t === "/user" ? "/" : t.startsWith("/user/") ? t.slice(5) || "/" : t;
}, ir = (e) => V(e).replace(/^\/+/, ""), or = (e) => {
  const t = M(e);
  return K(t) ? t : t === "/" ? "/user/" : `/user${t}`;
}, fr = (e) => {
  const t = M(e), r = V(t);
  return K(t) ? Array.from(/* @__PURE__ */ new Set([r, t])) : [r];
}, ie = (e) => {
  const t = M(e);
  return t === "/idb" || t.startsWith("/idb/");
}, De = (e) => {
  const t = M(e);
  return t === "/idb" ? "/" : t.startsWith("/idb/") ? t.slice(4) || "/" : t;
}, ke = (e) => K(e) || ie(e), Ne = (e) => {
  const t = M(e);
  return ie(t) ? De(t) : V(t);
}, ar = (e) => {
  const t = M(e), r = Ne(t);
  return ke(t) ? Array.from(/* @__PURE__ */ new Set([r, t])) : [r];
}, cr = "ssre:fs", lr = "/ssre/fs", ur = "/ssre/fs/ws", yr = () => {
  try {
    if (typeof crypto < "u" && typeof crypto.randomUUID == "function") return crypto.randomUUID();
  } catch {
  }
  return `fs_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}, We = (e) => !!e && typeof e == "object" && e.t === "fs" && typeof e.op == "string" && typeof e.id == "string", ze = (e) => !!e && typeof e == "object" && e.t === "fs-result" && typeof e.id == "string", hr = (e) => {
  let t = e;
  if (typeof e == "string") try {
    t = JSON.parse(e);
  } catch {
    return null;
  }
  return We(t) || ze(t) ? t : null;
}, dr = (e) => e ? (e = e?.replace?.(/_/g, " ") || e, e = e?.charAt?.(0)?.toUpperCase?.() + e?.slice?.(1) || e, e) : "", mr = (e, t, r = -1, n = null) => {
  e?.indexOf?.(t) >= 0 ? e.splice(e.indexOf(t), 1) : r >= 0 && r < e?.length && e.splice(r, 1);
}, pr = (e, t) => {
  e?.indexOf?.(t) >= 0 && e.splice(e.indexOf(t), 1);
}, He = (e, t) => {
  e?.indexOf?.(t) < 0 && e.push(t);
}, Sr = (e, t, r = -1) => {
  typeof r != "number" || r < 0 || r >= e?.length ? He(e, t) : typeof r == "number" && e?.indexOf?.(t) < 0 && e.splice(r, 0, t);
}, k = /* @__PURE__ */ new WeakMap(), N = /* @__PURE__ */ new Map(), Fe = async (e) => {
  try {
    e = await e;
  } catch (n) {
    e = null, console.warn(n);
  }
  if (e == null) return null;
  if (k.has(e) || e?.type != "application/json") return k.get(e);
  const t = await e?.text?.()?.catch?.(console.warn.bind(console)) || "{}";
  let r = {};
  try {
    r = JSON.parse(t);
  } catch {
    try {
      r = JSON.parse(t);
    } catch (s) {
      console.warn(s);
    }
  }
  return e && k.set(e, r), r;
}, gr = async (e, t) => {
  try {
    t = await t;
  } catch (n) {
    t = null, console.warn(n);
  }
  if (e == null) return null;
  if (N.has(e)) return N.get(e);
  const r = t != null ? await Fe(t) : N?.get(e);
  return e && N.set(e, r), r;
}, Pr = (e, t) => {
  const r = /* @__PURE__ */ new Map();
  e.forEach((s, i) => {
    s?.name && r.set(s.name, {
      item: s,
      index: i
    });
  });
  const n = /* @__PURE__ */ new Map();
  t.forEach((s) => {
    s?.name && n.set(s.name, s);
  });
  for (const [s, { index: i }] of r) {
    const o = n.get(s);
    o && (e[i] = o);
  }
  for (const [s, i] of n) r.has(s) || e.push(i);
  for (let s = e.length - 1; s >= 0; s--) {
    const i = e[s];
    i?.name && !n.has(i.name) && e.splice(s, 1);
  }
  return e.sort((s, i) => s?.name?.localeCompare?.(i?.name ?? "")), e;
}, Le = /\+?\d[\d\s().\-]{4,}\d/g, Ue = /(доб\.?|доп\.?|ext\.?|extension)\s*[:#\-x]*\s*\d+.*/i, oe = {
  defaultTrunk: "8",
  countryCode: "7",
  cityCode: null,
  stripExtensions: !0,
  minLocal: 5,
  maxLocal: 7
}, I = (e, t = {}) => {
  if (e == null) return null;
  const r = {
    ...oe,
    ...t
  };
  let n = String(e).trim();
  if (!n) return null;
  r.stripExtensions && (n = n.replace(Ue, ""));
  const s = /^\+/.test(n);
  let i = n.replace(/\D/g, "");
  if (!i) return null;
  if (s && i.startsWith(r.countryCode)) i = r.defaultTrunk + i.slice(r.countryCode.length);
  else if (i.length === 11 && i.startsWith(r.countryCode)) i = r.defaultTrunk + i.slice(1);
  else if (i.length === 10) i = r.defaultTrunk + i;
  else if (r.cityCode && i.length >= r.minLocal && i.length <= r.maxLocal) i = r.defaultTrunk + r.cityCode + i;
  else if (!(i.length === 11 && i.startsWith(r.defaultTrunk)))
    if (r.cityCode && i.length === r.cityCode.length + 7) i = r.defaultTrunk + i;
    else return null;
  return /^\d{11}$/.test(i) ? i : null;
}, G = (e) => {
  if (e == null) return [];
  const t = String(e), r = t.match(Le);
  return r?.length ? r : t.split(/[;,/|]+/).map((n) => n.trim()).filter(Boolean);
}, Be = (e, t = {}) => {
  const r = /* @__PURE__ */ new Set();
  if (Array.isArray(e)) for (const n of e) if (typeof n == "string") for (const s of G(n)) {
    const i = I(s, t);
    i && r.add(i);
  }
  else {
    const s = I(n, t);
    s && r.add(s);
  }
  else if (typeof e == "string") for (const n of G(e)) {
    const s = I(n, t);
    s && r.add(s);
  }
  else {
    const n = I(e, t);
    n && r.add(n);
  }
  return [...r];
}, $e = (e, t) => Array.isArray(e) && typeof e[1] == "number" ? e[1] : e && typeof e == "object" && typeof e.index == "number" ? e.index : t, Ke = (e) => {
  if (Array.isArray(e)) return e[0];
  if (e && typeof e == "object") {
    if ("phones" in e) return e.phones;
    if ("phone" in e) return e.phone;
  }
  return e;
};
function br(e, t = {}) {
  const r = {
    ...oe,
    ...t
  }, n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  e.forEach((f, a) => {
    const c = $e(f, a), y = Ke(f), v = Be(y, r);
    s.has(c) || s.set(c, /* @__PURE__ */ new Set());
    const w = s.get(c);
    for (const h of v)
      w.add(h), n.has(h) || n.set(h, /* @__PURE__ */ new Set()), n.get(h).add(c);
  });
  const i = {};
  for (const [f, a] of n.entries()) a.size > 1 && (i[f] = [...a].sort((c, y) => c - y));
  const o = {};
  for (const [f, a] of s.entries()) {
    const c = [...a].filter((y) => i[y]);
    c.length && (o[f] = c.sort());
  }
  return {
    duplicatesByNumber: i,
    pairs: Object.entries(o).map(([f, a]) => [Number(f), a]).sort((f, a) => f[0] - a[0]),
    duplicatesByIndex: o,
    normalize: (f) => I(f, r)
  };
}
var fe = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
function Ve(e) {
  return e ? /^([01]\d|2[0-3]):([0-5]\d)$/.test(String(e).trim()) : !1;
}
function A(e) {
  if (!e) return /* @__PURE__ */ new Date();
  if (e instanceof Date) return new Date(e);
  if (typeof e == "object" && e?.timestamp) return A(e.timestamp);
  if (typeof e == "object" && e?.iso_date) return A(e.iso_date);
  if (typeof e == "object" && e?.date) return A(e.date);
  if (typeof e == "number") {
    if (e >= 1e12) return new Date(e);
    const t = Math.pow(10, 11 - (String(e | 0)?.length || 11)) | 0;
    return new Date(e * t);
  }
  if (typeof e == "string" && Ve(e)) {
    const t = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(e.trim());
    if (!t) return /* @__PURE__ */ new Date();
    const [, r, n] = t, s = /* @__PURE__ */ new Date();
    return new Date(s.getFullYear(), s.getMonth(), s.getDate(), Number(r), Number(n), 0, 0);
  }
  return new Date(String(e));
}
function Mr(e) {
  return e ? typeof e == "number" ? e >= 1e12 ? e : e * (Math.pow(10, 11 - (String(e | 0)?.length || 11)) | 0) : e instanceof Date ? e.getTime() : A(e)?.getTime?.() ?? Date.now() : Date.now();
}
var vr = (e) => {
  if (!e) return null;
  const t = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate())), r = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - r);
  const n = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t.getTime() - n.getTime()) / 864e5 + 1) / 7);
}, je = (e) => e ? typeof e == "object" && (e.date || e.iso_date || e.timestamp) ? e : { iso_date: String(e) } : null, Ar = (e) => {
  const t = je(e);
  return t && A(t)?.toLocaleTimeString?.("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !1,
    timeZone: fe()
  }) || "";
}, Tr = (e) => A(e)?.toLocaleDateString?.("en-GB", {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
  timeZone: fe()
}) || "", wr = (e) => {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : t.toLocaleString(void 0, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}, u = (e) => {
  if (e == null) return NaN;
  if (typeof e == "number" && Number.isFinite(e)) return e;
  const t = A(e);
  if (t && !Number.isNaN(t?.getTime())) return t?.getTime() ?? 0;
  const r = String(e).match(/^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?/);
  if (r) {
    const s = Number(r[1]) || 0, i = Number(r[2]) || 0, o = Number(r[3]) || 0;
    return ((s * 60 + i) * 60 + o) * 1e3;
  }
  const n = Number(e);
  return Number.isFinite(n) ? n : NaN;
}, xr = (e) => {
  const t = e instanceof Date || typeof e == "string" && e.match(/^\d{4}-\d{2}-\d{2}$/);
  let r = !1;
  try {
    r = u(e) > 0;
  } catch {
    r = !1;
  }
  return !!((t && r) ?? !1);
}, Cr = (e, t, r) => e && t ? u(e) < u(r) && u(r) < u(t) : e ? u(e) < u(r) : t ? u(r) < u(t) : !1, Or = (e, t, r, n = 7) => {
  let s = !0;
  if (e && (s &&= u(r) <= u(e)), t && (s &&= u(r) < u(t)), n) {
    const i = u(r) + n * 24 * 60 * 60 * 1e3;
    s &&= u(e) < u(i);
  }
  return s;
}, Rr = (e, t) => {
  const r = u(e) || 0, n = (Number.isFinite(r) ? r : 0) - (t || 0);
  return Math.round(n / 864e5);
};
function Er(e, t) {
  let r;
  return (...n) => {
    clearTimeout(r), r = setTimeout(() => e(...n), t);
  };
}
function _r(e, t) {
  let r = !1;
  return (...n) => {
    r || (e(...n), r = !0, setTimeout(() => r = !1, t));
  };
}
function Ir(e) {
  return new Promise((t) => setTimeout(t, e));
}
function Dr(e = "") {
  return `${e}${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}
function J(e) {
  if (e === null || typeof e != "object") return e;
  if (e instanceof Date) return new Date(e.getTime());
  if (e instanceof Array) return e.map((t) => J(t));
  if (e instanceof Object) {
    const t = {};
    for (const r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = J(e[r]));
    return t;
  }
  return e;
}
function kr(e) {
  return e == null ? !0 : typeof e == "string" ? e.trim().length === 0 : Array.isArray(e) ? e.length === 0 : typeof e == "object" ? Object.keys(e).length === 0 : !1;
}
function Nr() {
  return typeof window < "u" && typeof document < "u";
}
function Wr() {
  return typeof self < "u" && typeof window > "u";
}
ae();
export {
  ct as $avoidTrigger,
  X as $fxy,
  le as $getValue,
  Je as $set,
  z as $triggerLock,
  Et as AsyncQueue,
  be as ChannelHealthMonitor,
  Pe as ChannelRegistry,
  Ue as EXT_CUT_RE,
  Fe as GET_OR_CACHE,
  gr as GET_OR_CACHE_BY_NAME,
  he as INTEGER_REGEXP,
  cr as MOUNTED_FS_EVENT,
  lr as MOUNTED_FS_HTTP_PATH,
  ur as MOUNTED_FS_WS_PATH,
  Le as PHONE_CANDIDATE_RE,
  He as PUSH_ONCE,
  T as Promised,
  pr as REMOVE_IF_HAS,
  mr as REMOVE_IF_HAS_SIMILAR,
  Sr as SPLICE_INTO_ONCE,
  Qe as UUIDv4,
  Jt as WRef,
  Ct as allKeyed,
  Ot as allSettledKeyed,
  Bt as bindCtx,
  Gt as bindEvent,
  Ae as bindFx,
  we as boundCtx,
  k as cachedPerFile,
  N as cachedPerFileName,
  Te as callByAllProp,
  F as callByProp,
  et as camelToKebab,
  yt as canBeInteger,
  it as ceilNearest,
  Cr as checkInTimeRange,
  Or as checkRemainsTime,
  Ye as clamp,
  nt as clampDimension,
  Re as clampGridCellTuple,
  sr as clientSpaceInOrientCX,
  Rr as computeTimelineOrderInGeneral,
  Dt as concurrentLimit,
  qt as contextify,
  Ie as convertOrientPxToCX,
  Nt as createChannelProxy,
  Rt as createDeferred,
  yr as createMountedFsId,
  se as cvt_cs_to_os,
  Xt as cvt_os_to_cs,
  Yt as cvt_rel_cs_to_os,
  Zt as cvt_rel_os_to_cs,
  Er as debounce,
  J as deepClone,
  D as deepOperateAndClone,
  xt as defaultByType,
  W as deref,
  br as findDuplicatePhones,
  ue as fixFx,
  nr as floorInCX,
  rr as floorInOrientPx,
  st as floorNearest,
  Tr as formatAsDate,
  Ar as formatAsTime,
  wr as formatDateTime,
  u as getComparableTimeValue,
  vr as getISOWeekNumber,
  $e as getIndexForRow,
  zt as getOrInsert,
  Ht as getOrInsertComputed,
  Ke as getPhonesFromRow,
  ye as getRandomValues,
  er as getSpan,
  fe as getTimeZone,
  Pt as getValue,
  Wt as globalChannelHealthMonitor,
  kt as globalChannelRegistry,
  Ee as gridItemsAsArray,
  dt as handleListeners,
  x as hasPendingPromises,
  U as hasProperty,
  Y as hasValue,
  jt as inProxy,
  Vt as isArrayInvalidKey,
  ht as isArrayOrIterable,
  Nr as isBrowser,
  E as isCanJustReturn,
  wt as isCanTransfer,
  xr as isDate,
  kr as isEmpty,
  qe as isHasPrimitives,
  ie as isIdbScopePath,
  C as isIterable,
  Ft as isKeyType,
  We as isMountedFsRequest,
  ze as isMountedFsResponse,
  me as isNotComplexArray,
  H as isNotEqual,
  gt as isObject,
  Kt as isObjectNotEqual,
  Ge as isObservable,
  m as isPrimitive,
  Tt as isPromise,
  Ve as isPureHHMM,
  Z as isRef,
  ke as isStorageScopePath,
  At as isSymbol,
  pe as isTypedArray,
  K as isUserScopePath,
  ft as isVal,
  ut as isValidNumber,
  Lt as isValidObj,
  St as isValueRef,
  ot as isValueUnit,
  Wr as isWorker,
  tt as kebabToCamel,
  tr as makeOrientInset,
  vt as makeTriggerLess,
  Pr as mergeByExists,
  Ut as mergeByKey,
  b as normalizeGridLayout,
  I as normalizeOne,
  Be as normalizePhones,
  at as normalizePrimitive,
  je as normalizeSchedule,
  ve as objectAssign,
  $t as objectAssignNotEqual,
  Mr as parseAndGetCorrectTime,
  A as parseDateCorrectly,
  hr as parseMountedFsMessage,
  bt as potentiallyAsync,
  Mt as potentiallyAsyncMap,
  _e as redirectCell,
  Me as removeExtra,
  dr as renderTabName,
  Qt as resolveLocalPointToGridCell,
  p as resolved,
  It as retry,
  P as roundNearest,
  Ir as sleep,
  G as splitCandidates,
  ar as storagePathCandidates,
  De as stripIdbScopePrefix,
  Ne as stripStorageScopePrefix,
  V as stripUserScopePrefix,
  _r as throttle,
  rt as toFiniteNumber,
  pt as toRef,
  ir as toUserRelativePath,
  or as toUserScopePath,
  ce as tryParseByHint,
  de as tryStringAsInteger,
  lt as tryStringAsNumber,
  Dr as uniqueId,
  mt as unref,
  l as unwrap,
  Q as unwrapArray,
  fr as userPathCandidates,
  Xe as valueClamp,
  Ze as withCtx,
  _t as withTimeout
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29yZS5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8jcmVnaW9uIHNyYy9ydW50aW1lL2RvbS1nbG9iYWxzLXBvbHlmaWxsLnRzXG5mdW5jdGlvbiBpbnN0YWxsRG9tQ29uc3RydWN0b3JQb2x5ZmlsbHMoKSB7XG5cdGNvbnN0IGcgPSBnbG9iYWxUaGlzO1xuXHRpZiAodHlwZW9mIGcuSFRNTEVsZW1lbnQgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRjb25zdCBzdHViID0gY2xhc3Mge307XG5cdGNvbnN0IGVuc3VyZSA9IChuYW1lKSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBnW25hbWVdICE9PSBcImZ1bmN0aW9uXCIpIGdbbmFtZV0gPSBzdHViO1xuXHR9O1xuXHRlbnN1cmUoXCJFdmVudFRhcmdldFwiKTtcblx0ZW5zdXJlKFwiTm9kZVwiKTtcblx0ZW5zdXJlKFwiRWxlbWVudFwiKTtcblx0ZW5zdXJlKFwiSFRNTEVsZW1lbnRcIik7XG5cdGVuc3VyZShcIlNWR0VsZW1lbnRcIik7XG5cdGVuc3VyZShcIlRleHRcIik7XG5cdGVuc3VyZShcIkNvbW1lbnRcIik7XG5cdGVuc3VyZShcIkRvY3VtZW50RnJhZ21lbnRcIik7XG5cdGVuc3VyZShcIlNoYWRvd1Jvb3RcIik7XG5cdGVuc3VyZShcIkhUTUxEb2N1bWVudFwiKTtcblx0ZW5zdXJlKFwiRG9jdW1lbnRcIik7XG5cdGVuc3VyZShcIkhUTUxCb2R5RWxlbWVudFwiKTtcblx0ZW5zdXJlKFwiSFRNTEhlYWRFbGVtZW50XCIpO1xuXHRlbnN1cmUoXCJIVE1MQ2FudmFzRWxlbWVudFwiKTtcblx0ZW5zdXJlKFwiSFRNTElucHV0RWxlbWVudFwiKTtcblx0ZW5zdXJlKFwiSFRNTExpbmtFbGVtZW50XCIpO1xuXHRlbnN1cmUoXCJIVE1MU3R5bGVFbGVtZW50XCIpO1xuXHRlbnN1cmUoXCJIVE1MUHJlRWxlbWVudFwiKTtcblx0ZW5zdXJlKFwiSFRNTERpdkVsZW1lbnRcIik7XG5cdGVuc3VyZShcIkNTU1N0eWxlUnVsZVwiKTtcblx0ZW5zdXJlKFwiQ1NTTGF5ZXJCbG9ja1J1bGVcIik7XG59XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy91dGlscy9QcmltaXRpdmUudHNcbnZhciAkZnh5ID0gU3ltYm9sLmZvcihcIkBmaXhcIik7XG52YXIgaXNIYXNQcmltaXRpdmVzID0gKG9ic2VydmFibGUpID0+IHtcblx0cmV0dXJuIG9ic2VydmFibGU/LnNvbWU/Lihpc1ByaW1pdGl2ZSk7XG59O1xudmFyIGlzT2JzZXJ2YWJsZSA9IChvYnNlcnZhYmxlKSA9PiB7XG5cdHJldHVybiBBcnJheS5pc0FycmF5KG9ic2VydmFibGUpIHx8IG9ic2VydmFibGUgaW5zdGFuY2VvZiBTZXQgfHwgb2JzZXJ2YWJsZSBpbnN0YW5jZW9mIE1hcDtcbn07XG52YXIgaXNQcmltaXRpdmUgPSAob2JqKSA9PiB7XG5cdHJldHVybiB0eXBlb2Ygb2JqID09IFwic3RyaW5nXCIgfHwgdHlwZW9mIG9iaiA9PSBcIm51bWJlclwiIHx8IHR5cGVvZiBvYmogPT0gXCJib29sZWFuXCIgfHwgdHlwZW9mIG9iaiA9PSBcImJpZ2ludFwiIHx8IHR5cGVvZiBvYmogPT0gXCJ1bmRlZmluZWRcIiB8fCBvYmogPT0gbnVsbDtcbn07XG52YXIgdHJ5UGFyc2VCeUhpbnQgPSAodmFsdWUsIGhpbnQpID0+IHtcblx0aWYgKCFpc1ByaW1pdGl2ZSh2YWx1ZSkpIHJldHVybiBudWxsO1xuXHRpZiAoaGludCA9PSBcIm51bWJlclwiKSByZXR1cm4gTnVtYmVyKHZhbHVlKSB8fCAwO1xuXHRpZiAoaGludCA9PSBcInN0cmluZ1wiKSByZXR1cm4gU3RyaW5nKHZhbHVlKSB8fCBcIlwiO1xuXHRpZiAoaGludCA9PSBcImJvb2xlYW5cIikgcmV0dXJuICEhdmFsdWU7XG5cdHJldHVybiB2YWx1ZTtcbn07XG52YXIgaGFzUHJvcGVydHkgPSAodiwgcHJvcCA9IFwidmFsdWVcIikgPT4ge1xuXHRyZXR1cm4gKHR5cGVvZiB2ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHYgPT0gXCJmdW5jdGlvblwiKSAmJiB2ICE9IG51bGwgJiYgKHByb3AgaW4gdiB8fCB2Py5bcHJvcF0gIT0gbnVsbCk7XG59O1xudmFyIGhhc1ZhbHVlID0gKHYpID0+IHtcblx0cmV0dXJuIGhhc1Byb3BlcnR5KHYsIFwidmFsdWVcIik7XG59O1xudmFyICRnZXRWYWx1ZSA9ICgkb2JqT3JQbGFpbikgPT4ge1xuXHRpZiAoaXNQcmltaXRpdmUoJG9iak9yUGxhaW4pKSByZXR1cm4gJG9iak9yUGxhaW47XG5cdHJldHVybiBoYXNWYWx1ZSgkb2JqT3JQbGFpbikgPyAkb2JqT3JQbGFpbj8udmFsdWUgOiAkb2JqT3JQbGFpbjtcbn07XG52YXIgdW53cmFwID0gKG9iaiwgZmFsbGJhY2spID0+IHtcblx0cmV0dXJuIG9iaj8uWyRmeHldID8/IChvYmogIT0gbnVsbCA/IG9iaiA6IGZhbGxiYWNrKSA/PyBmYWxsYmFjaztcbn07XG52YXIgZGVyZWYgPSAob2JqKSA9PiB7XG5cdGlmIChvYmogIT0gbnVsbCAmJiAodHlwZW9mIG9iaiA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBvYmogPT0gXCJmdW5jdGlvblwiKSAmJiAob2JqIGluc3RhbmNlb2YgV2Vha1JlZiB8fCB0eXBlb2Ygb2JqPy5kZXJlZiA9PSBcImZ1bmN0aW9uXCIpKSByZXR1cm4gZGVyZWYob2JqPy5kZXJlZj8uKCkpO1xuXHRyZXR1cm4gb2JqO1xufTtcbnZhciBmaXhGeCA9IChvYmopID0+IHtcblx0aWYgKHR5cGVvZiBvYmogPT0gXCJmdW5jdGlvblwiIHx8IG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuXHRjb25zdCBmeCA9IGZ1bmN0aW9uKCkge307XG5cdGZ4WyRmeHldID0gb2JqO1xuXHRyZXR1cm4gZng7XG59O1xudmFyICRzZXQgPSAocnYsIGtleSwgdmFsKSA9PiB7XG5cdHJ2ID0gZGVyZWYocnYpO1xuXHRpZiAocnYgIT0gbnVsbCAmJiAodHlwZW9mIHJ2ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHJ2ID09IFwiZnVuY3Rpb25cIikpIHJldHVybiBydltrZXldID0gJGdldFZhbHVlKHZhbCA9IGRlcmVmKHZhbCkpO1xuXHRyZXR1cm4gcnY7XG59O1xudmFyIGdldFJhbmRvbVZhbHVlcyA9IChhcnJheSkgPT4ge1xuXHRyZXR1cm4gY3J5cHRvPy5nZXRSYW5kb21WYWx1ZXMgPyBjcnlwdG8/LmdldFJhbmRvbVZhbHVlcz8uKGFycmF5KSA6ICgoKSA9PiB7XG5cdFx0Y29uc3QgdmFsdWVzID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkubGVuZ3RoKTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB2YWx1ZXNbaV0gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpO1xuXHRcdHJldHVybiB2YWx1ZXM7XG5cdH0pKCk7XG59O1xuZnVuY3Rpb24gdmFsdWVDbGFtcCh2YWx1ZSwgbWluLCBtYXgpIHtcblx0cmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCBtaW4pLCBtYXgpO1xufVxudmFyIGNsYW1wID0gKG1pbiwgdmFsLCBtYXgpID0+IE1hdGgubWF4KG1pbiwgTWF0aC5taW4odmFsLCBtYXgpKTtcbnZhciB3aXRoQ3R4ID0gKHRhcmdldCwgZ290KSA9PiB7XG5cdGlmICh0eXBlb2YgZ290ID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGdvdD8uYmluZD8uKHRhcmdldCkgPz8gZ290O1xuXHRyZXR1cm4gZ290O1xufTtcbnZhciBVVUlEdjQgPSAoKSA9PiBjcnlwdG8/LnJhbmRvbVVVSUQgPyBjcnlwdG8/LnJhbmRvbVVVSUQ/LigpIDogXCIxMDAwMDAwMC0xMDAwLTQwMDAtODAwMC0xMDAwMDAwMDAwMDBcIi5yZXBsYWNlKC9bMDE4XS9nLCAoYykgPT4gKCtjIF4gZ2V0UmFuZG9tVmFsdWVzPy4oLyogQF9fUFVSRV9fICovIG5ldyBVaW50OEFycmF5KDEpKT8uWzBdICYgMTUgPj4gK2MgLyA0KS50b1N0cmluZygxNikpO1xudmFyIGNhbWVsVG9LZWJhYiA9IChzdHIpID0+IHtcblx0aWYgKCFzdHIpIHJldHVybiBzdHI7XG5cdHJldHVybiBzdHI/LnJlcGxhY2U/LigvKFthLXpdKShbQS1aXSkvZywgXCIkMS0kMlwiKS50b0xvd2VyQ2FzZSgpO1xufTtcbnZhciBrZWJhYlRvQ2FtZWwgPSAoc3RyKSA9PiB7XG5cdGlmICghc3RyKSByZXR1cm4gc3RyO1xuXHRyZXR1cm4gc3RyPy5yZXBsYWNlPy4oLy0oW2Etel0pL2csIChfLCBjaGFyKSA9PiBjaGFyLnRvVXBwZXJDYXNlKCkpO1xufTtcbnZhciB0b0Zpbml0ZU51bWJlciA9ICh2YWx1ZSwgZmFsbGJhY2sgPSAwKSA9PiB7XG5cdGNvbnN0IG51bWJlciA9IE51bWJlcih2YWx1ZSk7XG5cdHJldHVybiBOdW1iZXIuaXNGaW5pdGUobnVtYmVyKSA/IG51bWJlciA6IGZhbGxiYWNrO1xufTtcbnZhciBjbGFtcERpbWVuc2lvbiA9ICh2YWx1ZSwgbWF4KSA9PiB7XG5cdGlmICghTnVtYmVyLmlzRmluaXRlKG1heCkgfHwgbWF4IDw9IDApIHJldHVybiAwO1xuXHRpZiAoIU51bWJlci5pc0Zpbml0ZSh2YWx1ZSkpIHJldHVybiAwO1xuXHRyZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIDApLCBtYXgpO1xufTtcbnZhciByb3VuZE5lYXJlc3QgPSAobnVtYmVyLCBOID0gMSkgPT4gTWF0aC5yb3VuZChudW1iZXIgKiBOKSAvIE47XG52YXIgZmxvb3JOZWFyZXN0ID0gKG51bWJlciwgTiA9IDEpID0+IE1hdGguZmxvb3IobnVtYmVyICogTikgLyBOO1xudmFyIGNlaWxOZWFyZXN0ID0gKG51bWJlciwgTiA9IDEpID0+IE1hdGguY2VpbChudW1iZXIgKiBOKSAvIE47XG52YXIgaXNWYWx1ZVVuaXQgPSAodmFsKSA9PiB0eXBlb2YgQ1NTU3R5bGVWYWx1ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB2YWwgaW5zdGFuY2VvZiBDU1NTdHlsZVZhbHVlO1xudmFyIGlzVmFsID0gKHYpID0+IHYgIT0gbnVsbCAmJiAodHlwZW9mIHYgPT0gXCJib29sZWFuXCIgPyB2ICE9PSBmYWxzZSA6IHRydWUpICYmIHR5cGVvZiB2ICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIHYgIT0gXCJmdW5jdGlvblwiO1xudmFyIG5vcm1hbGl6ZVByaW1pdGl2ZSA9ICh2YWwpID0+IHtcblx0cmV0dXJuIHR5cGVvZiB2YWwgPT0gXCJib29sZWFuXCIgPyB2YWwgPyBcIlwiIDogbnVsbCA6IHR5cGVvZiB2YWwgPT0gXCJudW1iZXJcIiA/IFN0cmluZyh2YWwpIDogdmFsO1xufTtcbnZhciAkdHJpZ2dlckxvY2sgPSBTeW1ib2wuZm9yKFwiQHRyaWdnZXItbG9ja1wiKTtcbnZhciAkYXZvaWRUcmlnZ2VyID0gKHJlZiwgY2IsICRwcm9wID0gXCJ2YWx1ZVwiKSA9PiB7XG5cdGlmIChoYXNQcm9wZXJ0eShyZWYsICRwcm9wKSkgcmVmWyR0cmlnZ2VyTG9ja10gPSB0cnVlO1xuXHRsZXQgcmVzdWx0O1xuXHR0cnkge1xuXHRcdHJlc3VsdCA9IGNiPy4oKTtcblx0fSBmaW5hbGx5IHtcblx0XHRpZiAoaGFzUHJvcGVydHkocmVmLCAkcHJvcCkpIGRlbGV0ZSByZWZbJHRyaWdnZXJMb2NrXTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTtcbnZhciB0cnlTdHJpbmdBc051bWJlciA9ICh2YWwpID0+IHtcblx0aWYgKHR5cGVvZiB2YWwgIT0gXCJzdHJpbmdcIikgcmV0dXJuIG51bGw7XG5cdGNvbnN0IG1hdGNoZXMgPSBbLi4udmFsPy5tYXRjaEFsbD8uKC9eXFxkKyhcXC5cXGQrKT8kL2cpXTtcblx0aWYgKG1hdGNoZXM/Lmxlbmd0aCAhPSAxKSByZXR1cm4gbnVsbDtcblx0Y29uc3QgdHJpZWRUb1BhcnNlID0gcGFyc2VGbG9hdChtYXRjaGVzWzBdWzBdKTtcblx0aWYgKCFOdW1iZXIuaXNOYU4odHJpZWRUb1BhcnNlKSAmJiBOdW1iZXIuaXNGaW5pdGUodHJpZWRUb1BhcnNlKSkgcmV0dXJuIHRyaWVkVG9QYXJzZTtcblx0cmV0dXJuIG51bGw7XG59O1xudmFyIElOVEVHRVJfUkVHRVhQID0gL15cXGQrJC9nO1xudmFyIHRyeVN0cmluZ0FzSW50ZWdlciA9ICh2YWwpID0+IHtcblx0aWYgKHR5cGVvZiB2YWwgIT0gXCJzdHJpbmdcIikgcmV0dXJuIG51bGw7XG5cdHZhbCA9IHZhbD8udHJpbT8uKCk7XG5cdGlmICh2YWwgPT0gXCJcIiB8fCB2YWwgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cdGNvbnN0IG1hdGNoZXMgPSBbLi4udmFsPy5tYXRjaEFsbD8uKElOVEVHRVJfUkVHRVhQKV07XG5cdGlmIChtYXRjaGVzPy5sZW5ndGggIT0gMSkgcmV0dXJuIG51bGw7XG5cdGNvbnN0IHRyaWVkVG9QYXJzZSA9IHBhcnNlSW50KG1hdGNoZXNbMF1bMF0pO1xuXHRpZiAoIU51bWJlci5pc05hTih0cmllZFRvUGFyc2UpICYmIE51bWJlci5pc0ludGVnZXIodHJpZWRUb1BhcnNlKSkgcmV0dXJuIHRyaWVkVG9QYXJzZTtcblx0cmV0dXJuIG51bGw7XG59O1xudmFyIGlzVmFsaWROdW1iZXIgPSAodmFsKSA9PiB7XG5cdHJldHVybiB0eXBlb2YgdmFsID09IFwibnVtYmVyXCIgJiYgIU51bWJlci5pc05hTih2YWwpO1xufTtcbnZhciBjYW5CZUludGVnZXIgPSAodmFsdWUpID0+IHtcblx0aWYgKHR5cGVvZiB2YWx1ZSA9PSBcInN0cmluZ1wiKSByZXR1cm4gdHJ5U3RyaW5nQXNJbnRlZ2VyKHZhbHVlKSAhPSBudWxsO1xuXHRlbHNlIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gXCJudW1iZXJcIiAmJiBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSAmJiB2YWx1ZSA+PSAwO1xufTtcbnZhciBpc0FycmF5T3JJdGVyYWJsZSA9IChvYmopID0+IEFycmF5LmlzQXJyYXkob2JqKSB8fCBvYmogIT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG9ialtTeW1ib2wuaXRlcmF0b3JdID09IFwiZnVuY3Rpb25cIjtcbnZhciBoYW5kbGVMaXN0ZW5lcnMgPSAocm9vdCwgZm4sIGhhbmRsZXJzKSA9PiB7XG5cdHJvb3QgPSByb290IGluc3RhbmNlb2YgV2Vha1JlZiA/IHJvb3QuZGVyZWYoKSA6IHJvb3Q7XG5cdGNvbnN0IHVzdWJzID0gWy4uLk9iamVjdC5lbnRyaWVzKGhhbmRsZXJzKV0ubWFwPy4oKFtuYW1lLCBjYl0pID0+IHJvb3Q/Lltmbl0/LmNhbGw/Lihyb290LCBuYW1lLCBjYikpO1xuXHRyZXR1cm4gKCkgPT4ge1xuXHRcdHVzdWJzPy5mb3JFYWNoPy4oKHVuc3ViKSA9PiB1bnN1Yj8uKCkpO1xuXHR9O1xufTtcbnZhciBpc1JlZiA9IChyZWYpID0+IHtcblx0cmV0dXJuIHJlZiBpbnN0YW5jZW9mIFdlYWtSZWYgfHwgdHlwZW9mIHJlZj8uZGVyZWYgPT0gXCJmdW5jdGlvblwiO1xufTtcbnZhciB1bnJlZiA9IChyZWYpID0+IHtcblx0cmV0dXJuIGlzUmVmKHJlZikgPyBkZXJlZihyZWYpIDogcmVmO1xufTtcbnZhciB0b1JlZiA9IChyZWYpID0+IHtcblx0cmV0dXJuIHJlZiAhPSBudWxsID8gaXNSZWYocmVmKSA/IHJlZiA6IHR5cGVvZiByZWYgPT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiByZWYgPT0gXCJvYmplY3RcIiA/IG5ldyBXZWFrUmVmKHJlZikgOiByZWYgOiByZWY7XG59O1xudmFyIGlzVmFsdWVSZWYgPSAoZXhpc3RzKSA9PiB7XG5cdHJldHVybiAodHlwZW9mIGV4aXN0cyA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBleGlzdHMgPT0gXCJmdW5jdGlvblwiKSAmJiAoZXhpc3RzPy52YWx1ZSAhPSBudWxsIHx8IGV4aXN0cyAhPSBudWxsICYmIFwidmFsdWVcIiBpbiBleGlzdHMpO1xufTtcbnZhciBpc09iamVjdCA9IChleGlzdHMpID0+IHtcblx0cmV0dXJuIGV4aXN0cyAhPSBudWxsICYmICh0eXBlb2YgZXhpc3RzID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGV4aXN0cyA9PSBcImZ1bmN0aW9uXCIpO1xufTtcbnZhciBnZXRWYWx1ZSA9ICh2YWwpID0+IHtcblx0cmV0dXJuIGhhc1ZhbHVlKHZhbCkgPyB2YWw/LnZhbHVlIDogdmFsO1xufTtcbnZhciBwb3RlbnRpYWxseUFzeW5jID0gKHByb21pc2UsIGNiKSA9PiB7XG5cdGlmIChwcm9taXNlIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgcHJvbWlzZT8udGhlbiA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBwcm9taXNlPy50aGVuPy4oY2IpO1xuXHRlbHNlIHJldHVybiBjYj8uKHByb21pc2UpO1xufTtcbnZhciBwb3RlbnRpYWxseUFzeW5jTWFwID0gKHByb21pc2UsIGNiKSA9PiB7XG5cdGlmIChwcm9taXNlIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgcHJvbWlzZT8udGhlbiA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBwcm9taXNlPy50aGVuPy4oY2IpO1xuXHRlbHNlIHJldHVybiBjYj8uKHByb21pc2UpO1xufTtcbnZhciBtYWtlVHJpZ2dlckxlc3MgPSBmdW5jdGlvbihzZWxmKSB7XG5cdHJldHVybiAoY2IpID0+IHtcblx0XHRzZWxmWyR0cmlnZ2VyTG9ja10gPSB0cnVlO1xuXHRcdGxldCByZXN1bHQ7XG5cdFx0dHJ5IHtcblx0XHRcdHJlc3VsdCA9IGNiPy4oKTtcblx0XHR9IGZpbmFsbHkge1xuXHRcdFx0c2VsZlskdHJpZ2dlckxvY2tdID0gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG59O1xudmFyIHVud3JhcEFycmF5ID0gKGFycikgPT4ge1xuXHRpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyPy5mbGF0TWFwPy4oKGVsKSA9PiB7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkoZWwpKSByZXR1cm4gdW53cmFwQXJyYXkoZWwpO1xuXHRcdHJldHVybiBlbDtcblx0fSk7XG5cdGVsc2UgcmV0dXJuIGFycjtcbn07XG52YXIgaXNOb3RDb21wbGV4QXJyYXkgPSAoYXJyKSA9PiB7XG5cdHJldHVybiB1bndyYXBBcnJheShhcnIpPy5ldmVyeT8uKGlzQ2FuSnVzdFJldHVybik7XG59O1xudmFyIGlzQ2FuSnVzdFJldHVybiA9IChvYmopID0+IHtcblx0cmV0dXJuIGlzUHJpbWl0aXZlKG9iaikgfHwgdHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyID09IFwiZnVuY3Rpb25cIiAmJiBvYmogaW5zdGFuY2VvZiBTaGFyZWRBcnJheUJ1ZmZlciB8fCBpc1R5cGVkQXJyYXkob2JqKSB8fCBBcnJheS5pc0FycmF5KG9iaikgJiYgaXNOb3RDb21wbGV4QXJyYXkob2JqKTtcbn07XG52YXIgaXNUeXBlZEFycmF5ID0gKHZhbHVlKSA9PiB7XG5cdHJldHVybiBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsdWUpICYmICEodmFsdWUgaW5zdGFuY2VvZiBEYXRhVmlldyk7XG59O1xudmFyIGlzU3ltYm9sID0gKHN5bSkgPT4gdHlwZW9mIHN5bSA9PT0gXCJzeW1ib2xcIiB8fCB0eXBlb2Ygc3ltID09IFwib2JqZWN0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN5bSkgPT0gXCJbb2JqZWN0IFN5bWJvbF1cIjtcbnZhciBpc1Byb21pc2UgPSAodGFyZ2V0KSA9PiB7XG5cdHJldHVybiB0YXJnZXQgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiB0YXJnZXQ/LnRoZW4gPT0gXCJmdW5jdGlvblwiO1xufTtcbnZhciBpc0NhblRyYW5zZmVyID0gKG9iaikgPT4ge1xuXHRyZXR1cm4gaXNQcmltaXRpdmUob2JqKSB8fCB0eXBlb2YgQXJyYXlCdWZmZXIgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIEFycmF5QnVmZmVyIHx8IHR5cGVvZiBNZXNzYWdlUG9ydCA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgTWVzc2FnZVBvcnQgfHwgdHlwZW9mIFJlYWRhYmxlU3RyZWFtID09IFwiZnVuY3Rpb25cIiAmJiBvYmogaW5zdGFuY2VvZiBSZWFkYWJsZVN0cmVhbSB8fCB0eXBlb2YgV3JpdGFibGVTdHJlYW0gPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIFdyaXRhYmxlU3RyZWFtIHx8IHR5cGVvZiBUcmFuc2Zvcm1TdHJlYW0gPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIFRyYW5zZm9ybVN0cmVhbSB8fCB0eXBlb2YgSW1hZ2VCaXRtYXAgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIEltYWdlQml0bWFwIHx8IHR5cGVvZiBWaWRlb0ZyYW1lID09IFwiZnVuY3Rpb25cIiAmJiBvYmogaW5zdGFuY2VvZiBWaWRlb0ZyYW1lIHx8IHR5cGVvZiBPZmZzY3JlZW5DYW52YXMgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIE9mZnNjcmVlbkNhbnZhcyB8fCB0eXBlb2YgUlRDRGF0YUNoYW5uZWwgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIFJUQ0RhdGFDaGFubmVsIHx8IHR5cGVvZiBBdWRpb0RhdGEgPT0gXCJmdW5jdGlvblwiICYmIG9iaiBpbnN0YW5jZW9mIEF1ZGlvRGF0YSB8fCB0eXBlb2YgV2ViVHJhbnNwb3J0UmVjZWl2ZVN0cmVhbSA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgV2ViVHJhbnNwb3J0UmVjZWl2ZVN0cmVhbSB8fCB0eXBlb2YgV2ViVHJhbnNwb3J0U2VuZFN0cmVhbSA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgV2ViVHJhbnNwb3J0U2VuZFN0cmVhbSB8fCB0eXBlb2YgV2ViVHJhbnNwb3J0UmVjZWl2ZVN0cmVhbSA9PSBcImZ1bmN0aW9uXCIgJiYgb2JqIGluc3RhbmNlb2YgV2ViVHJhbnNwb3J0UmVjZWl2ZVN0cmVhbTtcbn07XG52YXIgZGVmYXVsdEJ5VHlwZSA9IChhKSA9PiB7XG5cdHN3aXRjaCAodHlwZW9mIGEpIHtcblx0XHRjYXNlIFwibnVtYmVyXCI6IHJldHVybiAwO1xuXHRcdGNhc2UgXCJzdHJpbmdcIjogcmV0dXJuIFwiXCI7XG5cdFx0Y2FzZSBcImJvb2xlYW5cIjogcmV0dXJuIGZhbHNlO1xuXHRcdGNhc2UgXCJvYmplY3RcIjogcmV0dXJuIG51bGw7XG5cdFx0Y2FzZSBcImZ1bmN0aW9uXCI6IHJldHVybiBudWxsO1xuXHRcdGNhc2UgXCJzeW1ib2xcIjogcmV0dXJuIG51bGw7XG5cdFx0Y2FzZSBcImJpZ2ludFwiOiByZXR1cm4gMG47XG5cdH1cbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy91dGlscy9SZXNvbHZlZC50c1xudmFyICRwcm9taXNlID0gU3ltYm9sLmZvcihcIkBwcm9taXNlXCIpO1xudmFyIFNLSVBfS0VZUyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KFtcblx0U3ltYm9sLmZvcihcIkBleHRyYWN0XCIpLFxuXHRTeW1ib2wuZm9yKFwiQG9yaWdpblwiKSxcblx0U3ltYm9sLmZvcihcIkByZWdpc3RyeVwiKSxcblx0U3ltYm9sLmZvcihcIkB2YWx1ZVwiKSxcblx0U3ltYm9sLmZvcihcIkBwcm9taXNlXCIpLFxuXHRTeW1ib2wuZm9yKFwiQGJlaGF2aW9yXCIpLFxuXHRTeW1ib2wuZm9yKFwiQHRyaWdnZXJcIiksXG5cdFN5bWJvbC5mb3IoXCJAc3Vic2NyaWJlXCIpLFxuXHRTeW1ib2wuZm9yKFwiQHJlYWxQcm9wXCIpLFxuXHRTeW1ib2wuZm9yKFwiQHRyaWdnZXItbG9ja1wiKSxcblx0U3ltYm9sLmZvcihcIkB0cmlnZ2VyLWxlc3NcIiksXG5cdFN5bWJvbC5mb3IoXCJAdHJpZ2dlci1jb250cm9sXCIpLFxuXHRTeW1ib2wuZm9yKFwiQGlzTm90RXF1YWxcIiksXG5cdFN5bWJvbC5mb3IoXCJAZml4XCIpLFxuXHRTeW1ib2wuZm9yKFwiQHRhcmdldFwiKSxcblx0U3ltYm9sLmZvcihcIkByZXNvbHZlZFwiKVxuXSk7XG52YXIgaXNUaGVuYWJsZSQyID0gKHZhbHVlKSA9PiB2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UgfHwgdHlwZW9mIHZhbHVlPy50aGVuID09IFwiZnVuY3Rpb25cIjtcbnZhciBzZXR0bGVPbmUgPSAodmFsdWUpID0+IFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbigodikgPT4gKHtcblx0c3RhdHVzOiBcImZ1bGZpbGxlZFwiLFxuXHR2YWx1ZTogdlxufSksIChyZWFzb24pID0+ICh7XG5cdHN0YXR1czogXCJyZWplY3RlZFwiLFxuXHRyZWFzb25cbn0pKTtcbnZhciBvd25FbnVtZXJhYmxlS2V5cyA9IChvYmopID0+IFJlZmxlY3Qub3duS2V5cyhvYmopLmZpbHRlcigoa2V5KSA9PiB7XG5cdGlmIChTS0lQX0tFWVMuaGFzKGtleSkpIHJldHVybiBmYWxzZTtcblx0Y29uc3QgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpO1xuXHRyZXR1cm4gZGVzYyAhPT0gdm9pZCAwICYmIGRlc2MuZW51bWVyYWJsZTtcbn0pO1xudmFyIGhhc1BlbmRpbmdQcm9taXNlcyA9ICh2YWx1ZSwgc2VlbikgPT4ge1xuXHRpZiAodmFsdWUgPT0gbnVsbCB8fCBpc1ByaW1pdGl2ZSh2YWx1ZSkpIHJldHVybiBmYWxzZTtcblx0aWYgKGlzVGhlbmFibGUkMih2YWx1ZSkgfHwgaXNUaGVuYWJsZSQyKHZhbHVlPy5bJHByb21pc2VdKSkgcmV0dXJuIHRydWU7XG5cdGlmICh0eXBlb2YgdmFsdWUgIT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUgIT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cdGNvbnN0IHNlZW5TZXQgPSBzZWVuID8/IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha1NldCgpO1xuXHRpZiAoc2VlblNldC5oYXModmFsdWUpKSByZXR1cm4gZmFsc2U7XG5cdHNlZW5TZXQuYWRkKHZhbHVlKTtcblx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSByZXR1cm4gdmFsdWUuc29tZSgoaXRlbSkgPT4gaGFzUGVuZGluZ1Byb21pc2VzKGl0ZW0sIHNlZW5TZXQpKTtcblx0aWYgKHZhbHVlIGluc3RhbmNlb2YgTWFwKSByZXR1cm4gWy4uLnZhbHVlLnZhbHVlcygpXS5zb21lKChpdGVtKSA9PiBoYXNQZW5kaW5nUHJvbWlzZXMoaXRlbSwgc2VlblNldCkpO1xuXHRpZiAodmFsdWUgaW5zdGFuY2VvZiBTZXQpIHJldHVybiBbLi4udmFsdWUudmFsdWVzKCldLnNvbWUoKGl0ZW0pID0+IGhhc1BlbmRpbmdQcm9taXNlcyhpdGVtLCBzZWVuU2V0KSk7XG5cdHJldHVybiBvd25FbnVtZXJhYmxlS2V5cyh2YWx1ZSkuc29tZSgoa2V5KSA9PiBoYXNQZW5kaW5nUHJvbWlzZXModmFsdWVba2V5XSwgc2VlblNldCkpO1xufTtcbmZ1bmN0aW9uIHJlc29sdmVkRGVlcCh2YWx1ZSwgbW9kZSwgc2Vlbikge1xuXHRpZiAodmFsdWUgPT0gbnVsbCB8fCBpc1ByaW1pdGl2ZSh2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlID09IFwic3ltYm9sXCIpIHJldHVybiB2YWx1ZTtcblx0aWYgKGlzVGhlbmFibGUkMih2YWx1ZSkpIHJldHVybiB2YWx1ZTtcblx0Y29uc3Qgc2xvdCA9IHZhbHVlPy5bJHByb21pc2VdO1xuXHRpZiAoaXNUaGVuYWJsZSQyKHNsb3QpKSByZXR1cm4gc2xvdDtcblx0aWYgKHR5cGVvZiB2YWx1ZSAhPSBcIm9iamVjdFwiICYmIHR5cGVvZiB2YWx1ZSAhPSBcImZ1bmN0aW9uXCIpIHJldHVybiB2YWx1ZTtcblx0aWYgKHNlZW4uaGFzKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuXHRzZWVuLmFkZCh2YWx1ZSk7XG5cdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdGNvbnN0IGl0ZW1zID0gdmFsdWUubWFwKChpdGVtKSA9PiByZXNvbHZlZERlZXAoaXRlbSwgbW9kZSwgc2VlbikpO1xuXHRcdHJldHVybiBtb2RlID09IFwic2V0dGxlZFwiID8gUHJvbWlzZS5hbGxTZXR0bGVkKGl0ZW1zKSA6IFByb21pc2UuYWxsKGl0ZW1zKTtcblx0fVxuXHRpZiAodmFsdWUgaW5zdGFuY2VvZiBTZXQpIHtcblx0XHRjb25zdCBpdGVtcyA9IFsuLi52YWx1ZS52YWx1ZXMoKV0ubWFwKChpdGVtKSA9PiByZXNvbHZlZERlZXAoaXRlbSwgbW9kZSwgc2VlbikpO1xuXHRcdHJldHVybiBtb2RlID09IFwic2V0dGxlZFwiID8gUHJvbWlzZS5hbGxTZXR0bGVkKGl0ZW1zKSA6IFByb21pc2UuYWxsKGl0ZW1zKTtcblx0fVxuXHRjb25zdCByZWNvcmQgPSB7fTtcblx0aWYgKHZhbHVlIGluc3RhbmNlb2YgTWFwKSBmb3IgKGNvbnN0IFtrZXksIGl0ZW1dIG9mIHZhbHVlLmVudHJpZXMoKSkgcmVjb3JkW2tleV0gPSByZXNvbHZlZERlZXAoaXRlbSwgbW9kZSwgc2Vlbik7XG5cdGVsc2UgZm9yIChjb25zdCBrZXkgb2Ygb3duRW51bWVyYWJsZUtleXModmFsdWUpKSByZWNvcmRba2V5XSA9IHJlc29sdmVkRGVlcCh2YWx1ZVtrZXldLCBtb2RlLCBzZWVuKTtcblx0cmV0dXJuIG1vZGUgPT0gXCJzZXR0bGVkXCIgPyBQcm9taXNlLmFsbFNldHRsZWRLZXllZChyZWNvcmQpIDogUHJvbWlzZS5hbGxLZXllZChyZWNvcmQpO1xufVxuZnVuY3Rpb24gcmVzb2x2ZWQodmFsdWUsIG1vZGUgPSBcImFsbFwiKSB7XG5cdGlmIChpc1RoZW5hYmxlJDIodmFsdWUpKSByZXR1cm4gbW9kZSA9PSBcInNldHRsZWRcIiA/IHNldHRsZU9uZSh2YWx1ZSkgOiBQcm9taXNlLnJlc29sdmUodmFsdWUpO1xuXHRjb25zdCBzbG90ID0gdmFsdWU/LlskcHJvbWlzZV07XG5cdGlmIChpc1RoZW5hYmxlJDIoc2xvdCkpIHJldHVybiBtb2RlID09IFwic2V0dGxlZFwiID8gc2V0dGxlT25lKHNsb3QpIDogUHJvbWlzZS5yZXNvbHZlKHNsb3QpO1xuXHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc29sdmVkRGVlcCh2YWx1ZSwgbW9kZSwgLyogQF9fUFVSRV9fICovIG5ldyBXZWFrU2V0KCkpKTtcbn1cbnJlc29sdmVkLmFsbCA9ICh2YWx1ZSkgPT4gcmVzb2x2ZWQodmFsdWUsIFwiYWxsXCIpO1xucmVzb2x2ZWQuYWxsU2V0dGxlZCA9ICh2YWx1ZSkgPT4gcmVzb2x2ZWQodmFsdWUsIFwic2V0dGxlZFwiKTtcbnJlc29sdmVkLmFsbEtleWVkID0gKHZhbHVlKSA9PiBQcm9taXNlLmFsbEtleWVkKHZhbHVlKTtcbnJlc29sdmVkLmFsbFNldHRsZWRLZXllZCA9ICh2YWx1ZSkgPT4gUHJvbWlzZS5hbGxTZXR0bGVkS2V5ZWQodmFsdWUpO1xucmVzb2x2ZWQudHJ5ID0gKGNhbGxiYWNrT3JWYWx1ZSwgLi4uYXJncykgPT4gUHJvbWlzZS50cnkoY2FsbGJhY2tPclZhbHVlLCAuLi5hcmdzKS50aGVuKCh2YWx1ZSkgPT4gcmVzb2x2ZWQodmFsdWUsIFwiYWxsXCIpKTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3V0aWxzL1Byb21pc2VVdGlscy50c1xudmFyIGlzVGhlbmFibGUkMSA9ICh2YWx1ZSkgPT4gdmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHR5cGVvZiB2YWx1ZT8udGhlbiA9PSBcImZ1bmN0aW9uXCI7XG5mdW5jdGlvbiBhbGxLZXllZChwcm9taXNlcykge1xuXHRyZXR1cm4gUHJvbWlzZS5hbGxLZXllZChwcm9taXNlcyk7XG59XG5mdW5jdGlvbiBhbGxTZXR0bGVkS2V5ZWQocHJvbWlzZXMpIHtcblx0cmV0dXJuIFByb21pc2UuYWxsU2V0dGxlZEtleWVkKHByb21pc2VzKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZURlZmVycmVkKCkge1xuXHRsZXQgcmVzb2x2ZTtcblx0bGV0IHJlamVjdDtcblx0bGV0IGlzUmVzb2x2ZWQgPSBmYWxzZTtcblx0bGV0IGlzUmVqZWN0ZWQgPSBmYWxzZTtcblx0cmV0dXJuIHtcblx0XHRwcm9taXNlOiBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcblx0XHRcdHJlc29sdmUgPSAodmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKCFpc1Jlc29sdmVkICYmICFpc1JlamVjdGVkKSB7XG5cdFx0XHRcdFx0aXNSZXNvbHZlZCA9IHRydWU7XG5cdFx0XHRcdFx0cmVzKHZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHRcdHJlamVjdCA9IChlcnJvcikgPT4ge1xuXHRcdFx0XHRpZiAoIWlzUmVzb2x2ZWQgJiYgIWlzUmVqZWN0ZWQpIHtcblx0XHRcdFx0XHRpc1JlamVjdGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRyZWooZXJyb3IpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0pLFxuXHRcdHJlc29sdmUsXG5cdFx0cmVqZWN0LFxuXHRcdGdldCBpc1Jlc29sdmVkKCkge1xuXHRcdFx0cmV0dXJuIGlzUmVzb2x2ZWQ7XG5cdFx0fSxcblx0XHRnZXQgaXNSZWplY3RlZCgpIHtcblx0XHRcdHJldHVybiBpc1JlamVjdGVkO1xuXHRcdH1cblx0fTtcbn1cbnZhciBBc3luY1F1ZXVlID0gY2xhc3Mge1xuXHRxdWV1ZSA9IFtdO1xuXHRwcm9jZXNzaW5nID0gZmFsc2U7XG5cdGFzeW5jIGFkZChvcGVyYXRpb24pIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5xdWV1ZS5wdXNoKGFzeW5jICgpID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRyZXNvbHZlKGF3YWl0IG9wZXJhdGlvbigpKTtcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRyZWplY3QoZXJyb3IpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMucHJvY2VzcygpO1xuXHRcdH0pO1xuXHR9XG5cdGFzeW5jIHByb2Nlc3MoKSB7XG5cdFx0aWYgKHRoaXMucHJvY2Vzc2luZyB8fCB0aGlzLnF1ZXVlLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXHRcdHRoaXMucHJvY2Vzc2luZyA9IHRydWU7XG5cdFx0d2hpbGUgKHRoaXMucXVldWUubGVuZ3RoID4gMCkgYXdhaXQgdGhpcy5xdWV1ZS5zaGlmdCgpKCk7XG5cdFx0dGhpcy5wcm9jZXNzaW5nID0gZmFsc2U7XG5cdH1cblx0Z2V0IGxlbmd0aCgpIHtcblx0XHRyZXR1cm4gdGhpcy5xdWV1ZS5sZW5ndGg7XG5cdH1cblx0Z2V0IGlzUHJvY2Vzc2luZygpIHtcblx0XHRyZXR1cm4gdGhpcy5wcm9jZXNzaW5nO1xuXHR9XG59O1xuZnVuY3Rpb24gd2l0aFRpbWVvdXQocHJvbWlzZSwgdGltZW91dE1zLCB0aW1lb3V0TWVzc2FnZSA9IFwiT3BlcmF0aW9uIHRpbWVkIG91dFwiKSB7XG5cdGNvbnN0IHBlbmRpbmcgPSBpc1RoZW5hYmxlJDEocHJvbWlzZSkgPyBwcm9taXNlIDogcmVzb2x2ZWQocHJvbWlzZSk7XG5cdGNvbnN0IHRpbWVvdXRQcm9taXNlID0gbmV3IFByb21pc2UoKF8sIHJlamVjdCkgPT4ge1xuXHRcdHNldFRpbWVvdXQoKCkgPT4gcmVqZWN0KG5ldyBFcnJvcih0aW1lb3V0TWVzc2FnZSkpLCB0aW1lb3V0TXMpO1xuXHR9KTtcblx0cmV0dXJuIFByb21pc2UucmFjZShbcGVuZGluZywgdGltZW91dFByb21pc2VdKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIHJldHJ5KG9wZXJhdGlvbiwgbWF4UmV0cmllcyA9IDMsIGluaXRpYWxEZWxheSA9IDFlMywgYmFja29mZk11bHRpcGxpZXIgPSAyKSB7XG5cdGxldCBsYXN0RXJyb3I7XG5cdGZvciAobGV0IGF0dGVtcHQgPSAwOyBhdHRlbXB0IDw9IG1heFJldHJpZXM7IGF0dGVtcHQrKykgdHJ5IHtcblx0XHRyZXR1cm4gYXdhaXQgb3BlcmF0aW9uKCk7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0bGFzdEVycm9yID0gZXJyb3I7XG5cdFx0aWYgKGF0dGVtcHQgPCBtYXhSZXRyaWVzKSB7XG5cdFx0XHRjb25zdCBkZWxheSA9IGluaXRpYWxEZWxheSAqIE1hdGgucG93KGJhY2tvZmZNdWx0aXBsaWVyLCBhdHRlbXB0KTtcblx0XHRcdGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG5cdFx0fVxuXHR9XG5cdHRocm93IGxhc3RFcnJvcjtcbn1cbmFzeW5jIGZ1bmN0aW9uIGNvbmN1cnJlbnRMaW1pdChvcGVyYXRpb25zLCBsaW1pdCkge1xuXHRjb25zdCByZXN1bHRzID0gW107XG5cdGNvbnN0IGV4ZWN1dGluZyA9IFtdO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IG9wZXJhdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBvcGVyYXRpb24gPSBvcGVyYXRpb25zW2ldO1xuXHRcdGNvbnN0IHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKS50aGVuKGFzeW5jICgpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9wZXJhdGlvbigpO1xuXHRcdFx0XHRyZXN1bHRzW2ldID0gcmVzdWx0O1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0dGhyb3cgZXJyb3I7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmVzdWx0c1tpXSA9IHZvaWQgMDtcblx0XHRleGVjdXRpbmcucHVzaChwcm9taXNlKTtcblx0XHRpZiAoZXhlY3V0aW5nLmxlbmd0aCA+PSBsaW1pdCkge1xuXHRcdFx0YXdhaXQgUHJvbWlzZS5yYWNlKGV4ZWN1dGluZyk7XG5cdFx0XHRleGVjdXRpbmcuc3BsaWNlKGV4ZWN1dGluZy5maW5kSW5kZXgoKHApID0+IHAgPT09IHByb21pc2UpLCAxKTtcblx0XHR9XG5cdH1cblx0YXdhaXQgUHJvbWlzZS5hbGwoZXhlY3V0aW5nKTtcblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy91dGlscy9DaGFubmVsVXRpbHMudHNcbnZhciBDaGFubmVsUmVnaXN0cnkgPSBjbGFzcyB7XG5cdGNoYW5uZWxzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0bGlzdGVuZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0cmVnaXN0ZXIobmFtZSwgY2hhbm5lbCkge1xuXHRcdHRoaXMuY2hhbm5lbHMuc2V0KG5hbWUsIGNoYW5uZWwpO1xuXHRcdGNvbnN0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzLmdldChuYW1lKTtcblx0XHRpZiAobGlzdGVuZXJzKSBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIGxpc3RlbmVycykgdHJ5IHtcblx0XHRcdGxpc3RlbmVyKGNoYW5uZWwpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBbQ2hhbm5lbFJlZ2lzdHJ5XSBMaXN0ZW5lciBlcnJvciBmb3IgJHtuYW1lfTpgLCBlcnJvcik7XG5cdFx0fVxuXHRcdHJldHVybiBjaGFubmVsO1xuXHR9XG5cdGdldChuYW1lKSB7XG5cdFx0cmV0dXJuIHRoaXMuY2hhbm5lbHMuZ2V0KG5hbWUpO1xuXHR9XG5cdGhhcyhuYW1lKSB7XG5cdFx0cmV0dXJuIHRoaXMuY2hhbm5lbHMuaGFzKG5hbWUpO1xuXHR9XG5cdHVucmVnaXN0ZXIobmFtZSkge1xuXHRcdGNvbnN0IGV4aXN0ZWQgPSB0aGlzLmNoYW5uZWxzLmRlbGV0ZShuYW1lKTtcblx0XHRpZiAoZXhpc3RlZCkge1xuXHRcdFx0Y29uc3QgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMuZ2V0KG5hbWUpO1xuXHRcdFx0aWYgKGxpc3RlbmVycykgZm9yIChjb25zdCBsaXN0ZW5lciBvZiBsaXN0ZW5lcnMpIHRyeSB7XG5cdFx0XHRcdGxpc3RlbmVyKG51bGwpO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgW0NoYW5uZWxSZWdpc3RyeV0gVW5yZWdpc3RlciBsaXN0ZW5lciBlcnJvciBmb3IgJHtuYW1lfTpgLCBlcnJvcik7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBleGlzdGVkO1xuXHR9XG5cdG9uQ2hhbm5lbENoYW5nZShuYW1lLCBsaXN0ZW5lcikge1xuXHRcdGlmICghdGhpcy5saXN0ZW5lcnMuaGFzKG5hbWUpKSB0aGlzLmxpc3RlbmVycy5zZXQobmFtZSwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk7XG5cdFx0Y29uc3QgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMuZ2V0KG5hbWUpO1xuXHRcdGxpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuXHRcdGlmICh0aGlzLmNoYW5uZWxzLmhhcyhuYW1lKSkgdHJ5IHtcblx0XHRcdGxpc3RlbmVyKHRoaXMuY2hhbm5lbHMuZ2V0KG5hbWUpKTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgW0NoYW5uZWxSZWdpc3RyeV0gSW5pdGlhbCBsaXN0ZW5lciBlcnJvciBmb3IgJHtuYW1lfTpgLCBlcnJvcik7XG5cdFx0fVxuXHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRsaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcblx0XHRcdGlmIChsaXN0ZW5lcnMuc2l6ZSA9PT0gMCkgdGhpcy5saXN0ZW5lcnMuZGVsZXRlKG5hbWUpO1xuXHRcdH07XG5cdH1cblx0Z2V0Q2hhbm5lbE5hbWVzKCkge1xuXHRcdHJldHVybiBBcnJheS5mcm9tKHRoaXMuY2hhbm5lbHMua2V5cygpKTtcblx0fVxuXHRjbGVhcigpIHtcblx0XHR0aGlzLmNoYW5uZWxzLmNsZWFyKCk7XG5cdFx0dGhpcy5saXN0ZW5lcnMuY2xlYXIoKTtcblx0fVxufTtcbnZhciBnbG9iYWxDaGFubmVsUmVnaXN0cnkgPSBuZXcgQ2hhbm5lbFJlZ2lzdHJ5KCk7XG5mdW5jdGlvbiBjcmVhdGVDaGFubmVsUHJveHkoY2hhbm5lbCwgbWV0aG9kcykge1xuXHRjb25zdCBwcm94eSA9IHt9O1xuXHRmb3IgKGNvbnN0IG1ldGhvZCBvZiBtZXRob2RzKSBwcm94eVttZXRob2RdID0gKC4uLmFyZ3MpID0+IHtcblx0XHRyZXR1cm4gY2hhbm5lbC5yZXF1ZXN0KG1ldGhvZCwgYXJncyk7XG5cdH07XG5cdHJldHVybiBwcm94eTtcbn1cbnZhciBDaGFubmVsSGVhbHRoTW9uaXRvciA9IGNsYXNzIHtcblx0aGVhbHRoQ2hlY2tzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0aW50ZXJ2YWxzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0aGVhbHRoU3RhdHVzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0cmVnaXN0ZXJIZWFsdGhDaGVjayhjaGFubmVsTmFtZSwgaGVhbHRoQ2hlY2ssIGludGVydmFsTXMgPSAzZTQpIHtcblx0XHR0aGlzLmhlYWx0aENoZWNrcy5zZXQoY2hhbm5lbE5hbWUsIGhlYWx0aENoZWNrKTtcblx0XHRjb25zdCBleGlzdGluZ0ludGVydmFsID0gdGhpcy5pbnRlcnZhbHMuZ2V0KGNoYW5uZWxOYW1lKTtcblx0XHRpZiAoZXhpc3RpbmdJbnRlcnZhbCkgY2xlYXJJbnRlcnZhbChleGlzdGluZ0ludGVydmFsKTtcblx0XHRjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKGFzeW5jICgpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IGlzSGVhbHRoeSA9IGF3YWl0IGhlYWx0aENoZWNrKCk7XG5cdFx0XHRcdHRoaXMuaGVhbHRoU3RhdHVzLnNldChjaGFubmVsTmFtZSwgaXNIZWFsdGh5KTtcblx0XHRcdFx0aWYgKCFpc0hlYWx0aHkpIGNvbnNvbGUud2FybihgW0NoYW5uZWxIZWFsdGhdIENoYW5uZWwgJyR7Y2hhbm5lbE5hbWV9JyBpcyB1bmhlYWx0aHlgKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYFtDaGFubmVsSGVhbHRoXSBIZWFsdGggY2hlY2sgZmFpbGVkIGZvciAnJHtjaGFubmVsTmFtZX0nOmAsIGVycm9yKTtcblx0XHRcdFx0dGhpcy5oZWFsdGhTdGF0dXMuc2V0KGNoYW5uZWxOYW1lLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fSwgaW50ZXJ2YWxNcyk7XG5cdFx0dGhpcy5pbnRlcnZhbHMuc2V0KGNoYW5uZWxOYW1lLCBpbnRlcnZhbCk7XG5cdFx0aGVhbHRoQ2hlY2soKS50aGVuKChpc0hlYWx0aHkpID0+IHtcblx0XHRcdHRoaXMuaGVhbHRoU3RhdHVzLnNldChjaGFubmVsTmFtZSwgaXNIZWFsdGh5KTtcblx0XHR9KS5jYXRjaCgoKSA9PiB7XG5cdFx0XHR0aGlzLmhlYWx0aFN0YXR1cy5zZXQoY2hhbm5lbE5hbWUsIGZhbHNlKTtcblx0XHR9KTtcblx0fVxuXHRpc0hlYWx0aHkoY2hhbm5lbE5hbWUpIHtcblx0XHRyZXR1cm4gdGhpcy5oZWFsdGhTdGF0dXMuZ2V0KGNoYW5uZWxOYW1lKSA/PyBmYWxzZTtcblx0fVxuXHRnZXRBbGxIZWFsdGhTdGF0dXNlcygpIHtcblx0XHRjb25zdCByZXN1bHQgPSB7fTtcblx0XHRmb3IgKGNvbnN0IFtuYW1lLCBzdGF0dXNdIG9mIHRoaXMuaGVhbHRoU3RhdHVzKSByZXN1bHRbbmFtZV0gPSBzdGF0dXM7XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXHRzdG9wTW9uaXRvcmluZyhjaGFubmVsTmFtZSkge1xuXHRcdGNvbnN0IGludGVydmFsID0gdGhpcy5pbnRlcnZhbHMuZ2V0KGNoYW5uZWxOYW1lKTtcblx0XHRpZiAoaW50ZXJ2YWwpIHtcblx0XHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuXHRcdFx0dGhpcy5pbnRlcnZhbHMuZGVsZXRlKGNoYW5uZWxOYW1lKTtcblx0XHR9XG5cdFx0dGhpcy5oZWFsdGhDaGVja3MuZGVsZXRlKGNoYW5uZWxOYW1lKTtcblx0XHR0aGlzLmhlYWx0aFN0YXR1cy5kZWxldGUoY2hhbm5lbE5hbWUpO1xuXHR9XG5cdHN0b3BBbGxNb25pdG9yaW5nKCkge1xuXHRcdGZvciAoY29uc3QgaW50ZXJ2YWwgb2YgdGhpcy5pbnRlcnZhbHMudmFsdWVzKCkpIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuXHRcdHRoaXMuaW50ZXJ2YWxzLmNsZWFyKCk7XG5cdFx0dGhpcy5oZWFsdGhDaGVja3MuY2xlYXIoKTtcblx0XHR0aGlzLmhlYWx0aFN0YXR1cy5jbGVhcigpO1xuXHR9XG59O1xudmFyIGdsb2JhbENoYW5uZWxIZWFsdGhNb25pdG9yID0gbmV3IENoYW5uZWxIZWFsdGhNb25pdG9yKCk7XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy91dGlscy9VcHNlcnQudHNcbnZhciBnZXRPckluc2VydCA9IChtYXAsIGtleSwgZGVmYXVsdFZhbHVlID0gKCkgPT4gbnVsbCkgPT4ge1xuXHRyZXR1cm4gbWFwPy5nZXRPckluc2VydENvbXB1dGVkPy4oa2V5LCAoKSA9PiBkZWZhdWx0VmFsdWU/LigpKTtcbn07XG52YXIgZ2V0T3JJbnNlcnRDb21wdXRlZCA9IChtYXAsIGtleSwgY2FsbGJhY2tGdW5jdGlvbiA9ICgpID0+IG51bGwpID0+IHtcblx0cmV0dXJuIG1hcD8uZ2V0T3JJbnNlcnRDb21wdXRlZD8uKGtleSwgY2FsbGJhY2tGdW5jdGlvbik7XG59O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvdXRpbHMvT2JqZWN0LnRzXG52YXIgaXNJdGVyYWJsZSA9IChvYmopID0+IHR5cGVvZiBvYmo/LltTeW1ib2wuaXRlcmF0b3JdID09IFwiZnVuY3Rpb25cIjtcbnZhciBpc0tleVR5cGUgPSAocHJvcCkgPT4gW1xuXHRcInN5bWJvbFwiLFxuXHRcInN0cmluZ1wiLFxuXHRcIm51bWJlclwiXG5dLmluZGV4T2YodHlwZW9mIHByb3ApID49IDA7XG52YXIgaXNWYWxpZE9iaiA9IChvYmopID0+IHtcblx0cmV0dXJuIG9iaiAhPSBudWxsICYmICh0eXBlb2Ygb2JqID09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2Ygb2JqID09IFwib2JqZWN0XCIpICYmICEob2JqIGluc3RhbmNlb2YgV2Vha1JlZik7XG59O1xudmFyIG1lcmdlQnlLZXkgPSAoaXRlbXMsIGtleSA9IFwiaWRcIikgPT4ge1xuXHRjb25zdCBlbnRyaWVzID0gQXJyYXkuZnJvbShpdGVtcz8udmFsdWVzPy4oKSkubWFwKChJKSA9PiBbST8uW2tleV0sIEldKTtcblx0Y29uc3QgbWFwID0gbmV3IE1hcChlbnRyaWVzKTtcblx0cmV0dXJuIEFycmF5LmZyb20obWFwPy52YWx1ZXM/LigpIHx8IFtdKTtcbn07XG52YXIgcmVtb3ZlRXh0cmEgPSAodGFyZ2V0LCB2YWx1ZSwgbmFtZSA9IG51bGwpID0+IHtcblx0Y29uc3QgZXhpc3RzID0gbmFtZSAhPSBudWxsICYmICh0eXBlb2YgdGFyZ2V0ID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHRhcmdldCA9PSBcImZ1bmN0aW9uXCIpID8gdGFyZ2V0Py5bbmFtZV0gPz8gdGFyZ2V0IDogdGFyZ2V0O1xuXHRsZXQgZW50cmllcyA9IFtdO1xuXHRpZiAodmFsdWUgaW5zdGFuY2VvZiBTZXQgfHwgdmFsdWUgaW5zdGFuY2VvZiBNYXAgfHwgQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgaXNJdGVyYWJsZSh2YWx1ZSkpIGVudHJpZXMgPSAoZXhpc3RzIGluc3RhbmNlb2YgU2V0IHx8IGV4aXN0cyBpbnN0YW5jZW9mIFdlYWtTZXQgPyB2YWx1ZT8udmFsdWVzPy4oKSA6IHZhbHVlPy5lbnRyaWVzPy4oKSkgfHwgKEFycmF5LmlzQXJyYXkodmFsdWUpIHx8IGlzSXRlcmFibGUodmFsdWUpID8gdmFsdWUgOiBbXSk7XG5cdGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB2YWx1ZSA9PSBcImZ1bmN0aW9uXCIpIGVudHJpZXMgPSBleGlzdHMgaW5zdGFuY2VvZiBTZXQgfHwgZXhpc3RzIGluc3RhbmNlb2YgV2Vha1NldCA/IE9iamVjdC52YWx1ZXModmFsdWUpIDogT2JqZWN0LmVudHJpZXModmFsdWUpO1xuXHRsZXQgZXhFbnRyaWVzID0gW107XG5cdGlmIChBcnJheS5pc0FycmF5KGV4aXN0cykpIGV4RW50cmllcyA9IGV4aXN0cy5lbnRyaWVzKCk7XG5cdGVsc2UgaWYgKGV4aXN0cyBpbnN0YW5jZW9mIE1hcCB8fCBleGlzdHMgaW5zdGFuY2VvZiBXZWFrTWFwKSBleEVudHJpZXMgPSBleGlzdHM/LmVudHJpZXM/LigpO1xuXHRlbHNlIGlmIChleGlzdHMgaW5zdGFuY2VvZiBTZXQgfHwgZXhpc3RzIGluc3RhbmNlb2YgV2Vha1NldCkgZXhFbnRyaWVzID0gZXhpc3RzPy52YWx1ZXM/LigpO1xuXHRlbHNlIGlmICh0eXBlb2YgZXhpc3RzID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGV4aXN0cyA9PSBcImZ1bmN0aW9uXCIpIGV4RW50cmllcyA9IE9iamVjdC5lbnRyaWVzKGV4aXN0cyk7XG5cdGNvbnN0IGtleXMgPSBuZXcgU2V0KEFycmF5LmZyb20oZW50cmllcykubWFwKChlKSA9PiBlPy5bMF0pKTtcblx0Y29uc3QgZXhlID0gbmV3IFNldChBcnJheS5mcm9tKGV4RW50cmllcykubWFwKChlKSA9PiBlPy5bMF0pKTtcblx0Y29uc3QgZXhjbHVkZSA9IGtleXM/LmRpZmZlcmVuY2U/LihleGUpO1xuXHRpZiAoQXJyYXkuaXNBcnJheShleGlzdHMpKSB7XG5cdFx0Y29uc3QgbncgPSBleGlzdHMuZmlsdGVyKChfLCBJKSA9PiAhZXhjbHVkZS5oYXMoSSkpO1xuXHRcdGV4aXN0cy5zcGxpY2UoMCwgZXhpc3RzLmxlbmd0aCk7XG5cdFx0ZXhpc3RzLnB1c2goLi4ubncpO1xuXHR9IGVsc2UgaWYgKGV4aXN0cyBpbnN0YW5jZW9mIE1hcCB8fCBleGlzdHMgaW5zdGFuY2VvZiBTZXQgfHwgZXhpc3RzIGluc3RhbmNlb2YgV2Vha01hcCB8fCBleGlzdHMgaW5zdGFuY2VvZiBXZWFrU2V0KSBmb3IgKGNvbnN0IGsgb2YgZXhjbHVkZSkgZXhpc3RzLmRlbGV0ZShrKTtcblx0ZWxzZSBpZiAodHlwZW9mIGV4aXN0cyA9PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIGV4aXN0cyA9PSBcIm9iamVjdFwiKSBmb3IgKGNvbnN0IGsgb2YgZXhjbHVkZSkgZGVsZXRlIGV4aXN0c1trXTtcblx0cmV0dXJuIGV4aXN0cztcbn07XG52YXIgb2JqZWN0QXNzaWduID0gKHRhcmdldCwgdmFsdWUsIG5hbWUgPSBudWxsLCByZW1vdmVOb3RFeGlzdHMgPSB0cnVlLCBtZXJnZUtleSA9IFwiaWRcIikgPT4ge1xuXHRjb25zdCBleGlzdHMgPSBuYW1lICE9IG51bGwgJiYgKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgPyB0YXJnZXQ/LltuYW1lXSA/PyB0YXJnZXQgOiB0YXJnZXQ7XG5cdGxldCBlbnRyaWVzID0gbnVsbDtcblx0aWYgKHJlbW92ZU5vdEV4aXN0cykgcmVtb3ZlRXh0cmEoZXhpc3RzLCB2YWx1ZSk7XG5cdGlmICh2YWx1ZSBpbnN0YW5jZW9mIFNldCB8fCB2YWx1ZSBpbnN0YW5jZW9mIE1hcCB8fCBBcnJheS5pc0FycmF5KHZhbHVlKSB8fCBpc0l0ZXJhYmxlKHZhbHVlKSkgZW50cmllcyA9IChleGlzdHMgaW5zdGFuY2VvZiBTZXQgfHwgZXhpc3RzIGluc3RhbmNlb2YgV2Vha1NldCA/IHZhbHVlPy52YWx1ZXM/LigpIDogdmFsdWU/LmVudHJpZXM/LigpKSB8fCAoQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgaXNJdGVyYWJsZSh2YWx1ZSkgPyB2YWx1ZSA6IFtdKTtcblx0ZWxzZSBpZiAodHlwZW9mIHZhbHVlID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIHZhbHVlID09IFwiZnVuY3Rpb25cIikgZW50cmllcyA9IGV4aXN0cyBpbnN0YW5jZW9mIFNldCB8fCBleGlzdHMgaW5zdGFuY2VvZiBXZWFrU2V0ID8gT2JqZWN0LnZhbHVlcyh2YWx1ZSkgOiBPYmplY3QuZW50cmllcyh2YWx1ZSk7XG5cdGlmIChleGlzdHMgJiYgZW50cmllcyAmJiAodHlwZW9mIGVudHJpZXMgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgZW50cmllcyA9PSBcImZ1bmN0aW9uXCIpKSB7XG5cdFx0aWYgKGV4aXN0cyBpbnN0YW5jZW9mIE1hcCB8fCBleGlzdHMgaW5zdGFuY2VvZiBXZWFrTWFwKSB7XG5cdFx0XHRmb3IgKGNvbnN0IEUgb2YgZW50cmllcykgZXhpc3RzLnNldCguLi5FKTtcblx0XHRcdHJldHVybiBleGlzdHM7XG5cdFx0fVxuXHRcdGlmIChleGlzdHMgaW5zdGFuY2VvZiBTZXQgfHwgZXhpc3RzIGluc3RhbmNlb2YgV2Vha1NldCkge1xuXHRcdFx0Zm9yIChjb25zdCBFIG9mIGVudHJpZXMpIHtcblx0XHRcdFx0Y29uc3QgbWVyZ2VPYmogPSBFPy5bbWVyZ2VLZXldID8gQXJyYXkuZnJvbShleGlzdHM/LnZhbHVlcz8uKCkgfHwgW10pLmZpbmQoKEkpID0+ICFpc05vdEVxdWFsPy4oST8uW21lcmdlS2V5XSwgRT8uW21lcmdlS2V5XSkpIDogbnVsbDtcblx0XHRcdFx0aWYgKG1lcmdlT2JqICE9IG51bGwpIG9iamVjdEFzc2lnbihtZXJnZU9iaiwgRSwgbnVsbCwgcmVtb3ZlTm90RXhpc3RzLCBtZXJnZUtleSk7XG5cdFx0XHRcdGVsc2UgZXhpc3RzLmFkZChFKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBleGlzdHM7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgZXhpc3RzID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGV4aXN0cyA9PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KGV4aXN0cykgfHwgaXNJdGVyYWJsZShleGlzdHMpKSB7XG5cdFx0XHRcdGxldCBJID0gMDtcblx0XHRcdFx0Zm9yIChjb25zdCBFIG9mIGVudHJpZXMpIGlmIChJIDwgZXhpc3RzLmxlbmd0aCkgZXhpc3RzW0krK10gPSBFPy5bMV07XG5cdFx0XHRcdGVsc2UgZXhpc3RzPy5wdXNoPy4oRT8uWzFdKTtcblx0XHRcdFx0cmV0dXJuIGV4aXN0cztcblx0XHRcdH1cblx0XHRcdHJldHVybiBPYmplY3QuYXNzaWduKGV4aXN0cywgT2JqZWN0LmZyb21FbnRyaWVzKFsuLi5lbnRyaWVzIHx8IFtdXS5maWx0ZXIoKEspID0+IHR5cGVvZiBLICE9IFwic3ltYm9sXCIpKSk7XG5cdFx0fVxuXHR9XG5cdGlmIChuYW1lICE9IG51bGwpIHtcblx0XHRSZWZsZWN0LnNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKTtcblx0XHRyZXR1cm4gdGFyZ2V0O1xuXHR9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiB2YWx1ZSA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBPYmplY3QuYXNzaWduKHRhcmdldCwgdmFsdWUpO1xuXHRyZXR1cm4gdmFsdWU7XG59O1xudmFyIGJpbmRGeCA9ICh0YXJnZXQsIGZ4KSA9PiB7XG5cdHJldHVybiBib3VuZEN0eC5nZXRPckluc2VydCh0YXJnZXQsIC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpKS5nZXRPckluc2VydChmeCwgZng/LmJpbmQ/Lih0YXJnZXQpKTtcbn07XG52YXIgYmluZEN0eCA9ICh0YXJnZXQsIGZ4KSA9PiAodHlwZW9mIGZ4ID09IFwiZnVuY3Rpb25cIiA/IGJpbmRGeCh0YXJnZXQsIGZ4KSA6IGZ4KSA/PyBmeDtcbnZhciBjYWxsQnlQcm9wID0gKHVud3JhcCwgcHJvcCwgY2IsIGN0eCkgPT4ge1xuXHRpZiAocHJvcCA9PSBTeW1ib2wuaXRlcmF0b3IpIHJldHVybiBjYWxsQnlBbGxQcm9wKHVud3JhcCwgY2IsIGN0eCk7XG5cdGlmIChwcm9wID09IG51bGwgfHwgdHlwZW9mIHByb3AgPT0gXCJzeW1ib2xcIiB8fCB0eXBlb2YgcHJvcCA9PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBwcm9wID09IFwiZnVuY3Rpb25cIikgcmV0dXJuO1xuXHRjb25zdCBjYWxsSWZOb3ROdWxsID0gKHYsIC4uLmFyZ3MpID0+IHtcblx0XHRpZiAodiAhPSBudWxsKSByZXR1cm4gY2I/Lih2LCAuLi5hcmdzKTtcblx0fTtcblx0aWYgKHVud3JhcCBpbnN0YW5jZW9mIE1hcCB8fCB1bndyYXAgaW5zdGFuY2VvZiBXZWFrTWFwKSB7XG5cdFx0aWYgKHVud3JhcC5oYXMocHJvcCkpIHJldHVybiBjYWxsSWZOb3ROdWxsPy4odW53cmFwLmdldChwcm9wKSwgcHJvcCwgbnVsbCwgXCJAc2V0XCIpO1xuXHR9IGVsc2UgaWYgKHVud3JhcCBpbnN0YW5jZW9mIFNldCB8fCB1bndyYXAgaW5zdGFuY2VvZiBXZWFrU2V0KSB7XG5cdFx0aWYgKHVud3JhcC5oYXMocHJvcCkpIHJldHVybiBjYWxsSWZOb3ROdWxsPy4ocHJvcCwgcHJvcCwgbnVsbCwgXCJAYWRkXCIpO1xuXHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodW53cmFwKSAmJiB0eXBlb2YgcHJvcCA9PSBcInN0cmluZ1wiICYmIFsuLi5wcm9wPy5tYXRjaEFsbD8uKC9eXFxkKyQvZyldLmxlbmd0aCA9PSAxICYmIE51bWJlci5pc0ludGVnZXIodHlwZW9mIHByb3AgPT0gXCJzdHJpbmdcIiA/IHBhcnNlSW50KHByb3ApIDogcHJvcCkpIHtcblx0XHRjb25zdCBpbmRleCA9IHR5cGVvZiBwcm9wID09IFwic3RyaW5nXCIgPyBwYXJzZUludChwcm9wKSA6IHByb3A7XG5cdFx0cmV0dXJuIGNhbGxJZk5vdE51bGw/Lih1bndyYXA/LltpbmRleF0sIGluZGV4LCBudWxsLCBcIkBhZGRcIik7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHVud3JhcCA9PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHVud3JhcCA9PSBcIm9iamVjdFwiKSByZXR1cm4gY2FsbElmTm90TnVsbD8uKHVud3JhcD8uW3Byb3BdLCBwcm9wLCBudWxsLCBcIkBzZXRcIik7XG59O1xudmFyIG9iamVjdEFzc2lnbk5vdEVxdWFsID0gKGRzdCwgc3JjID0ge30pID0+IHtcblx0T2JqZWN0LmVudHJpZXMoc3JjKT8uZm9yRWFjaD8uKChbaywgdl0pID0+IHtcblx0XHRpZiAoaXNOb3RFcXVhbCh2LCBkc3Rba10pKSBkc3Rba10gPSB2O1xuXHR9KTtcblx0cmV0dXJuIGRzdDtcbn07XG52YXIgY2FsbEJ5QWxsUHJvcCA9ICh1bndyYXAsIGNiLCBjdHgpID0+IHtcblx0aWYgKHVud3JhcCA9PSBudWxsKSByZXR1cm47XG5cdGxldCBrZXlzID0gW107XG5cdGlmICh1bndyYXAgaW5zdGFuY2VvZiBTZXQgfHwgdW53cmFwIGluc3RhbmNlb2YgTWFwIHx8IHR5cGVvZiB1bndyYXA/LmtleXMgPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gWy4uLnVud3JhcD8ua2V5cz8uKCkgfHwga2V5c10uZm9yRWFjaD8uKChwcm9wKSA9PiBjYWxsQnlQcm9wKHVud3JhcCwgcHJvcCwgY2IsIGN0eCkpO1xuXHRpZiAoQXJyYXkuaXNBcnJheSh1bndyYXApIHx8IGlzSXRlcmFibGUodW53cmFwKSkgcmV0dXJuIFsuLi51bndyYXBdLmZvckVhY2g/LigodiwgSSkgPT4gY2FsbEJ5UHJvcCh1bndyYXAsIEksIGNiLCBjdHgpKTtcblx0aWYgKHR5cGVvZiB1bndyYXAgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdW53cmFwID09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFsuLi5PYmplY3Qua2V5cyh1bndyYXApIHx8IGtleXNdLmZvckVhY2g/LigocHJvcCkgPT4gY2FsbEJ5UHJvcCh1bndyYXAsIHByb3AsIGNiLCBjdHgpKTtcbn07XG52YXIgaXNPYmplY3ROb3RFcXVhbCA9IChhLCBiKSA9PiB7XG5cdGlmIChhID09IG51bGwgJiYgYiA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcblx0aWYgKGEgaW5zdGFuY2VvZiBNYXAgfHwgYSBpbnN0YW5jZW9mIFdlYWtNYXApIHJldHVybiBhLnNpemUgIT0gYi5zaXplIHx8IEFycmF5LmZyb20oYS5lbnRyaWVzKCkpLnNvbWUoKFtrLCB2XSkgPT4gIWIuaGFzKGspIHx8ICFpc05vdEVxdWFsKHYsIGIuZ2V0KGspKSk7XG5cdGlmIChhIGluc3RhbmNlb2YgU2V0IHx8IGEgaW5zdGFuY2VvZiBXZWFrU2V0KSByZXR1cm4gYS5zaXplICE9IGIuc2l6ZSB8fCBBcnJheS5mcm9tKGEudmFsdWVzKCkpLnNvbWUoKHYpID0+ICFiLmhhcyh2KSk7XG5cdGlmIChBcnJheS5pc0FycmF5KGEpIHx8IEFycmF5LmlzQXJyYXkoYikpIHJldHVybiBhLmxlbmd0aCAhPSBiLmxlbmd0aCB8fCBhLnNvbWUoKHYsIGkpID0+ICFpc05vdEVxdWFsKHYsIGJbaV0pKTtcblx0aWYgKHR5cGVvZiBhID09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGIgPT0gXCJvYmplY3RcIikgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGEpICE9IEpTT04uc3RyaW5naWZ5KGIpO1xuXHRyZXR1cm4gYSAhPSBiO1xufTtcbnZhciBpc05vdEVxdWFsID0gKGEsIGIpID0+IHtcblx0aWYgKGEgPT0gbnVsbCAmJiBiID09IG51bGwpIHJldHVybiBmYWxzZTtcblx0aWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiB0cnVlO1xuXHRpZiAodHlwZW9mIGEgPT0gXCJib29sZWFuXCIgJiYgdHlwZW9mIGIgPT0gXCJib29sZWFuXCIpIHJldHVybiBhICE9IGI7XG5cdGlmICh0eXBlb2YgYSA9PSBcIm51bWJlclwiICYmIHR5cGVvZiBiID09IFwibnVtYmVyXCIpIHJldHVybiAhKGEgPT0gYiB8fCBNYXRoLmFicyhhIC0gYikgPCAxZS05KTtcblx0aWYgKHR5cGVvZiBhID09IFwic3RyaW5nXCIgJiYgdHlwZW9mIGIgPT0gXCJzdHJpbmdcIikgcmV0dXJuIGEgIT0gXCJcIiAmJiBiICE9IFwiXCIgJiYgYSAhPSBiIHx8IGEgIT09IGI7XG5cdGlmICh0eXBlb2YgYSAhPSB0eXBlb2YgYikgcmV0dXJuIGEgIT09IGI7XG5cdHJldHVybiBhICYmIGIgJiYgYSAhPSBiIHx8IGEgIT09IGI7XG59O1xudmFyIGJvdW5kQ3R4U3ltYm9sID0gU3ltYm9sLmZvcihcIm9iamVjdC5ib3VuZEN0eFwiKTtcbmdsb2JhbFRoaXNbYm91bmRDdHhTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBib3VuZEN0eCA9IGdsb2JhbFRoaXNbYm91bmRDdHhTeW1ib2xdO1xudmFyIGlzQXJyYXlJbnZhbGlkS2V5ID0gKGtleSwgc3JjKSA9PiB7XG5cdGNvbnN0IGludmFsaWRGb3JBcnJheSA9IGtleSA9PSBudWxsIHx8IGtleSA8IDAgfHwgdHlwZW9mIGtleSAhPSBcIm51bWJlclwiIHx8IGtleSA9PSBTeW1ib2wuaXRlcmF0b3IgfHwgKHNyYyAhPSBudWxsID8ga2V5ID49IChzcmM/Lmxlbmd0aCB8fCAwKSA6IGZhbHNlKTtcblx0cmV0dXJuIHNyYyAhPSBudWxsID8gQXJyYXkuaXNBcnJheShzcmMpICYmIGludmFsaWRGb3JBcnJheSA6IGZhbHNlO1xufTtcbnZhciBpblByb3h5ID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgY29udGV4dGlmeSA9IChwYywgbmFtZSkgPT4ge1xuXHRyZXR1cm4gdHlwZW9mIHBjPy5bbmFtZV0gPT0gXCJmdW5jdGlvblwiID8gcGM/LltuYW1lXT8uYmluZD8uKHBjKSA6IHBjPy5bbmFtZV07XG59O1xudmFyIGRlZXBPcGVyYXRlQW5kQ2xvbmUgPSAob2JqLCBvcGVyYXRpb24sICRwcmV2KSA9PiB7XG5cdGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcblx0XHRpZiAob2JqLmV2ZXJ5KGlzQ2FuSnVzdFJldHVybikpIHJldHVybiBvYmoubWFwKG9wZXJhdGlvbik7XG5cdFx0cmV0dXJuIG9iai5tYXAoKHZhbHVlLCBpbmRleCkgPT4gZGVlcE9wZXJhdGVBbmRDbG9uZSh2YWx1ZSwgb3BlcmF0aW9uLCBbb2JqLCBpbmRleF0pKTtcblx0fVxuXHRpZiAob2JqIGluc3RhbmNlb2YgTWFwKSB7XG5cdFx0Y29uc3QgZW50cmllcyA9IEFycmF5LmZyb20ob2JqLmVudHJpZXMoKSk7XG5cdFx0aWYgKGVudHJpZXMubWFwKChba2V5LCB2YWx1ZV0pID0+IHZhbHVlKS5ldmVyeShpc0Nhbkp1c3RSZXR1cm4pKSByZXR1cm4gbmV3IE1hcChlbnRyaWVzLm1hcCgoW2tleSwgdmFsdWVdKSA9PiBba2V5LCBvcGVyYXRpb24odmFsdWUsIGtleSwgb2JqKV0pKTtcblx0XHRyZXR1cm4gbmV3IE1hcChlbnRyaWVzLm1hcCgoW2tleSwgdmFsdWVdKSA9PiBba2V5LCBkZWVwT3BlcmF0ZUFuZENsb25lKHZhbHVlLCBvcGVyYXRpb24sIFtvYmosIGtleV0pXSkpO1xuXHR9XG5cdGlmIChvYmogaW5zdGFuY2VvZiBTZXQpIHtcblx0XHRjb25zdCBlbnRyaWVzID0gQXJyYXkuZnJvbShvYmouZW50cmllcygpKTtcblx0XHRjb25zdCB2YWx1ZXMgPSBlbnRyaWVzLm1hcCgoW2tleSwgdmFsdWVdKSA9PiB2YWx1ZSk7XG5cdFx0aWYgKGVudHJpZXMuZXZlcnkoaXNDYW5KdXN0UmV0dXJuKSkgcmV0dXJuIG5ldyBTZXQodmFsdWVzLm1hcChvcGVyYXRpb24pKTtcblx0XHRyZXR1cm4gbmV3IFNldCh2YWx1ZXMubWFwKCh2YWx1ZSkgPT4gZGVlcE9wZXJhdGVBbmRDbG9uZSh2YWx1ZSwgb3BlcmF0aW9uLCBbb2JqLCB2YWx1ZV0pKSk7XG5cdH1cblx0aWYgKHR5cGVvZiBvYmogPT0gXCJvYmplY3RcIiAmJiBvYmo/LmNvbnN0cnVjdG9yID09IE9iamVjdCAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG5cdFx0Y29uc3QgZW50cmllcyA9IEFycmF5LmZyb20oT2JqZWN0LmVudHJpZXMob2JqKSk7XG5cdFx0aWYgKGVudHJpZXMubWFwKChba2V5LCB2YWx1ZV0pID0+IHZhbHVlKS5ldmVyeShpc0Nhbkp1c3RSZXR1cm4pKSByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKGVudHJpZXMubWFwKChba2V5LCB2YWx1ZV0pID0+IFtrZXksIG9wZXJhdGlvbih2YWx1ZSwga2V5LCBvYmopXSkpO1xuXHRcdHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoZW50cmllcy5tYXAoKFtrZXksIHZhbHVlXSkgPT4gW2tleSwgZGVlcE9wZXJhdGVBbmRDbG9uZSh2YWx1ZSwgb3BlcmF0aW9uLCBbb2JqLCBrZXldKV0pKTtcblx0fVxuXHRyZXR1cm4gb3BlcmF0aW9uKG9iaiwgJHByZXY/LlsxXSA/PyBcIlwiLCAkcHJldj8uWzBdID8/IG51bGwpO1xufTtcbnZhciBiaW5kRXZlbnQgPSAob24sIGtleSwgdmFsdWUpID0+IHtcblx0aWYgKG9uPy5ba2V5XSAhPSBudWxsKSB7XG5cdFx0Y29uc3QgZXhpc3RzID0gb25ba2V5XTtcblx0XHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIGV4aXN0cy5hZGQoLi4udmFsdWUpO1xuXHRcdGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PSBcImZ1bmN0aW9uXCIpIGV4aXN0cy5hZGQodmFsdWUpO1xuXHRcdHJldHVybiBvbjtcblx0fVxuXHRvbltrZXldID8/PSBBcnJheS5pc0FycmF5KHZhbHVlKSA/IG5ldyBTZXQodmFsdWUpIDogdHlwZW9mIHZhbHVlID09IFwiZnVuY3Rpb25cIiA/IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KFt2YWx1ZV0pIDogdmFsdWU7XG5cdHJldHVybiBvbjtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy91dGlscy9Qcm9taXNlZC50c1xudmFyIHJlc29sdmVkU3ltYm9sID0gU3ltYm9sLmZvcihcIkByZXNvbHZlZC1wcm9taXNlXCIpO1xudmFyIGhhbmRsZWRTeW1ib2wgPSBTeW1ib2wuZm9yKFwiQGhhbmRsZWQtcHJvbWlzZVwiKTtcbmdsb2JhbFRoaXNbcmVzb2x2ZWRTeW1ib2xdID8/PSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbmdsb2JhbFRoaXNbaGFuZGxlZFN5bWJvbF0gPz89IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHJlc29sdmVkTWFwID0gZ2xvYmFsVGhpc1tyZXNvbHZlZFN5bWJvbF07XG52YXIgaGFuZGxlZE1hcCA9IGdsb2JhbFRoaXNbaGFuZGxlZFN5bWJvbF07XG52YXIgJGV4dHJhY3RLZXkkID0gU3ltYm9sLmZvcihcIkBleHRyYWN0XCIpO1xudmFyIGlzVGhlbmFibGUgPSAodmFsdWUpID0+IHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSB8fCB0eXBlb2YgdmFsdWU/LnRoZW4gPT0gXCJmdW5jdGlvblwiO1xudmFyIGFjdFdpdGggPSAocHJvbWlzZU9yUGxhaW4sIGNiKSA9PiB7XG5cdGlmIChpc1RoZW5hYmxlKHByb21pc2VPclBsYWluKSkge1xuXHRcdGlmIChyZXNvbHZlZE1hcD8uaGFzPy4ocHJvbWlzZU9yUGxhaW4pKSByZXR1cm4gY2IocmVzb2x2ZWRNYXA/LmdldD8uKHByb21pc2VPclBsYWluKSk7XG5cdFx0cmV0dXJuIFByb21pc2UudHJ5Py4oYXN5bmMgKCkgPT4ge1xuXHRcdFx0Y29uc3QgaXRlbSA9IGF3YWl0IHByb21pc2VPclBsYWluO1xuXHRcdFx0cmVzb2x2ZWRNYXA/LnNldD8uKHByb21pc2VPclBsYWluLCBpdGVtKTtcblx0XHRcdHJldHVybiBpdGVtO1xuXHRcdH0pPy50aGVuPy4oY2IpO1xuXHR9XG5cdHJldHVybiBjYihwcm9taXNlT3JQbGFpbik7XG59O1xudmFyIFByb21pc2VIYW5kbGVyID0gY2xhc3Mge1xuXHQjcmVzb2x2ZTtcblx0I3JlamVjdDtcblx0Y29uc3RydWN0b3IocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0dGhpcy4jcmVzb2x2ZSA9IHJlc29sdmU7XG5cdFx0dGhpcy4jcmVqZWN0ID0gcmVqZWN0O1xuXHR9XG5cdGRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcCwgZGVzY3JpcHRvcikge1xuXHRcdGlmICh1bndyYXAodGFyZ2V0KSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcCwgZGVzY3JpcHRvcik7XG5cdFx0cmV0dXJuIGFjdFdpdGgodW53cmFwKHRhcmdldCksIChvYmopID0+IFJlZmxlY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjcmlwdG9yKSk7XG5cdH1cblx0ZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wKSB7XG5cdFx0aWYgKHVud3JhcCh0YXJnZXQpIGluc3RhbmNlb2YgUHJvbWlzZSkgcmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wKTtcblx0XHRyZXR1cm4gYWN0V2l0aCh1bndyYXAodGFyZ2V0KSwgKG9iaikgPT4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eShvYmosIHByb3ApKTtcblx0fVxuXHRnZXRQcm90b3R5cGVPZih0YXJnZXQpIHtcblx0XHRpZiAodW53cmFwKHRhcmdldCkgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gUmVmbGVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpO1xuXHRcdHJldHVybiBhY3RXaXRoKHVud3JhcCh0YXJnZXQpLCAob2JqKSA9PiBSZWZsZWN0LmdldFByb3RvdHlwZU9mKG9iaikpO1xuXHR9XG5cdHNldFByb3RvdHlwZU9mKHRhcmdldCwgcHJvdG8pIHtcblx0XHRpZiAodW53cmFwKHRhcmdldCkgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gUmVmbGVjdC5zZXRQcm90b3R5cGVPZih0YXJnZXQsIHByb3RvKTtcblx0XHRyZXR1cm4gYWN0V2l0aCh1bndyYXAodGFyZ2V0KSwgKG9iaikgPT4gUmVmbGVjdC5zZXRQcm90b3R5cGVPZihvYmosIHByb3RvKSk7XG5cdH1cblx0aXNFeHRlbnNpYmxlKHRhcmdldCkge1xuXHRcdGlmICh1bndyYXAodGFyZ2V0KSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpO1xuXHRcdHJldHVybiBhY3RXaXRoKHVud3JhcCh0YXJnZXQpLCAob2JqKSA9PiBSZWZsZWN0LmlzRXh0ZW5zaWJsZShvYmopKTtcblx0fVxuXHRwcmV2ZW50RXh0ZW5zaW9ucyh0YXJnZXQpIHtcblx0XHRpZiAodW53cmFwKHRhcmdldCkgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gUmVmbGVjdC5vd25LZXlzKHRhcmdldCk7XG5cdFx0cmV0dXJuIGFjdFdpdGgodW53cmFwKHRhcmdldCksIChvYmopID0+IFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnMob2JqKSk7XG5cdH1cblx0b3duS2V5cyh0YXJnZXQpIHtcblx0XHRjb25zdCB1d3AgPSB1bndyYXAodGFyZ2V0KTtcblx0XHRpZiAodXdwIGluc3RhbmNlb2YgUHJvbWlzZSkgcmV0dXJuIE9iamVjdC5rZXlzKHV3cCk7XG5cdFx0cmV0dXJuIGFjdFdpdGgodXdwLCAob2JqKSA9PiB7XG5cdFx0XHRyZXR1cm4gKHR5cGVvZiBvYmogPT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygb2JqID09IFwiZnVuY3Rpb25cIikgJiYgb2JqICE9IG51bGwgPyBPYmplY3Qua2V5cyhvYmopIDogW107XG5cdFx0fSkgPz8gW107XG5cdH1cblx0Z2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcCkge1xuXHRcdGlmICh1bndyYXAodGFyZ2V0KSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3ApO1xuXHRcdHJldHVybiBhY3RXaXRoKHVud3JhcCh0YXJnZXQpLCAob2JqKSA9PiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3ApKTtcblx0fVxuXHRjb25zdHJ1Y3QodGFyZ2V0LCBhcmdzLCBuZXdUYXJnZXQpIHtcblx0XHRyZXR1cm4gYWN0V2l0aCh1bndyYXAodGFyZ2V0KSwgKGN0KSA9PiBSZWZsZWN0LmNvbnN0cnVjdChjdCwgYXJncywgbmV3VGFyZ2V0KSk7XG5cdH1cblx0aGFzKHRhcmdldCwgcHJvcCkge1xuXHRcdGlmICh1bndyYXAodGFyZ2V0KSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApO1xuXHRcdHJldHVybiBhY3RXaXRoKHVud3JhcCh0YXJnZXQpLCAob2JqKSA9PiBSZWZsZWN0LmhhcyhvYmosIHByb3ApKTtcblx0fVxuXHRnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuXHRcdHRhcmdldCA9IHVud3JhcCh0YXJnZXQpO1xuXHRcdGlmIChwcm9wID09IFwicHJvbWlzZVwiKSByZXR1cm4gdGFyZ2V0O1xuXHRcdGlmIChwcm9wID09IFwicmVzb2x2ZVwiICYmIHRoaXMuI3Jlc29sdmUpIHJldHVybiAoLi4uYXJncykgPT4ge1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gdGhpcy4jcmVzb2x2ZT8uKC4uLmFyZ3MpO1xuXHRcdFx0dGhpcy4jcmVzb2x2ZSA9IG51bGw7XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cdFx0aWYgKHByb3AgPT0gXCJyZWplY3RcIiAmJiB0aGlzLiNyZWplY3QpIHJldHVybiAoLi4uYXJncykgPT4ge1xuXHRcdFx0Y29uc3QgcmVzdWx0ID0gdGhpcy4jcmVqZWN0Py4oLi4uYXJncyk7XG5cdFx0XHR0aGlzLiNyZWplY3QgPSBudWxsO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXHRcdGlmIChwcm9wID09IFwidGhlblwiIHx8IHByb3AgPT0gXCJjYXRjaFwiIHx8IHByb3AgPT0gXCJmaW5hbGx5XCIpIHtcblx0XHRcdGlmICh0YXJnZXQgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gdGFyZ2V0Py5bcHJvcF0/LmJpbmQ/Lih0YXJnZXQpO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnN0ICR0bXAgPSBQcm9taXNlLnRyeSgoKSA9PiB0YXJnZXQpO1xuXHRcdFx0XHRyZXR1cm4gJHRtcD8uW3Byb3BdPy5iaW5kPy4oJHRtcCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGxldCByZXN1bHQgPSB2b2lkIDA7XG5cdFx0aWYgKHJlc29sdmVkTWFwPy5oYXM/Lih0YXJnZXQpICYmIChyZXN1bHQgPSByZXNvbHZlZE1hcD8uZ2V0Py4odGFyZ2V0KSk/Lltwcm9wXSAhPSBudWxsKSByZXN1bHQgPSByZXNvbHZlZE1hcD8uZ2V0Py4odGFyZ2V0KT8uW3Byb3BdO1xuXHRcdGVsc2UgcmVzdWx0ID0gUHJvbWlzZWQoYWN0V2l0aCh0YXJnZXQsIGFzeW5jIChvYmopID0+IHtcblx0XHRcdGlmICh1bndyYXAob2JqKSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiBSZWZsZWN0LmdldChvYmosIHByb3AsIHJlY2VpdmVyKTtcblx0XHRcdGlmIChpc1ByaW1pdGl2ZShvYmopKSByZXR1cm4gcHJvcCA9PSBTeW1ib2wudG9QcmltaXRpdmUgfHwgcHJvcCA9PSBTeW1ib2wudG9TdHJpbmdUYWcgPyBvYmogOiB2b2lkIDA7XG5cdFx0XHRsZXQgdmFsdWUgPSB2b2lkIDA7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHR2YWx1ZSA9IFJlZmxlY3QuZ2V0KG9iaiwgcHJvcCwgcmVjZWl2ZXIpO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHRhcmdldD8uW3Byb3BdO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PSBcImZ1bmN0aW9uXCIpIHJldHVybiB2YWx1ZT8uYmluZD8uKG9iaik7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSkpO1xuXHRcdGlmIChwcm9wID09IFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHJlc3VsdCkpIHJldHVybiBTdHJpbmcocmVzdWx0ID8/IFwiXCIpIHx8IFwiXCI7XG5cdFx0XHRyZXR1cm4gcmVzdWx0Py5bU3ltYm9sLnRvU3RyaW5nVGFnXT8uKCkgfHwgU3RyaW5nKHJlc3VsdCA/PyBcIlwiKSB8fCBcIlwiO1xuXHRcdH1cblx0XHRpZiAocHJvcCA9PSBTeW1ib2wudG9QcmltaXRpdmUpIHJldHVybiAoaGludCkgPT4ge1xuXHRcdFx0aWYgKGlzUHJpbWl0aXZlKHJlc3VsdCkpIHJldHVybiB0cnlQYXJzZUJ5SGludChyZXN1bHQsIGhpbnQpO1xuXHRcdH07XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXHRzZXQodGFyZ2V0LCBwcm9wLCB2YWx1ZSkge1xuXHRcdHJldHVybiBhY3RXaXRoKHVud3JhcCh0YXJnZXQpLCAob2JqKSA9PiBSZWZsZWN0LnNldChvYmosIHByb3AsIHZhbHVlKSk7XG5cdH1cblx0YXBwbHkodGFyZ2V0LCB0aGlzQXJnLCBhcmdzKSB7XG5cdFx0aWYgKHRoaXMuI3Jlc29sdmUpIHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IHRoaXMuI3Jlc29sdmU/LiguLi5hcmdzKTtcblx0XHRcdHRoaXMuI3Jlc29sdmUgPSBudWxsO1xuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdFx0cmV0dXJuIGFjdFdpdGgodW53cmFwKHRhcmdldCwgdGhpcy4jcmVzb2x2ZSksIChvYmopID0+IHtcblx0XHRcdGlmICh0eXBlb2Ygb2JqID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHRpZiAodW53cmFwKG9iaikgaW5zdGFuY2VvZiBQcm9taXNlKSByZXR1cm4gUmVmbGVjdC5hcHBseShvYmosIHRoaXNBcmcsIGFyZ3MpO1xuXHRcdFx0XHRyZXR1cm4gUmVmbGVjdC5hcHBseShvYmosIHRoaXNBcmcsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59O1xuZnVuY3Rpb24gUHJvbWlzZWQocHJvbWlzZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XG5cdGlmIChwcm9taXNlICE9IG51bGwgJiYgdHlwZW9mIHByb21pc2U/LnJlc29sdmVkID09IFwiZnVuY3Rpb25cIiAmJiBwcm9taXNlWyRleHRyYWN0S2V5JF0gIT0gbnVsbCAmJiBoYXNQZW5kaW5nUHJvbWlzZXMocHJvbWlzZSkpIHJldHVybiBQcm9taXNlZChwcm9taXNlLnJlc29sdmVkKCksIHJlc29sdmUsIHJlamVjdCk7XG5cdGlmICghaXNUaGVuYWJsZShwcm9taXNlKSAmJiBoYXNQZW5kaW5nUHJvbWlzZXMocHJvbWlzZSkpIHJldHVybiBQcm9taXNlZChyZXNvbHZlZChwcm9taXNlKSwgcmVzb2x2ZSwgcmVqZWN0KTtcblx0aWYgKCFpc1RoZW5hYmxlKHByb21pc2UpKSByZXR1cm4gcHJvbWlzZTtcblx0aWYgKHJlc29sdmVkTWFwPy5oYXM/Lihwcm9taXNlKSkgcmV0dXJuIHJlc29sdmVkTWFwPy5nZXQ/Lihwcm9taXNlKTtcblx0aWYgKCFoYW5kbGVkTWFwPy5oYXM/Lihwcm9taXNlKSkgcHJvbWlzZT8udGhlbj8uKChpdGVtKSA9PiByZXNvbHZlZE1hcD8uc2V0Py4ocHJvbWlzZSwgaXRlbSkpO1xuXHRyZXR1cm4gaGFuZGxlZE1hcC5nZXRPckluc2VydENvbXB1dGVkKHByb21pc2UsICgpID0+IG5ldyBQcm94eShmaXhGeChwcm9taXNlKSwgbmV3IFByb21pc2VIYW5kbGVyKHJlc29sdmUsIHJlamVjdCkpKTtcbn1cblByb21pc2VkLmFsbEtleWVkID0gZnVuY3Rpb24ocHJvbWlzZXMsIHJlc29sdmUsIHJlamVjdCkge1xuXHRyZXR1cm4gUHJvbWlzZWQoUHJvbWlzZS5hbGxLZXllZChwcm9taXNlcyksIHJlc29sdmUsIHJlamVjdCk7XG59O1xuUHJvbWlzZWQuYWxsU2V0dGxlZEtleWVkID0gZnVuY3Rpb24ocHJvbWlzZXMsIHJlc29sdmUsIHJlamVjdCkge1xuXHRyZXR1cm4gUHJvbWlzZWQoUHJvbWlzZS5hbGxTZXR0bGVkS2V5ZWQocHJvbWlzZXMpLCByZXNvbHZlLCByZWplY3QpO1xufTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3V0aWxzL1dSZWYudHNcbnZhciBleGlzdHNNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBXZWFrUmVmUHJveHlIYW5kbGVyID0gY2xhc3Mge1xuXHRfZGVyZWYodGFyZ2V0KSB7XG5cdFx0cmV0dXJuIHRhcmdldCBpbnN0YW5jZW9mIFdlYWtSZWYgfHwgdHlwZW9mIHRhcmdldD8uZGVyZWYgPT0gXCJmdW5jdGlvblwiID8gdGFyZ2V0Py5kZXJlZj8uKCkgOiB0YXJnZXQ7XG5cdH1cblx0Z2V0KHRnLCBwcm9wLCBfcmVjZWl2ZXIpIHtcblx0XHRjb25zdCBvYmogPSB0aGlzLl9kZXJlZih0ZyksIHZhbHVlID0gb2JqPy5bcHJvcF07XG5cdFx0aWYgKChwcm9wID09IFwiZWxlbWVudFwiIHx8IHByb3AgPT0gXCJ2YWx1ZVwiKSAmJiBvYmogJiYgKHZhbHVlID09IG51bGwgfHwgIShwcm9wIGluIG9iaikpKSByZXR1cm4gb2JqO1xuXHRcdGlmIChwcm9wID09IFwiZGVyZWZcIikgcmV0dXJuICgpID0+IHRoaXMuX2RlcmVmKHRnKTtcblx0XHRpZiAodHlwZW9mIHZhbHVlID09IFwiZnVuY3Rpb25cIikgcmV0dXJuICguLi5hcmdzKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZGVyZWYodGcpPy5bcHJvcF0/LiguLi5hcmdzKTtcblx0XHR9O1xuXHRcdHJldHVybiB2YWx1ZTtcblx0fVxuXHRzZXQodGcsIHByb3AsIHZhbHVlLCBfcmVjZWl2ZXIpIHtcblx0XHRjb25zdCBvYmogPSB0aGlzLl9kZXJlZih0Zyk7XG5cdFx0aWYgKG9iaikgcmV0dXJuIFJlZmxlY3Quc2V0KG9iaiwgcHJvcCwgdmFsdWUpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGhhcyh0ZywgcHJvcCkge1xuXHRcdGNvbnN0IG9iaiA9IHRoaXMuX2RlcmVmKHRnKTtcblx0XHRpZiAoIW9iaikgcmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiBwcm9wIGluIG9iajtcblx0fVxuXHRvd25LZXlzKHRnKSB7XG5cdFx0Y29uc3Qgb2JqID0gdGhpcy5fZGVyZWYodGcpO1xuXHRcdGlmICghb2JqKSByZXR1cm4gW107XG5cdFx0cmV0dXJuIFJlZmxlY3Qub3duS2V5cyhvYmopO1xuXHR9XG5cdGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0ZywgcHJvcCkge1xuXHRcdGNvbnN0IG9iaiA9IHRoaXMuX2RlcmVmKHRnKTtcblx0XHRpZiAoIW9iaikgcmV0dXJuIHZvaWQgMDtcblx0XHRyZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3ApO1xuXHR9XG5cdGRlbGV0ZVByb3BlcnR5KHRnLCBwcm9wKSB7XG5cdFx0Y29uc3Qgb2JqID0gdGhpcy5fZGVyZWYodGcpO1xuXHRcdGlmICghb2JqKSByZXR1cm4gdHJ1ZTtcblx0XHRyZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eShvYmosIHByb3ApO1xuXHR9XG5cdGRlZmluZVByb3BlcnR5KHRnLCBwcm9wLCBkZXNjcmlwdG9yKSB7XG5cdFx0Y29uc3Qgb2JqID0gdGhpcy5fZGVyZWYodGcpO1xuXHRcdGlmICghb2JqKSByZXR1cm4gdHJ1ZTtcblx0XHRyZXR1cm4gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2NyaXB0b3IpO1xuXHR9XG5cdGdldFByb3RvdHlwZU9mKHRnKSB7XG5cdFx0Y29uc3Qgb2JqID0gdGhpcy5fZGVyZWYodGcpO1xuXHRcdGlmICghb2JqKSByZXR1cm4gbnVsbDtcblx0XHRyZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG5cdH1cblx0c2V0UHJvdG90eXBlT2YodGcsIHByb3RvKSB7XG5cdFx0Y29uc3Qgb2JqID0gdGhpcy5fZGVyZWYodGcpO1xuXHRcdGlmICghb2JqKSByZXR1cm4gdHJ1ZTtcblx0XHRyZXR1cm4gUmVmbGVjdC5zZXRQcm90b3R5cGVPZihvYmosIHByb3RvKTtcblx0fVxuXHRpc0V4dGVuc2libGUodGcpIHtcblx0XHRjb25zdCBvYmogPSB0aGlzLl9kZXJlZih0Zyk7XG5cdFx0aWYgKCFvYmopIHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gUmVmbGVjdC5pc0V4dGVuc2libGUob2JqKTtcblx0fVxuXHRwcmV2ZW50RXh0ZW5zaW9ucyh0Zykge1xuXHRcdGNvbnN0IG9iaiA9IHRoaXMuX2RlcmVmKHRnKTtcblx0XHRpZiAoIW9iaikgcmV0dXJuIHRydWU7XG5cdFx0cmV0dXJuIFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnMob2JqKTtcblx0fVxufTtcbmZ1bmN0aW9uIFdSZWYodGFyZ2V0KSB7XG5cdGlmICghKHR5cGVvZiB0YXJnZXQgPT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgdGFyZ2V0ID09IFwiZnVuY3Rpb25cIikgfHwgdHlwZW9mIHRhcmdldCA9PSBcInN5bWJvbFwiKSByZXR1cm4gdGFyZ2V0O1xuXHRjb25zdCBpc1dlYWtSZWYgPSB0YXJnZXQgaW5zdGFuY2VvZiBXZWFrUmVmIHx8IHR5cGVvZiB0YXJnZXQ/LmRlcmVmID09IFwiZnVuY3Rpb25cIjtcblx0dGFyZ2V0ID0gaXNXZWFrUmVmID8gdGFyZ2V0Py5kZXJlZj8uKCkgOiB0YXJnZXQ7XG5cdGlmICh0YXJnZXQgIT0gbnVsbCAmJiBleGlzdHNNYXAuaGFzKHRhcmdldCkpIHJldHVybiBleGlzdHNNYXAuZ2V0KHRhcmdldCk7XG5cdGNvbnN0IGhhbmRsZXIgPSBuZXcgV2Vha1JlZlByb3h5SGFuZGxlcigpO1xuXHRjb25zdCBwbSA9IG5ldyBQcm94eShpc1dlYWtSZWYgPyB0YXJnZXQgOiBuZXcgV2Vha1JlZih0YXJnZXQpLCBoYW5kbGVyKTtcblx0ZXhpc3RzTWFwLnNldCh0YXJnZXQsIHBtKTtcblx0cmV0dXJuIHBtO1xufVxuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvdXRpbHMvQ29udmVydC50c1xudmFyIGN2dF9jc190b19vcyA9IChwb3NfaW5fY3MsIHNpemVfaW5fY3MsIG9yX2kgPSAwKSA9PiB7XG5cdGNvbnN0IHNpemVfaW5fb3MgPSBbLi4uc2l6ZV9pbl9jc107XG5cdGNvbnN0IHBvc19pbl9zd2FwID0gWy4uLnBvc19pbl9jc107XG5cdGlmIChvcl9pICUgMikge1xuXHRcdHBvc19pbl9zd2FwLnJldmVyc2UoKTtcblx0XHRzaXplX2luX29zLnJldmVyc2UoKTtcblx0fVxuXHRyZXR1cm4gWyhvcl9pID09IDAgfHwgb3JfaSA9PSAzID8gcG9zX2luX3N3YXBbMF0gOiBzaXplX2luX29zWzBdIC0gcG9zX2luX3N3YXBbMF0pIHx8IDAsIChvcl9pID09IDAgfHwgb3JfaSA9PSAxID8gcG9zX2luX3N3YXBbMV0gOiBzaXplX2luX29zWzFdIC0gcG9zX2luX3N3YXBbMV0pIHx8IDBdO1xufTtcbnZhciBjdnRfb3NfdG9fY3MgPSAocG9zX2luX29zLCBzaXplX2luX2NzLCBvcl9pID0gMCkgPT4ge1xuXHRjb25zdCBzaXplX2luX29zID0gWy4uLnNpemVfaW5fY3NdO1xuXHRjb25zdCBwb3NfaW5fY3AgPSBbLi4ucG9zX2luX29zXTtcblx0aWYgKG9yX2kgJSAyKSBzaXplX2luX29zLnJldmVyc2UoKTtcblx0Y29uc3QgcG9zX2luX2NzID0gWyhvcl9pID09IDAgfHwgb3JfaSA9PSAzID8gcG9zX2luX2NwWzBdIDogc2l6ZV9pbl9vc1swXSAtIHBvc19pbl9jcFswXSkgfHwgMCwgKG9yX2kgPT0gMCB8fCBvcl9pID09IDEgPyBwb3NfaW5fY3BbMV0gOiBzaXplX2luX29zWzFdIC0gcG9zX2luX2NwWzFdKSB8fCAwXTtcblx0aWYgKG9yX2kgJSAyKSBwb3NfaW5fY3MucmV2ZXJzZSgpO1xuXHRyZXR1cm4gcG9zX2luX2NzO1xufTtcbnZhciBjdnRfcmVsX2NzX3RvX29zID0gKHJlbF9pbl9jcywgb3JfaSA9IDApID0+IHtcblx0Y29uc3QgcmVsX2luX3N3YXAgPSBbLi4ucmVsX2luX2NzXTtcblx0aWYgKG9yX2kgJSAyKSByZWxfaW5fc3dhcC5yZXZlcnNlKCk7XG5cdHJldHVybiBbKG9yX2kgPT0gMCB8fCBvcl9pID09IDMgPyByZWxfaW5fc3dhcFswXSA6IC1yZWxfaW5fc3dhcFswXSkgfHwgMCwgKG9yX2kgPT0gMCB8fCBvcl9pID09IDEgPyByZWxfaW5fc3dhcFsxXSA6IC1yZWxfaW5fc3dhcFsxXSkgfHwgMF07XG59O1xudmFyIGN2dF9yZWxfb3NfdG9fY3MgPSAocmVsX2luX29zLCBvcl9pID0gMCkgPT4ge1xuXHRjb25zdCByZWxfaW5fY3AgPSBbLi4ucmVsX2luX29zXTtcblx0Y29uc3QgcG9zX2luX2NzID0gWyhvcl9pID09IDAgfHwgb3JfaSA9PSAzID8gcmVsX2luX2NwWzBdIDogLXJlbF9pbl9jcFswXSkgfHwgMCwgKG9yX2kgPT0gMCB8fCBvcl9pID09IDEgPyByZWxfaW5fY3BbMV0gOiAtcmVsX2luX2NwWzFdKSB8fCAwXTtcblx0aWYgKG9yX2kgJSAyKSBwb3NfaW5fY3MucmV2ZXJzZSgpO1xuXHRyZXR1cm4gcG9zX2luX2NzO1xufTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3V0aWxzL0dyaWRJdGVtVXRpbHMudHNcbnZhciBub3JtYWxpemVHcmlkTGF5b3V0ID0gKGxheW91dCwgZmFsbGJhY2sgPSBbNCwgOF0pID0+IHtcblx0aWYgKEFycmF5LmlzQXJyYXkobGF5b3V0KSAmJiBsYXlvdXQubGVuZ3RoID49IDIpIHJldHVybiBbTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihOdW1iZXIobGF5b3V0WzBdKSB8fCBmYWxsYmFja1swXSkpLCBNYXRoLm1heCgxLCBNYXRoLmZsb29yKE51bWJlcihsYXlvdXRbMV0pIHx8IGZhbGxiYWNrWzFdKSldO1xuXHRpZiAobGF5b3V0ICYmIHR5cGVvZiBsYXlvdXQgPT09IFwib2JqZWN0XCIpIHtcblx0XHRjb25zdCBvID0gbGF5b3V0O1xuXHRcdHJldHVybiBbTWF0aC5tYXgoMSwgTWF0aC5mbG9vcihOdW1iZXIoby5jb2x1bW5zKSB8fCBmYWxsYmFja1swXSkpLCBNYXRoLm1heCgxLCBNYXRoLmZsb29yKE51bWJlcihvLnJvd3MpIHx8IGZhbGxiYWNrWzFdKSldO1xuXHR9XG5cdHJldHVybiBbZmFsbGJhY2tbMF0sIGZhbGxiYWNrWzFdXTtcbn07XG52YXIgY2xhbXBHcmlkQ2VsbFR1cGxlID0gKGNlbGwsIGxheW91dCkgPT4ge1xuXHRjb25zdCBbY29scywgcm93c10gPSBub3JtYWxpemVHcmlkTGF5b3V0KGxheW91dCk7XG5cdHJldHVybiBbTWF0aC5tYXgoMCwgTWF0aC5taW4oY29scyAtIDEsIE1hdGguZmxvb3IoTnVtYmVyKGNlbGxbMF0pIHx8IDApKSksIE1hdGgubWF4KDAsIE1hdGgubWluKHJvd3MgLSAxLCBNYXRoLmZsb29yKE51bWJlcihjZWxsWzFdKSB8fCAwKSkpXTtcbn07XG52YXIgcmVzb2x2ZUxvY2FsUG9pbnRUb0dyaWRDZWxsID0gKGxvY2FsUHgsIHNpemUsIGxheW91dCwgb3JpZW50LCBvcHRpb25zKSA9PiB7XG5cdGNvbnN0IEwgPSBub3JtYWxpemVHcmlkTGF5b3V0KGxheW91dCk7XG5cdGNvbnN0IHcgPSBNYXRoLm1heCgxLCBzaXplWzBdIHx8IDEpO1xuXHRjb25zdCBoID0gTWF0aC5tYXgoMSwgc2l6ZVsxXSB8fCAxKTtcblx0Y29uc3Qgb3NDb29yZCA9IGN2dF9jc190b19vcyhsb2NhbFB4LCBbdywgaF0sIG9yaWVudCk7XG5cdGNvbnN0IG5vcm1hbGl6ZWRBcmdzID0ge1xuXHRcdGl0ZW06IG9wdGlvbnM/LnJlZGlyZWN0Py5pdGVtID8/IHsgaWQ6IFwiXCIgfSxcblx0XHRsaXN0OiBvcHRpb25zPy5yZWRpcmVjdD8ubGlzdCA/PyBbXSxcblx0XHRpdGVtczogb3B0aW9ucz8ucmVkaXJlY3Q/Lml0ZW1zID8/IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCksXG5cdFx0bGF5b3V0OiBMLFxuXHRcdHNpemU6IFt3LCBoXVxuXHR9O1xuXHRjb25zdCBwcm9qZWN0ZWQgPSBjb252ZXJ0T3JpZW50UHhUb0NYKG9zQ29vcmQsIG5vcm1hbGl6ZWRBcmdzLCBvcmllbnQpO1xuXHRjb25zdCBub3JtYWxpemVkQ2VsbCA9IChvcHRpb25zPy5tb2RlID8/IFwiZmxvb3JcIikgPT09IFwicm91bmRcIiA/IFtNYXRoLnJvdW5kKHByb2plY3RlZFswXSksIE1hdGgucm91bmQocHJvamVjdGVkWzFdKV0gOiBbTWF0aC5mbG9vcihwcm9qZWN0ZWRbMF0pLCBNYXRoLmZsb29yKHByb2plY3RlZFsxXSldO1xuXHRjb25zdCByZWRpcmVjdGVkID0gcmVkaXJlY3RDZWxsKG5vcm1hbGl6ZWRDZWxsLCBub3JtYWxpemVkQXJncyk7XG5cdHJldHVybiBjbGFtcEdyaWRDZWxsVHVwbGUocmVkaXJlY3RlZCwgTCk7XG59O1xudmFyIGdyaWRJdGVtc0FzQXJyYXkgPSAoaXRlbXMpID0+IHtcblx0aWYgKGl0ZW1zID09IG51bGwpIHJldHVybiBbXTtcblx0aWYgKEFycmF5LmlzQXJyYXkoaXRlbXMpKSByZXR1cm4gaXRlbXM7XG5cdGlmIChpdGVtcyBpbnN0YW5jZW9mIE1hcCkgcmV0dXJuIEFycmF5LmZyb20oaXRlbXMudmFsdWVzKCkpO1xuXHRpZiAoaXRlbXMgaW5zdGFuY2VvZiBTZXQpIHJldHVybiBBcnJheS5mcm9tKGl0ZW1zKTtcblx0aWYgKHR5cGVvZiBpdGVtc1tTeW1ib2wuaXRlcmF0b3JdID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBBcnJheS5mcm9tKGl0ZW1zKTtcblx0cmV0dXJuIFtdO1xufTtcbnZhciBnZXRTcGFuID0gKGVsLCBheCkgPT4ge1xuXHRjb25zdCBwcm9wID0gZWwuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShbXCItLW94LWMtc3BhblwiLCBcIi0tb3gtci1zcGFuXCJdW2F4XSksIGZhY3RvciA9IChwYXJzZUZsb2F0KHByb3AgfHwgXCIxXCIpIHx8IDEpIC0gMTtcblx0cmV0dXJuIE1hdGgubWluKE1hdGgubWF4KGZhY3RvciAtIDEsIDApLCAxKTtcbn07XG52YXIgcmVkaXJlY3RDZWxsID0gKCRwcmVDZWxsLCBncmlkQXJncykgPT4ge1xuXHRjb25zdCBsYXlvdXQgPSBub3JtYWxpemVHcmlkTGF5b3V0KGdyaWRBcmdzPy5sYXlvdXQgPz8gWzQsIDhdKTtcblx0Y29uc3Qgbm9ybWFsaXplZEFyZ3MgPSB7XG5cdFx0Li4uZ3JpZEFyZ3MsXG5cdFx0bGF5b3V0XG5cdH07XG5cdGNvbnN0IGljb25zID0gZ3JpZEl0ZW1zQXNBcnJheShub3JtYWxpemVkQXJncz8uaXRlbXMpO1xuXHRjb25zdCBpdGVtID0gbm9ybWFsaXplZEFyZ3M/Lml0ZW0gfHwge307XG5cdGNvbnN0IGNoZWNrQnVzeSA9IChjZWxsKSA9PiB7XG5cdFx0cmV0dXJuIGljb25zLmZpbHRlcigoZSkgPT4gIShlID09IGl0ZW0gfHwgZT8uaWQgPT0gaXRlbT8uaWQpKS5zb21lKChvbmUpID0+IChvbmU/LmNlbGw/LlswXSB8fCAwKSA9PSAoY2VsbFswXSB8fCAwKSAmJiAob25lPy5jZWxsPy5bMV0gfHwgMCkgPT0gKGNlbGxbMV0gfHwgMCkpO1xuXHR9O1xuXHRjb25zdCBwcmVDZWxsID0gWy4uLiRwcmVDZWxsXTtcblx0aWYgKCFjaGVja0J1c3kocHJlQ2VsbCkpIHJldHVybiBbLi4ucHJlQ2VsbF07XG5cdGNvbnN0IGNvbHVtbnMgPSBsYXlvdXRbMF0gfHwgNDtcblx0Y29uc3Qgcm93cyA9IGxheW91dFsxXSB8fCA4O1xuXHRjb25zdCBzdWl0YWJsZSA9IChbXG5cdFx0W3ByZUNlbGxbMF0gKyAxLCBwcmVDZWxsWzFdXSxcblx0XHRbcHJlQ2VsbFswXSAtIDEsIHByZUNlbGxbMV1dLFxuXHRcdFtwcmVDZWxsWzBdLCBwcmVDZWxsWzFdICsgMV0sXG5cdFx0W3ByZUNlbGxbMF0sIHByZUNlbGxbMV0gLSAxXVxuXHRdLmZpbHRlcigodikgPT4ge1xuXHRcdHJldHVybiB2WzBdID49IDAgJiYgdlswXSA8IGNvbHVtbnMgJiYgdlsxXSA+PSAwICYmIHZbMV0gPCByb3dzO1xuXHR9KSB8fCBbXSkuZmluZCgodikgPT4gIWNoZWNrQnVzeSh2KSk7XG5cdGlmIChzdWl0YWJsZSkgcmV0dXJuIFsuLi5zdWl0YWJsZV07XG5cdGxldCBleGNlZWQgPSAwLCBidXN5ID0gdHJ1ZSwgY29tcCA9IFsuLi5wcmVDZWxsXTtcblx0d2hpbGUgKGJ1c3kgJiYgZXhjZWVkKysgPCBjb2x1bW5zICogcm93cykge1xuXHRcdGlmICghKGJ1c3kgPSBjaGVja0J1c3koY29tcCkpKSByZXR1cm4gWy4uLmNvbXBdO1xuXHRcdGNvbXBbMF0rKztcblx0XHRpZiAoY29tcFswXSA+PSBjb2x1bW5zKSB7XG5cdFx0XHRjb21wWzBdID0gMDtcblx0XHRcdGNvbXBbMV0rKztcblx0XHRcdGlmIChjb21wWzFdID49IHJvd3MpIGNvbXBbMV0gPSAwO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gWy4uLnByZUNlbGxdO1xufTtcbnZhciBtYWtlT3JpZW50SW5zZXQgPSAoJG9yaWVudFB4LCBncmlkQXJncywgb3JpZW50ID0gMCkgPT4ge1xuXHRjb25zdCBib3hJblB4ID0gWy4uLmdyaWRBcmdzLnNpemVdO1xuXHRjb25zdCBvcmllbnRQeCA9IFsuLi4kb3JpZW50UHhdO1xuXHRjb25zdCBsYXlvdXQgPSBub3JtYWxpemVHcmlkTGF5b3V0KGdyaWRBcmdzLmxheW91dCA/PyBbNCwgOF0pO1xuXHRpZiAob3JpZW50ICUgMikgYm94SW5QeC5yZXZlcnNlKCk7XG5cdHJldHVybiBbcm91bmROZWFyZXN0KG9yaWVudFB4WzBdLCBib3hJblB4WzBdIC8gbGF5b3V0WzBdKSwgcm91bmROZWFyZXN0KG9yaWVudFB4WzFdLCBib3hJblB4WzFdIC8gbGF5b3V0WzFdKV07XG59O1xudmFyIGNvbnZlcnRPcmllbnRQeFRvQ1ggPSAoJG9yaWVudFB4LCBncmlkQXJncywgb3JpZW50ID0gMCkgPT4ge1xuXHRjb25zdCBib3hJblB4ID0gWy4uLmdyaWRBcmdzLnNpemVdO1xuXHRjb25zdCBvcmllbnRQeCA9IFsuLi4kb3JpZW50UHhdO1xuXHRjb25zdCBsYXlvdXQgPSBub3JtYWxpemVHcmlkTGF5b3V0KGdyaWRBcmdzLmxheW91dCA/PyBbNCwgOF0pO1xuXHRpZiAob3JpZW50ICUgMikgYm94SW5QeC5yZXZlcnNlKCk7XG5cdGNvbnN0IGdyaWRQeFRvQ1ggPSBbbGF5b3V0WzBdIC8gYm94SW5QeFswXSwgbGF5b3V0WzFdIC8gYm94SW5QeFsxXV07XG5cdHJldHVybiBbb3JpZW50UHhbMF0gKiBncmlkUHhUb0NYWzBdLCBvcmllbnRQeFsxXSAqIGdyaWRQeFRvQ1hbMV1dO1xufTtcbnZhciBmbG9vckluT3JpZW50UHggPSAoJG9yaWVudFB4LCBncmlkQXJncywgb3JpZW50ID0gMCkgPT4ge1xuXHRjb25zdCBvcmllbnRQeCA9IFsuLi4kb3JpZW50UHhdO1xuXHRjb25zdCBib3hJblB4ID0gWy4uLmdyaWRBcmdzLnNpemVdO1xuXHRjb25zdCBsYXlvdXQgPSBub3JtYWxpemVHcmlkTGF5b3V0KGdyaWRBcmdzLmxheW91dCA/PyBbNCwgOF0pO1xuXHRpZiAob3JpZW50ICUgMikgYm94SW5QeC5yZXZlcnNlKCk7XG5cdGNvbnN0IGluQm94ID0gW2JveEluUHhbMF0gLyBsYXlvdXRbMF0sIGJveEluUHhbMV0gLyBsYXlvdXRbMV1dO1xuXHRyZXR1cm4gW3JvdW5kTmVhcmVzdChvcmllbnRQeFswXSwgaW5Cb3hbMF0pLCByb3VuZE5lYXJlc3Qob3JpZW50UHhbMV0sIGluQm94WzFdKV07XG59O1xudmFyIGZsb29ySW5DWCA9ICgkQ1gsIGdyaWRBcmdzKSA9PiB7XG5cdGNvbnN0IGxheW91dCA9IG5vcm1hbGl6ZUdyaWRMYXlvdXQoZ3JpZEFyZ3MubGF5b3V0ID8/IFs0LCA4XSk7XG5cdHJldHVybiBbTWF0aC5taW4oTWF0aC5tYXgocm91bmROZWFyZXN0KCRDWFswXSksIDApLCBsYXlvdXRbMF0gLSAxKSwgTWF0aC5taW4oTWF0aC5tYXgocm91bmROZWFyZXN0KCRDWFsxXSksIDApLCBsYXlvdXRbMV0gLSAxKV07XG59O1xudmFyIGNsaWVudFNwYWNlSW5PcmllbnRDWCA9ICgkY2xpZW50UHgsIGdyaWRBcmdzLCBvcmllbnQgPSAwKSA9PiB7XG5cdGNvbnN0IGNsaWVudFB4ID0gWy4uLiRjbGllbnRQeF07XG5cdGNvbnN0IHNpemUgPSBbLi4uZ3JpZEFyZ3Muc2l6ZV07XG5cdGNvbnN0IGxheW91dCA9IG5vcm1hbGl6ZUdyaWRMYXlvdXQoZ3JpZEFyZ3MubGF5b3V0ID8/IFs0LCA4XSk7XG5cdGNvbnN0IG9yaWVudFB4ID0gY3Z0X2NzX3RvX29zKGNsaWVudFB4LCBzaXplLCBvcmllbnQpO1xuXHRjb25zdCBvc1NpemUgPSBvcmllbnQgJSAyID8gW3NpemVbMV0sIHNpemVbMF1dIDogW3NpemVbMF0sIHNpemVbMV1dO1xuXHRyZXR1cm4gW01hdGgubWluKE1hdGgubWF4KHJvdW5kTmVhcmVzdChvcmllbnRQeFswXSAvIG9zU2l6ZVswXSAqIGxheW91dFswXSwgMSksIDApLCBsYXlvdXRbMF0gLSAxKSwgTWF0aC5taW4oTWF0aC5tYXgocm91bmROZWFyZXN0KG9yaWVudFB4WzFdIC8gb3NTaXplWzFdICogbGF5b3V0WzFdLCAxKSwgMCksIGxheW91dFsxXSAtIDEpXTtcbn07XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy91dGlscy9Vc2VyUGF0aC50c1xudmFyIG5vcm1hbGl6ZVNsYXNoZXMgPSAoaW5wdXQpID0+IHtcblx0Y29uc3QgdmFsdWUgPSBTdHJpbmcoaW5wdXQgPz8gXCJcIikudHJpbSgpO1xuXHRpZiAoIXZhbHVlKSByZXR1cm4gXCIvXCI7XG5cdHJldHVybiAodmFsdWUuc3RhcnRzV2l0aChcIi9cIikgPyB2YWx1ZSA6IGAvJHt2YWx1ZX1gKS5yZXBsYWNlKC9cXC8rL2csIFwiL1wiKTtcbn07XG52YXIgaXNVc2VyU2NvcGVQYXRoID0gKGlucHV0KSA9PiB7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVTbGFzaGVzKGlucHV0KTtcblx0cmV0dXJuIG5vcm1hbGl6ZWQgPT09IFwiL3VzZXJcIiB8fCBub3JtYWxpemVkLnN0YXJ0c1dpdGgoXCIvdXNlci9cIik7XG59O1xudmFyIHN0cmlwVXNlclNjb3BlUHJlZml4ID0gKGlucHV0KSA9PiB7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVTbGFzaGVzKGlucHV0KTtcblx0aWYgKG5vcm1hbGl6ZWQgPT09IFwiL3VzZXJcIikgcmV0dXJuIFwiL1wiO1xuXHRpZiAobm9ybWFsaXplZC5zdGFydHNXaXRoKFwiL3VzZXIvXCIpKSByZXR1cm4gbm9ybWFsaXplZC5zbGljZSg1KSB8fCBcIi9cIjtcblx0cmV0dXJuIG5vcm1hbGl6ZWQ7XG59O1xudmFyIHRvVXNlclJlbGF0aXZlUGF0aCA9IChpbnB1dCkgPT4ge1xuXHRyZXR1cm4gc3RyaXBVc2VyU2NvcGVQcmVmaXgoaW5wdXQpLnJlcGxhY2UoL15cXC8rLywgXCJcIik7XG59O1xudmFyIHRvVXNlclNjb3BlUGF0aCA9IChpbnB1dCkgPT4ge1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplU2xhc2hlcyhpbnB1dCk7XG5cdGlmIChpc1VzZXJTY29wZVBhdGgobm9ybWFsaXplZCkpIHJldHVybiBub3JtYWxpemVkO1xuXHRpZiAobm9ybWFsaXplZCA9PT0gXCIvXCIpIHJldHVybiBcIi91c2VyL1wiO1xuXHRyZXR1cm4gYC91c2VyJHtub3JtYWxpemVkfWA7XG59O1xudmFyIHVzZXJQYXRoQ2FuZGlkYXRlcyA9IChpbnB1dCkgPT4ge1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplU2xhc2hlcyhpbnB1dCk7XG5cdGNvbnN0IHN0cmlwcGVkID0gc3RyaXBVc2VyU2NvcGVQcmVmaXgobm9ybWFsaXplZCk7XG5cdGlmIChpc1VzZXJTY29wZVBhdGgobm9ybWFsaXplZCkpIHJldHVybiBBcnJheS5mcm9tKC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KFtzdHJpcHBlZCwgbm9ybWFsaXplZF0pKTtcblx0cmV0dXJuIFtzdHJpcHBlZF07XG59O1xudmFyIGlzSWRiU2NvcGVQYXRoID0gKGlucHV0KSA9PiB7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVTbGFzaGVzKGlucHV0KTtcblx0cmV0dXJuIG5vcm1hbGl6ZWQgPT09IFwiL2lkYlwiIHx8IG5vcm1hbGl6ZWQuc3RhcnRzV2l0aChcIi9pZGIvXCIpO1xufTtcbnZhciBzdHJpcElkYlNjb3BlUHJlZml4ID0gKGlucHV0KSA9PiB7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVTbGFzaGVzKGlucHV0KTtcblx0aWYgKG5vcm1hbGl6ZWQgPT09IFwiL2lkYlwiKSByZXR1cm4gXCIvXCI7XG5cdGlmIChub3JtYWxpemVkLnN0YXJ0c1dpdGgoXCIvaWRiL1wiKSkgcmV0dXJuIG5vcm1hbGl6ZWQuc2xpY2UoNCkgfHwgXCIvXCI7XG5cdHJldHVybiBub3JtYWxpemVkO1xufTtcbnZhciBpc1N0b3JhZ2VTY29wZVBhdGggPSAoaW5wdXQpID0+IGlzVXNlclNjb3BlUGF0aChpbnB1dCkgfHwgaXNJZGJTY29wZVBhdGgoaW5wdXQpO1xudmFyIHN0cmlwU3RvcmFnZVNjb3BlUHJlZml4ID0gKGlucHV0KSA9PiB7XG5cdGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVTbGFzaGVzKGlucHV0KTtcblx0aWYgKGlzSWRiU2NvcGVQYXRoKG5vcm1hbGl6ZWQpKSByZXR1cm4gc3RyaXBJZGJTY29wZVByZWZpeChub3JtYWxpemVkKTtcblx0cmV0dXJuIHN0cmlwVXNlclNjb3BlUHJlZml4KG5vcm1hbGl6ZWQpO1xufTtcbnZhciBzdG9yYWdlUGF0aENhbmRpZGF0ZXMgPSAoaW5wdXQpID0+IHtcblx0Y29uc3Qgbm9ybWFsaXplZCA9IG5vcm1hbGl6ZVNsYXNoZXMoaW5wdXQpO1xuXHRjb25zdCBzdHJpcHBlZCA9IHN0cmlwU3RvcmFnZVNjb3BlUHJlZml4KG5vcm1hbGl6ZWQpO1xuXHRpZiAoaXNTdG9yYWdlU2NvcGVQYXRoKG5vcm1hbGl6ZWQpKSByZXR1cm4gQXJyYXkuZnJvbSgvKiBAX19QVVJFX18gKi8gbmV3IFNldChbc3RyaXBwZWQsIG5vcm1hbGl6ZWRdKSk7XG5cdHJldHVybiBbc3RyaXBwZWRdO1xufTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3V0aWxzL01vdW50ZWRGcy50c1xudmFyIE1PVU5URURfRlNfRVZFTlQgPSBcInNzcmU6ZnNcIjtcbnZhciBNT1VOVEVEX0ZTX0hUVFBfUEFUSCA9IFwiL3NzcmUvZnNcIjtcbnZhciBNT1VOVEVEX0ZTX1dTX1BBVEggPSBcIi9zc3JlL2ZzL3dzXCI7XG52YXIgY3JlYXRlTW91bnRlZEZzSWQgPSAoKSA9PiB7XG5cdHRyeSB7XG5cdFx0aWYgKHR5cGVvZiBjcnlwdG8gIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGNyeXB0by5yYW5kb21VVUlEID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBjcnlwdG8ucmFuZG9tVVVJRCgpO1xuXHR9IGNhdGNoIHt9XG5cdHJldHVybiBgZnNfJHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX1fJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyLCAxMCl9YDtcbn07XG52YXIgaXNNb3VudGVkRnNSZXF1ZXN0ID0gKHZhbHVlKSA9PiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZS50ID09PSBcImZzXCIgJiYgdHlwZW9mIHZhbHVlLm9wID09PSBcInN0cmluZ1wiICYmIHR5cGVvZiB2YWx1ZS5pZCA9PT0gXCJzdHJpbmdcIjtcbnZhciBpc01vdW50ZWRGc1Jlc3BvbnNlID0gKHZhbHVlKSA9PiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZS50ID09PSBcImZzLXJlc3VsdFwiICYmIHR5cGVvZiB2YWx1ZS5pZCA9PT0gXCJzdHJpbmdcIjtcbnZhciBwYXJzZU1vdW50ZWRGc01lc3NhZ2UgPSAocmF3KSA9PiB7XG5cdGxldCB2YWx1ZSA9IHJhdztcblx0aWYgKHR5cGVvZiByYXcgPT09IFwic3RyaW5nXCIpIHRyeSB7XG5cdFx0dmFsdWUgPSBKU09OLnBhcnNlKHJhdyk7XG5cdH0gY2F0Y2gge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdGlmIChpc01vdW50ZWRGc1JlcXVlc3QodmFsdWUpIHx8IGlzTW91bnRlZEZzUmVzcG9uc2UodmFsdWUpKSByZXR1cm4gdmFsdWU7XG5cdHJldHVybiBudWxsO1xufTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3V0aWxzL01hcHBlZC50c1xudmFyIHJlbmRlclRhYk5hbWUgPSAodGFiTmFtZSkgPT4ge1xuXHRpZiAoIXRhYk5hbWUpIHJldHVybiBcIlwiO1xuXHR0YWJOYW1lID0gdGFiTmFtZT8ucmVwbGFjZT8uKC9fL2csIFwiIFwiKSB8fCB0YWJOYW1lO1xuXHR0YWJOYW1lID0gdGFiTmFtZT8uY2hhckF0Py4oMCk/LnRvVXBwZXJDYXNlPy4oKSArIHRhYk5hbWU/LnNsaWNlPy4oMSkgfHwgdGFiTmFtZTtcblx0cmV0dXJuIHRhYk5hbWU7XG59O1xudmFyIFJFTU9WRV9JRl9IQVNfU0lNSUxBUiA9IChhcnJheSwgb2xkLCBpZHggPSAtMSwgc3JjT2JqID0gbnVsbCkgPT4ge1xuXHRpZiAoYXJyYXk/LmluZGV4T2Y/LihvbGQpID49IDApIGFycmF5LnNwbGljZShhcnJheS5pbmRleE9mKG9sZCksIDEpO1xuXHRlbHNlIGlmIChpZHggPj0gMCAmJiBpZHggPCBhcnJheT8ubGVuZ3RoKSBhcnJheS5zcGxpY2UoaWR4LCAxKTtcbn07XG52YXIgUkVNT1ZFX0lGX0hBUyA9IChhcnJheSwgaXRlbSkgPT4ge1xuXHRpZiAoYXJyYXk/LmluZGV4T2Y/LihpdGVtKSA+PSAwKSBhcnJheS5zcGxpY2UoYXJyYXkuaW5kZXhPZihpdGVtKSwgMSk7XG59O1xudmFyIFBVU0hfT05DRSA9IChhcnJheSwgaXRlbSkgPT4ge1xuXHRpZiAoYXJyYXk/LmluZGV4T2Y/LihpdGVtKSA8IDApIGFycmF5LnB1c2goaXRlbSk7XG59O1xudmFyIFNQTElDRV9JTlRPX09OQ0UgPSAoYXJyYXksIGl0ZW0sIGluZGV4ID0gLTEpID0+IHtcblx0aWYgKHR5cGVvZiBpbmRleCAhPSBcIm51bWJlclwiIHx8IGluZGV4IDwgMCB8fCBpbmRleCA+PSBhcnJheT8ubGVuZ3RoKSBQVVNIX09OQ0UoYXJyYXksIGl0ZW0pO1xuXHRlbHNlIGlmICh0eXBlb2YgaW5kZXggPT0gXCJudW1iZXJcIiAmJiBhcnJheT8uaW5kZXhPZj8uKGl0ZW0pIDwgMCkgYXJyYXkuc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcbn07XG52YXIgY2FjaGVkUGVyRmlsZSA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIGNhY2hlZFBlckZpbGVOYW1lID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbnZhciBHRVRfT1JfQ0FDSEUgPSBhc3luYyAoZmlsZSkgPT4ge1xuXHR0cnkge1xuXHRcdGZpbGUgPSBhd2FpdCBmaWxlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0ZmlsZSA9IG51bGw7XG5cdFx0Y29uc29sZS53YXJuKGUpO1xuXHR9XG5cdGlmIChmaWxlID09IG51bGwpIHJldHVybiBudWxsO1xuXHRpZiAoY2FjaGVkUGVyRmlsZS5oYXMoZmlsZSkpIHJldHVybiBjYWNoZWRQZXJGaWxlLmdldChmaWxlKTtcblx0aWYgKGZpbGU/LnR5cGUgIT0gXCJhcHBsaWNhdGlvbi9qc29uXCIpIHJldHVybiBjYWNoZWRQZXJGaWxlLmdldChmaWxlKTtcblx0Y29uc3QgcmF3ID0gYXdhaXQgZmlsZT8udGV4dD8uKCk/LmNhdGNoPy4oY29uc29sZS53YXJuLmJpbmQoY29uc29sZSkpIHx8IFwie31cIjtcblx0bGV0IG9iaiA9IHt9O1xuXHR0cnkge1xuXHRcdG9iaiA9IEpTT04ucGFyc2UocmF3KTtcblx0fSBjYXRjaCAoXykge1xuXHRcdHRyeSB7XG5cdFx0XHRvYmogPSBKU09OLnBhcnNlKHJhdyk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGUpO1xuXHRcdH1cblx0fVxuXHRpZiAoZmlsZSkgY2FjaGVkUGVyRmlsZS5zZXQoZmlsZSwgb2JqKTtcblx0cmV0dXJuIG9iajtcbn07XG52YXIgR0VUX09SX0NBQ0hFX0JZX05BTUUgPSBhc3luYyAoZmlsZU5hbWUsIGZpbGUpID0+IHtcblx0dHJ5IHtcblx0XHRmaWxlID0gYXdhaXQgZmlsZTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGZpbGUgPSBudWxsO1xuXHRcdGNvbnNvbGUud2FybihlKTtcblx0fVxuXHRpZiAoZmlsZU5hbWUgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cdGlmIChjYWNoZWRQZXJGaWxlTmFtZS5oYXMoZmlsZU5hbWUpKSByZXR1cm4gY2FjaGVkUGVyRmlsZU5hbWUuZ2V0KGZpbGVOYW1lKTtcblx0Y29uc3Qgb2JqID0gZmlsZSAhPSBudWxsID8gYXdhaXQgR0VUX09SX0NBQ0hFKGZpbGUpIDogY2FjaGVkUGVyRmlsZU5hbWU/LmdldChmaWxlTmFtZSk7XG5cdGlmIChmaWxlTmFtZSkgY2FjaGVkUGVyRmlsZU5hbWUuc2V0KGZpbGVOYW1lLCBvYmopO1xuXHRyZXR1cm4gb2JqO1xufTtcbnZhciBtZXJnZUJ5RXhpc3RzID0gKGRhdGFSZWYsIHJlZnMpID0+IHtcblx0Y29uc3QgZGF0YU1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdGRhdGFSZWYuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcblx0XHRpZiAoaXRlbT8ubmFtZSkgZGF0YU1hcC5zZXQoaXRlbS5uYW1lLCB7XG5cdFx0XHRpdGVtLFxuXHRcdFx0aW5kZXhcblx0XHR9KTtcblx0fSk7XG5cdGNvbnN0IHJlZnNNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRyZWZzLmZvckVhY2goKHJlZikgPT4ge1xuXHRcdGlmIChyZWY/Lm5hbWUpIHJlZnNNYXAuc2V0KHJlZi5uYW1lLCByZWYpO1xuXHR9KTtcblx0Zm9yIChjb25zdCBbbmFtZSwgeyBpbmRleCB9XSBvZiBkYXRhTWFwKSB7XG5cdFx0Y29uc3QgcmVmID0gcmVmc01hcC5nZXQobmFtZSk7XG5cdFx0aWYgKHJlZikgZGF0YVJlZltpbmRleF0gPSByZWY7XG5cdH1cblx0Zm9yIChjb25zdCBbbmFtZSwgcmVmXSBvZiByZWZzTWFwKSBpZiAoIWRhdGFNYXAuaGFzKG5hbWUpKSBkYXRhUmVmLnB1c2gocmVmKTtcblx0Zm9yIChsZXQgaSA9IGRhdGFSZWYubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRjb25zdCBpdGVtID0gZGF0YVJlZltpXTtcblx0XHRpZiAoaXRlbT8ubmFtZSAmJiAhcmVmc01hcC5oYXMoaXRlbS5uYW1lKSkgZGF0YVJlZi5zcGxpY2UoaSwgMSk7XG5cdH1cblx0ZGF0YVJlZi5zb3J0KChhLCBiKSA9PiBhPy5uYW1lPy5sb2NhbGVDb21wYXJlPy4oYj8ubmFtZSA/PyBcIlwiKSk7XG5cdHJldHVybiBkYXRhUmVmO1xufTtcblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3V0aWxzL1Bob25lLnRzXG52YXIgUEhPTkVfQ0FORElEQVRFX1JFID0gL1xcKz9cXGRbXFxkXFxzKCkuXFwtXXs0LH1cXGQvZztcbnZhciBFWFRfQ1VUX1JFID0gLyjQtNC+0LFcXC4/fNC00L7Qv1xcLj98ZXh0XFwuP3xleHRlbnNpb24pXFxzKls6I1xcLXhdKlxccypcXGQrLiovaTtcbnZhciBERUZBVUxUX09QVElPTlMgPSB7XG5cdGRlZmF1bHRUcnVuazogXCI4XCIsXG5cdGNvdW50cnlDb2RlOiBcIjdcIixcblx0Y2l0eUNvZGU6IG51bGwsXG5cdHN0cmlwRXh0ZW5zaW9uczogdHJ1ZSxcblx0bWluTG9jYWw6IDUsXG5cdG1heExvY2FsOiA3XG59O1xudmFyIG5vcm1hbGl6ZU9uZSA9IChpbnB1dCwgb3B0aW9ucyA9IHt9KSA9PiB7XG5cdGlmIChpbnB1dCA9PSBudWxsKSByZXR1cm4gbnVsbDtcblx0Y29uc3Qgb3B0cyA9IHtcblx0XHQuLi5ERUZBVUxUX09QVElPTlMsXG5cdFx0Li4ub3B0aW9uc1xuXHR9O1xuXHRsZXQgcyA9IFN0cmluZyhpbnB1dCkudHJpbSgpO1xuXHRpZiAoIXMpIHJldHVybiBudWxsO1xuXHRpZiAob3B0cy5zdHJpcEV4dGVuc2lvbnMpIHMgPSBzLnJlcGxhY2UoRVhUX0NVVF9SRSwgXCJcIik7XG5cdGNvbnN0IGhhc1BsdXNJblN0YXJ0ID0gL15cXCsvLnRlc3Qocyk7XG5cdGxldCBkaWdpdHMgPSBzLnJlcGxhY2UoL1xcRC9nLCBcIlwiKTtcblx0aWYgKCFkaWdpdHMpIHJldHVybiBudWxsO1xuXHRpZiAoaGFzUGx1c0luU3RhcnQgJiYgZGlnaXRzLnN0YXJ0c1dpdGgob3B0cy5jb3VudHJ5Q29kZSkpIGRpZ2l0cyA9IG9wdHMuZGVmYXVsdFRydW5rICsgZGlnaXRzLnNsaWNlKG9wdHMuY291bnRyeUNvZGUubGVuZ3RoKTtcblx0ZWxzZSBpZiAoZGlnaXRzLmxlbmd0aCA9PT0gMTEgJiYgZGlnaXRzLnN0YXJ0c1dpdGgob3B0cy5jb3VudHJ5Q29kZSkpIGRpZ2l0cyA9IG9wdHMuZGVmYXVsdFRydW5rICsgZGlnaXRzLnNsaWNlKDEpO1xuXHRlbHNlIGlmIChkaWdpdHMubGVuZ3RoID09PSAxMCkgZGlnaXRzID0gb3B0cy5kZWZhdWx0VHJ1bmsgKyBkaWdpdHM7XG5cdGVsc2UgaWYgKG9wdHMuY2l0eUNvZGUgJiYgZGlnaXRzLmxlbmd0aCA+PSBvcHRzLm1pbkxvY2FsICYmIGRpZ2l0cy5sZW5ndGggPD0gb3B0cy5tYXhMb2NhbCkgZGlnaXRzID0gb3B0cy5kZWZhdWx0VHJ1bmsgKyBvcHRzLmNpdHlDb2RlICsgZGlnaXRzO1xuXHRlbHNlIGlmIChkaWdpdHMubGVuZ3RoID09PSAxMSAmJiBkaWdpdHMuc3RhcnRzV2l0aChvcHRzLmRlZmF1bHRUcnVuaykpIHt9IGVsc2UgaWYgKG9wdHMuY2l0eUNvZGUgJiYgZGlnaXRzLmxlbmd0aCA9PT0gb3B0cy5jaXR5Q29kZS5sZW5ndGggKyA3KSBkaWdpdHMgPSBvcHRzLmRlZmF1bHRUcnVuayArIGRpZ2l0cztcblx0ZWxzZSByZXR1cm4gbnVsbDtcblx0cmV0dXJuIC9eXFxkezExfSQvLnRlc3QoZGlnaXRzKSA/IGRpZ2l0cyA6IG51bGw7XG59O1xudmFyIHNwbGl0Q2FuZGlkYXRlcyA9ICh2YWx1ZSkgPT4ge1xuXHRpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIFtdO1xuXHRjb25zdCBzID0gU3RyaW5nKHZhbHVlKTtcblx0Y29uc3QgbWF0Y2hlcyA9IHMubWF0Y2goUEhPTkVfQ0FORElEQVRFX1JFKTtcblx0aWYgKG1hdGNoZXM/Lmxlbmd0aCkgcmV0dXJuIG1hdGNoZXM7XG5cdHJldHVybiBzLnNwbGl0KC9bOywvfF0rLykubWFwKCh4KSA9PiB4LnRyaW0oKSkuZmlsdGVyKEJvb2xlYW4pO1xufTtcbnZhciBub3JtYWxpemVQaG9uZXMgPSAodmFsdWUsIG9wdGlvbnMgPSB7fSkgPT4ge1xuXHRjb25zdCBvdXQgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuXHRpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIGZvciAoY29uc3QgdiBvZiB2YWx1ZSkgaWYgKHR5cGVvZiB2ID09PSBcInN0cmluZ1wiKSBmb3IgKGNvbnN0IGNhbmQgb2Ygc3BsaXRDYW5kaWRhdGVzKHYpKSB7XG5cdFx0Y29uc3QgbiA9IG5vcm1hbGl6ZU9uZShjYW5kLCBvcHRpb25zKTtcblx0XHRpZiAobikgb3V0LmFkZChuKTtcblx0fVxuXHRlbHNlIHtcblx0XHRjb25zdCBuID0gbm9ybWFsaXplT25lKHYsIG9wdGlvbnMpO1xuXHRcdGlmIChuKSBvdXQuYWRkKG4pO1xuXHR9XG5cdGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikgZm9yIChjb25zdCBjIG9mIHNwbGl0Q2FuZGlkYXRlcyh2YWx1ZSkpIHtcblx0XHRjb25zdCBuID0gbm9ybWFsaXplT25lKGMsIG9wdGlvbnMpO1xuXHRcdGlmIChuKSBvdXQuYWRkKG4pO1xuXHR9XG5cdGVsc2Uge1xuXHRcdGNvbnN0IG4gPSBub3JtYWxpemVPbmUodmFsdWUsIG9wdGlvbnMpO1xuXHRcdGlmIChuKSBvdXQuYWRkKG4pO1xuXHR9XG5cdHJldHVybiBbLi4ub3V0XTtcbn07XG52YXIgZ2V0SW5kZXhGb3JSb3cgPSAocm93LCBwb3MpID0+IHtcblx0aWYgKEFycmF5LmlzQXJyYXkocm93KSAmJiB0eXBlb2Ygcm93WzFdID09PSBcIm51bWJlclwiKSByZXR1cm4gcm93WzFdO1xuXHRpZiAocm93ICYmIHR5cGVvZiByb3cgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHJvdy5pbmRleCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHJvdy5pbmRleDtcblx0cmV0dXJuIHBvcztcbn07XG52YXIgZ2V0UGhvbmVzRnJvbVJvdyA9IChyb3cpID0+IHtcblx0aWYgKEFycmF5LmlzQXJyYXkocm93KSkgcmV0dXJuIHJvd1swXTtcblx0aWYgKHJvdyAmJiB0eXBlb2Ygcm93ID09PSBcIm9iamVjdFwiKSB7XG5cdFx0aWYgKFwicGhvbmVzXCIgaW4gcm93KSByZXR1cm4gcm93LnBob25lcztcblx0XHRpZiAoXCJwaG9uZVwiIGluIHJvdykgcmV0dXJuIHJvdy5waG9uZTtcblx0fVxuXHRyZXR1cm4gcm93O1xufTtcbmZ1bmN0aW9uIGZpbmREdXBsaWNhdGVQaG9uZXMocm93cywgdXNlck9wdGlvbnMgPSB7fSkge1xuXHRjb25zdCBvcHRpb25zID0ge1xuXHRcdC4uLkRFRkFVTFRfT1BUSU9OUyxcblx0XHQuLi51c2VyT3B0aW9uc1xuXHR9O1xuXHRjb25zdCBudW1iZXJUb0luZGljZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRjb25zdCBpbmRleFRvTnVtYmVyc0FsbCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdHJvd3MuZm9yRWFjaCgocm93LCBwb3MpID0+IHtcblx0XHRjb25zdCBpZHggPSBnZXRJbmRleEZvclJvdyhyb3csIHBvcyk7XG5cdFx0Y29uc3QgcGhvbmVzUmF3ID0gZ2V0UGhvbmVzRnJvbVJvdyhyb3cpO1xuXHRcdGNvbnN0IHBob25lcyA9IG5vcm1hbGl6ZVBob25lcyhwaG9uZXNSYXcsIG9wdGlvbnMpO1xuXHRcdGlmICghaW5kZXhUb051bWJlcnNBbGwuaGFzKGlkeCkpIGluZGV4VG9OdW1iZXJzQWxsLnNldChpZHgsIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpO1xuXHRcdGNvbnN0IHNldEZvckluZGV4ID0gaW5kZXhUb051bWJlcnNBbGwuZ2V0KGlkeCk7XG5cdFx0Zm9yIChjb25zdCBwIG9mIHBob25lcykge1xuXHRcdFx0c2V0Rm9ySW5kZXguYWRkKHApO1xuXHRcdFx0aWYgKCFudW1iZXJUb0luZGljZXMuaGFzKHApKSBudW1iZXJUb0luZGljZXMuc2V0KHAsIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpO1xuXHRcdFx0bnVtYmVyVG9JbmRpY2VzLmdldChwKS5hZGQoaWR4KTtcblx0XHR9XG5cdH0pO1xuXHRjb25zdCBkdXBsaWNhdGVzQnlOdW1iZXIgPSB7fTtcblx0Zm9yIChjb25zdCBbbnVtLCBzZXRdIG9mIG51bWJlclRvSW5kaWNlcy5lbnRyaWVzKCkpIGlmIChzZXQuc2l6ZSA+IDEpIGR1cGxpY2F0ZXNCeU51bWJlcltudW1dID0gWy4uLnNldF0uc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuXHRjb25zdCBkdXBsaWNhdGVzQnlJbmRleCA9IHt9O1xuXHRmb3IgKGNvbnN0IFtpZHgsIHNldF0gb2YgaW5kZXhUb051bWJlcnNBbGwuZW50cmllcygpKSB7XG5cdFx0Y29uc3QgZHVwcyA9IFsuLi5zZXRdLmZpbHRlcigobikgPT4gZHVwbGljYXRlc0J5TnVtYmVyW25dKTtcblx0XHRpZiAoZHVwcy5sZW5ndGgpIGR1cGxpY2F0ZXNCeUluZGV4W2lkeF0gPSBkdXBzLnNvcnQoKTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdGR1cGxpY2F0ZXNCeU51bWJlcixcblx0XHRwYWlyczogT2JqZWN0LmVudHJpZXMoZHVwbGljYXRlc0J5SW5kZXgpLm1hcCgoW2lkeCwgbnVtc10pID0+IFtOdW1iZXIoaWR4KSwgbnVtc10pLnNvcnQoKGEsIGIpID0+IGFbMF0gLSBiWzBdKSxcblx0XHRkdXBsaWNhdGVzQnlJbmRleCxcblx0XHRub3JtYWxpemU6IChzKSA9PiBub3JtYWxpemVPbmUocywgb3B0aW9ucylcblx0fTtcbn1cblxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3V0aWxzL1RpbWUudHNcbnZhciBnZXRUaW1lWm9uZSA9ICgpID0+IHtcblx0cmV0dXJuIEludGwuRGF0ZVRpbWVGb3JtYXQoKS5yZXNvbHZlZE9wdGlvbnMoKS50aW1lWm9uZTtcbn07XG5mdW5jdGlvbiBpc1B1cmVISE1NKHN0cikge1xuXHRpZiAoIXN0cikgcmV0dXJuIGZhbHNlO1xuXHRyZXR1cm4gL14oWzAxXVxcZHwyWzAtM10pOihbMC01XVxcZCkkLy50ZXN0KFN0cmluZyhzdHIpLnRyaW0oKSk7XG59XG5mdW5jdGlvbiBwYXJzZURhdGVDb3JyZWN0bHkoc3RyKSB7XG5cdGlmICghc3RyKSByZXR1cm4gLyogQF9fUFVSRV9fICovIG5ldyBEYXRlKCk7XG5cdGlmIChzdHIgaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gbmV3IERhdGUoc3RyKTtcblx0aWYgKHR5cGVvZiBzdHIgPT0gXCJvYmplY3RcIiAmJiBzdHI/LnRpbWVzdGFtcCkgcmV0dXJuIHBhcnNlRGF0ZUNvcnJlY3RseShzdHIudGltZXN0YW1wKTtcblx0aWYgKHR5cGVvZiBzdHIgPT0gXCJvYmplY3RcIiAmJiBzdHI/Lmlzb19kYXRlKSByZXR1cm4gcGFyc2VEYXRlQ29ycmVjdGx5KHN0ci5pc29fZGF0ZSk7XG5cdGlmICh0eXBlb2Ygc3RyID09IFwib2JqZWN0XCIgJiYgc3RyPy5kYXRlKSByZXR1cm4gcGFyc2VEYXRlQ29ycmVjdGx5KHN0ci5kYXRlKTtcblx0aWYgKHR5cGVvZiBzdHIgPT0gXCJudW1iZXJcIikge1xuXHRcdGlmIChzdHIgPj0gMHhlOGQ0YTUxMDAwKSByZXR1cm4gbmV3IERhdGUoc3RyKTtcblx0XHRjb25zdCBtdWx0aXBsaWVyID0gTWF0aC5wb3coMTAsIDExIC0gKFN0cmluZyhzdHIgfCAwKT8ubGVuZ3RoIHx8IDExKSkgfCAwO1xuXHRcdHJldHVybiBuZXcgRGF0ZShzdHIgKiBtdWx0aXBsaWVyKTtcblx0fVxuXHRpZiAodHlwZW9mIHN0ciA9PSBcInN0cmluZ1wiICYmIGlzUHVyZUhITU0oc3RyKSkge1xuXHRcdGNvbnN0IG0gPSAvXihbMDFdXFxkfDJbMC0zXSk6KFswLTVdXFxkKSQvLmV4ZWMoc3RyLnRyaW0oKSk7XG5cdFx0aWYgKCFtKSByZXR1cm4gLyogQF9fUFVSRV9fICovIG5ldyBEYXRlKCk7XG5cdFx0Y29uc3QgWywgaGgsIG1tXSA9IG07XG5cdFx0Y29uc3Qgbm93ID0gLyogQF9fUFVSRV9fICovIG5ldyBEYXRlKCk7XG5cdFx0cmV0dXJuIG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCBub3cuZ2V0TW9udGgoKSwgbm93LmdldERhdGUoKSwgTnVtYmVyKGhoKSwgTnVtYmVyKG1tKSwgMCwgMCk7XG5cdH1cblx0cmV0dXJuIG5ldyBEYXRlKFN0cmluZyhzdHIpKTtcbn1cbmZ1bmN0aW9uIHBhcnNlQW5kR2V0Q29ycmVjdFRpbWUoc3RyKSB7XG5cdGlmICghc3RyKSByZXR1cm4gRGF0ZS5ub3coKTtcblx0aWYgKHR5cGVvZiBzdHIgPT0gXCJudW1iZXJcIikge1xuXHRcdGlmIChzdHIgPj0gMHhlOGQ0YTUxMDAwKSByZXR1cm4gc3RyO1xuXHRcdHJldHVybiBzdHIgKiAoTWF0aC5wb3coMTAsIDExIC0gKFN0cmluZyhzdHIgfCAwKT8ubGVuZ3RoIHx8IDExKSkgfCAwKTtcblx0fVxuXHRpZiAoc3RyIGluc3RhbmNlb2YgRGF0ZSkgcmV0dXJuIHN0ci5nZXRUaW1lKCk7XG5cdHJldHVybiBwYXJzZURhdGVDb3JyZWN0bHkoc3RyKT8uZ2V0VGltZT8uKCkgPz8gRGF0ZS5ub3coKTtcbn1cbnZhciBnZXRJU09XZWVrTnVtYmVyID0gKGlucHV0KSA9PiB7XG5cdGlmICghaW5wdXQpIHJldHVybiBudWxsO1xuXHRjb25zdCB0YXJnZXQgPSBuZXcgRGF0ZShEYXRlLlVUQyhpbnB1dC5nZXRGdWxsWWVhcigpLCBpbnB1dC5nZXRNb250aCgpLCBpbnB1dC5nZXREYXRlKCkpKTtcblx0Y29uc3QgZGF5TnVtYmVyID0gdGFyZ2V0LmdldFVUQ0RheSgpIHx8IDc7XG5cdHRhcmdldC5zZXRVVENEYXRlKHRhcmdldC5nZXRVVENEYXRlKCkgKyA0IC0gZGF5TnVtYmVyKTtcblx0Y29uc3QgeWVhclN0YXJ0ID0gbmV3IERhdGUoRGF0ZS5VVEModGFyZ2V0LmdldFVUQ0Z1bGxZZWFyKCksIDAsIDEpKTtcblx0cmV0dXJuIE1hdGguY2VpbCgoKHRhcmdldC5nZXRUaW1lKCkgLSB5ZWFyU3RhcnQuZ2V0VGltZSgpKSAvIDg2NGU1ICsgMSkgLyA3KTtcbn07XG52YXIgbm9ybWFsaXplU2NoZWR1bGUgPSAodmFsdWUpID0+IHtcblx0aWYgKCF2YWx1ZSkgcmV0dXJuIG51bGw7XG5cdGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgKHZhbHVlLmRhdGUgfHwgdmFsdWUuaXNvX2RhdGUgfHwgdmFsdWUudGltZXN0YW1wKSkgcmV0dXJuIHZhbHVlO1xuXHRyZXR1cm4geyBpc29fZGF0ZTogU3RyaW5nKHZhbHVlKSB9O1xufTtcbnZhciBmb3JtYXRBc1RpbWUgPSAodGltZSkgPT4ge1xuXHRjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplU2NoZWR1bGUodGltZSk7XG5cdGlmICghbm9ybWFsaXplZCkgcmV0dXJuIFwiXCI7XG5cdHJldHVybiBwYXJzZURhdGVDb3JyZWN0bHkobm9ybWFsaXplZCk/LnRvTG9jYWxlVGltZVN0cmluZz8uKFwiZW4tR0JcIiwge1xuXHRcdGhvdXI6IFwiMi1kaWdpdFwiLFxuXHRcdG1pbnV0ZTogXCIyLWRpZ2l0XCIsXG5cdFx0aG91cjEyOiBmYWxzZSxcblx0XHR0aW1lWm9uZTogZ2V0VGltZVpvbmUoKVxuXHR9KSB8fCBcIlwiO1xufTtcbnZhciBmb3JtYXRBc0RhdGUgPSAoZGF0ZSkgPT4ge1xuXHRyZXR1cm4gcGFyc2VEYXRlQ29ycmVjdGx5KGRhdGUpPy50b0xvY2FsZURhdGVTdHJpbmc/LihcImVuLUdCXCIsIHtcblx0XHRkYXk6IFwibnVtZXJpY1wiLFxuXHRcdG1vbnRoOiBcImxvbmdcIixcblx0XHR3ZWVrZGF5OiBcImxvbmdcIixcblx0XHR5ZWFyOiBcIm51bWVyaWNcIixcblx0XHR0aW1lWm9uZTogZ2V0VGltZVpvbmUoKVxuXHR9KSB8fCBcIlwiO1xufTtcbnZhciBmb3JtYXREYXRlVGltZSA9ICh0aW1lc3RhbXApID0+IHtcblx0Y29uc3QgZGF0ZSA9IG5ldyBEYXRlKHRpbWVzdGFtcCk7XG5cdGlmIChOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSByZXR1cm4gXCJcIjtcblx0cmV0dXJuIGRhdGUudG9Mb2NhbGVTdHJpbmcodm9pZCAwLCB7XG5cdFx0eWVhcjogXCJudW1lcmljXCIsXG5cdFx0bW9udGg6IFwic2hvcnRcIixcblx0XHRkYXk6IFwiMi1kaWdpdFwiLFxuXHRcdGhvdXI6IFwiMi1kaWdpdFwiLFxuXHRcdG1pbnV0ZTogXCIyLWRpZ2l0XCJcblx0fSk7XG59O1xudmFyIGdldENvbXBhcmFibGVUaW1lVmFsdWUgPSAodmFsdWUpID0+IHtcblx0aWYgKHZhbHVlID09IG51bGwpIHJldHVybiBOYU47XG5cdGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgJiYgTnVtYmVyLmlzRmluaXRlKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuXHRjb25zdCBkYXRlID0gcGFyc2VEYXRlQ29ycmVjdGx5KHZhbHVlKTtcblx0aWYgKGRhdGUgJiYgIU51bWJlci5pc05hTihkYXRlPy5nZXRUaW1lKCkpKSByZXR1cm4gZGF0ZT8uZ2V0VGltZSgpID8/IDA7XG5cdGNvbnN0IG1hdGNoID0gU3RyaW5nKHZhbHVlKS5tYXRjaCgvXihcXGR7MSwyfSkoPzo6KFxcZHsyfSkpPyg/OjooXFxkezJ9KSk/Lyk7XG5cdGlmIChtYXRjaCkge1xuXHRcdGNvbnN0IGhvdXJzID0gTnVtYmVyKG1hdGNoWzFdKSB8fCAwO1xuXHRcdGNvbnN0IG1pbnV0ZXMgPSBOdW1iZXIobWF0Y2hbMl0pIHx8IDA7XG5cdFx0Y29uc3Qgc2Vjb25kcyA9IE51bWJlcihtYXRjaFszXSkgfHwgMDtcblx0XHRyZXR1cm4gKChob3VycyAqIDYwICsgbWludXRlcykgKiA2MCArIHNlY29uZHMpICogMWUzO1xuXHR9XG5cdGNvbnN0IG51bWVyaWMgPSBOdW1iZXIodmFsdWUpO1xuXHRyZXR1cm4gTnVtYmVyLmlzRmluaXRlKG51bWVyaWMpID8gbnVtZXJpYyA6IE5hTjtcbn07XG52YXIgaXNEYXRlID0gKGRhdGUpID0+IHtcblx0Y29uc3QgZmlyc3RTdGVwID0gZGF0ZSBpbnN0YW5jZW9mIERhdGUgfHwgdHlwZW9mIGRhdGUgPT0gXCJzdHJpbmdcIiAmJiBkYXRlLm1hdGNoKC9eXFxkezR9LVxcZHsyfS1cXGR7Mn0kLyk7XG5cdGxldCBzZWNvbmRTdGVwID0gZmFsc2U7XG5cdHRyeSB7XG5cdFx0c2Vjb25kU3RlcCA9IGdldENvbXBhcmFibGVUaW1lVmFsdWUoZGF0ZSkgPiAwO1xuXHR9IGNhdGNoIHtcblx0XHRzZWNvbmRTdGVwID0gZmFsc2U7XG5cdH1cblx0cmV0dXJuIEJvb2xlYW4oKGZpcnN0U3RlcCAmJiBzZWNvbmRTdGVwKSA/PyBmYWxzZSk7XG59O1xudmFyIGNoZWNrSW5UaW1lUmFuZ2UgPSAoYmVnaW5UaW1lLCBlbmRUaW1lLCBjdXJyZW50VGltZSkgPT4ge1xuXHRpZiAoYmVnaW5UaW1lICYmIGVuZFRpbWUpIHJldHVybiBnZXRDb21wYXJhYmxlVGltZVZhbHVlKGJlZ2luVGltZSkgPCBnZXRDb21wYXJhYmxlVGltZVZhbHVlKGN1cnJlbnRUaW1lKSAmJiBnZXRDb21wYXJhYmxlVGltZVZhbHVlKGN1cnJlbnRUaW1lKSA8IGdldENvbXBhcmFibGVUaW1lVmFsdWUoZW5kVGltZSk7XG5cdGlmIChiZWdpblRpbWUpIHJldHVybiBnZXRDb21wYXJhYmxlVGltZVZhbHVlKGJlZ2luVGltZSkgPCBnZXRDb21wYXJhYmxlVGltZVZhbHVlKGN1cnJlbnRUaW1lKTtcblx0aWYgKGVuZFRpbWUpIHJldHVybiBnZXRDb21wYXJhYmxlVGltZVZhbHVlKGN1cnJlbnRUaW1lKSA8IGdldENvbXBhcmFibGVUaW1lVmFsdWUoZW5kVGltZSk7XG5cdHJldHVybiBmYWxzZTtcbn07XG52YXIgY2hlY2tSZW1haW5zVGltZSA9IChiZWdpblRpbWUsIGVuZFRpbWUsIGN1cnJlbnRUaW1lLCBtYXhEYXlzID0gNykgPT4ge1xuXHRsZXQgZmFjdG9yTWFza2VkID0gdHJ1ZTtcblx0aWYgKGJlZ2luVGltZSkgZmFjdG9yTWFza2VkICYmPSBnZXRDb21wYXJhYmxlVGltZVZhbHVlKGN1cnJlbnRUaW1lKSA8PSBnZXRDb21wYXJhYmxlVGltZVZhbHVlKGJlZ2luVGltZSk7XG5cdGlmIChlbmRUaW1lKSBmYWN0b3JNYXNrZWQgJiY9IGdldENvbXBhcmFibGVUaW1lVmFsdWUoY3VycmVudFRpbWUpIDwgZ2V0Q29tcGFyYWJsZVRpbWVWYWx1ZShlbmRUaW1lKTtcblx0aWYgKG1heERheXMpIHtcblx0XHRjb25zdCBkYXRlTGltaXQgPSBnZXRDb21wYXJhYmxlVGltZVZhbHVlKGN1cnJlbnRUaW1lKSArIG1heERheXMgKiAyNCAqIDYwICogNjAgKiAxZTM7XG5cdFx0ZmFjdG9yTWFza2VkICYmPSBnZXRDb21wYXJhYmxlVGltZVZhbHVlKGJlZ2luVGltZSkgPCBnZXRDb21wYXJhYmxlVGltZVZhbHVlKGRhdGVMaW1pdCk7XG5cdH1cblx0cmV0dXJuIGZhY3Rvck1hc2tlZDtcbn07XG52YXIgY29tcHV0ZVRpbWVsaW5lT3JkZXJJbkdlbmVyYWwgPSAodGltZU9mRGF5LCBtaW5UaW1lc3RhbXApID0+IHtcblx0Y29uc3QgZGF5U3RhcnQgPSBnZXRDb21wYXJhYmxlVGltZVZhbHVlKHRpbWVPZkRheSkgfHwgMDtcblx0Y29uc3Qgbm9ybWFsaXplZCA9IChOdW1iZXIuaXNGaW5pdGUoZGF5U3RhcnQpID8gZGF5U3RhcnQgOiAwKSAtIChtaW5UaW1lc3RhbXAgfHwgMCk7XG5cdHJldHVybiBNYXRoLnJvdW5kKG5vcm1hbGl6ZWQgLyA4NjRlNSk7XG59O1xuXG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvdXRpbHMvTWlzYy50c1xuZnVuY3Rpb24gZGVib3VuY2UoZm4sIGRlbGF5KSB7XG5cdGxldCB0aW1lb3V0SWQ7XG5cdHJldHVybiAoLi4uYXJncykgPT4ge1xuXHRcdGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuXHRcdHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4gZm4oLi4uYXJncyksIGRlbGF5KTtcblx0fTtcbn1cbmZ1bmN0aW9uIHRocm90dGxlKGZuLCBsaW1pdCkge1xuXHRsZXQgaW5UaHJvdHRsZSA9IGZhbHNlO1xuXHRyZXR1cm4gKC4uLmFyZ3MpID0+IHtcblx0XHRpZiAoIWluVGhyb3R0bGUpIHtcblx0XHRcdGZuKC4uLmFyZ3MpO1xuXHRcdFx0aW5UaHJvdHRsZSA9IHRydWU7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IGluVGhyb3R0bGUgPSBmYWxzZSwgbGltaXQpO1xuXHRcdH1cblx0fTtcbn1cbmZ1bmN0aW9uIHNsZWVwKG1zKSB7XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuZnVuY3Rpb24gdW5pcXVlSWQocHJlZml4ID0gXCJcIikge1xuXHRyZXR1cm4gYCR7cHJlZml4fSR7RGF0ZS5ub3coKS50b1N0cmluZygzNil9XyR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMiwgOSl9YDtcbn1cbmZ1bmN0aW9uIGRlZXBDbG9uZShvYmopIHtcblx0aWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiKSByZXR1cm4gb2JqO1xuXHRpZiAob2JqIGluc3RhbmNlb2YgRGF0ZSkgcmV0dXJuIG5ldyBEYXRlKG9iai5nZXRUaW1lKCkpO1xuXHRpZiAob2JqIGluc3RhbmNlb2YgQXJyYXkpIHJldHVybiBvYmoubWFwKChpdGVtKSA9PiBkZWVwQ2xvbmUoaXRlbSkpO1xuXHRpZiAob2JqIGluc3RhbmNlb2YgT2JqZWN0KSB7XG5cdFx0Y29uc3QgY2xvbmVkID0ge307XG5cdFx0Zm9yIChjb25zdCBrZXkgaW4gb2JqKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgY2xvbmVkW2tleV0gPSBkZWVwQ2xvbmUob2JqW2tleV0pO1xuXHRcdHJldHVybiBjbG9uZWQ7XG5cdH1cblx0cmV0dXJuIG9iajtcbn1cbmZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcblx0aWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB2b2lkIDApIHJldHVybiB0cnVlO1xuXHRpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSByZXR1cm4gdmFsdWUudHJpbSgpLmxlbmd0aCA9PT0gMDtcblx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSByZXR1cm4gdmFsdWUubGVuZ3RoID09PSAwO1xuXHRpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSByZXR1cm4gT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA9PT0gMDtcblx0cmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNCcm93c2VyKCkge1xuXHRyZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCI7XG59XG5mdW5jdGlvbiBpc1dvcmtlcigpIHtcblx0cmV0dXJuIHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCI7XG59XG5cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9pbmRleC50c1xuaW5zdGFsbERvbUNvbnN0cnVjdG9yUG9seWZpbGxzKCk7XG5cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgJGF2b2lkVHJpZ2dlciwgJGZ4eSwgJGdldFZhbHVlLCAkc2V0LCAkdHJpZ2dlckxvY2ssIEFzeW5jUXVldWUsIENoYW5uZWxIZWFsdGhNb25pdG9yLCBDaGFubmVsUmVnaXN0cnksIEVYVF9DVVRfUkUsIEdFVF9PUl9DQUNIRSwgR0VUX09SX0NBQ0hFX0JZX05BTUUsIElOVEVHRVJfUkVHRVhQLCBNT1VOVEVEX0ZTX0VWRU5ULCBNT1VOVEVEX0ZTX0hUVFBfUEFUSCwgTU9VTlRFRF9GU19XU19QQVRILCBQSE9ORV9DQU5ESURBVEVfUkUsIFBVU0hfT05DRSwgUHJvbWlzZWQsIFJFTU9WRV9JRl9IQVMsIFJFTU9WRV9JRl9IQVNfU0lNSUxBUiwgU1BMSUNFX0lOVE9fT05DRSwgVVVJRHY0LCBXUmVmLCBhbGxLZXllZCwgYWxsU2V0dGxlZEtleWVkLCBiaW5kQ3R4LCBiaW5kRXZlbnQsIGJpbmRGeCwgYm91bmRDdHgsIGNhY2hlZFBlckZpbGUsIGNhY2hlZFBlckZpbGVOYW1lLCBjYWxsQnlBbGxQcm9wLCBjYWxsQnlQcm9wLCBjYW1lbFRvS2ViYWIsIGNhbkJlSW50ZWdlciwgY2VpbE5lYXJlc3QsIGNoZWNrSW5UaW1lUmFuZ2UsIGNoZWNrUmVtYWluc1RpbWUsIGNsYW1wLCBjbGFtcERpbWVuc2lvbiwgY2xhbXBHcmlkQ2VsbFR1cGxlLCBjbGllbnRTcGFjZUluT3JpZW50Q1gsIGNvbXB1dGVUaW1lbGluZU9yZGVySW5HZW5lcmFsLCBjb25jdXJyZW50TGltaXQsIGNvbnRleHRpZnksIGNvbnZlcnRPcmllbnRQeFRvQ1gsIGNyZWF0ZUNoYW5uZWxQcm94eSwgY3JlYXRlRGVmZXJyZWQsIGNyZWF0ZU1vdW50ZWRGc0lkLCBjdnRfY3NfdG9fb3MsIGN2dF9vc190b19jcywgY3Z0X3JlbF9jc190b19vcywgY3Z0X3JlbF9vc190b19jcywgZGVib3VuY2UsIGRlZXBDbG9uZSwgZGVlcE9wZXJhdGVBbmRDbG9uZSwgZGVmYXVsdEJ5VHlwZSwgZGVyZWYsIGZpbmREdXBsaWNhdGVQaG9uZXMsIGZpeEZ4LCBmbG9vckluQ1gsIGZsb29ySW5PcmllbnRQeCwgZmxvb3JOZWFyZXN0LCBmb3JtYXRBc0RhdGUsIGZvcm1hdEFzVGltZSwgZm9ybWF0RGF0ZVRpbWUsIGdldENvbXBhcmFibGVUaW1lVmFsdWUsIGdldElTT1dlZWtOdW1iZXIsIGdldEluZGV4Rm9yUm93LCBnZXRPckluc2VydCwgZ2V0T3JJbnNlcnRDb21wdXRlZCwgZ2V0UGhvbmVzRnJvbVJvdywgZ2V0UmFuZG9tVmFsdWVzLCBnZXRTcGFuLCBnZXRUaW1lWm9uZSwgZ2V0VmFsdWUsIGdsb2JhbENoYW5uZWxIZWFsdGhNb25pdG9yLCBnbG9iYWxDaGFubmVsUmVnaXN0cnksIGdyaWRJdGVtc0FzQXJyYXksIGhhbmRsZUxpc3RlbmVycywgaGFzUGVuZGluZ1Byb21pc2VzLCBoYXNQcm9wZXJ0eSwgaGFzVmFsdWUsIGluUHJveHksIGlzQXJyYXlJbnZhbGlkS2V5LCBpc0FycmF5T3JJdGVyYWJsZSwgaXNCcm93c2VyLCBpc0Nhbkp1c3RSZXR1cm4sIGlzQ2FuVHJhbnNmZXIsIGlzRGF0ZSwgaXNFbXB0eSwgaXNIYXNQcmltaXRpdmVzLCBpc0lkYlNjb3BlUGF0aCwgaXNJdGVyYWJsZSwgaXNLZXlUeXBlLCBpc01vdW50ZWRGc1JlcXVlc3QsIGlzTW91bnRlZEZzUmVzcG9uc2UsIGlzTm90Q29tcGxleEFycmF5LCBpc05vdEVxdWFsLCBpc09iamVjdCwgaXNPYmplY3ROb3RFcXVhbCwgaXNPYnNlcnZhYmxlLCBpc1ByaW1pdGl2ZSwgaXNQcm9taXNlLCBpc1B1cmVISE1NLCBpc1JlZiwgaXNTdG9yYWdlU2NvcGVQYXRoLCBpc1N5bWJvbCwgaXNUeXBlZEFycmF5LCBpc1VzZXJTY29wZVBhdGgsIGlzVmFsLCBpc1ZhbGlkTnVtYmVyLCBpc1ZhbGlkT2JqLCBpc1ZhbHVlUmVmLCBpc1ZhbHVlVW5pdCwgaXNXb3JrZXIsIGtlYmFiVG9DYW1lbCwgbWFrZU9yaWVudEluc2V0LCBtYWtlVHJpZ2dlckxlc3MsIG1lcmdlQnlFeGlzdHMsIG1lcmdlQnlLZXksIG5vcm1hbGl6ZUdyaWRMYXlvdXQsIG5vcm1hbGl6ZU9uZSwgbm9ybWFsaXplUGhvbmVzLCBub3JtYWxpemVQcmltaXRpdmUsIG5vcm1hbGl6ZVNjaGVkdWxlLCBvYmplY3RBc3NpZ24sIG9iamVjdEFzc2lnbk5vdEVxdWFsLCBwYXJzZUFuZEdldENvcnJlY3RUaW1lLCBwYXJzZURhdGVDb3JyZWN0bHksIHBhcnNlTW91bnRlZEZzTWVzc2FnZSwgcG90ZW50aWFsbHlBc3luYywgcG90ZW50aWFsbHlBc3luY01hcCwgcmVkaXJlY3RDZWxsLCByZW1vdmVFeHRyYSwgcmVuZGVyVGFiTmFtZSwgcmVzb2x2ZUxvY2FsUG9pbnRUb0dyaWRDZWxsLCByZXNvbHZlZCwgcmV0cnksIHJvdW5kTmVhcmVzdCwgc2xlZXAsIHNwbGl0Q2FuZGlkYXRlcywgc3RvcmFnZVBhdGhDYW5kaWRhdGVzLCBzdHJpcElkYlNjb3BlUHJlZml4LCBzdHJpcFN0b3JhZ2VTY29wZVByZWZpeCwgc3RyaXBVc2VyU2NvcGVQcmVmaXgsIHRocm90dGxlLCB0b0Zpbml0ZU51bWJlciwgdG9SZWYsIHRvVXNlclJlbGF0aXZlUGF0aCwgdG9Vc2VyU2NvcGVQYXRoLCB0cnlQYXJzZUJ5SGludCwgdHJ5U3RyaW5nQXNJbnRlZ2VyLCB0cnlTdHJpbmdBc051bWJlciwgdW5pcXVlSWQsIHVucmVmLCB1bndyYXAsIHVud3JhcEFycmF5LCB1c2VyUGF0aENhbmRpZGF0ZXMsIHZhbHVlQ2xhbXAsIHdpdGhDdHgsIHdpdGhUaW1lb3V0IH07Il0sCiAgIm1hcHBpbmdzIjog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MUIsVUFBTXlhLElBQVMsQ0FBQztBQUNoQixlQUFXeFosS0FBT2pCLEVBQUssQ0FBSSxPQUFPLFVBQVUsZUFBZSxLQUFLQSxHQUFLaUIsQ0FBRyxNQUFHd1osRUFBT3haLENBQUcsSUFBSXVaLEVBQVV4YSxFQUFJaUIsQ0FBRyxDQUFDO0FBQzNHLFdBQU93WjtBQUFBLEVBQ1I7QUFDQSxTQUFPemE7QUFDUjtBQUNBLFNBQVMwYSxHQUFReGEsR0FBTztBQUN2QixTQUFJQSxLQUFVLE9BQWlDLEtBQzNDLE9BQU9BLEtBQVUsV0FBaUJBLEVBQU0sS0FBSyxFQUFFLFdBQVcsSUFDMUQsTUFBTSxRQUFRQSxDQUFLLElBQVVBLEVBQU0sV0FBVyxJQUM5QyxPQUFPQSxLQUFVLFdBQWlCLE9BQU8sS0FBS0EsQ0FBSyxFQUFFLFdBQVcsSUFDN0Q7QUFDUjtBQUNBLFNBQVN5YSxLQUFZO0FBQ3BCLFNBQU8sT0FBTyxTQUFXLE9BQWUsT0FBTyxXQUFhO0FBQzdEO0FBQ0EsU0FBU0MsS0FBVztBQUNuQixTQUFPLE9BQU8sT0FBUyxPQUFlLE9BQU8sU0FBVztBQUN6RDtBQUlBdGIsR0FBK0I7IiwKICAibmFtZXMiOiBbImluc3RhbGxEb21Db25zdHJ1Y3RvclBvbHlmaWxscyIsICJnIiwgInN0dWIiLCAiZW5zdXJlIiwgIm5hbWUiLCAiJGZ4eSIsICJpc0hhc1ByaW1pdGl2ZXMiLCAib2JzZXJ2YWJsZSIsICJpc1ByaW1pdGl2ZSIsICJpc09ic2VydmFibGUiLCAib2JqIiwgInRyeVBhcnNlQnlIaW50IiwgInZhbHVlIiwgImhpbnQiLCAiaGFzUHJvcGVydHkiLCAidiIsICJwcm9wIiwgImhhc1ZhbHVlIiwgIiRnZXRWYWx1ZSIsICIkb2JqT3JQbGFpbiIsICJ1bndyYXAiLCAiZmFsbGJhY2siLCAiZGVyZWYiLCAiZml4RngiLCAiZngiLCAiJHNldCIsICJydiIsICJrZXkiLCAidmFsIiwgImdldFJhbmRvbVZhbHVlcyIsICJhcnJheSIsICJ2YWx1ZXMiLCAiaSIsICJ2YWx1ZUNsYW1wIiwgIm1pbiIsICJtYXgiLCAiY2xhbXAiLCAid2l0aEN0eCIsICJ0YXJnZXQiLCAiZ290IiwgIlVVSUR2NCIsICJjIiwgImNhbWVsVG9LZWJhYiIsICJzdHIiLCAia2ViYWJUb0NhbWVsIiwgIl8iLCAiY2hhciIsICJ0b0Zpbml0ZU51bWJlciIsICJudW1iZXIiLCAiY2xhbXBEaW1lbnNpb24iLCAicm91bmROZWFyZXN0IiwgIk4iLCAiZmxvb3JOZWFyZXN0IiwgImNlaWxOZWFyZXN0IiwgImlzVmFsdWVVbml0IiwgImlzVmFsIiwgIm5vcm1hbGl6ZVByaW1pdGl2ZSIsICIkdHJpZ2dlckxvY2siLCAiJGF2b2lkVHJpZ2dlciIsICJyZWYiLCAiY2IiLCAiJHByb3AiLCAicmVzdWx0IiwgInRyeVN0cmluZ0FzTnVtYmVyIiwgIm1hdGNoZXMiLCAidHJpZWRUb1BhcnNlIiwgIklOVEVHRVJfUkVHRVhQIiwgInRyeVN0cmluZ0FzSW50ZWdlciIsICJpc1ZhbGlkTnVtYmVyIiwgImNhbkJlSW50ZWdlciIsICJpc0FycmF5T3JJdGVyYWJsZSIsICJoYW5kbGVMaXN0ZW5lcnMiLCAicm9vdCIsICJmbiIsICJoYW5kbGVycyIsICJ1c3VicyIsICJ1bnN1YiIsICJpc1JlZiIsICJ1bnJlZiIsICJ0b1JlZiIsICJpc1ZhbHVlUmVmIiwgImV4aXN0cyIsICJpc09iamVjdCIsICJnZXRWYWx1ZSIsICJwb3RlbnRpYWxseUFzeW5jIiwgInByb21pc2UiLCAicG90ZW50aWFsbHlBc3luY01hcCIsICJtYWtlVHJpZ2dlckxlc3MiLCAic2VsZiIsICJ1bndyYXBBcnJheSIsICJhcnIiLCAiZWwiLCAiaXNOb3RDb21wbGV4QXJyYXkiLCAiaXNDYW5KdXN0UmV0dXJuIiwgImlzVHlwZWRBcnJheSIsICJpc1N5bWJvbCIsICJzeW0iLCAiaXNQcm9taXNlIiwgImlzQ2FuVHJhbnNmZXIiLCAiZGVmYXVsdEJ5VHlwZSIsICJhIiwgIiRwcm9taXNlIiwgIlNLSVBfS0VZUyIsICJpc1RoZW5hYmxlJDIiLCAic2V0dGxlT25lIiwgInJlYXNvbiIsICJvd25FbnVtZXJhYmxlS2V5cyIsICJkZXNjIiwgImhhc1BlbmRpbmdQcm9taXNlcyIsICJzZWVuIiwgInNlZW5TZXQiLCAiaXRlbSIsICJyZXNvbHZlZERlZXAiLCAibW9kZSIsICJzbG90IiwgIml0ZW1zIiwgInJlY29yZCIsICJyZXNvbHZlZCIsICJjYWxsYmFja09yVmFsdWUiLCAiYXJncyIsICJpc1RoZW5hYmxlJDEiLCAiYWxsS2V5ZWQiLCAicHJvbWlzZXMiLCAiYWxsU2V0dGxlZEtleWVkIiwgImNyZWF0ZURlZmVycmVkIiwgInJlc29sdmUiLCAicmVqZWN0IiwgImlzUmVzb2x2ZWQiLCAiaXNSZWplY3RlZCIsICJyZXMiLCAicmVqIiwgImVycm9yIiwgIkFzeW5jUXVldWUiLCAib3BlcmF0aW9uIiwgIndpdGhUaW1lb3V0IiwgInRpbWVvdXRNcyIsICJ0aW1lb3V0TWVzc2FnZSIsICJwZW5kaW5nIiwgInRpbWVvdXRQcm9taXNlIiwgInJldHJ5IiwgIm1heFJldHJpZXMiLCAiaW5pdGlhbERlbGF5IiwgImJhY2tvZmZNdWx0aXBsaWVyIiwgImxhc3RFcnJvciIsICJhdHRlbXB0IiwgImRlbGF5IiwgImNvbmN1cnJlbnRMaW1pdCIsICJvcGVyYXRpb25zIiwgImxpbWl0IiwgInJlc3VsdHMiLCAiZXhlY3V0aW5nIiwgInAiLCAiQ2hhbm5lbFJlZ2lzdHJ5IiwgImNoYW5uZWwiLCAibGlzdGVuZXJzIiwgImxpc3RlbmVyIiwgImV4aXN0ZWQiLCAiZ2xvYmFsQ2hhbm5lbFJlZ2lzdHJ5IiwgImNyZWF0ZUNoYW5uZWxQcm94eSIsICJtZXRob2RzIiwgInByb3h5IiwgIm1ldGhvZCIsICJDaGFubmVsSGVhbHRoTW9uaXRvciIsICJjaGFubmVsTmFtZSIsICJoZWFsdGhDaGVjayIsICJpbnRlcnZhbE1zIiwgImV4aXN0aW5nSW50ZXJ2YWwiLCAiaW50ZXJ2YWwiLCAiaXNIZWFsdGh5IiwgInN0YXR1cyIsICJnbG9iYWxDaGFubmVsSGVhbHRoTW9uaXRvciIsICJnZXRPckluc2VydCIsICJtYXAiLCAiZGVmYXVsdFZhbHVlIiwgImdldE9ySW5zZXJ0Q29tcHV0ZWQiLCAiY2FsbGJhY2tGdW5jdGlvbiIsICJpc0l0ZXJhYmxlIiwgImlzS2V5VHlwZSIsICJpc1ZhbGlkT2JqIiwgIm1lcmdlQnlLZXkiLCAiZW50cmllcyIsICJJIiwgInJlbW92ZUV4dHJhIiwgImV4RW50cmllcyIsICJrZXlzIiwgImUiLCAiZXhlIiwgImV4Y2x1ZGUiLCAibnciLCAiayIsICJvYmplY3RBc3NpZ24iLCAicmVtb3ZlTm90RXhpc3RzIiwgIm1lcmdlS2V5IiwgIkUiLCAibWVyZ2VPYmoiLCAiaXNOb3RFcXVhbCIsICJLIiwgImJpbmRGeCIsICJib3VuZEN0eCIsICJiaW5kQ3R4IiwgImNhbGxCeVByb3AiLCAiY3R4IiwgImNhbGxCeUFsbFByb3AiLCAiY2FsbElmTm90TnVsbCIsICJpbmRleCIsICJvYmplY3RBc3NpZ25Ob3RFcXVhbCIsICJkc3QiLCAic3JjIiwgImlzT2JqZWN0Tm90RXF1YWwiLCAiYiIsICJib3VuZEN0eFN5bWJvbCIsICJpc0FycmF5SW52YWxpZEtleSIsICJpbnZhbGlkRm9yQXJyYXkiLCAiaW5Qcm94eSIsICJjb250ZXh0aWZ5IiwgInBjIiwgImRlZXBPcGVyYXRlQW5kQ2xvbmUiLCAiJHByZXYiLCAiYmluZEV2ZW50IiwgIm9uIiwgInJlc29sdmVkU3ltYm9sIiwgImhhbmRsZWRTeW1ib2wiLCAicmVzb2x2ZWRNYXAiLCAiaGFuZGxlZE1hcCIsICIkZXh0cmFjdEtleSQiLCAiaXNUaGVuYWJsZSIsICJhY3RXaXRoIiwgInByb21pc2VPclBsYWluIiwgIlByb21pc2VIYW5kbGVyIiwgIiNyZXNvbHZlIiwgIiNyZWplY3QiLCAiZGVzY3JpcHRvciIsICJwcm90byIsICJ1d3AiLCAibmV3VGFyZ2V0IiwgImN0IiwgInJlY2VpdmVyIiwgIiR0bXAiLCAiUHJvbWlzZWQiLCAidGhpc0FyZyIsICJleGlzdHNNYXAiLCAiV2Vha1JlZlByb3h5SGFuZGxlciIsICJ0ZyIsICJfcmVjZWl2ZXIiLCAiV1JlZiIsICJpc1dlYWtSZWYiLCAiaGFuZGxlciIsICJwbSIsICJjdnRfY3NfdG9fb3MiLCAicG9zX2luX2NzIiwgInNpemVfaW5fY3MiLCAib3JfaSIsICJzaXplX2luX29zIiwgInBvc19pbl9zd2FwIiwgImN2dF9vc190b19jcyIsICJwb3NfaW5fb3MiLCAicG9zX2luX2NwIiwgImN2dF9yZWxfY3NfdG9fb3MiLCAicmVsX2luX2NzIiwgInJlbF9pbl9zd2FwIiwgImN2dF9yZWxfb3NfdG9fY3MiLCAicmVsX2luX29zIiwgInJlbF9pbl9jcCIsICJub3JtYWxpemVHcmlkTGF5b3V0IiwgImxheW91dCIsICJvIiwgImNsYW1wR3JpZENlbGxUdXBsZSIsICJjZWxsIiwgImNvbHMiLCAicm93cyIsICJyZXNvbHZlTG9jYWxQb2ludFRvR3JpZENlbGwiLCAibG9jYWxQeCIsICJzaXplIiwgIm9yaWVudCIsICJvcHRpb25zIiwgIkwiLCAidyIsICJoIiwgIm9zQ29vcmQiLCAibm9ybWFsaXplZEFyZ3MiLCAicHJvamVjdGVkIiwgImNvbnZlcnRPcmllbnRQeFRvQ1giLCAibm9ybWFsaXplZENlbGwiLCAicmVkaXJlY3RlZCIsICJyZWRpcmVjdENlbGwiLCAiZ3JpZEl0ZW1zQXNBcnJheSIsICJnZXRTcGFuIiwgImF4IiwgImZhY3RvciIsICIkcHJlQ2VsbCIsICJncmlkQXJncyIsICJpY29ucyIsICJjaGVja0J1c3kiLCAib25lIiwgInByZUNlbGwiLCAiY29sdW1ucyIsICJzdWl0YWJsZSIsICJleGNlZWQiLCAiYnVzeSIsICJjb21wIiwgIm1ha2VPcmllbnRJbnNldCIsICIkb3JpZW50UHgiLCAiYm94SW5QeCIsICJvcmllbnRQeCIsICJncmlkUHhUb0NYIiwgImZsb29ySW5PcmllbnRQeCIsICJpbkJveCIsICJmbG9vckluQ1giLCAiJENYIiwgImNsaWVudFNwYWNlSW5PcmllbnRDWCIsICIkY2xpZW50UHgiLCAiY2xpZW50UHgiLCAib3NTaXplIiwgIm5vcm1hbGl6ZVNsYXNoZXMiLCAiaW5wdXQiLCAiaXNVc2VyU2NvcGVQYXRoIiwgIm5vcm1hbGl6ZWQiLCAic3RyaXBVc2VyU2NvcGVQcmVmaXgiLCAidG9Vc2VyUmVsYXRpdmVQYXRoIiwgInRvVXNlclNjb3BlUGF0aCIsICJ1c2VyUGF0aENhbmRpZGF0ZXMiLCAic3RyaXBwZWQiLCAiaXNJZGJTY29wZVBhdGgiLCAic3RyaXBJZGJTY29wZVByZWZpeCIsICJpc1N0b3JhZ2VTY29wZVBhdGgiLCAic3RyaXBTdG9yYWdlU2NvcGVQcmVmaXgiLCAic3RvcmFnZVBhdGhDYW5kaWRhdGVzIiwgIk1PVU5URURfRlNfRVZFTlQiLCAiTU9VTlRFRF9GU19IVFRQX1BBVEgiLCAiTU9VTlRFRF9GU19XU19QQVRIIiwgImNyZWF0ZU1vdW50ZWRGc0lkIiwgImlzTW91bnRlZEZzUmVxdWVzdCIsICJpc01vdW50ZWRGc1Jlc3BvbnNlIiwgInBhcnNlTW91bnRlZEZzTWVzc2FnZSIsICJyYXciLCAicmVuZGVyVGFiTmFtZSIsICJ0YWJOYW1lIiwgIlJFTU9WRV9JRl9IQVNfU0lNSUxBUiIsICJvbGQiLCAiaWR4IiwgInNyY09iaiIsICJSRU1PVkVfSUZfSEFTIiwgIlBVU0hfT05DRSIsICJTUExJQ0VfSU5UT19PTkNFIiwgImNhY2hlZFBlckZpbGUiLCAiY2FjaGVkUGVyRmlsZU5hbWUiLCAiR0VUX09SX0NBQ0hFIiwgImZpbGUiLCAiR0VUX09SX0NBQ0hFX0JZX05BTUUiLCAiZmlsZU5hbWUiLCAibWVyZ2VCeUV4aXN0cyIsICJkYXRhUmVmIiwgInJlZnMiLCAiZGF0YU1hcCIsICJyZWZzTWFwIiwgIlBIT05FX0NBTkRJREFURV9SRSIsICJFWFRfQ1VUX1JFIiwgIkRFRkFVTFRfT1BUSU9OUyIsICJub3JtYWxpemVPbmUiLCAib3B0cyIsICJzIiwgImhhc1BsdXNJblN0YXJ0IiwgImRpZ2l0cyIsICJzcGxpdENhbmRpZGF0ZXMiLCAieCIsICJub3JtYWxpemVQaG9uZXMiLCAib3V0IiwgImNhbmQiLCAibiIsICJnZXRJbmRleEZvclJvdyIsICJyb3ciLCAicG9zIiwgImdldFBob25lc0Zyb21Sb3ciLCAiZmluZER1cGxpY2F0ZVBob25lcyIsICJ1c2VyT3B0aW9ucyIsICJudW1iZXJUb0luZGljZXMiLCAiaW5kZXhUb051bWJlcnNBbGwiLCAicGhvbmVzUmF3IiwgInBob25lcyIsICJzZXRGb3JJbmRleCIsICJkdXBsaWNhdGVzQnlOdW1iZXIiLCAibnVtIiwgInNldCIsICJkdXBsaWNhdGVzQnlJbmRleCIsICJkdXBzIiwgIm51bXMiLCAiZ2V0VGltZVpvbmUiLCAiaXNQdXJlSEhNTSIsICJwYXJzZURhdGVDb3JyZWN0bHkiLCAibXVsdGlwbGllciIsICJtIiwgImhoIiwgIm1tIiwgIm5vdyIsICJwYXJzZUFuZEdldENvcnJlY3RUaW1lIiwgImdldElTT1dlZWtOdW1iZXIiLCAiZGF5TnVtYmVyIiwgInllYXJTdGFydCIsICJub3JtYWxpemVTY2hlZHVsZSIsICJmb3JtYXRBc1RpbWUiLCAidGltZSIsICJmb3JtYXRBc0RhdGUiLCAiZGF0ZSIsICJmb3JtYXREYXRlVGltZSIsICJ0aW1lc3RhbXAiLCAiZ2V0Q29tcGFyYWJsZVRpbWVWYWx1ZSIsICJtYXRjaCIsICJob3VycyIsICJtaW51dGVzIiwgInNlY29uZHMiLCAibnVtZXJpYyIsICJpc0RhdGUiLCAiZmlyc3RTdGVwIiwgInNlY29uZFN0ZXAiLCAiY2hlY2tJblRpbWVSYW5nZSIsICJiZWdpblRpbWUiLCAiZW5kVGltZSIsICJjdXJyZW50VGltZSIsICJjaGVja1JlbWFpbnNUaW1lIiwgIm1heERheXMiLCAiZmFjdG9yTWFza2VkIiwgImRhdGVMaW1pdCIsICJjb21wdXRlVGltZWxpbmVPcmRlckluR2VuZXJhbCIsICJ0aW1lT2ZEYXkiLCAibWluVGltZXN0YW1wIiwgImRheVN0YXJ0IiwgImRlYm91bmNlIiwgInRpbWVvdXRJZCIsICJ0aHJvdHRsZSIsICJpblRocm90dGxlIiwgInNsZWVwIiwgIm1zIiwgInVuaXF1ZUlkIiwgInByZWZpeCIsICJkZWVwQ2xvbmUiLCAiY2xvbmVkIiwgImlzRW1wdHkiLCAiaXNCcm93c2VyIiwgImlzV29ya2VyIl0KfQo=
