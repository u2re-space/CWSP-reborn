# @fest-lib/cwsp-shared

Isomorphic **CWSP v2** packet contracts and helpers. Transport adapters (Capacitor, Neutralino, WebSocket) live **outside** this package.

`private: true` — not on npm. Import from the workspace. Do not confuse with `apps/CWSP-shared` (app extras).

## Install (workspace)

Already listed in the root `package.json` workspaces. From an app:

```ts
import { createCwspPacket, buildClipboardPacket } from "@fest-lib/cwsp-shared";
import { createCwspPacket as fromV2 } from "@fest-lib/cwsp-shared/v2";
```

Subpaths (see `package.json` `exports`):

| Import | Role |
| --- | --- |
| `@fest-lib/cwsp-shared` | v2 public surface |
| `@fest-lib/cwsp-shared/v2` | same, explicit |
| `@fest-lib/cwsp-shared/packet` | `createCwspPacket` / `buildPacket` |
| `@fest-lib/cwsp-shared/clipboard` | clipboard packets |
| `@fest-lib/cwsp-shared/files` | file-transfer helpers |
| `@fest-lib/cwsp-shared/policy` | hub / path policy |
| `@fest-lib/cwsp-shared/validation` | packet validation |

```ts
import { createCwspPacket, buildClipboardPacket } from "@fest-lib/cwsp-shared";

const pkt = createCwspPacket({
    type: "clipboard:update",
    payload: { text: "hello" }
});
const clip = buildClipboardPacket({ type: "clipboard:update", payload: { text: "hello" } });
```

## Workspace

```bash
cd modules/projects/cwsp-shared
npm test
npm run typecheck
npm run check
```

Node **22.6+** (`--experimental-strip-types` in tests). Sources ship as TypeScript (`main` → `src/index.ts`).
