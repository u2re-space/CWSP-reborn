# W2 Final Review — Fix Report

Branch: `feat/cwsp-files-transfer-w2`
Scope: `apps/CWSP-reborn/runtime/endpoint`

## Status

Both Important findings from the W2 final review are fixed, wired into the live
`:8434` forward path, and covered by focused tests. All targeted tests pass.

## Important 1 — Offer rewrite dead on live path

**Root cause:** `handleFilesAction` rewrote `files:offer` payloads, but the
result was only used for the *reply* to the sender. The actual forward to
destinations used the **original** inbound packet:
- `server/network/socket/websocket.ts` (live `:8434` `/ws`) built the outbound
  envelope from `frame.payload` directly.
- `server-v2/protocol/socket/coordinator.ts` `SocketWrapper.handlePacket`
  called `populateToOthers("data", packet, …)` with the original packet.

So a gateway relaying an offer from a sender behind NAT forwarded the sender's
private asset URL — unreachable by receivers.

**Fix:** Exported `prepareFilesOfferForForward(packet)` from
`server-v2/protocol/socket/handlers/files.ts`. It reuses the existing
`maybeRewriteOffer` logic and returns `{ packet, rewritten, payload }` — a
shallow-cloned packet carrying the rewritten payload when gateway rewrite
conditions are met, otherwise the same reference (no mutation of caller state).

Wired into **both** forward sites (preferred over docs-only):
- `websocket.ts`: computes `forwardPayload` once after `frame.payload` and uses
  it in both the directed envelope (`payload`/`data`) and the broadcast
  `multicast` call.
- `coordinator.ts` `handlePacket`: passes `forwardPrepared.packet` to
  `populateToOthers` instead of the raw inbound packet.

Rewrite conditions are unchanged: gateway host (`CWS_FILES_REWRITE_OFFER_URLS`
or associated id `.200`) + `CWS_FILES_PUBLIC_BASE_URL` + blob secret. Skipped
otherwise — never invents a public base URL.

## Important 2 — PUT unauthenticated + no scheduled GC

**PUT auth:** Added `FilesBlobStore.authorizePut({ transferId, batchId, token?,
uploadSecret? })`. It accepts either:
1. a shared upload secret matched in constant time
   (`safeEqualStrings` via `timingSafeEqual`), resolved from
   `options.uploadSecret` → `CWS_FILES_BLOB_UPLOAD_SECRET` →
   `CWS_FILES_BLOB_SECRET` (fallback); or
2. a pre-existing per-batch blob token with a valid HMAC signature
   (`verifyFilesBlobTokenSignature`).

The HTTP router (`server-v2/protocol/http/routers/files/index.ts`) now reads
`X-CWSP-Files-Upload-Secret` header / `?uploadSecret=` query and calls
`store.authorizePut` before `store.put`. Anonymous PUTs return **401**
`{ ok: false, error: "unauthorized-upload" }`. GET/HEAD/DELETE are unchanged
(still gated by the per-batch blob token).

**Scheduled GC:** `server/routing/core-app.ts` `getFilesBlobStore()` now starts
a `setInterval` calling `store.sweep()` every 5 minutes (override via
`CWS_FILES_BLOB_SWEEP_INTERVAL_MS`, min 60s). The timer is `unref()`-ed so it
never keeps the event loop alive on its own. This reaps batches that are never
fetched (offer declined / receiver offline) which lazy-GC-on-get would miss.

## Changed files

- `server-v2/protocol/socket/handlers/files.ts` — exported
  `prepareFilesOfferForForward`.
- `server/network/socket/websocket.ts` — import + apply rewrite before forward
  (directed + broadcast).
- `server-v2/protocol/socket/coordinator.ts` — import + apply rewrite before
  `populateToOthers`.
- `server-v2/files/blob-store.ts` — `uploadSecret` option, `resolveUploadSecret`,
  `safeEqualStrings`, `authorizePut` method on the interface + impl.
- `server-v2/protocol/http/routers/files/index.ts` — `FILES_UPLOAD_SECRET_HEADER`,
  `resolveUploadSecret`, PUT 401 gate.
- `server/routing/core-app.ts` — sweep interval (unref) on singleton creation.

## Tests

- `server-v2/protocol/socket/handlers/files.test.ts` — added 4 tests for
  `prepareFilesOfferForForward` (gateway rewrite returns new packet + no
  mutation; no-op for non-offer; no-op on non-gateway; mock-forward proves the
  rewritten URL is what goes on the wire).
- `server-v2/protocol/http/routers/files/files-http.test.ts` — `setup()` now
  configures `uploadSecret`; all PUTs send `X-CWSP-Files-Upload-Secret`; added
  4 tests: PUT without creds → 401, wrong secret → 401, query-string secret →
  200, re-PUT with valid token (no secret) → 200.

## Verification

```
node --import tsx --test \
  server-v2/files/*.test.ts \
  server-v2/protocol/http/routers/files/*.test.ts \
  server-v2/protocol/socket/handlers/files.test.ts
# → 48 tests, 48 pass, 0 fail

npm run test:gateway
# → 11 tests, 11 pass, 0 fail
```

Lints: clean on all 6 edited files. Import smoke checks for `websocket.ts` and
`coordinator.ts` resolve under tsx.

## Risks / Notes

- PUT now requires a credential in production. Deployments that relied on
  anonymous PUT must set `CWS_FILES_BLOB_UPLOAD_SECRET` (or reuse
  `CWS_FILES_BLOB_SECRET`) and send it on PUT. The blob-store unit tests bypass
  the router (call `store.put` directly) so they are unaffected.
- `prepareFilesOfferForForward` is a no-op for every non-`files:offer` action
  and on non-gateway hosts, so relay behavior for clipboard/airpad/chunks is
  unchanged.
