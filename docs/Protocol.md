# CWSP Protocol

- **Updated:** 2026-07-10 (Pass II Node/WEB protocol wave)
- **Current semantic version:** v2
- **Status:** documented contract; shared v2 + Node/Web facades verified locally; full endpoint TLS boot still deferred
- **Detailed source:** [`network.mdc`](../../../.cursor/rules/network.mdc)
- **Shared SoT:** `modules/projects/cwsp-shared` (`@fest-lib/cwsp-shared` v2)
- **Facades:** `apps/CWSP-reborn/src/protocol/{node,web}` (thin re-exports + WS helpers)
- **Ingress adapter:** `runtime/cwsp/adapters/ingress-normalize.{ts,mjs}` soft-binds legacy `normalizeFrame`
- **Checks:** `npm run check:protocol-facades`, `check:ws-loopback`, `check:clipboard-backend`, `check:web-backend`

## Purpose

CWSP provides one logical packet model for realtime routing, AirPad input,
clipboard, settings-adjacent control, diagnostics, and compatibility transports.
Packet meaning is transport-neutral and platform-neutral.

## Current transport model

1. Native WebSocket at `/ws` is the canonical realtime transport.
2. HTTP endpoints are fallback and compatibility surfaces.
3. Socket.IO is a legacy compatibility path, not a new primary dependency.
4. Native bridges may carry the same logical packet over local IPC.

## Canonical envelope

```json
{
  "op": "act",
  "what": "mouse:move",
  "purpose": "airpad",
  "protocol": "ws",
  "transport": "ws",
  "uuid": "correlation-id",
  "timestamp": 1783656000000,
  "sender": "logical-peer-id",
  "nodes": ["logical-destination-id"],
  "payload": {
    "x": 4,
    "y": -2
  },
  "flags": {
    "canonicalV2": true
  }
}
```

Required semantic fields depend on the operation, but producers must preserve:

- `op` — `ask`, `act`, `result`, or `error`;
- `what` — stable `domain:action` name;
- `uuid` and `timestamp` — correlation, duplicate, and stale-data handling;
- sender identity;
- destination identity when routed;
- payload or result;
- protocol/transport metadata for diagnostics.

## Verb compatibility

- `request` normalizes to `ask`.
- `response`, `resolve`, and `ack` normalize to `result`.
- `signal` and `notify` normalize to `act`.
- failures normalize to `error`.

Compatibility aliases are accepted at boundaries. Internal handlers use the
canonical verbs.

## Identity and routing

CWSP routes by logical peer identity. Origins, IP addresses, tokens, and client
aliases are lookup hints, not substitutes for destination semantics.

These settings remain distinct:

- endpoint/gateway URL — the coordinator being connected to;
- direct target URL — the final peer origin for direct mode;
- AirPad quick-connect target — user input that may resolve to an origin or ID;
- destination client ID — logical `nodes`/`destinations` routing target.

An empty destination list means local handling or fan-out according to endpoint
policy. A routed packet must not silently replace the destination ID with the
gateway identity.

## Stable action families

### Clipboard

- `clipboard:update`
- `clipboard:write`
- `clipboard:read`
- `clipboard:get`
- `clipboard:clear`
- `clipboard:isReady`

### Input and AirPad

- `mouse:move`, `mouse:click`, `mouse:scroll`, `mouse:down`, `mouse:up`
- `mouse:isReady`
- `keyboard:type`, `keyboard:tap`, `keyboard:toggle`
- `keyboard:isReady`
- `voice:submit`

### Network and diagnostics

- `network:dispatch`
- `debug:log`, `debug:event`, `debug:subscribe`, `debug:tail`, `debug:isReady`

## Realtime policy

- Relative pointer data has a short lifetime and must not be replayed after a stale reconnect.
- Queues are bounded and may coalesce only when semantics remain correct.
- UUID/content duplication is suppressed.
- Applying remote clipboard content must not immediately re-emit the same value.
- High-frequency tracing is suppression-aware.

## DataAsset

Text, files, images, base64, data URLs, and remote URLs use one compact
DataAsset normalization model. Cross-context packets carry stable metadata such
as hash, name, MIME type, size, source, and data/reference. Text-only clipboard
packets remain compatible.

## Extension slot

`extensions` is reserved for versioned, namespaced metadata. Core routing cannot
depend on an unknown extension. See `Extensions.md`.

## Security and TLS

- Secrets are configuration, never protocol documentation.
- WSS/TLS is the production target.
- Self-signed acceptance is an explicit development policy, not a silent global fallback.
- Packet and debug logs must redact private payloads.

## Future wire research

The earlier v1 outline proposed fixed alignment, CRC16, payload encryption,
ecosystem-token key derivation, CBOR/JSOX/TOON negotiation, QUIC, and UDP.
Those ideas are not part of current v2 behavior. Adoption requires a versioned
wire specification, threat model, negotiation rules, fixtures, benchmarks, and
downgrade behavior.

## Compatibility requirement

TypeScript, Java, Node, browser, Capacitor, and WebNative ports must pass the
same logical packet fixtures before platform-specific route testing.

## CWSP-reborn local verification (Pass II)

| Surface | Command | Evidence |
|---------|---------|----------|
| Protocol facades (node+web) | `npm run check:protocol-facades` | normalize/clipboard/UUID/WS URL |
| Node settings + control | `npm run check:settings-backend` | `/service/config` get/patch |
| Node clipboard executor | `npm run check:clipboard-backend` | memory + asset + echo suppress |
| Web/PWA backend seams | `npm run check:web-backend` | IDB memory, share target, clipboard emit |
| `/ws` loopback harness | `npm run check:ws-loopback` | destination preserve + optional WS echo |
| Adapter smoke | `node runtime/cwsp/adapters/smoke.mjs` | symlink + ingress import |

Deferred: crypto/QUIC/transmission, Robot/AHK drivers, full PM2 `:8434` TLS boot.
