import { n as __exportAll } from "./rolldown-runtime.js";
import { a as initServiceWorker } from "./sw-handling.js";
import { I as H } from "../com/app.js";
import { a as invokeCwsNative, s as isCapacitorCwsNativeShell } from "../vendor/@capacitor_core.js";
import { A as getMotionSendIntervalMs, F as isClipboardHubBootstrapEnabled, G as setAccessToken, H as recordMotionSendSample, J as syncAirpadRemoteConfigToNativeShell, K as setAirPadQuickConnectTarget, L as isMaintainHubSocketConnectionEnabled, M as getRemoteProtocol, O as getMotionPathClass, U as refreshMotionSendRateFromConfig, V as isShellRemoteClipboardBridgeEnabled, W as reloadAirpadRemoteConfigFromStorage, a as GYRO_MAX_SAMPLE_COUNT, f as attachAirpadCrossTabConfigSync, h as getAirPadDestinationId, i as GYRO_DEADZONE, j as getRemoteHost, k as getMotionSendHz, l as REL_ORIENT_DEADZONE, o as GYRO_ROTATION_GAIN, p as getAccessToken, r as ACCELEROMETER_SMOOTH, s as GYRO_SMOOTH, t as ACCELEROMETER_DEADZONE, u as REL_ORIENT_SMOOTH, x as getAirPadQuickConnectTarget } from "./config.js";
import { i as loadSettings } from "./Settings.js";
import { C as getVkStatusEl, D as queryAirpad, E as log, O as setAirpadDomRoot, S as getClipboardPreviewEl, _ as getAirpadOwnerDocument, b as getBtnCut, c as encodeInputPerfTsLo, d as getAiButton, f as getAiStatusEl, g as getAirpadDomRoot, h as getAirStatusEl, m as getAirNeighborButton, p as getAirButton, s as decodeInputPerfTsLo, t as invalidateAirpadTransportCredentials, v as getBtnConnect, w as getVoiceTextEl, x as getBtnPaste, y as getBtnCopy } from "./credential-cache-bridge.js";
import { a as initWebSocket, c as onServerClipboardUpdate, d as reconnectTransportAfterLifecycleResume, f as refreshTransportConnectionStatus, g as sendWsBinary, h as sendCoordinatorRequest, i as disconnectWS, l as onVoiceResult, m as sendCoordinatorAsk, o as isWSConnected, p as sendCoordinatorAct, r as connectWS, s as markTransportDisconnected, u as onWSConnectionChange, v as reconnectNativeCoordinatorTransport, y as shouldUseNativeCoordinatorTransport } from "./hub-socket-boot.js";
//#region ../../modules/views/airpad-view/src/input-old/keyboard/api.ts
var virtualKeyboardAPI = null;
function initVirtualKeyboardAPI() {
	if ("virtualKeyboard" in navigator && navigator.virtualKeyboard) {
		virtualKeyboardAPI = navigator.virtualKeyboard;
		virtualKeyboardAPI.overlaysContent = true;
		log("VirtualKeyboard API available");
		return true;
	}
	return false;
}
function getVirtualKeyboardAPI() {
	return virtualKeyboardAPI;
}
function hasVirtualKeyboardAPI() {
	return virtualKeyboardAPI !== null;
}
//#endregion
//#region ../../modules/views/airpad-view/src/input-old/keyboard/state.ts
var keyboardVisible = false;
var keyboardElement = null;
var toggleButton = null;
var remoteKeyboardEnabled = false;
function setKeyboardVisible(visible) {
	keyboardVisible = visible;
}
function isKeyboardVisible() {
	return keyboardVisible;
}
function setKeyboardElement(element) {
	keyboardElement = element;
}
function getKeyboardElement() {
	return keyboardElement;
}
function setToggleButton(button) {
	toggleButton = button;
}
function getToggleButton() {
	return toggleButton;
}
function setRemoteKeyboardEnabled$1(enabled) {
	remoteKeyboardEnabled = enabled;
}
function isRemoteKeyboardEnabled() {
	return remoteKeyboardEnabled;
}
if ("visualViewport" in globalThis) {
	const VIEWPORT_VS_CLIENT_HEIGHT_RATIO = .75;
	globalThis?.visualViewport?.addEventListener?.("resize", function(event) {
		if (event.target.height * event.target.scale / globalThis?.screen?.height < VIEWPORT_VS_CLIENT_HEIGHT_RATIO) keyboardVisible = true;
		else keyboardVisible = false;
	});
}
if ("virtualKeyboard" in globalThis?.navigator) {
	navigator.virtualKeyboard.overlaysContent = true;
	navigator.virtualKeyboard.addEventListener("geometrychange", (event) => {
		const { x, y, width, height } = event.target.boundingRect;
		if (height > 0) keyboardVisible = true;
		else keyboardVisible = false;
	});
}
//#endregion
//#region ../../modules/views/airpad-view/src/input-old/keyboard/constants.ts
var EMOJI_CATEGORIES = {
	"smileys": [
		"😀",
		"😃",
		"😄",
		"😁",
		"😆",
		"😅",
		"🤣",
		"😂",
		"🙂",
		"🙃",
		"😉",
		"😊",
		"😇",
		"🥰",
		"😍",
		"🤩",
		"😘",
		"😗",
		"😚",
		"😙"
	],
	"gestures": [
		"👋",
		"🤚",
		"🖐",
		"✋",
		"🖖",
		"👌",
		"🤌",
		"🤏",
		"✌️",
		"🤞",
		"🤟",
		"🤘",
		"🤙",
		"👈",
		"👉",
		"👆",
		"🖕",
		"👇",
		"☝️",
		"👍"
	],
	"symbols": [
		"❤️",
		"🧡",
		"💛",
		"💚",
		"💙",
		"💜",
		"🖤",
		"🤍",
		"🤎",
		"💔",
		"❣️",
		"💕",
		"💞",
		"💓",
		"💗",
		"💖",
		"💘",
		"💝",
		"💟",
		"☮️"
	],
	"objects": [
		"⌚",
		"📱",
		"📲",
		"💻",
		"⌨️",
		"🖥️",
		"🖨️",
		"🖱️",
		"🖲️",
		"🕹️",
		"🗜️",
		"💾",
		"💿",
		"📀",
		"📼",
		"📷",
		"📸",
		"📹",
		"🎥",
		"📽️"
	],
	"arrows": [
		"⬆️",
		"↗️",
		"➡️",
		"↘️",
		"⬇️",
		"↙️",
		"⬅️",
		"↖️",
		"↕️",
		"↔️",
		"↩️",
		"↪️",
		"⤴️",
		"⤵️",
		"🔃",
		"🔄",
		"🔙",
		"🔚",
		"🔛",
		"🔜"
	]
};
var KEYBOARD_LAYOUT = [
	[
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"0"
	],
	[
		"q",
		"w",
		"e",
		"r",
		"t",
		"y",
		"u",
		"i",
		"o",
		"p"
	],
	[
		"a",
		"s",
		"d",
		"f",
		"g",
		"h",
		"j",
		"k",
		"l"
	],
	[
		"z",
		"x",
		"c",
		"v",
		"b",
		"n",
		"m"
	]
];
var KEYBOARD_LAYOUT_UPPER = [
	[
		"!",
		"@",
		"#",
		"$",
		"%",
		"^",
		"&",
		"*",
		"(",
		")"
	],
	[
		"Q",
		"W",
		"E",
		"R",
		"T",
		"Y",
		"U",
		"I",
		"O",
		"P"
	],
	[
		"A",
		"S",
		"D",
		"F",
		"G",
		"H",
		"J",
		"K",
		"L"
	],
	[
		"Z",
		"X",
		"C",
		"V",
		"B",
		"N",
		"M"
	]
];
//#endregion
//#region ../../modules/projects/cwsp-shared/src/kvm-layout.ts
var normPeer = (value) => String(value ?? "").trim();
var findKvmScreen = (layout, peerId) => {
	const needle = normPeer(peerId).toLowerCase();
	if (!needle) return void 0;
	return layout.screens.find((screen) => normPeer(screen.peerId).toLowerCase() === needle);
};
//#endregion
//#region ../../modules/projects/cwsp-shared/src/cwsp-global.ts
/**
* Process-wide CWSP bindings on `globalThis[Symbol.for("cwsp.…")]`.
*
* WHY: symlinked `server/inputs/*`, `src/node/*`, and duplicate import paths can
* evaluate the same logical module twice; module-level `let` / `export default new
* Foo()` then diverge. One symbol → one class/object/map per JS realm.
*
* Idiom (TS cannot `export { globalThis[sym] as X }` — use helpers):
*
* ```ts
* export class MouseAccess { ... }
* export default cwspGlobal(CWSP_SLOT.mouseAccess, () => new MouseAccess());
* ```
*/
var CWSP_SLOT = {
	modules: "config.modules",
	airpadInputAccess: "handlers.airpadInputAccess",
	airpadInputSession: "handlers.airpadInputSession",
	mouseAccess: "handlers.mouseAccess",
	keyboardAccess: "handlers.keyboardAccess",
	touchAccess: "handlers.touchAccess",
	voiceAccess: "handlers.voiceAccess",
	screenAccess: "handlers.screenAccess",
	contactsAccess: "handlers.contactsAccess",
	smsAccess: "handlers.smsAccess",
	javaHostBridge: "inputs.javaHostBridge",
	clipboardEcho: "inputs.clipboardEcho",
	clipboardWriteGuard: "inputs.clipboardWriteGuard",
	inputCommandScheduler: "inputs.inputCommandScheduler",
	inputMovementStabilizer: "inputs.inputMovementStabilizer",
	inputApplyRateGovernor: "inputs.inputApplyRateGovernor",
	inputV3Diagnostics: "inputs.inputV3Diagnostics",
	socketTrace: "protocol.socketTrace",
	floodGuard: "protocol.floodGuard",
	transportHandlers: "protocol.transportHandlers",
	airpadEventBus: "airpad.eventBus",
	airpadKvmSession: "airpad.kvmSession",
	airpadPacketWsRail: "airpad.packetWsRail",
	airpadCoordinator: "airpad.coordinator",
	airpadTransportFacade: "airpad.transportFacade"
};
var cwspSym = (key) => Symbol.for(`cwsp.${String(key)}`);
var bag = () => globalThis;
var cwspEnsure = (sym, init) => {
	const current = bag()[sym];
	if (current !== void 0) return current;
	const created = init();
	bag()[sym] = created;
	return created;
};
var cwspGlobal = (key, init) => cwspEnsure(cwspSym(key), init);
//#endregion
//#region ../../modules/views/airpad-view/src/config/kvm-session.ts
var kvmSession = () => cwspGlobal(CWSP_SLOT.airpadKvmSession, () => ({
	layout: null,
	activePeerId: "",
	virtualX: 0,
	virtualY: 0
}));
var resetAirpadKvmSession = () => {
	const state = kvmSession();
	state.layout = null;
	state.activePeerId = "";
	state.virtualX = 0;
	state.virtualY = 0;
};
async function refreshAirpadKvmSession(ask, destinationId) {
	resetAirpadKvmSession();
	const dest = destinationId.trim();
	try {
		if (!(await ask("kvm:isready", {}))?.ready) return;
		const res = await ask("kvm:layout", {});
		if (!res?.layout?.screens?.length) return;
		const state = kvmSession();
		state.layout = res.layout;
		const screen = findKvmScreen(state.layout, dest) ?? state.layout.screens[0];
		state.activePeerId = screen.peerId;
		state.virtualX = Math.floor(screen.width / 2);
		state.virtualY = Math.floor(screen.height / 2);
	} catch {
		resetAirpadKvmSession();
	}
}
/** Mirror virtual cursor on the desk screen only — server owns cross-screen handoff. */
var trackAirpadMotionDelta = (dx, dy, destinationId) => {
	const state = kvmSession();
	if (!state.layout || !dx && !dy) return;
	const dest = destinationId.trim();
	const screen = findKvmScreen(state.layout, dest);
	if (!screen) return;
	state.virtualX = Math.max(0, Math.min(screen.width - 1, state.virtualX + dx));
	state.virtualY = Math.max(0, Math.min(screen.height - 1, state.virtualY + dy));
	state.activePeerId = screen.peerId;
};
var getAirpadMotionKvmPayload = (destinationId) => {
	const state = kvmSession();
	if (!state.layout) return void 0;
	const dest = destinationId.trim();
	const localScreen = findKvmScreen(state.layout, dest);
	return {
		airpad: true,
		virtualX: state.virtualX,
		virtualY: state.virtualY,
		sourceDpiScale: localScreen?.dpiScale ?? 1,
		targetDpiScale: localScreen?.dpiScale ?? 1,
		sensitivity: localScreen?.sensitivity ?? 1
	};
};
var buttonNum = (button) => {
	const b = String(button || "left").toLowerCase();
	if (b === "right") return 1;
	if (b === "middle") return 2;
	return 0;
};
var encodeBinaryMouse = (type, dx, dy, flags = 0) => {
	const buffer = /* @__PURE__ */ new ArrayBuffer(8);
	const view = new DataView(buffer);
	view.setInt16(0, Math.round(dx), true);
	view.setInt16(2, Math.round(dy), true);
	view.setUint8(4, type);
	view.setUint8(5, flags);
	view.setUint16(6, encodeInputPerfTsLo(), true);
	return buffer;
};
var encodeBinaryMove = (dx, dy) => encodeBinaryMouse(0, dx, dy, 0);
var encodeBinaryScroll = (dx, dy) => encodeBinaryMouse(2, dx, dy, 0);
var encodeBinaryClick = (button, double = false) => encodeBinaryMouse(1, 0, 0, buttonNum(button) | (double ? 128 : 0));
var encodeBinaryMouseDown = (button) => encodeBinaryMouse(3, 0, 0, buttonNum(button));
var encodeBinaryMouseUp = (button) => encodeBinaryMouse(4, 0, 0, buttonNum(button));
var encodeBinaryKeyboard = (codePoint, flags = 0) => {
	const buffer = /* @__PURE__ */ new ArrayBuffer(8);
	const view = new DataView(buffer);
	view.setUint32(0, codePoint >>> 0, true);
	view.setUint8(4, 6);
	view.setUint8(5, flags);
	view.setUint16(6, encodeInputPerfTsLo(), true);
	return buffer;
};
var timingPayload = (perfTsLo) => {
	if (!perfTsLo) return {};
	return {
		perfTsLo,
		perfTs: decodeInputPerfTsLo(perfTsLo)
	};
};
/** Decode legacy 8-byte frame → JSON coordinator act (routed / gateway sessions). */
var decodeBinaryAirpadIntent = (buffer) => {
	const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
	if (bytes.byteLength < 6) return null;
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const type = view.getUint8(4);
	const timing = timingPayload(bytes.byteLength >= 8 ? view.getUint16(6, true) : 0);
	if (type === 6) {
		const codePoint = view.getUint32(0, true);
		switch (view.getUint8(5)) {
			case 1: return {
				what: "keyboard:tap",
				payload: {
					key: "backspace",
					...timing
				}
			};
			case 2: return {
				what: "keyboard:tap",
				payload: {
					key: "enter",
					...timing
				}
			};
			case 3: return {
				what: "keyboard:tap",
				payload: {
					key: "space",
					...timing
				}
			};
			case 4: return {
				what: "keyboard:tap",
				payload: {
					key: "tab",
					...timing
				}
			};
			default: return {
				what: "keyboard:type",
				payload: {
					text: String.fromCodePoint(codePoint || 0),
					...timing
				}
			};
		}
	}
	const dx = view.getInt16(0, true);
	const dy = view.getInt16(2, true);
	const flags = view.getUint8(5);
	const button = (flags & 127) === 1 ? "right" : (flags & 127) === 2 ? "middle" : "left";
	switch (type) {
		case 1: return {
			what: "mouse:click",
			payload: {
				button,
				double: Boolean(flags & 128),
				...timing
			}
		};
		case 2: return {
			what: "mouse:scroll",
			payload: {
				dx,
				dy,
				...timing
			}
		};
		case 3: return {
			what: "mouse:down",
			payload: {
				button,
				...timing
			}
		};
		case 4: return {
			what: "mouse:up",
			payload: {
				button,
				...timing
			}
		};
		default: return {
			what: "mouse:move",
			payload: {
				x: dx,
				y: dy,
				...timing
			}
		};
	}
};
//#endregion
//#region ../../modules/views/airpad-view/src/network-old/rails/packet-ws.ts
var sleep$1 = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var CLIPBOARD_CHORD_SETTLE_MS = 140;
var INPUT_V3_STORAGE_KEY = "airpad.input.v3";
var packetWsRail = () => cwspGlobal(CWSP_SLOT.airpadPacketWsRail, () => ({ inputV3Seq: 0 }));
var isInputV3Enabled = () => {
	const globalFlag = globalThis.CWS_INPUT_V3;
	if (globalFlag === true || globalFlag === "1" || globalFlag === "v3") return true;
	try {
		return globalThis.localStorage?.getItem(INPUT_V3_STORAGE_KEY) === "1";
	} catch {
		return false;
	}
};
var buildInputV3Payload = (intent) => ({
	input: "v3",
	dx: intent.dx,
	dy: intent.dy,
	seq: ++packetWsRail().inputV3Seq,
	sentAt: Date.now(),
	route: getAirPadDestinationId().trim()
});
/** Act/ask replies may be a raw string or `{ value, text, ok, handled }` from local-dispatch. */
var extractCoordinatorClipboardText = (result) => {
	if (typeof result === "string") return result;
	if (result == null) return "";
	if (typeof result !== "object") return String(result);
	const record = result;
	if (typeof record.text === "string") return record.text;
	if (typeof record.value === "string") return record.value;
	const nested = record.result ?? record.payload ?? record.data;
	if (typeof nested === "string") return nested;
	if (nested && typeof nested === "object") {
		const inner = nested;
		if (typeof inner.text === "string") return inner.text;
		if (typeof inner.value === "string") return inner.value;
	}
	return "";
};
/** WHY: legacy 8-byte frames carry no `nodes` — safe only on direct connect to the executor host. */
var canUseBinaryAirpadTransport = () => !getAirPadDestinationId().trim();
var toCoordinatorAction = (intent) => {
	switch (intent.type) {
		case "pointer.move":
			trackAirpadMotionDelta(intent.dx, intent.dy, getAirPadDestinationId());
			const kvmPayload = getAirpadMotionKvmPayload(getAirPadDestinationId());
			if (isInputV3Enabled()) return {
				what: "mouse:move",
				payload: {
					...buildInputV3Payload(intent),
					...kvmPayload ? { kvm: kvmPayload } : {}
				}
			};
			return {
				what: "mouse:move",
				payload: {
					x: intent.dx,
					y: intent.dy,
					z: intent.dz ?? 0,
					motionHz: getMotionSendHz(),
					motionPath: getMotionPathClass(),
					...kvmPayload ? { kvm: kvmPayload } : {}
				}
			};
		case "pointer.click": return {
			what: "mouse:click",
			payload: {
				button: intent.button || "left",
				double: Boolean(intent.double || intent.count === 2)
			}
		};
		case "pointer.scroll": return {
			what: "mouse:scroll",
			payload: {
				dx: intent.dx || 0,
				dy: intent.dy || 0
			}
		};
		case "pointer.down": return {
			what: "mouse:down",
			payload: { button: intent.button || "left" }
		};
		case "pointer.up": return {
			what: "mouse:up",
			payload: { button: intent.button || "left" }
		};
		case "voice.submit": return {
			what: "voice:submit",
			payload: { text: intent.text }
		};
		case "keyboard.char": switch (intent.char) {
			case "\b":
			case "": return {
				what: "keyboard:tap",
				payload: { key: "backspace" }
			};
			case "\n":
			case "\r": return {
				what: "keyboard:tap",
				payload: { key: "enter" }
			};
			case "	": return {
				what: "keyboard:tap",
				payload: { key: "tab" }
			};
			default:
				if (intent.char === " ") return {
					what: "keyboard:tap",
					payload: { key: "space" }
				};
				return {
					what: "keyboard:type",
					payload: { text: intent.char }
				};
		}
		case "keyboard.binary": switch (intent.flags ?? 0) {
			case 1: return {
				what: "keyboard:tap",
				payload: { key: "backspace" }
			};
			case 2: return {
				what: "keyboard:tap",
				payload: { key: "enter" }
			};
			case 3: return {
				what: "keyboard:tap",
				payload: { key: "space" }
			};
			case 4: return {
				what: "keyboard:tap",
				payload: { key: "tab" }
			};
			default: return {
				what: "keyboard:type",
				payload: { text: String.fromCodePoint(intent.codePoint) }
			};
		}
		case "gesture.swipe": return null;
	}
};
var trySendBinaryIntent = (intent) => {
	if (!canUseBinaryAirpadTransport()) return false;
	if (!isWSConnected()) return false;
	switch (intent.type) {
		case "pointer.move": return sendWsBinary(encodeBinaryMove(intent.dx, intent.dy));
		case "pointer.scroll": return sendWsBinary(encodeBinaryScroll(intent.dx || 0, intent.dy || 0));
		case "pointer.click": return sendWsBinary(encodeBinaryClick(intent.button, Boolean(intent.double || intent.count === 2)));
		case "pointer.down": return sendWsBinary(encodeBinaryMouseDown(intent.button));
		case "pointer.up": return sendWsBinary(encodeBinaryMouseUp(intent.button));
		case "keyboard.binary": return sendWsBinary(encodeBinaryKeyboard(intent.codePoint, intent.flags ?? 0));
		default: return false;
	}
};
var sendKeyboardChord = async (key, modifier = ["ctrl"]) => {
	await sendCoordinatorRequest("keyboard:tap", {
		key,
		modifier
	}, resolveInputRouteNodes());
};
var requestClipboardRead = async () => {
	return extractCoordinatorClipboardText(await sendCoordinatorRequest("clipboard:get", {}, resolveInputRouteNodes()));
};
var requestClipboardWrite = async (text) => {
	await sendCoordinatorRequest("clipboard:update", { text }, resolveInputRouteNodes());
};
var initPacketWsRail = (button) => {
	initWebSocket(button);
};
var connectPacketWsRail = () => {
	connectWS();
};
var disconnectPacketWsRail = () => {
	disconnectWS();
};
var isPacketWsRailConnected = () => {
	return isWSConnected();
};
var onPacketWsRailConnectionChange = (handler) => {
	return onWSConnectionChange((connected) => {
		if (connected) {
			sendCoordinatorRequest("mouse:isReady", {}, resolveInputRouteNodes()).catch(() => void 0);
			refreshAirpadKvmSession((what, payload) => sendCoordinatorRequest(what, payload, resolveInputRouteNodes()), getAirPadDestinationId());
		} else resetAirpadKvmSession();
		handler(connected);
	});
};
var onPacketWsClipboardUpdate = (handler) => {
	return onServerClipboardUpdate(handler);
};
var resolveInputRouteNodes = () => {
	const target = getAirPadDestinationId().trim();
	return target ? [target] : void 0;
};
var sendPacketWsIntent = (intent) => {
	if (intent.type === "gesture.swipe") return;
	if (trySendBinaryIntent(intent)) return;
	const action = toCoordinatorAction(intent);
	if (!action) return;
	sendCoordinatorAct(action.what, action.payload, resolveInputRouteNodes());
};
var sendPacketWsBinary = (buffer) => {
	if (canUseBinaryAirpadTransport() && sendWsBinary(buffer)) return;
	const decoded = decodeBinaryAirpadIntent(buffer);
	if (decoded) {
		sendCoordinatorAct(decoded.what, decoded.payload, resolveInputRouteNodes());
		return;
	}
};
var createPacketWsKeyboardMessage = (codePoint, flags = 0) => {
	return encodeBinaryKeyboard(codePoint, flags);
};
var requestPacketWsClipboardRead = async () => {
	if (!isShellRemoteClipboardBridgeEnabled()) return {
		ok: false,
		error: "Remote clipboard bridge disabled in Settings → Server → Embedded shell."
	};
	try {
		return {
			ok: true,
			text: await requestClipboardRead()
		};
	} catch (error) {
		return {
			ok: false,
			error: error?.error || error?.message || String(error)
		};
	}
};
var requestPacketWsClipboardCopy = async () => {
	if (!isShellRemoteClipboardBridgeEnabled()) return {
		ok: false,
		error: "Remote clipboard bridge disabled in Settings → Server → Embedded shell."
	};
	try {
		await sendKeyboardChord("c", ["ctrl"]);
		await sleep$1(CLIPBOARD_CHORD_SETTLE_MS);
		return await requestPacketWsClipboardRead();
	} catch (error) {
		return {
			ok: false,
			error: error?.error || error?.message || String(error)
		};
	}
};
var requestPacketWsClipboardCut = async () => {
	if (!isShellRemoteClipboardBridgeEnabled()) return {
		ok: false,
		error: "Remote clipboard bridge disabled in Settings → Server → Embedded shell."
	};
	try {
		await sendKeyboardChord("x", ["ctrl"]);
		await sleep$1(CLIPBOARD_CHORD_SETTLE_MS);
		return await requestPacketWsClipboardRead();
	} catch (error) {
		return {
			ok: false,
			error: error?.error || error?.message || String(error)
		};
	}
};
var requestPacketWsClipboardPaste = async (text) => {
	if (!isShellRemoteClipboardBridgeEnabled()) return {
		ok: false,
		error: "Remote clipboard bridge disabled in Settings → Server → Embedded shell."
	};
	const normalized = String(text ?? "");
	if (!normalized.trim()) return {
		ok: false,
		error: "empty clipboard text"
	};
	const nodes = resolveInputRouteNodes();
	try {
		await sendCoordinatorRequest("keyboard:type", { text: normalized }, nodes);
		return { ok: true };
	} catch (typeError) {
		try {
			await requestClipboardWrite(normalized);
			await sleep$1(CLIPBOARD_CHORD_SETTLE_MS);
			await sendKeyboardChord("v", ["ctrl"]);
			return { ok: true };
		} catch (pasteError) {
			return {
				ok: false,
				error: pasteError?.error || pasteError?.message || typeError?.error || typeError?.message || String(pasteError)
			};
		}
	}
};
//#endregion
//#region ../../modules/views/airpad-view/src/network-old/coordinator.ts
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var snapshotState = () => {
	const connected = isPacketWsRailConnected();
	return {
		connected,
		state: connected ? "connected" : "disconnected",
		host: getRemoteHost(),
		protocol: getRemoteProtocol(),
		detail: connected ? null : "disconnected",
		timestampMs: Date.now()
	};
};
/**
* AirPad-specific coordinator abstraction that aligns with the CRX network
* coordinator contract while preserving existing rail-level features.
*/
var buildAirPadNetworkCoordinator = () => ({
	init(button) {
		initPacketWsRail(button);
		if (shouldUseNativeCoordinatorTransport()) refreshTransportConnectionStatus();
	},
	connect() {
		if (shouldUseNativeCoordinatorTransport()) {
			refreshTransportConnectionStatus();
			return;
		}
		connectPacketWsRail();
	},
	disconnect() {
		if (isMaintainHubSocketConnectionEnabled() || isClipboardHubBootstrapEnabled()) return;
		disconnectPacketWsRail();
	},
	reconnectAfterConfigChange(options) {
		invalidateAirpadTransportCredentials();
		refreshMotionSendRateFromConfig();
		const delayMs = options?.delayMs ?? 80;
		(async () => {
			await sleep(delayMs);
			if (!options?.skipNativeSync) await syncAirpadRemoteConfigToNativeShell();
			if (shouldUseNativeCoordinatorTransport()) {
				if (await reconnectNativeCoordinatorTransport()) await refreshTransportConnectionStatus();
				else markTransportDisconnected();
				return;
			}
			reconnectTransportAfterLifecycleResume("airpad-config");
		})().catch(() => {
			console.warn("[AirPad] reconnect after config failed");
		});
	},
	isConnected() {
		return isWSConnected();
	},
	getRemoteHost() {
		return getRemoteHost();
	},
	getState() {
		return snapshotState();
	},
	onConnectionChange(handler) {
		return onPacketWsRailConnectionChange(handler);
	},
	onServerClipboardUpdate(handler) {
		return onPacketWsClipboardUpdate(handler);
	},
	onStateChange(handler) {
		handler(snapshotState().state, snapshotState().detail);
		const off = onPacketWsRailConnectionChange((connected) => {
			handler(connected ? "connected" : "disconnected", connected ? null : "disconnected");
		});
		return () => {
			off();
		};
	},
	onVoiceMessage(handler) {
		return onVoiceResult((message) => {
			handler(message);
		});
	},
	sendCoordinatorAct(what, payload, nodes) {
		return sendCoordinatorAct(what, payload, nodes);
	},
	sendCoordinatorAsk(what, payload, nodes) {
		return sendCoordinatorAsk(what, payload, nodes);
	},
	sendCoordinatorRequest(what, payload, nodes) {
		return sendCoordinatorRequest(what, payload, nodes);
	},
	sendAirPadIntent(intent) {
		sendPacketWsIntent(intent);
	},
	sendAirPadKeyboardChar(char) {
		sendPacketWsIntent({
			type: "keyboard.char",
			char
		});
	},
	createAirPadKeyboardMessage(codePoint, flags = 0) {
		return createPacketWsKeyboardMessage(codePoint, flags);
	},
	sendAirPadBinaryMessage(buffer) {
		sendPacketWsBinary(buffer);
	},
	requestClipboardRead() {
		return requestPacketWsClipboardRead();
	},
	requestClipboardCopy() {
		return requestPacketWsClipboardCopy();
	},
	requestClipboardCut() {
		return requestPacketWsClipboardCut();
	},
	requestClipboardPaste(text) {
		return requestPacketWsClipboardPaste(text);
	},
	requestClipboardHistory(target) {
		return sendCoordinatorRequest("clipboard:get", {
			request: "history",
			target
		}, [target]);
	},
	sendClipboardUpdate(text, target) {
		return sendCoordinatorRequest("clipboard:update", target ? {
			text,
			target
		} : { text }, target ? [target] : void 0);
	}
});
var airPadNetworkCoordinator = cwspGlobal(CWSP_SLOT.airpadCoordinator, buildAirPadNetworkCoordinator);
//#endregion
//#region ../../modules/views/airpad-view/src/network-old/session.ts
var initAirPadSessionTransport = (button) => {
	airPadNetworkCoordinator.init(button);
};
var connectAirPadSession = () => {
	airPadNetworkCoordinator.connect();
};
var disconnectAirPadSession = () => {
	airPadNetworkCoordinator.disconnect();
};
/**
* After changing host/secrets/mode: drop WebSocket, clear AES/HMAC caches, then connect again.
* Mirrors legacy "Save & Reconnect" behavior.
*/
function reconnectAirPadSessionAfterConfigChange(options) {
	airPadNetworkCoordinator.reconnectAfterConfigChange(options);
}
var isAirPadSessionConnected = () => {
	return airPadNetworkCoordinator.isConnected();
};
var onAirPadSessionConnectionChange = (handler) => {
	return airPadNetworkCoordinator.onConnectionChange(handler);
};
var onAirPadRemoteClipboardUpdate = (handler) => {
	return airPadNetworkCoordinator.onServerClipboardUpdate(handler);
};
var onAirPadVoiceMessage = (handler) => {
	return airPadNetworkCoordinator.onVoiceMessage(handler);
};
var sendAirPadIntent = (intent) => {
	airPadNetworkCoordinator.sendAirPadIntent(intent);
};
var sendAirPadKeyboardChar = (char) => {
	airPadNetworkCoordinator.sendAirPadKeyboardChar(char);
};
var requestAirPadClipboardRead = async () => {
	return airPadNetworkCoordinator.requestClipboardRead();
};
var requestAirPadClipboardCopy = async () => {
	return airPadNetworkCoordinator.requestClipboardCopy();
};
var requestAirPadClipboardCut = async () => {
	return airPadNetworkCoordinator.requestClipboardCut();
};
var requestAirPadClipboardPaste = async (text) => {
	return airPadNetworkCoordinator.requestClipboardPaste(text);
};
//#endregion
//#region ../../modules/views/airpad-view/src/input-old/keyboard/message.ts
function sendKeyboardChar(char) {
	if (!isAirPadSessionConnected()) return;
	sendAirPadKeyboardChar(char);
}
//#endregion
//#region ../../modules/views/airpad-view/src/input-old/keyboard/ui.ts
function createKeyboardHTML() {
	return `
        <div class="virtual-keyboard-container" data-hidden="true" aria-hidden="true">
            <div class="keyboard-header">
                <button type="button" name="airpad-keyboard-close" class="keyboard-close" aria-label="Close keyboard">✕</button>
                <div class="keyboard-tabs">
                    <button type="button" name="airpad-keyboard-tab-letters" class="keyboard-tab active" data-tab="letters">ABC</button>
                    <button type="button" name="airpad-keyboard-tab-emoji" class="keyboard-tab" data-tab="emoji">😀</button>
                </div>
            </div>
            <div class="keyboard-content">
                <div class="keyboard-panel active" data-panel="letters">
                    <div class="keyboard-shift-container">
                        <button type="button" name="airpad-keyboard-shift" class="keyboard-shift" data-shift="lower">⇧</button>
                    </div>
                    <div class="keyboard-rows" id="keyboardRows"></div>
                    <div class="keyboard-special">
                        <button class="keyboard-key special space" data-key=" ">Space</button>
                        <button class="keyboard-key special backspace" data-key="backspace">⌫</button>
                        <button class="keyboard-key special enter" data-key="enter">↵</button>
                    </div>
                </div>
                <div class="keyboard-panel" data-panel="emoji">
                    <div class="emoji-categories">
                        ${Object.keys(EMOJI_CATEGORIES).map((cat) => `<button class="emoji-category-btn" data-category="${cat}">${cat}</button>`).join("")}
                    </div>
                    <div class="emoji-grid" id="emojiGrid"></div>
                </div>
            </div>
        </div>
    `;
}
function renderKeyboard(isUpper = false) {
	const rowsEl = getKeyboardElement()?.querySelector("#keyboardRows");
	if (!rowsEl) return;
	rowsEl.innerHTML = "";
	(isUpper ? KEYBOARD_LAYOUT_UPPER : KEYBOARD_LAYOUT).forEach((row) => {
		const rowEl = document.createElement("div");
		rowEl.className = "keyboard-row";
		row.forEach((key) => {
			const keyEl = document.createElement("button");
			keyEl.className = "keyboard-key";
			keyEl.textContent = key;
			keyEl.setAttribute("data-key", key);
			keyEl.addEventListener("click", () => handleKeyPress(key));
			rowEl.appendChild(keyEl);
		});
		rowsEl.appendChild(rowEl);
	});
}
function renderEmoji(category) {
	const gridEl = getKeyboardElement()?.querySelector("#emojiGrid");
	if (!gridEl) return;
	const emojis = EMOJI_CATEGORIES[category] || [];
	gridEl.innerHTML = "";
	emojis.forEach((emoji) => {
		const emojiEl = document.createElement("button");
		emojiEl.className = "emoji-key";
		emojiEl.textContent = emoji;
		emojiEl.setAttribute("data-emoji", emoji);
		emojiEl.addEventListener("click", () => handleKeyPress(emoji));
		gridEl.appendChild(emojiEl);
	});
}
function handleKeyPress(key) {
	if (key === "backspace") sendKeyboardChar("\b");
	else if (key === "enter") sendKeyboardChar("\n");
	else sendKeyboardChar(key);
}
function restoreButtonIcon() {
	const toggleButton = getToggleButton();
	if (!toggleButton) return;
	toggleButton.textContent = "⌨️";
	if (!toggleButton.isConnected) return;
	const ownerDoc = toggleButton.ownerDocument;
	if (!ownerDoc) return;
	if (ownerDoc.activeElement !== toggleButton) return;
	const textNode = toggleButton.firstChild;
	const sel = globalThis?.getSelection?.();
	if (!(textNode instanceof Text) || !sel) return;
	try {
		const range = ownerDoc.createRange();
		range.setStart(textNode, Math.min(1, toggleButton.textContent?.length ?? 0));
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	} catch {}
}
//#endregion
//#region ../../modules/projects/subsystem/src/routing/policies/event-handling-policy.ts
/**
* Shared rules for UI event handlers:
* - Do not use stopImmediatePropagation unless one listener must exclude every other on the same target.
* - Prefer stopPropagation only to block bubble to known parents (stacked overlays, toolbars).
* - Avoid document/window capture listeners that call stop* unless strictly scoped to a feature.
* - Use passive: true when preventDefault is never called.
*/
function stopBubbling(ev) {
	ev.stopPropagation();
}
/**
* Wait until after the next two animation frames so layout/style for freshly inserted nodes
* is flushed before querying the DOM and attaching listeners (Airpad, overlays, keyboard).
*/
function waitForDomPaint() {
	const raf = globalThis.requestAnimationFrame?.bind(globalThis);
	if (typeof raf !== "function") return Promise.resolve();
	return new Promise((resolve) => {
		raf(() => {
			raf(() => resolve());
		});
	});
}
//#endregion
//#region src/shared/other/document/DocTools.ts
var coordinate = [0, 0];
var lastElement = [null];
/** Resolve event target to an HTMLElement (e.g. parent of a Text node). */
function eventTargetElement(ev) {
	const t = ev.target;
	if (t instanceof HTMLElement) return t;
	if (t instanceof Node && t.nodeType === Node.TEXT_NODE && t.parentElement) return t.parentElement;
	const path = ev.composedPath?.() ?? [];
	for (const n of path) if (n instanceof HTMLElement) return n;
	return null;
}
/** Update last pointer coordinates when the event carries client geometry (Mouse/Pointer). */
var saveCoordinate = (e) => {
	if (e instanceof PointerEvent || e instanceof MouseEvent) {
		const x = e.clientX;
		const y = e.clientY;
		if (Number.isFinite(x) && Number.isFinite(y)) {
			coordinate[0] = x;
			coordinate[1] = y;
		}
	}
};
if (typeof document !== "undefined") try {
	document.addEventListener("pointerup", saveCoordinate, { passive: true });
	document.addEventListener("pointerdown", saveCoordinate, { passive: true });
	document.addEventListener("click", saveCoordinate, { passive: true });
	document.addEventListener("contextmenu", (e) => {
		saveCoordinate(e);
		lastElement[0] = eventTargetElement(e) ?? lastElement[0];
	}, { passive: true });
} catch {}
//#endregion
//#region ../../modules/views/airpad-view/src/input-old/keyboard/handlers.ts
/** AbortController for document-level dismiss listeners (scoped to airpad owner document). */
var keyboardDismissAbort = null;
/** Hide OS virtual keyboard via navigator API (safe no-op when unsupported). */
function forceHideNavigatorVirtualKeyboard() {
	const vk = globalThis.navigator?.virtualKeyboard;
	try {
		vk?.hide?.();
	} catch (error) {
		console.warn(error);
	}
	const toggleButton = getToggleButton();
	if (toggleButton instanceof HTMLElement) {
		toggleButton.setAttribute("virtualkeyboardpolicy", "manual");
		if (toggleButton.isContentEditable) toggleButton.contentEditable = "false";
	}
	try {
		vk?.hide?.();
	} catch (error) {
		console.warn(error);
	}
}
/** Blur airpad fields that keep the OS keyboard attached (toggle CE, inputs). */
function blurAirpadKeyboardFocus() {
	const active = getAirpadOwnerDocument()?.activeElement;
	if (!(active instanceof HTMLElement)) return;
	if (!active.closest(".view-cwsp")) return;
	if (active.matches("[contenteditable=\"true\"], input, textarea, select, .keyboard-toggle")) active.blur();
}
/**
* Dismiss OS + overlay keyboards before Air/control gestures.
* WHY: Android WebView keeps VK open when focus stays on the contenteditable toggle.
*/
function dismissKeyboardForControlInteraction() {
	forceHideNavigatorVirtualKeyboard();
	blurAirpadKeyboardFocus();
	hideKeyboard();
}
var CONTROL_DISMISS_SELECTOR = ".big-button, .neighbor-button, .toolbar-btn:not(.keyboard-toggle), .side-log-toggle, .ghost-btn, [data-no-virtual-keyboard=\"true\"]";
var KEYBOARD_UI_SELECTOR = ".virtual-keyboard-container, .keyboard-key";
function shouldDismissKeyboardForTarget(el) {
	if (!el) return false;
	if (el.closest(".keyboard-toggle")) return false;
	if (el.closest(KEYBOARD_UI_SELECTOR)) return false;
	if (el.closest("#clipboardToolbar, .bottom-toolbar")) return false;
	return Boolean(el.closest(CONTROL_DISMISS_SELECTOR));
}
/** Capture pointerdown on control surfaces so open VK does not steal Air gestures. */
function setupControlInteractionKeyboardDismiss(root, signal) {
	const mount = root.closest?.(".view-cwsp") ?? root.querySelector?.(".view-cwsp") ?? root;
	if (!(mount instanceof HTMLElement)) return;
	const doc = getAirpadOwnerDocument();
	if (!doc) return;
	const onPointerDown = (e) => {
		if (!shouldDismissKeyboardForTarget(eventTargetElement(e))) return;
		dismissKeyboardForControlInteraction();
	};
	mount.addEventListener("pointerdown", onPointerDown, {
		capture: true,
		passive: true,
		signal
	});
	doc.addEventListener("pointerdown", onPointerDown, {
		capture: true,
		passive: true,
		signal
	});
}
/** Remove focus/pointer dismiss listeners (call on Airpad unmount). */
function teardownKeyboardDismissListeners() {
	try {
		keyboardDismissAbort?.abort();
	} catch {}
	keyboardDismissAbort = null;
}
var keyboardToggleClickBound = /* @__PURE__ */ new WeakSet();
var keyboardToggleApiBound = /* @__PURE__ */ new WeakSet();
var keyboardContainerUiBound = /* @__PURE__ */ new WeakSet();
/** Outside taps must not close the keyboard when interacting with these regions. */
var KEYBOARD_STAYS_OPEN_MATCHES = "input,textarea,select,[contenteditable=\"true\"]";
var KEYBOARD_STAYS_OPEN_CLOSEST = ".config-overlay, .virtual-keyboard-container, .keyboard-toggle, .log-overlay.open, .log-panel, .airpad-config-overlay";
function isKeyboardStayOpenTarget(el) {
	if (!el) return false;
	return Boolean(el.matches?.(KEYBOARD_STAYS_OPEN_MATCHES) || el.closest?.(KEYBOARD_STAYS_OPEN_CLOSEST));
}
function isConfigOverlayVisible() {
	const doc = getAirpadOwnerDocument();
	const overlay = doc?.querySelector(".airpad-config-overlay") ?? doc?.querySelector(".config-overlay");
	if (!overlay) return false;
	return overlay.style.display === "flex" || overlay.classList.contains("flex");
}
function setVkStatus(text) {
	const vkStatusEl = getVkStatusEl();
	if (vkStatusEl) vkStatusEl.textContent = text;
}
function showKeyboard() {
	if (!isRemoteKeyboardEnabled()) return;
	if (isConfigOverlayVisible()) return;
	const keyboardElement = getKeyboardElement();
	const virtualKeyboardAPI = getVirtualKeyboardAPI();
	const toggleButton = getToggleButton();
	if (virtualKeyboardAPI) {
		if (toggleButton) {
			toggleButton.contentEditable = "true";
			toggleButton.setAttribute("virtualkeyboardpolicy", "manual");
		}
		restoreButtonIcon();
		toggleButton?.focus({ preventScroll: true });
		virtualKeyboardAPI.show();
		setVkStatus("overlay:on / policy:manual");
	} else {
		setKeyboardVisible(true);
		keyboardElement?.classList?.add?.("visible");
		setVkStatus("overlay:off");
	}
	renderKeyboard(false);
	renderEmoji("smileys");
}
var isHidingKeyboard = false;
function hideKeyboard() {
	if (isHidingKeyboard) return;
	isHidingKeyboard = true;
	try {
		const keyboardElement = getKeyboardElement();
		const virtualKeyboardAPI = getVirtualKeyboardAPI();
		const toggleButton = getToggleButton();
		setKeyboardVisible(false);
		keyboardElement?.classList?.remove?.("visible");
		if (virtualKeyboardAPI) {
			restoreButtonIcon();
			virtualKeyboardAPI.hide();
			if (toggleButton) {
				toggleButton.contentEditable = "false";
				toggleButton.removeAttribute("virtualkeyboardpolicy");
			}
			toggleButton?.blur();
			setVkStatus("overlay:on / policy:auto");
		}
	} finally {
		isHidingKeyboard = false;
	}
}
function toggleKeyboard() {
	if (isKeyboardVisible()) hideKeyboard();
	else showKeyboard();
}
function setupToggleButtonHandler() {
	const toggleButton = getToggleButton();
	if (!toggleButton) return;
	if (keyboardToggleClickBound.has(toggleButton)) return;
	keyboardToggleClickBound.add(toggleButton);
	toggleButton.addEventListener("click", (e) => {
		stopBubbling(e);
		if (!isRemoteKeyboardEnabled()) {
			log("Keyboard is available after WS connection");
			return;
		}
		if (isConfigOverlayVisible()) return;
		toggleKeyboard();
	});
}
function setupVirtualKeyboardAPIHandlers() {
	const virtualKeyboardAPI = getVirtualKeyboardAPI();
	const toggleButton = getToggleButton();
	if (!virtualKeyboardAPI || !toggleButton) return;
	if (keyboardToggleApiBound.has(toggleButton)) return;
	keyboardToggleApiBound.add(toggleButton);
	const ICON = "⌨️";
	let pendingRestore = null;
	let lastHandledKey = null;
	let lastHandledTime = 0;
	const DEDUP_WINDOW_MS = 20;
	let waitingForInput = false;
	let lastKnownContent = ICON;
	let beforeInputFired = false;
	let isComposing = false;
	let lastCompositionText = "";
	let compositionTimeout = null;
	const COMPOSITION_TIMEOUT_MS = 600;
	const resetCompositionState = (immediate = false) => {
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		if (immediate) {
			isComposing = false;
			lastCompositionText = "";
		} else compositionTimeout = globalThis.setTimeout(() => {
			isComposing = false;
			lastCompositionText = "";
			compositionTimeout = null;
		}, COMPOSITION_TIMEOUT_MS);
	};
	const shouldSkipDuplicate = (key) => {
		const normalizedKey = key.includes(":") ? key.split(":").slice(1).join(":") : key;
		const now = Date.now();
		if (lastHandledKey === normalizedKey && now - lastHandledTime < DEDUP_WINDOW_MS) return true;
		lastHandledKey = normalizedKey;
		lastHandledTime = now;
		return false;
	};
	const scheduleRestore = () => {
		queueMicrotask(() => {
			pendingRestore = null;
			restoreButtonIcon();
			lastKnownContent = ICON;
		});
	};
	const sendAndRestore = (char) => {
		if (!isRemoteKeyboardEnabled()) return;
		sendKeyboardChar(char);
		scheduleRestore();
	};
	const TEXT_STREAM_CHUNK_SIZE = 256;
	const TEXT_STREAM_SOFT_LIMIT = 12e3;
	const TEXT_STREAM_HARD_LIMIT = 12e4;
	let streamToken = 0;
	const toUnicodeUnits = (text) => Array.from(String(text || ""));
	const sendTextChunked = (text, dedupeKey) => {
		const raw = String(text || "");
		if (!raw) {
			scheduleRestore();
			return;
		}
		if (dedupeKey && shouldSkipDuplicate(dedupeKey)) {
			scheduleRestore();
			return;
		}
		let safeUnits = toUnicodeUnits(raw);
		if (safeUnits.length > TEXT_STREAM_HARD_LIMIT) {
			safeUnits = safeUnits.slice(0, TEXT_STREAM_HARD_LIMIT);
			log(`[AirPad] Input truncated to ${TEXT_STREAM_HARD_LIMIT} chars to avoid UI freeze.`);
		} else if (safeUnits.length > TEXT_STREAM_SOFT_LIMIT) log(`[AirPad] Streaming large input (${safeUnits.length} chars) in chunks.`);
		const token = ++streamToken;
		let index = 0;
		const pump = () => {
			if (token !== streamToken) return;
			if (!isRemoteKeyboardEnabled()) return;
			const end = Math.min(index + TEXT_STREAM_CHUNK_SIZE, safeUnits.length);
			for (let i = index; i < end; i++) sendKeyboardChar(safeUnits[i]);
			index = end;
			if (index < safeUnits.length) {
				globalThis.setTimeout(pump, 0);
				return;
			}
			scheduleRestore();
		};
		pump();
	};
	/** IME/composition: cancel in-flight chunked sends when a new update arrives (latest wins). */
	let compositionPumpGen = 0;
	const sendCompositionTextChunked = (text, onDone) => {
		const raw = String(text || "");
		if (!raw) {
			onDone?.();
			return;
		}
		let safeUnits = toUnicodeUnits(raw);
		if (safeUnits.length > TEXT_STREAM_HARD_LIMIT) {
			safeUnits = safeUnits.slice(0, TEXT_STREAM_HARD_LIMIT);
			log(`[AirPad] Composition text truncated to ${TEXT_STREAM_HARD_LIMIT} chars to avoid UI freeze.`);
		} else if (safeUnits.length > TEXT_STREAM_SOFT_LIMIT) log(`[AirPad] Streaming large composition input (${safeUnits.length} chars) in chunks.`);
		const gen = compositionPumpGen;
		let index = 0;
		const pump = () => {
			if (gen !== compositionPumpGen) return;
			if (!isRemoteKeyboardEnabled()) return;
			const end = Math.min(index + TEXT_STREAM_CHUNK_SIZE, safeUnits.length);
			for (let i = index; i < end; i++) sendKeyboardChar(safeUnits[i]);
			index = end;
			if (index < safeUnits.length) {
				globalThis.setTimeout(pump, 0);
				return;
			}
			onDone?.();
		};
		pump();
	};
	const sendCompositionBackspacesChunked = (count, onDone) => {
		if (count <= 0) {
			onDone?.();
			return;
		}
		const gen = compositionPumpGen;
		let remaining = count;
		const pump = () => {
			if (gen !== compositionPumpGen) return;
			if (!isRemoteKeyboardEnabled()) return;
			const n = Math.min(remaining, TEXT_STREAM_CHUNK_SIZE);
			for (let i = 0; i < n; i++) sendKeyboardChar("\b");
			remaining -= n;
			if (remaining > 0) {
				globalThis.setTimeout(pump, 0);
				return;
			}
			onDone?.();
		};
		pump();
	};
	const sendCompositionReplaceChunked = (backspaceCount, newText, onDone) => {
		let t = String(newText || "");
		if (t.length > TEXT_STREAM_HARD_LIMIT) {
			t = t.slice(0, TEXT_STREAM_HARD_LIMIT);
			log(`[AirPad] Composition replacement truncated to ${TEXT_STREAM_HARD_LIMIT} chars.`);
		}
		sendCompositionBackspacesChunked(backspaceCount, () => {
			if (!t) {
				onDone();
				return;
			}
			sendCompositionTextChunked(t, onDone);
		});
	};
	/** Small IME deltas stay synchronous to preserve ordering with lastCompositionText. */
	const COMPOSITION_INLINE_MAX = 256;
	const getCleanText = (text) => {
		return text.replace(/⌨️/g, "").replace(/⌨\uFE0F?/g, "").replace(/\uFE0F/g, "");
	};
	const findNewCharacters = (currentText, previousText) => {
		const cleanCurrent = getCleanText(currentText);
		const cleanPrevious = getCleanText(previousText);
		if (cleanCurrent.startsWith(cleanPrevious)) return cleanCurrent.slice(cleanPrevious.length);
		if (cleanPrevious.startsWith(cleanCurrent)) return "";
		return cleanCurrent;
	};
	toggleButton.addEventListener("keydown", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		if (e.isComposing) {
			if (compositionTimeout !== null) {
				clearTimeout(compositionTimeout);
				compositionTimeout = null;
			}
			return;
		}
		if (isComposing && !e.isComposing) resetCompositionState(true);
		beforeInputFired = false;
		if ((e.ctrlKey || e.metaKey) && !e.altKey) {
			const lowerKey = String(e.key || "").toLowerCase();
			if (lowerKey === "c" || lowerKey === "x") {
				e.preventDefault();
				waitingForInput = false;
				resetCompositionState(true);
				return;
			}
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault();
			waitingForInput = false;
			if (!shouldSkipDuplicate("backspace")) sendAndRestore("\b");
			return;
		}
		if (e.key === "Enter") {
			e.preventDefault();
			waitingForInput = false;
			resetCompositionState(true);
			if (!shouldSkipDuplicate("enter")) sendAndRestore("\n");
			return;
		}
		if (e.key === "Tab") {
			e.preventDefault();
			waitingForInput = false;
			if (!shouldSkipDuplicate("tab")) sendAndRestore("	");
			return;
		}
		if (e.key === "Unidentified" || e.key === "Process" || e.key === "") {
			waitingForInput = true;
			lastKnownContent = toggleButton.textContent || ICON;
			return;
		}
		if (e.key === " ") {
			e.preventDefault();
			waitingForInput = false;
			resetCompositionState(true);
			return;
		}
		if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
			e.preventDefault();
			waitingForInput = false;
			return;
		}
		waitingForInput = false;
	});
	toggleButton.addEventListener("beforeinput", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		const inputEvent = e;
		lastKnownContent = toggleButton.textContent || ICON;
		beforeInputFired = true;
		if (inputEvent.inputType === "insertCompositionText") {
			if (compositionTimeout !== null) {
				clearTimeout(compositionTimeout);
				compositionTimeout = null;
			}
			return;
		}
		if (inputEvent.inputType === "insertText" && isComposing) resetCompositionState(true);
		if (waitingForInput && inputEvent.inputType === "insertText" && inputEvent.data) {
			e.preventDefault();
			waitingForInput = false;
			sendTextChunked(inputEvent.data, `text:${inputEvent.data}`);
			return;
		}
		if (inputEvent.inputType === "insertText") {
			e.preventDefault();
			const data = inputEvent.data;
			if (data) sendTextChunked(data, `text:${data}`);
			return;
		}
		if (inputEvent.inputType === "insertReplacementText") {
			e.preventDefault();
			resetCompositionState(true);
			const data = inputEvent.data || inputEvent.dataTransfer?.getData("text");
			if (data) sendTextChunked(data, `replace:${data}`);
			return;
		}
		if (inputEvent.inputType === "insertLineBreak" || inputEvent.inputType === "insertParagraph") {
			e.preventDefault();
			resetCompositionState(true);
			if (!shouldSkipDuplicate("linebreak")) sendAndRestore("\n");
			return;
		}
		if (inputEvent.inputType === "deleteContentBackward" || inputEvent.inputType === "deleteContentForward") {
			e.preventDefault();
			if (!shouldSkipDuplicate("deleteback")) sendAndRestore("\b");
			return;
		}
		if (inputEvent.inputType === "insertFromPaste") {
			e.preventDefault();
			resetCompositionState(true);
			const data = inputEvent.data || inputEvent.dataTransfer?.getData("text/plain");
			if (data) sendTextChunked(data);
			return;
		}
	});
	toggleButton.addEventListener("compositionstart", () => {
		if (!isRemoteKeyboardEnabled()) return;
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		isComposing = true;
		lastCompositionText = "";
		waitingForInput = false;
		compositionPumpGen++;
	});
	toggleButton.addEventListener("compositionupdate", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		compositionPumpGen++;
		const currentText = e.data || "";
		const finishUpdate = () => {
			lastCompositionText = currentText;
			scheduleRestore();
		};
		if (currentText.startsWith(lastCompositionText)) {
			const newChars = currentText.slice(lastCompositionText.length);
			if (newChars.length > 0) if (newChars.length <= COMPOSITION_INLINE_MAX) {
				for (const char of newChars) sendKeyboardChar(char);
				finishUpdate();
			} else sendCompositionTextChunked(newChars, finishUpdate);
			else finishUpdate();
		} else if (lastCompositionText.startsWith(currentText)) {
			const deletedCount = toUnicodeUnits(lastCompositionText).length - toUnicodeUnits(currentText).length;
			if (deletedCount <= COMPOSITION_INLINE_MAX) {
				for (let i = 0; i < deletedCount; i++) sendKeyboardChar("\b");
				finishUpdate();
			} else sendCompositionBackspacesChunked(deletedCount, finishUpdate);
		} else {
			const bs = toUnicodeUnits(lastCompositionText).length;
			const nextLength = toUnicodeUnits(currentText).length;
			if (bs <= COMPOSITION_INLINE_MAX && nextLength <= COMPOSITION_INLINE_MAX) {
				for (let i = 0; i < bs; i++) sendKeyboardChar("\b");
				for (const char of currentText) sendKeyboardChar(char);
				finishUpdate();
			} else sendCompositionReplaceChunked(bs, currentText, finishUpdate);
		}
	});
	toggleButton.addEventListener("compositionend", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		compositionPumpGen++;
		const finalText = e.data || "";
		const finishEnd = () => {
			isComposing = false;
			lastCompositionText = "";
			scheduleRestore();
		};
		if (finalText !== lastCompositionText) {
			const bs = toUnicodeUnits(lastCompositionText).length;
			const finalLength = toUnicodeUnits(finalText).length;
			if (bs <= COMPOSITION_INLINE_MAX && finalLength <= COMPOSITION_INLINE_MAX) {
				for (let i = 0; i < bs; i++) sendKeyboardChar("\b");
				for (const char of finalText) sendKeyboardChar(char);
				finishEnd();
			} else sendCompositionReplaceChunked(bs, finalText, finishEnd);
		} else finishEnd();
	});
	toggleButton.addEventListener("input", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		const inputEvent = e;
		if (inputEvent.inputType === "insertCompositionText" || inputEvent.inputType?.includes("Composition")) return;
		if (isComposing) return;
		const currentText = e.target.textContent || "";
		if (waitingForInput) {
			waitingForInput = false;
			const newChars = findNewCharacters(currentText, lastKnownContent);
			if (newChars.length > 0 && !shouldSkipDuplicate(`unidentified:${newChars}`)) sendTextChunked(newChars);
			scheduleRestore();
			return;
		}
		if (!beforeInputFired) {
			const newChars = findNewCharacters(currentText, lastKnownContent);
			if (newChars.length > 0 && !shouldSkipDuplicate(`input:${newChars}`)) sendTextChunked(newChars);
			scheduleRestore();
			return;
		}
		scheduleRestore();
		beforeInputFired = false;
	});
	toggleButton.addEventListener("paste", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		e.preventDefault();
		waitingForInput = false;
		resetCompositionState(true);
		const pastedText = e.clipboardData?.getData("text") || "";
		if (pastedText) sendTextChunked(pastedText);
	});
	toggleButton.addEventListener("drop", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		e.preventDefault();
		waitingForInput = false;
		resetCompositionState(true);
		const droppedText = e.dataTransfer?.getData("text") || "";
		if (droppedText) {
			sendTextChunked(droppedText);
			return;
		}
		scheduleRestore();
	});
	toggleButton.addEventListener("blur", () => {
		if (pendingRestore !== null) {
			clearTimeout(pendingRestore);
			pendingRestore = null;
		}
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		isComposing = false;
		lastCompositionText = "";
		waitingForInput = false;
		lastHandledKey = null;
		beforeInputFired = false;
		lastKnownContent = ICON;
		restoreButtonIcon();
	});
	toggleButton.addEventListener("focus", () => {
		lastHandledKey = null;
		lastHandledTime = 0;
		waitingForInput = false;
		beforeInputFired = false;
		isComposing = false;
		lastCompositionText = "";
		if (compositionTimeout !== null) {
			clearTimeout(compositionTimeout);
			compositionTimeout = null;
		}
		lastKnownContent = ICON;
		restoreButtonIcon();
	});
}
function setupKeyboardUIHandlers() {
	const keyboardElement = getKeyboardElement();
	if (!keyboardElement) return;
	if (!keyboardContainerUiBound.has(keyboardElement)) {
		keyboardContainerUiBound.add(keyboardElement);
		keyboardElement.querySelector(".keyboard-close")?.addEventListener("click", hideKeyboard);
		const tabs = keyboardElement.querySelectorAll(".keyboard-tab");
		tabs.forEach((tab) => {
			tab.addEventListener("click", () => {
				const targetTab = tab.getAttribute("data-tab");
				tabs.forEach((t) => t.classList.remove("active"));
				tab.classList.add("active");
				(keyboardElement?.querySelectorAll(".keyboard-panel"))?.forEach((panel) => {
					panel.classList.remove("active");
					if (panel.getAttribute("data-panel") === targetTab) panel.classList.add("active");
				});
			});
		});
		const shiftBtn = keyboardElement.querySelector(".keyboard-shift");
		let isUpper = false;
		shiftBtn?.addEventListener("click", () => {
			isUpper = !isUpper;
			renderKeyboard(isUpper);
			shiftBtn.classList.toggle("active", isUpper);
		});
		const categoryBtns = keyboardElement.querySelectorAll(".emoji-category-btn");
		if (categoryBtns.length > 0) {
			const firstBtn = categoryBtns[0];
			firstBtn.classList.add("active");
			const firstCategory = firstBtn.getAttribute("data-category");
			if (firstCategory) renderEmoji(firstCategory);
			categoryBtns.forEach((btn) => {
				btn.addEventListener("click", () => {
					const category = btn.getAttribute("data-category");
					if (category) {
						categoryBtns.forEach((b) => b.classList.remove("active"));
						btn.classList.add("active");
						renderEmoji(category);
					}
				});
			});
		}
		keyboardElement.addEventListener("click", (e) => {
			if (e.target === keyboardElement) hideKeyboard();
		});
	}
	const doc = getAirpadOwnerDocument();
	if (!doc) return;
	teardownKeyboardDismissListeners();
	keyboardDismissAbort = new AbortController();
	const { signal } = keyboardDismissAbort;
	const dismissRoot = keyboardElement.closest?.(".view-cwsp") ?? doc.querySelector?.(".view-cwsp") ?? keyboardElement;
	if (dismissRoot instanceof HTMLElement) setupControlInteractionKeyboardDismiss(dismissRoot, signal);
	doc.addEventListener("focusout", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		if (!isKeyboardVisible()) return;
		const fromEl = eventTargetElement(e);
		const rel = e.relatedTarget;
		const toEl = rel instanceof HTMLElement ? rel : null;
		if (!(isKeyboardStayOpenTarget(fromEl) || isKeyboardStayOpenTarget(toEl))) hideKeyboard();
	}, { signal });
	doc.addEventListener("pointerdown", (e) => {
		if (!isRemoteKeyboardEnabled()) return;
		if (!isKeyboardVisible()) return;
		if (!isKeyboardStayOpenTarget(eventTargetElement(e))) hideKeyboard();
	}, {
		capture: false,
		passive: true,
		signal
	});
}
//#endregion
//#region ../../modules/views/airpad-view/src/input-old/virtual-keyboard.ts
function updateToggleButtonEnabledState(enabled) {
	const toggleButton = getToggleButton();
	if (!(toggleButton instanceof HTMLButtonElement)) return;
	toggleButton.disabled = false;
	toggleButton.setAttribute("aria-disabled", String(!enabled));
	toggleButton.classList.toggle("is-disabled", !enabled);
	const vkStatusEl = getVkStatusEl();
	if (vkStatusEl) vkStatusEl.textContent = `${(vkStatusEl.textContent || "overlay:off").replace(/\s*\/\s*remote:(on|off)\s*$/i, "")} / remote:${enabled ? "on" : "off"}`;
}
function setRemoteKeyboardEnabled(enabled) {
	setRemoteKeyboardEnabled$1(enabled);
	updateToggleButtonEnabledState(enabled);
	if (!enabled) hideKeyboard();
}
/**
* @param mountRoot — node under which Airpad markup was mounted (e.g. `[data-cwsp-content]`).
*   Resolves `.view-cwsp` for portal placement; prefers mount root / `getAirpadDomRoot()` over global document queries.
*/
function initVirtualKeyboard(mountRoot) {
	initVirtualKeyboardAPI();
	const hasAPI = hasVirtualKeyboardAPI();
	const vkStatusEl = getVkStatusEl();
	if (vkStatusEl) vkStatusEl.textContent = hasAPI ? "overlay:on / policy:auto" : "overlay:off";
	const scoped = getAirpadDomRoot();
	const container = mountRoot?.closest?.(".view-cwsp") ?? mountRoot ?? scoped?.closest?.(".view-cwsp") ?? scoped ?? document.body;
	let keyboardElement = container.querySelector(".virtual-keyboard-container");
	if (!keyboardElement) {
		const keyboardHTML = createKeyboardHTML();
		container.insertAdjacentHTML("beforeend", keyboardHTML);
		keyboardElement = container.querySelector(".virtual-keyboard-container");
	}
	if (!keyboardElement) {
		log("Failed to create keyboard element");
		return;
	}
	keyboardElement.classList.remove("visible");
	setKeyboardElement(keyboardElement);
	const toggleContainer = container.querySelector(".bottom-toolbar") ?? container;
	let toggleButton = toggleContainer.querySelector(".keyboard-toggle");
	if (!toggleButton) {
		const toggleHTML = hasAPI ? "<button type=\"button\" name=\"airpad-keyboard-toggle\" tabindex=\"-1\" contenteditable=\"false\" virtualkeyboardpolicy=\"manual\" class=\"keyboard-toggle keyboard-toggle-editable\" aria-label=\"Toggle keyboard\">⌨️</button>" : "<button type=\"button\" name=\"airpad-keyboard-toggle\" tabindex=\"-1\" class=\"keyboard-toggle\" aria-label=\"Toggle keyboard\">⌨️</button>";
		toggleContainer.insertAdjacentHTML("beforeend", toggleHTML);
		toggleButton = toggleContainer.querySelector(".keyboard-toggle");
	}
	if (!toggleButton) {
		log("Failed to create toggle button");
		return;
	}
	toggleButton.autofocus = false;
	toggleButton.removeAttribute("autofocus");
	if (toggleButton instanceof HTMLElement) {
		toggleButton.setAttribute("autocapitalize", "off");
		toggleButton.setAttribute("autocorrect", "off");
		toggleButton.setAttribute("spellcheck", "false");
	}
	setToggleButton(toggleButton);
	setRemoteKeyboardEnabled(false);
	setupToggleButtonHandler();
	setupVirtualKeyboardAPIHandlers();
	setupKeyboardUIHandlers();
	log("Virtual keyboard initialized");
}
//#endregion
//#region ../../modules/views/airpad-view/src/input-old/speech.ts
var recognition = null;
var aiListening = false;
var aiModeActive = false;
var speechLanguage = "ru-RU";
var speechRecognitionInitialized = false;
var unsubscribeVoiceMessage = null;
var normalizeSpeechLanguage = (value) => {
	const lang = (value || "").trim();
	if (!lang) return "ru-RU";
	if (lang === "ru") return "ru-RU";
	if (lang === "en") return "en-US";
	if (lang === "en-GB") return "en-GB";
	if (lang === "en-US") return "en-US";
	return lang;
};
async function loadSpeechLanguagePreference() {
	try {
		speechLanguage = normalizeSpeechLanguage((await loadSettings())?.speech?.language);
		if (recognition) recognition.lang = speechLanguage;
	} catch {
		speechLanguage = "ru-RU";
	}
}
var checkIsAiModeActive = () => {
	return aiListening || aiModeActive;
};
function setAiStatus(text) {
	const aiStatusEl = getAiStatusEl();
	if (aiStatusEl) aiStatusEl.textContent = text;
}
function setupSpeechRecognition() {
	const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
	if (!SR) {
		log("SpeechRecognition API не поддерживается.");
		return null;
	}
	const recog = new SR();
	recog.lang = speechLanguage;
	recog.interimResults = false;
	recog.maxAlternatives = 1;
	return recog;
}
function initSpeechRecognition() {
	if (speechRecognitionInitialized) return;
	speechRecognitionInitialized = true;
	loadSpeechLanguagePreference();
	recognition = setupSpeechRecognition();
	unsubscribeVoiceMessage?.();
	unsubscribeVoiceMessage = onAirPadVoiceMessage((message) => {
		const voiceTextEl = getVoiceTextEl();
		if (voiceTextEl) voiceTextEl.textContent = message.text;
	});
	if (recognition) {
		recognition.onstart = () => {
			const aiButton = getAiButton();
			const voiceTextEl = getVoiceTextEl();
			aiListening = true;
			aiModeActive = true;
			if (aiButton) aiButton.classList.add("listening");
			setAiStatus("listening");
			if (voiceTextEl) voiceTextEl.textContent = "Слушаю...";
			log("Speech: start");
		};
		recognition.onend = () => {
			const aiButton = getAiButton();
			aiListening = false;
			aiModeActive = false;
			if (aiButton) aiButton.classList.remove("listening");
			setAiStatus("idle");
			log("Speech: end");
		};
		recognition.onerror = (event) => {
			const voiceTextEl = getVoiceTextEl();
			if (voiceTextEl) voiceTextEl.textContent = "Ошибка распознавания: " + event.error;
			log("Speech error: " + event.error);
		};
		recognition.onresult = (event) => {
			const voiceTextEl = getVoiceTextEl();
			const normalized = (event.results[0][0].transcript || "").trim();
			const words = normalized.split(/\s+/).filter(Boolean);
			if (voiceTextEl) voiceTextEl.textContent = normalized ? "Команда: " + normalized : "Команда не распознана";
			log("Speech result: " + normalized);
			if (words.length < 2) {
				log("Speech: недостаточно слов (нужно >= 2) — не отправляем и не подключаем WS");
				return;
			}
			const trySend = (deadline) => {
				if (isAirPadSessionConnected()) {
					sendAirPadIntent({
						type: "voice.submit",
						text: normalized
					});
					return;
				}
				if (Date.now() > deadline) {
					log("Speech: не удалось дождаться WS, команда не отправлена");
					return;
				}
				setTimeout(() => trySend(deadline), 120);
			};
			if (!isAirPadSessionConnected()) {
				log("Speech: подключаем WS перед отправкой команды");
				connectAirPadSession();
				trySend(Date.now() + 2e3);
			} else sendAirPadIntent({
				type: "voice.submit",
				text: normalized
			});
		};
	}
}
function initAiButton() {
	const aiButton = getAiButton();
	if (!aiButton) return;
	let pointerActive = false;
	let pointerId = null;
	aiButton.addEventListener("pointerdown", (e) => {
		e.preventDefault();
		if (pointerActive) return;
		pointerActive = true;
		pointerId = e.pointerId;
		aiButton.setPointerCapture(pointerId);
		if (!recognition) {
			log("SpeechRecognition недоступен");
			return;
		}
		try {
			recognition.start();
		} catch (err) {
			log("Recognition start error: " + err.message);
		}
	});
	aiButton.addEventListener("pointerup", (e) => {
		if (!pointerActive || e.pointerId !== pointerId) return;
		e.preventDefault();
		pointerActive = false;
		aiButton.releasePointerCapture(pointerId);
		pointerId = null;
		if (!recognition) return;
		try {
			recognition.stop();
		} catch (err) {
			log("Recognition stop error: " + err.message);
		}
	});
	aiButton.addEventListener("pointercancel", () => {
		if (!pointerActive) return;
		pointerActive = false;
		pointerId = null;
		if (recognition) try {
			recognition.stop();
		} catch {}
	});
}
//#endregion
//#region ../../modules/views/airpad-view/src/config/motion-diagnostics.ts
var diagnostics = {
	activeSource: "none",
	sensorSamples: {},
	sends: 0,
	lastSendAt: 0,
	lastSendGapMs: 0
};
var nowMs = () => {
	const perf = globalThis.performance;
	if (typeof perf?.now === "function") return perf.now();
	return Date.now();
};
var setAirpadMotionActiveSource = (source) => {
	diagnostics.activeSource = source;
};
var recordAirpadMotionSensorSample = (source) => {
	diagnostics.sensorSamples[source] = (diagnostics.sensorSamples[source] ?? 0) + 1;
};
var recordAirpadMotionSend = () => {
	const now = nowMs();
	diagnostics.sends += 1;
	diagnostics.lastSendGapMs = diagnostics.lastSendAt > 0 ? now - diagnostics.lastSendAt : 0;
	diagnostics.lastSendAt = now;
};
//#endregion
//#region ../../modules/views/airpad-view/src/config/motion-rate-gate.ts
var defaultNow = () => {
	const perf = globalThis.performance;
	if (typeof perf?.now === "function") return perf.now();
	return Date.now();
};
var createMotionFlushGate = ({ now = defaultNow, getIntervalMs }) => {
	let lastFlushAt = null;
	return {
		shouldFlush: () => {
			if (lastFlushAt === null) return true;
			return now() - lastFlushAt >= Math.max(1, getIntervalMs());
		},
		recordFlush: () => {
			lastFlushAt = now();
		},
		reset: () => {
			lastFlushAt = null;
		}
	};
};
//#endregion
//#region ../../modules/views/airpad-view/src/config/motion-quantize.ts
/** Quantize relative motion for integer wire formats while preserving subpixel remainder. */
var quantizeMotionFlush = (accum) => {
	const dx = Math.round(accum.dx);
	const dy = Math.round(accum.dy);
	const dz = Math.round(accum.dz);
	if (dx === 0 && dy === 0 && dz === 0) return null;
	accum.dx -= dx;
	accum.dy -= dy;
	accum.dz -= dz;
	return {
		dx,
		dy,
		dz
	};
};
//#endregion
//#region ../../modules/views/airpad-view/src/config/motion-state.ts
var accum = {
	dx: 0,
	dy: 0,
	dz: 0
};
var flushRaf = null;
var flushGate = createMotionFlushGate({ getIntervalMs: getMotionSendIntervalMs });
function clearAccum() {
	accum.dx = 0;
	accum.dy = 0;
	accum.dz = 0;
}
function emitMotionNow() {
	const motion = quantizeMotionFlush(accum);
	if (!motion) return false;
	recordMotionSendSample();
	recordAirpadMotionSend();
	sendAirPadIntent({
		type: "pointer.move",
		dx: motion.dx,
		dy: motion.dy,
		dz: motion.dz
	});
	return true;
}
/** Send pending motion immediately (before discrete click so cursor matches intent). */
function flushMotionNow() {
	if (flushRaf !== null) {
		cancelAnimationFrame(flushRaf);
		flushRaf = null;
	}
	if (emitMotionNow()) flushGate.recordFlush();
}
function scheduleFlush() {
	if (flushRaf !== null) return;
	flushRaf = requestAnimationFrame(() => {
		flushRaf = null;
		if (flushGate.shouldFlush() && emitMotionNow()) flushGate.recordFlush();
		if (accum.dx !== 0 || accum.dy !== 0 || accum.dz !== 0) scheduleFlush();
	});
}
function enqueueMotion(dx, dy, dz = 0) {
	if (Math.abs(dx) < .001) dx = 0;
	if (Math.abs(dy) < .001) dy = 0;
	if (Math.abs(dz) < .001) dz = 0;
	if (dx === 0 && dy === 0 && dz === 0) return;
	accum.dx += dx;
	accum.dy += dy;
	accum.dz += dz;
	scheduleFlush();
}
function resetMotionAccum() {
	clearAccum();
	if (flushRaf !== null) {
		cancelAnimationFrame(flushRaf);
		flushRaf = null;
	}
	flushGate.reset();
}
//#endregion
//#region ../../modules/views/airpad-view/src/utils/math.ts
function n0(v) {
	return Number.isFinite(v) ? v : 0;
}
function clamp01(v) {
	const x = n0(v);
	return x < 0 ? 0 : x > 1 ? 1 : x;
}
function lerp(a, b, t) {
	return n0(a) + (n0(b) - n0(a)) * clamp01(t);
}
function expSmoothing(dtSeconds, ratePerSecond) {
	const dt = Math.max(0, n0(dtSeconds));
	const rate = Math.abs(n0(ratePerSecond));
	return 1 - Math.exp(-rate * dt);
}
function vec3Zero() {
	return {
		x: 0,
		y: 0,
		z: 0
	};
}
function vec3Mix(a, b, f = .5) {
	const ax = n0(a.x);
	const ay = n0(a.y);
	const az = n0(a.z);
	const bx = n0(b.x);
	const by = n0(b.y);
	const bz = n0(b.z);
	const ff = n0(f);
	return {
		x: ax + (bx - ax) * ff,
		y: ay + (by - ay) * ff,
		z: az + (bz - az) * ff
	};
}
function vec3FromSensor(sensor) {
	return {
		x: n0(sensor.x),
		y: n0(sensor.y),
		z: n0(sensor.z)
	};
}
function vec3Sub(a, b) {
	return {
		x: n0(a.x) - n0(b.x),
		y: n0(a.y) - n0(b.y),
		z: n0(a.z) - n0(b.z)
	};
}
function vec3Add(a, b) {
	return {
		x: n0(a.x) + n0(b.x),
		y: n0(a.y) + n0(b.y),
		z: n0(a.z) + n0(b.z)
	};
}
function vec3Scale(v, scalar) {
	const s = n0(scalar);
	return {
		x: n0(v.x) * s,
		y: n0(v.y) * s,
		z: n0(v.z) * s
	};
}
function vec3Clamp(v, max) {
	const m = Math.abs(n0(max));
	if (m === 0) return vec3Zero();
	const x = n0(v.x);
	const y = n0(v.y);
	const z = n0(v.z);
	const length = Math.hypot(x, y, z);
	if (length === 0 || length <= m) return {
		x,
		y,
		z
	};
	const s = m / length;
	return {
		x: x * s,
		y: y * s,
		z: z * s
	};
}
function vec3DeadZone(v, threshold) {
	const t = Math.abs(n0(threshold));
	return {
		x: Math.abs(n0(v.x)) < t ? 0 : n0(v.x),
		y: Math.abs(n0(v.y)) < t ? 0 : n0(v.y),
		z: Math.abs(n0(v.z)) < t ? 0 : n0(v.z)
	};
}
function vec3IsNearZero(v, epsilon = .01) {
	const e = Math.abs(n0(epsilon) || .01);
	return Math.abs(n0(v.x)) < e && Math.abs(n0(v.y)) < e && Math.abs(n0(v.z)) < e;
}
function vec3Smooth(current, target, factor = .25) {
	return vec3Mix(current, target, factor);
}
function vec3Select(v, axisX, axisY, axisZ) {
	const componentMap = {
		ax: n0(v.x),
		ay: n0(v.y),
		az: n0(v.z)
	};
	return {
		x: componentMap[axisX],
		y: componentMap[axisY],
		z: componentMap[axisZ]
	};
}
function vec3RotateXYByAngle(v, angleRad, zOverride) {
	const a = n0(angleRad);
	const cosA = Math.cos(a);
	const sinA = Math.sin(a);
	const x = n0(v.x);
	const y = n0(v.y);
	return {
		x: x * cosA - y * sinA,
		y: x * sinA + y * cosA,
		z: zOverride !== void 0 ? n0(zOverride) : n0(v.z)
	};
}
function normalizeAngle(angle) {
	const twoPi = Math.PI * 2;
	angle = angle % twoPi;
	if (angle < -Math.PI) angle += twoPi;
	else if (angle > Math.PI) angle -= twoPi;
	return angle;
}
function vec3NormalizeAngles(v) {
	return {
		x: normalizeAngle(n0(v.x)),
		y: normalizeAngle(n0(v.y)),
		z: normalizeAngle(n0(v.z))
	};
}
Math.PI * 2;
//#endregion
//#region ../../modules/views/airpad-view/src/input-old/unfinised/gravity-sensor.ts
var gravitySensor = null;
var gravityVector = vec3Zero();
var gravityMagnitude = 0;
function getGravityVector() {
	return gravityVector;
}
function getGravityMagnitude() {
	return gravityMagnitude;
}
function isGravityAvailable() {
	return gravitySensor !== null;
}
//#endregion
//#region ../../modules/views/airpad-view/src/input-old/unfinised/gyroscope.ts
var gyroscope = null;
var lastTimestamp$1 = performance.now();
function resetGyroState() {
	lastTimestamp$1 = performance.now();
	resetMonteCarloSampling$1();
	gyroscopeSmoothed = vec3Zero();
	integratedAngles = vec3Zero();
	lastGyroMovement = vec3Zero();
}
function onEnterAirMove$1() {
	resetGyroState();
	gyroInitAttempted = false;
}
var gyroscopeSmoothed = vec3Zero();
var gyroscopeResolved = vec3Zero();
var integratedAngles = vec3Zero();
var gyroscopeSampleWindow = [];
var gyroscopeSampleWeights = [];
var gyroscopeTotalWeight = 0;
var gyroscopeWeightedSum = vec3Zero();
var averageRateSampleCount$1 = 0;
var averageRateSampled$1 = 0;
var averageRateResolved$1 = 0;
function resetMonteCarloSampling$1() {
	gyroscopeSampleWindow = [];
	gyroscopeSampleWeights = [];
	gyroscopeTotalWeight = 0;
	gyroscopeWeightedSum = vec3Zero();
	gyroscopeResolved = vec3Zero();
}
function getCalibrationConfidence() {
	return Math.pow(Math.min(1, gyroscopeSampleWindow.length / GYRO_MAX_SAMPLE_COUNT), 2);
}
function addMonteCarloSample$1(sample, weight = 1, smoothForDiff = vec3Zero()) {
	if (Math.abs(sample.x) + Math.abs(sample.y) + Math.abs(sample.z) < 1e-4) return;
	if (Math.hypot(smoothForDiff.x - gyroscopeResolved.x, smoothForDiff.y - gyroscopeResolved.y, smoothForDiff.z - gyroscopeResolved.z) > 1 - getCalibrationConfidence()) return;
	const weightedSample = vec3Scale(vec3NormalizeAngles(sample), 1 / Math.max(.001, weight));
	let removedWeightedSample = null;
	if (gyroscopeSampleWindow.length >= 1e3) {
		const removedWeight = gyroscopeSampleWeights.shift();
		removedWeightedSample = vec3Scale(gyroscopeSampleWindow.shift(), removedWeight);
		gyroscopeTotalWeight -= removedWeight;
	}
	gyroscopeSampleWindow.push(weightedSample);
	gyroscopeSampleWeights.push(weight);
	gyroscopeTotalWeight += 1;
	if (removedWeightedSample) gyroscopeWeightedSum = vec3Sub(gyroscopeWeightedSum, removedWeightedSample);
	gyroscopeWeightedSum = vec3Add(gyroscopeWeightedSum, weightedSample);
	if (gyroscopeTotalWeight > 0) gyroscopeResolved = vec3Scale(gyroscopeWeightedSum, 1 / gyroscopeTotalWeight);
}
function gyroscopeSmooth(currentAngles, dt = .1, sampleFactor = 1) {
	const smoothFactor = Math.max(.1, Math.min(dt * 10, GYRO_SMOOTH, 1));
	const normAngles = currentAngles;
	addMonteCarloSample$1(vec3NormalizeAngles(normAngles), sampleFactor, gyroscopeSmoothed);
	vec3Sub(normAngles, gyroscopeResolved);
	gyroscopeSmoothed = vec3Smooth(gyroscopeSmoothed, normAngles, smoothFactor);
	return vec3NormalizeAngles(gyroscopeSmoothed);
}
var getRotatedGyro = (gyro) => {
	let selectedAxes = vec3Select(gyro, "az", "ax", "ay");
	return vec3RotateXYByAngle(selectedAxes, normalizeAngle(selectedAxes.z * -1), 1);
};
var lastGyroMovement = vec3Zero();
var forSendingGyroMovement = vec3Zero();
var calculateDeltaGyroMovement = (gyro) => {
	const result = vec3Sub(gyro, lastGyroMovement);
	lastGyroMovement = gyro;
	return result;
};
var sendWSGyroMovement = (movement) => {
	forSendingGyroMovement = vec3Add(forSendingGyroMovement, movement);
	const baseMovement = {
		x: forSendingGyroMovement.x * -1 * 600,
		y: forSendingGyroMovement.y * -1 * 600,
		z: forSendingGyroMovement.z * 600 * GYRO_ROTATION_GAIN
	};
	forSendingGyroMovement = vec3Zero();
	const clampedMovement = vec3Clamp(baseMovement, 30);
	const jx = Math.abs(clampedMovement.x) < .001 ? 0 : clampedMovement.x;
	const jy = Math.abs(clampedMovement.y) < .001 ? 0 : clampedMovement.y;
	const jz = Math.abs(clampedMovement.z) < .001 ? 0 : clampedMovement.z;
	if (jx === 0 && jy === 0 && jz === 0) return;
	recordAirpadMotionSensorSample("gyro");
	enqueueMotion(jx, jy, jz);
};
function initGyro() {
	if (!("Gyroscope" in window)) {
		log("Gyroscope API не поддерживается.");
		return;
	}
	try {
		gyroscope = new window.Gyroscope({ frequency: 60 });
	} catch (err) {
		log("Невозможно создать Gyroscope: " + (err.message || err));
		return;
	}
	gyroscope.addEventListener("reading", () => {
		const now = performance.now();
		const dt = (now - (lastTimestamp$1 || now)) / 1e3;
		lastTimestamp$1 = now;
		averageRateSampled$1 += dt;
		averageRateSampleCount$1++;
		averageRateResolved$1 = averageRateSampled$1 / averageRateSampleCount$1;
		const averageRateFactor = dt / averageRateResolved$1;
		const rawGyro = vec3FromSensor(gyroscope);
		integratedAngles = vec3NormalizeAngles(vec3Add(integratedAngles, vec3Scale(rawGyro, dt)));
		const delta = vec3DeadZone(calculateDeltaGyroMovement(getRotatedGyro(gyroscopeSmooth(integratedAngles, dt, averageRateFactor))), GYRO_DEADZONE);
		if (vec3IsNearZero(delta)) return;
		if (getAirState() !== "AIR_MOVE") return;
		if (aiModeActive) return;
		sendWSGyroMovement(delta);
	});
	gyroscope.addEventListener("error", (event) => {
		log("Gyroscope error: " + (event.error && event.error.message || event.message || event));
	});
	gyroscope.start();
	log("Gyroscope started (60 Hz, angle integration)");
}
var gyroInitAttempted = false;
/** (Re)start gyro on Air hold — Android WebView often blocks sensor start at page load. */
function ensureGyroscopeActive() {
	if (gyroscope) {
		try {
			gyroscope.start?.();
		} catch (err) {
			log(`Gyroscope restart failed: ${err instanceof Error ? err.message : String(err)}`);
		}
		return;
	}
	if (gyroInitAttempted) return;
	gyroInitAttempted = true;
	initGyro();
}
//#endregion
//#region ../../modules/views/airpad-view/src/input-old/unfinised/accelerometer.ts
var accelerometer = null;
var lastTimestamp = performance.now();
function resetAccelState() {
	lastTimestamp = performance.now();
	resetMonteCarloSampling();
	accelerometerSmoothed = vec3Zero();
	accelerometerResolved = vec3Zero();
	forSendingMovement = vec3Zero();
}
function onEnterAirMove() {
	resetAccelState();
	accelInitAttempted = false;
}
var accelerometerSmoothed = vec3Zero();
var accelerometerResolved = vec3Zero();
var accelerometerSampleWindow = [];
var accelerometerSampleWeights = [];
var accelerometerTotalWeight = 0;
var accelerometerWeightedSum = vec3Zero();
var averageRateSampleCount = 0;
var averageRateSampled = 0;
var averageRateResolved = 0;
function resetMonteCarloSampling() {
	accelerometerSampleWindow = [];
	accelerometerSampleWeights = [];
	accelerometerTotalWeight = 0;
	accelerometerWeightedSum = vec3Zero();
	accelerometerResolved = vec3Zero();
}
function addMonteCarloSample(sample, weight = 1, smoothForDiff = vec3Zero()) {
	if (Math.abs(sample.x) + Math.abs(sample.y) + Math.abs(sample.z) < 1e-4) return;
	if (Math.hypot(smoothForDiff.x - accelerometerResolved.x, smoothForDiff.y - accelerometerResolved.y, smoothForDiff.z - accelerometerResolved.z) > 2) return;
	const weightedSample = vec3Scale(sample, 1 / Math.max(.001, weight));
	let removedWeightedSample = null;
	if (accelerometerSampleWindow.length >= 1e3) {
		const removedWeight = accelerometerSampleWeights.shift();
		removedWeightedSample = vec3Scale(accelerometerSampleWindow.shift(), removedWeight);
		accelerometerTotalWeight -= removedWeight;
	}
	accelerometerSampleWindow.push(weightedSample);
	accelerometerSampleWeights.push(weight);
	accelerometerTotalWeight += 1;
	if (removedWeightedSample) accelerometerWeightedSum = vec3Sub(accelerometerWeightedSum, removedWeightedSample);
	accelerometerWeightedSum = vec3Add(accelerometerWeightedSum, weightedSample);
	if (accelerometerTotalWeight > 0) accelerometerResolved = vec3Scale(accelerometerWeightedSum, 1 / accelerometerTotalWeight);
}
function accelerometerSmooth(accel, dt = .1, sampleFactor = 1) {
	const smoothFactor = Math.max(.05, Math.min(dt * 1, ACCELEROMETER_SMOOTH, 1));
	accelerometerSmoothed = vec3Smooth(accelerometerSmoothed, accel, smoothFactor);
	addMonteCarloSample(accel, sampleFactor, accelerometerSmoothed);
	return accelerometerSmoothed;
}
var lastMovement = vec3Zero();
var computeMovementDelta = (movement) => {
	const result = vec3Sub(movement, lastMovement);
	lastMovement = movement;
	return result;
};
var forSendingMovement = vec3Zero();
var sendWSMovement = (movement) => {
	forSendingMovement = vec3Add(forSendingMovement, movement);
	const mappedMovement = {
		x: forSendingMovement.x * -1 * 40,
		y: forSendingMovement.y * -1 * 40,
		z: forSendingMovement.z * 1 * 40
	};
	forSendingMovement = vec3Zero();
	if (Math.abs(mappedMovement.x) < .1) mappedMovement.x = 0;
	if (Math.abs(mappedMovement.y) < .1) mappedMovement.y = 0;
	if (Math.abs(mappedMovement.z) < .1) mappedMovement.z = 0;
	if (mappedMovement.x === 0 && mappedMovement.y === 0 && mappedMovement.z === 0) return;
	recordAirpadMotionSensorSample("accelerometer");
	enqueueMotion(mappedMovement.x, mappedMovement.y, mappedMovement.z);
};
var gravityBasedCorrection = (accel) => {
	if (isGravityAvailable() && getGravityMagnitude() > .1) {
		const gravity = getGravityVector();
		const gravityMagnitude = getGravityMagnitude();
		return {
			x: accel.x - gravity.x * gravityMagnitude,
			y: accel.y - gravity.y * gravityMagnitude,
			z: accel.z - gravity.z * gravityMagnitude
		};
	}
	return accel;
};
function initAccelerometer() {
	if (!("Accelerometer" in window)) {
		log("Accelerometer API is not supported.");
		return;
	}
	try {
		accelerometer = new window.Accelerometer({ frequency: 60 });
	} catch (err) {
		log("Cannot create Accelerometer: " + (err.message || err));
		return;
	}
	accelerometer.addEventListener("reading", () => {
		const now = performance.now();
		const dt = (now - (lastTimestamp || now)) / 1e3;
		lastTimestamp = now;
		averageRateSampled += dt;
		averageRateSampleCount++;
		averageRateResolved = averageRateSampled / averageRateSampleCount;
		const averageRateFactor = dt / averageRateResolved;
		const filteredAccel = accelerometerSmooth(vec3FromSensor(accelerometer), dt, averageRateFactor);
		const delta = vec3DeadZone(computeMovementDelta(gravityBasedCorrection(filteredAccel)), ACCELEROMETER_DEADZONE);
		if (vec3IsNearZero(filteredAccel)) return;
		if (getAirState() !== "AIR_MOVE") return;
		if (aiModeActive) return;
		sendWSMovement(delta);
	});
	accelerometer.addEventListener("error", (event) => {
		log("Accelerometer error: " + (event?.error?.message || event?.message || event));
	});
	accelerometer.start();
	log("Accelerometer started (60 Hz)");
}
var accelInitAttempted = false;
/** (Re)start accelerometer on Air hold when Generic Sensor API needs user activation. */
function ensureAccelerometerActive() {
	if (accelerometer) {
		try {
			accelerometer.start?.();
		} catch (err) {
			log(`Accelerometer restart failed: ${err instanceof Error ? err.message : String(err)}`);
		}
		return;
	}
	if (accelInitAttempted) return;
	accelInitAttempted = true;
	initAccelerometer();
}
//#endregion
//#region ../../modules/views/airpad-view/src/input-old/sensor/relative-orientation.ts
var relSensor = null;
var fallbackOrientationActive = false;
var fallbackHandler = null;
var lastQuat = null;
var smoothedDelta = vec3Zero();
var dynamicMaxStepPx = 60;
var REL_ORIENT_ZERO_DECAY_RATE = 420;
function resetRelativeOrientationRuntimeState() {
	lastQuat = null;
	smoothedDelta = vec3Zero();
	dynamicMaxStepPx = 60;
}
function stopRelativeOrientation() {
	try {
		if (relSensor) relSensor.stop?.();
	} catch {}
	relSensor = null;
	if (fallbackOrientationActive && fallbackHandler) globalThis.removeEventListener("deviceorientation", fallbackHandler);
	fallbackOrientationActive = false;
	fallbackHandler = null;
}
function quatNormalizeStable(q, prev) {
	const [x, y, z, w] = q;
	const len = Math.hypot(x, y, z, w) || .01;
	let nx = clamp01(x / len), ny = clamp01(y / len), nz = clamp01(z / len), nw = clamp01(w / len);
	if (prev) {
		if (nx * prev[0] + ny * prev[1] + nz * prev[2] + nw * prev[3] < 0) {
			nx = -nx;
			ny = -ny;
			nz = -nz;
			nw = -nw;
		}
	}
	return [
		nx,
		ny,
		nz,
		nw
	];
}
function quatConj(q) {
	const [x, y, z, w] = q;
	return [
		-x,
		-y,
		-z,
		w
	];
}
function quatMul(a, b) {
	const [ax, ay, az, aw] = a;
	const [bx, by, bz, bw] = b;
	return [
		aw * bx + ax * bw + ay * bz - az * by,
		aw * by - ax * bz + ay * bw + az * bx,
		aw * bz + ax * by - ay * bx + az * bw,
		aw * bw - ax * bx - ay * by - az * bz
	];
}
function quatNormalize(q) {
	const x = q[0], y = q[1], z = q[2], w = q[3];
	const len = Math.hypot(x, y, z, w) || .01;
	return [
		clamp01(x / len),
		clamp01(y / len),
		clamp01(z / len),
		clamp01(w / len)
	];
}
function quatDeltaToAxisAngle(dqRaw) {
	let [x, y, z, w] = quatNormalize(dqRaw);
	if (w < 0) {
		x = -x;
		y = -y;
		z = -z;
		w = -w;
	}
	w = Math.max(-1, Math.min(1, w));
	const sinHalf = Math.hypot(x, y, z);
	if (sinHalf < 1e-6) return {
		x: 2 * x,
		y: 2 * y,
		z: 2 * z
	};
	const k = 2 * Math.atan2(sinHalf, w) / sinHalf;
	return {
		x: x * k,
		y: y * k,
		z: z * k
	};
}
function mapToPixelsRaw(movement) {
	const selected = vec3Select(movement, "az", "ay", "ax");
	const projected = vec3RotateXYByAngle(selected, selected.z * -1, 1);
	return {
		x: projected.x * -1 * 600,
		y: projected.y * -1 * 600,
		z: projected.z * -1 * 600
	};
}
function clampPxRadiusFromDeltaVec(deltaVec, dt) {
	const rawMapped = mapToPixelsRaw(deltaVec);
	const magPx = Math.hypot(rawMapped.x, rawMapped.y, rawMapped.z);
	const desired = Math.max(60, Math.min(800, magPx));
	const t = desired > dynamicMaxStepPx ? expSmoothing(dt, 6) : expSmoothing(dt, 14);
	dynamicMaxStepPx = lerp(dynamicMaxStepPx, desired, t);
	if (!Number.isFinite(dynamicMaxStepPx)) dynamicMaxStepPx = 60;
	dynamicMaxStepPx = Math.max(60, Math.min(800, dynamicMaxStepPx));
	return dynamicMaxStepPx;
}
function mapAndScale(movement, maxStepPx) {
	return vec3Clamp(mapToPixelsRaw(movement), maxStepPx);
}
function handleReading(quat, dt) {
	if (!quat || quat.length < 4) return vec3Zero();
	const curQuat = quatNormalizeStable([
		quat[0],
		quat[1],
		quat[2],
		quat[3]
	], lastQuat);
	if (!lastQuat) lastQuat = curQuat;
	const deltaQuat = quatMul(curQuat, quatConj(lastQuat));
	lastQuat = curQuat;
	const deltaVec = quatDeltaToAxisAngle(deltaQuat);
	if (vec3IsNearZero(deltaVec, .001)) {
		const zeroDecayFactor = clamp01(expSmoothing(dt, REL_ORIENT_ZERO_DECAY_RATE));
		smoothedDelta = vec3Smooth(smoothedDelta, vec3Zero(), zeroDecayFactor);
		if (vec3IsNearZero(smoothedDelta, .001)) {
			smoothedDelta = vec3Zero();
			return vec3Zero();
		}
	}
	const maxStepPx = clampPxRadiusFromDeltaVec(deltaVec, dt);
	const deltaPx = mapToPixelsRaw(deltaVec);
	const smoothFactor = clamp01(expSmoothing(dt, lerp(6, 24, clamp01((Math.hypot(deltaPx.x, deltaPx.y, deltaPx.z) - 60) / Math.max(1, 740)))) * clamp01(REL_ORIENT_SMOOTH));
	smoothedDelta = vec3Smooth(smoothedDelta, deltaVec, smoothFactor * .9);
	const maxStepRad = maxStepPx / Math.max(1e-6, Math.abs(600));
	smoothedDelta = vec3Clamp(smoothedDelta, Math.max(REL_ORIENT_DEADZONE, maxStepRad));
	const dz = {
		x: Math.abs(smoothedDelta.x) < .001 ? 0 : smoothedDelta.x,
		y: Math.abs(smoothedDelta.y) < .001 ? 0 : smoothedDelta.y,
		z: Math.abs(smoothedDelta.z) < .001 ? 0 : smoothedDelta.z
	};
	if (Math.abs(dz.x) < .001 && Math.abs(dz.y) < .001 && Math.abs(dz.z) < .001) return vec3Zero();
	const mapped = mapAndScale(dz, maxStepPx);
	if (vec3IsNearZero(mapped, .001)) return vec3Zero();
	return mapped;
}
/** iOS / some Android WebViews require a user-gesture permission prompt for orientation events. */
async function requestRelativeOrientationPermission() {
	const DOE = globalThis.DeviceOrientationEvent;
	if (DOE && typeof DOE.requestPermission === "function") try {
		const state = await DOE.requestPermission();
		if (state !== "granted") {
			log(`Device orientation permission denied: ${state}`);
			return false;
		}
		return true;
	} catch (err) {
		log(`Device orientation permission error: ${err instanceof Error ? err.message : String(err)}`);
		return false;
	}
	const [accelerometerPermission, gyroscopePermission] = await Promise.all([navigator.permissions.query({ name: "accelerometer" }), navigator.permissions.query({ name: "gyroscope" })]);
	return accelerometerPermission.state === "granted" && gyroscopePermission.state === "granted";
}
function startDeviceOrientationFallback() {
	if (fallbackOrientationActive) return;
	let lastTs = performance.now();
	let lastEuler = null;
	fallbackHandler = (event) => {
		const now = performance.now();
		const dt = Math.max(1e-5, (now - lastTs) / 1e3);
		lastTs = now;
		const alpha = Number(event.alpha ?? 0);
		const current = {
			x: Number(event.beta ?? 0),
			y: Number(event.gamma ?? 0),
			z: alpha
		};
		if (!lastEuler) {
			lastEuler = current;
			return;
		}
		const deltaDeg = {
			x: current.x - lastEuler.x,
			y: current.y - lastEuler.y,
			z: current.z - lastEuler.z
		};
		lastEuler = current;
		const mapped = mapAndScale({
			x: deltaDeg.x * Math.PI / 180,
			y: deltaDeg.y * Math.PI / 180,
			z: deltaDeg.z * Math.PI / 180
		}, clampPxRadiusFromDeltaVec({
			x: deltaDeg.x * Math.PI / 180,
			y: deltaDeg.y * Math.PI / 180,
			z: deltaDeg.z * Math.PI / 180
		}, dt));
		if (getAirState && getAirState() !== "AIR_MOVE") return;
		if (aiModeActive) return;
		if (vec3IsNearZero(mapped, .001)) return;
		enqueueMotion(mapped.x, mapped.y, mapped.z);
	};
	globalThis.addEventListener("deviceorientation", fallbackHandler, { passive: true });
	fallbackOrientationActive = true;
	log("RelativeOrientation fallback active (deviceorientation)");
}
/**
* (Re)start motion sensors after the Air hold gesture — required on Android/Capacitor
* where Generic Sensor API start() fails without user activation.
*/
async function ensureAirMoveMotionSensors() {
	await requestRelativeOrientationPermission();
	await resetRelativeOrientationRuntimeState();
	return initRelativeOrientation();
}
function initRelativeOrientation() {
	resetRelativeOrientationRuntimeState();
	stopRelativeOrientation();
	if (!window.RelativeOrientationSensor) {
		log("RelativeOrientationSensor API is not supported.");
		startDeviceOrientationFallback();
		return "none";
	}
	try {
		relSensor = new window.RelativeOrientationSensor({
			frequency: 60,
			referenceFrame: "device"
		});
		return "relative-orientation";
	} catch (err) {
		log("Cannot create RelativeOrientationSensor: " + (err?.message || err));
		relSensor = null;
		startDeviceOrientationFallback();
		return "none";
	}
	let lastTs = performance.now();
	relSensor.addEventListener("reading", () => {
		const now = performance.now();
		const dt = Math.max(1e-5, (now - lastTs) / 1e3);
		lastTs = now;
		const mapped = handleReading(relSensor.quaternion, dt);
		if (getAirState && getAirState() !== "AIR_MOVE") return;
		if (aiModeActive) return;
		if (vec3IsNearZero(mapped, .001)) return;
		enqueueMotion(mapped.x, mapped.y, mapped.z);
	});
	relSensor.addEventListener("error", (event) => {
		log("RelativeOrientationSensor error: " + (event?.error?.message || event?.message || event));
		startDeviceOrientationFallback();
		return "none";
	});
	try {
		relSensor.start();
		log("RelativeOrientationSensor started (120 Hz)");
	} catch (err) {
		log("RelativeOrientationSensor start failed: " + (err?.message || err));
		startDeviceOrientationFallback();
		return "none";
	}
	return "relative-orientation";
}
//#endregion
//#region ../../modules/views/airpad-view/src/ui/air-button.ts
var airState = "IDLE";
var airDownTime = 0;
var airDownPos = null;
var airMoveTimer = null;
var dragActive = false;
var lastSwipePos = null;
var swipeDirection = null;
var lastTapEndTime = 0;
var lastTapWasClean = false;
var pendingDragOnHold = false;
var neighborPointerHandlersBound = /* @__PURE__ */ new WeakSet();
var airPointerDownBound = /* @__PURE__ */ new WeakSet();
var airSurfaceDocumentRoutingAttached = false;
var airSurfacePointerId = null;
var airSurfaceCaptureTarget = null;
var DOUBLE_TAP_WINDOW = 300;
var TAP_MOVE_FORGIVENESS = Math.max(6, 12);
/** WHY: must exceed {@link TAP_THRESHOLD} so short taps never spin up gyro drift before click. */
var AIR_MOVE_HOLD_MS = 280;
var AIR_MOVE_TAP_GRACE_MS = 340;
var AIR_MOVE_TAP_GRACE_MOVE = Math.max(6, 16);
function getAirState() {
	return airState;
}
function setAirStatus(state) {
	const airStatusEl = getAirStatusEl();
	const airButton = getAirButton();
	airState = state;
	if (airStatusEl) airStatusEl.textContent = state + (dragActive ? " [DRAG]" : "");
	if (airButton) {
		airButton.classList.toggle("air-move", state === "AIR_MOVE");
		airButton.classList.toggle("active", state !== "IDLE");
		airButton.classList.toggle("drag-active", dragActive);
	}
}
function resetAirState() {
	setAirStatus("IDLE");
	airDownPos = null;
	lastSwipePos = null;
	swipeDirection = null;
	pendingDragOnHold = false;
	if (airMoveTimer !== null) {
		clearTimeout(airMoveTimer);
		airMoveTimer = null;
	}
	resetMotionAccum();
}
function startJsAirMoveSensors() {
	ensureAirMoveMotionSensors().then((source) => {
		if (source === "relative" || source === "orientation-fallback") return;
		setAirpadMotionActiveSource("gyro");
		startLegacyAirMoveSensors();
	});
}
function startLegacyAirMoveSensors() {
	onEnterAirMove$1();
	onEnterAirMove();
	ensureGyroscopeActive();
	ensureAccelerometerActive();
}
/**
* Входит в режим AIR_MOVE — управление курсором через гироскоп/акселерометр.
* @param startDrag - если true, сразу активируется drag-режим (зажатая ЛКМ)
*/
function enterAirMove(startDrag = false) {
	setAirStatus("AIR_MOVE");
	resetRelativeOrientationRuntimeState();
	startJsAirMoveSensors();
	if (startDrag && !dragActive) {
		dragActive = true;
		sendAirPadIntent({
			type: "pointer.down",
			button: "left"
		});
		log("Air: AIR_MOVE + DRAG started (mouse down)");
		setAirStatus("AIR_MOVE");
	} else log("Air: AIR_MOVE started (cursor control via sensors)");
}
/**
* Выход из AIR_MOVE режима
*/
/** Discard pending motion/sensor state when AIR_MOVE ends — do not flush tail deltas. */
function stopAirMoveMotionPipeline() {
	resetMotionAccum();
	resetRelativeOrientationRuntimeState();
}
function exitAirMove() {
	if (airState !== "AIR_MOVE") return;
	if (dragActive) {
		sendAirPadIntent({
			type: "pointer.up",
			button: "left"
		});
		log("Air: DRAG ended (mouse up)");
		dragActive = false;
	} else log("Air: AIR_MOVE ended");
	stopAirMoveMotionPipeline();
	setAirStatus("IDLE");
}
/** Freeze motion queue and flush last deltas before a discrete click (tap / context menu). */
function prepareForDiscreteClick() {
	if (airState === "AIR_MOVE") exitAirMove();
	else setAirStatus("IDLE");
	flushMotionNow();
	resetMotionAccum();
	resetRelativeOrientationRuntimeState();
}
function releaseAirPointerCapture() {
	if (airSurfacePointerId !== null && airSurfaceCaptureTarget) try {
		airSurfaceCaptureTarget.releasePointerCapture(airSurfacePointerId);
	} catch {}
	airSurfacePointerId = null;
	airSurfaceCaptureTarget = null;
}
function cancelActiveAirGesture(reason) {
	if (dragActive) {
		sendAirPadIntent({
			type: "pointer.up",
			button: "left"
		});
		dragActive = false;
		log(`Air: drag cancelled (${reason}, mouse up)`);
	} else if (airState === "AIR_MOVE") log(`Air: AIR_MOVE cancelled (${reason})`);
	releaseAirPointerCapture();
	stopAirMoveMotionPipeline();
	resetAirState();
}
function airOnDown(e) {
	connectAirPadSession();
	if (checkIsAiModeActive()) return;
	const now = Date.now();
	const timeSinceLastTap = now - lastTapEndTime;
	if (lastTapWasClean && timeSinceLastTap < DOUBLE_TAP_WINDOW) {
		pendingDragOnHold = true;
		log(`Air: double-tap detected (${timeSinceLastTap}ms since last tap), preparing for drag...`);
	} else pendingDragOnHold = false;
	lastTapWasClean = false;
	if (airMoveTimer !== null) {
		clearTimeout(airMoveTimer);
		airMoveTimer = null;
	}
	airDownTime = now;
	airDownPos = {
		x: e.clientX,
		y: e.clientY
	};
	setAirStatus("WAIT_TAP_OR_HOLD");
	airMoveTimer = globalThis?.setTimeout?.(() => {
		airMoveTimer = null;
		if (airState !== "WAIT_TAP_OR_HOLD") return;
		enterAirMove(pendingDragOnHold);
	}, AIR_MOVE_HOLD_MS);
}
function airOnUp(e) {
	if (checkIsAiModeActive()) {
		resetAirState();
		return;
	}
	const now = Date.now();
	const dt = now - airDownTime;
	const pointerUpX = e?.clientX ?? airDownPos?.x ?? 0;
	const pointerUpY = e?.clientY ?? airDownPos?.y ?? 0;
	let wasCleanTap = false;
	let shouldClickFromAirMoveGrace = false;
	if (airState === "AIR_MOVE" && !dragActive && airDownPos) {
		const dx = pointerUpX - airDownPos.x;
		const dy = pointerUpY - airDownPos.y;
		shouldClickFromAirMoveGrace = dt < AIR_MOVE_TAP_GRACE_MS && Math.hypot(dx, dy) < AIR_MOVE_TAP_GRACE_MOVE;
	}
	if (airState === "AIR_MOVE") exitAirMove();
	if (airState === "GESTURE_SWIPE") log("Air: swipe gesture ended");
	if (airState === "WAIT_TAP_OR_HOLD") {
		if (airDownPos && dt < 200) {
			const dx = pointerUpX - airDownPos.x;
			const dy = pointerUpY - airDownPos.y;
			if (Math.hypot(dx, dy) < TAP_MOVE_FORGIVENESS) {
				wasCleanTap = true;
				if (!pendingDragOnHold) {
					prepareForDiscreteClick();
					sendAirPadIntent({
						type: "pointer.click",
						button: "left"
					});
					log("Air: tap → click");
				} else {
					prepareForDiscreteClick();
					sendAirPadIntent({
						type: "pointer.click",
						button: "left",
						count: 2
					});
					log("Air: tap-tap → double-click");
					wasCleanTap = false;
				}
			}
		}
	}
	if (shouldClickFromAirMoveGrace) {
		prepareForDiscreteClick();
		sendAirPadIntent({
			type: "pointer.click",
			button: "left"
		});
		log("Air: short hold + small move → click (grace)");
		wasCleanTap = true;
	}
	lastTapEndTime = now;
	lastTapWasClean = wasCleanTap;
	if (wasCleanTap) log(`Air: clean tap recorded, next tap+hold within ${DOUBLE_TAP_WINDOW}ms will start drag`);
	dragActive = false;
	resetAirState();
}
function handleAirSurfaceMove(x, y) {
	if (!airDownPos) return;
	const dxSurf = x - airDownPos.x;
	const dySurf = y - airDownPos.y;
	if (airState === "WAIT_TAP_OR_HOLD") {
		if (Math.hypot(dxSurf, dySurf) > 40) {
			if (airMoveTimer !== null) {
				clearTimeout(airMoveTimer);
				airMoveTimer = null;
			}
			pendingDragOnHold = false;
			lastTapWasClean = false;
			setAirStatus("GESTURE_SWIPE");
			startSwipeGesture(dxSurf, dySurf);
		}
	} else if (airState === "GESTURE_SWIPE") continueSwipeGesture(x, y);
}
function startSwipeGesture(dxSurf, dySurf) {
	if (Math.abs(dySurf) > Math.abs(dxSurf)) {
		swipeDirection = "vertical";
		lastSwipePos = {
			x: airDownPos.x,
			y: airDownPos.y
		};
		sendAirPadIntent({
			type: "pointer.scroll",
			dx: 0,
			dy: Math.round(dySurf * .8)
		});
		log(`Air: swipe ${dySurf > 0 ? "down" : "up"} → scroll`);
	} else {
		swipeDirection = "horizontal";
		const direction = dxSurf > 0 ? "right" : "left";
		log(`Air: swipe ${direction}`);
		sendAirPadIntent({
			type: "gesture.swipe",
			direction
		});
		resetAirState();
	}
}
function continueSwipeGesture(x, y) {
	if (!lastSwipePos || !airDownPos || swipeDirection !== "vertical") return;
	const dy = y - lastSwipePos.y;
	if (Math.abs(dy) > 2) {
		sendAirPadIntent({
			type: "pointer.scroll",
			dx: 0,
			dy: Math.round(dy * .8)
		});
		lastSwipePos = {
			x,
			y
		};
	}
}
var neighborState = "IDLE";
var neighborDownTime = 0;
var neighborDownPos = null;
var neighborHoldTimer = null;
var neighborPointerId = null;
var NEIGHBOR_HOLD_DELAY = 250;
var NEIGHBOR_TAP_THRESHOLD = 200;
var NEIGHBOR_MOVE_THRESHOLD = 15;
function enterMiddleScrollMode() {
	neighborState = "MIDDLE_SCROLL";
	resetAirState();
	sendAirPadIntent({
		type: "pointer.down",
		button: "middle"
	});
	log("Neighbor: MIDDLE_SCROLL started (sensors active)");
	getAirNeighborButton()?.classList.add("middle-scroll-active", "active");
	enterAirMove();
}
function exitMiddleScrollMode() {
	if (neighborState !== "MIDDLE_SCROLL") return;
	sendAirPadIntent({
		type: "pointer.up",
		button: "middle"
	});
	log("Neighbor: MIDDLE_SCROLL ended");
	neighborState = "IDLE";
	resetAirState();
	getAirNeighborButton()?.classList.remove("middle-scroll-active", "active");
}
function resetNeighborState() {
	if (neighborHoldTimer !== null) {
		clearTimeout(neighborHoldTimer);
		neighborHoldTimer = null;
	}
	neighborDownPos = null;
	neighborState = "IDLE";
	getAirNeighborButton()?.classList.remove("middle-scroll-active", "active");
	resetAirState();
}
function initNeighborButton() {
	const neighborButton = getAirNeighborButton();
	if (!neighborButton) return;
	if (neighborPointerHandlersBound.has(neighborButton)) return;
	neighborPointerHandlersBound.add(neighborButton);
	neighborButton.addEventListener("pointerdown", (e) => {
		e.preventDefault();
		if (neighborPointerId !== null && neighborPointerId !== e.pointerId) return;
		connectAirPadSession();
		if (checkIsAiModeActive()) return;
		neighborPointerId = e.pointerId;
		neighborButton.setPointerCapture(neighborPointerId);
		neighborDownTime = Date.now();
		neighborDownPos = {
			x: e.clientX,
			y: e.clientY
		};
		neighborState = "WAIT_TAP_OR_HOLD";
		neighborButton.classList.add("active");
		neighborHoldTimer = globalThis?.setTimeout?.(() => {
			neighborHoldTimer = null;
			if (neighborState === "WAIT_TAP_OR_HOLD") enterMiddleScrollMode();
		}, NEIGHBOR_HOLD_DELAY);
	});
	neighborButton.addEventListener("pointermove", (e) => {
		if (e.pointerId !== neighborPointerId || !neighborDownPos) return;
		e.preventDefault();
		if (neighborState === "WAIT_TAP_OR_HOLD") {
			const dx = e.clientX - neighborDownPos.x;
			const dy = e.clientY - neighborDownPos.y;
			if (Math.hypot(dx, dy) > NEIGHBOR_MOVE_THRESHOLD) {
				if (neighborHoldTimer !== null) {
					clearTimeout(neighborHoldTimer);
					neighborHoldTimer = null;
				}
			}
		}
	});
	neighborButton.addEventListener("pointerup", (e) => {
		if (e.pointerId !== neighborPointerId) return;
		e.preventDefault();
		const dt = Date.now() - neighborDownTime;
		if (neighborState === "MIDDLE_SCROLL") exitMiddleScrollMode();
		else if (neighborState === "WAIT_TAP_OR_HOLD" && dt < NEIGHBOR_TAP_THRESHOLD) {
			if (neighborDownPos) {
				const dx = e.clientX - neighborDownPos.x;
				const dy = e.clientY - neighborDownPos.y;
				if (Math.hypot(dx, dy) < NEIGHBOR_MOVE_THRESHOLD) {
					prepareForDiscreteClick();
					sendAirPadIntent({
						type: "pointer.click",
						button: "right"
					});
					log("Neighbor: tap → right-click (context menu)");
				}
			}
		}
		if (neighborPointerId !== null) {
			neighborButton.releasePointerCapture(neighborPointerId);
			neighborPointerId = null;
		}
		resetNeighborState();
	});
	neighborButton.addEventListener("pointercancel", (e) => {
		if (e?.pointerId === neighborPointerId || e?.pointerId == null) {
			if (neighborState === "MIDDLE_SCROLL") {
				sendAirPadIntent({
					type: "pointer.up",
					button: "middle"
				});
				log("Neighbor: middle-scroll cancelled");
			}
			if (neighborPointerId !== null) {
				neighborButton.releasePointerCapture(neighborPointerId);
				neighborPointerId = null;
			}
			resetNeighborState();
		}
	});
	neighborButton.addEventListener("contextmenu", (e) => {
		e.preventDefault();
	});
	log("Neighbor button initialized (tap: right-click, hold: middle-scroll via sensors)");
}
function initAirButton() {
	const airButton = getAirButton();
	if (!airButton) return;
	initNeighborButton();
	if (!airPointerDownBound.has(airButton)) {
		airPointerDownBound.add(airButton);
		airButton.addEventListener("pointerdown", (e) => {
			e.preventDefault();
			if (airSurfacePointerId !== null && airSurfacePointerId !== e.pointerId) return;
			airSurfacePointerId = e.pointerId;
			airSurfaceCaptureTarget = airButton;
			airSurfaceCaptureTarget.setPointerCapture(airSurfacePointerId);
			airOnDown(e);
		});
	}
	if (!airSurfaceDocumentRoutingAttached) {
		airSurfaceDocumentRoutingAttached = true;
		const routingDoc = airButton.ownerDocument;
		routingDoc.addEventListener("pointermove", (e) => {
			if (e.pointerId !== airSurfacePointerId) return;
			e.preventDefault();
			if (!airDownPos) return;
			if (checkIsAiModeActive()) return;
			handleAirSurfaceMove(e.clientX, e.clientY);
		});
		routingDoc.addEventListener("pointerup", (e) => {
			if (e.pointerId !== airSurfacePointerId) return;
			e.preventDefault();
			releaseAirPointerCapture();
			airOnUp(e);
		});
		routingDoc.addEventListener("pointercancel", (e) => {
			if (e?.pointerId !== airSurfacePointerId && e?.pointerId != null) return;
			cancelActiveAirGesture("pointercancel");
		});
		airButton.addEventListener("lostpointercapture", (e) => {
			if (e?.pointerId !== airSurfacePointerId && e?.pointerId != null) return;
			cancelActiveAirGesture("lostpointercapture");
		});
		routingDoc.addEventListener("visibilitychange", () => {
			if (routingDoc.visibilityState === "hidden") cancelActiveAirGesture("visibilitychange");
		});
		globalThis.addEventListener("pagehide", () => {
			cancelActiveAirGesture("pagehide");
		});
		globalThis.addEventListener("blur", () => {
			cancelActiveAirGesture("window-blur");
		});
	}
	log("Air button initialized");
}
//#endregion
//#region ../../modules/views/airpad-view/src/ui/phone-clipboard.ts
/**
* Phone clipboard helpers for AirPad toolbar.
* @see https://web.dev/articles/async-clipboard
*/
var CLIPBOARD_PKGS = ["@supernotes/capacitor-clipboard", "@capacitor/clipboard"];
var isCapacitorNative = () => {
	try {
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform());
	} catch {
		return false;
	}
};
var clipboardReadPermission = null;
/** Probe {@code clipboard-read} once (prompt may appear on first {@code readText}). */
function primeClipboardReadPermission() {
	const perms = globalThis.navigator?.permissions;
	if (!perms?.query) return;
	perms.query({ name: "clipboard-read" }).then((status) => {
		clipboardReadPermission = status;
		status.onchange = () => {
			clipboardReadPermission = status;
		};
	}).catch(() => {});
}
function isClipboardReadDenied() {
	return clipboardReadPermission?.state === "denied";
}
var extractBridgeText = (result) => {
	if (!result || typeof result !== "object") return "";
	const echo = result.echo;
	if (echo && typeof echo === "object") {
		const e = echo;
		if (typeof e.text === "string") return e.text;
		if (typeof e.value === "string") return e.value;
	}
	return "";
};
/** Native shell: overlay + Java clipboard read + remote {@code keyboard:type}. */
function triggerNativePasteRemote(done) {
	if (!isCapacitorCwsNativeShell()) {
		done({
			ok: false,
			text: "",
			error: "not native shell"
		});
		return;
	}
	invokeCwsNative("clipboard:paste-remote", {}).then((result) => {
		const text = extractBridgeText(result);
		const ok = Boolean(result?.ok);
		done({
			ok,
			text,
			error: ok ? void 0 : "native paste failed"
		});
	}).catch((err) => {
		done({
			ok: false,
			text: "",
			error: String(err?.message || err)
		});
	});
}
/** Web Async Clipboard API — must run during user activation (click). */
function readWebClipboardText(done) {
	const clip = globalThis.navigator?.clipboard;
	if (!clip?.readText) {
		done("", "navigator.clipboard.readText unavailable");
		return;
	}
	clip.readText().then((text) => done(String(text ?? "")), (err) => done("", String(err?.message || err)));
}
var writeViaCwsBridge = (text, done) => {
	if (!isCapacitorCwsNativeShell()) {
		done(false);
		return;
	}
	invokeCwsNative("clipboard:write-local", { text }).then((result) => done(Boolean(result?.ok))).catch(() => done(false));
};
var writeViaCapacitor = (text, done) => {
	if (!isCapacitorNative()) {
		done(false);
		return;
	}
	(async () => {
		for (const pkg of CLIPBOARD_PKGS) try {
			const mod = await import(
				/* @vite-ignore */
				pkg
);
			if (!mod?.Clipboard?.write) continue;
			await mod.Clipboard.write({ string: text });
			done(true);
			return;
		} catch {}
		done(false);
	})();
};
/** Write text to phone clipboard (copy-from-remote). */
function writeAirPadPhoneClipboard(text, done) {
	const value = String(text ?? "");
	writeViaCwsBridge(value, (ok) => {
		if (ok) {
			done(true);
			return;
		}
		writeViaCapacitor(value, (capOk) => {
			if (capOk) {
				done(true);
				return;
			}
			const clip = globalThis.navigator?.clipboard;
			if (!clip?.writeText) {
				done(false);
				return;
			}
			clip.writeText(value).then(() => done(true), () => done(false));
		});
	});
}
//#endregion
//#region ../../modules/views/airpad-view/src/ui/clipboard-toolbar.ts
var unsubscribeClipboardUpdate = null;
var boundCopyButtons = /* @__PURE__ */ new WeakSet();
var boundCutButtons = /* @__PURE__ */ new WeakSet();
var boundPasteButtons = /* @__PURE__ */ new WeakSet();
/** Call when Airpad unmounts so a fresh DOM gets listeners on next mount. */
function resetClipboardToolbarState() {
	if (unsubscribeClipboardUpdate) {
		unsubscribeClipboardUpdate();
		unsubscribeClipboardUpdate = null;
	}
}
function setPreview(text, meta) {
	const clipboardPreviewEl = getClipboardPreviewEl();
	if (!clipboardPreviewEl || typeof clipboardPreviewEl === "undefined") return;
	const source = meta?.source ? String(meta.source) : "pc";
	const safeText = String(text ?? "");
	if (!safeText) {
		clipboardPreviewEl.classList.remove("visible");
		clipboardPreviewEl.innerHTML = "";
		return;
	}
	clipboardPreviewEl.innerHTML = `
        <div class="meta">Clipboard (${source})</div>
        <div class="text"></div>
    `;
	const textEl = clipboardPreviewEl.querySelector(".text");
	if (textEl) textEl.textContent = safeText;
	clipboardPreviewEl.classList.add("visible");
}
function finishPasteToRemote(text) {
	const normalized = String(text ?? "").trim();
	if (!normalized) {
		log("Paste: phone clipboard is empty.");
		return;
	}
	requestAirPadClipboardPaste(normalized).then((res) => {
		if (!res?.ok) {
			log("Paste failed: " + (res?.error || "unknown"));
			return;
		}
		setPreview(normalized, { source: "phone" });
	});
}
/** Sync click handler — work via .then(), no async/await in the gesture stack. */
function handlePasteClick() {
	dismissKeyboardForControlInteraction();
	if (isCapacitorCwsNativeShell()) {
		triggerNativePasteRemote((result) => {
			if (result.ok) {
				const t = String(result.text || "").trim();
				if (t) setPreview(t, { source: "phone" });
				return;
			}
			log("Paste failed: " + (result.error || "native"));
		});
		return;
	}
	if (isClipboardReadDenied()) {
		log("Paste: clipboard-read permission denied in browser settings.");
		return;
	}
	readWebClipboardText((text, error) => {
		if (error && !text) {
			log("Paste: " + error);
			return;
		}
		finishPasteToRemote(text);
	});
}
function bindClipboardButton(btn, bound, onActivate) {
	if (!btn || bound.has(btn)) return;
	bound.add(btn);
	btn.addEventListener("pointerdown", () => {
		dismissKeyboardForControlInteraction();
	}, { passive: true });
	btn.addEventListener("click", onActivate);
}
function bindPasteClipboardButton(btn) {
	if (!btn || boundPasteButtons.has(btn)) return;
	boundPasteButtons.add(btn);
	btn.addEventListener("click", handlePasteClick);
}
function initClipboardToolbar() {
	primeClipboardReadPermission();
	const btnCut = getBtnCut();
	const btnCopy = getBtnCopy();
	const btnPaste = getBtnPaste();
	if (unsubscribeClipboardUpdate) unsubscribeClipboardUpdate();
	unsubscribeClipboardUpdate = onAirPadRemoteClipboardUpdate((text, meta) => setPreview(text, meta));
	requestAirPadClipboardRead().then((res) => {
		if (res?.ok && typeof res.text === "string") setPreview(res.text, { source: "pc" });
	});
	if (btnCopy) bindClipboardButton(btnCopy, boundCopyButtons, () => {
		requestAirPadClipboardCopy().then((res) => {
			if (!res?.ok) {
				log("Copy failed: " + (res?.error || "unknown"));
				return;
			}
			const text = String(res.text || "");
			setPreview(text, { source: "pc" });
			writeAirPadPhoneClipboard(text, (ok) => {
				if (!ok) log("PC clipboard received — copy from preview if phone write blocked.");
			});
		});
	});
	if (btnCut) bindClipboardButton(btnCut, boundCutButtons, () => {
		requestAirPadClipboardCut().then((res) => {
			if (!res?.ok) {
				log("Cut failed: " + (res?.error || "unknown"));
				return;
			}
			const text = String(res.text || "");
			setPreview(text, { source: "pc" });
			writeAirPadPhoneClipboard(text, (ok) => {
				if (!ok) log("PC clipboard received (cut) — copy from preview if phone write blocked.");
			});
		});
	});
	if (btnPaste) bindPasteClipboardButton(btnPaste);
}
//#endregion
//#region ../../modules/views/airpad-view/src/ui/config-ui.ts
/** Marker for teardown; do not reuse generic `.config-overlay` alone (other features could add one). */
var AIRPAD_CONFIG_MARKER = "airpad-config-overlay";
/**
* Mount on the owner `document.body` (not `cw-shell-minimal` / task-tab host).
* Minimal shell uses `contain: strict` + `overflow: hidden`; children with `position: fixed`
* are still clipped to that host, so the dialog stays in the DOM but is not visible.
*/
function getConfigOverlayMountParent() {
	const doc = getAirpadOwnerDocument() ?? document;
	return doc.body ?? doc.documentElement ?? document.body;
}
/** Body-portaled overlay is not under `[data-shell][data-theme]`, so copy theme for SCSS tokens. */
function syncAirpadConfigOverlayShellTheme(overlay, doc) {
	const theme = (doc.querySelector("cw-shell-minimal[data-theme]") ?? doc.querySelector("[data-shell-system=\"task-tab\"][data-theme]") ?? doc.querySelector("[data-shell][data-theme]"))?.getAttribute("data-theme");
	if (theme === "light" || theme === "dark") overlay.setAttribute("data-theme", theme);
	else overlay.removeAttribute("data-theme");
}
function createConfigUI() {
	const overlay = (getAirpadOwnerDocument() ?? document).createElement("div");
	overlay.className = `config-overlay ${AIRPAD_CONFIG_MARKER}`;
	overlay.innerHTML = `
        <div class="config-panel">
            <h3>Airpad Configuration</h3>
            <div class="config-panel__body">
                <div class="config-group">
                    <label for="airpadQuickConnect"><strong>Where to connect</strong>:</label>
                    <input
                        type="text"
                        id="airpadQuickConnect"
                        name="airpad-quick-connect"
                        placeholder="192.168.0.110 or 45.147.121.152"
                    />
                    <label for="airpadAuthPass"><strong>Auth pass token</strong> (optional):</label>
                    <input
                        type="password"
                        id="airpadAuthPass"
                        name="airpad-auth-pass"
                        autocomplete="off"
                        placeholder="If the remote requires a control token for input/mouse"
                    />
                    <div class="field-hint">
                        Target device ID, IP, or domain. Ports are auto-discovered (8434, 443, 8080, …). Auth pass is optional.
                    </div>
                </div>
            </div>

            <div class="config-actions">
                <button id="saveConfig" type="button" name="airpad-config-save">Save & Reconnect</button>
                <button id="cancelConfig" type="button" name="airpad-config-cancel">Cancel</button>
            </div>
        </div>
    `;
	const quickConnectInput = overlay.querySelector("#airpadQuickConnect");
	const authPassInput = overlay.querySelector("#airpadAuthPass");
	const saveButton = overlay.querySelector("#saveConfig");
	const cancelButton = overlay.querySelector("#cancelConfig");
	quickConnectInput.value = getAirPadQuickConnectTarget();
	authPassInput.value = getAccessToken();
	const closeOverlay = () => {
		overlay.classList.remove("flex");
		overlay.style.display = "none";
		overlay.setAttribute("aria-hidden", "true");
	};
	saveButton.addEventListener("click", () => {
		if (saveButton.disabled) return;
		saveButton.disabled = true;
		const quickValue = quickConnectInput.value;
		const token = authPassInput.value;
		setAccessToken(token);
		setAirPadQuickConnectTarget(quickValue, { discover: false });
		closeOverlay();
		saveButton.disabled = false;
		(async () => {
			try {
				await setAirPadQuickConnectTarget(quickValue, {
					discover: true,
					probeTimeoutMs: 1200,
					maxProbeCandidates: 3
				});
				const nativeSync = await syncAirpadRemoteConfigToNativeShell();
				if (!nativeSync.ok) console.warn("[AirPad] native settings sync failed:", nativeSync.error);
			} catch (error) {
				console.warn("[AirPad] background save/reconnect failed:", error);
			}
			reconnectAirPadSessionAfterConfigChange({
				delayMs: 80,
				skipNativeSync: true
			});
		})();
	});
	cancelButton.addEventListener("click", closeOverlay);
	overlay.addEventListener("click", (e) => {
		if (e.target === overlay) closeOverlay();
	});
	return overlay;
}
function showConfigUI() {
	try {
		hideKeyboard();
	} catch {}
	const doc = getAirpadOwnerDocument() ?? document;
	const host = getConfigOverlayMountParent();
	let overlay = doc.querySelector(`.${AIRPAD_CONFIG_MARKER}`);
	if (overlay && overlay.parentElement !== host) {
		overlay.remove();
		overlay = null;
	}
	if (!overlay) {
		overlay = createConfigUI();
		host.appendChild(overlay);
	} else {
		const quickConnectInput = overlay.querySelector("#airpadQuickConnect");
		const authPassInput = overlay.querySelector("#airpadAuthPass");
		if (quickConnectInput) quickConnectInput.value = getAirPadQuickConnectTarget();
		if (authPassInput) authPassInput.value = getAccessToken();
	}
	syncAirpadConfigOverlayShellTheme(overlay, doc);
	overlay.classList.add("flex");
	overlay.style.display = "flex";
	overlay.style.zIndex = "120000";
	overlay.setAttribute("aria-hidden", "false");
}
/** Remove portaled overlay when Airpad unmounts (avoids stale node on body/shell). */
function teardownAirpadConfigOverlay() {
	(getAirpadOwnerDocument() ?? document).querySelectorAll(`.${AIRPAD_CONFIG_MARKER}`).forEach((el) => el.remove());
}
//#endregion
//#region ../../modules/views/airpad-view/src/component/AirpadEventBus.ts
var AirpadEventBus = class {
	handlers = /* @__PURE__ */ new Map();
	on(event, handler) {
		const existing = this.handlers.get(event) ?? /* @__PURE__ */ new Set();
		existing.add(handler);
		this.handlers.set(event, existing);
		return () => this.off(event, handler);
	}
	off(event, handler) {
		const existing = this.handlers.get(event);
		if (!existing) return;
		existing.delete(handler);
		if (existing.size === 0) this.handlers.delete(event);
	}
	emit(event, payload) {
		const existing = this.handlers.get(event);
		if (!existing) return;
		for (const handler of existing) handler(payload);
	}
	clear() {
		this.handlers.clear();
	}
};
var getAirpadEventBus = () => cwspGlobal(CWSP_SLOT.airpadEventBus, () => new AirpadEventBus());
//#endregion
//#region ../../modules/views/airpad-view/src/component/CwAirpadActionRail.ts
var TAG$1 = "cw-airpad-action-rail";
var CwAirpadActionRailElement = class extends HTMLElement {
	abort = null;
	connectedCallback() {
		this.ensureRendered();
	}
	disconnectedCallback() {
		this.disconnect();
	}
	connect(bus) {
		this.disconnect();
		this.ensureRendered();
		this.abort = new AbortController();
		const signal = this.abort.signal;
		this.addEventListener("click", (e) => {
			const t = e.target;
			if (!(t instanceof Element)) return;
			if (!this.contains(t)) return;
			if (t.closest("#btnConfig")) bus.emit("ui.config.open", void 0);
			if (t.closest("#btnAdminDoor")) bus.emit("ui.admin.open", void 0);
		}, {
			capture: true,
			signal
		});
	}
	disconnect() {
		this.abort?.abort();
		this.abort = null;
	}
	ensureRendered() {
		if (this.querySelector("#clipboardToolbar")) return;
		this.innerHTML = `
            <div class="bottom-toolbar" id="clipboardToolbar" aria-label="Clipboard actions">
                <button type="button" id="btnCut" name="airpad-clipboard-cut" tabindex="-1" data-no-virtual-keyboard="true" class="toolbar-btn" aria-label="Cut (Ctrl+X)">✂️</button>
                <button type="button" id="btnCopy" name="airpad-clipboard-copy" tabindex="-1" data-no-virtual-keyboard="true" class="toolbar-btn" aria-label="Copy (Ctrl+C)">📋</button>
                <button type="button" id="btnPaste" name="airpad-clipboard-paste" tabindex="-1" data-no-virtual-keyboard="true" class="toolbar-btn" aria-label="Paste (Ctrl+V)">📥</button>
                <button type="button" id="btnConnect" name="airpad-ws-connect" tabindex="-1" data-no-virtual-keyboard="true" class="toolbar-btn connect-fab connect-fab--ws">WS ↔</button>
                <button type="button" id="btnAdminDoor" name="airpad-admin-door" tabindex="-1" data-no-virtual-keyboard="true" class="toolbar-btn toolbar-btn--admin-door" aria-label="Open server admin (HTTPS)" title="Server admin (HTTPS :8434)">ADM</button>
                <button type="button" id="btnConfig" name="airpad-config" tabindex="-1" data-no-virtual-keyboard="true" class="toolbar-btn" aria-label="Configuration" title="Configuration">⚙️</button>
            </div>
            <div id="clipboardPreview" class="clipboard-preview" aria-live="polite"></div>
        `;
	}
};
function ensureCwAirpadActionRailDefined() {
	const ce = globalThis?.customElements;
	if (!ce || typeof ce.get !== "function" || typeof ce.define !== "function") return;
	if (ce.get(TAG$1)) return;
	ce.define(TAG$1, CwAirpadActionRailElement);
}
//#endregion
//#region ../../modules/views/airpad-view/src/component/CwAirpadSidePanels.ts
var TAG = "cw-airpad-side-panels";
var CwAirpadSidePanelsElement = class extends HTMLElement {
	abort = null;
	connectedCallback() {
		this.ensureRendered();
	}
	disconnectedCallback() {
		this.disconnect();
	}
	connect(bus) {
		this.disconnect();
		this.ensureRendered();
		this.abort = new AbortController();
		const signal = this.abort.signal;
		const byId = (id) => this.querySelector(`#${CSS.escape(id)}`);
		const hookOverlay = (toggleId, overlayId, closeId) => {
			const overlay = byId(overlayId);
			const toggle = byId(toggleId);
			const close = byId(closeId);
			if (!overlay || !toggle) return;
			const openOverlay = () => {
				overlay.classList.add("open");
				overlay.setAttribute("aria-hidden", "false");
				toggle.setAttribute("aria-expanded", "true");
			};
			const closeOverlay = () => {
				overlay.classList.remove("open");
				overlay.setAttribute("aria-hidden", "true");
				toggle.setAttribute("aria-expanded", "false");
			};
			toggle.addEventListener("click", openOverlay, { signal });
			close?.addEventListener("click", closeOverlay, { signal });
			overlay.addEventListener("click", (e) => {
				if (e.target === overlay) closeOverlay();
			}, { signal });
			this.addEventListener("keydown", (e) => {
				if (e.key === "Escape" && overlay.classList.contains("open")) closeOverlay();
			}, {
				capture: true,
				signal
			});
		};
		hookOverlay("logToggle", "logOverlay", "logClose");
		hookOverlay("hintToggle", "hintOverlay", "hintClose");
		byId("btnReload")?.addEventListener("click", () => bus.emit("ui.reload.request", void 0), { signal });
		byId("btnMotionReset")?.addEventListener("click", () => bus.emit("ui.motion.reset", void 0), { signal });
	}
	disconnect() {
		this.abort?.abort();
		this.abort = null;
	}
	ensureRendered() {
		if (this.querySelector("#logOverlay")) return;
		this.innerHTML = `
            <div class="side-actions-row" role="group" aria-label="Panels">
                <button type="button" id="hintToggle" name="airpad-hints-toggle" tabindex="-1" data-no-virtual-keyboard="true" class="side-log-toggle side-hint-toggle" aria-controls="hintOverlay" aria-expanded="false">Hints</button>
                <button type="button" id="logToggle" name="airpad-log-toggle" tabindex="-1" data-no-virtual-keyboard="true" class="side-log-toggle" aria-controls="logOverlay" aria-expanded="false">Логи</button>
                <button type="button" id="btnMotionReset" name="airpad-motion-reset" tabindex="-1" data-no-virtual-keyboard="true" class="side-log-toggle side-fix-toggle" aria-label="Reset motion calibration">Fix</button>
                <button type="button" id="btnReload" name="airpad-reload" tabindex="-1" data-no-virtual-keyboard="true" class="side-log-toggle side-reload-toggle" aria-label="Reload">Reload</button>
            </div>

            <div id="logOverlay" class="log-overlay" aria-hidden="true">
                <div class="log-panel">
                    <div class="log-overlay-header">
                        <span>Журнал соединения</span>
                        <button type="button" id="logClose" name="airpad-log-close" class="ghost-btn" aria-label="Закрыть логи">Закрыть</button>
                    </div>
                    <div id="logContainer" class="log-container"></div>
                </div>
            </div>

            <div id="hintOverlay" class="log-overlay hint-overlay" aria-hidden="true">
                <div class="log-panel hint-panel">
                    <div class="log-overlay-header">
                        <span>Подсказки AirPad</span>
                        <button type="button" id="hintClose" name="airpad-hint-close" class="ghost-btn" aria-label="Закрыть подсказки">Закрыть</button>
                    </div>
                    <section class="hint hint-modal-content" id="hintPanel" aria-label="Airpad quick help">
                        <details class="hint-group" data-hint-group>
                            <summary>Жесты Air-кнопки</summary>
                            <ul><li>Короткий тап — клик.</li><li>Удержание &gt; 100ms — режим air-мыши.</li><li>Свайп вверх/вниз по кнопке — скролл.</li><li>Свайп влево/вправо — жест.</li></ul>
                        </details>
                        <details class="hint-group" data-hint-group>
                            <summary>AI-кнопка</summary>
                            <ul><li>Нажми и держи — идёт распознавание речи.</li><li>Отпусти — команда уйдёт в endpoint voice pipeline.</li></ul>
                        </details>
                        <details class="hint-group" data-hint-group>
                            <summary>Виртуальная клавиатура</summary>
                            <ul><li>Открой кнопкой ⌨️ на нижней панели.</li><li>Поддерживает текст, эмодзи и спецсимволы.</li><li>Передаёт ввод в бинарном формате.</li></ul>
                        </details>
                    </section>
                </div>
            </div>
        `;
	}
};
function ensureCwAirpadSidePanelsDefined() {
	const ce = globalThis?.customElements;
	if (!ce || typeof ce.get !== "function" || typeof ce.define !== "function") return;
	if (ce.get(TAG)) return;
	ce.define(TAG, CwAirpadSidePanelsElement);
}
//#endregion
//#region ../../modules/views/airpad-view/src/main.ts
/**
* AirPad frontend entrypoint.
*
* This module owns the mount/unmount lifecycle for the AirPad view, including
* DOM replacement, transient controller wiring, cross-tab config sync, and the
* teardown path required for shell remounts.
*/
var main_exports = /* @__PURE__ */ __exportAll({
	default: () => mountAirpad,
	unmountAirpadRuntime: () => unmountAirpadRuntime
});
var unsubscribeWsKeyboardSync = null;
var airpadInitToken = 0;
var airpadInitAbort = null;
var airpadCrossTabUnsub = null;
/**
* Release every side effect created by `mountAirpad()`.
*
* WHY: AirPad can be mounted repeatedly by different shells or navigation
* flows. The view keeps process-local listeners and UI overlays, so remounting
* without explicit cleanup would duplicate handlers and leave stale state
* attached to the previous DOM tree.
*/
function unmountAirpadRuntime() {
	teardownKeyboardDismissListeners();
	airpadInitToken += 1;
	airpadInitAbort?.abort();
	airpadInitAbort = null;
	airpadCrossTabUnsub?.();
	airpadCrossTabUnsub = null;
	unsubscribeWsKeyboardSync?.();
	unsubscribeWsKeyboardSync = null;
	resetClipboardToolbarState();
	teardownAirpadConfigOverlay();
	setAirpadDomRoot(null);
	setRemoteKeyboardEnabled(false);
	stopRelativeOrientation();
}
/**
* Build the AirPad DOM and hand control to the async runtime initializer.
*
* INVARIANT: each mount gets a fresh abort signal and token so slow async work
* from an older mount cannot finish against a newer DOM instance.
*/
async function mountAirpad(mountElement) {
	console.log("[Airpad] Mounting airpad app...");
	airpadInitToken += 1;
	airpadInitAbort?.abort();
	const initController = new AbortController();
	airpadInitAbort = initController;
	/** Stable for this mount — do not read `airpadInitAbort.signal` after `await`: unmount may set `airpadInitAbort` to null. */
	const initSignal = initController.signal;
	const currentInitToken = airpadInitToken;
	ensureCwAirpadActionRailDefined();
	ensureCwAirpadSidePanelsDefined();
	let appContainer = mountElement ?? document.body.querySelector("#app") ?? document.body;
	if (!appContainer) {
		appContainer = document.createElement("div");
		appContainer.id = "app";
	}
	appContainer.replaceChildren(H`
        <div class="container">
            <header class="hero">
                <div class="status-container">
                    <div class="status-bar">
                        <div class="status-item">
                            WS:
                            <span id="wsStatus" class="value ws-status-bad">disconnected</span>
                        </div>
                        <div class="status-item">
                            Air:
                            <span id="airStatus" class="value">IDLE</span>
                        </div>
                        <div class="status-item">
                            AI:
                            <span id="aiStatus" class="value">idle</span>
                        </div>
                        <div class="status-item">
                            VK:
                            <span id="vkStatus" class="value">overlay:off</span>
                        </div>
                    </div>
                </div>
            </header>

            <div class="stage">
                <div class="ai-block">
                    <div id="aiButton" name="airpad-ai" class="big-button ai" data-no-virtual-keyboard="true">
                        AI
                    </div>
                    <div class="label">Голосовой ассистент (удерживай для записи)</div>
                </div>

                <div class="air-block">
                    <div class="air-row">
                    <button type="button" id="airButton" name="airpad-air" class="big-button air" data-no-virtual-keyboard="true">
                        Air
                    </button>
                    <button type="button" id="airNeighborButton" name="airpad-neighbor-act" data-no-virtual-keyboard="true"
                        class="neighbor-button">Act</button>
                    </div>
                    <div class="label">Air‑трекбол/курсор и жесты</div>
                </div>
            </div>
            <div id="voiceText" class="voice-line"></div>
        </div>

        <cw-airpad-side-panels></cw-airpad-side-panels>
        <cw-airpad-action-rail></cw-airpad-action-rail>
    `);
	setAirpadDomRoot(appContainer);
	await waitForDomPaint();
	if (initSignal.aborted || currentInitToken !== airpadInitToken) {
		if (getAirpadDomRoot() === appContainer) setAirpadDomRoot(null);
		return;
	}
	await initAirpadApp(currentInitToken, initSignal, appContainer);
}
/**
* Wire controllers, UI components, and runtime services after the DOM exists.
*
* AI-READ: this function assumes the markup inserted by `mountAirpad()` is now
* stable in the document. Querying or binding before `waitForDomPaint()` can
* miss nodes in some shell/layout combinations.
*/
async function initAirpadApp(initToken, signal, domMountRoot) {
	const root = domMountRoot;
	if (!root) {
		console.warn("[Airpad] initAirpadApp: no mount root");
		return;
	}
	const byId = (id) => queryAirpad(`#${CSS.escape(id)}`);
	const bus = getAirpadEventBus();
	const sidePanels = root.querySelector("cw-airpad-side-panels");
	const actionRail = root.querySelector("cw-airpad-action-rail");
	sidePanels?.connect(bus);
	actionRail?.connect(bus);
	signal.addEventListener("abort", () => {
		sidePanels?.disconnect();
		actionRail?.disconnect();
		bus.clear();
	}, { once: true });
	const bindBus = (event, handler) => {
		const off = bus.on(event, handler);
		signal.addEventListener("abort", off, { once: true });
	};
	/** Reset all motion-calibration state so the next gesture starts from a clean baseline. */
	function resetMotionRuntime() {
		resetMotionAccum();
		resetRelativeOrientationRuntimeState();
		log("Motion runtime state reset (recalibrated).");
	}
	bindBus("ui.config.open", () => showConfigUI());
	bindBus("ui.motion.reset", () => resetMotionRuntime());
	bindBus("ui.reload.request", () => {
		try {
			globalThis?.location?.reload?.();
		} catch (e) {
			console.error(e);
		}
		try {
			globalThis?.navigation?.navigate?.("airpad");
		} catch (e) {
			console.error(e);
		}
		try {
			globalThis?.navigation?.reload?.();
		} catch (e) {
			console.error(e);
		}
	});
	/**
	* Collapse hint groups on tighter screens so the control surface remains
	* usable without hiding the hints entirely.
	*/
	function initAdaptiveHintPanel() {
		const hintRoot = byId("hintPanel");
		if (!hintRoot) return;
		const groups = Array.from(hintRoot.querySelectorAll("[data-hint-group]"));
		if (groups.length === 0) return;
		const compactMedia = globalThis.matchMedia("(max-width: 980px), (max-height: 860px)");
		const applyHintDensity = () => {
			const compact = compactMedia.matches;
			groups.forEach((group) => {
				if (compact) group.open = false;
			});
		};
		applyHintDensity();
		compactMedia.addEventListener?.("change", applyHintDensity, { signal });
	}
	const safeToString = (value) => {
		if (value instanceof Error) return `${value.name}: ${value.message}`;
		if (typeof value === "string") return value;
		return String(value);
	};
	const runInitializer = (label, initializer) => {
		try {
			initializer();
		} catch (error) {
			log(`Airpad init [${label}] failed: ${safeToString(error)}`);
		}
	};
	const aborted = () => Boolean(signal.aborted || initToken !== void 0 && initToken !== airpadInitToken);
	if (aborted()) return;
	reloadAirpadRemoteConfigFromStorage();
	airpadCrossTabUnsub ??= attachAirpadCrossTabConfigSync();
	runInitializer("websocket button", () => initAirPadSessionTransport(getBtnConnect()));
	runInitializer("websocket preconnect", () => connectAirPadSession());
	runInitializer("speech", () => initSpeechRecognition());
	runInitializer("AI button", () => initAiButton());
	runInitializer("Air button", () => initAirButton());
	runInitializer("virtual keyboard", () => initVirtualKeyboard(root));
	unsubscribeWsKeyboardSync?.();
	unsubscribeWsKeyboardSync = onAirPadSessionConnectionChange((connected) => {
		setRemoteKeyboardEnabled(connected);
	});
	runInitializer("clipboard toolbar", () => initClipboardToolbar());
	runInitializer("adaptive hint", () => initAdaptiveHintPanel());
	log("Готово. Нажми \"WS Connect\", затем используй Air/AI кнопки.");
	log("Движение мыши: RelativeOrientation + Gyroscope/Accelerometer (запуск при удержании Air).");
	const startSensors = () => {
		if (aborted()) return;
		runInitializer("relative orientation", () => initRelativeOrientation());
		runInitializer("gyroscope", () => initGyro());
		runInitializer("accelerometer", () => initAccelerometer());
	};
	if (typeof globalThis.requestIdleCallback === "function") globalThis.requestIdleCallback(startSensors, { timeout: 2e3 });
	else globalThis.setTimeout(startSensors, 0);
	const deferServiceWorker = () => {
		if (aborted()) return;
		if (globalThis.location?.protocol === "chrome-extension:") return;
		initServiceWorker({
			immediate: false,
			onRegistered() {
				log("PWA: service worker registered");
			},
			onRegisterError(error) {
				log("PWA: service worker register error: " + (error?.message ?? String(error)));
			}
		}).catch((err) => {
			log("PWA: service worker disabled: " + safeToString(err));
		});
	};
	if (typeof globalThis.requestIdleCallback === "function") globalThis.requestIdleCallback(deferServiceWorker, { timeout: 6e3 });
	else globalThis.setTimeout(deferServiceWorker, 2500);
	globalThis?.addEventListener?.("popstate", () => {
		forceHideNavigatorVirtualKeyboard();
	});
	globalThis?.addEventListener?.("hashchange", () => {
		forceHideNavigatorVirtualKeyboard();
	});
	if (globalThis?.screen?.orientation && typeof globalThis?.screen?.orientation?.lock === "function") globalThis?.screen?.orientation?.lock("natural").then(() => {
		console.log("Locked to portrait successfully.");
	}).catch((err) => {
		console.warn("Orientation lock failed:", err);
	});
}
//#endregion
export { connectAirPadSession as a, waitForDomPaint as i, unmountAirpadRuntime as n, disconnectAirPadSession as o, setRemoteKeyboardEnabled as r, main_exports as t };
