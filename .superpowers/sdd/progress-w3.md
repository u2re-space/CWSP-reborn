# W3+ SDD Progress Ledger
Branch: feat/cwsp-files-transfer-w3
Base: c6a8751
Plan: docs/superpowers/plans/2026-07-21-cwsp-files-transfer-w3.md

Task 1: complete (commits c6a8751..60b449d, review clean; Int32 fix 60b449d)
Task 2: complete (commits 60b449d..eaa7f60, review Approved; minors: GC disk asserts, hybrid-manual hub test)
Task 3: complete (commits eaa7f60..89f84c2, review Approved; minor: files-prompt RPC deferred)
Task 4: complete (commits 89f84c2..d06493c, review Approved; minor residual: sanitize transferId in landingRoot)
Task 5: complete (commits d06493c..e7051bc, review Approved)
Task 6: complete — Bridge + Cap hybrid offer (commits pending). Cap web
  `src/frontend/web/capacitor/android/web/logic/files-hub.ts` listens to
  `cwspFilesIngress`/`cws:filesIngress` → `decideOfferAfterStage` → pack via
  Java bridge (`files:read-batch` base64; `files:put-blob` stub for large) →
  `buildFilesOfferPacket` → `sendCoordinatorAct("files:offer", ...)`. Java
  `FilesBatchMaterializer` (framework-free) + `FilesIngressJson` added;
  `CwsBridgePlugin` gains `files:list-staged` / `files:read-batch` /
  `files:put-blob` channels. Minimal destination picker UI on
  `needDestinations`; bare `*` rejected unless `allowShareToAll`. Boot calls
  `startFilesHub()`. Pure Java test `FilesBatchMaterializerTest` green.
  Manual adb smoke (Step 3): PENDING device — see task-6-report.md.
Task 6: complete (commits e7051bc..81d558d, review Approved)
Task 7: complete — Integration wire-up + regression gates (no code fixes needed).
  Boot wire-up verified (no edits required):
  - Neutralino Node backend `src/backend/node/{windows,linux}/index.ts` constructs
    `filesHub = createFilesHub(...)` exactly once beside `clipboardHub`, stores it
    on `globalThis.__CWSP_FILES_HUB__`, and does NOT call start() (stub adapters
    only; W4 swaps real WS sender + HTTP PUT). No double-start path.
  - Capacitor contour `src/frontend/web/capacitor/{web,shared}/entry.ts` registers
    the files-hub listener at boot via dynamic `import(.../files-hub).startFilesHub()`
    (best-effort, never fails boot).
  Gate results (all green, run from brief):
  1. `cd src/shared && npm test` → 59/59 pass (duration 161.8ms).
  2. `node --import ./scripts/resolve-aliases.mjs --experimental-strip-types --test
     src/backend/node/shared/neutralino/files-hub.test.ts` → 27/27 pass (199.2ms).
  3. `npm run check:clipboard-backend` → 5/5 pass (121.1ms).
  4. `cd runtime/endpoint && node --import tsx --test server-v2/files/*.test.ts
     server-v2/protocol/http/routers/files/*.test.ts
     server-v2/protocol/socket/handlers/files.test.ts` → 48/48 pass (499.6ms).
  5. `bash scripts/check-java-android-pure.sh` → OK (MergeTest, ClipboardExecutorTest,
     FilesIngressTest, FilesBatchMaterializerTest all OK).
  Pre-existing issues noted (not mass-fixed, not W3 code):
  - `git status` trips on a broken submodule entry `app/windows/--recursive`
    (`.gitmodules` has a literal `--recursive` path). Cosmetic; does not affect gates.
  - `node --import` emits DEP0205 (`module.register()` deprecated) — Node platform
    notice, not a failure.
  No code fixes → no commit. Ledger-only update. Report: .superpowers/sdd/task-7-report.md
Task 7: complete (no code commit; gates 139/139 + java pure OK, review deferred to final)
W3+ final review — 3 Important findings fixed (one commit wave):
  1. Neutralino landing dir: `handleIncomingOffer` now sanitizes
     `offer.transferId` via `sanitizeTransferIdSegment` (basename + UUID-safe
     allowlist + `path.relative` containment) before joining `landingRoot`.
     Canonical id still used as the `incomingOffers` map key. Regression test
     added (`handleIncomingOffer sanitizes malicious transferId ...`).
  2. Android stage GC + Cap cancel/error GC: `FilesIngress.stage` now deletes
     the partial per-transfer dir best-effort on any ok:false after mkdirs
     (new `deleteRecursively(File)` helper). Cap `src/shared/src/files-hub.ts`
     calls a new `files:gc-stage` bridge channel on cancel / picker-dismiss /
     files:error paths (client-side `isSafeTransferId` allowlist before call).
  3. Bridge path containment: `CwsBridgePlugin` adds `isSafeTransferId` /
     `isSafeBasename` / `safeStageDirFor` (canonical `startsWith` under the
     stage root). `files:list-staged` / `files:read-batch` / `files:gc-stage`
     reject unsafe ids and unsafe batch member names; read-batch validates each
     name as a bare filename. Added `import java.io.File` + `java.util.Map`
     (the latter was a latent missing import in `FilesIngress`).
Gates: files-hub.test.ts 28/28 pass; check-java-android-pure.sh OK.
Report: .superpowers/sdd/w3-final-fix-report.md
