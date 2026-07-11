// main.js — CWSP Neutralino Node extension
//
// Bridges Neutralino WebView ↔ Node protocol execution (clipboard / input / settings).
// Based on marketmix neutralino-ext-node; CWSP handlers live in ./cwsp-bridge.js.
//
// Events from frontend (Neutralino.extensions.dispatch):
//   runNode { function, parameter }
//     ping | cwsp.dispatch | clipboard.read | clipboard.write | settings.get | settings.patch
//     mouse.move | mouse.click | mouse.scroll | keyboard.type | keyboard.tap

const NeutralinoExtension = require("./neutralino-extension");
const bridge = require("./cwsp-bridge");

const DEBUG = process.env.CWSP_NL_DEBUG === "1" || process.env.CWSP_NL_DEBUG === "true";

const ext = new NeutralinoExtension(DEBUG);

async function handle(fn, parameter) {
    switch (fn) {
        case "ping":
            return `Node PONG (${process.version}) ← ${JSON.stringify(parameter ?? null)}`;
        case "cwsp.dispatch":
            return bridge.dispatch(parameter);
        case "clipboard.read":
            return bridge.clipboardRead(parameter);
        case "clipboard.write":
            return bridge.clipboardWrite(parameter);
        case "settings.get":
            return bridge.settingsGet();
        case "settings.patch":
            return bridge.settingsPatch(parameter);
        case "mouse.move":
            return bridge.mouseMove(parameter);
        case "mouse.click":
            return bridge.mouseClick(parameter);
        case "mouse.scroll":
            return bridge.mouseScroll(parameter);
        case "keyboard.type":
            return bridge.keyboardType(parameter);
        case "keyboard.tap":
            return bridge.keyboardTap(parameter);
        default:
            return { ok: false, error: { code: "UNKNOWN_FN", message: String(fn) } };
    }
}

function processAppEvent(d) {
    if (!ext.isEvent(d, "runNode")) return;
    const fn = d?.data?.function;
    const parameter = d?.data?.parameter;
    Promise.resolve()
        .then(() => handle(fn, parameter))
        .then((result) => {
            ext.sendMessage("runNodeResult", { function: fn, result });
        })
        .catch((error) => {
            ext.sendMessage("runNodeResult", {
                function: fn,
                result: {
                    ok: false,
                    error: { code: "BRIDGE_ERROR", message: error?.message || String(error) }
                }
            });
        });
}

console.log("---");
console.log("CWSP Neutralino Node extension");
console.log("NodeJS Version:", process.version);
console.log("NodeJS Path:", process.execPath);
console.log("---");

bridge
    .boot({
        onEmit: (packet) => {
            try {
                ext.sendMessage("cwsp.packet", packet);
            } catch (_) {
                /* ignore */
            }
        }
    })
    .then((info) => {
        if (info) {
            ext.sendMessage("cwsp.ready", info);
            console.log("[cwsp-bridge] ready", JSON.stringify(info));
        }
        ext.run(processAppEvent);
    })
    .catch((error) => {
        console.error("[cwsp-bridge] boot failed", error);
        ext.run(processAppEvent);
    });
