# Loading `build/webnative` in a WebNative shell

Pass-II desktop contour (no full `@mindw1n/webnative` packaging required yet).

## Frontend static bundle

```bash
cd apps/CWSP-reborn
npm run build:webnative
```

Output: `build/webnative/index.html` (+ assets). Views: `minimal`, `network`, `settings` (no AirPad).

## Node settings backend

Shared contract: `src/backend/node/shared/settings` (`settings:get` / `settings:patch` / persist).

Platform entrypoints (same contract):

- Windows: `src/backend/node/windows` (also `app/windows/backend/node`)
- Linux: `src/backend/node/linux` (also `app/linux/backend/node`)

Smoke-start (keeps process alive on the control port):

```bash
node --experimental-strip-types src/backend/node/linux/index.ts
# or
node --experimental-strip-types src/backend/node/windows/index.ts
```

Control RPC: loopback `GET|POST /service/config` with `X-API-Key` from the runtime auth object.
Persists to `portable.config.json` (override with `configPath` / cwd).

## Wire into `@mindw1n/webnative` later

1. Place `webnative.json` at the packaging cwd (`app/windows/webnative.json` or `app/linux/webnative.json`).
2. Copy `build/webnative/*` → `app/public/` (framework default web root).
3. Compile `src/backend/node/<platform>/index.ts` → `app/backend/dist/index.js`.
4. Run `webnative build windows` / `webnative build linux` from that cwd.

Until packaging lands, open `build/webnative/index.html` in a Chromium WebView pointed at the local control port, or use the Node backend alone for settings round-trip tests.
