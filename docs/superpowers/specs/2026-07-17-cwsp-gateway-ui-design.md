# CWSP Gateway UI and Neutralino Focus Design

**Date:** 2026-07-17  
**Status:** Design approved by the user  
**Scope:** L-200 gateway human UI authentication and passive Neutralino popup focus

## Decisions

- **Observed:** L-200 is hosted by the existing Fastify server-v2 runtime; the
  CWSP-reborn `src/backend/node/fastify` path is not the gateway host.
- **Observed:** desktop WebNative/Neutralino settings use a loopback
  `X-API-Key` control RPC, which is a separate trust boundary from browser UI
  sessions.
- **Observed:** the passive clipboard prompt path can activate its window
  during prompt updates.
- **Planned:** the gateway UI is a new, route-scoped Fastify surface on the
  existing L-200 server-v2 runtime.
- The human UI is protected independently from CWSP peer and transport
  authentication.
- WAN access requires PIN/password authentication.
- LAN policy is `optional` by default and can be configured as `off`,
  `optional`, or `required`.
- The server-v2 settings store is the only settings authority for this UI.
- WebAuthn/biometric login is a later phase after trusted HTTPS origin and RP ID
  deployment are stable.
- Passive Neutralino clipboard/status popups must not activate or focus their
  window. Focus remains possible only after explicit user interaction.

## Goals

1. Provide an L-200 web interface analogous to the existing Capacitor,
   WebNative, and Neutralino surfaces.
2. Put a first login layer in front of the application layer.
3. Keep CWSP v2 packet semantics, direct/routed destination semantics, and
   machine-to-machine authentication unchanged.
4. Prevent passive Neutralino clipboard prompts from stealing focus from an
   external text input.
5. Reuse existing shared views and settings contracts instead of creating a
   second UI implementation.

## Non-goals

- Replacing the existing `/ws` or `/socket.io` transport authentication.
- Making a browser UI cookie a peer identity, `userKey`, `accessToken`, or
  client token.
- Exposing arbitrary proxy, URL fetch, or unrestricted dispatch operations to a
  browser session.
- Implementing WebAuthn in the first delivery.
- Replacing WebNative or Capacitor with Neutralino.

## Backend architecture

The existing Fastify server-v2 runtime remains the gateway host. A new
route-scoped gateway plugin owns the human UI surface:

- `GET /gateway/login`
- `POST /gateway/auth/login`
- `GET /gateway/auth/session`
- `POST /gateway/auth/logout`
- protected `/gateway/*` frontend assets
- protected `/gateway/api/*` BFF operations
- optional cookie-authenticated `/gateway/events` for UI updates

The plugin must not install an unconditional global hook. The following
surfaces retain their existing responsibilities:

- `/ws` and `/socket.io` use CWSP transport and peer credentials;
- `/lna-probe` remains a reachability probe;
- machine-to-machine HTTP routes continue to use their existing token/client
  identity rules.

Existing human-facing `/admin` and admin/settings routes must use the same
gateway policy or redirect into `/gateway`; they must not remain anonymously
usable from the WAN.

The BFF exposes only narrowly scoped operations such as settings
read/patch, network status, topology, and allowlisted clipboard/input actions.
Every action validates an explicit destination ID. Arbitrary URL forwarding,
generic dispatch, and unrestricted proxying are rejected.

The gateway UI preserves these distinct concepts:

- `endpointUrl`: gateway or relay origin;
- `directUrl`: direct target origin;
- `routeTarget`: logical destination;
- `clientId`: source identity.

The page host is never used as an implicit target identity.

## Authentication and sessions

The PIN/password is configured outside the frontend bundle and stored only as
a salted `scrypt` hash. Plaintext credentials, session values, and transport
tokens must not appear in URLs, responses, logs, localStorage, or IndexedDB.

Successful login creates an opaque session with:

- `HttpOnly`;
- `Secure`;
- `SameSite=Lax`;
- `Path=/gateway`;
- idle and absolute expiry;
- rotation after login;
- logout and server-side revocation;
- optional longer-lived “remember” expiry.

Credential failures are intentionally generic. Login attempts receive
source-based rate limiting/backoff and structured audit events that contain no
secret or clipboard content.

The policy is:

| Source class | Default |
| --- | --- |
| WAN | authentication required |
| LAN | optional |

Configuration supports `off`, `optional`, and `required` for LAN. Source
classification uses bound interfaces and explicitly trusted proxy/CIDR
configuration. Arbitrary forwarded headers are not trusted. If classification
cannot safely prove LAN, the WAN-required policy applies.

State-changing BFF calls require same-origin/Origin validation and CSRF
protection. Session authorization is not accepted by `/ws` as a substitute for
peer authentication.

## Frontend and settings flow

The login document does not load the application shell or transport secrets.
After login:

1. The browser requests `/gateway/`.
2. The gateway Vite entry checks `/gateway/auth/session`.
3. A valid session mounts shared `minimal`, `network`, and `settings` views.
4. The views use same-origin `/gateway/api/*` calls.
5. A `401` or revoked session returns the UI to the login layer.

The gateway target reuses the shared view graph through Vite configuration and
does not copy Capacitor or Neutralino entries. Its settings adapter targets the
gateway BFF rather than the loopback `X-API-Key` control RPC used by desktop
shells.

Server-v2 configuration is the sole settings authority. The gateway BFF maps
its read/patch contract to that store and does not dual-write the CWSP-reborn
Node `portable.config` store.

## Neutralino focus behavior

The passive clipboard prompt path currently contains an activation call in
`resources/clipboard-prompt/prompt-toast.ps1`. The implementation must remove
automatic activation and use a non-activating display/update path, such as
`ShowWithoutActivation`/`WS_EX_NOACTIVATE` or an equivalent native
non-activating z-order operation.

Passive updates must not call:

- `Activate()`;
- `Focus()`;
- `SetForegroundWindow()`;
- `Neutralino.window.focus()`.

The popup may remain topmost when required for visibility. A user click on an
interactive popup may focus it. The main-window tray `SHOW` action may retain
explicit `show + focus`, because that is a direct user action. Timer and
polling updates must never repeat focus acquisition.

The independent popup process remains in place. The main Neutralino WebView
must not revive `Neutralino.window.create` for this flow.

## Error handling

- Protected request without a session: `401` or redirect to login.
- Invalid, expired, or revoked session: clear cookie and return a generic
  authentication response.
- Rate limit: `429` with safe retry metadata.
- CSRF or origin failure: `403`.
- Invalid destination or disallowed BFF operation: `400`/`403`.
- Downstream CWSP failure: controlled `502`/`504` without stack traces,
  credentials, or private paths.

Audit logging records event type, result, and safe source metadata only.

## Verification

### Gateway auth and BFF

- Fastify injection tests cover login, cookie flags, rotation, expiry, logout,
  revocation, rate limiting, CSRF, and WAN/LAN policy.
- Route isolation tests prove that UI sessions do not authorize `/ws` and that
  existing machine-token routes retain their contract.
- Tests cover `/admin`/settings protection, settings round-trip, destination
  validation, and rejection of arbitrary proxy/dispatch requests.

### Frontend

- Gateway Vite build succeeds.
- Login-to-session-to-shell boot succeeds.
- Expired session returns to login.
- Existing Capacitor, WebNative, and Neutralino builds remain green.

### Neutralino

- A static regression guard rejects automatic activation in the passive prompt
  path.
- Prompt fingerprint deduplication remains intact.
- On Windows, a manual smoke test types into another application while a
  passive popup appears and verifies that the active window and caret remain
  unchanged.
- Tray `SHOW` still focuses the main window after an explicit user action.

### CWSP compatibility

The implementation must preserve:

- canonical CWSP v2 envelope and stable action names;
- direct, proxied, and routed destination identity fields;
- `/ws` and `wss` behavior;
- settings contracts used by Capacitor, WebNative, and Neutralino;
- existing clipboard and input routing semantics.
