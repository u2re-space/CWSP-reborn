import { r as __exportAll } from "./rolldown-runtime.js";
import { a as DESTINATIONS, g as resolveProcessApiUrl, l as getDestinationAliases, n as BROADCAST_CHANNELS, s as createDestinationChannelMappings, u as normalizeDestination } from "./Names.js";
import "./UniformInterop2.js";
import "./core.js";
import "./templates.js";
import { getUnifiedMessaging } from "/fest/uniform.js";
//#region src/shared/routing/channel/UnifiedAIConfig.ts
var processApiUrl = () => resolveProcessApiUrl("processing");
var UNIFIED_PROCESSING_RULES = {
	"share-target": {
		processingUrl: processApiUrl(),
		contentAction: {
			onResult: "write-clipboard",
			onAccept: "attach-to-associated",
			doProcess: "instantly",
			openApp: true
		},
		supportedContentTypes: [
			"text",
			"markdown",
			"image",
			"url"
		],
		defaultOverrideFactors: []
	},
	"launch-queue": {
		processingUrl: processApiUrl(),
		contentAction: {
			onResult: "none",
			onAccept: "attach-to-associated",
			doProcess: "manually",
			openApp: true
		},
		supportedContentTypes: [
			"file",
			"blob",
			"text",
			"markdown",
			"image"
		],
		defaultOverrideFactors: []
	},
	"crx-snip": {
		processingUrl: processApiUrl(),
		contentAction: {
			onResult: "write-clipboard",
			onAccept: "attach-to-associated",
			doProcess: "instantly",
			openApp: false
		},
		supportedContentTypes: ["text", "image"],
		defaultOverrideFactors: ["force-processing"]
	},
	"paste": {
		processingUrl: processApiUrl(),
		contentAction: {
			onResult: "none",
			onAccept: "attach-to-associated",
			doProcess: "manually",
			openApp: false
		},
		supportedContentTypes: [
			"text",
			"markdown",
			"image"
		],
		defaultOverrideFactors: [],
		associationOverrides: {
			"text": ["user-action"],
			"markdown": ["user-action"]
		}
	},
	"drop": {
		processingUrl: processApiUrl(),
		contentAction: {
			onResult: "none",
			onAccept: "attach-to-associated",
			doProcess: "manually",
			openApp: false
		},
		supportedContentTypes: [
			"file",
			"blob",
			"text",
			"markdown",
			"image"
		],
		defaultOverrideFactors: [],
		associationOverrides: {
			"file": ["user-action"],
			"blob": ["user-action"]
		}
	},
	"button-attach-workcenter": {
		processingUrl: processApiUrl(),
		contentAction: {
			onResult: "none",
			onAccept: "attach-to-workcenter",
			doProcess: "manually",
			openApp: false
		},
		supportedContentTypes: [
			"text",
			"markdown",
			"image",
			"file"
		],
		defaultOverrideFactors: ["explicit-workcenter"],
		associationOverrides: {
			"markdown": ["explicit-workcenter"],
			"text": ["explicit-workcenter"],
			"image": ["explicit-workcenter"],
			"file": ["explicit-workcenter"]
		}
	}
};
Object.fromEntries(Object.entries(UNIFIED_PROCESSING_RULES).map(([key, config]) => [key, {
	processingUrl: config.processingUrl,
	contentAction: config.contentAction,
	...config.supportedContentTypes && { supportedContentTypes: config.supportedContentTypes }
}]));
//#endregion
//#region src/shared/routing/channel/UnifiedMessaging.ts
/**
* Unified Messaging System for CWSP-shell
* Extends fest/uniform messaging with app-specific configuration
*/
var UnifiedMessaging_exports = /* @__PURE__ */ __exportAll({
	getUnifiedMessaging: () => getUnifiedMessaging$1,
	initializeComponent: () => initializeComponent,
	registerComponent: () => registerComponent,
	registerHandler: () => registerHandler,
	replayQueuedMessagesForDestination: () => replayQueuedMessagesForDestination,
	unifiedMessaging: () => unifiedMessaging,
	unregisterHandler: () => unregisterHandler
});
var APP_CHANNEL_MAPPINGS = {
	...createDestinationChannelMappings(),
	[DESTINATIONS.WORKCENTER]: BROADCAST_CHANNELS.WORK_CENTER,
	[DESTINATIONS.CLIPBOARD]: BROADCAST_CHANNELS.CLIPBOARD
};
var appMessagingInstance = null;
/**
* Get the app-configured UnifiedMessagingManager
*/
function getUnifiedMessaging$1() {
	if (!appMessagingInstance) appMessagingInstance = getUnifiedMessaging({
		channelMappings: APP_CHANNEL_MAPPINGS,
		queueOptions: {
			dbName: "CWSP-shellMessageQueue",
			storeName: "messages",
			maxRetries: 3,
			defaultExpirationMs: 864e5
		},
		pendingStoreOptions: {
			storageKey: "rs-unified-messaging-pending",
			maxMessages: 200,
			defaultTTLMs: 864e5
		}
	});
	return appMessagingInstance;
}
var unifiedMessaging = getUnifiedMessaging$1();
/**
* Register a handler using the app-configured manager
*/
function registerHandler(destination, handler) {
	const aliases = getDestinationAliases(destination);
	const names = aliases.length > 0 ? aliases : [normalizeDestination(destination) || destination];
	for (const name of names) unifiedMessaging.registerHandler(name, handler);
}
function unregisterHandler(destination, handler) {
	const aliases = getDestinationAliases(destination);
	const names = aliases.length > 0 ? aliases : [normalizeDestination(destination) || destination];
	for (const name of names) unifiedMessaging.unregisterHandler(name, handler);
}
function initializeComponent(componentId) {
	return unifiedMessaging.initializeComponent(componentId);
}
/**
* Replay IndexedDB-backed queued messages for a destination (mail/deferred pipeline).
* Safe after handlers register — implicit view bridge calls this post-bind.
*/
function replayQueuedMessagesForDestination(destination) {
	return unifiedMessaging.processQueuedMessages(destination);
}
function registerComponent(componentId, destination) {
	unifiedMessaging.registerComponent(componentId, normalizeDestination(destination) || destination);
}
//#endregion
export { replayQueuedMessagesForDestination as a, registerHandler as i, initializeComponent as n, unifiedMessaging as o, registerComponent as r, unregisterHandler as s, UnifiedMessaging_exports as t };
