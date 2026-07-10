# CWSP-reborn Gaps and Risks

- **Observed:** 2026-07-10
- **Purpose:** prevent scaffold, legacy, and proposal state from being mistaken for readiness

## Critical blockers

### Build roots are placeholders

Evidence:

- root Vite, TypeScript, and Gradle files are empty;
- package scripts do not expose Capacitor or WebNative builds;
- platform dependencies are undeclared;
- config and platform scripts are empty/incomplete.

Impact: no CWSP-reborn platform can be promoted beyond E1 without creating and
running a focused build graph.

### Canonical endpoint path is absent

Evidence:

- rules and plans refer to `runtime/cwsp/endpoint`;
- only `runtime/legacy/endpoint` exists in the current workspace.

Impact: server-side v2 behavior cannot be inferred from the intended path. The
legacy tree must be assessed as migration input, not assumed equivalent.

### Symlink integrity is not established

Evidence:

- WebNative/Neutralino shared chains include broken or cyclic targets;
- Linux WebNative projects through a Neutralino path;
- CRX backend points to a missing tree;
- AirPad new input/network targets are incomplete.

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

Java classes, Node entrypoints, scripts, manifests, and config files may exist
with no behavior.

Mitigation: readiness uses evidence levels and an empty-entrypoint check.

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

1. Which first contour: Android Capacitor or Windows WebNative?
2. Is `runtime/legacy/endpoint` migrated, wrapped, or replaced?
3. Which path becomes the canonical shared protocol fixture package?
4. Which AirPad compatibility facade replaces `network-old` and `input-old` imports?
5. What is the authoritative settings schema and persistence ownership?
6. Are debug and developer separate packages and production policies?
7. Which v1 protocol ideas remain research, and what version negotiation is required?

## Validation gaps

No Pass-I product readiness claim currently has:

- a successful CWSP-reborn platform build;
- an APK or desktop package;
- a settings backend round trip;
- a direct/routed/reverse route run;
- a device clipboard run;
- an AirPad pointer run;
- a debug relay run.

These are intentionally left unverified rather than inferred.

## Safe next task

Generate a read-only symlink manifest, select one platform contour, and define
its exact build entrypoints. Do not modify protocol behavior, legacy AirPad code,
and both platform build systems in the same task.
