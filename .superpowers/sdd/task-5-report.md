# Task 5 — Android manifest Open-with + Temp stage

**Branch:** `feat/cwsp-files-transfer-w3`
**Commit subject:** `feat(android): open-with stages files to app Temp for files-hub`

## What changed

| File | Change |
|---|---|
| `app/android/AndroidManifest.xml` | Added `VIEW` (DEFAULT+BROWSABLE) + `SEND` + `SEND_MULTIPLE` `*/*` intent-filters on existing `ShareActivity` (Amendment A2). Header timestamp + reason updated. |
| `src/backend/java/android/emission/FilesStageLimits.java` (new) | Pure, framework-free stage-limit policy: `MAX_COUNT=64`, `MAX_BYTES=512*1024*1024`. `check(int,long)` + `check(List<Number>)` returning `{ok,reason,count,totalBytes}`. `COMPAT` comment keeps it in sync with `cwsp-shared/src/v2/files-constants.ts`. No `android.*` imports so `javac` can compile it without the SDK. |
| `src/backend/java/android/emission/FilesIngress.java` (new) | Staging helper: `collectStreamUris(Intent)` (EXTRA_STREAM single/list + ClipData + VIEW data, de-dup, order-stable), `stage(Context,List<Uri>,source)` → `getFilesDir()/files/outgoing/<transferId>/`, per-file copy via `ContentResolver.openInputStream`, incremental cap enforcement, single-file MAX_BYTES abort, `sanitizeName` (path-traversal defang), `toIngressJson(StageResult)` envelope `{transferId,source,stageDir,ok,reason?,files:[{name,size,path}]}`. Source constants `open-with` / `share-target`. |
| `src/backend/java/android/emission/ShareTarget.java` | New `isFilesIngressIntent(action,type)` predicate + `stageFilesIngress(...)` branch at the top of `handleIntent`. `text/*` and `image/*` keep the legacy clipboard path; everything else (VIEW, or SEND/SEND_MULTIPLE of non-text/non-image) stages to Temp and calls `CwsBridgePlugin.emitFilesIngress(json)`. **Never** calls `clipboard.writeAsset` for the staging branch. Header note appended. |
| `src/backend/java/space/u2re/cwsp/CwsBridgePlugin.java` | New `static emitFilesIngress(JSONObject)` — `notifyListeners("cwspFilesIngress", {ingress})` + `triggerWindowJSEvent("cws:filesIngress", …)` best-effort. Minimal stub; full Cap listener is Task 6. Header note appended. |
| `test/java/android/emission/FilesIngressTest.java` (new) | Pure Java test for `FilesStageLimits`: under-limit ok, count-over, bytes-over, empty ok, negative-coerced, large-file (3 GiB) no Int32 wrap. Documents the expected `am start` smoke in the header. |
| `scripts/check-java-android-pure.sh` | Compiles + runs `emission.FilesIngressTest` alongside `MergeTest` and `ClipboardExecutorTest`. |

## Compile / tests

- `bash scripts/check-java-android-pure.sh` → **OK** (Merge + ClipboardExecutor + FilesIngress all pass).
- `JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 ./gradlew assembleDebug` (cwd `app/android`) → **BUILD SUCCESSFUL**, APK emitted to `build/capacitor/apk/debug/cwsp-debug.apk`.
  - Note: JDK 17 fails on `:capacitor-android:compileDebugJavaWithJavac` (`invalid source release: 21`) because `@capacitor/android 8.4.x` compiles as Java 21; JDK 21 is required. The cwsp-reborn-pass skill's "JDK 17 only" note predates the Capacitor 8.4 upgrade.
- ReadLints: no errors on any edited file.

## Behavior matrix

| Intent | MIME | Path |
|---|---|---|
| `SEND` / `SEND_MULTIPLE` | `text/plain` (and `text/*`) | Legacy clipboard text (unchanged) |
| `SEND` / `SEND_MULTIPLE` | `image/*` | Legacy clipboard asset (unchanged, small image) |
| `VIEW` | any | **Stage → Temp → `cwspFilesIngress`** (`source=open-with`) |
| `SEND` / `SEND_MULTIPLE` | non-text/non-image (e.g. `application/octet-stream`, `video/*`, `audio/*`, `application/pdf`) | **Stage → Temp → `cwspFilesIngress`** (`source=share-target`) |

## Manual smoke (not executed — no device in this run)

```bash
adb shell am start -a android.intent.action.SEND -t application/octet-stream \
  --eu android.intent.extra.STREAM file:///sdcard/Download/test.bin \
  -n space.u2re.cwsp/.ShareActivity
# Expect: Temp under files/outgoing/<transferId>; logcat "FilesIngress stage ok";
#         cwspFilesIngress event to WebView; no clipboard.writeAsset call.
```

## Concerns / risks

- **No device smoke** run in this pass; `am start` path is documented in the test header and above for Task 6 to execute.
- **Task 6 dependency:** `emitFilesIngress` only fires the bridge event; the Capacitor `cwspFilesIngress` listener + `decideOfferAfterStage` → pack → `files:offer` is Task 6. Until then staged files sit in Temp unoffered.
- **Stage cleanup:** no GC sweep of `files/outgoing/<transferId>/` is implemented here; Task 6 / hub lifecycle owns cleanup after offer/done/cancel.
- **VIEW `*/*` is broad** — it makes CWSP a candidate open-with target for every MIME. Intentional per Amendment A2, but UX depends on Task 6 destination picker.
- **JDK 21** is now the required toolchain for `./gradlew assembleDebug` (Capacitor 8.4 sourceCompat 21). Skill ledger should be updated.

## Next exact action

Task 6: subscribe to `cwspFilesIngress` in `src/frontend/web/capacitor/android/web/logic/files-hub.ts`, run shared `decideOfferAfterStage`, pack via bridge (`filesListStaged` / `filesReadBatch` / `filesPutBlob`), and emit `files:offer` over the existing Cap WS path.

---

# Task 5 follow-up — VIEW always stages; unique staged names

**Branch:** `feat/cwsp-files-transfer-w3`
**Commit subject:** `fix(android): VIEW always stages; unique staged names`

## Important findings addressed

1. **`ACTION_VIEW` must always stage.** Previously `ShareTarget.isFilesIngressIntent`
   carved `text/*` and `image/*` out of the staging branch for *all* actions, so a
   `VIEW` intent with `text/plain` or `image/*` fell through to the legacy clipboard
   path instead of the files-hub ingress path. Fix: the text/image carve-out now
   applies only to `SEND` / `SEND_MULTIPLE`; `ACTION_VIEW` always returns `true` from
   the predicate and stages with `source=open-with`, regardless of MIME. This aligns
   the code with the behavior matrix already documented above (VIEW | any | Stage).
2. **Unique staged filenames on collision.** Previously `FilesIngress.sanitizeName`
   only disambiguated the literal basename `file` (and empty names) by `index`; two
   URIs reporting the same real display name (e.g. two `photo.jpg` from different
   providers) would overwrite each other under `stageDir`. Fix: extracted a pure,
   framework-free `FilesStageNames.uniqueBasename(used, desired)` helper that mirrors
   the Neutralino hub `uniqueBasename()` — first collision appends `-1` before the
   extension (`photo.jpg` → `photo-1.jpg` → `photo-2.jpg`), case-insensitive on the
   reserved set (Android storage is case-insensitive). `FilesIngress.stage` now
   threads a `LinkedHashSet<String>` of reserved names through the copy loop.

## What changed

| File | Change |
|---|---|
| `src/backend/java/android/emission/FilesStageNames.java` (new) | Pure, framework-free (no `android.*` imports) stage-name helper: `sanitize(name)` (path-traversal defang) + `uniqueBasename(used, desired)` (collision `-N` suffix before extension, case-insensitive reservation). Mirrors `uniqueBasename()` in `src/backend/node/shared/neutralino/files-hub.ts`. |
| `src/backend/java/android/emission/FilesIngress.java` | `stage()` now reserves basenames via `FilesStageNames.uniqueBasename(usedNames, displayName)` so duplicate display names no longer overwrite. Old `sanitizeName(name,index)` kept as a thin wrapper over `FilesStageNames.sanitize` for any external callers. Header timestamp + reason updated; INVARIANT note clarified (text/image clipboard carve-out is SEND-only). |
| `src/backend/java/android/emission/ShareTarget.java` | `isFilesIngressIntent(action,type)`: `ACTION_VIEW` now always returns `true` (stages any MIME); `text/*` / `image/*` carve-out applies only to `SEND` / `SEND_MULTIPLE`. Header + `handleIntent` comment updated. |
| `test/java/android/emission/FilesIngressTest.java` | Added `FilesStageNames` unit tests: no-collision pass-through, collision suffix (`photo.jpg` → `photo-1.jpg` → `photo-2.jpg`), no-extension names, path-traversal sanitization, case-insensitive reservation. |
| `scripts/check-java-android-pure.sh` | Compiles + runs the new `FilesStageNames` helper alongside `FilesStageLimits` / `FilesIngressTest`. |

Mirror copies under `app/android/...`, `app/shared/...`, `app/src/...` resolve to the
canonical `src/backend/java/android/emission/` files via symlinks/hardlinks, so they
are updated automatically; only the `src/` paths are git-tracked.

## Compile / tests

- `bash scripts/check-java-android-pure.sh` → **OK**
  - `core.MergeTest` OK
  - `executor.ClipboardExecutorTest` OK
  - `emission.FilesIngressTest` OK (6 prior `FilesStageLimits` assertions + 6 new `FilesStageNames` assertions)
- Pure `javac` of `FilesStageNames` + `FilesIngressTest` succeeds without the Android SDK (no `android.*` imports in the helper).

## Behavior matrix (revised)

| Intent | MIME | Path |
|---|---|---|
| `SEND` / `SEND_MULTIPLE` | `text/*` | Legacy clipboard text (unchanged) |
| `SEND` / `SEND_MULTIPLE` | `image/*` | Legacy clipboard asset (unchanged, small image) |
| `VIEW` | **any** (incl. `text/*`, `image/*`) | **Stage → Temp → `cwspFilesIngress`** (`source=open-with`) |
| `SEND` / `SEND_MULTIPLE` | non-text/non-image | **Stage → Temp → `cwspFilesIngress`** (`source=share-target`) |

## Risks / notes

- No device smoke run in this pass; the `am start -a android.intent.action.VIEW -t text/plain …` and duplicate-name SEND_MULTIPLE paths are documented for Task 6 to execute.
- `FilesStageNames.uniqueBasename` is case-insensitive on the reserved set; the on-disk name preserves original casing. This matches Android storage semantics but differs slightly from the TS hub (case-sensitive) — intentional for Android safety.
- Stage cleanup still owned by Task 6 / hub lifecycle.
