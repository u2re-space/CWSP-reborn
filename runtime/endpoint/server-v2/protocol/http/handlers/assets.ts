import { readFile } from "node:fs/promises";
import path from "node:path";

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { ADMIN_DIR } from "../../utils/paths.ts";
import {
    PHOSPHOR_STYLES,
    getPhosphorSvgCached,
    isValidPhosphorIconName,
    isValidPhosphorStyle,
    phosphorCacheStats,
    warmPhosphorIcons,
    type PhosphorStyle,
    type PhosphorWarmItem,
} from "../lib/phosphor-upstream.ts";

const gatewaySessionOptions = (app: FastifyInstance): Record<string, unknown> => {
    const guard = (app as any).gatewayAuth?.requireSession;
    return guard ? { preHandler: guard } : {};
};

const ADMIN_FALLBACK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M12 2a2.6 2.6 0 0 1 2.6 2.6V7.4l4.1 2.1c.6.3 1 1 1 1.7v4.6c0 .7-.4 1.4-1 1.7l-4.1 2.1v1.6c0 1.4-1.2 2.6-2.6 2.6H6.6C5.2 21 4 19.8 4 18.4V13.2c0-.7.4-1.4 1-1.7l4.2-2.1V4.6A2.6 2.6 0 0 1 11.8 2H12Zm-1 12.1v4.8c0 .5.4.9.9.9h6.1c.5 0 .9-.4.9-.9V13l-.2-.1l-3.6-1.8V11h-4v3.1Zm-1-8.5V19c0 .4-.3.7-.7.7h-.6c-.4 0-.7-.3-.7-.7v-1.6L4.4 14.7A.6.6 0 0 1 4 14.1V8.9a.6.6 0 0 1 .4-.6L10 5.3V8h2V3.6c0-.4-.3-.8-.8-.8H11.7c-.4 0-.7.3-.7.7Z"/>
</svg>`;

const decoratePhosphorSvgHeaders = (reply: FastifyReply, request: FastifyRequest): void => {
    reply.header("Cross-Origin-Resource-Policy", "cross-origin");
    const origin = String((request.headers as { origin?: string })?.origin || "").trim();
    if (origin) {
        reply.header("Access-Control-Allow-Origin", origin);
        reply.header("Vary", "Origin");
    } else {
        reply.header("Access-Control-Allow-Origin", "*");
    }
};

const proxyPhosphorIcon = async (request: FastifyRequest, reply: FastifyReply, style: string, iconRaw: string) => {
    const iconName = iconRaw.replace(/\.svg$/i, "").trim().toLowerCase();
    const normalizedStyle = style.trim().toLowerCase();

    if (!isValidPhosphorStyle(normalizedStyle)) {
        return reply.code(400).send({ ok: false, error: `Invalid phosphor style: ${style}` });
    }
    if (!isValidPhosphorIconName(iconName)) {
        return reply.code(400).send({ ok: false, error: `Invalid icon name: ${iconRaw}` });
    }

    try {
        const svg = await getPhosphorSvgCached(normalizedStyle as PhosphorStyle, iconName);
        reply.header("Content-Type", "image/svg+xml; charset=utf-8");
        reply.header("Cache-Control", "public, max-age=604800");
        decoratePhosphorSvgHeaders(reply, request);
        return reply.send(svg);
    } catch (error) {
        return reply.code(502).send({
            ok: false,
            error: "Failed to fetch upstream icon",
            details: String(error),
        });
    }
};

const sendAdminIcon = (reply: FastifyReply) => {
    return reply
        .type("image/svg+xml; charset=utf-8")
        .header("Cache-Control", "public, max-age=604800")
        .send(ADMIN_FALLBACK_ICON);
};

const ADMIN_ASSETS: Record<string, string> = {
    "index.css": "text/css; charset=utf-8",
    "index.mjs": "application/javascript; charset=utf-8",
    "url.mjs": "application/javascript; charset=utf-8"
};

const sendAdminAsset = async (reply: FastifyReply, filename: keyof typeof ADMIN_ASSETS) => {
    const contentType = ADMIN_ASSETS[filename];
    try {
        const body = await readFile(path.resolve(ADMIN_DIR, filename), "utf8");
        return reply.type(contentType).header("Cache-Control", "no-store").send(body);
    } catch {
        return reply.code(404).send({ ok: false, error: "Admin asset not found" });
    }
};

export const registerAssetsHttpHandlers = async (app: FastifyInstance): Promise<void> => {
    const protectedAdmin = gatewaySessionOptions(app);

    app.get("/admin", protectedAdmin, async (_req, reply) => {
        reply.header("Content-Type", "text/html; charset=utf-8");
        reply.header("Cache-Control", "no-store");
        return reply.send(await readFile(path.resolve(ADMIN_DIR, "index.html"), { encoding: "utf-8" }));
    });

    app.get("/admin/index.css", protectedAdmin, async (_req, reply) => sendAdminAsset(reply, "index.css"));
    app.get("/admin/index.mjs", protectedAdmin, async (_req, reply) => sendAdminAsset(reply, "index.mjs"));
    app.get("/admin/url.mjs", protectedAdmin, async (_req, reply) => sendAdminAsset(reply, "url.mjs"));
    app.get("/admin/icon.svg", protectedAdmin, async (_req, reply) => sendAdminIcon(reply));
    app.get("/icon.svg", async (_req, reply) => sendAdminIcon(reply));

    app.get("/assets/icons/phosphor", async () => ({
        ok: true,
        source: "@phosphor-icons/core@2",
        styles: PHOSPHOR_STYLES,
    }));

    app.get("/assets/icons/phosphor/:style/:icon", async (request: FastifyRequest<{ Params: { style: string; icon: string } }>, reply) => {
        return proxyPhosphorIcon(request, reply, request.params.style, request.params.icon);
    });

    app.get("/assets/icons/duotone", async () => ({
        ok: true,
        aliasOf: "/assets/icons/phosphor/duotone/:icon",
        styles: ["duotone"],
    }));

    app.get("/assets/icons/duotone/:icon", async (request: FastifyRequest<{ Params: { icon: string } }>, reply) => {
        return proxyPhosphorIcon(request, reply, "duotone", request.params.icon);
    });

    app.get("/assets/icons", async () => ({
        ok: true,
        source: "@phosphor-icons/core@2",
        defaultStyle: "duotone",
        styles: PHOSPHOR_STYLES,
        aliases: {
            duotone: "/assets/icons/duotone/:icon",
            style: "/assets/icons/:style/:icon",
            default: "/assets/icons/:icon",
        },
        warm: "POST /api/assets/warm-phosphor",
    }));

    app.get("/assets/icons/:style/:icon", async (request: FastifyRequest<{ Params: { style: string; icon: string } }>, reply) => {
        return proxyPhosphorIcon(request, reply, request.params.style, request.params.icon);
    });

    app.get("/assets/icons/:icon", async (request: FastifyRequest<{ Params: { icon: string } }>, reply) => {
        return proxyPhosphorIcon(request, reply, "duotone", request.params.icon);
    });

    /** Parallel upstream warm (fills process LRU); safe icon/style names only. */
    app.post<{ Body: { items?: unknown[]; concurrency?: number } }>("/api/assets/warm-phosphor", async (request, reply) => {
        const raw = request.body?.items;
        if (!Array.isArray(raw)) {
            return reply.code(400).send({ ok: false, error: "items[] required" });
        }
        const items: PhosphorWarmItem[] = [];
        for (const row of raw) {
            if (!row || typeof row !== "object") continue;
            const rec = row as Record<string, unknown>;
            const st = String(rec.style ?? "").trim().toLowerCase();
            const ic = String(rec.icon ?? "")
                .replace(/\.svg$/i, "")
                .trim()
                .toLowerCase();
            if (!isValidPhosphorStyle(st) || !isValidPhosphorIconName(ic)) continue;
            items.push({ style: st, icon: ic });
        }
        const conc = Number(request.body?.concurrency);
        const result = await warmPhosphorIcons(items, Number.isFinite(conc) ? conc : undefined);
        return { ok: true, ...result, cache: phosphorCacheStats() };
    });
};
