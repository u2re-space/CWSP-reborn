# CWSP-reborn runtime

Physical source-of-truth for the CWSP endpoint server and promotion adapters.

## Layout

| Path | Role |
|---|---|
| `endpoint/` | CWSP `/ws` Fastify/PM2 server (was `runtime/legacy/endpoint`) |
| `adapters/` | Soft-bind helpers (ingress-normalize ↔ cwsp-shared v2) |

Shared wire contract: `apps/CWSP-reborn/src/shared` (`@fest-lib/cwsp-shared`).

## Compat symlinks (workspace)

External tooling may still resolve the old paths:

- `runtime/cwsp/endpoint` → this `endpoint/`
- `runtime/legacy/endpoint` → this `endpoint/`
- `runtime/cwsp/adapters` → this `adapters/`

Prefer importing / running from `apps/CWSP-reborn/runtime/...` going forward.

## Smoke

```bash
node apps/CWSP-reborn/runtime/adapters/smoke.mjs
# or via compat:
node runtime/cwsp/adapters/smoke.mjs
```
