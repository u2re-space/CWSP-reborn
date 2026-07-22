/*
 * Filename: files-blob-store.test.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/files-blob-store.test.ts
 * Change date and time: 07.15.00_22.07.2026
 * Reason for changes: Dual-path Accept hedge guards — WAN primary must not
 *   reorder to gateway-first; hedge must start gateway before full peer timeout.
 *   2026-07-22t: callers must pass full urls[] so peer-primary still races gateway.
 */
import assert from "node:assert/strict";
import test from "node:test";
import { createServer, type Server } from "node:http";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
    expandFilesBlobFetchUrls,
    FILES_BLOB_HEDGE_MS_LAN,
    FILES_BLOB_HEDGE_MS_WAN,
    httpGetFilesBlobBytes,
    httpGetFilesBlobToFileHedged,
    orderFilesBlobFetchUrls,
    partitionBlobFetchUrls,
    resolveFilesBlobHedgeMs,
} from "./files-blob-store.ts";

test("orderFilesBlobFetchUrls keeps peer before gateway when WAN is primary", () => {
    const peer = "https://192.168.0.210:8434/service/files-blob/t1/b1?token=x";
    const gwLan = "https://192.168.0.200:8434/files/blob/t1/b1?token=y";
    const gwWan = "https://45.147.121.152:8434/files/blob/t1/b1?token=y";
    // Seed with WAN primary first (LTE-safe bookmark) — order must still be peer-first.
    const ordered = orderFilesBlobFetchUrls([gwWan, peer, gwLan], { primary: gwWan });
    assert.equal(ordered[0], peer, "peer Cap Control must be first");
    assert.ok(ordered.indexOf(gwLan) < ordered.indexOf(gwWan), "gw LAN before WAN");
    assert.ok(ordered.indexOf(peer) < ordered.indexOf(gwLan), "peer before gw LAN");
});

test("expandFilesBlobFetchUrls with WAN primary still peer-first", () => {
    const peer = "http://192.168.0.196:8434/service/files-blob/tid/bid?token=a";
    const wan = "https://45.147.121.152:8434/files/blob/tid/bid?token=b";
    const ordered = expandFilesBlobFetchUrls(wan, [peer, wan]);
    const peerIdx = ordered.findIndex((u) => u.includes("192.168.0.196"));
    const wanIdx = ordered.findIndex((u) => u.includes("45.147.121.152"));
    assert.ok(peerIdx >= 0 && wanIdx >= 0);
    assert.ok(peerIdx < wanIdx, "peer before WAN after expand");
});

test("partitionBlobFetchUrls splits peer vs gateway", () => {
    const peer = "http://192.168.0.110:8434/service/files-blob/t/b?token=1";
    const gw = "https://192.168.0.200:8434/files/blob/t/b?token=2";
    const { peer: p, gateway: g } = partitionBlobFetchUrls([peer, gw]);
    assert.deepEqual(p, [peer]);
    assert.deepEqual(g, [gw]);
});

test("hedge starts gateway before peer full connect timeout when peer hangs", async () => {
    const root = await mkdtemp(join(tmpdir(), "cwsp-blob-hedge-"));
    const dest = join(root, "out.bin");
    let peerHits = 0;
    let gwHits = 0;
    let peerFirstMs = 0;
    let gwFirstMs = 0;
    const t0 = Date.now();

    const peerSrv: Server = createServer((req, res) => {
        peerHits++;
        if (!peerFirstMs) peerFirstMs = Date.now() - t0;
        // Hang until client aborts (simulates Cap-on-LTE dead LAN).
        req.socket.setTimeout(30_000);
        // Do not respond.
    });
    const gwSrv: Server = createServer((_req, res) => {
        gwHits++;
        if (!gwFirstMs) gwFirstMs = Date.now() - t0;
        res.writeHead(200, {
            "Content-Type": "application/octet-stream",
            "Content-Length": "4",
        });
        res.end("WAN!");
    });

    await new Promise<void>((resolve) => peerSrv.listen(0, "127.0.0.1", resolve));
    await new Promise<void>((resolve) => gwSrv.listen(0, "127.0.0.1", resolve));
    const peerPort = (peerSrv.address() as { port: number }).port;
    const gwPort = (gwSrv.address() as { port: number }).port;

    // Use 127.0.0.1 peer — isPeerLanBlobUrl treats /service/files-blob as peer
    // only for non-gateway hosts; 127.0.0.1 is private and path matches peer.
    const peerUrl = `http://127.0.0.1:${peerPort}/service/files-blob/t/b?token=p`;
    // Force gateway class: path /files/blob/ on non-peer host. 127.0.0.1 with
    // /files/blob/ is NOT isPeerLanBlobUrl (needs 192.168.* for that path).
    const gwUrl = `http://127.0.0.1:${gwPort}/files/blob/t/b?token=g`;

    try {
        // Bypass expand/order host classification by calling hedged with urls
        // that partition correctly: peer path vs /files/blob/ on 127.0.0.1.
        // partition: peer = /service/files-blob; gateway = rest.
        // Explicit WAN hedge — adaptive would treat 127.0.0.1 as LAN (1.5s).
        await httpGetFilesBlobToFileHedged(peerUrl, dest, {
            urls: [peerUrl, gwUrl],
            hedgeMs: FILES_BLOB_HEDGE_MS_WAN,
            timeoutMs: 10_000,
        });
        const body = await readFile(dest, "utf8");
        assert.equal(body, "WAN!");
        assert.ok(peerHits >= 1, "peer must be attempted first");
        assert.ok(gwHits >= 1, "gateway must win via hedge");
        assert.ok(
            gwFirstMs < FILES_BLOB_HEDGE_MS_LAN,
            `gateway should start before LAN exclusive window, got ${gwFirstMs}ms`,
        );
        assert.ok(
            gwFirstMs >= FILES_BLOB_HEDGE_MS_WAN - 50,
            `gateway should wait ~WAN hedge (${FILES_BLOB_HEDGE_MS_WAN}), got ${gwFirstMs}ms`,
        );
    } finally {
        await new Promise<void>((resolve) => peerSrv.close(() => resolve()));
        await new Promise<void>((resolve) => gwSrv.close(() => resolve()));
        await rm(root, { recursive: true, force: true });
    }
});

test("resolveFilesBlobHedgeMs: same-subnet peer gets LAN exclusive window", () => {
    const peer = "http://192.168.0.210:8434/service/files-blob/t/b?token=x";
    const ms = resolveFilesBlobHedgeMs([peer]);
    // On fleet desk/dev hosts with 192.168.0.x NIC → LAN; CI without that NIC → WAN.
    assert.ok(
        ms === FILES_BLOB_HEDGE_MS_LAN || ms === FILES_BLOB_HEDGE_MS_WAN,
        `unexpected hedgeMs=${ms}`,
    );
    if (ms === FILES_BLOB_HEDGE_MS_LAN) {
        assert.equal(ms, 1_500);
    }
});

test("resolveFilesBlobHedgeMs: off-subnet private peer gets WAN hedge", () => {
    // 10.x rarely present on fleet NICs — expect fast WAN hedge.
    const peer = "http://10.255.255.1:8434/service/files-blob/t/b?token=x";
    const ms = resolveFilesBlobHedgeMs([peer]);
    assert.equal(ms, FILES_BLOB_HEDGE_MS_WAN);
});

test("gateway class retries WAN after gw-LAN mid-stream abort (same-class claim)", async () => {
    // WHY: Cap WAN→Neu — GET .200 aborted mid-body; claim() used to block WAN URL.
    const root = await mkdtemp(join(tmpdir(), "cwsp-blob-retry-"));
    const dest = join(root, "out.bin");
    let lanHits = 0;
    const peerSrv: Server = createServer((req) => {
        req.socket.setTimeout(30_000);
    });
    const lanSrv: Server = createServer((_req, res) => {
        lanHits++;
        res.writeHead(200, {
            "Content-Type": "application/octet-stream",
            "Content-Length": "1000000",
        });
        res.write("partial");
        // Abort mid-stream so the client errors after claim.
        res.destroy();
    });
    const wanSrv: Server = createServer((_req, res) => {
        res.writeHead(200, { "Content-Length": "4" });
        res.end("WAN!");
    });
    await new Promise<void>((r) => peerSrv.listen(0, "127.0.0.1", r));
    await new Promise<void>((r) => lanSrv.listen(0, "127.0.0.1", r));
    await new Promise<void>((r) => wanSrv.listen(0, "127.0.0.1", r));
    const peerPort = (peerSrv.address() as { port: number }).port;
    const lanPort = (lanSrv.address() as { port: number }).port;
    const wanPort = (wanSrv.address() as { port: number }).port;
    const peerUrl = `http://127.0.0.1:${peerPort}/service/files-blob/t/b?token=p`;
    const lanUrl = `http://127.0.0.1:${lanPort}/files/blob/t/b?token=g`;
    const wanUrl = `http://127.0.0.1:${wanPort}/files/blob/t/b?token=g`;
    try {
        await httpGetFilesBlobToFileHedged(peerUrl, dest, {
            urls: [peerUrl, lanUrl, wanUrl],
            hedgeMs: FILES_BLOB_HEDGE_MS_WAN,
            timeoutMs: 10_000,
        });
        assert.equal(await readFile(dest, "utf8"), "WAN!");
        assert.ok(lanHits >= 1, "gw LAN must be tried first in gateway class");
    } finally {
        await new Promise<void>((r) => peerSrv.close(() => r()));
        await new Promise<void>((r) => lanSrv.close(() => r()));
        await new Promise<void>((r) => wanSrv.close(() => r()));
        await rm(root, { recursive: true, force: true });
    }
});

test("httpGetFilesBlobBytes hedges when primary is peer-only but urls include gateway", async () => {
    // WHY: files-hub used to call GET(primary) without urls[] — WAN broke.
    const peerSrv: Server = createServer((req) => {
        req.socket.setTimeout(30_000);
    });
    const gwSrv: Server = createServer((_req, res) => {
        res.writeHead(200, { "Content-Length": "3" });
        res.end("ok!");
    });
    await new Promise<void>((resolve) => peerSrv.listen(0, "127.0.0.1", resolve));
    await new Promise<void>((resolve) => gwSrv.listen(0, "127.0.0.1", resolve));
    const peerPort = (peerSrv.address() as { port: number }).port;
    const gwPort = (gwSrv.address() as { port: number }).port;
    const peerUrl = `http://127.0.0.1:${peerPort}/service/files-blob/t/b?token=p`;
    const gwUrl = `http://127.0.0.1:${gwPort}/files/blob/t/b?token=g`;
    const t0 = Date.now();
    try {
        const bytes = await httpGetFilesBlobBytes(peerUrl, {
            urls: [peerUrl, gwUrl],
            timeoutMs: 10_000,
            hedgeMs: FILES_BLOB_HEDGE_MS_WAN,
        });
        assert.equal(Buffer.from(bytes).toString("utf8"), "ok!");
        assert.ok(
            Date.now() - t0 < 2_000,
            `must hedge to gateway (~${FILES_BLOB_HEDGE_MS_WAN}ms), not full peer hang`,
        );
    } finally {
        await new Promise<void>((resolve) => peerSrv.close(() => resolve()));
        await new Promise<void>((resolve) => gwSrv.close(() => resolve()));
    }
});
