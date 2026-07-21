# Task 6: Bridge + Cap hybrid offer — Report

Branch: `feat/cwsp-files-transfer-w3`
Date: 2026-07-21

## What was found

- Task 5 already stages Open-with / share-target streams into app-private Temp
  (`getFilesDir()/files/outgoing/<transferId>`) and emits `cwspFilesIngress`
  via `CwsBridgePlugin.emitFilesIngress(JSONObject)` (also triggers the
  `cws:filesIngress` window event).
- Shared W1 policy (`decideOfferAfterStage`, `planFilesBatches`,
  `buildFilesOfferPacket`) and constants (`SMALL_FILE_MAX`,
  `OFFER_TTL_MS_DEFAULT`, `FILES_PURPOSE`, `FILES_WHAT_ERROR`) are available
  from `@fest-lib/cwsp-shared/v2/index.ts`.
- Existing Capacitor WS send path: `sendCoordinatorAct(what, payload, nodes)`
  in `shared/transport/websocket` — used by `boot/capacitor-share-intent.ts`
  for clipboard fan-out. `coordinatorWirePayload` passes `files:offer`
  through unchanged (not an annotated input command).
- Native invoke path: `invokeCwsNative(channel, payload)` in
  `com/routing/native/cws-bridge` dispatches to `CwsBridgePlugin.dispatch`.
- The pure Java test harness (`scripts/check-java-android-pure.sh`) compiles
  only framework-free sources (no `android.*`, no `org.json` — `org.json` is
  provided by `android.jar`, absent from the pure classpath). `FilesIngress`
  itself imports `android.content.*` so it cannot be pure-tested directly.

## What was changed

### Java (backend)

- **Created** `src/backend/java/android/emission/FilesBatchMaterializer.java`
  — framework-free pack helper: `materializeBatch(stageDir, kind, names)`
  producing zip (multi-file small), gzip with compress-downgrade-to-raw
  (savings < `COMPRESS_WORTHWHILE`), or raw bytes; returns bytes + effective
  kind + ext + mimeType + SHA-256 hash. Also `putBlobStub(transferId, batchId)`
  returning `{ok:false, error:CWSP_FILES_PUT_BLOB_UNAVAILABLE}` so callers
  branch honestly until a blob server lands.
- **Created** `src/backend/java/android/emission/FilesIngressJson.java`
  — framework-free builder returning the ingress envelope as a JDK
  `Map<String,Object>` (shape: `transferId, source, stageDir, ok, reason?,
  files:[{name,size,path}]`) so the payload contract is unit-testable without
  `org.json`/SDK.
- **Modified** `src/backend/java/android/emission/FilesIngress.java`
  — `toIngressJson()` now delegates the shape to `FilesIngressJson.build` and
  wraps the Map into a `JSONObject` for `emitFilesIngress`. Added
  `listStaged(stageDir)`, `stageDirFor(context, transferId)`,
  `materializeBatch(...)`, and `putBlobStub(...)` delegates for the bridge.
- **Modified** `src/backend/java/space/u2re/cwsp/CwsBridgePlugin.java`
  — three new dispatch channels:
  - `files:list-staged` → `{files:[{name,size,path}], stageDir}`
  - `files:read-batch` → materializes one batch (zip/gzip/raw) and returns
    base64 `data` + `hash` + `size` + `mimeType` + effective `kind` + `ext`
  - `files:put-blob` → documented stub (HTTP PUT not wired in W3)

### Capacitor web (frontend)

- **Created** `src/frontend/web/capacitor/android/web/logic/files-hub.ts`
  — `startFilesHub()` (idempotent) subscribes to the `cws:filesIngress`
  window event and the Capacitor `cwspFilesIngress` plugin event. Flow:
  1. validate ingress envelope (`source` + `transferId` + `files[]`); drop
     if missing; emit `files:error` if `ok=false`.
  2. `planFilesBatches` from staged file sizes; `decideOfferAfterStage`.
  3. `readyToOffer` + non-empty destinations (wildcards filtered unless
     `allowShareToAll`) → pack via `files:read-batch` (base64 embed for
     `size <= SMALL_FILE_MAX`; `files:put-blob` for larger, falling back to
     `files:error` on the W3 stub) → `buildFilesOfferPacket` →
     `sendCoordinatorAct("files:offer", packet.payload, destinations)`.
  4. `needDestinations` (or wildcard-only default) → minimal destination
     picker overlay (text field seeded by default destinations + Confirm).
- **Modified** `src/frontend/web/capacitor/android/web/minimal/index.ts`
  — `mount()` now calls `startFilesHub()` (dynamic import, best-effort).

### Tests / harness

- **Created** `test/java/android/emission/FilesBatchMaterializerTest.java`
  — pure (framework-free) assertions: zip round-trip (entries present + hash),
  raw bytes, compress-downgrade-to-raw on high-entropy input,
  `FilesIngressJson.build` shape (`transferId` + `source` + `files[]`),
  and `putBlobStub` failure.
- **Modified** `scripts/check-java-android-pure.sh` — compiles + runs the new
  materializer + JSON sources and the new test.

## Why

- One canonical pack policy (W1 `planFilesBatches`) computed in JS; Java only
  executes (zip/gzip/raw) so the contract stays isomorphic with the
  Neutralino hub. Framework-free `FilesBatchMaterializer` / `FilesIngressJson`
  keep the contract testable without the Android SDK.
- Reusing `sendCoordinatorAct` (the existing Capacitor WS path) keeps
  clientId/token/route metadata attached by the shared transport instead of
  duplicating a sender. `buildFilesOfferPacket` validates + canonicalizes the
  payload before send.
- Bare `*` / `all` / `broadcast` destinations are rejected by default unless
  `cwsp.allowShareToAll` is set — mirrors the Neutralino hub and prevents
  accidental fleet-wide file offers.
- A broken offer (large batch with no PUT) never reaches the wire: the hub
  emits `files:error` and drops the session.

## How it was validated

- `bash scripts/check-java-android-pure.sh` → all four test classes pass
  (`MergeTest`, `ClipboardExecutorTest`, `FilesIngressTest`,
  `FilesBatchMaterializerTest`).
- `esbuild` syntax check on `logic/files-hub.ts` and `minimal/index.ts` → OK.
- Full `tsc --noEmit` could NOT be run in this environment (TypeScript
  platform package `@typescript/typescript-linux-x64` missing on host); the
  Android Gradle build is the authoritative type check and was not run here.

## Compatibility matrix

| Path | Status |
|---|---|
| Open-with / share-target → staged → `files:offer` (small batch, base64) | Implemented |
| Open-with / share-target → `files:offer` (large batch) | `files:error` (PUT stub) — documented |
| Clipboard / picker source → destination picker UI | Implemented |
| Bare `*` destination | Rejected unless `allowShareToAll` |
| `files:list-staged` / `files:read-batch` / `files:put-blob` bridge | Implemented (put-blob stub) |

## Manual smoke (Step 3) — PENDING device

Not executed in this environment (no connected Android device / ADB). To run:

```text
adb shell am start -a android.intent.action.SEND -t application/octet-stream \
  --eu android.intent.extra.STREAM file:///sdcard/Download/test.bin \
  -n space.u2re.cwsp/.ShareActivity
# Expect: Temp under files/outgoing/<transferId>; logcat FilesIngress stage ok;
# cwspFilesIngress event to WebView; files:offer (or picker) in logcat.
```

## Risks / unresolved

- HTTP PUT blob endpoint (`/files/blob/<transferId>/<batchId>`) is not wired;
  large batches emit `files:error` until a blob server lands (Wave 4+).
- `files:chunk` streaming over OkHttp WS (brief alternative for ≤16 MiB
  batches) was not implemented; base64 embed handles small batches and the
  picker/offer path is exercised. Chunk streaming can be layered on the same
  bridge without changing the hub contract.
- Full `tsc` + Android Gradle build not run here; verify on a host with the
  TypeScript platform package and the Android SDK before release.
- Destination picker is a minimal DOM overlay (no i18n / theming); sufficient
  for the W3 hybrid-offer contract, not final UX.

## Files

- `src/backend/java/android/emission/FilesBatchMaterializer.java` (new)
- `src/backend/java/android/emission/FilesIngressJson.java` (new)
- `src/backend/java/android/emission/FilesIngress.java` (modified)
- `src/backend/java/space/u2re/cwsp/CwsBridgePlugin.java` (modified)
- `src/frontend/web/capacitor/android/web/logic/files-hub.ts` (new)
- `src/frontend/web/capacitor/android/web/minimal/index.ts` (modified)
- `test/java/android/emission/FilesBatchMaterializerTest.java` (new)
- `scripts/check-java-android-pure.sh` (modified)
- `.superpowers/sdd/progress-w3.md` (updated)

---

## Task 6 — Important finding follow-up (read-batch failure handling)

Date: 2026-07-21 (follow-up)
Commit: `fix(capacitor): emit files:error on read-batch failure`

### What was found

In `src/shared/src/files-hub.ts` (hardlinked into the Capacitor frontend logic
tree), the `offer()` loop accepted the `files:read-batch` echo without
validating it. A failed read-batch could produce a batch asset with an empty
`hash` or empty `data` (while `size > 0`), which would then be packed into a
`files:offer` and sent on the wire — a broken offer. The ingress handler
rejections were also swallowed by empty `.catch(() => {})` blocks with no
`files:error` emit.

### What was changed

- `offer()` now validates each `files:read-batch` echo:
  - `echo.ok !== true` → `firstError = echo.error || "CWSP_FILES_READ_BATCH_FAILED"`, skip batch.
  - missing `hash` → `firstError = "CWSP_FILES_READ_BATCH_MISSING_HASH"`, skip batch.
  - small batch (`size <= SMALL_FILE_MAX`) with `size > 0` and empty `data` → `firstError = "CWSP_FILES_READ_BATCH_EMPTY_DATA"`, skip batch.
  - Any `firstError` aborts the offer: `emitFilesError(...)` is sent and the
    session is dropped — no `files:offer` reaches the wire.
- `startFilesHub()` ingress listeners (both the `cws:filesIngress` window
  event and the Capacitor `cwspFilesIngress` plugin listener) now emit
  `files:error` on handler rejection instead of swallowing with an empty
  `.catch(() => {})`. The catch surfaces `envelope.transferId`/`envelope.source`
  when available.
- Optional: `FilesIngressEnvelope` now accepts `defaultDestinations?: string[]`;
  when present and non-empty, the destination picker is pre-seeded with them
  (assigned conditionally to respect `exactOptionalPropertyTypes`).
- Header block comment updated (timestamp + reason) per workspace rule.

### Why

- A broken `files:offer` (asset with no hash / no bytes) is worse than no
  offer: receivers would stage a session they can never complete. Emitting
  `files:error` lets the receiver tear down cleanly and matches the
  Neutralino hub contract.
- Swallowing ingress errors silently hid bridge failures from operators and
  from the receiving peer; surfacing them as `files:error` keeps the
  transfer session lifecycle observable.

### How it was validated

- `npx -y -p typescript@5.5 tsc --noEmit -p src/shared/tsconfig.json`:
  no new errors introduced by the edited regions. The only `files-hub.ts`
  diagnostics are pre-existing `Cannot find name 'document'` lines in the
  untouched `showDestinationPicker` DOM code (the shared tsconfig `lib`
  is `ES2022` without `dom`; the file is authoritatively typechecked by the
  Capacitor frontend tsconfig which includes DOM). Pre-existing errors in
  `src/v2/files.ts`, `src/wire-target-id.ts`, and tests are unrelated.
- Lints (ReadLints) on the edited file: clean.

### Risks / unresolved

- The `document` errors in the shared-package typecheck are pre-existing and
  structural (a Capacitor frontend file is hardlinked into the
  `@fest-lib/cwsp-shared` package `src/`). Not addressed here — out of scope.
- Full Capacitor frontend `tsc` + Android Gradle build not run in this
  environment; verify on a host with the TypeScript platform package and
  the Android SDK before release.
- `defaultDestinations` seeding is only exercised when the Java bridge
  populates it; current `FilesIngressJson.build` does not set it, so the
  picker remains unseeded until the bridge opts in.

### Files (follow-up)

- `src/shared/src/files-hub.ts` (modified — canonical hardlink; covers
  `src/frontend/web/capacitor/android/.../files-hub.ts` and `app/...` aliases)
