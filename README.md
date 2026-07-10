# CWSP-reborn

Cross-platform CWSP shell and adapter project for Android Capacitor and
Windows/Linux WebNative.

## Current status

Pass I is a preparation baseline. Shared AirPad, Network, Settings, transport,
and bridge modules exist elsewhere in the workspace, while this project's
platform build files, backends, protocol ports, config, and scripts are still
scaffold-level. No platform is currently declared build-ready from this package.

## Architecture

- `src/` — intended canonical project source.
- `app/` — platform projections and packaging roots.
- `docs/` — product specification, protocol, drivers, and extensions.
- `.analysis/` — dated repository-state analysis.
- `config/` — documented configuration boundary; runtime files are not yet authoritative.
- `build/` / `dist` — generated output only.

Shared view implementations are consumed from `modules/views`.

## Platform intent

- Android: Capacitor frontend with minimal, network, AirPad, and settings views;
  Java/native backend and bridge.
- Windows/Linux: WebNative frontend with minimal, network, and settings views;
  Node backend with platform driver adapters.

## Navigation

- Product specification: [`docs/Specification.md`](docs/Specification.md)
- Protocol: [`docs/Protocol.md`](docs/Protocol.md)
- Drivers: [`docs/Drivers.md`](docs/Drivers.md)
- Extensions: [`docs/Extensions.md`](docs/Extensions.md)
- Architecture analysis: [`.analysis/architecture.md`](.analysis/architecture.md)
- Views/design analysis: [`.analysis/views-and-design.md`](.analysis/views-and-design.md)
- Protocol/driver analysis: [`.analysis/protocol-and-drivers.md`](.analysis/protocol-and-drivers.md)
- Risks: [`.analysis/gaps-and-risks.md`](.analysis/gaps-and-risks.md)
- Pass-I plan: [`../../plans/CWSP-reborn-Pass-I.md`](../../plans/CWSP-reborn-Pass-I.md)
- Roadmap: [`../../.roadmaps/CWSP-reborn/PASS-I.md`](../../.roadmaps/CWSP-reborn/PASS-I.md)
- Resume state: [`../../.progress/CWSP-reborn/STATE.json`](../../.progress/CWSP-reborn/STATE.json)

## Commands

The package currently exposes generic `dev`, `build`, and `preview` Vite
commands. Root Vite/TypeScript configuration is incomplete, so these commands
are not readiness checks yet. Target commands `build:capacitor` and
`build:webnative` are roadmap items.
