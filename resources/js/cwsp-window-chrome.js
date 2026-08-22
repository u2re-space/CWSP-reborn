/*
 * Filename: cwsp-window-chrome.js
 * FullPath: apps/CWSP-reborn/resources/js/cwsp-window-chrome.js
 * Change date and time: 15.45.00_22.08.2026
 * Reason for changes: Wait for JWT NL_TOKEN before Neutralino.init; skip setTray
 *   when connectToken is missing (avoids 400 + 4s timeout storms).
 *
 * WHY: Neutralino main window chrome (Close/Min/Max) + Shell tray.
 * INVARIANT: modes.window.exitProcessOnClose=false — Close is windowClose→hide.
 * INVARIANT: tray is installed after Neutralino.init and kept for the process life.
 */
(function () {
  "use strict";

  // WHY: Settings overlay needs __WEBNATIVE_AUTH__ before first loadSettings.
  // Loopback defaults match extNode/backend (CWSP_CONTROL_PORT/KEY).
  // INVARIANT: never use NL_PORT as control-RPC port (CWSP fleet uses 8434).
  // WHY: Cursor.exe steals :19875/:19876 — control lives on 29110.
  var defaultAuth = { port: 29110, key: "cwsp-neutralino-local" };
  try {
    window.__WEBNATIVE_AUTH__ = defaultAuth;
    window.__NEUTRALINO_AUTH__ = defaultAuth;
    window.__CWS_WEBNATIVE_BOOT__ = true;
    window.__CWS_NEUTRALINO_BOOT__ = true;
    window.__CWS_NODE_CLIPBOARD_HUB__ = true;
  } catch (_) {}

  function readNlToken() {
    try {
      if (typeof window.NL_TOKEN === "string" && window.NL_TOKEN) return window.NL_TOKEN;
      var stored = sessionStorage.getItem("NL_TOKEN");
      if (stored) {
        window.NL_TOKEN = stored;
        return stored;
      }
    } catch (_) {}
    return "";
  }

  // WHY: Neutralino 6 client uses `NL_TOKEN.split(".")[1]` as the WS connectToken.
  function hasConnectToken() {
    var mid = readNlToken().split(".")[1];
    return typeof mid === "string" && mid.length > 0;
  }

  function waitForConnectToken(ms) {
    return new Promise(function (resolve) {
      if (hasConnectToken()) return resolve(true);
      var started = Date.now();
      var timer = setInterval(function () {
        if (hasConnectToken() || Date.now() - started >= ms) {
          clearInterval(timer);
          resolve(hasConnectToken());
        }
      }, 40);
    });
  }

  function applyAuth(auth) {
    if (!auth || typeof auth.port !== "number") return;
    if (auth.port === 8434 || auth.port < 1024) return;
    window.__WEBNATIVE_AUTH__ = { port: auth.port, key: auth.key || defaultAuth.key };
    window.__NEUTRALINO_AUTH__ = window.__WEBNATIVE_AUTH__;
  }

  async function refreshAuthFromDisk() {
    try {
      if (!window.Neutralino || !Neutralino.filesystem || !window.NL_PATH) return;
      var raw = await Neutralino.filesystem.readFile(NL_PATH + "/.tmp/cwsp-control-auth.json");
      applyAuth(JSON.parse(raw));
    } catch (_) {}
  }

  function markSmoke(msg) {
    try {
      var el = document.getElementById("cwsp-boot-fallback");
      if (el) {
        var line = el.querySelector("[data-cwsp-smoke]");
        if (!line) {
          line = document.createElement("div");
          line.setAttribute("data-cwsp-smoke", "1");
          line.style.cssText = "opacity:.85;margin-top:8px;font-size:12px";
          el.appendChild(line);
        }
        line.textContent = msg;
      }
      console.log("[cwsp-neutralino]", msg);
    } catch (_) {}
  }

  /** Cap native bridge calls so a stuck setTray/hide cannot freeze titlebar chrome. */
  function withTimeout(promise, ms, label) {
    return new Promise(function (resolve, reject) {
      var settled = false;
      var timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        reject(new Error((label || "op") + " timeout " + ms + "ms"));
      }, ms);
      Promise.resolve(promise).then(
        function (value) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve(value);
        },
        function (err) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          reject(err);
        }
      );
    });
  }

  function trayIconCandidates() {
    // WHY (Windows): setTray loads via resources::getFile(iconPath) + GDI+.
    // Absolute NL_PATH/… paths miss slim packages → blank tray slot.
    var list = [
      "/resources/icons/trayIcon.png",
      "/resources/icons/appIcon.png",
      "/resources/icons/appIcon.ico"
    ];
    if (window.CWSP_ICON) list.push(window.CWSP_ICON);
    try {
      if (typeof NL_PATH === "string" && NL_PATH) {
        var base = NL_PATH.replace(/\\/g, "/");
        list.push(base + "/resources/icons/trayIcon.png");
        list.push(base + "/resources/icons/appIcon.png");
        list.push(base + "/resources/icons/appIcon.ico");
      }
    } catch (_) {}
    var uniq = [];
    list.forEach(function (p) {
      if (p && uniq.indexOf(p) < 0) uniq.push(p);
    });
    return uniq;
  }

  /**
   * Restore main window from tray / iconic minimize.
   * WHY: Windows iconic-minimize parks HWND at ~(-18000,-18000);
   * show()+focus() alone leaves it invisible until unminimize.
   */
  function ensureMainWindowVisible(opts) {
    var wantFocus = !opts || opts.focus !== false;
    var fromTray = !!(opts && opts.fromTray);
    // WHY: close-to-tray sets hidden; do not unminimize/show until tray SHOW.
    if (window.__CWS_MAIN_HIDDEN__ && !fromTray) {
      return Promise.resolve();
    }
    return Promise.resolve()
      .then(function () {
        if (!Neutralino.window || typeof Neutralino.window.isMinimized !== "function") {
          if (Neutralino.window && typeof Neutralino.window.unminimize === "function") {
            return Neutralino.window.unminimize();
          }
          return;
        }
        return Neutralino.window.isMinimized().then(function (minimized) {
          if (minimized && typeof Neutralino.window.unminimize === "function") {
            return Neutralino.window.unminimize();
          }
        });
      })
      .catch(function () {})
      .then(function () {
        return Neutralino.window.show();
      })
      .then(function () {
        if (!Neutralino.window.getPosition || !Neutralino.window.getSize) return;
        var maximizedProbe =
          typeof Neutralino.window.isMaximized === "function"
            ? Neutralino.window.isMaximized()
            : Promise.resolve(false);
        return Promise.all([
          Neutralino.window.getPosition(),
          Neutralino.window.getSize(),
          maximizedProbe
        ]).then(function (triple) {
          var pos = triple[0] || {};
          var size = triple[1] || {};
          var maximized = !!triple[2];
          // WHY: never fight an intentional maximize with setSize(960×640).
          if (maximized) return;
          var x = Number(pos.x);
          var y = Number(pos.y);
          var w = Number(size.width);
          var h = Number(size.height);
          var off =
            !Number.isFinite(x) ||
            !Number.isFinite(y) ||
            x < -8000 ||
            y < -8000 ||
            x > 50000 ||
            y > 50000 ||
            !Number.isFinite(w) ||
            w < 200 ||
            !Number.isFinite(h) ||
            h < 200;
          if (!off) return;
          markSmoke("window geometry rescue x=" + x + " y=" + y + " w=" + w + " h=" + h);
          return Promise.resolve()
            .then(function () {
              if (typeof Neutralino.window.setSize === "function") {
                return Neutralino.window.setSize({ width: 960, height: 640 });
              }
            })
            .then(function () {
              if (typeof Neutralino.window.center === "function") {
                return Neutralino.window.center();
              }
            });
        });
      })
      .then(function () {
        if (wantFocus && Neutralino.window && typeof Neutralino.window.focus === "function") {
          return Neutralino.window.focus();
        }
      });
  }

  function bindWindowChromeOnce() {
    if (window.__CWS_WINDOW_CHROME_BOUND__) return;
    if (!window.Neutralino || !Neutralino.events || typeof Neutralino.events.on !== "function") {
      return;
    }
    window.__CWS_WINDOW_CHROME_BOUND__ = true;

    Neutralino.events.on("windowClose", function () {
      // Hide-to-tray (backend/extNode keep running).
      // WHY: hide FIRST — awaiting setTray before hide hung Close and froze Min/Max.
      window.__CWS_MAIN_HIDDEN__ = true;
      Promise.resolve()
        .then(function () {
          return withTimeout(Neutralino.window.hide(), 2000, "window.hide");
        })
        .catch(function (error) {
          console.error("[cwsp-neutralino] window.hide failed", error);
          try {
            Neutralino.app.exit();
          } catch (_) {}
        })
        .then(function () {
          return installTray(true);
        })
        .catch(function () {});
    });

    Neutralino.events.on("trayMenuItemClicked", function (ev) {
      var id = ev && ev.detail && ev.detail.id;
      if (id === "SHOW") {
        window.__CWS_MAIN_HIDDEN__ = false;
        Promise.resolve()
          .then(function () {
            if (Neutralino.extensions && typeof Neutralino.extensions.dispatch === "function") {
              return Neutralino.extensions.dispatch("extNode", "runNode", {
                function: "backend.ensure",
                parameter: null
              });
            }
          })
          .catch(function () {})
          .then(function () {
            return ensureMainWindowVisible({ focus: true, fromTray: true });
          })
          .catch(function (error) {
            console.error("[cwsp-neutralino] window.show failed", error);
          });
      } else if (id === "SILENT") {
        // WHY: toggle Silent Mode — Node suppresses toast; History still records.
        Promise.resolve()
          .then(function () {
            return fetchSilentModeToggle();
          })
          .then(function (enabled) {
            window.__CWS_SILENT_MODE__ = !!enabled;
            markSmoke("Silent Mode " + (enabled ? "ON" : "OFF"));
            return installTray(true);
          })
          .catch(function (error) {
            console.error("[cwsp-neutralino] Silent Mode toggle failed", error);
          });
      } else if (id === "QUIT") {
        Promise.resolve()
          .then(function () {
            if (Neutralino.extensions && typeof Neutralino.extensions.dispatch === "function") {
              return Neutralino.extensions.dispatch("extNode", "runNode", {
                function: "backend.stop",
                parameter: null
              });
            }
          })
          .catch(function () {})
          .then(function () {
            return new Promise(function (resolve) {
              setTimeout(resolve, 450);
            });
          })
          .then(function () {
            return Neutralino.app.exit();
          })
          .catch(function (error) {
            console.error("[cwsp-neutralino] quit failed", error);
            try {
              Neutralino.app.exit();
            } catch (_) {}
          });
      }
    });

    Neutralino.events.on("serverOffline", function () {
      markSmoke("serverOffline — reloading UI to restore window chrome/tray");
      window.__CWS_TRAY_READY__ = false;
      if (window.__CWS_SERVER_OFFLINE_RELOAD__) return;
      window.__CWS_SERVER_OFFLINE_RELOAD__ = true;
      setTimeout(function () {
        try {
          location.reload();
        } catch (_) {}
      }, 400);
    });

    Neutralino.events.on("clientConnect", function () {
      markSmoke("clientConnect — reinstall tray");
      installTray(true);
    });

    Neutralino.events.on("clientDisconnect", function () {
      window.__CWS_TRAY_READY__ = false;
      markSmoke("clientDisconnect");
    });
  }

  var trayInFlight = null;
  var lastTrayAttemptMs = 0;

  function controlAuth() {
    var a = window.__NEUTRALINO_AUTH__ || window.__WEBNATIVE_AUTH__ || defaultAuth;
    return {
      port: (a && typeof a.port === "number" ? a.port : defaultAuth.port) || defaultAuth.port,
      key: (a && a.key) || defaultAuth.key
    };
  }

  function fetchSilentModeEnabled() {
    var auth = controlAuth();
    return fetch("http://127.0.0.1:" + auth.port + "/service/silent-mode", {
      method: "GET",
      headers: { "x-api-key": auth.key },
      signal:
        typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
          ? AbortSignal.timeout(2500)
          : undefined
    })
      .then(function (res) {
        if (!res.ok) throw new Error("silent-mode GET " + res.status);
        return res.json();
      })
      .then(function (data) {
        var enabled = !!(data && data.enabled);
        window.__CWS_SILENT_MODE__ = enabled;
        return enabled;
      })
      .catch(function () {
        return !!window.__CWS_SILENT_MODE__;
      });
  }

  function fetchSilentModeToggle() {
    var auth = controlAuth();
    return fetch("http://127.0.0.1:" + auth.port + "/service/silent-mode", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": auth.key
      },
      body: JSON.stringify({ toggle: true }),
      signal:
        typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
          ? AbortSignal.timeout(2500)
          : undefined
    })
      .then(function (res) {
        if (!res.ok) throw new Error("silent-mode POST " + res.status);
        return res.json();
      })
      .then(function (data) {
        var enabled = !!(data && data.enabled);
        window.__CWS_SILENT_MODE__ = enabled;
        return enabled;
      });
  }

  function installTray(force) {
    if (!force && window.__CWS_TRAY_READY__) return Promise.resolve(true);
    if (!hasConnectToken()) {
      markSmoke("tray skipped: NL_TOKEN/connectToken missing");
      return Promise.resolve(false);
    }
    if (!window.Neutralino || !Neutralino.os || typeof Neutralino.os.setTray !== "function") {
      markSmoke("tray: Neutralino.os.setTray unavailable");
      return Promise.resolve(false);
    }
    // WHY: focus/visibility used to hammer setTray every event → Shell_NotifyIcon
    // churn and UI freezes that made Min/Max/Close look dead.
    var now = Date.now();
    if (!force && now - lastTrayAttemptMs < 4000) {
      return Promise.resolve(!!window.__CWS_TRAY_READY__);
    }
    if (trayInFlight) return trayInFlight;

    bindWindowChromeOnce();
    lastTrayAttemptMs = now;
    var uniq = trayIconCandidates();

    function trySet(i, silentOn) {
      if (i >= uniq.length) {
        window.__CWS_TRAY_READY__ = false;
        markSmoke("tray failed: all icon paths");
        return Promise.resolve(false);
      }
      return withTimeout(
        Neutralino.os.setTray({
          icon: uniq[i],
          menuItems: [
            { id: "SHOW", text: "Show CWSP", isDisabled: false, isChecked: false },
            {
              id: "SILENT",
              text: "Silent Mode",
              isDisabled: false,
              isChecked: !!silentOn
            },
            { id: "SEP", text: "-", isDisabled: false, isChecked: false },
            { id: "QUIT", text: "Quit CWSP", isDisabled: false, isChecked: false }
          ]
        }),
        4000,
        "setTray"
      )
        .then(function () {
          window.__CWS_TRAY_READY__ = true;
          markSmoke(
            "tray ready (" + uniq[i] + ")" + (silentOn ? " · Silent ON" : "")
          );
          return true;
        })
        .catch(function (error) {
          console.error("[cwsp-neutralino] setTray failed", uniq[i], error);
          return trySet(i + 1, silentOn);
        });
    }

    trayInFlight = fetchSilentModeEnabled()
      .then(function (silentOn) {
        return trySet(0, silentOn);
      })
      .then(
        function (ok) {
          trayInFlight = null;
          return ok;
        },
        function (err) {
          trayInFlight = null;
          throw err;
        }
      );
    return trayInFlight;
  }

  function scheduleAlwaysOnTrayRetries() {
    // WHY: first setTray can race window/GDI readiness — retry without waiting for Close.
    [200, 800, 2000, 5000, 12000].forEach(function (ms) {
      setTimeout(function () {
        if (!window.__CWS_TRAY_READY__) {
          installTray(true);
        }
      }, ms);
    });
  }

  function healWindowChrome(reason) {
    if (!window.Neutralino || !Neutralino.window) return;
    // WHY: while hidden-to-tray, skip probes that call show/unminimize.
    if (window.__CWS_MAIN_HIDDEN__) {
      if (!window.__CWS_TRAY_READY__) installTray(true);
      return;
    }
    var probe =
      typeof Neutralino.window.isVisible === "function"
        ? Neutralino.window.isVisible()
        : typeof Neutralino.window.getTitle === "function"
          ? Neutralino.window.getTitle()
          : Promise.resolve(true);
    Promise.resolve(probe)
      .then(function () {
        // Only reinstall when tray is missing — do not thrash on every focus.
        if (!window.__CWS_TRAY_READY__) return installTray(true);
      })
      .catch(function (error) {
        markSmoke("chrome heal fail (" + reason + "): " + String((error && error.message) || error));
        if (!window.__CWS_SERVER_OFFLINE_RELOAD__) {
          window.__CWS_SERVER_OFFLINE_RELOAD__ = true;
          setTimeout(function () {
            try {
              location.reload();
            } catch (_) {}
          }, 300);
        }
      });
  }

  function installChromeLongevity() {
    if (window.__CWS_CHROME_LONGEVITY__) return;
    window.__CWS_CHROME_LONGEVITY__ = true;
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") healWindowChrome("visible");
    });
    window.addEventListener("pageshow", function () {
      healWindowChrome("pageshow");
    });
    // WHY: do NOT re-setTray on every window focus — that froze Min/Max/Close.
    // WHY: explorer.exe restart drops tray (#1492); infrequent re-setTray is enough.
    setInterval(function () {
      installTray(true);
    }, 5 * 60 * 1000);
  }

  function bootWindowChrome() {
    markSmoke(
      "DOM ready; Neutralino=" +
        !!window.Neutralino +
        " NL_PORT=" +
        (typeof NL_PORT !== "undefined" ? NL_PORT : "?")
    );
    try {
      if (!window.Neutralino || typeof Neutralino.init !== "function") {
        markSmoke("neutralino.js missing or Neutralino.init unavailable");
        return;
      }
      // WHY: injectGlobals / sessionStorage may land after the first DOM script.
      // Neutralino 6 WS is `?connectToken=<JWT payload>` — empty token → HTTP 400.
      waitForConnectToken(2000)
        .then(function (ok) {
          if (!ok) {
            markSmoke("NL_TOKEN missing; native WS skipped");
            return;
          }
          // COMPAT: some Neutralino client builds return void, not a Promise.
          return Promise.resolve(Neutralino.init())
            .then(function () {
              markSmoke("Neutralino.init ok");
              // WHY: bind Close handler before tray so chrome works even if setTray fails.
              bindWindowChromeOnce();
              installChromeLongevity();
              // Always-on tray from boot — not deferred until windowClose.
              return installTray(true);
            })
            .then(function () {
              scheduleAlwaysOnTrayRetries();
              if (window.__CWS_MAIN_HIDDEN__) return;
              return ensureMainWindowVisible({ focus: false }).catch(function () {});
            })
            .then(function () {
              return refreshAuthFromDisk();
            });
        })
        .catch(function (error) {
          console.error("[cwsp-neutralino] Neutralino.init failed", error);
          markSmoke("Neutralino.init failed: " + String((error && error.message) || error));
        });
    } catch (error) {
      console.error("[cwsp-neutralino] Neutralino.init threw", error);
      markSmoke("Neutralino.init threw: " + String((error && error.message) || error));
    }
  }

  // Expose for smoke tests / manual heal from DevTools.
  try {
    window.__CWS_INSTALL_TRAY__ = installTray;
    window.__CWS_ENSURE_MAIN_VISIBLE__ = ensureMainWindowVisible;
  } catch (_) {}

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootWindowChrome);
  } else {
    bootWindowChrome();
  }
})();
