/*
 * Filename: Token.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/crypto/Token.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Opaque token holder stub. No real secret handling here.
 *
 * SECURITY: Never hardcode secrets in source. Tokens are loaded from env/config
 *           by the backend. This class only carries an opaque reference.
 */
package space.u2re.cwsp.protocol.crypto;

/**
 * Opaque token reference. Holds no secret material by design; callers obtain
 * the real token from a secure config provider.
 */
public final class Token {

    private final String reference;

    public Token(String reference) {
        this.reference = reference;
    }

    /** An opaque, non-secret reference (e.g. env var name or key id). */
    public String getReference() {
        return reference;
    }
}
