# CWSP Extensions

- **Updated:** 2026-07-10
- **Status:** bounded v2 extension contract

## Purpose

Extensions add optional metadata, capabilities, settings contributions, or
diagnostic handlers without changing core packet meaning.

Core routing always relies on `op`, `what`, identity, destinations, UUID,
timestamp, and payload. Unknown extensions cannot redefine those fields.

## Packet extension shape

```json
{
  "extensions": [
    {
      "id": "vendor.example/capability",
      "version": 1,
      "required": false,
      "data": {}
    }
  ]
}
```

Rules:

- `id` is a stable namespaced identifier.
- `version` is an integer contract version.
- `required` defaults to false.
- `data` is JSON-serializable and size-bounded.
- extension data must not contain credentials or recursive runtime objects.

## Unknown extensions

- Optional unknown extensions are preserved during transparent relay when safe.
- A local handler ignores optional unknown extensions.
- A required unknown extension produces a correlated, explicit error.
- Gateways do not execute vendor behavior unless the capability is enabled.

## Capability extensions

A capability extension may advertise:

- platform and driver;
- supported operations;
- payload and rate limits;
- permission/readiness state;
- contract version.

Capability advertisements are hints. Authorization and local readiness are still checked.

## Settings contributions

Views and platform backends may contribute settings through the shared settings
registry. A contribution declares:

- stable contribution and tab identifiers;
- schema and defaults;
- persistence owner;
- supported shell profiles;
- validation and migration version;
- secure-value handling.

Contributed settings must not create a second transport or routing schema.

## Diagnostics extensions

Diagnostics may add correlation, timing, route-decision, and driver metadata.
They must be removable without changing operation behavior and must redact
private values.

## Versioning

- Additive optional fields may remain within the same extension version.
- Changed semantics require a new version.
- Required extensions need negotiation before sending an action that depends on them.
- Core protocol version and extension version are independent.

## Registration lifecycle

1. Register the extension descriptor.
2. Validate unique ID/version.
3. Register packet or settings handlers.
4. Advertise capability only when ready.
5. Unregister handlers during shell/backend shutdown.

## Current scope

Pass I documents the extension boundary only. No new vendor runtime is enabled.
Future implementations follow
`.roadmaps/CWSP-reborn/PROTOCOL-DRIVERS.md`.
