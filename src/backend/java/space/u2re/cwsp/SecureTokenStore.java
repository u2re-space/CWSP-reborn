/*
 * Filename: SecureTokenStore.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/SecureTokenStore.java
 * Change date and time: 18.45.00_10.07.2026
 * Reason for changes: AndroidKeyStore AES-GCM store for CWSP identification token.
 *
 * SECURITY: never log the token; never put it in SharedPreferences plaintext.
 */

package space.u2re.cwsp;

import android.content.Context;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Log;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.KeyStore;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

/** Encrypts the CWSP client token with AndroidKeyStore AES/GCM. */
public final class SecureTokenStore {
    private static final String TAG = "SecureTokenStore";
    private static final String KEY_ALIAS = "cwsp-identity-v1";
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int GCM_TAG_BITS = 128;
    private static final int IV_BYTES = 12;
    private static final String REL_PATH = "cwsp/identity.bin";

    private final Context appContext;

    public SecureTokenStore(Context context) {
        this.appContext = context.getApplicationContext();
    }

    public synchronized void setToken(String token) {
        if (token == null || token.isEmpty()) {
            clear();
            return;
        }
        try {
            SecretKey key = getOrCreateKey();
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            byte[] iv = cipher.getIV();
            byte[] ciphertext = cipher.doFinal(token.getBytes(StandardCharsets.UTF_8));
            File out = identityFile();
            File parent = out.getParentFile();
            if (parent != null && !parent.exists()) parent.mkdirs();
            try (FileOutputStream fos = new FileOutputStream(out)) {
                ByteBuffer buf = ByteBuffer.allocate(4 + iv.length + ciphertext.length);
                buf.putInt(iv.length);
                buf.put(iv);
                buf.put(ciphertext);
                fos.write(buf.array());
            }
        } catch (Exception e) {
            Log.e(TAG, "setToken failed", e);
        }
    }

    public synchronized String getToken() {
        File file = identityFile();
        if (!file.exists()) return null;
        try {
            byte[] all;
            try (FileInputStream fis = new FileInputStream(file)) {
                all = fis.readAllBytes();
            }
            if (all.length < 5) return null;
            ByteBuffer buf = ByteBuffer.wrap(all);
            int ivLen = buf.getInt();
            if (ivLen <= 0 || ivLen > 32 || buf.remaining() <= ivLen) return null;
            byte[] iv = new byte[ivLen];
            buf.get(iv);
            byte[] ciphertext = new byte[buf.remaining()];
            buf.get(ciphertext);

            SecretKey key = getOrCreateKey();
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(GCM_TAG_BITS, iv));
            byte[] plain = cipher.doFinal(ciphertext);
            return new String(plain, StandardCharsets.UTF_8);
        } catch (Exception e) {
            Log.w(TAG, "getToken failed", e);
            return null;
        }
    }

    public synchronized void clear() {
        File file = identityFile();
        if (file.exists() && !file.delete()) {
            Log.w(TAG, "clear: delete failed");
        }
        try {
            KeyStore ks = KeyStore.getInstance("AndroidKeyStore");
            ks.load(null);
            if (ks.containsAlias(KEY_ALIAS)) {
                ks.deleteEntry(KEY_ALIAS);
            }
        } catch (Exception e) {
            Log.w(TAG, "clear keystore failed", e);
        }
    }

    private File identityFile() {
        return new File(appContext.getFilesDir(), REL_PATH);
    }

    private SecretKey getOrCreateKey() throws Exception {
        KeyStore ks = KeyStore.getInstance("AndroidKeyStore");
        ks.load(null);
        if (ks.containsAlias(KEY_ALIAS)) {
            KeyStore.SecretKeyEntry entry = (KeyStore.SecretKeyEntry) ks.getEntry(KEY_ALIAS, null);
            return entry.getSecretKey();
        }
        KeyGenerator kg = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");
        kg.init(
                new KeyGenParameterSpec.Builder(
                                KEY_ALIAS,
                                KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT
                        )
                        .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                        .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                        .setRandomizedEncryptionRequired(true)
                        .setUserAuthenticationRequired(false)
                        .build()
        );
        return kg.generateKey();
    }
}
