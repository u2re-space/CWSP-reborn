/*
 * Filename: gateway.ts
 * FullPath: runtime/cwsp/endpoint/server-v2/protocol/http/branches/gateway.ts
 * Change date and time: 13.56.00_17.07.2026
 * Reason for changes: Mount the human gateway UI as an isolated server-v2
 *   HTTP branch before legacy admin assets and settings routes.
 */

import { registerGatewayHttp, type GatewayRuntimeContext } from "../gateway/index.ts";
import { resolveGatewayWebRoot } from "../gateway/web-root.ts";
import type { ServerV2HttpBranch } from "../types.ts";

export const gatewayHttpBranch: ServerV2HttpBranch = {
    id: "gateway",
    label: "Gateway UI",
    notes: "Route-scoped human UI authentication, static shell, and BFF.",
    routes: [
        { method: "GET", path: "/" },
        { method: "GET", path: "/login" },
        { method: "GET", path: "/network" },
        { method: "GET", path: "/settings" },
        { method: "GET", path: "/minimal" },
        { method: "ALL", path: "/assets/*" },
        { method: "GET", path: "/gateway" },
        { method: "GET", path: "/gateway/" },
        { method: "GET", path: "/gateway/login" },
        { method: "POST", path: "/gateway/auth/login" },
        { method: "GET", path: "/gateway/auth/session" },
        { method: "POST", path: "/gateway/auth/logout" },
        { method: "ALL", path: "/gateway/assets/*" },
        { method: "ALL", path: "/gateway/api/*" }
    ],
    register: async ({ app, runtimeContext }) => {
        if (!runtimeContext || typeof runtimeContext !== "object") {
            // COMPAT: router-only callers may mount selected legacy branches without
            // the full server-v2 engine; leave the optional gateway surface absent.
            return;
        }
        const runtime = runtimeContext as GatewayRuntimeContext;
        const webRoot = resolveGatewayWebRoot({
            env: process.env,
            cwd: process.cwd(),
            fromFileUrl: import.meta.url
        });
        await registerGatewayHttp(app, {
            runtimeContext: runtime,
            webRoot
        });
    }
};

