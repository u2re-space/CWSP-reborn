//#region src/shared/other/config/SettingsTypes.ts
var BUILTIN_AI_MODELS = ["gpt-5.6-luna"];
var defaultSpeechLanguage = () => {
	const fallback = "en-US";
	if (typeof navigator === "undefined") return fallback;
	const normalized = (navigator.language || "").trim();
	if (normalized === "ru" || normalized.startsWith("ru-")) return "ru";
	if (normalized === "en-GB") return "en-GB";
	if (normalized === "en-US") return "en-US";
	if (normalized === "en" || normalized.startsWith("en-")) return "en";
	return fallback;
};
var DEFAULT_SETTINGS = {
	core: {
		mode: "native",
		endpointUrl: "https://localhost:8434",
		userId: "",
		ecosystemToken: "",
		userKey: "",
		encrypt: false,
		preferBackendSync: true,
		ntpEnabled: false,
		appClientId: "",
		useCoreIdentityForAirPad: true,
		allowInsecureTls: false,
		network: {
			listenPortHttps: 8434,
			listenPortHttp: 8080,
			bridgeEnabled: true,
			reconnectMs: 3e3,
			destinations: []
		},
		socket: {
			protocol: "auto",
			routeTarget: "",
			selfId: "",
			accessToken: "",
			clientAccessToken: "",
			allowAccessTokenWithoutUserKey: false,
			transportMode: "plaintext",
			transportSecret: "",
			signingSecret: "",
			connectionType: "",
			archetype: "",
			protocolLanesJson: ""
		},
		interop: {
			ipcProtocol: "uniform",
			platformInterop: true,
			preferNativeIpc: true,
			preferNativeWebsocket: true
		},
		admin: {
			httpsOrigin: "https://localhost:8434",
			httpOrigin: "https://localhost:8080",
			path: "/"
		},
		ops: {
			allowUnencrypted: false,
			directUrl: "",
			httpTargets: [],
			wsTargets: [],
			syncTargets: []
		}
	},
	shell: {
		preferNativeWebsocket: true,
		maintainHubSocketConnection: false,
		enableRemoteClipboardBridge: true,
		applyRemoteClipboardToDevice: true,
		pushLocalClipboardToLan: false,
		clipboardPushIntervalMs: 2e3,
		clipboardBroadcastTargets: "",
		enableNativeSms: false,
		enableNativeContacts: true,
		acceptInboundClipboardData: true,
		clipboardInboundAllowIds: "",
		clipboardShareDestinationIds: "",
		accessTokenBypassesClipboardAllowlist: false,
		acceptContactsBridgeData: false,
		acceptSmsBridgeData: false,
		autoStartOnBoot: true,
		bridgeDaemonEnabled: true,
		clipboardOutboundMode: "auto",
		clipboardInboundMode: "auto",
		clipboardOutboundShowErase: true,
		clipboardInboundShowUndo: true,
		clipboardPromptDismissMs: 1e4
	},
	ai: {
		apiKey: "",
		baseUrl: "",
		model: "gpt-5.2",
		customModel: "",
		defaultReasoningEffort: "medium",
		defaultVerbosity: "medium",
		maxOutputTokens: 4e5,
		contextTruncation: "disabled",
		promptCacheRetention: "in-memory",
		maxToolCalls: 8,
		parallelToolCalls: true,
		mcp: [],
		shareTargetMode: "recognize",
		autoProcessShared: true,
		customInstructions: [],
		activeInstructionId: "",
		responseLanguage: "auto",
		translateResults: false,
		generateSvgGraphics: false,
		requestTimeout: {
			low: 60,
			medium: 300,
			high: 900
		},
		maxRetries: 2
	},
	webdav: {
		url: "https://localhost:8434",
		username: "",
		password: "",
		token: ""
	},
	timeline: { source: "" },
	appearance: {
		theme: "auto",
		fontSize: "medium",
		color: "",
		markdown: {
			customCss: "",
			printCss: "",
			extensions: [],
			preset: "default",
			fontFamily: "system",
			fontSizePx: 16,
			lineHeight: 1.7,
			contentMaxWidthPx: 860,
			printScale: 1,
			page: {
				size: "auto",
				orientation: "portrait",
				marginMm: 12
			},
			modules: {
				typography: true,
				lists: true,
				tables: true,
				codeBlocks: true,
				blockquotes: true,
				media: true,
				printBreaks: true
			},
			plugins: {
				smartTypography: false,
				softBreaksAsBr: false,
				externalLinksNewTab: true
			}
		}
	},
	speech: { language: defaultSpeechLanguage() },
	grid: {
		columns: 4,
		rows: 8,
		shape: "square"
	}
};
/** Resolve the single shared ecosystem token from any legacy field. */
var resolveEcosystemToken = (settings) => {
	const core = settings?.core;
	if (!core) return "";
	const eco = String(core.ecosystemToken || "").trim();
	if (eco) return eco;
	const userKey = String(core.userKey || "").trim();
	if (userKey) return userKey;
	return String(core.socket?.accessToken || core.socket?.airpadAuthToken || "").trim();
};
/**
* Mirror ecosystem token onto userKey + socket.accessToken for wire/compat.
* INVARIANT: after this, ecosystemToken === userKey === accessToken (when non-empty).
*/
var normalizeEcosystemToken = (settings) => {
	if (!settings.core) settings.core = {};
	const token = resolveEcosystemToken(settings);
	settings.core.ecosystemToken = token;
	settings.core.userKey = token;
	settings.core.socket = {
		...settings.core.socket || {},
		accessToken: token
	};
	return token;
};
//#endregion
export { resolveEcosystemToken as i, DEFAULT_SETTINGS as n, normalizeEcosystemToken as r, BUILTIN_AI_MODELS as t };
