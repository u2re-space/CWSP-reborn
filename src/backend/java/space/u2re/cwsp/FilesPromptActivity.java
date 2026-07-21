/*
 * Filename: FilesPromptActivity.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/FilesPromptActivity.java
 * Change date and time: 23.40.00_21.07.2026
 * Reason for changes: Foreground trampoline for Files saved Open File / Open in
 *   Folder / Share — BroadcastReceiver startActivity is blocked on Android 10+
 *   (BAL), so notification actions appeared to do nothing for single downloads.
 *   2026-07-21t: Open File prefers EXTRA_CONTENT_URI (final Downloads/SAF/
 *   DocumentsProvider) over app-private FileProvider intermediate.
 *
 * INVARIANT: finish() immediately after dispatch — translucent, no UI.
 */

package space.u2re.cwsp;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import emission.FilesOutgoingNotifier;
import emission.FilesStorage;

/**
 * Transparent activity that opens/shares landed files while foregrounded.
 */
public class FilesPromptActivity extends Activity {

    private static final String TAG = "FilesPromptActivity";
    private boolean handled = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (handled) {
            finish();
            return;
        }
        handled = true;

        Intent intent = getIntent();
        String action = intent != null ? intent.getAction() : null;
        String transferId = intent != null
                ? intent.getStringExtra(FilesOutgoingNotifier.EXTRA_TRANSFER_ID)
                : null;
        String filePath = intent != null
                ? intent.getStringExtra(FilesOutgoingNotifier.EXTRA_FILE_PATH)
                : null;
        String contentUri = intent != null
                ? intent.getStringExtra(FilesOutgoingNotifier.EXTRA_CONTENT_URI)
                : null;
        try {
            if (FilesPromptReceiver.ACTION_OPEN_FILE.equals(action)) {
                // WHY: prefer final Downloads/SAF/DocumentsProvider Uri + real filename.
                boolean ok = FilesStorage.openLandingFile(this, transferId, filePath, contentUri);
                if (!ok) {
                    Log.w(TAG, "openLandingFile failed transferId=" + transferId
                            + " path=" + filePath + " contentUri=" + contentUri);
                }
            } else if (FilesPromptReceiver.ACTION_OPEN_LANDING.equals(action)) {
                boolean ok = FilesStorage.openLandingFolder(this, transferId);
                if (!ok) {
                    Log.w(TAG, "openLandingFolder failed transferId=" + transferId);
                }
            } else if (FilesPromptReceiver.ACTION_SHARE_LANDING.equals(action)) {
                boolean ok = FilesStorage.shareLandingTransfer(this, transferId);
                if (!ok) {
                    Log.w(TAG, "shareLandingTransfer failed transferId=" + transferId);
                }
            } else {
                Log.d(TAG, "unknown action: " + action);
            }
        } catch (Throwable t) {
            Log.w(TAG, "files prompt action failed: " + action, t);
        } finally {
            finish();
        }
    }
}
