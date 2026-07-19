/*
 * Filename: index.ts
 * FullPath: runtime/cwsp/endpoint/server-v2/protocol/http/gateway/index.ts
 * Change date and time: 14.26.00_17.07.2026
 * Reason for changes: Login User ID is a select of registered users (few entries);
 *   free-text userId input kept commented for a possible future path.
 */

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import cookie from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { listUsers, verifyUser } from "../../../auth/users.ts";
import { registerGatewayBff } from "./bff.ts";
import { verifyScryptHash } from "./crypto.ts";
import {
    classifyGatewayRequestSource,
    classifyGatewaySource,
    isGatewayAuthRequired,
    isTrustedGatewayProxy,
    resolveGatewayConfig,
    type GatewayConfig,
    type GatewaySourceClass
} from "./config.ts";
import { createGatewaySessionStore, type GatewaySession } from "./session.ts";

const escapeHtml = (value: string): string =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

export type GatewayRuntimeContext = {
    engine: {
        config: Record<string, unknown>;
        profile: unknown;
        storage: {
            readCoreSettings(): Promise<Record<string, unknown>>;
            writeCoreSettings(next: Record<string, unknown>): Promise<Record<string, unknown>>;
        };
    };
    selfId: string;
    sockets: {
        getStatus(): Record<string, unknown>;
        getConnectedPeerProfiles(): Array<Record<string, unknown>>;
        dispatchPacket(packet: Record<string, unknown>): boolean;
    };
};

export type GatewayHttpOptions = {
    runtimeContext: GatewayRuntimeContext;
    config?: GatewayConfig;
    webRoot: string;
    now?: () => number;
};

export type GatewayRequestState = {
    session: GatewaySession | null;
    sourceClass: GatewaySourceClass;
};

const SESSION_COOKIE = "cwsp_gateway_session";

const publicSession = (session: GatewaySession | null) => {
    if (!session) return { authenticated: false };
    return {
        authenticated: true,
        sourceClass: session.sourceClass,
        expiresAt: session.expiresAt
    };
};

const getRemoteAddress = (request: FastifyRequest): string => {
    const raw = String(request.raw.socket?.remoteAddress || request.ip || "").trim();
    return raw.replace(/^::ffff:/i, "");
};

const getClientAddress = (request: FastifyRequest, config: GatewayConfig): string => {
    const remote = getRemoteAddress(request);
    if (!isTrustedGatewayProxy(remote, config)) return remote;
    const forwarded = String(request.headers["x-forwarded-for"] || "").split(",")[0]?.trim();
    return forwarded || remote;
};

const isTrustedRequestProxy = (request: FastifyRequest, config: GatewayConfig): boolean => {
    return isTrustedGatewayProxy(getRemoteAddress(request), config);
};

const getCookieToken = (request: FastifyRequest): string => {
    const cookies = (request as FastifyRequest & { cookies?: Record<string, string> }).cookies || {};
    return String(cookies[SESSION_COOKIE] || "").trim();
};

const COOKIE_PATH = "/";
// `/` is handled separately (login vs shell). These are client-routed SPA views.
const SPA_VIEW_PATHS = ["/network", "/settings", "/minimal"] as const;

const clearSessionCookie = (reply: FastifyReply): void => {
    reply.clearCookie(SESSION_COOKIE, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: COOKIE_PATH
    });
};

const expectedOrigin = (request: FastifyRequest, config: GatewayConfig): string => {
    const trustedProxy = isTrustedRequestProxy(request, config);
    const forwardedProto =
        trustedProxy && String(request.headers["x-forwarded-proto"] || "").trim()
            ? String(request.headers["x-forwarded-proto"]).split(",")[0].trim()
            : "";
    const protocol = forwardedProto || request.protocol || "http";
    const forwardedHost =
        trustedProxy && String(request.headers["x-forwarded-host"] || "").trim()
            ? String(request.headers["x-forwarded-host"]).split(",")[0].trim()
            : "";
    const host = forwardedHost || String(request.headers.host || request.hostname || "").trim();
    return `${protocol}://${host}`;
};

const isSameOrigin = (request: FastifyRequest, config: GatewayConfig, origin: string): boolean => {
    try {
        const candidate = new URL(origin);
        const expected = new URL(expectedOrigin(request, config));
        return candidate.protocol === expected.protocol && candidate.host === expected.host;
    } catch {
        return false;
    }
};

type LoginPageOptions = {
    userIds: string[];
    /** When true, empty select value means shared-operator PIN login. */
    allowPinOnly: boolean;
};

const renderLoginPage = (options: LoginPageOptions): string => {
    const ids = [...new Set(options.userIds.map((id) => String(id || "").trim()).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b)
    );
    const userOptions = ids
        .map((id) => `<option value="${escapeHtml(id)}">${escapeHtml(id)}</option>`)
        .join("");
    const pinOnlyOption = options.allowPinOnly
        ? `<option value="">Shared operator PIN</option>`
        : ids.length
          ? `<option value="" disabled selected>Select User ID</option>`
          : `<option value="" disabled selected>No registered users</option>`;

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CWSP Gateway Login</title>
  <style>
    :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #12141a; color: #eef1f5; }
    main { width: min(22rem, calc(100vw - 2rem)); padding: 1.5rem; border: 1px solid #303542; border-radius: 1rem; background: #1d212a; box-sizing: border-box; }
    h1 { margin: 0 0 .5rem; font-size: 1.3rem; }
    p { color: #aeb6c4; font-size: .9rem; }
    label { display: grid; gap: .4rem; margin-top: 1rem; }
    input, select, button { width: 100%; box-sizing: border-box; border-radius: .5rem; padding: .7rem; font: inherit; }
    input, select { border: 1px solid #4b5362; background: #12141a; color: inherit; }
    button { margin-top: 1rem; border: 0; background: #3975ca; color: white; cursor: pointer; }
    [role="alert"] { min-height: 1.3rem; color: #ff9e9e; }
  </style>
</head>
<body>
  <main>
    <h1>CWSP Gateway</h1>
    <p>Sign in with a registered User ID + password${options.allowPinOnly ? ", or shared operator PIN" : ""}.</p>
    <form id="gateway-login">
      <label>User ID
        <select name="userId" autocomplete="username"${ids.length || options.allowPinOnly ? "" : " disabled"}>
          ${pinOnlyOption}
          ${userOptions}
        </select>
      </label>
      <!-- FUTURE: free-text User ID when the registry is large or external IdP is used.
      <label>User ID <input name="userIdText" type="text" autocomplete="username" placeholder="e.g. U2RE"></label>
      -->
      <label>Password or PIN <input name="pin" type="password" autocomplete="current-password" required></label>
      <label><input name="remember" type="checkbox" value="1"> Remember this browser</label>
      <button type="submit">Sign in</button>
      <p id="gateway-error" role="alert" aria-live="polite"></p>
    </form>
  </main>
  <script>
    const form = document.getElementById("gateway-login");
    const error = document.getElementById("gateway-error");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      error.textContent = "";
      const data = new FormData(form);
      const userId = String(data.get("userId") || "").trim();
      try {
        const response = await fetch("/gateway/auth/login", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId || undefined,
            pin: data.get("pin"),
            remember: data.get("remember") === "1"
          })
        });
        if (!response.ok) throw new Error("Authentication failed");
        const next = new URLSearchParams(window.location.search).get("next");
        window.location.assign(next && next.startsWith("/") ? next : "/");
      } catch (_) {
        error.textContent = "Authentication failed.";
      }
    });
  </script>
</body>
</html>`;
};

export const registerGatewayHttp = async (
    app: FastifyInstance,
    options: GatewayHttpOptions
): Promise<void> => {
    const config = options.config || resolveGatewayConfig(options.runtimeContext.engine.config);
    const sessionStore = createGatewaySessionStore(
        {
            idleMs: config.idleMs,
            absoluteMs: config.absoluteMs,
            rememberMs: config.rememberMs
        },
        options.now
    );
    const failures = new Map<string, { count: number; windowStartedAt: number; blockedUntil: number }>();

    await app.register(cookie);

    const stateFor = (request: FastifyRequest): GatewayRequestState => {
        const address = getClientAddress(request, config);
        const sourceClass = classifyGatewayRequestSource(
            address,
            String(request.headers.host || ""),
            config
        );
        const token = getCookieToken(request);
        return {
            sourceClass,
            session: token ? sessionStore.get(token) : null
        };
    };

    const wantsHtml = (request: FastifyRequest): boolean => {
        return String(request.headers.accept || "").includes("text/html");
    };

    const requireSession = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const state = stateFor(request);
        if (state.session || !isGatewayAuthRequired(state.sourceClass, config.lanPolicy)) {
            (request as FastifyRequest & { gatewayState?: GatewayRequestState }).gatewayState = state;
            return;
        }
        clearSessionCookie(reply);
        // WHY: keep the browser on `/` for login (no `/login` path in the address bar).
        if (wantsHtml(request)) {
            const next = request.url && request.url !== "/" ? `?next=${encodeURIComponent(request.url)}` : "";
            reply.redirect(`/${next}`);
            return;
        }
        reply.code(401).send({ ok: false, error: "Authentication required" });
        return;
    };

    const requireOrigin = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const origin = String(request.headers.origin || "").trim();
        if (!origin || !isSameOrigin(request, config, origin)) {
            reply.code(403).send({ ok: false, error: "Origin rejected" });
            return;
        }
    };

    const getState = (request: FastifyRequest): GatewayRequestState => {
        const existing = (request as FastifyRequest & { gatewayState?: GatewayRequestState }).gatewayState;
        return existing || stateFor(request);
    };

    (app as any).gatewayAuth = {
        requireSession,
        requireOrigin,
        getState,
        sessionStore
    };

    // INVARIANT: human UI stays on `/…` — login is `/` itself when unauthenticated;
    // auth APIs remain under `/gateway/auth/*` and `/gateway/api/*`.
    const sendLoginPage = async (_request: FastifyRequest, reply: FastifyReply) => {
        // WHY: user set is small after /admin register — dropdown is clearer than free text.
        const users = await listUsers().catch(() => []);
        reply.type("text/html; charset=utf-8");
        reply.header("Cache-Control", "no-store");
        return reply.send(
            renderLoginPage({
                userIds: users.map((user) => user.userId),
                allowPinOnly: Boolean(config.pinHash)
            })
        );
    };

    const sendSpaIndex = async (_request: FastifyRequest, reply: FastifyReply) => {
        if (!existsSync(path.join(options.webRoot, "index.html"))) {
            return reply.code(503).send({ ok: false, error: "Gateway frontend unavailable" });
        }
        reply.type("text/html; charset=utf-8");
        reply.header("Cache-Control", "no-store");
        return reply.send(await readFile(path.join(options.webRoot, "index.html"), "utf8"));
    };

    app.get("/", async (request, reply) => {
        const state = stateFor(request);
        if (state.session || !isGatewayAuthRequired(state.sourceClass, config.lanPolicy)) {
            return sendSpaIndex(request, reply);
        }
        return sendLoginPage(request, reply);
    });

    // COMPAT: older bookmarks that still hit /login or /gateway/login.
    app.get("/login", async (request, reply) => {
        const search = request.url.includes("?") ? request.url.slice(request.url.indexOf("?")) : "";
        return reply.redirect(`/${search}`.replace(/^\/\/+/, "/"));
    });
    app.get("/gateway/login", async (_request, reply) => reply.redirect("/"));
    app.get("/gateway", async (_request, reply) => reply.redirect("/"));
    app.get("/gateway/", async (_request, reply) => reply.redirect("/"));

    app.post(
        "/gateway/auth/login",
        async (
            request: FastifyRequest<{
                Body: { pin?: string; userKey?: string; userId?: string; remember?: boolean };
            }>,
            reply
        ) => {
            const address = getClientAddress(request, config);
            const timestamp = (options.now || Date.now)();
            const previous = failures.get(address);
            const entry =
                previous && timestamp - previous.windowStartedAt < config.loginWindowMs
                    ? previous
                    : { count: 0, windowStartedAt: timestamp, blockedUntil: 0 };

            if (timestamp < entry.blockedUntil) {
                return reply
                    .code(429)
                    .header("Retry-After", String(Math.max(1, Math.ceil((entry.blockedUntil - timestamp) / 1000))))
                    .send({ ok: false, error: "Too many attempts" });
            }

            const userId = String(request.body?.userId || "").trim();
            // COMPAT: admin register stores userKey; login form may send pin or userKey.
            const secret = String(request.body?.userKey || request.body?.pin || "");
            let valid = false;
            if (userId) {
                // WHY: /admin "Register user" writes users.json; gateway UI must accept those credentials.
                // INVARIANT: when userId is present, do not fall through to the shared PIN.
                valid = Boolean(secret) && Boolean(await verifyUser(userId, secret));
            } else if (secret && config.pinHash) {
                valid = await verifyScryptHash(secret, config.pinHash);
            }
            if (!valid) {
                entry.count += 1;
                entry.blockedUntil =
                    entry.count >= config.loginMaxFailures ? timestamp + config.loginBackoffMs * entry.count : 0;
                failures.set(address, entry);
                return reply.code(401).send({ ok: false, error: "Invalid credentials" });
            }

            failures.delete(address);
            const oldToken = getCookieToken(request);
            const issued = oldToken
                ? sessionStore.rotate(oldToken, classifyGatewaySource(address, config), Boolean(request.body?.remember))
                : null;
            const session =
                issued ||
                sessionStore.issue(classifyGatewaySource(address, config), Boolean(request.body?.remember));

            reply.setCookie(SESSION_COOKIE, session.token, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                path: COOKIE_PATH,
                ...(request.body?.remember
                    ? { maxAge: Math.max(1, Math.floor(config.rememberMs / 1000)) }
                    : {})
            });
            return reply.send({ ok: true, session: publicSession(session) });
        }
    );

    app.get("/gateway/auth/session", async (request, reply) => {
        const state = stateFor(request);
        if (state.session) return reply.send({ ok: true, session: publicSession(state.session) });
        if (!isGatewayAuthRequired(state.sourceClass, config.lanPolicy)) {
            return reply.send({
                ok: true,
                session: {
                    authenticated: true,
                    sourceClass: state.sourceClass
                }
            });
        }
        return reply.send({ ok: true, session: { authenticated: false } });
    });

    app.post("/gateway/auth/logout", { preHandler: requireOrigin }, async (request, reply) => {
        const token = getCookieToken(request);
        if (token) sessionStore.revoke(token);
        clearSessionCookie(reply);
        return reply.send({ ok: true });
    });

    await app.register(async (scope) => {
        scope.addHook("onRequest", requireSession);
        for (const spaPath of SPA_VIEW_PATHS) {
            scope.get(spaPath, sendSpaIndex);
        }
        // Vite `base: "./"` from `/` or `/network` resolves assets under `/assets/`.
        const assetsDir = path.join(options.webRoot, "assets");
        if (existsSync(assetsDir)) {
            await scope.register(fastifyStatic, {
                root: assetsDir,
                prefix: "/assets/",
                decorateReply: false,
                cacheControl: false
            });
            // COMPAT: older bookmarks/builds that still request /gateway/assets/*
            await scope.register(fastifyStatic, {
                root: assetsDir,
                prefix: "/gateway/assets/",
                decorateReply: false,
                cacheControl: false
            });
        }
    });

    await registerGatewayBff(app, {
        runtimeContext: options.runtimeContext,
        auth: {
            requireSession,
            requireOrigin
        }
    });
};

