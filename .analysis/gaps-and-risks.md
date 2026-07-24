# CWSP-reborn Gaps and Risks

- **Observed:** 2026-07-10 (Pass II calibration)
- **Purpose:** prevent scaffold, legacy, and proposal state from being mistaken for readiness

## Pass II verified (no longer blockers)

- Shared v2 protocol: `cwsp-shared` v2 29 tests; Node/Web facades 11/11
  (`@fest-lib/cwsp-shared` aliases via `scripts/resolve-aliases.mjs`).
- Node backends: settings 3/3, clipboard 5/5, web/PWA 9/9.
- `/ws` loopback 4/4 with soft-bind `ingress-normalize` preserving destinations.
- Adapter smoke 4/4.
- Java protocol 24/24; Java backend 3/3; Android pure merge OK; Gradle JDK17 OK.
- Topology index builds 4/4 (Cap/WN `index.html`).

## Critical blockers (still open)

### Platform packaging is not produced

Evidence:

- APK assembly is blocked on the Capacitor Android dependency/assets;
- desk WebNative package is not built;
- documented `build:capacitor`, `build:webnative`, and deploy scripts are absent;
- root `vite.config.ts`, `tsconfig.json`, and `build.gradle` are still empty.

Impact: no CWSP-reborn platform can be promoted to E3/E4 (device/route evidence)
without producing and running a focused package build graph.

### Full endpoint TLS `:8434` boot is deferred

Evidence:

- `/ws` loopback and `ingress-normalize` are green, but full Fastify/PM2 TLS boot
  on `:8434` and driver readiness/debug relay are not yet exercised end-to-end.

Impact: server-side v2 behavior is verified at the loopback level only; direct,
proxied, and reverse route runs against a TLS-booted endpoint remain unverified.

### Symlink integrity is not established

Evidence:

- WebNative/Neutralino shared chains include broken or cyclic targets;
- Linux WebNative projects through a Neutralino path;
- CRX backend points to a missing tree;
- AirPad new input/network targets are incomplete;
- `docs/drivers` resolves to the historically misspelled `docs/platforns`
  directory (left in place; see `docs/platforns/README.md`).

Impact: broad link cleanup could remove working compatibility paths or cause
platform builds to consume the wrong source.

## High risks

### Dual protocol narratives

The operational rules describe v2 JSON envelopes and stable action names. The
older product outline proposes fixed alignment, CRC16, new encryption, alternate
encodings, and additional transports.

Mitigation: v2 remains current; future wire work requires explicit versioning
and fixtures.

### Empty stubs look implemented

Pass II filled Java and Node protocol/backends, but OS driver classes (Robot,
AHK, AutoKey, Wayland/X11), packaging scripts, manifests, and config files may
still exist with no behavior.

Mitigation: readiness uses evidence levels and an empty-entrypoint check; a
green `check:*` suite covers only the seam it names.

### Alias fan-out obscures ownership

The same physical view or doc appears through many paths.

Mitigation: edit canonical roots only and record aliases in `plans/INDEX.md`.

### Settings persistence can diverge

Web, Android, and desktop have different storage adapters.

Mitigation: one schema and contribution registry; per-surface round-trip tests;
no hidden-tab value deletion.

### Realtime input replay

Relative movement becomes unsafe if queued and replayed after reconnect.

Mitigation: bounded latest-intent policy, stale expiry, no replay of old relative
deltas, and evidence at both coordinator and executor boundaries.

### Clipboard echo loops

Native and remote clipboard watchers can re-emit applied values.

Mitigation: content/hash deduplication, short suppression window, origin/UUID
tracking, and platform round-trip tests.

## Medium risks

- Debug logging can leak private payloads without redaction.
- Self-signed TLS policies can become silent global insecurity.
- WebNative backend lifetime may be incorrectly tied to the window lifetime.
- Mobile permissions and background restrictions vary by Android version.
- Wayland/X11 driver availability may differ from configured preference.
- Responsive work without rendered baselines can regress touch and focus behavior.

## Decisions required before product implementation

1. Which first contour: Android Capacitor (APK) or Windows WebNative (desk package)?
2. Is `runtime/legacy/endpoint` migrated, wrapped, or replaced for full TLS boot?
3. ~~Which path becomes the canonical shared protocol fixture package?~~ Resolved:
   `modules/projects/cwsp-shared` (`@fest-lib/cwsp-shared` v2) is the SoT.
4. Which AirPad compatibility facade replaces `network-old` and `input-old` imports?
5. What is the authoritative settings schema and persistence ownership?
6. Are debug and developer separate packages and production policies?
7. Which v1 protocol ideas remain research, and what version negotiation is required?

## Validation gaps

Pass II closed these locally: shared v2 protocol fixtures, protocol facades,
settings/clipboard/web backend seams, `/ws` loopback, adapter smoke, Java
protocol/backend, and topology index builds.

Still open (do not infer):

- a successful CWSP-reborn APK and desk WebNative package;
- full endpoint TLS `:8434` boot and driver readiness/debug relay;
- a direct/routed/reverse route run against a TLS-booted endpoint;
- a device clipboard run;
- an AirPad pointer run to `.110`;
- OS input driver execution (Robot/AHK/AutoKey).

These are intentionally left unverified rather than inferred.

## Safe next task

Generate a read-only symlink manifest, select one platform contour, and define
its exact build entrypoints. Do not modify protocol behavior, legacy AirPad code,
and both platform build systems in the same task.
