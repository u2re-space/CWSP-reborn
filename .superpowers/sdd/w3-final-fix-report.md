# W3+ Final Review — Fix Report

Branch: `feat/cwsp-files-transfer-w3`
Scope: `apps/CWSP-reborn` — Neutralino files-hub, Android `FilesIngress`, Capacitor files-hub, `CwsBridgePlugin`.

## Status

All three Important findings from the final W3+ review are fixed and covered by
the project gates. One commit wave.

## Important 1 — Sanitize transferId for landingDir (Neutralino)

**Root cause:** `handleIncomingOffer` joined `landingRoot` + `offer.transferId`
directly. `offer.transferId` is remote-supplied and the shared parser
(`parseFilesOfferPayload`) only requires it to be a non-empty string — no
charset validation. A malicious peer could ship `../../etc/evil` and the
landing dir would resolve outside `landingRoot`.

**Fix:** Added `sanitizeTransferIdSegment(raw, fallback)` in
`src/backend/node/shared/neutralino/files-hub.ts`:
- `path.basename` strips every directory component;
- UUID-safe allowlist (`/^[A-Za-z0-9._-]+$/`) rejects anything else, falling
  back to a fresh local UUID;
- defense-in-depth `path.relative` containment check drops the offer silently
  if the resolved landing dir still escapes `landingRoot`.

The canonical `offer.transferId` is still used as the `incomingOffers` map key
(routing / accept / decline), so only the on-disk landing path is sanitized.

**Test:** added `handleIncomingOffer sanitizes malicious transferId so
landingDir stays under landingRoot` — sends `transferId: "../../etc/evil"`,
accepts, and asserts the file lands under `<landingRoot>/evil` and that
`<root>/etc/evil` is never created.

## Important 2 — GC Temp on Android stage failure + Cap cancel/error

**Root cause (Android):** `FilesIngress.stage` returned `ok:false` on copy /
limit / exception failures but never deleted the partial per-transfer dir it
had just created, leaving a half-populated stage under
`files/outgoing/<transferId>/`.

**Fix (Android):** Refactored `stage()` to collect a `failure` result and, on
any non-null failure after `mkdirs`, call `deleteRecursively(stageRoot)`
best-effort before returning. Added `public static boolean
deleteRecursively(File)` (recursive, null-safe) reused by the bridge GC
channel. The envelope still carries `stageDir` for diagnostics, but
`env.ok === false` so the Cap hub never reads it.

**Root cause (Cap):** `src/shared/src/files-hub.ts` dropped the session from
the map on cancel / picker-dismiss / `files:error` but never asked Java to
delete the staged Temp, leaking it.

**Fix (Cap):** Added `gcStage(transferId)` which calls the new
`files:gc-stage` bridge channel after validating `transferId` client-side via
`isSafeTransferId` (UUID-safe, no `..`). Wired into:
- picker Cancel button,
- `offer()` `firstError` path (broken offer),
- `handleIngress()` `!env.ok` path (stage failure — Java already GC'd, but
  the call is idempotent and covers a Java-side GC miss).

## Important 3 — Bridge path containment

**Root cause:** `CwsBridgePlugin` `files:list-staged` / `files:read-batch`
resolved the stage dir via `FilesIngress.stageDirFor(ctx, transferId)` =
`new File(getFilesDir(), "files/outgoing/" + transferId)` with no validation.
A malicious WebView call with `transferId: "../..` could traverse out of the
stage root, and `files:read-batch` `names` were passed straight to the
materializer which reads `new File(stageDir, name)`.

**Fix:** Added in `CwsBridgePlugin.java`:
- `isSafeTransferId(String)` — UUID-safe charset, rejects `.`/`..`/`..`-containing;
- `isSafeBasename(String)` — no separators, no `..` (guards materializer reads);
- `safeStageDirFor(String)` — resolves the stage dir and requires its
  **canonical** path to equal or start with the canonical stage root
  (`getFilesDir()/files/outgoing`); returns `null` on escape.

`files:list-staged` and `files:read-batch` now reject unsafe transferIds and,
for read-batch, unsafe batch member names, before any file read. The new
`files:gc-stage` channel uses the same `safeStageDirFor` before deleting.

Also added `import java.io.File` to `CwsBridgePlugin.java` and the latent
missing `import java.util.Map` to `FilesIngress.java` (the latter was already
required by the pre-existing `FilesIngressJson.build` call site).

## Changed files

- `src/backend/node/shared/neutralino/files-hub.ts` —
  `sanitizeTransferIdSegment` + containment in `handleIncomingOffer`; header
  note.
- `src/backend/node/shared/neutralino/files-hub.test.ts` — new regression test
  for malicious transferId landing escape.
- `src/backend/java/android/emission/FilesIngress.java` — `stage()` GC on
  failure; `deleteRecursively(File)`; `import java.util.Map`; header note.
- `src/shared/src/files-hub.ts` (Capacitor) — `gcStage` / `isSafeTransferId`;
  wired into cancel / dismiss / error paths; header note.
- `src/backend/java/space/u2re/cwsp/CwsBridgePlugin.java` — `files:gc-stage`
  channel; `isSafeTransferId` / `isSafeBasename` / `safeStageDirFor`;
  `files:list-staged` / `files:read-batch` hardened; `import java.io.File`;
  header note.
- `.superpowers/sdd/progress-w3.md` — ledger appended.

## Tests

```
node --import ./scripts/resolve-aliases.mjs --experimental-strip-types --test \
  src/backend/node/shared/neutralino/files-hub.test.ts
# → tests 28, pass 28, fail 0  (was 27; +1 malicious-transferId regression)

bash scripts/check-java-android-pure.sh
# → MergeTest OK, ClipboardExecutorTest OK, FilesIngressTest OK,
#   FilesBatchMaterializerTest OK, Pure Java android check: OK
```

The Android-dependent `FilesIngress.java` and `CwsBridgePlugin.java` were
additionally compiled against `android.jar` (android-36) + the Capacitor
`capacitor-android` classes jar + androidx core to confirm the edits are
syntactically and type-correct (the project's pure gate intentionally skips
these because they import `android.*`).

## Risks / Notes

- `files:gc-stage` is best-effort; bridge errors are swallowed so a GC miss
  never throws the hub. The Java side also GC's on stage failure, so the Cap
  call is defense-in-depth.
- The `import java.util.Map` addition to `FilesIngress.java` fixes a latent
  missing import that would otherwise block bare-javac compilation; the
  Android gradle build already resolves `Map` so this is a no-op there.
- transferId sanitization only affects the on-disk landing path; the canonical
  id still flows in `files:accept` / routing so receiver-side correlation is
  unchanged for well-formed (UUID) ids. A malicious id that sanitizes to a
  fresh local UUID simply lands in an opaque subdir.
