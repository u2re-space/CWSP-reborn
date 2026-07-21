/*
 * Filename: CwspFilesDocumentsProvider.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/CwspFilesDocumentsProvider.java
 * Change date and time: 18.10.00_21.07.2026
 * Reason for changes: Expose Capacitor app files/ (outgoing, incoming, landing)
 *   to system File Managers and SAF pickers via DocumentsProvider.
 *   WHY: app-specific storage is invisible under Android/data; all-files access
 *   (MANAGE_EXTERNAL_STORAGE) still cannot browse other apps' private dirs.
 *   DocumentsProvider is the supported way to surface *our* tree in explorers.
 *   MANAGE_EXTERNAL_STORAGE may still be declared for shared-storage / USB /
 *   MediaStore.Files (opt-in via system settings) — see FilesAccessPermissions.
 *   Refs: https://developer.android.com/guide/topics/providers/document-provider
 *         https://developer.android.com/training/data-storage/app-specific
 *         https://developer.android.com/training/data-storage/shared/documents-files
 *
 * INVARIANT: do not rely on MANAGE_EXTERNAL_STORAGE to expose our app tree —
 * that is DocumentsProvider's job. All-files is optional for shared storage.
 */
package emission;

import android.content.Context;
import android.content.pm.ProviderInfo;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.provider.DocumentsContract;
import android.provider.DocumentsContract.Document;
import android.provider.DocumentsContract.Root;
import android.provider.DocumentsProvider;
import android.util.Log;
import android.webkit.MimeTypeMap;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Locale;

/**
 * SAF document root "CWSP Files" → {@link FilesStorage#resolveFilesBase}.
 * Visible in Files / document pickers that enumerate {@code DOCUMENTS_PROVIDER}.
 */
public final class CwspFilesDocumentsProvider extends DocumentsProvider {
    private static final String TAG = "CwspFilesDocsProvider";

    /** Stable root id for queryRoots / tree URIs. */
    public static final String ROOT_ID = "cwsp-files";
    /** Document id of the files/ base directory. */
    public static final String DOC_ROOT = "root";

    private static final String[] DEFAULT_ROOT_PROJECTION = new String[] {
            Root.COLUMN_ROOT_ID,
            Root.COLUMN_MIME_TYPES,
            Root.COLUMN_FLAGS,
            Root.COLUMN_ICON,
            Root.COLUMN_TITLE,
            Root.COLUMN_SUMMARY,
            Root.COLUMN_DOCUMENT_ID,
            Root.COLUMN_AVAILABLE_BYTES
    };

    private static final String[] DEFAULT_DOCUMENT_PROJECTION = new String[] {
            Document.COLUMN_DOCUMENT_ID,
            Document.COLUMN_MIME_TYPE,
            Document.COLUMN_DISPLAY_NAME,
            Document.COLUMN_LAST_MODIFIED,
            Document.COLUMN_FLAGS,
            Document.COLUMN_SIZE
    };

    private String authority = "space.u2re.cwsp.files";

    @Override
    public void attachInfo(Context context, ProviderInfo info) {
        super.attachInfo(context, info);
        if (info != null && info.authority != null) {
            authority = info.authority;
        }
    }

    @Override
    public boolean onCreate() {
        Context ctx = getContext();
        if (ctx != null) {
            FilesStorage.ensureDirsAndReadme(ctx);
        }
        return true;
    }

    /** Authority used for {@link DocumentsContract} URI builders. */
    public static String authorityFor(Context context) {
        if (context == null) return "space.u2re.cwsp.files";
        return context.getPackageName() + ".files";
    }

    public static android.net.Uri buildRootUri(Context context) {
        return DocumentsContract.buildRootUri(authorityFor(context), ROOT_ID);
    }

    public static android.net.Uri buildDocumentUri(Context context, String documentId) {
        return DocumentsContract.buildDocumentUri(authorityFor(context), documentId);
    }

    public static android.net.Uri buildTreeDocumentUri(Context context) {
        return DocumentsContract.buildTreeDocumentUri(authorityFor(context), DOC_ROOT);
    }

    @Override
    public Cursor queryRoots(String[] projection) {
        MatrixCursor result = new MatrixCursor(resolveRootProjection(projection));
        Context ctx = getContext();
        if (ctx == null) return result;

        FilesStorage.ensureDirsAndReadme(ctx);
        File base = FilesStorage.resolveFilesBase(ctx);
        long avail = base != null ? base.getFreeSpace() : 0L;

        MatrixCursor.RowBuilder row = result.newRow();
        row.add(Root.COLUMN_ROOT_ID, ROOT_ID);
        row.add(Root.COLUMN_DOCUMENT_ID, DOC_ROOT);
        row.add(Root.COLUMN_TITLE, "CWSP Files");
        row.add(Root.COLUMN_SUMMARY, "Outgoing / incoming / landing (app storage)");
        row.add(Root.COLUMN_MIME_TYPES, "*/*");
        row.add(Root.COLUMN_AVAILABLE_BYTES, avail);
        row.add(
                Root.COLUMN_FLAGS,
                Root.FLAG_SUPPORTS_CREATE
                        | Root.FLAG_SUPPORTS_IS_CHILD
                        | Root.FLAG_LOCAL_ONLY
                        | Root.FLAG_SUPPORTS_SEARCH
        );
        try {
            int icon = ctx.getApplicationInfo().icon;
            if (icon != 0) row.add(Root.COLUMN_ICON, icon);
        } catch (Exception ignored) { /* optional */ }
        return result;
    }

    @Override
    public Cursor queryDocument(String documentId, String[] projection)
            throws FileNotFoundException {
        MatrixCursor result = new MatrixCursor(resolveDocumentProjection(projection));
        includeFile(result, documentId, resolveFile(documentId));
        return result;
    }

    @Override
    public Cursor queryChildDocuments(String parentDocumentId, String[] projection, String sortOrder)
            throws FileNotFoundException {
        MatrixCursor result = new MatrixCursor(resolveDocumentProjection(projection));
        File parent = resolveFile(parentDocumentId);
        if (!parent.isDirectory()) {
            throw new FileNotFoundException("Not a directory: " + parentDocumentId);
        }
        File[] kids = parent.listFiles();
        if (kids == null) return result;
        for (File child : kids) {
            if (child == null || !child.exists()) continue;
            // WHY: skip hidden OS noise; keep README visible so users can locate paths.
            String name = child.getName();
            if (name.startsWith(".") && !name.equals(".")) continue;
            includeFile(result, childDocumentId(parentDocumentId, child.getName()), child);
        }
        return result;
    }

    @Override
    public ParcelFileDescriptor openDocument(String documentId, String mode, CancellationSignal signal)
            throws FileNotFoundException {
        File file = resolveFile(documentId);
        if (!file.isFile()) {
            throw new FileNotFoundException("Not a file: " + documentId);
        }
        final int accessMode = ParcelFileDescriptor.parseMode(mode);
        return ParcelFileDescriptor.open(file, accessMode);
    }

    @Override
    public String createDocument(String parentDocumentId, String mimeType, String displayName)
            throws FileNotFoundException {
        File parent = resolveFile(parentDocumentId);
        if (!parent.isDirectory()) {
            throw new FileNotFoundException("Parent not a directory");
        }
        String safe = sanitizeName(displayName);
        if (safe.isEmpty()) safe = "untitled";
        File target = new File(parent, safe);
        try {
            if (Document.MIME_TYPE_DIR.equals(mimeType)) {
                if (!target.mkdirs() && !target.isDirectory()) {
                    throw new FileNotFoundException("mkdir failed");
                }
            } else {
                if (!target.createNewFile() && !target.isFile()) {
                    throw new FileNotFoundException("create failed");
                }
            }
        } catch (IOException e) {
            throw new FileNotFoundException(e.getMessage());
        }
        return childDocumentId(parentDocumentId, target.getName());
    }

    @Override
    public void deleteDocument(String documentId) throws FileNotFoundException {
        File file = resolveFile(documentId);
        if (DOC_ROOT.equals(documentId)) {
            throw new FileNotFoundException("Cannot delete root");
        }
        if (!deleteRecursively(file)) {
            throw new FileNotFoundException("Delete failed: " + documentId);
        }
    }

    @Override
    public boolean isChildDocument(String parentDocumentId, String documentId) {
        if (parentDocumentId == null || documentId == null) return false;
        if (DOC_ROOT.equals(parentDocumentId)) {
            return documentId.equals(DOC_ROOT) || documentId.startsWith(DOC_ROOT + "/");
        }
        return documentId.equals(parentDocumentId) || documentId.startsWith(parentDocumentId + "/");
    }

    // --- helpers ---

    private File resolveFile(String documentId) throws FileNotFoundException {
        Context ctx = getContext();
        if (ctx == null) throw new FileNotFoundException("no context");
        File base = FilesStorage.resolveFilesBase(ctx);
        if (base == null) throw new FileNotFoundException("no base");
        if (documentId == null || documentId.isEmpty() || DOC_ROOT.equals(documentId)) {
            return base;
        }
        if (!documentId.startsWith(DOC_ROOT + "/")) {
            throw new FileNotFoundException("bad documentId: " + documentId);
        }
        String rel = documentId.substring((DOC_ROOT + "/").length());
        if (rel.contains("..") || rel.startsWith("/") || rel.contains("\\")) {
            throw new FileNotFoundException("unsafe documentId");
        }
        File target = new File(base, rel);
        try {
            String baseCanon = base.getCanonicalPath();
            String targetCanon = target.getCanonicalPath();
            if (!targetCanon.equals(baseCanon)
                    && !targetCanon.startsWith(baseCanon + File.separator)) {
                throw new FileNotFoundException("escape blocked");
            }
        } catch (IOException e) {
            throw new FileNotFoundException(e.getMessage());
        }
        if (!target.exists()) {
            throw new FileNotFoundException("missing: " + documentId);
        }
        return target;
    }

    private static String childDocumentId(String parentDocumentId, String name) {
        if (DOC_ROOT.equals(parentDocumentId)) return DOC_ROOT + "/" + name;
        return parentDocumentId + "/" + name;
    }

    private static String sanitizeName(String displayName) {
        if (displayName == null) return "";
        String n = displayName.trim().replace('/', '_').replace('\\', '_');
        if (n.equals(".") || n.equals("..") || n.contains("..")) return "untitled";
        return n;
    }

    private void includeFile(MatrixCursor result, String docId, File file) {
        if (file == null || !file.exists()) return;
        boolean isDir = file.isDirectory();
        int flags = 0;
        if (isDir) {
            flags |= Document.FLAG_DIR_SUPPORTS_CREATE;
        } else {
            flags |= Document.FLAG_SUPPORTS_WRITE;
        }
        if (!DOC_ROOT.equals(docId)) {
            flags |= Document.FLAG_SUPPORTS_DELETE;
        }

        String mime = isDir ? Document.MIME_TYPE_DIR : guessMime(file.getName());
        MatrixCursor.RowBuilder row = result.newRow();
        row.add(Document.COLUMN_DOCUMENT_ID, docId);
        row.add(Document.COLUMN_DISPLAY_NAME, DOC_ROOT.equals(docId) ? "CWSP Files" : file.getName());
        row.add(Document.COLUMN_SIZE, isDir ? null : file.length());
        row.add(Document.COLUMN_MIME_TYPE, mime);
        row.add(Document.COLUMN_LAST_MODIFIED, file.lastModified());
        row.add(Document.COLUMN_FLAGS, flags);
    }

    private static String guessMime(String name) {
        String ext = "";
        int dot = name.lastIndexOf('.');
        if (dot >= 0 && dot < name.length() - 1) {
            ext = name.substring(dot + 1).toLowerCase(Locale.US);
        }
        String mime = MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext);
        return mime != null ? mime : "application/octet-stream";
    }

    private static String[] resolveRootProjection(String[] projection) {
        return projection != null ? projection : DEFAULT_ROOT_PROJECTION;
    }

    private static String[] resolveDocumentProjection(String[] projection) {
        return projection != null ? projection : DEFAULT_DOCUMENT_PROJECTION;
    }

    private static boolean deleteRecursively(File file) {
        if (file == null || !file.exists()) return false;
        if (file.isDirectory()) {
            File[] kids = file.listFiles();
            if (kids != null) {
                for (File k : kids) {
                    if (!deleteRecursively(k)) return false;
                }
            }
        }
        return file.delete();
    }
}
