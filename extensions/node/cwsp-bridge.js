// cwsp-bridge.js — CommonJS protocol bridge for Neutralino extNode
//
// WHY CJS: Neutralino embedded Node runs main.js without TS strip-types.
// Canonical TypeScript ProtocolServer lives under src/backend/node/windows;
// this file is the portable runtime mirror for the extension process.
//
// Optional: set CWSP_BRIDGE_TS=1 and CWSP_ROOT to prefer spawning the TS backend
// for settings persistence (future). Default path is self-contained.

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const http = require("node:http");

let onEmit = null;
let settingsPath = null;
let settingsCache = {};
let ahkPath =
    process.env.CWSP_AHK_PATH ||
    "C:\\Program Files\\AutoHotkey\\AutoHotkey.exe";

function uuid() {
    return crypto.randomUUID();
}

function asRecord(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function resolveSettingsPath() {
    if (process.env.CWSP_PORTABLE_CONFIG) return process.env.CWSP_PORTABLE_CONFIG;
    const root = process.env.CWSP_ROOT || process.cwd();
    return path.join(root, "portable.config.json");
}

function loadSettings() {
    try {
        if (fs.existsSync(settingsPath)) {
            settingsCache = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
        }
    } catch (_) {
        settingsCache = {};
    }
    return settingsCache;
}

function saveSettings(next) {
    settingsCache = next && typeof next === "object" ? next : {};
    try {
        fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
        fs.writeFileSync(settingsPath, JSON.stringify(settingsCache, null, 2), "utf8");
    } catch (error) {
        console.error("[cwsp-bridge] settings write failed", error.message);
    }
    return settingsCache;
}

function deepMerge(base, patch) {
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) return patch;
    const out = { ...(base && typeof base === "object" ? base : {}) };
    for (const [k, v] of Object.entries(patch)) {
        if (v && typeof v === "object" && !Array.isArray(v)) {
            out[k] = deepMerge(out[k], v);
        } else {
            out[k] = v;
        }
    }
    return out;
}

function runAhk(script) {
    if (process.platform !== "win32") return Promise.resolve(0);
    return new Promise((resolve, reject) => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cwsp-ahk-"));
        const file = path.join(dir, "run.ahk");
        fs.writeFileSync(file, script, "utf8");
        const child = spawn(ahkPath, [file], { windowsHide: true, stdio: "ignore" });
        const timer = setTimeout(() => {
            child.kill();
            reject(new Error("AHK timeout"));
        }, 5000);
        child.on("error", (err) => {
            clearTimeout(timer);
            try {
                fs.rmSync(dir, { recursive: true, force: true });
            } catch (_) {}
            reject(err);
        });
        child.on("close", (code) => {
            clearTimeout(timer);
            try {
                fs.rmSync(dir, { recursive: true, force: true });
            } catch (_) {}
            resolve(code ?? 1);
        });
    });
}

async function clipboardReadText() {
    try {
        const clipboardy = require("clipboardy");
        return await clipboardy.read();
    } catch (_) {
        return "";
    }
}

async function clipboardWriteText(text) {
    try {
        const clipboardy = require("clipboardy");
        await clipboardy.write(String(text ?? ""));
        return true;
    } catch (_) {
        // Fallback AHK
        const escaped = JSON.stringify(String(text ?? ""));
        await runAhk(`Clipboard := ${escaped}\nExitApp\n`);
        return true;
    }
}

function emit(what, purpose, payload) {
    const packet = {
        op: "act",
        what,
        purpose,
        protocol: "local",
        transport: "bridge",
        uuid: uuid(),
        timestamp: Date.now(),
        sender: process.env.CWSP_CLIENT_ID || "L-192.168.0.110",
        byId: process.env.CWSP_CLIENT_ID || "L-192.168.0.110",
        payload,
        data: payload,
        flags: { canonicalV2: true }
    };
    if (typeof onEmit === "function") onEmit(packet);
    return packet;
}

async function boot(options = {}) {
    onEmit = options.onEmit || null;
    settingsPath = resolveSettingsPath();
    loadSettings();
    return {
        settingsPath,
        platform: process.platform,
        clientId: process.env.CWSP_CLIENT_ID || "L-192.168.0.110",
        ahkPath
    };
}

/**
 * Prefer the TS control host (ClipboardService + ProtocolServer) when available.
 * Falls back to local clipboardy/AHK for bridge-only mode.
 */
function controlRequest(method, pathName, bodyObj) {
    const port = Number(process.env.CWSP_CONTROL_PORT || 0);
    const key = process.env.CWSP_CONTROL_KEY || "";
    if (!port || !key) return Promise.resolve(null);
    return new Promise((resolve) => {
        const body = bodyObj == null ? null : JSON.stringify(bodyObj);
        const headers = {
            "X-API-Key": key
        };
        if (body != null) {
            headers["Content-Type"] = "application/json";
            headers["Content-Length"] = Buffer.byteLength(body);
        }
        const req = http.request(
            {
                host: "127.0.0.1",
                port,
                path: pathName,
                method,
                headers
            },
            (res) => {
                let data = "";
                res.on("data", (c) => (data += c));
                res.on("end", () => {
                    if (res.statusCode && res.statusCode >= 400) {
                        resolve(null);
                        return;
                    }
                    try {
                        resolve(data ? JSON.parse(data) : { ok: true });
                    } catch (_) {
                        resolve(null);
                    }
                });
            }
        );
        req.on("error", () => resolve(null));
        if (body != null) req.write(body);
        req.end();
    });
}

async function clipboardRead(parameter) {
    const kind = asRecord(parameter).kind || "text";
    const via = await controlRequest(
        "GET",
        `/service/clipboard?kind=${encodeURIComponent(kind)}`
    );
    if (via) return via;
    if (kind === "image") {
        return { ok: false, error: { code: "IMAGE_VIA_TS", message: "control host unavailable" } };
    }
    const text = await clipboardReadText();
    return { ok: true, result: { kind: "text", data: text }, text, data: text };
}

async function clipboardWrite(parameter) {
    const body = asRecord(parameter);
    // Prefer TS ClipboardService (text + image/asset).
    const via = await controlRequest("POST", "/service/clipboard", body);
    if (via) return via;
    const text = body.data ?? body.text ?? body.content ?? "";
    await clipboardWriteText(text);
    emit("clipboard:update", "clipboard", {
        text: String(text),
        content: String(text),
        body: String(text)
    });
    return { ok: true };
}

async function settingsGet() {
    const via = await controlRequest("GET", "/service/config");
    if (via) {
        return {
            ok: true,
            settings: via.settings || via.portable || via,
            portable: via.portable || via.settings || via
        };
    }
    return { ok: true, settings: loadSettings(), portable: settingsCache };
}

async function settingsPatch(parameter) {
    const via = await controlRequest("POST", "/service/config", asRecord(parameter));
    if (via) {
        return {
            ok: true,
            settings: via.settings || via.portable || via,
            portable: via.portable || via.settings || via
        };
    }
    const merged = deepMerge(loadSettings(), asRecord(parameter));
    saveSettings(merged);
    return { ok: true, settings: settingsCache, portable: settingsCache };
}

async function mouseMove(parameter) {
    const body = asRecord(parameter);
    const data = asRecord(body.data);
    const x = Number(data.x ?? body.x ?? 0) | 0;
    const y = Number(data.y ?? body.y ?? 0) | 0;
    await runAhk(`CoordMode, Mouse, Screen\nMouseMove, ${x}, ${y}, 0, R\nExitApp\n`);
    emit("mouse:move", "airpad", { x, y });
    return { ok: true, x, y };
}

async function mouseClick(parameter) {
    const body = asRecord(parameter);
    const data = asRecord(body.data);
    const button = String(data.button ?? body.button ?? "left").toLowerCase();
    const map = { left: "L", right: "R", middle: "M" };
    const b = map[button] || "L";
    const dbl = data.double || body.double ? ", 2" : "";
    await runAhk(`Click, ${b}${dbl}\nExitApp\n`);
    return { ok: true, button };
}

async function mouseScroll(parameter) {
    const body = asRecord(parameter);
    const data = asRecord(body.data);
    const delta = Number(data.delta ?? data.y ?? body.delta ?? 0) | 0;
    const n = Math.abs(delta) || 1;
    const wheel = delta >= 0 ? "WheelUp" : "WheelDown";
    await runAhk(`Click, ${wheel}, ${n}\nExitApp\n`);
    return { ok: true, delta };
}

async function keyboardType(parameter) {
    const body = asRecord(parameter);
    const data = asRecord(body.data);
    const text = String(data.text ?? body.text ?? "");
    const escaped = JSON.stringify(text);
    await runAhk(`SendInput, % "{Raw}" ${escaped}\nExitApp\n`);
    emit("keyboard:type", "airpad", { text });
    return { ok: true, length: text.length };
}

async function keyboardTap(parameter) {
    const body = asRecord(parameter);
    const data = asRecord(body.data);
    const key = String(data.key ?? body.key ?? "Enter");
    const mods = []
        .concat(data.modifier || data.modifiers || body.modifier || [])
        .map((m) => String(m).toLowerCase())
        .map((m) =>
            m === "ctrl" || m === "control"
                ? "^"
                : m === "alt"
                  ? "!"
                  : m === "shift"
                    ? "+"
                    : m === "win" || m === "meta"
                      ? "#"
                      : ""
        )
        .join("");
    await runAhk(`SendInput, ${mods}{${key}}\nExitApp\n`);
    return { ok: true, key };
}

/**
 * Accept a CWSP v2-ish packet and route to local handlers.
 * Prefer ProtocolServer via control /service/dispatch when the TS backend is up.
 */
async function dispatch(raw) {
    const via = await controlRequest("POST", "/service/dispatch", raw);
    if (via) return via;

    const packet = asRecord(raw);
    const what = String(packet.what || packet.type || packet.action || "dispatch");
    const payload = asRecord(packet.payload || packet.data);

    if (what.startsWith("clipboard:") || what === "clipboard") {
        if (what.includes("read") || what.includes("get")) return clipboardRead(payload);
        return clipboardWrite({
            ...payload,
            text: payload.text || payload.content || payload.body
        });
    }
    if (what === "airpad:mouse" || what.startsWith("mouse:")) {
        const op = String(payload.op || what.split(":")[1] || "move").toLowerCase();
        if (op.includes("click")) return mouseClick(packet);
        if (op.includes("scroll")) return mouseScroll(packet);
        return mouseMove(packet);
    }
    if (what === "airpad:keyboard" || what.startsWith("keyboard:")) {
        const op = String(payload.op || what.split(":")[1] || "type").toLowerCase();
        if (op.includes("tap")) return keyboardTap(packet);
        return keyboardType(packet);
    }
    if (what.includes("settings")) {
        if (String(packet.op || "").includes("ask") || what.includes("get")) return settingsGet();
        return settingsPatch(payload);
    }
    return { ok: false, error: { code: "UNHANDLED", message: what } };
}

/**
 * Optional: POST settings into a running TS control host if CWSP_CONTROL_PORT/KEY set.
 */
function patchRemoteSettings(patch) {
    return controlRequest("POST", "/service/config", patch || {});
}

module.exports = {
    boot,
    dispatch,
    clipboardRead,
    clipboardWrite,
    settingsGet,
    settingsPatch,
    mouseMove,
    mouseClick,
    mouseScroll,
    keyboardType,
    keyboardTap,
    patchRemoteSettings
};
