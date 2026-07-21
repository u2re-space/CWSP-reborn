### Task 4 Report: Neutralino progress + cancel + incoming stub

**Status:** ✅ Done — TDD (red → green), 26/26 files-hub tests pass.

**Scope (files-hub.ts SoT, hardlinked to generic/ mirror):**
- `reportBytes(transferId, bytesDone, totalBytes)` — feeds the W1 `createFilesProgressTracker`, snapshots `speedBps` / `etaMs` onto `session.progress`, and emits `files:progress` via `buildFilesProgressPacket` throttled to ≤4 Hz with `shouldEmitProgress`. Unknown transferId is a no-op so transport callbacks never throw the hub.
- `cancel` now also drops the per-session progress tracker (no EMA leak across transferId collisions). Existing disk GC hardened with an `access(..., F_OK)` ENOENT assertion.
- Inbound `files:offer` stub — `handleIncomingOffer(packet)`:
  - parses via `parseFilesOfferPayload`; malformed offers dropped silently (no throw into caller / clipboard-hub boundary);
  - `acceptMode: "manual"` (default) → `FilesPromptState` kind `"accept"` (Accept/Decline) with `sender` surfaced;
  - `acceptMode: "auto"` → accepts immediately, no prompt;
  - `acceptIncomingOffer(transferId)` emits `buildFilesAcceptPacket` (destined back to `offer.sender`) then HTTP GETs each `batch.asset.url` via a `getBlob` adapter into `landingRoot/<transferId>/<asset.name>` (default `os.tmpdir()/cwsp-files-in/<transferId>`); on any GET failure emits `files:error`, dismisses the prompt, cleans the half-populated landing dir, and rethrows;
  - `declineIncomingOffer(transferId)` dismisses the prompt and removes the empty landing dir;
  - `getIncomingOffer(transferId)` for UI/tests.
- INVARIANT: the incoming path operates only through files-only adapters (`sendPacket`, `getBlob`); it never touches clipboard-hub. Verified by a dedicated test asserting no non-`files:*` packet is emitted on accept.
- `FilesPromptKind` extended with `"accept"`; `FilesPromptState` gained optional `sender`.
- New options: `acceptMode`, `landingRoot`, `getBlob`. Windows boot (`src/backend/node/windows/index.ts`) needs no change — defaults are safe (manual mode; missing `getBlob` → accept surfaces `files:error`, the documented W3 contract).

**TDD:**
- Step 1: 9 new failing tests added (progress fields, ≤4Hz throttle, unknown-transferId no-op, cancel disk GC, manual prompt, accept GET into landing, GET-failure → files:error, no-clipboard-touch, auto accept, malformed drop).
- Step 2: implemented in `files-hub.ts`.
- Step 3: 26/26 pass. Fixed one test that fed non-integer `bytesDone` (rejected by `parseFilesProgressPayload`).

**Commits:**
- `feat(neutralino): files-hub progress cancel and accept pull` (git -c submodule.recurse=false)

**Tests:**
- `node --import ./scripts/resolve-aliases.mjs --experimental-strip-types --test src/backend/node/shared/neutralino/files-hub.test.ts` → 26/26 pass.
- `npm run check:clipboard-backend` → 5/5 (no clipboard regression).
- `npm run check:protocol-facades` → 11/11.
- `src/shared/test/v2-files.test.ts` → 17/17.

**Concerns / risks:**
- `npm run check:types` fails in this environment due to a pre-existing TypeScript binary platform-resolution issue (`@typescript/typescript-linux-x64` not resolvable) — unrelated to this task; no type errors introduced in edited files (ReadLints clean).
- Progress `batchIndex` is a stub (0) with `batchCount = batchPlan.length`; per-batch granularity lands with the chunk transport (W4).
- `getBlob` is an adapter stub; W4 wires the real HTTP GET (Node fetch / Neutralino adapter) and the WS sender for `files:accept` / `files:progress` / `files:error`.
- Landing dir is not auto-moved into a user-visible folder; desktop has no SAF, so the user moves files out manually (documented in `FilesIncomingOffer` JSDoc).

**Report path:** `apps/CWSP-reborn/.superpowers/sdd/task-4-report.md`
