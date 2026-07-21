### W2 Task 5 Report — Live mount + `/files/probe` + W2 verification

**Branch:** `feat/cwsp-files-transfer-w2`
**Scope:** `apps/CWSP-reborn/runtime/endpoint`

## What changed

- `server/routing/core-app.ts`
  - Imported `registerFilesHttpRouter` (`@protocol/http/routers/files/index.ts`) and `createFilesBlobStore` + `FilesBlobStore` type (`../../server-v2/files/blob-store.ts`).
  - Added a process-singleton blob store getter (`getFilesBlobStore`) so PUT-minted tokens are accepted by GET on any worker serving the shared `:8434` app.
  - Mounted `registerFilesHttpRouter(app, { filesBlobStore })` inside `registerCoreApp` after `/lna-probe` — the live `:8434` boot now serves `/files/blob/:transferId/:batchId` (PUT/GET/HEAD/DELETE).
  - Added `OPTIONS`, `GET`, `HEAD` for `/files/probe` returning `204` with CORS + private-network headers mirroring `/lna-probe`. `GET` uses `exposeHeadRoute: false` so the explicit `HEAD` route doesn't collide.
- `server-v2/files/w2-smoke.test.ts` (new) — imports W1 `chooseByteTransport` from `shared/v2/files.ts` and W2 `listBlobUrlCandidates` from `./route-probe.ts`; asserts `auto` prefers `http` for small+reachable, falls back to `ws` when unreachable or `> CHUNK_MAX`, honors explicit `http`/`ws` hints, and that candidate order is LAN-direct → gateway LAN → gateway WAN (incl. multi-peer + trailing-slash tolerance).
- `server-v2/protocol/http/routers/files/files-probe.test.ts` (new) — mounts `registerCoreApp` and asserts `/files/probe` OPTIONS (real preflight with `access-control-request-method`), GET, and HEAD all return `204` with correct CORS/PNA headers.

## WS forward path (brief item 4)

Inspected `server-v2/protocol/socket/coordinator.ts` and `handler.ts`. The coordinator already forwards every non-self `ask`/`act` packet to other peers via `populateToOthers("data", packet, excludeSelf(packet?.nodes, selfId), ...)` **before** `handleAct`/`handleAsk` run (they only run when `targetsSelf`). `handleFilesAction`/`handleFilesAsk` return `{ forward: true, handled: true }` and never touch clipboard drivers; the clipboard handler returns `null` for `files:*` because `isFilesWhat` is checked first in `handleAct`. **No extra guard needed** — `files:*` relay is preserved by the coordinator's general forward path, and no clipboard apply can fire for files payloads. Documented here; no code change required.

## Env knobs (brief item 4)

- `CWS_FILES_BLOB_DIR` — blob root override (default `<cwd>/.data/cwsp-files-blobs`).
- `CWS_FILES_BLOB_SECRET` — HMAC secret for per-batch fetch tokens (falls back to `CWS_BRIDGE_USER_KEY` / `CWS_UPSTREAM_USER_KEY`; per-process random if none — non-persistent, tokens invalidate on restart).
- `CWS_FILES_REWRITE_OFFER_URLS` — `1`/`true` forces gateway offer rewrite; `0`/`false` disables; unset → inferred from `CWS_ASSOCIATED_ID` == `.200`.
- `CWS_FILES_GATEWAY_CACHE_CHUNKS` — default **off**; gateway does not assemble WS chunks to disk in W2 (relay-only).

## Verification matrix

```
cd apps/CWSP-reborn/runtime/endpoint
node --import tsx --test server-v2/files/*.test.ts server-v2/protocol/http/routers/files/*.test.ts server-v2/protocol/socket/handlers/files.test.ts
# tests 40, pass 40, fail 0
npm run test:gateway
# tests 11, pass 11, fail 0
cd apps/CWSP-reborn/src/shared && npm test
# tests 46, pass 46, fail 0
```

Also verified `server/routing/core-app.ts` loads cleanly via `node --import tsx` (alias `@protocol/*` resolves; `@server-v2/*` tsconfig target lacks `*` so blob-store uses a relative path).

## Compatibility matrix

| Route | Live `:8434` | Direct | Proxied | Reverse |
|---|---|---|---|---|
| `OPTIONS /files/probe` | 204 + CORS/PNA | ✓ | ✓ | ✓ |
| `GET/HEAD /files/probe` | 204 + CORS | ✓ | ✓ | ✓ |
| `PUT /files/blob/:t/:b` | 200 + token | ✓ | ✓ | ✓ |
| `GET/HEAD /files/blob/:t/:b` | 200/401/404/410 | ✓ | ✓ | ✓ |
| `DELETE /files/blob/:t/:b` | 200/401/404/410 | ✓ | ✓ | ✓ |
| `files:*` WS relay | forward via coordinator | ✓ | ✓ | ✓ |

## Risks / concerns

- The explicit `app.options("/files/probe", ...)` handler is shadowed by the global `@fastify/cors` preflight hook for real browser preflights (same as `/lna-probe`); it remains as a faithful mirror of `/lna-probe` and as a fallback for non-preflight OPTIONS. No behavioral divergence.
- `CWS_FILES_BLOB_SECRET` must be set consistently across all endpoint processes that share the blob root, otherwise PUT-minted tokens won't verify on GET. Default per-process random secret is for tests only.
- No portable/ mirrors edited (per brief). WS chunk-to-disk caching intentionally off in W2.

## Out of scope (W2)

- Neutralino Open for Share, Capacitor notification/SAF, settings `byteTransport` UI, `MANAGE_EXTERNAL_STORAGE` (W3/W4).
