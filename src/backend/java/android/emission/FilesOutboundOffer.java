/*
 * Filename: FilesOutboundOffer.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesOutboundOffer.java
 * Change date and time: 20.40.00_21.07.2026
 * Reason for changes: Native Share / Open-with must auto-send files:offer without
 *   an extra "Open for Share" notification or opening MainActivity. ShareActivity
 *   has no WebView — pack + putBlob + WS offer here so peers get Accept immediately;
 *   download still happens only on Accept (HTTP pull).
 *   2026-07-21i: large raw files stream via putFile + sha256HexFile — never
 *   materializeBatch into a 100–512 MiB byte[] (Android allocation limit).
 *   2026-07-22: when Cap endpoint is gateway (.200/WAN), mirror putBlob to
 *   `/files/blob` so LTE/WAN Accept can HTTP-GET a public URL.
 *   2026-07-22c: large (>64MiB) mirror was background-only (LAN-fast Accept).
 *   2026-07-22j: always sync-mirror before offer — WAN/WAN hundreds-of-MiB
 *   failed because bg mirror left Cap LAN URLs that LTE peers cannot GET.
 *   2026-07-22d: outgoing upload progress (upload icon + speed) + Abort;
 *   sender abort → files:error aborted + peer Aborted summary.
 *   2026-07-22f: complete on files:done / HTTP batches served; embedded-only
 *   offers complete on files:accept; sync gateway mirror shows "Publishing…"
 *   so the bar does not look frozen after local put.
 *   2026-07-22g: onBlobServing at GET start leaves "waiting for Accept"; soft
 *   session resolve when relay mangles transferId.
 *   2026-07-22h: peer GET serve progress → filled bar + speed on sender notif.
 *   2026-07-22i: WAN/WAN — mirror retries public WAN base when LAN .200 PUT fails;
 *   gateway base falls back via FilesBlobStore.resolveGatewayBlobBase.
 *   2026-07-22j: drop bg-mirror-before-offer for large files — sync PUT so
 *   hundreds-of-MiB WAN Accept has gateway bytes (progress: Publishing…).
 *   2026-07-22k: gateway mirror bytes are real upload work (addWork + bar/speed).
 *   2026-07-22l: stabilize WAN Uploading — WAN-first mirror bases, main-thread
 *   coalesced progress, Failed notif (no Cap-LAN-only offer after mirror miss).
 *   2026-07-22m: after Accept, gateway-mirrored offers never see local GET —
 *   arm a done-watchdog so "peer downloading…" cannot hang when files:done is
 *   lost (WS flap during long WAN Accept). Cancel watchdog on real done/serve.
 *   2026-07-22n: per-peer outgoing notifs — each Accept gets its own bar
 *   (files:progress / files:done keyed by peerId); whole Abort vs abortPeer.
 *   2026-07-22o: LAN-only destinations skip sync gateway mirror (P2P Cap
 *   Control URL first); Accept always peer→gwLAN→WAN with short private timeout.
 *   2026-07-22s: best-effort gateway mirror even for LAN-looking dests so
 *   Accept hedge always has a gateway ramp; order stays peer-first (no flip).
 *   2026-07-22q: multi-peer Sending bars — attribute Cap Control GET by remote
 *   IP; stall-pulse when files:progress/GET ticks stop so the bar does not look
 *   frozen mid-send.
 *   2026-07-22r: Sending UI can freeze while peers already have files — coalesce
 *   shade updates; auto-leg from GET remote IP when files:accept is late;
 *   stall-pulse re-paints last determinate % (OEM refresh without reset).
 *   2026-07-22x: Cap↔Cap P2P — advertise detectLanIpv4() as primary Control base
 *   (not only hardcoded L-196→.196 map) + fleet IP alias in asset.urls so the
 *   peer can HEAD/GET the real NIC; LAN-only dests keep Cap URL if gateway
 *   mirror fails (was hard-fail → Cap never even offered a P2P path).
 *
 * INVARIANT: does not open Activities. Progress via FilesOutgoingNotifier.
 */
package emission;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import core.Configure;
import space.u2re.cwsp.ControlApiServer;
import space.u2re.cwsp.CwspBridgeService;
import space.u2re.cwsp.CwspWsClient;

/**
 * Auto-offer staged Share/Open-with files over {@code files:offer} from Java.
 */
public final class FilesOutboundOffer {
    private static final String TAG = "emission.FilesOutboundOffer";
    /** Mirror cwsp-shared SMALL_FILE_MAX — above this use HTTP putBlob URL. */
    private static final long SMALL_FILE_MAX = 500L * 1024L;
    /** Do not base64 across WS above this — always putBlob. */
    private static final long WS_EMBED_MAX = 4L * 1024L * 1024L;
    private static final long OFFER_TTL_MS = 30L * 60L * 1000L;
    private static final long PROGRESS_MIN_INTERVAL_MS = 400L;
    /** Main-thread posts for NotificationManager (OEM-stable). */
    private static final Handler MAIN = new Handler(Looper.getMainLooper());

    /** Live outbound sessions — Abort needs destinations + file counts. */
    private static final ConcurrentHashMap<String, OutboundSession> SESSIONS =
            new ConcurrentHashMap<>();

    private static final class OutboundSession {
        final List<String> destinations;
        final int fileCount;
        volatile int prepared; // batches prepared before offer / abort
        /** BatchIds successfully HTTP-served to a peer (fallback when files:done missing). */
        final java.util.Set<String> servedBatchIds =
                java.util.Collections.newSetFromMap(new ConcurrentHashMap<>());
        /**
         * Batches advertised with an HTTP URL (not base64 embed).
         * WHY: embedded batches never hit ControlApiServer GET — waiting for
         * {@code expectedBatches} served would hang forever without files:done.
         */
        final java.util.Set<String> expectedHttpBatchIds =
                java.util.Collections.newSetFromMap(new ConcurrentHashMap<>());
        /** Declared size per HTTP batch — drives peer-download progress bar. */
        final ConcurrentHashMap<String, Long> httpBatchSizes = new ConcurrentHashMap<>();
        volatile long serveTotalBytes;
        /** Bytes from fully completed GET batches (base for in-flight current). */
        volatile long serveBaseBytes;
        volatile long serveSpeedBps;
        volatile long serveLastSampleMs;
        volatile long serveLastSampleBytes;
        volatile long serveLastNotifyMs;
        volatile int expectedBatches;
        /**
         * HTTP batches whose primary URL is gateway/relay (not Cap Control).
         * WHY: peer GET hits gateway — Cap never gets onBlobServed; completion
         * depends on files:done (lossy over WAN) unless we arm a watchdog.
         */
        final java.util.Set<String> remoteHttpBatchIds =
                java.util.Collections.newSetFromMap(new ConcurrentHashMap<>());
        /** One shade/progress leg per Accepting peer. */
        final ConcurrentHashMap<String, PeerLeg> peers = new ConcurrentHashMap<>();

        OutboundSession(List<String> destinations, int fileCount) {
            this.destinations = destinations != null
                    ? new ArrayList<>(destinations) : new ArrayList<>();
            this.fileCount = Math.max(0, fileCount);
            this.expectedBatches = Math.max(0, fileCount);
        }

        void noteHttpBatch(String batchId, long size) {
            if (batchId == null || batchId.isEmpty()) return;
            expectedHttpBatchIds.add(batchId);
            long sz = Math.max(0L, size);
            Long prev = httpBatchSizes.put(batchId, sz);
            if (prev != null) serveTotalBytes -= Math.max(0L, prev);
            serveTotalBytes += sz;
        }

        void markRemoteHttpBatch(String batchId) {
            if (batchId == null || batchId.isEmpty()) return;
            remoteHttpBatchIds.add(batchId);
        }

        /** True when every advertised HTTP batch is gateway/relay-served. */
        boolean isFullyRemoteHttp() {
            if (expectedHttpBatchIds.isEmpty()) return false;
            return remoteHttpBatchIds.containsAll(expectedHttpBatchIds);
        }

        int downloadingCount() {
            int n = 0;
            for (PeerLeg p : peers.values()) {
                if (p != null && p.state == PeerLeg.DOWNLOADING) n++;
            }
            return n;
        }

        int namedDestinationCount() {
            int n = 0;
            for (String d : destinations) {
                if (d == null) continue;
                String s = d.trim();
                if (s.isEmpty() || "*".equals(s) || "all".equalsIgnoreCase(s)
                        || "broadcast".equalsIgnoreCase(s)) {
                    continue;
                }
                n++;
            }
            return n;
        }
    }

    /** One Accepting peer's outgoing progress leg. */
    private static final class PeerLeg {
        static final int DOWNLOADING = 1;
        static final int DONE = 2;
        static final int DECLINED = 3;
        static final int ABORTED = 4;

        final String peerId;
        volatile int state = DOWNLOADING;
        volatile long bytesDone;
        volatile long totalBytes;
        volatile long speedBps;
        volatile long lastSampleMs;
        volatile long lastSampleBytes;
        volatile long lastNotifyMs;
        volatile long serveBaseBytes;
        final java.util.Set<String> servedBatchIds =
                java.util.Collections.newSetFromMap(new ConcurrentHashMap<>());
        volatile Runnable doneWatchdog;
        /** Repaint indeterminate when GET/progress ticks stall (bar looks frozen). */
        volatile Runnable stallPulse;
        volatile long lastProgressUiMs;

        PeerLeg(String peerId) {
            this.peerId = peerId != null ? peerId : "peer";
            long now = System.currentTimeMillis();
            this.lastSampleMs = now;
            this.lastSampleBytes = 0L;
            this.lastProgressUiMs = now;
        }

        boolean isTerminal() {
            return state == DONE || state == DECLINED || state == ABORTED;
        }
    }

    /**
     * EMA upload progress → FilesOutgoingNotifier.
     * WHY: local Cap putBlob AND gateway mirror PUT are both real upload work.
     * Gateway phase uses {@link #addWork} so the bar/speed/ETA cover both legs
     * (e.g. 200 MiB file → 400 MiB total when mirroring through the relay).
     */
    private static final class UploadProgress {
        final Context app;
        final String transferId;
        private final Object lock = new Object();
        long completedBytes;
        long totalBytes;
        long speedBps;
        long lastSampleMs;
        long lastSampleBytes;
        long lastNotifyMs;
        String label = "Uploading";
        /** Once true, ignore further put/mirror byte ticks (offer already out). */
        volatile boolean sealed;
        private Runnable pendingNotify;

        UploadProgress(Context app, String transferId, long totalBytes) {
            this.app = app;
            this.transferId = transferId != null ? transferId : "";
            this.totalBytes = Math.max(0L, totalBytes);
            long now = System.currentTimeMillis();
            this.lastSampleMs = now;
            this.lastNotifyMs = 0L;
        }

        void setLabel(String label) {
            if (label != null && !label.isEmpty()) {
                synchronized (lock) {
                    this.label = label;
                }
            }
        }

        void seal() {
            sealed = true;
            synchronized (lock) {
                if (pendingNotify != null) {
                    MAIN.removeCallbacks(pendingNotify);
                    pendingNotify = null;
                }
            }
        }

        /** Grow denominator when gateway mirror (or another leg) is about to run. */
        void addWork(long bytes) {
            if (sealed || bytes <= 0) return;
            synchronized (lock) {
                totalBytes += bytes;
            }
        }

        /** Drop planned work that will not run (mirror skipped/failed). */
        void removeWork(long bytes) {
            if (sealed || bytes <= 0) return;
            long shown;
            synchronized (lock) {
                totalBytes = Math.max(completedBytes, totalBytes - bytes);
                shown = completedBytes;
            }
            reportAbsolute(shown, true);
        }

        /** Force a progress notify with a new label (e.g. gateway publish). */
        void pulse(String nextLabel) {
            if (sealed) return;
            setLabel(nextLabel);
            long shown;
            synchronized (lock) {
                shown = totalBytes > 0 ? Math.min(completedBytes, totalBytes) : completedBytes;
            }
            reportAbsolute(shown, true);
        }

        void addCompleted(long bytes) {
            if (sealed) return;
            long shown;
            synchronized (lock) {
                if (bytes > 0) completedBytes += bytes;
                shown = totalBytes > 0 ? Math.min(completedBytes, totalBytes) : completedBytes;
            }
            reportAbsolute(shown, true);
        }

        void reportInFlight(long bytesInCurrent) {
            if (sealed) return;
            long abs;
            synchronized (lock) {
                abs = completedBytes + Math.max(0L, bytesInCurrent);
                if (totalBytes > 0) abs = Math.min(abs, totalBytes);
            }
            reportAbsolute(abs, false);
        }

        private void reportAbsolute(long absoluteDone, boolean force) {
            if (sealed) return;
            final String title;
            final long done;
            final long tot;
            final long spd;
            final Long eta;
            synchronized (lock) {
                long now = System.currentTimeMillis();
                long dt = now - lastSampleMs;
                if (dt >= 200L && absoluteDone >= lastSampleBytes) {
                    long delta = absoluteDone - lastSampleBytes;
                    if (delta > 0 && dt > 0) {
                        double inst = (delta * 1000.0) / (double) dt;
                        speedBps = speedBps > 0
                                ? Math.round(0.35 * inst + 0.65 * speedBps)
                                : Math.round(inst);
                    }
                    lastSampleMs = now;
                    lastSampleBytes = absoluteDone;
                }
                if (!force && lastNotifyMs > 0 && (now - lastNotifyMs) < PROGRESS_MIN_INTERVAL_MS) {
                    return;
                }
                lastNotifyMs = now;
                title = label;
                done = absoluteDone;
                tot = totalBytes;
                spd = speedBps;
                if (totalBytes > 0 && speedBps > 1 && absoluteDone < totalBytes) {
                    long remaining = totalBytes - absoluteDone;
                    eta = Math.round((remaining * 1000.0) / (double) speedBps);
                } else {
                    eta = null;
                }
                if (pendingNotify != null) {
                    MAIN.removeCallbacks(pendingNotify);
                }
                pendingNotify = () -> {
                    if (sealed) return;
                    FilesOutgoingNotifier.notifyProgressBytes(
                            app, transferId, title, done, tot, spd, eta);
                };
                MAIN.post(pendingNotify);
            }
        }
    }

    private FilesOutboundOffer() { /* no instances */ }

    public static boolean hasSession(String transferId) {
        return resolveSession(transferId) != null;
    }

    /**
     * Resolve live outbound session by transferId.
     * COMPAT: exact key, then case-insensitive, then sole live session when tid empty.
     */
    public static String resolveSessionId(String transferId) {
        String tid = transferId != null ? transferId.trim() : "";
        if (!tid.isEmpty() && SESSIONS.containsKey(tid)) return tid;
        if (!tid.isEmpty()) {
            for (String key : SESSIONS.keySet()) {
                if (key != null && key.equalsIgnoreCase(tid)) return key;
            }
        }
        // WHY: gateway may drop/reshape transferId; one Share at a time is typical.
        if (SESSIONS.size() == 1) {
            java.util.Iterator<String> it = SESSIONS.keySet().iterator();
            return it.hasNext() ? it.next() : "";
        }
        return "";
    }

    private static OutboundSession resolveSession(String transferId) {
        String id = resolveSessionId(transferId);
        return id.isEmpty() ? null : SESSIONS.get(id);
    }

    /** COMPAT: no remote host. */
    public static void onBlobServing(Context context, String transferId, String batchId) {
        onBlobServing(context, transferId, batchId, null);
    }

    /**
     * Peer started HTTP GET against local Cap blob.
     * @param remoteHost TCP peer IP (maps to L-xxx when multi-Accept).
     */
    public static void onBlobServing(
            Context context,
            String transferId,
            String batchId,
            String remoteHost
    ) {
        if (context == null) return;
        String tid = resolveSessionId(transferId);
        if (tid.isEmpty()) return;
        OutboundSession session = SESSIONS.get(tid);
        if (session == null) return;
        PeerLeg leg = resolveServePeer(session, remoteHost);
        if (leg == null) {
            // WHY: files:accept often arrives after the first Cap GET byte —
            // without a leg, serve progress is dropped and Sending never moves.
            String inferred = inferPeerIdFromRemote(session, remoteHost);
            if (inferred != null && !inferred.isEmpty()) {
                onPeerAccepted(context, tid, inferred);
                session = SESSIONS.get(tid);
                leg = session != null ? resolveServePeer(session, remoteHost) : null;
            }
        }
        if (session == null || leg == null) return;
        long now = System.currentTimeMillis();
        leg.lastSampleMs = now;
        leg.lastSampleBytes = leg.serveBaseBytes;
        leg.lastNotifyMs = 0L;
        reportPeerServeProgress(context.getApplicationContext(), tid, session, leg,
                leg.serveBaseBytes, true);
        Log.i(TAG, "blob serving transferId=" + tid + " peer=" + leg.peerId
                + " remote=" + remoteHost + " batch=" + batchId
                + " total=" + session.serveTotalBytes);
    }

    /** COMPAT: no remote host. */
    public static void onBlobServeProgress(
            Context context,
            String transferId,
            String batchId,
            long bytesInBatch,
            long batchSize
    ) {
        onBlobServeProgress(context, transferId, batchId, bytesInBatch, batchSize, null);
    }

    /**
     * Mid-stream bytes while Cap serves a local blob GET to the peer.
     * @param bytesInBatch bytes written so far for the current batch (0..batchSize)
     * @param batchSize    Content-Length of the current batch (0 if unknown)
     * @param remoteHost   TCP peer IP for multi-peer attribution
     */
    public static void onBlobServeProgress(
            Context context,
            String transferId,
            String batchId,
            long bytesInBatch,
            long batchSize,
            String remoteHost
    ) {
        if (context == null) return;
        String tid = resolveSessionId(transferId);
        if (tid.isEmpty()) return;
        OutboundSession session = SESSIONS.get(tid);
        if (session == null) return;
        PeerLeg leg = resolveServePeer(session, remoteHost);
        if (leg == null) {
            String inferred = inferPeerIdFromRemote(session, remoteHost);
            if (inferred != null && !inferred.isEmpty()) {
                onPeerAccepted(context, tid, inferred);
                session = SESSIONS.get(tid);
                leg = session != null ? resolveServePeer(session, remoteHost) : null;
            }
        }
        if (session == null || leg == null) return;
        if (batchId != null && !batchId.isEmpty() && batchSize > 0
                && !session.httpBatchSizes.containsKey(batchId)) {
            session.noteHttpBatch(batchId, batchSize);
        }
        long abs = leg.serveBaseBytes + Math.max(0L, bytesInBatch);
        if (session.serveTotalBytes > 0) {
            abs = Math.min(abs, session.serveTotalBytes);
        }
        reportPeerServeProgress(context.getApplicationContext(), tid, session, leg, abs, false);
    }

    private static PeerLeg soleDownloadingPeer(OutboundSession session) {
        if (session == null) return null;
        PeerLeg one = null;
        for (PeerLeg p : session.peers.values()) {
            if (p == null || p.state != PeerLeg.DOWNLOADING) continue;
            if (one != null) return null;
            one = p;
        }
        return one;
    }

    /**
     * Map Cap Control GET remote IP → Accepting peer leg.
     * WHY: with 2+ downloading peers, soleDownloadingPeer is null and Sending
     * bars froze unless we attribute by TCP client address.
     */
    private static PeerLeg resolveServePeer(OutboundSession session, String remoteHost) {
        if (session == null) return null;
        String rh = normalizeRemoteHost(remoteHost);
        if (!rh.isEmpty()) {
            // Gateway pulls are not Cap Control P2P — do not mis-attribute.
            if (FilesBlobStore.isLanGatewayHost(rh)) {
                return soleDownloadingPeer(session);
            }
            for (PeerLeg p : session.peers.values()) {
                if (p == null || p.state != PeerLeg.DOWNLOADING) continue;
                String lan = lanHostFromClientId(p.peerId);
                if (lan != null && lan.equalsIgnoreCase(rh)) return p;
                if (p.peerId != null && p.peerId.toLowerCase(java.util.Locale.US)
                        .contains(rh.toLowerCase(java.util.Locale.US))) {
                    return p;
                }
            }
        }
        return soleDownloadingPeer(session);
    }

    private static String normalizeRemoteHost(String remoteHost) {
        String rh = remoteHost != null ? remoteHost.trim() : "";
        if (rh.startsWith("/")) rh = rh.substring(1);
        // Strip :port if present (IPv4 only).
        int colon = rh.indexOf(':');
        if (colon > 0 && rh.indexOf(':') == rh.lastIndexOf(':')) {
            rh = rh.substring(0, colon);
        }
        return rh;
    }

    /** Match GET remote IP to a named destination clientId (L-…). */
    private static String inferPeerIdFromRemote(OutboundSession session, String remoteHost) {
        if (session == null) return null;
        String rh = normalizeRemoteHost(remoteHost);
        if (rh.isEmpty() || FilesBlobStore.isLanGatewayHost(rh)) return null;
        if (session.destinations != null) {
            for (String d : session.destinations) {
                if (d == null) continue;
                String dest = d.trim();
                if (dest.isEmpty() || "*".equals(dest) || "all".equalsIgnoreCase(dest)
                        || "broadcast".equalsIgnoreCase(dest)) {
                    continue;
                }
                String lan = lanHostFromClientId(dest);
                if (lan != null && lan.equalsIgnoreCase(rh)) return dest;
                if (dest.toLowerCase(java.util.Locale.US)
                        .contains(rh.toLowerCase(java.util.Locale.US))) {
                    return dest;
                }
            }
        }
        // Fallback: synthesize L-<ip> so the bar still has a peer key.
        if (rh.matches("^\\d{1,3}(?:\\.\\d{1,3}){3}$")) {
            return "L-" + rh;
        }
        return null;
    }

    private static void reportPeerServeProgress(
            Context app,
            String tid,
            OutboundSession session,
            PeerLeg leg,
            long absoluteDone,
            boolean force
    ) {
        if (session == null || app == null || leg == null) return;
        long now = System.currentTimeMillis();
        long dt = now - leg.lastSampleMs;
        if (dt >= 200L && absoluteDone >= leg.lastSampleBytes) {
            long delta = absoluteDone - leg.lastSampleBytes;
            if (delta > 0 && dt > 0) {
                double inst = (delta * 1000.0) / (double) dt;
                leg.speedBps = leg.speedBps > 0
                        ? Math.round(0.35 * inst + 0.65 * leg.speedBps)
                        : Math.round(inst);
            }
            leg.lastSampleMs = now;
            leg.lastSampleBytes = absoluteDone;
        }
        if (!force && leg.lastNotifyMs > 0
                && (now - leg.lastNotifyMs) < PROGRESS_MIN_INTERVAL_MS) {
            return;
        }
        leg.lastNotifyMs = now;
        leg.lastProgressUiMs = now;
        leg.bytesDone = absoluteDone;
        long total = session.serveTotalBytes > 0 ? session.serveTotalBytes : leg.totalBytes;
        leg.totalBytes = total;
        Long eta = null;
        if (total > 0 && leg.speedBps > 1 && absoluteDone < total) {
            eta = Math.round(((total - absoluteDone) * 1000.0) / (double) leg.speedBps);
        }
        String label = session.fileCount > 1
                ? ("Sending " + Math.max(1, leg.servedBatchIds.size() + 1)
                + "/" + session.fileCount)
                : "Sending";
        FilesOutgoingNotifier.notifyPeerProgressBytes(
                app, tid, leg.peerId, label,
                absoluteDone, total, leg.speedBps, eta);
        touchPeerStallPulse(app, tid, session, leg);
    }

    private static final long STALL_PULSE_MS = 2_500L;

    /**
     * While peer leg is live, if no progress UI for {@link #STALL_PULSE_MS},
     * flash indeterminate "Sending…" so the shade does not look frozen.
     */
    private static void touchPeerStallPulse(
            Context app,
            String tid,
            OutboundSession session,
            PeerLeg leg
    ) {
        if (app == null || session == null || leg == null || tid == null) return;
        cancelPeerStallPulse(leg);
        final String sessionTid = tid;
        final String peer = leg.peerId;
        final Context appCtx = app;
        Runnable pulse = new Runnable() {
            @Override
            public void run() {
                OutboundSession live = SESSIONS.get(sessionTid);
                if (live == null) return;
                PeerLeg p = live.peers.get(peer);
                if (p == null || p.state != PeerLeg.DOWNLOADING) return;
                long idle = System.currentTimeMillis() - p.lastProgressUiMs;
                if (idle >= STALL_PULSE_MS) {
                    // WHY: re-paint last determinate % — OEM shade often drops
                    // updates; switching to indeterminate looked like a reset.
                    if (p.totalBytes > 0 && p.bytesDone > 0) {
                        FilesOutgoingNotifier.notifyPeerProgressBytes(
                                appCtx, sessionTid, peer, "Sending…",
                                p.bytesDone, p.totalBytes, p.speedBps, null);
                    } else {
                        FilesOutgoingNotifier.notifyPeerDownloading(
                                appCtx, sessionTid, peer, live.fileCount);
                    }
                    p.lastProgressUiMs = System.currentTimeMillis();
                }
                p.stallPulse = this;
                MAIN.postDelayed(this, STALL_PULSE_MS);
            }
        };
        leg.stallPulse = pulse;
        MAIN.postDelayed(pulse, STALL_PULSE_MS);
    }

    private static void cancelPeerStallPulse(PeerLeg leg) {
        if (leg == null) return;
        Runnable r = leg.stallPulse;
        leg.stallPulse = null;
        if (r != null) {
            try {
                MAIN.removeCallbacks(r);
            } catch (Throwable ignored) { /* */ }
        }
    }

    /** COMPAT: accept without peer id. */
    public static void onPeerAccepted(Context context, String transferId) {
        onPeerAccepted(context, transferId, "");
    }

    /** Peer sent {@code files:accept} — spawn per-peer outgoing notif. */
    public static void onPeerAccepted(Context context, String transferId, String peerId) {
        if (context == null) return;
        Context app = context.getApplicationContext();
        String tid = resolveSessionId(transferId);
        OutboundSession session = tid.isEmpty() ? null : SESSIONS.get(tid);
        if (session == null) return;
        String peer = normalizePeerId(peerId, session);
        PeerLeg existing = session.peers.get(peer);
        if (existing != null && existing.state == PeerLeg.DOWNLOADING) {
            refreshWaiting(app, tid, session);
            return;
        }
        PeerLeg leg = new PeerLeg(peer);
        leg.totalBytes = Math.max(0L, session.serveTotalBytes);
        session.peers.put(peer, leg);
        // WHY: base64-only offers never get a local blob GET; Accept means the
        // peer already has the payload from the offer packet.
        if (session.expectedHttpBatchIds.isEmpty()) {
            onPeerDone(context, tid, peer, session.fileCount);
            return;
        }
        FilesOutgoingNotifier.notifyPeerDownloading(app, tid, peer, session.fileCount);
        leg.lastProgressUiMs = System.currentTimeMillis();
        touchPeerStallPulse(app, tid, session, leg);
        armPeerDoneWatchdog(app, tid, session, leg);
        refreshWaiting(app, tid, session);
        Log.i(TAG, "peer accepted transferId=" + tid + " peer=" + peer
                + " httpBatches=" + session.expectedHttpBatchIds.size()
                + " remoteHttp=" + session.remoteHttpBatchIds.size()
                + " downloading=" + session.downloadingCount());
    }

    /** Inbound {@code files:progress} from an Accepting peer. */
    public static void onPeerProgress(
            Context context,
            String transferId,
            String peerId,
            long bytesDone,
            long totalBytes,
            long speedBps
    ) {
        if (context == null) return;
        Context app = context.getApplicationContext();
        String tid = resolveSessionId(transferId);
        if (tid.isEmpty()) return;
        OutboundSession session = SESSIONS.get(tid);
        if (session == null) return;
        String peer = normalizePeerId(peerId, session);
        PeerLeg leg = session.peers.get(peer);
        if (leg == null) {
            // Late progress before accept frame — create leg.
            onPeerAccepted(context, tid, peer);
            session = SESSIONS.get(tid);
            if (session == null) return;
            leg = session.peers.get(peer);
        }
        if (leg == null || leg.state != PeerLeg.DOWNLOADING) return;
        long done = Math.max(0L, bytesDone);
        long total = Math.max(0L, totalBytes);
        if (total > 0) leg.totalBytes = total;
        else if (session.serveTotalBytes > 0) leg.totalBytes = session.serveTotalBytes;
        leg.bytesDone = done;
        if (speedBps > 0) leg.speedBps = speedBps;
        Long eta = null;
        if (leg.totalBytes > 0 && leg.speedBps > 1 && done < leg.totalBytes) {
            eta = Math.round(((leg.totalBytes - done) * 1000.0) / (double) leg.speedBps);
        }
        leg.lastProgressUiMs = System.currentTimeMillis();
        FilesOutgoingNotifier.notifyPeerProgressBytes(
                app, tid, peer, "Sending",
                done, leg.totalBytes, leg.speedBps, eta);
        touchPeerStallPulse(app, tid, session, leg);
    }

    private static String normalizePeerId(String peerId, OutboundSession session) {
        String p = peerId != null ? peerId.trim() : "";
        if (!p.isEmpty()) return p;
        PeerLeg sole = soleDownloadingPeer(session);
        if (sole != null) return sole.peerId;
        return "peer-" + (session != null ? session.peers.size() + 1 : 1);
    }

    private static void refreshWaiting(Context app, String tid, OutboundSession session) {
        if (app == null || session == null || tid == null) return;
        int named = session.namedDestinationCount();
        int accepted = session.peers.size();
        if (named > 0 && accepted >= named) {
            // All named destinations have a leg — drop waiting shade.
            FilesOutgoingNotifier.cancel(app, tid);
            return;
        }
        FilesOutgoingNotifier.notifyWaiting(app, tid, session.fileCount, accepted, named);
    }

    /**
     * Soft-complete one peer notif if {@code files:done} / local GET never land.
     */
    private static void armPeerDoneWatchdog(
            Context app,
            String tid,
            OutboundSession session,
            PeerLeg leg
    ) {
        if (app == null || session == null || leg == null || tid == null || tid.isEmpty()) return;
        cancelPeerDoneWatchdog(leg);
        final long bytes = Math.max(0L, session.serveTotalBytes);
        final boolean remoteOnly = session.isFullyRemoteHttp();
        long delayMs;
        if (remoteOnly) {
            delayMs = 45_000L + (bytes / 80L);
            if (delayMs < 45_000L) delayMs = 45_000L;
            if (delayMs > 12L * 60L * 1000L) delayMs = 12L * 60L * 1000L;
        } else {
            delayMs = 180_000L + (bytes / 50L);
            if (delayMs < 180_000L) delayMs = 180_000L;
            if (delayMs > 30L * 60L * 1000L) delayMs = 30L * 60L * 1000L;
        }
        final String sessionTid = tid;
        final String peer = leg.peerId;
        final Context appCtx = app;
        Runnable watchdog = () -> {
            OutboundSession live = SESSIONS.get(sessionTid);
            if (live == null) return;
            PeerLeg p = live.peers.get(peer);
            if (p == null || p.state != PeerLeg.DOWNLOADING) return;
            Log.w(TAG, "done-watchdog fired transferId=" + sessionTid
                    + " peer=" + peer + " remoteOnly=" + remoteOnly);
            onPeerDone(appCtx, sessionTid, peer, live.fileCount);
        };
        leg.doneWatchdog = watchdog;
        MAIN.postDelayed(watchdog, delayMs);
        Log.i(TAG, "done-watchdog armed transferId=" + tid + " peer=" + peer
                + " delayMs=" + delayMs + " remoteOnly=" + remoteOnly);
    }

    private static void cancelPeerDoneWatchdog(PeerLeg leg) {
        if (leg == null) return;
        Runnable w = leg.doneWatchdog;
        leg.doneWatchdog = null;
        if (w != null) {
            try {
                MAIN.removeCallbacks(w);
            } catch (Throwable ignored) { /* */ }
        }
    }

    private static void cancelAllPeerWatchdogs(OutboundSession session) {
        if (session == null) return;
        for (PeerLeg p : session.peers.values()) {
            cancelPeerDoneWatchdog(p);
            cancelPeerStallPulse(p);
        }
    }

    private static void cancelAllPeerNotifs(Context app, String tid, OutboundSession session) {
        if (app == null || session == null || tid == null) return;
        for (String peer : session.peers.keySet()) {
            FilesOutgoingNotifier.cancelPeer(app, tid, peer);
        }
    }

    /** COMPAT: done without peer id. */
    public static void onPeerDone(Context context, String transferId, int fileCountHint) {
        onPeerDone(context, transferId, "", fileCountHint);
    }

    /**
     * One peer finished ({@code files:done}) — complete that peer's notif only.
     */
    public static void onPeerDone(
            Context context,
            String transferId,
            String peerId,
            int fileCountHint
    ) {
        if (context == null) return;
        Context app = context.getApplicationContext();
        String tid = resolveSessionId(transferId);
        if (tid.isEmpty()) {
            tid = transferId != null ? transferId.trim() : "";
        }
        OutboundSession session = tid.isEmpty() ? null : SESSIONS.get(tid);
        if (session == null) {
            // No session — best-effort clear legacy single notif.
            FilesOutgoingNotifier.notifyComplete(app, tid, Math.max(0, fileCountHint));
            return;
        }
        String peer = normalizePeerId(peerId, session);
        PeerLeg leg = session.peers.get(peer);
        if (leg == null) {
            leg = new PeerLeg(peer);
            session.peers.put(peer, leg);
        }
        cancelPeerDoneWatchdog(leg);
        cancelPeerStallPulse(leg);
        leg.state = PeerLeg.DONE;
        int count = session.fileCount > 0 ? session.fileCount : Math.max(0, fileCountHint);
        FilesOutgoingNotifier.notifyPeerComplete(app, tid, peer, count);
        refreshWaiting(app, tid, session);
        maybeFinishSession(app, tid, session);
        Log.i(TAG, "peer done transferId=" + tid + " peer=" + peer + " files=" + count
                + " downloadingLeft=" + session.downloadingCount());
    }

    /** Peer declined — dismiss that peer leg (or whole if no peer legs yet). */
    public static void onPeerDeclined(Context context, String transferId) {
        onPeerDeclined(context, transferId, "");
    }

    public static void onPeerDeclined(Context context, String transferId, String peerId) {
        if (context == null) return;
        Context app = context.getApplicationContext();
        String tid = resolveSessionId(transferId);
        if (tid.isEmpty()) return;
        OutboundSession session = SESSIONS.get(tid);
        if (session == null) {
            FilesOutgoingNotifier.cancel(app, tid);
            return;
        }
        String peer = peerId != null ? peerId.trim() : "";
        if (peer.isEmpty() && session.peers.isEmpty()) {
            // Decline before any Accept — cancel waiting offer.
            cancelAllPeerWatchdogs(session);
            SESSIONS.remove(tid);
            FilesOutgoingNotifier.cancel(app, tid);
            FilesTransferControl.clear(tid);
            Log.i(TAG, "offer declined (no peers) transferId=" + tid);
            return;
        }
        if (peer.isEmpty()) peer = normalizePeerId("", session);
        PeerLeg leg = session.peers.get(peer);
        if (leg == null) {
            leg = new PeerLeg(peer);
            session.peers.put(peer, leg);
        }
        cancelPeerDoneWatchdog(leg);
        cancelPeerStallPulse(leg);
        leg.state = PeerLeg.DECLINED;
        FilesOutgoingNotifier.cancelPeer(app, tid, peer);
        refreshWaiting(app, tid, session);
        maybeFinishSession(app, tid, session);
        Log.i(TAG, "peer declined transferId=" + tid + " peer=" + peer);
    }

    /** COMPAT: no remote host. */
    public static void onBlobServed(Context context, String transferId, String batchId) {
        onBlobServed(context, transferId, batchId, null);
    }

    /**
     * Local Cap served a blob GET (peer pull). COMPAT fallback when peer never
     * emits {@code files:done}.
     */
    public static void onBlobServed(
            Context context,
            String transferId,
            String batchId,
            String remoteHost
    ) {
        if (context == null) return;
        String tid = resolveSessionId(transferId);
        if (tid.isEmpty()) return;
        OutboundSession session = SESSIONS.get(tid);
        if (session == null) return;
        PeerLeg leg = resolveServePeer(session, remoteHost);
        if (leg == null) {
            // Multi-peer + unknown remote (e.g. gateway): rely on files:done.
            if (batchId != null && !batchId.isEmpty()) {
                session.servedBatchIds.add(batchId);
            }
            return;
        }
        if (batchId != null && !batchId.isEmpty()) {
            boolean first = leg.servedBatchIds.add(batchId);
            session.servedBatchIds.add(batchId);
            if (first) {
                Long sz = session.httpBatchSizes.get(batchId);
                if (sz != null && sz > 0) {
                    leg.serveBaseBytes += sz;
                }
            }
        }
        int need = !session.expectedHttpBatchIds.isEmpty()
                ? session.expectedHttpBatchIds.size()
                : (session.expectedBatches > 0 ? session.expectedBatches : session.fileCount);
        if (need > 0 && leg.servedBatchIds.size() >= need) {
            onPeerDone(context, tid, leg.peerId, session.fileCount);
        } else if (session.serveTotalBytes > 0) {
            reportPeerServeProgress(context.getApplicationContext(), tid, session, leg,
                    leg.serveBaseBytes, true);
        }
    }

    /**
     * Finish session when every named destination has a terminal peer leg.
     * WHY: wildcard offers keep the session so a late second Accept still gets
     * its own outgoing notif (multi-phone WAN).
     */
    private static void maybeFinishSession(Context app, String tid, OutboundSession session) {
        if (session == null || tid == null) return;
        if (session.downloadingCount() > 0) return;
        int named = session.namedDestinationCount();
        if (named <= 0) {
            // Wildcard / open offer — keep waiting for additional Accepts.
            refreshWaiting(app, tid, session);
            return;
        }
        if (session.peers.size() < named) {
            refreshWaiting(app, tid, session);
            return;
        }
        for (String d : session.destinations) {
            if (d == null) continue;
            String s = d.trim();
            if (s.isEmpty() || "*".equals(s) || "all".equalsIgnoreCase(s)
                    || "broadcast".equalsIgnoreCase(s)) {
                continue;
            }
            PeerLeg p = session.peers.get(s);
            if (p == null || !p.isTerminal()) {
                refreshWaiting(app, tid, session);
                return;
            }
        }
        cancelAllPeerWatchdogs(session);
        SESSIONS.remove(tid);
        FilesOutgoingNotifier.cancel(app, tid);
        FilesTransferControl.clear(tid);
        Log.i(TAG, "session finished transferId=" + tid);
    }

    /**
     * Peer aborted while we were uploading / waiting (inbound files:error).
     * Does not re-broadcast; updates local outgoing notification only.
     */
    public static void onRemoteAbort(
            Context context,
            String transferId,
            int done,
            int remaining
    ) {
        if (context == null) return;
        Context app = context.getApplicationContext();
        String tid = transferId != null ? transferId.trim() : "";
        if (tid.isEmpty()) return;
        FilesTransferControl.requestAbort(tid);
        OutboundSession session = SESSIONS.remove(tid);
        if (session != null) {
            cancelAllPeerWatchdogs(session);
            cancelAllPeerNotifs(app, tid, session);
        }
        int fileCount = session != null ? session.fileCount : Math.max(0, done + remaining);
        int d = done;
        int r = remaining;
        if (r <= 0 && fileCount > 0) r = Math.max(0, fileCount - d);
        try {
            FilesBlobStore.deleteTransfer(app, tid);
        } catch (Throwable ignored) { /* */ }
        FilesOutgoingNotifier.notifyAborted(app, tid, d, r);
        FilesTransferControl.clear(tid);
        Log.i(TAG, "outbound remote-abort transferId=" + tid);
    }

    /**
     * Abort one peer leg only — other peers keep downloading; blobs stay.
     */
    public static void abortPeer(Context context, String transferId, String peerId) {
        if (context == null) return;
        Context app = context.getApplicationContext();
        String tid = transferId != null ? transferId.trim() : "";
        if (tid.isEmpty()) return;
        String peer = peerId != null ? peerId.trim() : "";
        if (peer.isEmpty()) {
            abort(context, tid);
            return;
        }
        OutboundSession session = SESSIONS.get(tid);
        if (session == null) {
            FilesOutgoingNotifier.cancelPeer(app, tid, peer);
            return;
        }
        PeerLeg leg = session.peers.get(peer);
        if (leg == null) {
            FilesOutgoingNotifier.cancelPeer(app, tid, peer);
            return;
        }
        cancelPeerDoneWatchdog(leg);
        cancelPeerStallPulse(leg);
        leg.state = PeerLeg.ABORTED;
        List<String> dest = new ArrayList<>(1);
        dest.add(peer);
        int done = Math.max(0, session.prepared);
        int remaining = Math.max(0, session.fileCount - done);
        if (remaining <= 0 && session.fileCount > 0) remaining = session.fileCount;
        sendFilesErrorAborted(app, tid, dest, done, remaining);
        FilesOutgoingNotifier.cancelPeer(app, tid, peer);
        refreshWaiting(app, tid, session);
        maybeFinishSession(app, tid, session);
        Log.i(TAG, "outbound abortPeer transferId=" + tid + " peer=" + peer);
    }

    /**
     * Abort outbound upload / offered transfer (whole). Disconnects HTTP PUT;
     * invalidates local blobs; notifies peers with {@code files:error} aborted.
     */
    public static void abort(Context context, String transferId) {
        if (context == null) return;
        Context app = context.getApplicationContext();
        String tid = transferId != null ? transferId.trim() : "";
        if (tid.isEmpty()) return;
        FilesTransferControl.requestAbort(tid);
        OutboundSession session = SESSIONS.remove(tid);
        if (session != null) {
            cancelAllPeerWatchdogs(session);
            cancelAllPeerNotifs(app, tid, session);
        }
        int fileCount = session != null ? session.fileCount : 0;
        int done = session != null ? session.prepared : 0;
        int remaining = Math.max(0, fileCount - done);
        if (remaining <= 0 && fileCount > 0) remaining = fileCount;
        try {
            FilesBlobStore.deleteTransfer(app, tid);
        } catch (Throwable t) {
            Log.w(TAG, "deleteTransfer on abort", t);
        }
        if (session != null && !session.destinations.isEmpty()) {
            sendFilesErrorAborted(app, tid, session.destinations, done, remaining);
        }
        FilesOutgoingNotifier.notifyAborted(app, tid, done, remaining);
        FilesTransferControl.clear(tid);
        Log.i(TAG, "outbound abort transferId=" + tid
                + " done=" + done + " remaining=" + remaining);
    }

    /**
     * Pack staged files and send {@code files:offer} to {@code destinations}.
     * @return true if the offer packet was handed to an open WebSocket
     */
    public static boolean offer(
            Context context,
            FilesIngress.StageResult staged,
            List<String> destinations
    ) {
        if (context == null || staged == null || !staged.ok
                || staged.transferId == null || staged.files == null || staged.files.isEmpty()) {
            return false;
        }
        List<String> dest = destinations != null ? destinations : new ArrayList<>();
        if (dest.isEmpty()) {
            Log.w(TAG, "offer aborted — no destinations");
            return false;
        }
        Context app = context.getApplicationContext();
        try {
            CwspBridgeService.requestReconnect(app);
        } catch (Throwable t) {
            Log.w(TAG, "requestReconnect failed", t);
        }

        File stageDir = staged.stageDir != null
                ? new File(staged.stageDir)
                : FilesIngress.stageDirFor(app, staged.transferId);
        if (stageDir == null || !stageDir.isDirectory()) {
            Log.e(TAG, "offer missing stageDir");
            return false;
        }

        String senderId = Configure.readClientId(app);
        if (senderId == null || senderId.isEmpty()) senderId = "L-unknown";

        String publicBase = resolvePublicBase(app, senderId);
        // WHY (WAN/Gateway): Cap LAN URLs are unreachable from LTE peers. Mirror
        // putBlob to gateway `/files/blob` whenever a gateway base is configured
        // so Accept hedge always has peer + gateway candidates.
        // INVARIANT: Accept order stays peer-first (hedge); do not skip mirror
        // just because destinations look LAN — a "LAN" peer may be on LTE.
        String gatewayBase = FilesBlobStore.resolveGatewayBlobBase(app);
        final boolean lanOnlyDests = allDestinationsAreLanPeers(dest);
        if (lanOnlyDests) {
            Log.i(TAG, "offer LAN-looking destinations — still best-effort gateway mirror"
                    + " (Accept hedges peer→gateway) dests=" + dest
                    + " gatewayBase=" + (gatewayBase != null ? "yes" : "no"));
        }
        try {
            ControlApiServer.ensureListening(app);
        } catch (Throwable t) {
            Log.w(TAG, "ensureListening failed", t);
        }

        String tid = staged.transferId;
        FilesTransferControl.clear(tid);
        OutboundSession session = new OutboundSession(dest, staged.files.size());
        SESSIONS.put(tid, session);

        long totalBytesHint = 0L;
        for (FilesIngress.StagedFile sf0 : staged.files) {
            if (sf0 != null) totalBytesHint += Math.max(0L, sf0.size);
        }
        UploadProgress uploadProgress = new UploadProgress(app, tid, totalBytesHint);
        uploadProgress.setLabel("Uploading");
        uploadProgress.reportInFlight(0);

        JSONArray batches = new JSONArray();
        long totalBytes = 0;
        try {
            int n = staged.files.size();
            for (int i = 0; i < n; i++) {
                FilesTransferControl.throwIfAborted(tid);
                FilesIngress.StagedFile sf = staged.files.get(i);
                if (sf == null) continue;
                totalBytes += Math.max(0L, sf.size);
                String batchId = staged.transferId + "-" + i;
                List<String> names = new ArrayList<>(1);
                names.add(sf.name);

                // WHY: display name from Share; batchId+ext was opaque on desk.
                String displayName = sf.name != null ? new java.io.File(sf.name).getName().trim() : "";
                File stagedFile = new File(stageDir, sf.name);
                long fileSize = stagedFile.isFile() ? stagedFile.length() : Math.max(0L, sf.size);

                String kind = "raw";
                String ext;
                String mimeType = "application/octet-stream";
                String hash;
                JSONObject asset = new JSONObject();
                uploadProgress.setLabel("Uploading " + (i + 1) + "/" + n);

                if (fileSize > FilesBatchMaterializer.HEAP_SAFE_MAX) {
                    // Stream path — constant memory for hundreds of MiB.
                    if (!stagedFile.isFile() || fileSize <= 0) {
                        Log.e(TAG, "large stage miss name=" + sf.name);
                        SESSIONS.remove(tid);
                        return false;
                    }
                    ext = FilesBatchMaterializer.fileExt(sf.name, "bin");
                    if (displayName.isEmpty() || ".".equals(displayName) || "..".equals(displayName)) {
                        displayName = batchId + "." + ext;
                    } else if (!displayName.toLowerCase(java.util.Locale.US)
                            .endsWith("." + ext.toLowerCase(java.util.Locale.US))) {
                        int dot = displayName.lastIndexOf('.');
                        if (dot < 0) displayName = displayName + "." + ext;
                    }
                    hash = FilesBatchMaterializer.sha256HexFile(stagedFile);
                    final UploadProgress upPut = uploadProgress;
                    FilesBlobStore.PutResult put = FilesBlobStore.putFile(
                            app,
                            staged.transferId,
                            batchId,
                            stagedFile,
                            hash,
                            displayName,
                            mimeType,
                            publicBase,
                            (uploaded, putTotal) -> upPut.reportInFlight(uploaded)
                    );
                    if (!put.ok || put.url.isEmpty()) {
                        Log.e(TAG, "putFile failed batch=" + batchId + " err=" + put.error);
                        failUpload(app, tid, uploadProgress, "Local stage failed");
                        return false;
                    }
                    // WHY: count local put before gateway sync so mirror progress
                    // continues as a second leg (addWork) instead of snapping to 0.
                    uploadProgress.addCompleted(fileSize);
                    FilesBlobStore.PutResult localPut = put;
                    put = maybeMirrorToGateway(
                            app, staged.transferId, batchId, stagedFile, mimeType,
                            gatewayBase, put, uploadProgress);
                    put = keepCapLanOfferAfterMirrorMiss(put, localPut, lanOnlyDests);
                    if (put != null && "CWSP_FILES_ABORTED".equals(put.error)) {
                        throw new Exception("CWSP_FILES_ABORTED");
                    }
                    if (put == null || !put.ok || put.url == null || put.url.isEmpty()) {
                        failUpload(app, tid, uploadProgress, mirrorFailReason(put));
                        return false;
                    }
                    asset.put("hash", hash);
                    asset.put("name", displayName);
                    asset.put("mimeType", mimeType);
                    asset.put("type", mimeType);
                    asset.put("size", fileSize);
                    asset.put("source", "url");
                    putUrlsOnAsset(app, asset, put);
                    session.noteHttpBatch(batchId, fileSize);
                    markRemoteHttpIfGateway(session, batchId, put);
                    Log.i(TAG, "offer streamed large file size=" + fileSize
                            + " batchId=" + batchId);
                } else {
                    FilesBatchMaterializer.MaterializedBatch mb =
                            FilesIngress.materializeBatch(stageDir, "raw", names);
                    kind = mb.kind;
                    ext = mb.ext;
                    mimeType = mb.mimeType;
                    hash = mb.hash;
                    if (displayName.isEmpty() || ".".equals(displayName) || "..".equals(displayName)) {
                        displayName = batchId + "." + mb.ext;
                    } else if (mb.ext != null && !mb.ext.isEmpty()
                            && !displayName.toLowerCase(java.util.Locale.US)
                                    .endsWith("." + mb.ext.toLowerCase(java.util.Locale.US))) {
                        int dot = displayName.lastIndexOf('.');
                        if (dot < 0) displayName = displayName + "." + mb.ext;
                    }
                    asset.put("hash", mb.hash);
                    asset.put("name", displayName);
                    asset.put("mimeType", mb.mimeType);
                    asset.put("type", mb.mimeType);
                    asset.put("size", mb.bytes.length);
                    if (mb.bytes.length > SMALL_FILE_MAX || mb.bytes.length > WS_EMBED_MAX) {
                        FilesBlobStore.PutResult put = FilesBlobStore.put(
                                app,
                                staged.transferId,
                                batchId,
                                mb.bytes,
                                mb.hash,
                                displayName,
                                mb.mimeType,
                                publicBase
                        );
                        if (!put.ok || put.url.isEmpty()) {
                            Log.e(TAG, "putBlob failed batch=" + batchId + " err=" + put.error);
                            failUpload(app, tid, uploadProgress, "Local stage failed");
                            return false;
                        }
                        long batchBytes = mb.bytes != null ? mb.bytes.length : fileSize;
                        uploadProgress.addCompleted(Math.max(0L, batchBytes));
                        // Mirror from local blob bin (same bytes Cap Control serves).
                        File localBin = new File(
                                new File(FilesStorage.resolveFilesBase(app), "blobs/" + staged.transferId),
                                batchId + ".bin");
                        FilesBlobStore.PutResult localPut = put;
                        put = maybeMirrorToGateway(
                                app, staged.transferId, batchId, localBin, mb.mimeType,
                                gatewayBase, put, uploadProgress);
                        put = keepCapLanOfferAfterMirrorMiss(put, localPut, lanOnlyDests);
                        if (put != null && "CWSP_FILES_ABORTED".equals(put.error)) {
                            throw new Exception("CWSP_FILES_ABORTED");
                        }
                        if (put == null || !put.ok || put.url == null || put.url.isEmpty()) {
                            failUpload(app, tid, uploadProgress, mirrorFailReason(put));
                            return false;
                        }
                        asset.put("source", "url");
                        putUrlsOnAsset(app, asset, put);
                        session.noteHttpBatch(batchId, batchBytes);
                        markRemoteHttpIfGateway(session, batchId, put);
                    } else {
                        asset.put("source", "base64");
                        asset.put("data", Base64.encodeToString(mb.bytes, Base64.NO_WRAP));
                        uploadProgress.addCompleted(Math.max(0L, mb.bytes != null ? mb.bytes.length : fileSize));
                    }
                }
                session.prepared = i + 1;
                JSONArray logical = new JSONArray();
                JSONObject lf = new JSONObject();
                lf.put("name", sf.name);
                lf.put("size", sf.size);
                logical.put(lf);

                JSONObject batch = new JSONObject();
                batch.put("batchId", batchId);
                batch.put("index", i);
                batch.put("count", n);
                batch.put("kind", kind);
                batch.put("asset", asset);
                batch.put("files", logical);
                batches.put(batch);
            }
        } catch (OutOfMemoryError oom) {
            Log.e(TAG, "offer pack OOM — use streaming path for large files", oom);
            failUpload(app, tid, uploadProgress, "Out of memory");
            return false;
        } catch (Exception e) {
            if (FilesTransferControl.isAborted(tid)
                    || (e.getMessage() != null && e.getMessage().contains("CWSP_FILES_ABORTED"))) {
                Log.i(TAG, "offer aborted mid-upload transferId=" + tid);
                // abort() may already have notified; if not, finish here.
                if (SESSIONS.containsKey(tid)) {
                    abort(app, tid);
                }
                return false;
            }
            Log.e(TAG, "offer pack failed", e);
            failUpload(app, tid, uploadProgress, "Upload failed");
            return false;
        }

        long now = System.currentTimeMillis();
        try {
            JSONObject payload = new JSONObject();
            payload.put("transferId", staged.transferId);
            payload.put("sender", senderId);
            payload.put("destinations", new JSONArray(dest));
            payload.put("createdAt", now);
            payload.put("expiresAt", now + OFFER_TTL_MS);
            JSONObject summary = new JSONObject();
            summary.put("fileCount", staged.files.size());
            summary.put("totalBytes", totalBytes);
            payload.put("summary", summary);
            payload.put("batches", batches);
            JSONObject flags = new JSONObject();
            flags.put("openForShare", true);
            flags.put("nativeAutoOffer", true);
            payload.put("flags", flags);
            payload.put("byteTransportHint", "auto");

            Map<String, Object> packet = new LinkedHashMap<>();
            packet.put("op", "act");
            packet.put("what", "files:offer");
            // COMPAT: some relays keep `type` and drop/clear `what` — desk resolves both.
            packet.put("type", "files:offer");
            packet.put("purpose", "storage");
            packet.put("protocol", "ws");
            packet.put("transport", "ws");
            packet.put("uuid", UUID.randomUUID().toString());
            packet.put("timestamp", now);
            packet.put("sender", senderId);
            packet.put("byId", senderId);
            packet.put("nodes", dest);
            packet.put("destinations", dest);
            Map<String, Object> pFlags = new LinkedHashMap<>();
            pFlags.put("canonicalV2", true);
            packet.put("flags", pFlags);
            // WHY: CwspWsClient.send expects Map payload; JSONObject is not Map.
            packet.put("payload", jsonToMap(payload));

            boolean sent = sendWithWait(app, packet);
            Log.i(TAG, "files:offer sent=" + sent
                    + " transferId=" + staged.transferId
                    + " dest=" + dest
                    + " batches=" + batches.length());
            // Seal BEFORE waiting/done so late put/mirror ticks cannot overwrite UI.
            uploadProgress.seal();
            if (sent) {
                session.prepared = batches.length();
                session.expectedBatches = batches.length();
                FilesOutgoingNotifier.notifyWaiting(app, tid, staged.files.size());
            } else {
                SESSIONS.remove(tid);
                FilesOutgoingNotifier.cancel(app, tid);
            }
            return sent;
        } catch (Exception e) {
            Log.e(TAG, "offer build/send failed", e);
            SESSIONS.remove(tid);
            FilesOutgoingNotifier.cancel(app, tid);
            return false;
        }
    }

    private static boolean sendWithWait(Context app, Map<String, Object> packet) {
        CwspWsClient ws = CwspBridgeService.getSharedWs();
        for (int i = 0; i < 40 && (ws == null || !ws.isOpen()); i++) {
            try {
                Thread.sleep(150);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                break;
            }
            ws = CwspBridgeService.getSharedWs();
        }
        if (ws == null || !ws.isOpen()) {
            Log.w(TAG, "WS not open — cannot send files:offer");
            return false;
        }
        return ws.send(packet);
    }

    private static String resolvePublicBase(Context app, String clientId) {
        // WHY (Cap↔Cap): prefer the NIC the phone actually has. Hardcoding
        // L-196→192.168.0.196 when DHCP gave another address made Cap peers
        // probe a dead host (Neu often still hit the right IP via other hints).
        String lan = detectLanIpv4();
        if (lan != null && !lan.isEmpty()) {
            return "http://" + lan + ":" + ControlApiServer.DEFAULT_PORT;
        }
        // COMPAT: short fleet ids (L-210 / L-196) → home-LAN map when NIC unknown.
        String fromId = lanHostFromClientId(clientId);
        if (fromId != null) {
            return "http://" + fromId + ":" + ControlApiServer.DEFAULT_PORT;
        }
        Log.w(TAG, "resolvePublicBase fell back to loopback — peers cannot pull");
        return "http://127.0.0.1:" + ControlApiServer.DEFAULT_PORT;
    }

    /**
     * True when every destination is a LAN peer id (RFC1918 / L-192.168.* / L-110).
     * WHY: logging / diagnostics only — mirror is still attempted when gateway
     * base exists so dual-path Accept has a gateway ramp.
     */
    static boolean allDestinationsAreLanPeers(List<String> destinations) {
        if (destinations == null || destinations.isEmpty()) return false;
        boolean any = false;
        for (String raw : destinations) {
            if (raw == null) continue;
            String d = raw.trim();
            if (d.isEmpty()) continue;
            any = true;
            if ("*".equals(d) || "all".equalsIgnoreCase(d)
                    || "broadcast".equalsIgnoreCase(d)) {
                return false;
            }
            if (!isLanPeerDestination(d)) return false;
        }
        return any;
    }

    private static boolean isLanPeerDestination(String dest) {
        if (dest == null || dest.isEmpty()) return false;
        String d = dest.trim();
        // Short fleet aliases used on desk / phones.
        if ("L-110".equalsIgnoreCase(d) || "L-196".equalsIgnoreCase(d)
                || "L-208".equalsIgnoreCase(d) || "L-210".equalsIgnoreCase(d)) {
            return true;
        }
        String host = d;
        if (host.regionMatches(true, 0, "L-", 0, 2)) {
            host = host.substring(2);
        }
        // Strip optional scheme/port leftovers from mis-typed dests.
        try {
            if (host.contains("://")) {
                java.net.URI u = java.net.URI.create(host);
                if (u.getHost() != null) host = u.getHost();
            } else if (host.contains(":")) {
                host = host.substring(0, host.indexOf(':'));
            }
        } catch (Exception ignored) { /* keep host */ }
        return FilesBlobStore.isPrivateLanHost(host);
    }

    /**
     * Cap↔Cap on same Wi‑Fi: if gateway mirror fails, still offer Cap Control
     * P2P URL so Accept can HEAD/GET peer path. WAN/mixed dests stay hard-fail.
     */
    private static FilesBlobStore.PutResult keepCapLanOfferAfterMirrorMiss(
            FilesBlobStore.PutResult mirrored,
            FilesBlobStore.PutResult local,
            boolean lanOnlyDests
    ) {
        if (mirrored != null && "CWSP_FILES_ABORTED".equals(mirrored.error)) {
            return mirrored;
        }
        if (mirrored != null && mirrored.ok && mirrored.url != null && !mirrored.url.isEmpty()) {
            return mirrored;
        }
        if (lanOnlyDests && local != null && local.ok
                && local.url != null && !local.url.isEmpty()
                && looksLikeCapLanBlobUrl(local.url)) {
            Log.w(TAG, "gateway mirror miss — keeping Cap Control P2P offer url="
                    + local.url);
            return new FilesBlobStore.PutResult(
                    true, local.url, local.token, "", local.url);
        }
        return mirrored;
    }

    /**
     * If Cap is pointed at the gateway, PUT local bytes there and prefer the
     * returned public URL. On failure keep the Cap LAN URL (LAN-only Accept).
     *
     * WHY (2026-07-22j): always sync-mirror before {@code files:offer}.
     * Background mirror for >64MiB advertised Cap LAN URLs that WAN/LTE peers
     * cannot GET — hundreds-of-MiB WAN/WAN failed while small sync-mirrored
     * offers still worked. LAN peers still probe {@code peerUrl} first.
     * Progress stays on "Publishing to gateway…" until PUT finishes.
     * WHY (2026-07-22o): caller nulls gatewayBase for LAN-only destinations.
     */
    private static FilesBlobStore.PutResult maybeMirrorToGateway(
            Context app,
            String transferId,
            String batchId,
            File source,
            String mimeType,
            String gatewayBase,
            FilesBlobStore.PutResult local,
            UploadProgress uploadProgress
    ) {
        if (gatewayBase == null || gatewayBase.isEmpty()
                || !FilesBlobStore.isGatewayBlobBase(gatewayBase)
                || source == null || !source.isFile()) {
            return local;
        }
        if (FilesTransferControl.isAborted(transferId)) {
            return new FilesBlobStore.PutResult(false, "", "", "CWSP_FILES_ABORTED");
        }
        // Sync mirror: WAN-first bases; count gateway PUT in the outgoing bar.
        // INVARIANT: caller already addCompleted(local batch); addWork(mirror) here.
        final UploadProgress up = uploadProgress;
        final long mirrorTotal = Math.max(0L, source.length());
        boolean workAdded = false;
        if (up != null && mirrorTotal > 0) {
            up.addWork(mirrorTotal);
            workAdded = true;
            up.setLabel("Publishing to gateway");
            up.reportInFlight(0);
        }
        FilesBlobStore.UploadProgress mirrorProgress = up == null ? null
                : (uploaded, putTotal) -> {
                    up.setLabel("Publishing to gateway");
                    up.reportInFlight(uploaded);
                };
        List<String> bases = FilesBlobStore.resolveMirrorBases(app, gatewayBase);
        if (bases.isEmpty() && gatewayBase != null && !gatewayBase.isEmpty()) {
            bases = new ArrayList<>(1);
            bases.add(gatewayBase.replaceAll("/+$", ""));
        }
        FilesBlobStore.PutResult mirrored = null;
        String lastErr = "";
        for (String base : bases) {
            if (FilesTransferControl.isAborted(transferId)) {
                if (workAdded && up != null) up.removeWork(mirrorTotal);
                return new FilesBlobStore.PutResult(false, "", "", "CWSP_FILES_ABORTED");
            }
            Log.i(TAG, "gateway mirror try base=" + base + " batch=" + batchId
                    + " size=" + mirrorTotal);
            if (up != null) {
                String hostLabel = base.contains(FilesBlobStore.LAN_GATEWAY_HOST)
                        ? "Publishing to LAN gateway"
                        : "Publishing to WAN gateway";
                up.setLabel(hostLabel);
                up.reportInFlight(0);
            }
            FilesBlobStore.PutResult attempt = FilesBlobStore.mirrorPutToGateway(
                    app, transferId, batchId, source, mimeType, base, local, mirrorProgress);
            if (attempt != null && "CWSP_FILES_ABORTED".equals(attempt.error)) {
                if (workAdded && up != null) up.removeWork(mirrorTotal);
                return attempt;
            }
            if (attempt != null && attempt.ok && attempt.url != null && !attempt.url.isEmpty()
                    && !looksLikeCapLanBlobUrl(attempt.url)) {
                mirrored = attempt;
                break;
            }
            if (attempt != null && attempt.error != null) lastErr = attempt.error;
        }
        if (mirrored != null && mirrored.ok) {
            if (up != null && workAdded) {
                up.addCompleted(mirrorTotal);
            }
            Log.i(TAG, "offer url via gateway mirror batch=" + batchId
                    + " size=" + mirrorTotal);
            return new FilesBlobStore.PutResult(
                    true,
                    preferWanGatewayBlobUrl(app, mirrored.url),
                    mirrored.token,
                    "",
                    local != null && local.ok ? local.url : "");
        }
        if (workAdded && up != null) {
            up.removeWork(mirrorTotal);
        }
        // WHY: Cap LAN-only offer after mirror miss = random WAN "failed" on Accept.
        // Fail the upload clearly so the shade does not hang on Uploading forever.
        Log.w(TAG, "gateway mirror failed batch=" + batchId
                + " size=" + mirrorTotal + " err=" + lastErr);
        return new FilesBlobStore.PutResult(
                false, "", "", "CWSP_FILES_GATEWAY_MIRROR_FAILED:" + lastErr);
    }

    private static void failUpload(
            Context app,
            String transferId,
            UploadProgress progress,
            String reason
    ) {
        try {
            if (progress != null) progress.seal();
        } catch (Throwable ignored) { /* */ }
        try {
            SESSIONS.remove(transferId);
        } catch (Throwable ignored) { /* */ }
        try {
            FilesTransferControl.clear(transferId);
        } catch (Throwable ignored) { /* */ }
        FilesOutgoingNotifier.notifyFailed(app, transferId, reason);
    }

    private static String mirrorFailReason(FilesBlobStore.PutResult put) {
        String err = put != null && put.error != null ? put.error : "";
        if (err.contains("GATEWAY_MIRROR_FAILED") || err.contains("http-")
                || err.contains("Connect") || err.contains("Timeout")) {
            return "Gateway publish failed — check WAN/relay";
        }
        if (err.contains("no-token")) {
            return "Gateway publish failed — missing client token";
        }
        return "Gateway publish failed";
    }

    /**
     * Mark batch as gateway/relay-served when the advertised primary URL is not Cap LAN.
     * WHY: drives done-watchdog aggressiveness after Accept (no local GET fallback).
     */
    private static void markRemoteHttpIfGateway(
            OutboundSession session,
            String batchId,
            FilesBlobStore.PutResult put
    ) {
        if (session == null || put == null || put.url == null || put.url.isEmpty()) return;
        if (looksLikeCapLanBlobUrl(put.url)) return;
        try {
            String host = java.net.URI.create(put.url).getHost();
            if (host == null || host.isEmpty()) return;
            // Gateway LAN (.200) or any public/WAN relay host.
            if (FilesBlobStore.isLanGatewayHost(host)
                    || !FilesBlobStore.isPrivateLanHost(host)) {
                session.markRemoteHttpBatch(batchId);
            }
        } catch (Exception ignored) { /* */ }
    }

    private static boolean looksLikeCapLanBlobUrl(String url) {
        if (url == null || url.isEmpty()) return true;
        try {
            java.net.URI u = java.net.URI.create(url);
            String host = u.getHost();
            String path = u.getRawPath();
            if (host == null) return true;
            if (path != null && path.contains("/service/files-blob/")
                    && FilesBlobStore.isPrivateLanHost(host)) {
                return true;
            }
            return false;
        } catch (Exception e) {
            return true;
        }
    }

    private static boolean sameBlobBaseHost(String a, String b) {
        try {
            String ha = a != null ? java.net.URI.create(a).getHost() : null;
            String hb = b != null ? java.net.URI.create(b).getHost() : null;
            return ha != null && hb != null && ha.equalsIgnoreCase(hb);
        } catch (Exception e) {
            return false;
        }
    }

    private static boolean sendFilesErrorAborted(
            Context app,
            String transferId,
            List<String> destinations,
            int done,
            int remaining
    ) {
        try {
            CwspBridgeService.requestReconnect(app);
        } catch (Throwable ignored) { /* */ }
        CwspWsClient ws = CwspBridgeService.getSharedWs();
        if (ws == null || !ws.isOpen()) {
            for (int i = 0; i < 20 && (ws == null || !ws.isOpen()); i++) {
                try { Thread.sleep(100); } catch (InterruptedException ignored) { break; }
                ws = CwspBridgeService.getSharedWs();
            }
        }
        if (ws == null || !ws.isOpen()) return false;
        String clientId = Configure.readClientId(app);
        if (clientId == null || clientId.isEmpty()) clientId = "L-unknown";
        List<String> dest = destinations != null ? destinations : new ArrayList<>();
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("transferId", transferId != null ? transferId : "");
        payload.put("code", "aborted");
        payload.put("message", "CWSP_FILES_ABORTED");
        payload.put("done", done);
        payload.put("remaining", remaining);
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("done", done);
        summary.put("remaining", remaining);
        summary.put("fileCount", done + remaining);
        payload.put("summary", summary);
        Map<String, Object> packet = new LinkedHashMap<>();
        packet.put("op", "act");
        packet.put("what", "files:error");
        packet.put("type", "files:error");
        packet.put("purpose", "storage");
        packet.put("protocol", "ws");
        packet.put("transport", "ws");
        packet.put("uuid", UUID.randomUUID().toString());
        packet.put("timestamp", System.currentTimeMillis());
        packet.put("sender", clientId);
        packet.put("byId", clientId);
        packet.put("nodes", dest);
        packet.put("destinations", dest);
        Map<String, Object> flags = new LinkedHashMap<>();
        flags.put("canonicalV2", true);
        flags.put("aborted", true);
        packet.put("flags", flags);
        packet.put("payload", payload);
        return ws.send(packet);
    }

    /**
     * Set {@code asset.url} + ordered {@code asset.urls}
     * (peer LAN → gateway LAN → WAN) for Accept probe.
     * WHY: LAN-only (no mirror) uses Cap peerUrl as primary so P2P is obvious;
     * WAN-mirrored offers keep LTE-safe WAN primary while urls[] stays peer-first.
     */
    private static void putUrlsOnAsset(Context app, JSONObject asset, FilesBlobStore.PutResult put)
            throws Exception {
        if (put == null || put.url == null || put.url.isEmpty()) {
            throw new Exception("CWSP_FILES_NO_PUT_URL");
        }
        java.util.LinkedHashSet<String> ordered = new java.util.LinkedHashSet<>();
        if (put.peerUrl != null && !put.peerUrl.isEmpty()) {
            ordered.add(put.peerUrl);
        }
        String lan = preferLanGatewayBlobUrl(app, put.url);
        String wan = preferWanGatewayBlobUrl(app, put.url);
        if (lan != null && !lan.isEmpty()) ordered.add(lan);
        if (wan != null && !wan.isEmpty()) ordered.add(wan);
        ordered.add(put.url);
        // WHY: Cap↔Cap Accept must be able to probe both the real NIC IP and the
        // fleet alias (L-196→.196) — DHCP drift / short clientId mismatch.
        String fleetHost = lanHostFromClientId(Configure.readClientId(app));
        String nicHost = detectLanIpv4();
        for (String u : new java.util.ArrayList<>(ordered)) {
            if (!looksLikeCapLanBlobUrl(u)) continue;
            if (nicHost != null && !nicHost.isEmpty()) {
                String alt = rewriteBlobUrlHost(u, nicHost);
                if (alt != null) ordered.add(alt);
            }
            if (fleetHost != null && !fleetHost.isEmpty()) {
                String alt = rewriteBlobUrlHost(u, fleetHost);
                if (alt != null) ordered.add(alt);
            }
        }
        JSONArray urls = new JSONArray();
        for (String u : ordered) urls.put(u);
        asset.put("urls", urls);
        boolean mirroredGateway = !looksLikeCapLanBlobUrl(put.url);
        if (!mirroredGateway && put.peerUrl != null && !put.peerUrl.isEmpty()) {
            // Pure LAN put — Prefer Cap Control P2P as primary.
            asset.put("url", put.peerUrl);
        } else if (!mirroredGateway) {
            asset.put("url", put.url);
        } else if (wan != null && !wan.isEmpty()) {
            // Mirrored / gateway URL — LTE-safe primary; Accept still peer-first via urls.
            asset.put("url", wan);
        } else {
            asset.put("url", put.url);
        }
    }

    /** Rewrite Cap Control blob URL host (same path+token) for P2P aliases. */
    static String rewriteBlobUrlHost(String url, String newHost) {
        if (url == null || url.isEmpty() || newHost == null || newHost.isEmpty()) return null;
        try {
            java.net.URI u = java.net.URI.create(url);
            String host = u.getHost();
            if (host == null || host.equalsIgnoreCase(newHost)) return url;
            String path = u.getRawPath();
            if (path == null || !path.contains("/service/files-blob/")) return null;
            int port = u.getPort() > 0 ? u.getPort() : ControlApiServer.DEFAULT_PORT;
            String q = u.getRawQuery();
            String scheme = u.getScheme() != null ? u.getScheme() : "http";
            return scheme + "://" + newHost + ":" + port + path
                    + (q != null && !q.isEmpty() ? "?" + q : "");
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Map WAN gateway entry → LAN for same-token Accept on home Wi‑Fi.
     * WHY: configured relay host (settings) || historical WAN fallback.
     */
    private static String preferLanGatewayBlobUrl(Context app, String url) {
        if (url == null || url.isEmpty()) return url;
        try {
            java.net.URI u = java.net.URI.create(url);
            String host = u.getHost();
            if (host == null) return url;
            String wanHost = FilesBlobStore.resolveWanGatewayHost(app);
            boolean isWan = host.equalsIgnoreCase(wanHost)
                    || host.equalsIgnoreCase(FilesBlobStore.WAN_GATEWAY_HOST_FALLBACK);
            if (!isWan) return url;
            String path = u.getRawPath();
            if (path == null || !path.contains("/files/blob/")) return url;
            int port = u.getPort() > 0 ? u.getPort() : 8434;
            String q = u.getRawQuery();
            return "https://" + FilesBlobStore.LAN_GATEWAY_HOST + ":" + port + path
                    + (q != null && !q.isEmpty() ? "?" + q : "");
        } catch (Exception e) {
            return url;
        }
    }

    /**
     * Map LAN gateway → WAN entry for LTE-reachable primary URL.
     * WHY: settings relay/endpoint host first, historical IP only as fallback.
     */
    private static String preferWanGatewayBlobUrl(Context app, String url) {
        if (url == null || url.isEmpty()) return url;
        try {
            java.net.URI u = java.net.URI.create(url);
            String host = u.getHost();
            if (host == null || !FilesBlobStore.LAN_GATEWAY_HOST.equals(host)) return url;
            String path = u.getRawPath();
            if (path == null || !path.contains("/files/blob/")) return url;
            String target = FilesBlobStore.resolveWanGatewayHost(app);
            if (target == null || target.isEmpty()) {
                target = FilesBlobStore.WAN_GATEWAY_HOST_FALLBACK;
            }
            int port = u.getPort() > 0 ? u.getPort() : 8434;
            String q = u.getRawQuery();
            return "https://" + target + ":" + port + path
                    + (q != null && !q.isEmpty() ? "?" + q : "");
        } catch (Exception e) {
            return url;
        }
    }

    /**
     * Map {@code L-192.168.0.210} or short {@code L-210} → LAN IPv4 for blob URLs.
     */
    public static String lanHostFromClientId(String clientId) {
        if (clientId == null) return null;
        String id = clientId.trim();
        if (!id.regionMatches(true, 0, "L-", 0, 2)) return null;
        String host = id.substring(2).trim();
        if (host.matches("\\d+\\.\\d+\\.\\d+\\.\\d+")) return host;
        // Short fleet form used in Cap prefs (L-110 / L-196 / L-208 / L-210).
        if ("110".equals(host)) return "192.168.0.110";
        if ("196".equals(host)) return "192.168.0.196";
        if ("208".equals(host)) return "192.168.0.208";
        if ("210".equals(host)) return "192.168.0.210";
        if ("200".equals(host)) return "192.168.0.200";
        return null;
    }

    /** Best-effort private IPv4 for Cap↔Cap blob URLs (same as CwsBridgePlugin). */
    private static String detectLanIpv4() {
        try {
            java.util.Enumeration<java.net.NetworkInterface> ifaces =
                    java.net.NetworkInterface.getNetworkInterfaces();
            if (ifaces == null) return null;
            while (ifaces.hasMoreElements()) {
                java.net.NetworkInterface nif = ifaces.nextElement();
                if (nif == null || !nif.isUp() || nif.isLoopback()) continue;
                java.util.Enumeration<java.net.InetAddress> addrs = nif.getInetAddresses();
                while (addrs.hasMoreElements()) {
                    java.net.InetAddress a = addrs.nextElement();
                    if (a == null || a.isLoopbackAddress() || !(a instanceof java.net.Inet4Address)) {
                        continue;
                    }
                    String host = a.getHostAddress();
                    if (host == null) continue;
                    if (host.startsWith("192.168.")
                            || host.startsWith("10.")
                            || host.matches("^172\\.(1[6-9]|2[0-9]|3[0-1])\\..*")) {
                        return host;
                    }
                }
            }
        } catch (Exception e) {
            Log.w(TAG, "detectLanIpv4 failed", e);
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> jsonToMap(JSONObject o) throws Exception {
        Map<String, Object> map = new LinkedHashMap<>();
        if (o == null) return map;
        java.util.Iterator<String> keys = o.keys();
        while (keys.hasNext()) {
            String k = keys.next();
            Object v = o.get(k);
            map.put(k, jsonValue(v));
        }
        return map;
    }

    private static Object jsonValue(Object v) throws Exception {
        if (v == null || v == JSONObject.NULL) return null;
        if (v instanceof JSONObject) return jsonToMap((JSONObject) v);
        if (v instanceof JSONArray) {
            JSONArray a = (JSONArray) v;
            List<Object> list = new ArrayList<>(a.length());
            for (int i = 0; i < a.length(); i++) list.add(jsonValue(a.get(i)));
            return list;
        }
        return v;
    }
}
