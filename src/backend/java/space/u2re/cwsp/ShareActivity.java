/*
 * Filename: ShareActivity.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/ShareActivity.java
 * Change date and time: 20.30.00_21.07.2026
 * Reason for changes: Never use primary clipboard as share body — it was sending stale text.
 *
 * WHY: Edge Sharesheet SEND often has EXTRA_TEXT=null. Clipboard fallback then shared
 * whatever was previously copied, not the current selection. Only Intent extras /
 * intent ClipData / EXTRA_STREAM are trusted. Prefer PROCESS_TEXT for selections.
 *   2026-07-19: empty PROCESS_TEXT (no selection / empty field) pastes from held
 *   inbound ask (Accept, skip notification) or OS clipboard into the focused field.
 *   2026-07-21 (Bug A fix): finishWithStatus now honors ShareResult.hasFilesStaged()
 *   so Open-with / share-target of arbitrary MIME shows "N file(s) ready to Open
 *   for Share" + a heads-up notification, instead of the old "Nothing to share"
 *   failure status. The files-hub ingress branch never touches the clipboard path.
 *   2026-07-21: stage share off main thread + catch Throwable — photo Share OOM
 *   was killing the Cap process with an "unknown error" dialog.
 *   2026-07-21b: suppress outbound "Share clipboard?" notif after explicit share.
 *   2026-07-24: write shared text on main thread while focused; pin lastSeen so
 *   watchLoop cannot re-fan stale primary clip after background setPrimaryClip fail.
 *   2026-07-24b: prefer text/URL over accompanying image asset in finishWithStatus.
 *   2026-07-24c: peek selected/share text on main before bg stage — browser bar
 *   PROCESS_TEXT was empty off-thread ("Nothing to share").
 */

package space.u2re.cwsp;

import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import java.util.Map;

import core.Configure;
import emission.Clipboard;
import emission.ShareTarget;

/**
 * Transient share-target shell: dialog overlay, no WebView, auto-dismiss.
 *
 * INVARIANT (outbound share): body comes only from the launching Intent — never
 * from primary clipboard as a SEND/share payload.
 * COMPAT (empty PROCESS_TEXT): paste path may Accept held inbound / read OS clipboard
 * to insert into the focused editable field.
 */
public class ShareActivity extends AppCompatActivity {
    private static final String TAG = "CwspShare";
    private static final long DISMISS_MS = 1100L;

    private final ShareTarget shareTarget = new ShareTarget();
    private final Handler main = new Handler(Looper.getMainLooper());
    private boolean finished = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(buildOverlayCard("Sharing to CWSP…"));
        Intent intent = getIntent();
        dumpIntent("onCreate", intent);
        processShare(intent);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (intent != null) setIntent(intent);
        dumpIntent("onNewIntent", intent);
        finished = false;
        processShare(intent);
    }

    private void processShare(Intent intent) {
        if (finished) return;

        // WHY: suppress outbound "Share clipboard?" before any clipboard.write —
        // PROCESS_TEXT / SEND already mean the user chose CWSP; ask notif is noise.
        CwspBridgeService.suppressTextWatch(15_000L);

        try {
            Intent svc = new Intent(this, CwspBridgeService.class);
            if (Build.VERSION.SDK_INT >= 26) {
                startForegroundService(svc);
            } else {
                startService(svc);
            }
        } catch (Exception e) {
            Log.w(TAG, "start bridge for share failed", e);
        }

        // WHY: take URI grants before leaving the Activity thread; staging
        // (esp. photos) must not run on main — OOM/ANR killed Cap as "unknown error".
        // WHY (2026-07-24c): read PROCESS_TEXT / EXTRA_TEXT NOW on the Activity
        // thread. Browser bar selection is binder-backed; new Intent(copy) + bg
        // read often sees "" → "Nothing to share" / false paste path.
        final String eagerText = ShareTarget.peekShareText(this, intent);
        Log.i(TAG, "eager share text len=" + (eagerText != null ? eagerText.length() : 0)
                + " action=" + (intent != null ? intent.getAction() : "null")
                + " type=" + (intent != null ? intent.getType() : "null"));

        final Intent shareIntent = intent != null ? new Intent(intent) : null;
        if (shareIntent != null) {
            try {
                shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            } catch (Exception ignored) { /* */ }
            if (eagerText != null && !eagerText.isEmpty()) {
                // Stabilize as plain String so the bg worker cannot lose Spannable binders.
                shareIntent.putExtra(Intent.EXTRA_TEXT, eagerText);
                shareIntent.putExtra(Intent.EXTRA_PROCESS_TEXT, eagerText);
            }
        }
        final String eagerSnap = eagerText != null ? eagerText : "";
        new Thread(() -> {
            ShareTarget.ShareResult result;
            Clipboard clipboard = new Clipboard(getApplicationContext());
            try {
                result = shareTarget.handleIntent(ShareActivity.this, shareIntent, clipboard);
            } catch (Throwable t) {
                // INVARIANT: OutOfMemoryError is Error, not Exception — must catch Throwable.
                Log.e(TAG, "share handleIntent crashed", t);
                result = new ShareTarget.ShareResult("", null);
                final String failMsg = "Share failed: " + (t.getMessage() != null ? t.getMessage() : t.getClass().getSimpleName());
                main.post(() -> {
                    if (finished) return;
                    finished = true;
                    updateOverlayCard(failMsg);
                    try {
                        Toast.makeText(getApplicationContext(), failMsg, Toast.LENGTH_LONG).show();
                    } catch (Exception ignored) { /* */ }
                    main.postDelayed(() -> {
                        try { finishAndRemoveTask(); } catch (Exception e) { finish(); }
                    }, DISMISS_MS);
                });
                return;
            }
            // Recover if bg path still dropped text despite injection.
            if (!result.hasText() && !eagerSnap.isEmpty()
                    && !result.hasAsset() && !result.hasFilesStaged()) {
                Log.w(TAG, "bg handleIntent lost text — recovering eager len=" + eagerSnap.length());
                result = new ShareTarget.ShareResult(eagerSnap, null);
            }
            final ShareTarget.ShareResult finalResult = result;
            main.post(() -> {
                if (finished) return;
                boolean processText = shareIntent != null
                        && Intent.ACTION_PROCESS_TEXT.equals(shareIntent.getAction());
                // Paste path only when PROCESS_TEXT truly had no selection (empty field).
                if (processText && eagerSnap.isEmpty() && !finalResult.hasText()
                        && !finalResult.hasAsset() && !finalResult.hasFilesStaged()) {
                    finishWithPaste(shareIntent);
                    return;
                }
                finishWithStatus(shareIntent, finalResult, clipboard);
            });
        }, "cwsp-share-stage").start();
    }

    /**
     * Empty PROCESS_TEXT: Accept held inbound ask (bypass Ask notif) and/or paste
     * OS clipboard text back into the calling field via EXTRA_PROCESS_TEXT.
     */
    private void finishWithPaste(Intent intent) {
        if (finished) return;
        finished = true;

        updateOverlayCard("Pasting from CWSP…");
        CwspBridgeService.PasteOffer paste = CwspBridgeService.takePasteForProcessText(this);

        boolean readonly = intent != null
                && intent.getBooleanExtra(Intent.EXTRA_PROCESS_TEXT_READONLY, false);
        String status;
        String insertText = "";
        if (paste.hasText()) {
            insertText = readonly ? "" : paste.text;
            if (paste.acceptedAsk) {
                status = readonly ? "Accepted to clipboard" : "Accepted & pasted";
            } else if (paste.fromClipboard) {
                status = readonly ? "Clipboard ready" : "Pasted from clipboard";
            } else {
                status = "Pasted";
            }
            Log.i(TAG, "PROCESS_TEXT paste ok acceptedAsk=" + paste.acceptedAsk
                    + " fromClip=" + paste.fromClipboard
                    + " readonly=" + readonly
                    + " len=" + paste.text.length());
        } else if (paste.acceptedAsk) {
            // Image-only (or empty-body) hold applied to OS clipboard.
            status = "Accepted to clipboard";
            Log.i(TAG, "PROCESS_TEXT paste accepted ask without insertable text");
        } else {
            status = "Nothing to paste";
            Log.w(TAG, "PROCESS_TEXT paste empty — no ask hold and no clipboard text");
        }

        updateOverlayCard(status);
        try {
            Toast.makeText(getApplicationContext(), status, Toast.LENGTH_SHORT).show();
        } catch (Exception ignored) {
            /* ignore */
        }

        // INVARIANT: return replacement for editable fields so Android inserts at caret.
        Intent resultIntent = new Intent();
        resultIntent.putExtra(Intent.EXTRA_PROCESS_TEXT, insertText);
        setResult(RESULT_OK, resultIntent);

        main.postDelayed(() -> {
            try {
                finishAndRemoveTask();
            } catch (Exception e) {
                finish();
            }
        }, DISMISS_MS);
    }

    private void finishWithStatus(Intent intent, ShareTarget.ShareResult result, Clipboard clipboard) {
        if (finished) return;
        finished = true;

        String status;
        long dismissMs = DISMISS_MS;
        if (result.hasFilesStaged()) {
            // WHY (2026-07-21 UX): native Share auto-offers — no "Open for Share" step.
            int n = result.filesStagedCount;
            if (result.filesOk) {
                status = n + " file" + (n == 1 ? "" : "s") + " offered — peer can Accept";
            } else {
                status = "Share staged — offer pending (WS)";
            }
            Log.i(TAG, "files staged/offered transferId=" + result.transferId
                    + " count=" + n + " ok=" + result.filesOk);
            dismissMs = 1600L;
        } else if (result.hasText()) {
            // WHY: text/URL wins over thumbnail asset when both were present.
            try {
                if (clipboard != null) clipboard.write(result.text);
            } catch (Exception e) {
                Log.w(TAG, "clipboard write (focused) failed", e);
            }
            CwspBridgeService.acknowledgeExplicitShare(result.text);
            status = fanOutText(result.text) ? "Text shared" : "Text copied locally";
            Log.i(TAG, "share text ok len=" + result.text.length());
        } else if (result.hasAsset()) {
            Object sizeObj = result.asset.get("size");
            int size = sizeObj instanceof Number ? ((Number) sizeObj).intValue() : 0;
            Log.i(TAG, "fan-out asset size=" + size);
            boolean sent = fanOutAsset(result.asset);
            status = sent ? "Image shared" : "Image queued (connecting…)";
            // WHY: large base64 needs WS up — keep overlay alive for retries.
            dismissMs = sent ? 1200L : 2800L;
            CwspBridgeService.acknowledgeExplicitShare(null);
        } else {
            // Last chance on the Activity thread (ClipData coerce needs focus/context).
            String retry = ShareTarget.peekShareText(this, intent);
            if (retry != null && !retry.isEmpty()) {
                Log.w(TAG, "empty result recovered via re-peek len=" + retry.length());
                try {
                    if (clipboard != null) clipboard.write(retry);
                } catch (Exception e) {
                    Log.w(TAG, "clipboard write (re-peek) failed", e);
                }
                CwspBridgeService.acknowledgeExplicitShare(retry);
                status = fanOutText(retry) ? "Text shared" : "Text copied locally";
            } else {
                boolean image = intent != null && intent.getType() != null
                        && intent.getType().toLowerCase(java.util.Locale.US).startsWith("image/");
                boolean send = intent != null && Intent.ACTION_SEND.equals(intent.getAction());
                if (image) {
                    status = "Image read failed";
                } else if (send) {
                    status = "Share empty — no text/link in intent";
                } else {
                    status = "Nothing to share";
                }
                Log.e(TAG, "empty share action=" + (intent != null ? intent.getAction() : "null")
                        + " type=" + (intent != null ? intent.getType() : "null"));
                dumpIntent("emptyShare", intent);
            }
        }
        updateOverlayCard(status);
        try {
            Toast.makeText(getApplicationContext(), status, Toast.LENGTH_SHORT).show();
        } catch (Exception ignored) {
            /* ignore */
        }

        if (intent != null && Intent.ACTION_PROCESS_TEXT.equals(intent.getAction())) {
            Intent resultIntent = new Intent();
            // WHY: selected-text share — return the same body (OEM replace) without paste rewrite.
            resultIntent.putExtra(Intent.EXTRA_PROCESS_TEXT, result.hasText() ? result.text : "");
            setResult(RESULT_OK, resultIntent);
        }

        final long delay = dismissMs;
        main.postDelayed(() -> {
            try {
                finishAndRemoveTask();
            } catch (Exception e) {
                finish();
            }
        }, delay);
    }

    private static void dumpIntent(String where, Intent intent) {
        if (intent == null) {
            Log.e(TAG, where + " intent=null");
            return;
        }
        StringBuilder sb = new StringBuilder();
        sb.append(where)
                .append(" action=").append(intent.getAction())
                .append(" type=").append(intent.getType())
                .append(" data=").append(intent.getDataString())
                .append(" flags=0x").append(Integer.toHexString(intent.getFlags()))
                .append(" clip=").append(intent.getClipData() != null);
        Bundle extras = intent.getExtras();
        if (extras == null) {
            sb.append(" extras=null");
        } else {
            sb.append(" extras={");
            for (String key : extras.keySet()) {
                Object v;
                try {
                    v = extras.get(key);
                } catch (Exception e) {
                    v = "<err>";
                }
                String preview;
                if (v == null) preview = "null";
                else if (v instanceof CharSequence) {
                    String s = v.toString();
                    preview = v.getClass().getSimpleName() + " len=" + s.length()
                            + " \"" + (s.length() > 80 ? s.substring(0, 80) + "…" : s) + "\"";
                } else {
                    preview = v.getClass().getName();
                }
                sb.append(key).append('=').append(preview).append("; ");
            }
            sb.append('}');
        }
        Log.e(TAG, sb.toString());
    }

    private boolean fanOutText(String text) {
        String clientId = Configure.readClientId(getApplicationContext());
        CwspWsClient ws = CwspBridgeService.getSharedWs();
        if (ws != null && ws.isOpen()) {
            return ws.sendClipboardUpdate(text, clientId);
        } else {
            CwspBridgeService.requestReconnect(getApplicationContext());
            main.postDelayed(() -> {
                CwspWsClient retry = CwspBridgeService.getSharedWs();
                if (retry != null && retry.isOpen()) {
                    boolean ok = retry.sendClipboardUpdate(text, clientId);
                    Log.i(TAG, "sendClipboardUpdate retry ok=" + ok);
                } else {
                    Log.w(TAG, "sendClipboardUpdate retry skipped — WS still closed");
                }
            }, 1000L);
            return false;
        }
    }

    private boolean fanOutAsset(Map<String, Object> asset) {
        // WHY: gallery/share leaves image on primary clip; watch must not emit text:update
        // or open a redundant outbound Share clipboard? ask notification.
        CwspBridgeService.suppressTextWatch(15_000L);
        String clientId = Configure.readClientId(getApplicationContext());
        CwspWsClient ws = CwspBridgeService.getSharedWs();
        if (ws != null && ws.isOpen()) {
            boolean ok = ws.sendClipboardAsset(asset, clientId);
            Log.i(TAG, "sendClipboardAsset immediate ok=" + ok);
            return ok;
        }
        Log.w(TAG, "WS not open — scheduling asset fan-out retries");
        CwspBridgeService.requestReconnect(getApplicationContext());
        final long[] delays = new long[]{400L, 1000L, 2000L};
        for (long delay : delays) {
            main.postDelayed(() -> {
                CwspWsClient retry = CwspBridgeService.getSharedWs();
                if (retry != null && retry.isOpen()) {
                    boolean ok = retry.sendClipboardAsset(asset, clientId);
                    Log.i(TAG, "sendClipboardAsset retry ok=" + ok);
                } else {
                    Log.w(TAG, "sendClipboardAsset retry skipped — WS still closed");
                }
            }, delay);
        }
        return false;
    }

    private FrameLayout buildOverlayCard(String message) {
        FrameLayout root = new FrameLayout(this);
        root.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        root.setBackgroundColor(0x66000000);

        TextView card = new TextView(this);
        card.setId(android.R.id.message);
        card.setText(message);
        card.setTextColor(Color.WHITE);
        card.setTextSize(TypedValue.COMPLEX_UNIT_SP, 15);
        card.setGravity(Gravity.CENTER);
        int pad = (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, 18, getResources().getDisplayMetrics());
        card.setPadding(pad, pad, pad, pad);

        GradientDrawable bg = new GradientDrawable();
        bg.setColor(0xEE1B1B1F);
        bg.setCornerRadius(TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, 14, getResources().getDisplayMetrics()));
        card.setBackground(bg);

        FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                Gravity.CENTER
        );
        int margin = (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, 32, getResources().getDisplayMetrics());
        lp.setMargins(margin, margin, margin, margin);
        root.addView(card, lp);
        return root;
    }

    private void updateOverlayCard(String message) {
        TextView card = findViewById(android.R.id.message);
        if (card != null) card.setText(message);
    }
}
