/*
 * Filename: Policy.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/state/Policy.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Thin re-export wrapper so callers can use a state-package
 *                     entry point. Real evaluation lives in network.Policy.
 */
package space.u2re.cwsp.protocol.state;

import space.u2re.cwsp.protocol.packet.Packet;
import space.u2re.cwsp.protocol.packet.Types;

/**
 * State-package facade over {@link space.u2re.cwsp.protocol.network.Policy}.
 * Delegates to the canonical evaluator so all platforms share one impl.
 *
 * NOTE: The class is named {@code Policy} to match its file. The delegate is
 *       referenced fully-qualified to avoid a same-simple-name clash.
 */
public final class Policy {

    private Policy() {
    }

    public static space.u2re.cwsp.protocol.network.Policy.Decision evaluate(
            Packet packet, space.u2re.cwsp.protocol.network.Policy.Context context) {
        return space.u2re.cwsp.protocol.network.Policy.evaluate(packet, context);
    }

    public static space.u2re.cwsp.protocol.network.Policy.Decision evaluate(
            Packet packet, space.u2re.cwsp.protocol.network.Policy.Context context,
            space.u2re.cwsp.protocol.network.Policy.Overrides overrides) {
        return space.u2re.cwsp.protocol.network.Policy.evaluate(packet, context, overrides);
    }

    public static Types.PolicyClass classify(Packet packet) {
        return space.u2re.cwsp.protocol.network.Policy.classify(packet);
    }
}
