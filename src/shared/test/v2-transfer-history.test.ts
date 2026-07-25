/*
 * Filename: v2-transfer-history.test.ts
 * FullPath: modules/projects/cwsp-shared/test/v2-transfer-history.test.ts
 * Change date and time: 21.32.00_25.07.2026
 * Reason for changes: Ring GC, upsert-by-transferId, progress merge, actions.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    TRANSFER_HISTORY_MAX,
    actionsForEntry,
    createTransferHistoryStore,
    formatTransferBytes,
    formatTransferSpeed,
    isHistoryImageDataUrl,
    isMutedHistoryStatus,
    parseTransferHistory,
    serializeTransferHistory,
    transferProgressRatio,
    type TransferHistoryEntry
} from "../src/v2/transfer-history.ts";

function base(partial: Partial<TransferHistoryEntry> & Pick<TransferHistoryEntry, "id" | "kind">): TransferHistoryEntry {
    return {
        ts: Date.now(),
        direction: "in",
        status: "actionable",
        title: "test",
        ...partial
    };
}

describe("transfer-history store", () => {
    it("GCs to max 100 keeping newest", () => {
        const store = createTransferHistoryStore({ max: 100 });
        for (let i = 0; i < 120; i++) {
            store.push(
                base({
                    id: `e-${i}`,
                    kind: "clipboard-text",
                    ts: 1_000 + i,
                    title: `n${i}`
                })
            );
        }
        const list = store.list();
        assert.equal(list.length, TRANSFER_HISTORY_MAX);
        assert.equal(list[0]!.id, "e-119");
        assert.ok(!list.some((e) => e.id === "e-0"));
    });

    it("upserts by transferId instead of duplicating", () => {
        const store = createTransferHistoryStore();
        store.push(
            base({
                id: "a",
                kind: "files",
                transferId: "t1",
                status: "actionable",
                title: "Offer"
            })
        );
        store.upsert(
            base({
                id: "b",
                kind: "files",
                transferId: "t1",
                status: "progress",
                title: "Transfer",
                bytesDone: 10,
                totalBytes: 100
            })
        );
        const list = store.list();
        assert.equal(list.length, 1);
        assert.equal(list[0]!.id, "a");
        assert.equal(list[0]!.status, "progress");
        assert.equal(list[0]!.bytesDone, 10);
    });

    it("progress→done merges in-place with lastActionAt (no second row)", () => {
        const store = createTransferHistoryStore();
        store.push(
            base({
                id: "t-done",
                kind: "files",
                transferId: "xfer-done",
                status: "progress",
                title: "Transferring",
                bytesDone: 50,
                totalBytes: 100,
                ts: 1_000
            })
        );
        store.upsert(
            base({
                id: "t-done-other",
                kind: "files",
                transferId: "xfer-done",
                status: "done",
                title: "Files received",
                bytesDone: 100,
                totalBytes: 100,
                ts: 2_000
            })
        );
        const list = store.list();
        assert.equal(list.length, 1);
        assert.equal(list[0]!.id, "t-done");
        assert.equal(list[0]!.status, "done");
        assert.equal(list[0]!.ts, 1_000);
        assert.equal(list[0]!.lastActionAt, 2_000);
        assert.equal(list[0]!.bytesDone, 100);
    });

    it("clipboard done merges by id/contentKey with lastActionAt", () => {
        const store = createTransferHistoryStore();
        store.push(
            base({
                id: "clip-1",
                kind: "clipboard-text",
                status: "actionable",
                contentKey: "hello",
                textPreview: "hello",
                ts: 5_000
            })
        );
        store.upsert(
            base({
                id: "clip-1",
                kind: "clipboard-text",
                status: "done",
                contentKey: "hello",
                ts: 6_000
            })
        );
        store.upsert(
            base({
                id: "clip-dup",
                kind: "clipboard-text",
                status: "done",
                contentKey: "hello",
                textPreview: "hello",
                ts: 7_000
            })
        );
        const list = store.list();
        assert.equal(list.length, 1);
        assert.equal(list[0]!.id, "clip-1");
        assert.equal(list[0]!.status, "done");
        assert.equal(list[0]!.ts, 5_000);
        assert.ok((list[0]!.lastActionAt ?? 0) >= 6_000);
    });

    it("updateProgress merges onto same transferId row", () => {
        const store = createTransferHistoryStore();
        store.push(
            base({
                id: "f1",
                kind: "files",
                transferId: "xfer-9",
                status: "actionable",
                title: "Files"
            })
        );
        store.updateProgress({
            transferId: "xfer-9",
            bytesDone: 50,
            totalBytes: 200,
            speedBps: 1_024_000,
            etaMs: 150
        });
        store.updateProgress({
            transferId: "xfer-9",
            bytesDone: 100,
            totalBytes: 200,
            speedBps: 2_048_000,
            etaMs: 50
        });
        const list = store.list();
        assert.equal(list.length, 1);
        assert.equal(list[0]!.bytesDone, 100);
        assert.equal(list[0]!.speedBps, 2_048_000);
        assert.equal(list[0]!.status, "progress");
    });

    it("dedupes clipboard contentKey within window", () => {
        const store = createTransferHistoryStore({ clipDedupeMs: 5_000 });
        const t = 10_000;
        store.push(
            base({
                id: "c1",
                kind: "clipboard-text",
                contentKey: "hello",
                ts: t,
                title: "Clip"
            })
        );
        store.push(
            base({
                id: "c2",
                kind: "clipboard-text",
                contentKey: "hello",
                ts: t + 100,
                title: "Clip2",
                textPreview: "hello"
            })
        );
        assert.equal(store.list().length, 1);
        assert.equal(store.list()[0]!.textPreview, "hello");
    });

    it("collapses same-content Accept echoes with different ids", () => {
        const store = createTransferHistoryStore();
        store.push(
            base({
                id: "clip-in-111",
                kind: "clipboard-text",
                status: "actionable",
                retainedText: "https://ozon.ru/product/1",
                textPreview: "https://ozon.ru/product/1",
                ts: 20_000
            })
        );
        store.push(
            base({
                id: "clip-in-222",
                kind: "clipboard-text",
                status: "actionable",
                retainedText: "https://ozon.ru/product/1",
                textPreview: "https://ozon.ru/product/1",
                ts: 20_500
            })
        );
        const list = store.list();
        assert.equal(list.length, 1);
        assert.equal(list[0]!.id, "clip-in-111");
        assert.equal(list[0]!.status, "actionable");
        assert.ok(actionsForEntry(list[0]!).includes("accept"));
        assert.ok(actionsForEntry(list[0]!).includes("open"));
    });

    it("sparse image done merges onto Ask thumb (no broken clone)", () => {
        const store = createTransferHistoryStore();
        store.push(
            base({
                id: "clip-in-ask",
                kind: "clipboard-image",
                status: "actionable",
                contentKey: "img-bytes-4096",
                totalBytes: 4096,
                thumbDataUrl: "data:image/png;base64,aaa",
                ts: 30_000
            })
        );
        // Cap Accept often emits hash key + status only (no thumb).
        store.push(
            base({
                id: "clip-in-done-hash",
                kind: "clipboard-image",
                status: "done",
                contentKey: "sha256:deadbeef",
                ts: 30_200
            })
        );
        const list = store.list();
        assert.equal(list.length, 1);
        assert.equal(list[0]!.id, "clip-in-ask");
        assert.equal(list[0]!.status, "done");
        assert.equal(list[0]!.thumbDataUrl, "data:image/png;base64,aaa");
        assert.ok(actionsForEntry(list[0]!).includes("open"));
        assert.ok(actionsForEntry(list[0]!).includes("download"));
        assert.ok(actionsForEntry(list[0]!).includes("remove"));
    });

    it("mark expired and serialize roundtrip", () => {
        const store = createTransferHistoryStore();
        store.push(
            base({
                id: "x1",
                kind: "files",
                transferId: "tx",
                status: "actionable",
                title: "Offer"
            })
        );
        store.mark("tx", "expired");
        const e = store.get("x1")!;
        assert.equal(e.status, "expired");
        assert.equal(isMutedHistoryStatus(e.status), true);
        assert.deepEqual(actionsForEntry(e), ["remove"]);

        const raw = serializeTransferHistory(store.list());
        const parsed = parseTransferHistory(raw);
        assert.equal(parsed.length, 1);
        assert.equal(parsed[0]!.status, "expired");
    });
});

describe("transfer-history helpers", () => {
    it("formatTransferBytes and isHistoryImageDataUrl", () => {
        assert.equal(formatTransferBytes(512), "512 B");
        assert.equal(formatTransferBytes(2048), "2.0 KB");
        assert.equal(isHistoryImageDataUrl("data:image/png;base64,aaa"), true);
        assert.equal(isHistoryImageDataUrl("https://x/a.png"), false);
    });

    it("actionsForEntry inbound clipboard/image/files", () => {
        assert.deepEqual(
            actionsForEntry(
                base({
                    id: "1",
                    kind: "clipboard-text",
                    status: "actionable",
                    textPreview: "https://example.com/a"
                })
            ),
            ["accept", "dismiss", "open", "share", "remove"]
        );
        assert.ok(
            actionsForEntry(
                base({ id: "2", kind: "clipboard-image", status: "actionable" })
            ).includes("download")
        );
        // WHY: images → Open + Save (+ reveal) + Share again + Remove.
        assert.deepEqual(
            actionsForEntry(
                base({
                    id: "2b",
                    kind: "clipboard-image",
                    status: "actionable",
                    localFilePath: "C:\\cwsp\\.data\\transfer-history-assets\\h.png"
                })
            ),
            ["accept", "dismiss", "open", "download", "reveal", "share", "remove"]
        );
        // Outgoing image / former clipboard — Share again when payload retained.
        assert.deepEqual(
            actionsForEntry(
                base({
                    id: "2c",
                    kind: "clipboard-image",
                    direction: "out",
                    status: "done",
                    thumbDataUrl: "data:image/png;base64,aaa",
                    localFilePath: "/tmp/h.png"
                })
            ),
            ["share", "open", "download", "reveal", "remove"]
        );
        assert.ok(
            actionsForEntry(
                base({
                    id: "2d",
                    kind: "clipboard-text",
                    direction: "out",
                    status: "done",
                    retainedText: "https://ozon.ru/product/1",
                    textPreview: "https://ozon.ru/product/1"
                })
            ).includes("share")
        );
        assert.deepEqual(
            actionsForEntry(
                base({ id: "3", kind: "files", status: "actionable" })
            ),
            ["accept", "decline", "remove"]
        );
        assert.deepEqual(
            actionsForEntry(
                base({
                    id: "4",
                    kind: "files",
                    direction: "out",
                    status: "progress"
                })
            ),
            ["cancel", "remove"]
        );
        // WHY: clipboard archive keeps Accept/Open after toast TTL / done.
        assert.deepEqual(
            actionsForEntry(
                base({
                    id: "5",
                    kind: "clipboard-text",
                    status: "done",
                    textPreview: "https://example.com/b"
                })
            ),
            ["accept", "open", "share", "remove"]
        );
        assert.deepEqual(
            actionsForEntry(
                base({
                    id: "6",
                    kind: "clipboard-text",
                    status: "expired",
                    retainedText: "hello"
                })
            ),
            ["accept", "share", "remove"]
        );
        // Remove available on residual / muted rows too.
        assert.deepEqual(
            actionsForEntry(
                base({ id: "7", kind: "files", status: "expired" })
            ),
            ["remove"]
        );
        assert.deepEqual(
            actionsForEntry(
                base({ id: "8", kind: "files", status: "done", direction: "in" })
            ),
            ["reveal", "remove"]
        );
        // WHY: singleton received file → Open + Reveal (notif "Open File" parity).
        assert.deepEqual(
            actionsForEntry(
                base({
                    id: "8b",
                    kind: "files",
                    status: "done",
                    direction: "in",
                    subtitle: "1 file(s)",
                    fileNames: ["photo.jpg"],
                    localFilePath: "/tmp/landing/photo.jpg"
                })
            ),
            ["open", "reveal", "remove"]
        );
        assert.deepEqual(
            actionsForEntry(
                base({
                    id: "8c",
                    kind: "files",
                    status: "done",
                    direction: "in",
                    subtitle: "3 file(s)",
                    fileNames: ["a", "b", "c"]
                })
            ),
            ["reveal", "remove"]
        );
    });

    it("remove drops a row by id or transferId", () => {
        const store = createTransferHistoryStore();
        store.push(base({ id: "r1", kind: "files", transferId: "tx-r", status: "done" }));
        store.push(base({ id: "r2", kind: "clipboard-text", status: "expired" }));
        assert.equal(store.remove("tx-r"), true);
        assert.equal(store.list().length, 1);
        assert.equal(store.list()[0]!.id, "r2");
        assert.equal(store.remove("r2"), true);
        assert.equal(store.list().length, 0);
        assert.equal(store.remove("missing"), false);
    });

    it("formatTransferSpeed and progress ratio", () => {
        assert.equal(formatTransferSpeed(0), "—");
        assert.match(formatTransferSpeed(1_500_000), /MB\/s/);
        assert.equal(
            transferProgressRatio(
                base({
                    id: "p",
                    kind: "files",
                    bytesDone: 25,
                    totalBytes: 100
                })
            ),
            0.25
        );
    });

    it("subscribe notifies on push", () => {
        const store = createTransferHistoryStore();
        let n = 0;
        const unsub = store.subscribe(() => {
            n++;
        });
        store.push(base({ id: "s1", kind: "clipboard-text" }));
        assert.equal(n, 1);
        unsub();
        store.push(base({ id: "s2", kind: "clipboard-text" }));
        assert.equal(n, 1);
    });
});
