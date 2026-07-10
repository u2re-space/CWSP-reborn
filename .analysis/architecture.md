# CWSP-reborn Architecture Snapshot

- **Observed:** 2026-07-10
- **Scope:** source, projections, entrypoints, configuration, platform shells,
  shared views, and runtime dependencies
- **Excluded:** generated output, vendor dependencies, Gradle caches, and private data
- **Evidence level:** E0 inventory and E1 contract analysis; no platform build was run

## Executive finding

CWSP-reborn is currently a multi-platform source-layout scaffold, not a ready
application. Its intended design is coherent:

```text
shared view packages
  -> CWSP-reborn frontend composition
  -> Capacitor or WebNative shell
  -> Java or Node backend
  -> CWSP endpoint and routed peers
```

The first two layers contain reusable implementation, but most CWSP-reborn
platform build files, backend entrypoints, protocol ports, runtime config inputs,
and scripts are empty or incomplete. Several projections are broken or cyclic.

## Canonical and projected roots

### Intended canonical source

- `apps/CWSP-reborn/src/`
  - `frontend/` — shared frontend and shell projections.
  - `backend/java/` — intended Android and optional desktop Java backends.
  - `backend/node/` — intended Fastify/WebNative desktop backends.
  - `protocol/` — intended Java, Node, and web protocol ports.
  - `config` — link to the project config root.

### Platform projections

- `app/src` → canonical `src`.
- `app/android` → Capacitor frontend and Java backend projections.
- `app/windows` → shared/WebNative frontend and desktop backend projections.
- `app/linux` → shared/WebNative frontend and desktop backend projections.
- `app/pwa` → PWA frontend/backend projections.
- `app/crx` → extension projections.
- `app/shared` → shared backend/protocol projections.

These paths describe intent. They are not independently writable source roots.

## Frontend composition

CWSP-reborn consumes reusable packages through
`src/frontend/submodules`:

- core/config from `modules/shared`;
- framework libraries from shared `fest` modules;
- shell modules from `modules/shared/shells`;
- views from `modules/views`.

The exact current view chain is:

```text
apps/CWSP-reborn/src/frontend/submodules/views
  -> modules/shared/views
  -> apps/CrossWord/src/frontend/views
  -> per-view compatibility links
  -> modules/views/<name>-view/src
```

The final packages are canonical for the audited views. The intermediate
`modules/shared` and CrossWord paths are compatibility projections to classify
and shorten during P1, not additional implementations.

The target shell composition is:

### Capacitor Android

- minimal shell;
- network view;
- AirPad view;
- settings view;
- native Java bridge for coordinator, clipboard, settings, permissions, and logs.

### WebNative Windows/Linux

- minimal shell;
- network view;
- settings view;
- Node backend for config, endpoint integration, clipboard/input capability, and process lifecycle.

## Shared view state

- `modules/views/airpad-view` — substantial implementation and regression tests.
- `modules/views/network-view` — status/probe/reconnect/log UI implementation.
- `modules/views/settings-view` — settings host, contributions, shell profiles,
  and sync-arm contract.
- `modules/views/debug-view` — package scaffold with an empty source entrypoint.
- `modules/views/developer-view` — empty entrypoint and copied debug package identity.

AirPad is in a migration state: its new `input` and `network` paths project into
incomplete CWSP-reborn trees while functional code remains under
`input-old` and `network-old`. Deleting the old trees would currently be unsafe.

## Backend and runtime boundaries

### CWSP-reborn

- Java protocol and executor classes are mostly empty stubs.
- Node Fastify, Windows, Linux, and PWA entrypoints are empty or incomplete.
- The project config directory has no runtime schema/defaults.
- Platform scripts exist mainly as zero-byte placeholders.

### Workspace runtimes

- The path named by current rules, `runtime/cwsp/endpoint`, is absent.
- `runtime/legacy/endpoint` exists and contains a legacy server/portable tree.
- The legacy endpoint was not built or route-tested during this documentation pass.

Therefore, documentation distinguishes:

1. current logical v2 contract in `.cursor/rules/network.mdc`;
2. reusable client-side transport/view code in shared modules;
3. legacy endpoint code that may provide migration material;
4. unimplemented CWSP-reborn platform ports.

## Configuration and settings data flow

Target flow:

```text
settings view contribution
  -> shared settings schema
  -> surface sync arm
     -> web/IDB
     -> Capacitor bridge/Java persistence
     -> WebNative control RPC/portable config
  -> runtime reload
```

Current evidence:

- contribution registry and shell-profile behavior exist in shared frontend code;
- `settings:get` and `settings:patch` are defined as cross-surface operations;
- Android and WebNative backend persistence is not proven end-to-end from this project;
- the config root contains documentation only, so no file there is yet an
  authoritative runtime schema or default.

Routing settings must keep these concepts separate:

- endpoint/gateway URL;
- direct target URL;
- AirPad quick-connect target;
- destination client ID.

## Build and entrypoint state

The root package is ESM and currently exposes:

- `npm run dev` → `vite`
- `npm run build` → `vite build`
- `npm run preview` → `vite preview`

Observed blockers:

- root `vite.config.ts` and `tsconfig.json` are empty;
- root `build.gradle` is empty;
- Android Gradle/manifest/bootstrap content is not complete;
- package dependencies do not declare Capacitor, WebNative, Fastify, or platform tooling;
- documented `build:capacitor`, `build:webnative`, and deploy scripts are absent;
- Windows/Linux WebNative shared projections include broken or cyclic targets;
- the CRX backend projection targets a non-existent path.

`dist` is currently an output compatibility alias to `build`; it is not a
separate generated tree.

No current platform reaches E2 from the CWSP-reborn root.

## Source and symlink hazards

1. Large fan-out makes one source appear at many platform paths.
2. Some chains round-trip through `app/src` back into `src`.
3. Linux WebNative and Neutralino aliases participate in cyclic or wrong-target chains.
4. Empty files can satisfy path existence while hiding missing behavior.
5. Shared views may resolve through more than one alias layer.
6. Broad search can report thousands of apparent duplicates that are projections.

The next structural pass must generate a path-to-target manifest and classify
links before modifying any of them.

## Architecture invariants

- One physical source per concern.
- Platform directories project canonical sources; they do not fork them.
- Shared semantic contracts do not import platform executors.
- Native capability failures are explicit and non-fatal to the core transport.
- `/ws` packet meaning is independent of browser, Java, Node, or compatibility transport.
- Settings schema is shared; persistence adapters are platform-specific.
- Product readiness is based on E2–E4 evidence, never path presence.

## Recommended first build contour

After P1 link integrity, select exactly one contour:

1. **Android Capacitor** if device/AirPad recovery is the immediate priority; or
2. **Windows WebNative** if desktop settings/backend packaging is the immediate priority.

Do not repair both build systems in the same initial implementation task. Shared
contracts may be prepared once, but target-specific failures and validation must
remain isolated.
