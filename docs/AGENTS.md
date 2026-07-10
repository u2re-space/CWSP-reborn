# CWSP-reborn Documentation Agent Guide

## Read order

1. `../../../plans/INDEX.md`
2. `../../../.progress/CWSP-reborn/STATE.json`
3. `../../../.roadmaps/CWSP-reborn/PASS-I.md`
4. `../.analysis/architecture.md`
5. `../../../.cursor/rules/network.mdc`

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
