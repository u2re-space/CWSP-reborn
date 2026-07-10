# CWSP-reborn Product Specification

- **Updated:** 2026-07-10
- **Status:** Pass-I architecture baseline
- **Implementation readiness:** scaffold and shared-module reuse; platform builds unverified

## Product goal

CWSP-reborn is a shared frontend and platform-adapter product for:

- Android through Capacitor plus Java/native services;
- Windows and Linux through WebNative plus Node services;
- compatible PWA/CRX surfaces where their capabilities apply.

It connects users and devices through the CWSP v2 network contract while
keeping UI, protocol semantics, platform persistence, and OS drivers separate.

## Architecture

```text
minimal shell
  -> network / settings / airpad views
  -> shared settings and coordinator contracts
  -> platform bridge
     -> Android Java/native
     -> Windows/Linux Node/WebNative
     -> browser/PWA
  -> endpoint/gateway
  -> local executor or routed peer
```

Canonical source is intended under `src/`. `app/` exposes platform projections.
Shared views remain canonical in `modules/views`.

## Frontend surfaces

### Android

- minimal shell;
- network;
- AirPad;
- settings;
- native permission, clipboard, settings, background, and diagnostics bridge.

### Windows and Linux

- minimal shell;
- network;
- settings;
- Node backend lifecycle and portable configuration.

AirPad is not part of current desktop parity.

### Debug and developer

Debug is an observational log/trace surface. Developer is an opt-in protocol and
capability inspection surface. Their current packages are scaffolds and are not
registered product views.

## Backend surfaces

### Android Java

Owns native preferences/config, permissions, clipboard/background behavior,
native coordinator lifecycle, and Android diagnostics.

### Desktop Node

Owns portable config, local process lifecycle, desktop clipboard/input
capabilities, endpoint integration, and diagnostics.

### Endpoint

Owns `/ws`, packet normalization, identity and route resolution, relay,
compatibility transports, and invocation of local drivers.

The intended canonical endpoint path is absent in the current workspace; the
legacy endpoint is migration input until validated.

## Protocol

Current packet semantics are CWSP v2 and are documented in `Protocol.md` and
`.cursor/rules/network.mdc`.

Required invariants:

- canonical `op` and stable `what`;
- UUID/timestamp correlation;
- logical sender and destination identity;
- endpoint URL and destination ID remain distinct;
- compatibility wrappers normalize at boundaries;
- stale and duplicate actions are bounded;
- transport metadata does not redefine message meaning.

## Drivers

Drivers implement capabilities behind the protocol:

- WebSocket and local bridge;
- pointer and keyboard;
- text and DataAsset clipboard;
- settings persistence;
- permissions and accessibility;
- debug and platform logs.

See `Drivers.md`. A stub or path is not an available driver.

## Settings

Every view or platform contribution registers through one settings system.

Settings layers:

1. schema and safe defaults;
2. persisted user values;
3. platform/native values;
4. endpoint policy;
5. environment overrides;
6. private secrets outside public config.

Surface-specific sync uses `settings:get` and `settings:patch`. Hidden or
unsupported UI sections must not delete persisted values.

## Extensions

Extensions are namespaced, versioned, optional by default, and unable to change
core routing semantics. See `Extensions.md`.

## Build outputs

Target commands:

- `npm run build:capacitor`
- `npm run build:webnative`

Target outputs:

- frontend bundles under `dist/<category>/`;
- platform/package outputs under `build/<category>/`.

These commands and complete build graphs do not yet exist in the CWSP-reborn
package. They are roadmap targets, not current instructions.

## Configuration

`config/README.md` defines ownership and validation requirements. No current
runtime schema/default exists in the documentation-only config root.

## Quality gates

- link integrity;
- focused TypeScript/Vite or Gradle build;
- protocol fixture compatibility;
- settings backend round trip;
- driver capability probe;
- direct and routed network flow;
- platform/device diagnostics;
- dated E0–E4 evidence.

## Current status

Observed implementation exists primarily in shared AirPad, Network, Settings,
transport, and native-bridge contracts. CWSP-reborn platform entrypoints,
backends, protocol ports, and packaging are incomplete.

The current pass prepares documentation, roadmaps, memory, progress, and
recovery only. It does not claim product readiness.

## Navigation

- Analysis: `../.analysis/architecture.md`
- Master roadmap: `../../../.roadmaps/CWSP-reborn/PASS-I.md`
- Execution plan: `../../../plans/CWSP-reborn-Pass-I.md`
- Resume state: `../../../.progress/CWSP-reborn/STATE.json`
