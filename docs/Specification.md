# CWSP-reborn Product Specification

- **Updated:** 2026-07-10 (Pass II calibration)
- **Status:** Pass-II protocol/backend wave verified locally; packaging and OS drivers deferred
- **Implementation readiness:** shared v2 protocol, Node/Web facades, Java protocol, settings/clipboard/web backends, and `/ws` loopback verified by `check:*` suites; APK, full TLS `:8434` boot, OS input drivers, and desk WebNative packaging remain open

## Product goal

CWSP-reborn is a shared frontend and platform-adapter product for:

- Android through Capacitor plus Java/native services;
- Windows and Linux through WebNative plus Node services;
- compatible PWA/CRX surfaces where their capabilities apply.

Future platforms (future / not started): NeutralinoJS + Node extension
(<https://github.com/neutralinojs/neutralinojs>, <https://github.com/hschneider/neutralino-ext-node>)
as an alternate Windows/Linux desktop shell beside WebNative, reusing the same
Node backend settings/control and CWSP v2 protocol facades; Capacitor stays Android.

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

The canonical path `runtime/cwsp/endpoint` resolves to the legacy endpoint tree
via symlink and is treated as migration input. Pass II verified a soft-bind
`ingress-normalize` + local `/ws` loopback harness (`check:ws-loopback` 4/4)
that preserves destinations through `normalizeFrame`. Full Fastify/PM2 TLS boot
on `:8434` is still deferred.

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

Topology index builds for Capacitor and WebNative `index.html` are green (4/4).
The full `build:capacitor` / `build:webnative` graphs and deploy scripts remain
roadmap targets; APK assembly is blocked on the Capacitor Android
dependency/assets, and desk WebNative packaging is not yet produced.

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

Pass II verified the shared protocol and backend seams locally:

- `cwsp-shared` v2 (29 tests) is the protocol source of truth.
- Node/Web protocol facades are filled and green (`check:protocol-facades` 11/11)
  with `@fest-lib/cwsp-shared` aliases resolved by `scripts/resolve-aliases.mjs`.
- Node settings backend (`check:settings-backend` 3/3), clipboard backend
  (`check:clipboard-backend` 5/5), and web/PWA backend seams
  (`check:web-backend` 9/9) are green.
- `/ws` loopback harness is green (`check:ws-loopback` 4/4); adapter smoke is
  green (4/4).
- Java CWSP v2 protocol base is green (`check:java-protocol` 24/24); Java
  backend bridges green (3/3); Android pure merge and Gradle tasks OK on JDK 17.

Still open (do not infer readiness): Capacitor Android APK assembly, full
endpoint TLS `:8434` boot, OS input drivers (Robot/AHK/AutoKey), driver
readiness/debug relay, and desk WebNative packaging. This pass calibrates
documentation only; it does not claim product readiness.

## Navigation

- Analysis: `../.analysis/architecture.md`
- Master roadmap: `../../../.roadmaps/CWSP-reborn/PASS-I.md`
- Execution plan: `../../../plans/CWSP-reborn-Pass-I.md`
- Resume state: `../../../.progress/CWSP-reborn/STATE.json`
