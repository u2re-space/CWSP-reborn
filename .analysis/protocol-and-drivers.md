# CWSP-reborn Protocol and Driver Analysis

- **Observed:** 2026-07-10
- **Current contract:** CWSP v2
- **Evidence:** network rules, shared transport/bridge/config code, platform scaffold

## Contract sources

### Current

- `.cursor/rules/network.mdc` — canonical logical envelope, routing, actions,
  diagnostics, and module behavior.
- shared boot transport — browser packet builder and websocket behavior.
- AirPad config/session modules — direct/routed identity and realtime input behavior.
- settings sync adapter — cross-surface `settings:get` / `settings:patch`.
- native bridge modules — Capacitor coordinator, clipboard, settings, and permission channels.

### Aspirational

- historical CWSP-reborn plan and former v1 doc outlines — encryption,
  alignment, CRC16, alternate encoding, and experimental transports.

The aspirational set does not override current v2.

## Current logical flow

```text
view intent
  -> canonical packet builder
  -> browser or native websocket adapter
  -> endpoint normalize and route
  -> local handler or next peer
  -> platform driver
  -> correlated result/error when requested
```

Compatibility transport wrappers normalize at the boundary.

## Identity model

Routing uses logical peer IDs. Origins and account/token aliases help resolve a
peer but are not packet destinations.

The system must preserve:

- connected endpoint;
- direct final origin;
- quick-connect user input;
- logical destination ID;
- sender/origin identity.

Conflating these fields breaks gateway and reverse routes.

## Realtime policy

Pointer movement is relative and expires quickly. A reconnecting adapter must:

- bound its queue;
- discard stale deltas;
- avoid replaying previous relative movement;
- avoid logging every high-frequency frame by default;
- report executor readiness separately from socket readiness.

Clipboard requires origin/UUID/content-or-hash deduplication and a suppression
window after remote application.

## Platform capability status

### Shared browser frontend

- packet and AirPad transport concepts are implemented;
- browser clipboard and native bridge fallbacks are represented;
- routed identity and settings contributions have reusable code.

### Android

- Java CWSP v2 protocol base green (`check:java-protocol` 24/24);
- SharedPreferences/ClipboardManager/Coordinator bridges green (pure merge);
- Capacitor Gradle contour OK on JDK 17; APK still blocked on Capacitor Android dep/assets.

### Windows/Linux (Node)

- WebNative settings store + `/service/config` green (`check:settings-backend` 3/3);
- Optional Clipboardy emission/executor with in-memory fallback (`check:clipboard-backend` 5/5);
- Protocol node/web facades filled over cwsp-shared v2 (`check:protocol-facades` 11/11);
- Web/PWA backend seams (IDB memory, ShareTarget, clipboard emit) green (`check:web-backend` 9/9);
- Robot/AHK/AutoKey and full WebNative packaging remain deferred.

### Endpoint

- Canonical path `runtime/cwsp/endpoint` → legacy symlink;
- Soft-bind: coordinator packets in `normalizeFrame` preserve destinations;
- `ingress-normalize` + local `/ws` loopback harness green (`check:ws-loopback` 4/4);
- Full Fastify/PM2 TLS boot on `:8434` still deferred.

## DataAsset

Binary and textual sources use one normalized DataAsset contract. Driver
boundaries carry compact metadata and content/reference; transport code does not
invent platform-specific file shapes.

Expected adapter roles:

- browser creates/applies File, Blob, data URL, or ClipboardItem;
- Android bridge converts native share/clipboard content;
- desktop backend converts OS clipboard/files;
- endpoint relays and optionally persists without requiring binary clipboard support.

## Required contract fixtures

1. direct `mouse:move`;
2. gateway-routed `mouse:move`;
3. `keyboard:tap`;
4. clipboard text update and echo suppression;
5. DataAsset clipboard update;
6. settings get/patch request and result;
7. debug log batch;
8. unknown optional and required extensions;
9. stale and duplicate packets;
10. driver unavailable error.

## Primary implementation risks

- implementing v1 wire proposals inside v2 without negotiation;
- duplicating packet builders in Java, Node, and web;
- replaying stale realtime input after reconnect;
- treating a driver path as capability readiness;
- embedding secrets in packets, docs, or diagnostics;
- allowing compatibility transports to define different semantics.

## Recommended next technical artifact

Create one shared fixture package after canonical path selection. TypeScript,
Java, and Node adapters should consume the same JSON fixtures before any remote
route validation begins.
