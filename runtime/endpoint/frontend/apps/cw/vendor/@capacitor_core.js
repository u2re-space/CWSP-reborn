import { n as __exportAll } from "../chunks/rolldown-runtime.js";
import { s as withTimeout } from "../fest/core.js";
import { a as normalizeProtocolEnvelope, i as isProtocolEnvelope, r as createProtocolEnvelope } from "../fest/uniform.js";
import { l as getDestinationAliases, u as normalizeDestination } from "../chunks/Names.js";
import { k as stringifyCwspRemoteConnectionV1, n as CWSP_REMOTE_CONFIG_SYNC_CHANNEL, o as appSettingsShellToNativeExtras, s as appSettingsToRemoteConnectionV1, t as AIRPAD_REMOTE_CONFIG_STORAGE_KEY } from "../chunks/airpad-cwsp-client-parity.js";
//#region src/shared/routing/channel/UniformInterop.ts
/**
* Shared interop helpers for CrossWord transport envelopes.
*
* WHY: the main thread, service worker, CRX runtime, and native/worker bridges
* all need the same destination, protocol, and envelope normalization without
* each importing the full `fest/uniform` runtime graph.
*/
var PROTOCOL_ALIASES = {
	"chrome-runtime": "chrome",
	"chrome-tabs": "chrome",
	"chrome-port": "chrome",
	"chrome-external": "chrome",
	"service-worker": "worker",
	"service-worker:http": "worker",
	"service": "worker",
	"sw": "worker",
	"broadcast-channel": "broadcast",
	"broadcastchannel": "broadcast",
	"websocket": "socket",
	"ws": "socket",
	"socket-io": "socket",
	"socketio": "socket"
};
var TRANSPORT_ALIASES = {
	"service": "service-worker",
	"service-worker:http": "service-worker",
	"sw": "service-worker",
	"ws": "websocket",
	"socket": "websocket",
	"socketio": "socket-io",
	"chrome": "chrome-runtime"
};
var PURPOSES = /* @__PURE__ */ new Set([
	"invoke",
	"mail",
	"attach",
	"deliver",
	"defer"
]);
var randomId = () => {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
	return `interop_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};
var normalizePurpose = (value) => {
	const raw = Array.isArray(value) ? value : value ? [value] : ["mail"];
	const deduped = [];
	for (const entry of raw) if (PURPOSES.has(entry) && !deduped.includes(entry)) deduped.push(entry);
	return deduped.length > 0 ? deduped : ["mail"];
};
/**
* Normalize the protocol family advertised in envelopes and bridge packets.
*/
var normalizeInteropProtocolName = (value) => {
	const raw = String(value || "").trim().toLowerCase();
	if (!raw) return "unknown";
	return PROTOCOL_ALIASES[raw] || raw;
};
/**
* Normalize transport hints to one transport taxonomy for diagnostics and docs.
*/
var normalizeInteropTransportName = (value) => {
	const raw = String(value || "").trim().toLowerCase();
	if (!raw) return void 0;
	return TRANSPORT_ALIASES[raw] || raw;
};
/**
* Create one shared envelope shape that can be used by main-thread, SW, and CRX
* adapters before converting to `fest/uniform` runtime objects.
*/
var createInteropEnvelope = (input) => {
	const id = String(input.id || input.uuid || "").trim() || randomId();
	const source = String(input.source || input.sender || input.srcChannel || "interop").trim() || "interop";
	const destination = normalizeDestination(input.destination || input.target);
	const destinations = Array.isArray(input.destinations) && input.destinations.length > 0 ? [...new Set(input.destinations.map((entry) => normalizeDestination(entry)).filter(Boolean))] : destination ? getDestinationAliases(destination) : [];
	const payload = input.payload ?? input.data;
	const timestamp = Number(input.timestamp ?? Date.now()) || Date.now();
	return {
		id,
		uuid: id,
		type: String(input.type || "request"),
		source,
		sender: String(input.sender || source),
		destination: destination || void 0,
		target: destination || void 0,
		contentType: input.contentType ? String(input.contentType) : void 0,
		data: payload,
		payload,
		metadata: {
			timestamp,
			...input.metadata || {}
		},
		purpose: normalizePurpose(input.purpose),
		protocol: normalizeInteropProtocolName(input.protocol),
		transport: normalizeInteropTransportName(input.transport),
		redirect: Boolean(input.redirect),
		flags: { ...input.flags || {} },
		op: String(input.op || (String(input.type || "").startsWith("response:") ? "response" : "deliver")),
		timestamp,
		srcChannel: String(input.srcChannel || source),
		dstChannel: input.dstChannel ?? (destination || void 0),
		destinations,
		ids: {
			byId: source,
			from: source,
			sender: source,
			destinations,
			...input.ids || {}
		},
		urls: Array.isArray(input.urls) ? [...input.urls] : [],
		tokens: Array.isArray(input.tokens) ? [...input.tokens] : [],
		toRoles: Array.isArray(input.toRoles) ? [...input.toRoles] : [],
		tabId: input.tabId,
		frameId: input.frameId,
		status: typeof input.status === "number" ? input.status : void 0,
		result: input.result,
		results: input.results,
		error: input.error
	};
};
/**
* Map an envelope-like payload into the app's unified-message shape.
*/
var toUnifiedInteropMessage = (input) => {
	const envelope = createInteropEnvelope(input);
	return {
		id: envelope.id,
		type: envelope.type,
		source: envelope.source,
		destination: envelope.destination,
		contentType: envelope.contentType,
		data: envelope.data,
		metadata: {
			...envelope.metadata,
			protocol: envelope.protocol,
			transport: envelope.transport,
			sender: envelope.sender,
			srcChannel: envelope.srcChannel,
			dstChannel: envelope.dstChannel,
			destinations: envelope.destinations,
			ids: envelope.ids,
			flags: envelope.flags,
			status: envelope.status,
			error: envelope.error
		}
	};
};
//#endregion
//#region ../../node_modules/@capacitor/core/dist/index.js
/*! Capacitor: https://capacitorjs.com/ - MIT License */
var ExceptionCode;
(function(ExceptionCode) {
	/**
	* API is not implemented.
	*
	* This usually means the API can't be used because it is not implemented for
	* the current platform.
	*/
	ExceptionCode["Unimplemented"] = "UNIMPLEMENTED";
	/**
	* API is not available.
	*
	* This means the API can't be used right now because:
	*   - it is currently missing a prerequisite, such as network connectivity
	*   - it requires a particular platform or browser version
	*/
	ExceptionCode["Unavailable"] = "UNAVAILABLE";
})(ExceptionCode || (ExceptionCode = {}));
var CapacitorException = class extends Error {
	constructor(message, code, data) {
		super(message);
		this.message = message;
		this.code = code;
		this.data = data;
	}
};
var getPlatformId = (win) => {
	var _a, _b;
	if (win === null || win === void 0 ? void 0 : win.androidBridge) return "android";
	else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) return "ios";
	else return "web";
};
var createCapacitor = (win) => {
	const capCustomPlatform = win.CapacitorCustomPlatform || null;
	const cap = win.Capacitor || {};
	const Plugins = cap.Plugins = cap.Plugins || {};
	const getPlatform = () => {
		return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
	};
	const isNativePlatform = () => getPlatform() !== "web";
	const isPluginAvailable = (pluginName) => {
		const plugin = registeredPlugins.get(pluginName);
		if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) return true;
		if (getPluginHeader(pluginName)) return true;
		return false;
	};
	const getPluginHeader = (pluginName) => {
		var _a;
		return (_a = cap.PluginHeaders) === null || _a === void 0 ? void 0 : _a.find((h) => h.name === pluginName);
	};
	const handleError = (err) => win.console.error(err);
	const registeredPlugins = /* @__PURE__ */ new Map();
	const registerPlugin = (pluginName, jsImplementations = {}) => {
		const registeredPlugin = registeredPlugins.get(pluginName);
		if (registeredPlugin) {
			console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
			return registeredPlugin.proxy;
		}
		const platform = getPlatform();
		const pluginHeader = getPluginHeader(pluginName);
		let jsImplementation;
		const loadPluginImplementation = async () => {
			if (!jsImplementation && platform in jsImplementations) jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
			else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
			return jsImplementation;
		};
		const createPluginMethod = (impl, prop) => {
			var _a, _b;
			if (pluginHeader) {
				const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m) => prop === m.name);
				if (methodHeader) if (methodHeader.rtype === "promise") return (options) => cap.nativePromise(pluginName, prop.toString(), options);
				else return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
				else if (impl) return (_a = impl[prop]) === null || _a === void 0 ? void 0 : _a.bind(impl);
			} else if (impl) return (_b = impl[prop]) === null || _b === void 0 ? void 0 : _b.bind(impl);
			else throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
		};
		const createPluginMethodWrapper = (prop) => {
			let remove;
			const wrapper = (...args) => {
				const p = loadPluginImplementation().then((impl) => {
					const fn = createPluginMethod(impl, prop);
					if (fn) {
						const p = fn(...args);
						remove = p === null || p === void 0 ? void 0 : p.remove;
						return p;
					} else throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
				});
				if (prop === "addListener") p.remove = async () => remove();
				return p;
			};
			wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
			Object.defineProperty(wrapper, "name", {
				value: prop,
				writable: false,
				configurable: false
			});
			return wrapper;
		};
		const addListener = createPluginMethodWrapper("addListener");
		const removeListener = createPluginMethodWrapper("removeListener");
		const addListenerNative = (eventName, callback) => {
			const call = addListener({ eventName }, callback);
			const remove = async () => {
				const callbackId = await call;
				removeListener({
					eventName,
					callbackId
				}, callback);
			};
			const p = new Promise((resolve) => call.then(() => resolve({ remove })));
			p.remove = async () => {
				console.warn(`Using addListener() without 'await' is deprecated.`);
				await remove();
			};
			return p;
		};
		const proxy = new Proxy({}, { get(_, prop) {
			switch (prop) {
				case "$$typeof": return;
				case "toJSON": return () => ({});
				case "addListener": return pluginHeader ? addListenerNative : addListener;
				case "removeListener": return removeListener;
				default: return createPluginMethodWrapper(prop);
			}
		} });
		Plugins[pluginName] = proxy;
		registeredPlugins.set(pluginName, {
			name: pluginName,
			proxy,
			platforms: /* @__PURE__ */ new Set([...Object.keys(jsImplementations), ...pluginHeader ? [platform] : []])
		});
		return proxy;
	};
	if (!cap.convertFileSrc) cap.convertFileSrc = (filePath) => filePath;
	cap.getPlatform = getPlatform;
	cap.handleError = handleError;
	cap.isNativePlatform = isNativePlatform;
	cap.isPluginAvailable = isPluginAvailable;
	cap.registerPlugin = registerPlugin;
	cap.Exception = CapacitorException;
	cap.DEBUG = !!cap.DEBUG;
	cap.isLoggingEnabled = !!cap.isLoggingEnabled;
	return cap;
};
var initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win);
var Capacitor = /*#__PURE__*/ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
var registerPlugin = Capacitor.registerPlugin;
/**
* Base class web plugins should extend.
*/
var WebPlugin = class {
	constructor() {
		this.listeners = {};
		this.retainedEventArguments = {};
		this.windowListeners = {};
	}
	addListener(eventName, listenerFunc) {
		let firstListener = false;
		if (!this.listeners[eventName]) {
			this.listeners[eventName] = [];
			firstListener = true;
		}
		this.listeners[eventName].push(listenerFunc);
		const windowListener = this.windowListeners[eventName];
		if (windowListener && !windowListener.registered) this.addWindowListener(windowListener);
		if (firstListener) this.sendRetainedArgumentsForEvent(eventName);
		const remove = async () => this.removeListener(eventName, listenerFunc);
		return Promise.resolve({ remove });
	}
	async removeAllListeners() {
		this.listeners = {};
		for (const listener in this.windowListeners) this.removeWindowListener(this.windowListeners[listener]);
		this.windowListeners = {};
	}
	notifyListeners(eventName, data, retainUntilConsumed) {
		const listeners = this.listeners[eventName];
		if (!listeners) {
			if (retainUntilConsumed) {
				let args = this.retainedEventArguments[eventName];
				if (!args) args = [];
				args.push(data);
				this.retainedEventArguments[eventName] = args;
			}
			return;
		}
		listeners.forEach((listener) => listener(data));
	}
	hasListeners(eventName) {
		var _a;
		return !!((_a = this.listeners[eventName]) === null || _a === void 0 ? void 0 : _a.length);
	}
	registerWindowListener(windowEventName, pluginEventName) {
		this.windowListeners[pluginEventName] = {
			registered: false,
			windowEventName,
			pluginEventName,
			handler: (event) => {
				this.notifyListeners(pluginEventName, event);
			}
		};
	}
	unimplemented(msg = "not implemented") {
		return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
	}
	unavailable(msg = "not available") {
		return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
	}
	async removeListener(eventName, listenerFunc) {
		const listeners = this.listeners[eventName];
		if (!listeners) return;
		const index = listeners.indexOf(listenerFunc);
		this.listeners[eventName].splice(index, 1);
		if (!this.listeners[eventName].length) this.removeWindowListener(this.windowListeners[eventName]);
	}
	addWindowListener(handle) {
		window.addEventListener(handle.windowEventName, handle.handler);
		handle.registered = true;
	}
	removeWindowListener(handle) {
		if (!handle) return;
		window.removeEventListener(handle.windowEventName, handle.handler);
		handle.registered = false;
	}
	sendRetainedArgumentsForEvent(eventName) {
		const args = this.retainedEventArguments[eventName];
		if (!args) return;
		delete this.retainedEventArguments[eventName];
		args.forEach((arg) => {
			this.notifyListeners(eventName, arg);
		});
	}
};
/******** END WEB VIEW PLUGIN ********/
/******** COOKIES PLUGIN ********/
/**
* Safely web encode a string value (inspired by js-cookie)
* @param str The string value to encode
*/
var encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
/**
* Safely web decode a string value (inspired by js-cookie)
* @param str The string value to decode
*/
var decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
var CapacitorCookiesPluginWeb = class extends WebPlugin {
	async getCookies() {
		const cookies = document.cookie;
		const cookieMap = {};
		cookies.split(";").forEach((cookie) => {
			if (cookie.length <= 0) return;
			let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
			key = decode(key).trim();
			value = decode(value).trim();
			cookieMap[key] = value;
		});
		return cookieMap;
	}
	async setCookie(options) {
		try {
			const encodedKey = encode(options.key);
			const encodedValue = encode(options.value);
			const expires = options.expires ? `; expires=${options.expires.replace("expires=", "")}` : "";
			const path = (options.path || "/").replace("path=", "");
			const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
			document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
		} catch (error) {
			return Promise.reject(error);
		}
	}
	async deleteCookie(options) {
		try {
			document.cookie = `${options.key}=; Max-Age=0`;
		} catch (error) {
			return Promise.reject(error);
		}
	}
	async clearCookies() {
		try {
			const cookies = document.cookie.split(";") || [];
			for (const cookie of cookies) document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${(/* @__PURE__ */ new Date()).toUTCString()};path=/`);
		} catch (error) {
			return Promise.reject(error);
		}
	}
	async clearAllCookies() {
		try {
			await this.clearCookies();
		} catch (error) {
			return Promise.reject(error);
		}
	}
};
registerPlugin("CapacitorCookies", { web: () => new CapacitorCookiesPluginWeb() });
/**
* Read in a Blob value and return it as a base64 string
* @param blob The blob value to convert to a base64 string
*/
var readBlobAsBase64 = async (blob) => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.onload = () => {
		const base64String = reader.result;
		resolve(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
	};
	reader.onerror = (error) => reject(error);
	reader.readAsDataURL(blob);
});
/**
* Normalize an HttpHeaders map by lowercasing all of the values
* @param headers The HttpHeaders object to normalize
*/
var normalizeHttpHeaders = (headers = {}) => {
	const originalKeys = Object.keys(headers);
	return Object.keys(headers).map((k) => k.toLocaleLowerCase()).reduce((acc, key, index) => {
		acc[key] = headers[originalKeys[index]];
		return acc;
	}, {});
};
/**
* Builds a string of url parameters that
* @param params A map of url parameters
* @param shouldEncode true if you should encodeURIComponent() the values (true by default)
*/
var buildUrlParams = (params, shouldEncode = true) => {
	if (!params) return null;
	return Object.entries(params).reduce((accumulator, entry) => {
		const [key, value] = entry;
		let encodedValue;
		let item;
		if (Array.isArray(value)) {
			item = "";
			value.forEach((str) => {
				encodedValue = shouldEncode ? encodeURIComponent(str) : str;
				item += `${key}=${encodedValue}&`;
			});
			item.slice(0, -1);
		} else {
			encodedValue = shouldEncode ? encodeURIComponent(value) : value;
			item = `${key}=${encodedValue}`;
		}
		return `${accumulator}&${item}`;
	}, "").substr(1);
};
/**
* Build the RequestInit object based on the options passed into the initial request
* @param options The Http plugin options
* @param extra Any extra RequestInit values
*/
var buildRequestInit = (options, extra = {}) => {
	const output = Object.assign({
		method: options.method || "GET",
		headers: options.headers
	}, extra);
	const type = normalizeHttpHeaders(options.headers)["content-type"] || "";
	if (typeof options.data === "string") output.body = options.data;
	else if (type.includes("application/x-www-form-urlencoded")) {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(options.data || {})) params.set(key, value);
		output.body = params.toString();
	} else if (type.includes("multipart/form-data") || options.data instanceof FormData) {
		const form = new FormData();
		if (options.data instanceof FormData) options.data.forEach((value, key) => {
			form.append(key, value);
		});
		else for (const key of Object.keys(options.data)) form.append(key, options.data[key]);
		output.body = form;
		const headers = new Headers(output.headers);
		headers.delete("content-type");
		output.headers = headers;
	} else if (type.includes("application/json") || typeof options.data === "object") output.body = JSON.stringify(options.data);
	return output;
};
var CapacitorHttpPluginWeb = class extends WebPlugin {
	/**
	* Perform an Http request given a set of options
	* @param options Options to build the HTTP request
	*/
	async request(options) {
		const requestInit = buildRequestInit(options, options.webFetchExtra);
		const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
		const url = urlParams ? `${options.url}?${urlParams}` : options.url;
		const response = await fetch(url, requestInit);
		const contentType = response.headers.get("content-type") || "";
		let { responseType = "text" } = response.ok ? options : {};
		if (contentType.includes("application/json")) responseType = "json";
		let data;
		let blob;
		switch (responseType) {
			case "arraybuffer":
			case "blob":
				blob = await response.blob();
				data = await readBlobAsBase64(blob);
				break;
			case "json":
				data = await response.json();
				break;
			default: data = await response.text();
		}
		const headers = {};
		response.headers.forEach((value, key) => {
			headers[key] = value;
		});
		return {
			data,
			headers,
			status: response.status,
			url: response.url
		};
	}
	/**
	* Perform an Http GET request given a set of options
	* @param options Options to build the HTTP request
	*/
	async get(options) {
		return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
	}
	/**
	* Perform an Http POST request given a set of options
	* @param options Options to build the HTTP request
	*/
	async post(options) {
		return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
	}
	/**
	* Perform an Http PUT request given a set of options
	* @param options Options to build the HTTP request
	*/
	async put(options) {
		return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
	}
	/**
	* Perform an Http PATCH request given a set of options
	* @param options Options to build the HTTP request
	*/
	async patch(options) {
		return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
	}
	/**
	* Perform an Http DELETE request given a set of options
	* @param options Options to build the HTTP request
	*/
	async delete(options) {
		return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
	}
};
registerPlugin("CapacitorHttp", { web: () => new CapacitorHttpPluginWeb() });
/******** END HTTP PLUGIN ********/
/******** SYSTEM BARS PLUGIN ********/
/**
* Available status bar styles.
*/
var SystemBarsStyle;
(function(SystemBarsStyle) {
	/**
	* Light system bar content on a dark background.
	*
	* @since 8.0.0
	*/
	SystemBarsStyle["Dark"] = "DARK";
	/**
	* For dark system bar content on a light background.
	*
	* @since 8.0.0
	*/
	SystemBarsStyle["Light"] = "LIGHT";
	/**
	* The style is based on the device appearance or the underlying content.
	* If the device is using Dark mode, the system bars content will be light.
	* If the device is using Light mode, the system bars content will be dark.
	*
	* @since 8.0.0
	*/
	SystemBarsStyle["Default"] = "DEFAULT";
})(SystemBarsStyle || (SystemBarsStyle = {}));
/**
* Available system bar types.
*/
var SystemBarType;
(function(SystemBarType) {
	/**
	* The top status bar on both Android and iOS.
	*
	* @since 8.0.0
	*/
	SystemBarType["StatusBar"] = "StatusBar";
	/**
	* The navigation bar (or gesture bar on iOS) on both Android and iOS.
	*
	* @since 8.0.0
	*/
	SystemBarType["NavigationBar"] = "NavigationBar";
})(SystemBarType || (SystemBarType = {}));
var SystemBarsPluginWeb = class extends WebPlugin {
	async setStyle() {
		this.unavailable("not available for web");
	}
	async setAnimation() {
		this.unavailable("not available for web");
	}
	async show() {
		this.unavailable("not available for web");
	}
	async hide() {
		this.unavailable("not available for web");
	}
};
registerPlugin("SystemBars", { web: () => new SystemBarsPluginWeb() });
//#endregion
//#region src/shared/routing/native/cws-bridge.ts
var cws_bridge_exports = /* @__PURE__ */ __exportAll({
	CwsBridge: () => CwsBridge,
	getNativeUnifiedSettings: () => getNativeUnifiedSettings,
	initCwsNativeBridge: () => initCwsNativeBridge,
	invokeCwsNative: () => invokeCwsNative,
	invokeCwsPlatformIPC: () => invokeCwsPlatformIPC,
	isCapacitorCwsNativeShell: () => isCapacitorCwsNativeShell,
	isCwsNativeIpcAvailable: () => isCwsNativeIpcAvailable,
	isElectronCwsNativeShell: () => isElectronCwsNativeShell,
	patchNativeUnifiedSettingsDetailed: () => patchNativeUnifiedSettingsDetailed
});
var CwsBridgeWeb = class extends WebPlugin {
	async getShellInfo() {
		return {
			shell: "browser",
			bridge: "cws-bridge",
			native: false,
			platform: typeof globalThis.navigator !== "undefined" ? "web" : "unknown"
		};
	}
	async invoke(options) {
		const envelope = normalizeBridgeEnvelope(options.channel, options.payload, options.envelope);
		return {
			ok: true,
			channel: options.channel,
			echo: { ...options.payload ?? {} },
			envelope
		};
	}
};
/**
* WHY: CRX bundles `@capacitor/core` with a first `registerPlugin("CwsBridge")`, then
* Settings dynamic-imports this module and would register again → console warn.
* INVARIANT: one Capacitor plugin proxy per JS realm.
*/
var registerCwsBridgeOnce = () => {
	const g = globalThis;
	if (g.__CWS_BRIDGE_PLUGIN__) return g.__CWS_BRIDGE_PLUGIN__;
	const existing = g.Capacitor?.Plugins?.CwsBridge;
	if (existing) {
		g.__CWS_BRIDGE_PLUGIN__ = existing;
		return existing;
	}
	const plugin = registerPlugin("CwsBridge", { web: () => new CwsBridgeWeb() });
	g.__CWS_BRIDGE_PLUGIN__ = plugin;
	return plugin;
};
var CwsBridge = registerCwsBridgeOnce();
var bridgeInitDone = false;
var normalizeBridgeEnvelope = (channel, payload, envelope) => {
	if (envelope && isProtocolEnvelope(envelope)) return normalizeProtocolEnvelope(envelope);
	return createProtocolEnvelope({
		...createInteropEnvelope({
			purpose: "invoke",
			protocol: "service",
			transport: "service-worker",
			type: "invoke",
			op: "invoke",
			source: "webview",
			destination: "native",
			srcChannel: "webview",
			dstChannel: "native",
			payload: payload ?? {},
			data: payload ?? {}
		}),
		path: ["cws-bridge", channel]
	});
};
var normalizeInvokeResultEnvelope = (channel, payload, result) => {
	if (result?.envelope && isProtocolEnvelope(result.envelope)) return normalizeProtocolEnvelope(result.envelope);
	return createProtocolEnvelope({
		...createInteropEnvelope({
			purpose: "invoke",
			protocol: "service",
			transport: "service-worker",
			type: result.ok ? "response" : "ack",
			op: "invoke",
			source: "native",
			destination: "webview",
			srcChannel: "native",
			dstChannel: "webview",
			payload,
			data: payload
		}),
		path: ["cws-bridge", channel]
	});
};
/**
* Initialize the native bridge surface and normalize inbound native messages.
*
* AI-READ: this is the TypeScript side of the WebView/native boundary, so it
* is one of the first places to inspect when networking works natively but not
* through the web shell or vice versa.
*/
async function initCwsNativeBridge() {
	if (bridgeInitDone) return typeof globalThis.window !== "undefined" ? globalThis.window.__CWS_SHELL_INFO__ ?? null : null;
	bridgeInitDone = true;
	const electronInfoFn = globalThis.window?.electronBridge?.getShellInfo;
	if (typeof electronInfoFn === "function") try {
		const info = await electronInfoFn();
		if (typeof globalThis.window !== "undefined") globalThis.window.__CWS_SHELL_INFO__ = info;
		return info;
	} catch {}
	try {
		const info = await CwsBridge.getShellInfo();
		if (typeof globalThis.window !== "undefined") globalThis.window.__CWS_SHELL_INFO__ = info;
		try {
			await CwsBridge.addListener("nativeMessage", (event) => {
				const payload = event && typeof event.payload === "object" && event.payload != null ? event.payload : {};
				const envelopeRaw = payload?.envelope;
				const envelope = envelopeRaw && typeof envelopeRaw === "object" && isProtocolEnvelope(envelopeRaw) ? normalizeProtocolEnvelope(envelopeRaw) : createProtocolEnvelope(createInteropEnvelope({
					purpose: "mail",
					protocol: "service",
					transport: "service-worker",
					type: "act",
					op: "deliver",
					source: "native",
					destination: "webview",
					srcChannel: "native",
					dstChannel: "webview",
					payload,
					data: payload
				}));
				globalThis.dispatchEvent(new CustomEvent("cws-native-message", { detail: {
					event,
					envelope,
					payload
				} }));
			});
		} catch {}
		return info;
	} catch {
		return null;
	}
}
/** Detect the Capacitor/CWSAndroid shell where native networking may replace browser transport rules. */
var isCapacitorCwsNativeShell = () => {
	try {
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform());
	} catch {
		return false;
	}
};
/** Detect the Electron shell, which uses its own invoke bridge instead of Capacitor plugins. */
var isElectronCwsNativeShell = () => {
	try {
		return Boolean(globalThis.window?.electronBridge?.invoke);
	} catch {
		return false;
	}
};
/** Report whether frontend code can rely on native IPC instead of web-only fallbacks. */
var isCwsNativeIpcAvailable = () => {
	if (isElectronCwsNativeShell()) return true;
	if (isCapacitorCwsNativeShell()) return true;
	try {
		const shell = globalThis.window?.__CWS_SHELL_INFO__;
		return Boolean(shell?.native);
	} catch {
		return false;
	}
};
/** Opaque channel → Kotlin/Compose (override {@code CwsBridgePlugin.invoke} in CWSAndroid for real routing). */
async function invokeCwsNative(channel, payload) {
	const envelope = normalizeBridgeEnvelope(channel, payload);
	const result = await CwsBridge.invoke({
		channel,
		payload,
		envelope
	});
	return {
		...result,
		envelope: normalizeInvokeResultEnvelope(channel, payload ?? {}, result)
	};
}
/**
* Canonical IPC invoker for frontend modules:
* - Uses CWSAndroid native bridge envelope transport when available
* - Falls back to web plugin-compatible invoke otherwise
*/
async function invokeCwsPlatformIPC(input) {
	const channel = (input.channel || "").trim() || (Array.isArray(input.envelope?.path) && input.envelope?.path.length ? String(input.envelope.path[input.envelope.path.length - 1] || "").trim() : "") || "default";
	const payload = input.payload && typeof input.payload === "object" ? input.payload : {};
	const envelope = normalizeBridgeEnvelope(channel, payload, input.envelope);
	const electronInvoke = globalThis.window?.electronBridge?.invoke;
	if (typeof electronInvoke === "function") {
		const result = await electronInvoke({
			channel,
			payload,
			envelope
		});
		return {
			...result,
			envelope: normalizeInvokeResultEnvelope(channel, payload, result)
		};
	}
	if (!isCwsNativeIpcAvailable()) {
		const result = await CwsBridge.invoke({
			channel,
			payload,
			envelope
		});
		return {
			...result,
			envelope: normalizeInvokeResultEnvelope(channel, payload, result)
		};
	}
	try {
		const result = await CwsBridge.invoke({
			channel,
			payload,
			envelope
		});
		return {
			...result,
			envelope: normalizeInvokeResultEnvelope(channel, payload, result)
		};
	} catch (error) {
		console.warn("[cws-bridge] native invoke failed:", error);
		if (isCapacitorCwsNativeShell()) return {
			ok: false,
			channel,
			echo: {
				...payload ?? {},
				error: String(error instanceof Error ? error.message : error)
			},
			envelope: normalizeInvokeResultEnvelope(channel, payload, {
				ok: false,
				channel,
				echo: payload ?? {}
			})
		};
		const result = await new CwsBridgeWeb().invoke({
			channel,
			payload,
			envelope
		});
		return {
			...result,
			envelope: normalizeInvokeResultEnvelope(channel, payload, result)
		};
	}
}
async function getNativeUnifiedSettings() {
	try {
		const result = await invokeCwsPlatformIPC({ channel: "settings:get" });
		if (!result?.ok) return null;
		return result.appSettings && typeof result.appSettings === "object" ? result.appSettings : null;
	} catch {
		return null;
	}
}
async function patchNativeUnifiedSettingsDetailed(appSettings) {
	try {
		const airpadJson = stringifyCwspRemoteConnectionV1(appSettingsToRemoteConnectionV1(appSettings));
		const shellPatch = appSettingsShellToNativeExtras(appSettings);
		try {
			globalThis.localStorage?.setItem?.(AIRPAD_REMOTE_CONFIG_STORAGE_KEY, airpadJson);
		} catch {}
		try {
			const ch = new BroadcastChannel(CWSP_REMOTE_CONFIG_SYNC_CHANNEL);
			ch.postMessage({
				airpadJson,
				shellPatch
			});
			ch.close();
		} catch {}
		const result = await withTimeout(invokeCwsPlatformIPC({
			channel: "settings:patch",
			payload: {
				appSettings,
				airpadJson,
				shellPatch
			}
		}), 6e3, "settings:patch timed out").catch((error) => ({
			ok: false,
			channel: "settings:patch",
			echo: { error: String(error instanceof Error ? error.message : error) }
		}));
		const echo = result?.echo;
		if (!(result?.ok === true || result?.ok !== false && !echo?.error && result?.channel === "settings:patch")) return {
			ok: false,
			error: String(echo?.error ?? "settings:patch rejected")
		};
		return { ok: true };
	} catch (e) {
		return {
			ok: false,
			error: String(e instanceof Error ? e.message : e)
		};
	}
}
//#endregion
export { invokeCwsNative as a, isCwsNativeIpcAvailable as c, WebPlugin as d, registerPlugin as f, initCwsNativeBridge as i, patchNativeUnifiedSettingsDetailed as l, cws_bridge_exports as n, invokeCwsPlatformIPC as o, toUnifiedInteropMessage as p, getNativeUnifiedSettings as r, isCapacitorCwsNativeShell as s, CwsBridge as t, Capacitor as u };
