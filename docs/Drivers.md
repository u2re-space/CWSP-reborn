# CWSP Drivers

- **Updated:** 2026-07-10 (Pass II calibration)
- **Status:** capability contract and verified inventory
- **Readiness:** shared frontend adapters, Node/Web protocol facades, Java protocol, and Node settings/clipboard/web backend seams verified locally; OS input drivers, APK, full TLS boot, and desk WebNative packaging deferred

## Driver model

A driver adapts a stable CWSP capability to a platform API. It does not redefine
packet semantics or routing.

Each driver reports:

- capability name and version;
- `available`, `unavailable`, or `degraded`;
- readiness/error reason;
- required permission or external service;
- supported payload limits;
- lifecycle and reconnect behavior.

Unsupported drivers fail explicitly while the core transport remains usable.

## Transport drivers

### Browser WebSocket

Purpose: connect shared frontend views to canonical `/ws`.

Observed sources include the shared boot transport and AirPad session stack.
CWSP-reborn must consume them through a stable facade rather than copy them per
platform.

### Android native bridge

Purpose: keep coordinator, clipboard, settings, permissions, and background
lifecycle in the native process where required.

Pass II: Java CWSP v2 protocol base is green (`check:java-protocol` 24/24) and
SharedPreferences/ClipboardManager/Coordinator bridges are green via pure merge
(`check:java-backend` 3/3). Gradle contour builds on JDK 17. APK assembly is
still blocked on the Capacitor Android dependency/assets.

### WebNative desktop

Purpose: connect the frontend window to a Node backend and portable settings.

Pass II: WebNative settings store + `/service/config` are green
(`check:settings-backend` 3/3) and the optional Clipboardy executor with
in-memory fallback is green (`check:clipboard-backend` 5/5). Protocol node/web
facades are filled over `cwsp-shared` v2 (`check:protocol-facades` 11/11).
Robot/AHK/AutoKey drivers and the packaged desk WebNative bundle remain deferred.

### Endpoint/gateway

Purpose: accept `/ws`, normalize packets, route, relay, and invoke local drivers.

The canonical path `runtime/cwsp/endpoint` resolves to the legacy endpoint tree
via symlink. Pass II verified a soft-bind `ingress-normalize` + local `/ws`
loopback harness (`check:ws-loopback` 4/4) that preserves destinations through
`normalizeFrame`. Full Fastify/PM2 TLS boot on `:8434` is still deferred.

## Input drivers

### AirPad producer

Produces pointer, keyboard, clipboard, and voice intents. It owns gesture
interpretation and motion-rate policy, not remote OS execution.

### Windows executor

Expected adapter: AutoHotkey or another explicit Windows input service.

Requirements:

- bounded realtime queue;
- no stale relative-movement replay;
- readiness and release operations;
- cursor-unclip recovery;
- process lifecycle tied to active capability use.

CWSP-reborn Windows executor classes are currently stubs.

### Linux executor

Expected adapter: capability-selected Wayland/X11 mechanism.

Requirements:

- report the active display/session capability;
- avoid silent fallback that requires unavailable privileges;
- keep input execution outside transport normalization.

CWSP-reborn Linux executor classes are currently stubs.

## Clipboard drivers

### Browser

Uses `navigator.clipboard` when permission and secure-context requirements are met.

### Android

Uses a native/Capacitor bridge for background and platform-restricted flows.

### Desktop Node

Uses a desktop clipboard adapter behind the WebNative backend. Library choice is
an implementation detail and must not leak into packet shape.

### Endpoint

May apply text locally and relay DataAsset envelopes. Binary persistence is an
optional configured capability, not implied by text clipboard support.

All implementations require content/hash deduplication and an echo-suppression window.

## Configuration drivers

| Surface | Persistence owner | Current evidence |
|---|---|---|
| browser/PWA | shared settings storage | web/PWA backend seams green (`check:web-backend` 9/9) |
| Android Capacitor | native preferences/config | Java bridges green (`check:java-backend` 3/3); APK packaging open |
| WebNative | Node portable config | settings + clipboard backends green (`check:settings-backend` 3/3, `check:clipboard-backend` 5/5) |
| endpoint | JSON/environment policy | `/ws` loopback green (`check:ws-loopback` 4/4); full TLS boot deferred |

The shared settings schema is common. Persistence and secure-value storage are
platform-specific.

## Permissions and accessibility

Drivers request only permissions needed for an active capability. Denial must be
visible and recoverable.

- Clipboard access follows browser/native platform rules.
- Android overlay/background/input services require explicit native policy.
- Input executor readiness is separate from transport readiness.
- UI controls expose labels, keyboard focus, and status not conveyed by color alone.

## Proxying and routing

Gateway, bridge, and reverse-link behavior belongs to the endpoint/coordinator,
not to OS input or clipboard drivers. Drivers receive normalized local actions
only after route and permission decisions.

## Diagnostics

Every driver should expose:

- startup and shutdown;
- capability probe;
- selected implementation;
- normalized error code;
- bounded operational counters;
- correlation ID where an incoming packet caused the action.

Private payloads and credentials are redacted.

## Readiness gates

A path or empty class is E0 only. A driver reaches:

- E1 with a documented contract;
- E2 with fixture/type/build tests;
- E3 with local adapter execution;
- E4 with target platform and route evidence.

See `.roadmaps/CWSP-reborn/PROTOCOL-DRIVERS.md` for implementation order.
