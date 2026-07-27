# CWSP Gateway UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a route-scoped, PIN/password-protected L-200 gateway UI with a same-origin BFF while preserving CWSP transport authentication and settings authority.

**Architecture:** The existing server-v2 Fastify runtime owns `/gateway`, its session cookie, and a narrow BFF. The frontend is a new Vite target that reuses the shared minimal/network/settings view graph. `/ws`, `/socket.io`, and machine HTTP routes stay outside the human session boundary.

**Tech Stack:** Node.js 24+, Fastify 5, `@fastify/cookie`, Node `crypto.scrypt`, TypeScript, Vite 8, existing CWSP v2 packet and settings APIs.

## Global Constraints

- WAN gateway UI access requires PIN/password authentication.
- LAN authentication defaults to `optional` and supports `off | optional | required`.
- The server-v2 settings store is the only settings authority; do not dual-write the CWSP-reborn Node `portable.config` store.
- UI sessions must never authorize `/ws`, `/socket.io`, or machine token routes.
- Do not expose plaintext credentials, cookies, transport tokens, or private config values to the frontend, URLs, logs, or browser storage.
- Preserve `endpointUrl`, `directUrl`, `routeTarget`, `clientId`, `from`, `byId`, `nodes`, and `destinations` semantics.
- WebAuthn is not part of this first implementation.
- Do not commit changes unless the user explicitly requests a commit.

---

## File Map

**Create:**

- `runtime/cwsp/endpoint/server-v2/protocol/http/gateway/config.ts` — gateway policy and environment/config resolution.
- `runtime/cwsp/endpoint/server-v2/protocol/http/gateway/crypto.ts` — encoded scrypt hash creation/verification.
- `runtime/cwsp/endpoint/server-v2/protocol/http/gateway/session.ts` — opaque in-memory sessions, expiry, rotation, and revocation.
- `runtime/cwsp/endpoint/server-v2/protocol/http/gateway/bff.ts` — authenticated settings/status/topology/action handlers.
- `runtime/cwsp/endpoint/server-v2/protocol/http/gateway/index.ts` — gateway auth route and scoped Fastify registration.
- `runtime/cwsp/endpoint/server-v2/protocol/http/branches/gateway.ts` — server-v2 HTTP branch metadata and mount adapter.
- `runtime/cwsp/endpoint/server-v2/protocol/http/gateway.test.ts` — Fastify injection tests for auth, policy, BFF, and route isolation.
- `apps/CWSP-reborn/src/frontend/web/gateway/web/index.html` — gateway application document.
- `apps/CWSP-reborn/src/frontend/web/gateway/web/entry.ts` — session gate and shared shell boot.
- `apps/CWSP-reborn/src/frontend/web/gateway/web/gateway-auth.ts` — same-origin session/login client.
- `apps/CWSP-reborn/src/frontend/web/gateway/web/settings-bridge.ts` — same-origin settings sync arm.

**Modify:**

- `runtime/cwsp/endpoint/package.json` — add `@fastify/cookie` and `test:gateway`.
- `runtime/cwsp/endpoint/server-v2/index.ts` — pass the server-v2 runtime context to HTTP branches.
- `runtime/cwsp/endpoint/server-v2/config/storage.ts` — expose optional non-secret gateway config from the portable snapshot.
- `runtime/cwsp/endpoint/server-v2/protocol/http/types.ts` — type the branch runtime context.
- `runtime/cwsp/endpoint/server-v2/protocol/http/index.ts` — register the gateway branch.
- `runtime/cwsp/endpoint/server-v2/protocol/http/handlers/assets.ts` —
  protect the legacy human `/admin` surface.
- `runtime/cwsp/endpoint/server-v2/protocol/http/handlers/settings.ts` —
  protect legacy admin/settings routes while retaining machine user-token
  routes.
- `apps/CWSP-reborn/vite.config.ts` — add the `gateway` build target and shared view aliases.
- `apps/CWSP-reborn/package.json` — add `build:gateway:web`.

## Interfaces Shared Across Tasks

The backend tasks produce these stable interfaces:

```ts
export type GatewayLanPolicy = "off" | "optional" | "required";
export type GatewaySourceClass = "lan" | "wan";

export type GatewayRuntimeContext = {
    engine: {
        config: Record<string, unknown>;
        profile: Record<string, unknown>;
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
```

The frontend tasks consume:

```ts
export type GatewaySession = {
    authenticated: boolean;
    sourceClass?: "lan" | "wan";
    expiresAt?: number;
};

export type GatewaySettingsArm = {
    get(): Promise<Record<string, unknown>>;
    patch(patch: Record<string, unknown>): Promise<Record<string, unknown>>;
};
```

### Task 1: Add gateway security primitives

**Files:**

- Create: `runtime/cwsp/endpoint/server-v2/protocol/http/gateway/config.ts`
- Create: `runtime/cwsp/endpoint/server-v2/protocol/http/gateway/crypto.ts`
- Create: `runtime/cwsp/endpoint/server-v2/protocol/http/gateway/session.ts`
- Create: `runtime/cwsp/endpoint/server-v2/protocol/http/gateway.test.ts`
- Modify: `runtime/cwsp/endpoint/package.json`

**Interfaces:**

- Produces `GatewayLanPolicy`, `GatewaySourceClass`, `resolveGatewayConfig`, `createGatewayCredentialVerifier`, and `createGatewaySessionStore`.
- Does not register routes or read application settings.

- [ ] **Step 1: Add failing unit tests for hash, source policy, and sessions**

Add node:test cases with deterministic clocks:

```ts
test("verifies an encoded scrypt hash without accepting a wrong PIN", async () => {
    const encoded = await createScryptHash("correct-pin");
    assert.equal(await verifyScryptHash("correct-pin", encoded), true);
    assert.equal(await verifyScryptHash("wrong-pin", encoded), false);
});

test("unknown source classification uses the WAN-required policy", () => {
    assert.equal(resolveRequiredPolicy("unknown", "optional"), true);
});

test("session rotation invalidates the old token and expiry invalidates the new token", () => {
    let now = 1_000;
    const sessions = createGatewaySessionStore(() => now);
    const first = sessions.issue("wan", false);
    const second = sessions.rotate(first.token, "wan", false);
    assert.equal(sessions.get(first.token), null);
    assert.equal(sessions.get(second.token)?.sourceClass, "wan");
    now += 31 * 60 * 1000;
    assert.equal(sessions.get(second.token), null);
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run from `runtime/cwsp/endpoint`:

```bash
npm install @fastify/cookie
node --import tsx --test server-v2/protocol/http/gateway.test.ts
```

Expected: FAIL because the gateway security modules and exports do not yet
exist.

- [ ] **Step 3: Implement the security primitives**

Implement these exact behaviors:

```ts
export async function createScryptHash(value: string): Promise<string>;
export async function verifyScryptHash(value: string, encoded: string): Promise<boolean>;

export function resolveGatewayConfig(
    config: Record<string, unknown>,
    env?: NodeJS.ProcessEnv
): {
    pinHash: string;
    lanPolicy: GatewayLanPolicy;
    trustedCidrs: string[];
    trustedProxies: string[];
    idleMs: number;
    absoluteMs: number;
    rememberMs: number;
};

export function createGatewaySessionStore(now?: () => number): {
    issue(sourceClass: GatewaySourceClass, remember: boolean): { token: string; expiresAt: number };
    rotate(token: string, sourceClass: GatewaySourceClass, remember: boolean): { token: string; expiresAt: number } | null;
    get(token: string): { token: string; sourceClass: GatewaySourceClass; expiresAt: number } | null;
    revoke(token: string): void;
    clear(): void;
};
```

Use Node `crypto.randomBytes`, `crypto.scrypt`, and
`crypto.timingSafeEqual`. Encode the hash as a self-contained
`scrypt$N$r$p$salt$derivedKey` string. Reject malformed hashes and
configuration without a WAN credential instead of falling back to a default
PIN. Use explicit environment precedence for `CWS_GATEWAY_PIN_HASH`,
`CWS_GATEWAY_LAN_POLICY`, `CWS_GATEWAY_TRUSTED_CIDRS`,
`CWS_GATEWAY_TRUSTED_PROXIES`, `CWS_GATEWAY_SESSION_IDLE_MS`,
`CWS_GATEWAY_SESSION_MAX_MS`, and `CWS_GATEWAY_REMEMBER_MS`.

- [ ] **Step 4: Run the focused tests and verify they pass**

Run:

```bash
node --import tsx --test server-v2/protocol/http/gateway.test.ts
```

Expected: PASS for all primitive tests.

### Task 2: Register the route-scoped gateway plugin

**Files:**

- Create: `runtime/cwsp/endpoint/server-v2/protocol/http/branches/gateway.ts`
- Create: `runtime/cwsp/endpoint/server-v2/protocol/http/gateway/index.ts`
- Modify: `runtime/cwsp/endpoint/server-v2/protocol/http/types.ts`
- Modify: `runtime/cwsp/endpoint/server-v2/protocol/http/index.ts`
- Modify: `runtime/cwsp/endpoint/server-v2/index.ts`
- Modify: `runtime/cwsp/endpoint/server-v2/config/storage.ts`
- Test: `runtime/cwsp/endpoint/server-v2/protocol/http/gateway.test.ts`

**Interfaces:**

- Consumes `GatewayRuntimeContext` and the primitives from Task 1.
- Produces `/gateway/auth/login`, `/gateway/auth/session`,
  `/gateway/auth/logout`, `/gateway/login`, protected `/gateway/`, and
  protected `/gateway/assets/*`.

- [ ] **Step 1: Extend the branch context and add route-isolation tests**

Add `runtimeContext?: unknown` to `ServerV2HttpBranchMountContext`, the
`ServerV2Http.register` options, and `createServerV2Http().register`.

Add tests that mount only `registerGatewayHttp` on a fresh Fastify instance and
assert:

```ts
const app = fastify();
await registerGatewayHttp(app, fakeGatewayRuntime());
const login = await app.inject({ method: "GET", url: "/gateway/login" });
assert.equal(login.statusCode, 200);
const protectedPage = await app.inject({ method: "GET", url: "/gateway/" });
assert.equal(protectedPage.statusCode, 401);
const wsLike = await app.inject({ method: "GET", url: "/ws" });
assert.notEqual(wsLike.statusCode, 401);
```

Also assert that the existing `/admin` and `/core/admin/prefs` routes require
the gateway session, while `/core/user/settings` still uses its existing
`userId`/`userKey` contract.

- [ ] **Step 2: Run the route tests and verify the new cases fail**

Run:

```bash
node --import tsx --test server-v2/protocol/http/gateway.test.ts
```

Expected: FAIL because the branch context, gateway registration, and routes
are not wired.

- [ ] **Step 3: Implement registration and auth routes**

Register `@fastify/cookie` once on the application. Mount the gateway branch
before the assets/settings branches so it can decorate the app with the
gateway session verifier. Use a child Fastify scope for the protected gateway
routes so the auth hook cannot affect `/ws`, `/socket.io`, `/lna-probe`, or
legacy machine routes.

Use these route contracts:

```ts
POST /gateway/auth/login
Body: { pin: string; remember?: boolean }
Success: 200 { ok: true; session: GatewaySession }
Failure: 401 { ok: false; error: "Invalid credentials" }

GET /gateway/auth/session
Success: 200 { ok: true; session: GatewaySession }
No session: 200 { ok: true; session: { authenticated: false } }

POST /gateway/auth/logout
Success: 200 { ok: true }
```

Set the cookie as `cwsp_gateway_session` with `HttpOnly`, `Secure`,
`SameSite=Lax`, `Path=/gateway`, and `Max-Age` only for a remembered session.
Return generic errors and `429` after the configured failed-attempt threshold.
Use the raw socket address for source classification unless the immediate peer
matches an explicitly configured trusted proxy; never trust arbitrary
`X-Forwarded-For`.

Add `requireGatewaySession` and `requireGatewayOrigin` request guards. The
origin guard applies to logout and every state-changing `/gateway/api/*`
route; it accepts only an `Origin` matching the effective same-origin scheme
and host, and rejects missing/mismatched browser origins with `403`. The
effective scheme may use forwarded metadata only after the source is an
explicitly trusted proxy.

Serve `/gateway/login` as a small public HTML form that contains only a
same-origin `fetch` to the login route. Serve application assets and
`/gateway/` only from the authenticated child scope. Never interpolate
configuration or secret values into the login document.

Apply `requireGatewaySession` to legacy `/admin`, `/core/admin/prefs`, and
`/api/config/:filename`. Leave `/core/user/settings` protected by its existing
CWSP user credential verifier rather than accepting a UI cookie.

Add `gateway` to the server-v2 snapshot in `config/storage.ts` without adding
credentials to the snapshot returned by settings endpoints. Pass
`{ engine, selfId, sockets }` from `server-v2/index.ts` as `runtimeContext`.

- [ ] **Step 4: Run the auth and route-isolation tests**

Run:

```bash
node --import tsx --test server-v2/protocol/http/gateway.test.ts
```

Expected: PASS for login success/failure, cookie attributes, session rotation,
expiry, logout, rate limiting, WAN/LAN policy, origin/CSRF rejection, legacy
admin protection, and route isolation.

### Task 3: Implement the authenticated BFF

**Files:**

- Create: `runtime/cwsp/endpoint/server-v2/protocol/http/gateway/bff.ts`
- Modify: `runtime/cwsp/endpoint/server-v2/protocol/http/gateway/index.ts`
- Test: `runtime/cwsp/endpoint/server-v2/protocol/http/gateway.test.ts`

**Interfaces:**

- Consumes the authenticated request decorator/session and
  `GatewayRuntimeContext`.
- Produces settings, status, topology, and explicit-destination action
  endpoints.

- [ ] **Step 1: Add failing BFF contract tests**

Add tests for:

```ts
GET /gateway/api/settings
PATCH /gateway/api/settings
GET /gateway/api/network/status
GET /gateway/api/topology
POST /gateway/api/action
```

Assert that settings use `engine.storage.readCoreSettings` and
`writeCoreSettings`, status uses `engine.profile` and socket status, and an
action packet contains `op: "act"`, `from`, `byId`, and explicit `nodes`.
Assert that missing destinations, `"*"`, unknown actions, arbitrary URLs, and
secret-bearing patch keys return `400` or `403`.

- [ ] **Step 2: Run the BFF tests and verify they fail**

Run:

```bash
node --import tsx --test server-v2/protocol/http/gateway.test.ts
```

Expected: FAIL because the BFF routes do not exist.

- [ ] **Step 3: Implement the narrow BFF**

Implement:

```ts
GET /gateway/api/settings
// Returns the merged server-v2 core settings with secret-bearing fields redacted.

PATCH /gateway/api/settings
Body: Record<string, unknown>
// Rejects secret-bearing keys and persists the safe patch through writeCoreSettings.

GET /gateway/api/network/status
// Returns profile, sockets.getStatus(), and connected peer profiles.

GET /gateway/api/topology
// Returns redacted topology and endpoint ID metadata from the server-v2 snapshot.

POST /gateway/api/action
Body: {
    what: "clipboard:update" | "clipboard:write" | "clipboard:clear" |
        "mouse:move" | "mouse:click" | "mouse:scroll" | "mouse:down" | "mouse:up" |
        "keyboard:type" | "keyboard:tap" | "keyboard:toggle";
    purpose: "clipboard" | "input" | "mouse";
    destinations: string[];
    payload: Record<string, unknown>;
}
// Dispatches a canonical act packet only when every destination is explicit.
```

Redact values under keys such as `token`, `userKey`, `accessToken`, `password`,
`secret`, `apiKey`, and credential-bearing header maps. Reject patches that
attempt to write those keys; private configuration remains the write path for
secrets. Limit JSON body size and payload depth before dispatch.

Build action packets with the existing v2 shape:

```ts
{
    op: "act",
    what,
    purpose,
    protocol: "local",
    transport: "http",
    payload,
    data: payload,
    from: runtime.selfId,
    byId: runtime.selfId,
    nodes: destinations,
    destinations,
    timestamp: Date.now()
}
```

Return `202` when `dispatchPacket` accepts the packet and `502` when it
cannot deliver it. Do not turn a browser session into a transport credential.

- [ ] **Step 4: Run the BFF tests and verify they pass**

Run:

```bash
node --import tsx --test server-v2/protocol/http/gateway.test.ts
```

Expected: PASS for settings round-trip, redaction, status/topology, action
allowlist, destination validation, and arbitrary proxy rejection.

### Task 4: Add the gateway Vite target and frontend adapter

**Files:**

- Create: `apps/CWSP-reborn/src/frontend/web/gateway/web/index.html`
- Create: `apps/CWSP-reborn/src/frontend/web/gateway/web/entry.ts`
- Create: `apps/CWSP-reborn/src/frontend/web/gateway/web/gateway-auth.ts`
- Create: `apps/CWSP-reborn/src/frontend/web/gateway/web/settings-bridge.ts`
- Modify: `apps/CWSP-reborn/vite.config.ts`
- Modify: `apps/CWSP-reborn/package.json`
- Test: `apps/CWSP-reborn/test/gateway-frontend-contract.test.mjs`

**Interfaces:**

- Consumes `/gateway/auth/session` and `/gateway/api/*`.
- Produces the shared minimal/network/settings shell without loopback
  `X-API-Key` or transport token access.

- [ ] **Step 1: Add a frontend contract test and target assertions**

Create a node:test file that reads the source/config and asserts:

```js
assert.match(viteConfig, /gateway:/);
assert.match(packageJson.scripts["build:gateway:web"], /--mode gateway/);
assert.match(entrySource, /gateway\/auth\/session|gateway-auth/);
assert.doesNotMatch(settingsBridgeSource, /X-API-Key/);
assert.doesNotMatch(settingsBridgeSource, /localStorage.*token|accessToken/);
```

- [ ] **Step 2: Run the contract test and verify it fails**

Run from `apps/CWSP-reborn`:

```bash
node --test test/gateway-frontend-contract.test.mjs
```

Expected: FAIL because the gateway target and frontend files do not exist.

- [ ] **Step 3: Add the Vite target**

Extend `BuildTarget` and `TARGETS` with:

```ts
gateway: {
    entry: "src/frontend/web/gateway/web/entry.ts",
    html: "src/frontend/web/gateway/web/index.html",
    outDir: "build/gateway/web",
    VITE_ENABLED_VIEWS: "minimal,network,settings",
    platformWebRoot: "src/frontend/web/gateway/web",
    sharedWebRoot: "src/frontend/web/webnative/web",
    viewDefines: {
        __RS_VIEW_SETTINGS__: "true",
        __RS_VIEW_NETWORK__: "true",
        __RS_VIEW_AIRPAD__: "false",
        __RS_VIEW_VIEWER__: "false",
        __RS_VIEW_EDITOR__: "false",
        __RS_VIEW_WORKCENTER__: "false",
        __RS_VIEW_EXPLORER__: "false",
        __RS_VIEW_HISTORY__: "false",
        __RS_VIEW_HOME__: "false",
        __RS_VIEW_PRINT__: "false"
    }
}
```

Make `selectTarget("gateway")` return this target. Treat gateway like
WebNative/Neutralino for disabled AirPad imports. Use `sharedWebRoot` for
minimal/network/settings aliases so the gateway does not copy platform view
trees. Keep `platformWebRoot` as the gateway document root.

Add:

```json
"build:gateway:web": "vite build --mode gateway --configLoader runner"
```

- [ ] **Step 4: Implement the gateway frontend**

`gateway-auth.ts` exposes:

```ts
export async function getGatewaySession(): Promise<GatewaySession>;
export async function loginGateway(pin: string, remember: boolean): Promise<GatewaySession>;
export async function logoutGateway(): Promise<void>;
```

Use `credentials: "same-origin"`, `cache: "no-store"`, and generic UI errors.
Never persist PIN, session token, or transport token in browser storage.

`entry.ts` must:

1. call `getGatewaySession()`;
2. redirect to `/gateway/login` when unauthenticated;
3. register the BFF settings arm;
4. set `data-cwsp-enabled-views="minimal,network,settings"`;
5. call `bootMinimal(document.body, "network")`;
6. redirect to login on an API `401`.

`settings-bridge.ts` implements `GatewaySettingsArm` using `GET /gateway/api/settings`
and `PATCH /gateway/api/settings`. It must not import or call the desktop
loopback `/service/config` endpoint.

`index.html` contains only the app shell document and the gateway entry module;
the public login form remains server-rendered by the gateway route.

- [ ] **Step 5: Run frontend contract and build checks**

Run:

```bash
node --test test/gateway-frontend-contract.test.mjs
npm run build:gateway:web
```

Expected: the contract test passes and
`build/gateway/web/index.html` is generated.

### Task 5: Verify endpoint and cross-target compatibility

**Files:**

- Modify: `apps/CWSP-reborn/README.md` — document the gateway build command and
  the `CWS_GATEWAY_WEB_ROOT` deployment setting without credential values.
- Test: `runtime/cwsp/endpoint/server-v2/protocol/http/gateway.test.ts`
- Test: `apps/CWSP-reborn/test/gateway-frontend-contract.test.mjs`

- [ ] **Step 1: Add the static-root contract**

The gateway registration must resolve its static root from
`CWS_GATEWAY_WEB_ROOT`, with a documented local default, and return a clear
configuration error when the root is missing. It must never fall back to an
unrelated `/admin` tree.

- [ ] **Step 2: Run focused backend checks**

Run from `runtime/cwsp/endpoint`:

```bash
npm run typecheck
node --import tsx --test server-v2/protocol/http/gateway.test.ts
```

Expected: typecheck passes and all gateway tests pass.

- [ ] **Step 3: Run focused CWSP-reborn checks**

Run from `apps/CWSP-reborn`:

```bash
npm run check:types
npm run check:settings-backend
npm run check:web-backend
npm run check:ws-loopback
npm run build:gateway:web
```

Expected: existing checks remain green and the gateway bundle builds.

- [ ] **Step 4: Run unchanged-target smoke builds**

Run:

```bash
npm run build:webnative:web
npm run build:neutralino:web
```

Expected: both existing targets still produce their prior output and do not
resolve the gateway BFF adapter or gateway-only imports.

- [ ] **Step 5: Perform the short manual HTTP matrix**

Against a local Fastify instance with test credentials:

```text
WAN-like source + GET /gateway/              → 401/redirect
WAN-like source + POST login                 → 200 + Secure HttpOnly cookie
Authenticated GET /gateway/                  → 200
Authenticated PATCH /gateway/api/settings   → 200
Unauthenticated GET /ws                     → existing transport behavior
UI cookie sent to /ws                       → not accepted as peer auth
LAN optional + GET /gateway/                → configured optional behavior
```

Keep each probe within 30 seconds, inspect the endpoint logs for redaction, and
do not clear existing PM2 logs.

## Plan Self-Review

- **Spec coverage:** Tasks 1–3 cover credential hashing, sessions, WAN/LAN
  policy, CSRF/rate limiting, scoped routes, BFF allowlists, settings
  authority, and transport separation. Task 4 covers the first-layer
  frontend and shared view parity. Task 5 covers build and compatibility
  evidence.
- **Placeholder scan:** No task depends on an unspecified dependency, secret,
  host, or future implementation. WebAuthn is explicitly excluded from this
  delivery.
- **Type consistency:** `GatewayRuntimeContext`, `GatewaySession`,
  `GatewayLanPolicy`, and `GatewaySettingsArm` are defined once and consumed by
  the tasks that follow them.
