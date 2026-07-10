# Java dual-stack backend (Pass II)

Alternative desktop backend beside the NodeJS WebNative contour. Same settings/control contract, JDK-only runtime.

## Node vs Java

| Concern | Node (WebNative) | Java (this tree) |
|---|---|---|
| Package / module | `src/backend/node/shared/settings` + `webnative` | `space.u2re.cwsp.backend` under `src/backend/java/shared` |
| Persist file | `portable.config.json` | same |
| Merge | one-level sibling-safe `mergeSettingsPatch` | `SettingsMerge.merge` |
| Control RPC | `GET\|POST /service/config` + `X-API-Key` | same (JDK `HttpServer`) |
| Auth key | generated or injected | optional; env `CWSP_CONTROL_KEY` (never hardcoded) |
| Clipboard | Node emission/executor hooks | text shadow + `ClipboardOsHook` / packet adapter |
| Platforms | `node/windows`, `node/linux` | `java/windows`, `java/linux` entrypoints |
| `generic` | symlink → `shared` | symlink → `shared` |

Both backends can run on a host for dual-stack experiments; they should not share a live write lock on the same `portable.config.json` unless coordinated.

## Layout

- `space/u2re/cwsp/backend/settings/` — defaults, merge, file store
- `space/u2re/cwsp/backend/clipboard/` — shadow + OS/packet seams
- `space/u2re/cwsp/backend/control/` — loopback `/service/config`
- `../windows`, `../linux` — thin `Main` / `Settings` projections

Protocol usage stays behind `ClipboardPacketAdapter` so incomplete `src/protocol/java` does not block compile. Do not edit protocol from this contour.

## Check

```bash
npm run check:java-backend
# or
bash scripts/check-java-backend.sh
```

## Smoke start

```bash
# after compiling via the check script's pattern, or:
javac -d /tmp/cwsp-java-backend $(find src/backend/java/shared src/backend/java/linux -name '*.java')
java -cp /tmp/cwsp-java-backend space.u2re.cwsp.backend.linux.Main
```

Set `CWSP_CONTROL_KEY` in the environment when the shell should require `X-API-Key`.
