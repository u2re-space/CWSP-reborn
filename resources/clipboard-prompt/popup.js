/*
 * Filename: popup.js
 * FullPath: apps/CWSP-reborn/resources/clipboard-prompt/popup.js
 * Change date and time: 18.55.00_14.07.2026
 * Reason for changes: Prefer CWSP_CONTROL_* env from independent spawn host;
 *   fallback to shared package .tmp auth file (same --path as main app).
 */
(function () {
  "use strict";

  /** Loopback defaults shared with extNode / backend (CWSP_CONTROL_*). */
  var DEFAULT_PORT = 19875;
  var DEFAULT_KEY = "cwsp-neutralino-local";
  var POLL_MS = 800;
  var POSITION_MARGIN = 12;

  var els = {
    prompt: document.getElementById("prompt"),
    kind: document.getElementById("promptKind"),
    mode: document.getElementById("promptMode"),
    countdown: document.getElementById("promptCountdown"),
    body: document.getElementById("promptBody"),
    textWrap: document.getElementById("promptText"),
    spoiler: document.getElementById("promptSpoiler"),
    preview: document.getElementById("promptPreview"),
    imageWrap: document.getElementById("promptImage"),
    thumb: document.getElementById("promptThumb"),
    btnAccept: document.getElementById("btnAccept"),
    btnShare: document.getElementById("btnShare"),
    btnUndo: document.getElementById("btnUndo"),
    btnErase: document.getElementById("btnErase"),
    btnDismiss: document.getElementById("btnDismiss"),
    errorBox: document.getElementById("promptError")
  };

  var auth = { port: DEFAULT_PORT, key: DEFAULT_KEY };
  var countdownTimer = null;
  var countdownStart = 0;
  var countdownTotal = 10000;
  var countdownPaused = false;
  var lastStateFingerprint = "";
  var positioned = false;

  function logErr(msg, err) {
    try { console.error("[clipboard-prompt]", msg, err); } catch (_) {}
    if (els.errorBox) {
      els.errorBox.hidden = false;
      els.errorBox.textContent = String(msg) + (err ? (": " + (err && err.message || err)) : "");
    }
  }

  function readAuthFromEnv() {
    return new Promise(function (resolve) {
      try {
        var getEnv = globalThis.Neutralino && Neutralino.os && Neutralino.os.getEnv;
        if (!getEnv) return resolve(null);
        Promise.all([getEnv("CWSP_CONTROL_PORT"), getEnv("CWSP_CONTROL_KEY")])
          .then(function (pair) {
            var port = Number(pair[0]);
            var key = String(pair[1] || "").trim();
            if (port > 0 && key) resolve({ port: port, key: key });
            else resolve(null);
          })
          .catch(function () { resolve(null); });
      } catch (_) { resolve(null); }
    });
  }

  function readAuthFile() {
    return new Promise(function (resolve) {
      try {
        var g = globalThis || window;
        var NL_PATH = g.NL_PATH || "";
        var readFile = g.Neutralino && g.Neutralino.filesystem && g.Neutralino.filesystem.readFile;
        if (!NL_PATH || !readFile) return resolve(null);
        // WHY: independent popup is spawned with --path=<main packageRoot>, so it shares .tmp/.
        readFile(NL_PATH + "/.tmp/cwsp-control-auth.json")
          .then(function (raw) {
            try {
              var parsed = JSON.parse(raw);
              if (typeof parsed.port === "number" && typeof parsed.key === "string") {
                resolve({ port: parsed.port, key: parsed.key });
              } else resolve(null);
            } catch (_) { resolve(null); }
          })
          .catch(function () { resolve(null); });
      } catch (_) { resolve(null); }
    });
  }

  function resolveAuth() {
    return readAuthFromEnv().then(function (fromEnv) {
      if (fromEnv) return fromEnv;
      return readAuthFile();
    });
  }

  function fetchPromptState() {
    return fetch("http://127.0.0.1:" + auth.port + "/service/clipboard-prompt", {
      method: "GET",
      headers: { "X-API-Key": auth.key },
      cache: "no-store"
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    });
  }

  function postAction(action) {
    return fetch("http://127.0.0.1:" + auth.port + "/service/clipboard-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": auth.key },
      body: JSON.stringify({ action: action }),
      cache: "no-store"
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    });
  }

  function positionBottomRight() {
    return new Promise(function (resolve) {
      try {
        var sw = window.screen.availWidth || screen.availWidth || 1280;
        var sh = window.screen.availHeight || screen.availHeight || 720;
        var sizePromise = (globalThis.Neutralino && Neutralino.window && Neutralino.window.getSize)
          ? Neutralino.window.getSize() : Promise.resolve({ width: 360, height: 200 });
        sizePromise.then(function (size) {
          var w = (size && size.width) || 360;
          var h = (size && size.height) || 200;
          var x = Math.max(POSITION_MARGIN, sw - w - POSITION_MARGIN);
          var y = Math.max(POSITION_MARGIN, sh - h - POSITION_MARGIN);
          var moveP = Neutralino && Neutralino.window && Neutralino.window.move
            ? Neutralino.window.move(x, y) : Promise.resolve();
          moveP.then(function () { positioned = true; resolve(); }, function () { resolve(); });
        }, function () { resolve(); });
      } catch (_) { resolve(); }
    });
  }

  function showWindow() {
    try {
      if (globalThis.Neutralino && Neutralino.window && Neutralino.window.show) {
        Neutralino.window.show().catch(function (e) { logErr("window.show", e); });
      }
    } catch (e) { logErr("showWindow", e); }
  }

  function hideWindow() {
    try {
      if (globalThis.Neutralino && Neutralino.window && Neutralino.window.hide) {
        Neutralino.window.hide().catch(function () {});
      }
    } catch (_) {}
  }

  function clearCountdown() {
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
  }

  function startCountdown(totalMs, onExpire) {
    clearCountdown();
    countdownTotal = totalMs || 10000;
    countdownStart = Date.now();
    countdownPaused = false;
    if (els.prompt) els.prompt.dataset.paused = "false";
    countdownTimer = setInterval(function () {
      if (countdownPaused) return;
      var elapsed = Date.now() - countdownStart;
      var remaining = Math.max(0, countdownTotal - elapsed);
      var pct = Math.max(0, Math.min(100, (remaining / countdownTotal) * 100));
      if (els.prompt) els.prompt.style.setProperty("--countdown-pct", pct.toFixed(1) + "%");
      if (els.countdown) els.countdown.textContent = (remaining / 1000).toFixed(1) + "s";
      if (remaining <= 0) {
        clearCountdown();
        try { onExpire(); } catch (_) {}
      }
    }, 120);
  }

  function pauseCountdown() {
    if (countdownPaused) return;
    countdownPaused = true;
    if (els.prompt) els.prompt.dataset.paused = "true";
  }

  function resumeCountdown() {
    if (!countdownPaused) return;
    // WHY: re-base the start so the remaining time continues from where it paused.
    var elapsed = Date.now() - countdownStart;
    countdownStart = Date.now() - (countdownTotal - (countdownTotal - elapsed));
    countdownPaused = false;
    if (els.prompt) els.prompt.dataset.paused = "false";
  }

  function resetCountdown() {
    // WHY: user interaction resets the auto-dismiss window so they can read/choose.
    if (countdownTimer) startCountdown(countdownTotal, handleExpire);
  }

  function handleExpire() {
    // WHY: timeout ≡ dismiss per spec — outbound ask stays un-shared, inbound ask stays un-applied.
    postAction("dismiss")
      .catch(function () {})
      .finally(function () { hideWindow(); renderEmpty(); });
  }

  function fingerprint(state) {
    return [
      state.kind, state.mode, state.hasImage ? "1" : "0",
      state.textLength || 0, state.showErase ? "1" : "0", state.showUndo ? "1" : "0",
      state.dismissMs || 0, state.imageThumbDataUrl ? state.imageThumbDataUrl.length : 0
    ].join("|");
  }

  function renderEmpty() {
    document.body.dataset.state = "empty";
    if (els.prompt) els.prompt.hidden = true;
    if (els.errorBox) els.errorBox.hidden = true;
    clearCountdown();
    lastStateFingerprint = "";
  }

  function renderState(state) {
    if (!state || state.kind == null) { renderEmpty(); return; }
    document.body.dataset.state = state.kind + "-" + state.mode;
    if (els.prompt) els.prompt.hidden = false;
    if (els.errorBox) els.errorBox.hidden = true;
    if (els.kind) els.kind.textContent = state.kind;
    if (els.mode) els.mode.textContent = state.mode;

    // Text preview (spoiler until user clicks).
    var hasText = state.textLength > 0 || (!state.hasImage && Boolean(state.textPreview));
    if (els.textWrap) els.textWrap.hidden = !hasText;
    if (hasText) {
      if (els.preview) els.preview.textContent = state.textPreview || "";
      if (els.spoiler) els.spoiler.setAttribute("aria-expanded", "false");
    }

    // Image thumbnail.
    if (els.imageWrap) els.imageWrap.hidden = !state.hasImage;
    if (state.hasImage && els.thumb && state.imageThumbDataUrl) {
      els.thumb.src = state.imageThumbDataUrl;
    } else if (els.thumb) {
      els.thumb.removeAttribute("src");
    }

    // Buttons per kind/mode.
    if (els.btnAccept) els.btnAccept.hidden = !(state.kind === "inbound" && state.mode === "ask");
    if (els.btnShare)  els.btnShare.hidden  = !(state.kind === "outbound" && state.mode === "ask");
    if (els.btnUndo)   els.btnUndo.hidden   = !(state.kind === "inbound" && state.showUndo);
    if (els.btnErase)  els.btnErase.hidden  = !(state.kind === "outbound" && state.showErase);
    if (els.btnDismiss) els.btnDismiss.hidden = false;

    var fp = fingerprint(state);
    if (fp !== lastStateFingerprint) {
      lastStateFingerprint = fp;
      startCountdown(state.dismissMs || 10000, handleExpire);
    }
  }

  function sendAndHide(action) {
    pauseCountdown();
    postAction(action)
      .then(function () { hideWindow(); })
      .catch(function (e) { logErr("action " + action, e); resumeCountdown(); });
  }

  function wireButtons() {
    if (els.btnAccept) els.btnAccept.addEventListener("click", function () { sendAndHide("accept"); });
    if (els.btnShare)  els.btnShare.addEventListener("click",  function () { sendAndHide("share"); });
    if (els.btnUndo)   els.btnUndo.addEventListener("click",   function () { sendAndHide("undo"); });
    if (els.btnErase)  els.btnErase.addEventListener("click",  function () { sendAndHide("erase"); });
    if (els.btnDismiss) els.btnDismiss.addEventListener("click", function () { sendAndHide("dismiss"); });

    if (els.spoiler) {
      els.spoiler.addEventListener("click", function () {
        var expanded = els.spoiler.getAttribute("aria-expanded") === "true";
        els.spoiler.setAttribute("aria-expanded", expanded ? "false" : "true");
        resetCountdown();
      });
    }

    // WHY: hover/pointer interaction pauses the countdown so the user can read.
    var root = document.body;
    root.addEventListener("pointerenter", pauseCountdown);
    root.addEventListener("pointerleave", resumeCountdown);
    root.addEventListener("pointerdown", resetCountdown);
  }

  function poll() {
    fetchPromptState()
      .then(function (data) {
        var state = (data && data.state) || (data && data.kind ? data : null);
        if (!state || state.kind == null) {
          renderEmpty();
          hideWindow();
          return;
        }
        if (!positioned) {
          positionBottomRight().then(function () {
            showWindow();
            renderState(state);
          });
        } else {
          showWindow();
          renderState(state);
        }
      })
      .catch(function (e) {
        // WHY: control host not ready yet → stay hidden, keep polling.
        renderEmpty();
        if (els.errorBox && e && e.message && /Failed to fetch|NetworkError|HTTP 5/.test(e.message)) {
          els.errorBox.hidden = true;
        } else {
          logErr("poll", e);
        }
      });
  }

  function init() {
    wireButtons();
    try {
      if (globalThis.Neutralino && Neutralino.init) Neutralino.init();
    } catch (_) {}
    // WHY: env auth is injected by Node clipboard-prompt-host spawn; file is fallback.
    resolveAuth().then(function (resolved) {
      if (resolved) auth = resolved;
      poll();
      setInterval(poll, POLL_MS);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
