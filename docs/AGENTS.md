# CWSP-reborn Documentation Agent Guide

## Read order

1. `../../../plans/INDEX.md`
2. `../../../.progress/CWSP-reborn/STATE.json`
3. `../../../.roadmaps/CWSP-reborn/PASS-I.md` and `PASS-II.md`
4. `../.analysis/architecture.md`
5. `../../../.cursor/rules/network.mdc`

## Pass II evidence baseline (treat as truth)

Verified locally green: topology index builds 4/4; `cwsp-shared` v2 29 tests;
protocol facades 11/11 (`@fest-lib/cwsp-shared` aliases); settings-backend 3/3;
clipboard-backend 5/5; web-backend 9/9; ws-loopback 4/4; adapters smoke 4/4;
java-protocol 24/24; java-backend 3/3; Android pure merge + Gradle JDK17.

Still OPEN (do not claim ready): Capacitor Android APK, full TLS `:8434` boot,
driver readiness/debug relay, desk WebNative package, Robot/AHK/AutoKey.

When editing docs/analysis, mark each claim as **verified** (Pass-II green),
**deferred** (open blocker), or **observed** (inventory only). Remove or
correct any claim that backends/protocol are empty stubs — Java and Node
backends and protocol facades are now filled.

## Documentation contract

- `Specification.md` describes product boundaries and current status.
- `Protocol.md` summarizes current v2 semantics; `network.mdc` remains detailed authority.
- `Drivers.md` describes capability adapters and evidence gates.
- `Extensions.md` describes optional namespaced additions.
- `.analysis/` separates observed repository state from proposals.
- `.roadmaps/` owns future phases and dependencies.

## Writing rules

- Mark facts as observed, planned, verified, blocked, or superseded.
- Never infer readiness from an existing path, class, script, or symlink.
- Keep v1 crypto/encoding research separate from current v2 behavior.
- Preserve the distinction between endpoint URL, direct URL, AirPad target, and destination ID.
- Link to canonical content instead of copying network topology or long protocol sections.
- Do not add unresolved `TODO`, `TBD`, or empty headings.
- Update date, evidence paths, and progress state when a contract changes.

## Security

Do not place passwords, tokens, keys, clipboard data, device logs, or private
access notes in docs, analysis, plans, memory, progress, rules, or examples.
Reference `private/connectivity.md` by path only when private operational data is required.

## Product-code boundary

Documentation work does not authorize changes to Java, TypeScript, Gradle,
Capacitor, WebNative, endpoint, driver, or view behavior.
