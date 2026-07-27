/*
 * Filename: gateway-auth.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/gateway/web/gateway-auth.ts
 * Change date and time: 14.21.00_17.07.2026
 * Reason for changes: Keep browser gateway authentication same-origin and
 *   cookie-based without exposing transport credentials to the UI bundle.
 */

export type GatewaySession = {
    authenticated: boolean;
    sourceClass?: "lan" | "wan";
    expiresAt?: number;
};

export class GatewayAuthError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "GatewayAuthError";
        this.status = status;
    }
}

const requestGateway = async <T>(url: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(url, {
        ...init,
        credentials: "same-origin",
        cache: "no-store",
        headers: {
            Accept: "application/json",
            ...(init?.body ? { "Content-Type": "application/json" } : {}),
            ...init?.headers
        }
    });

    if (response.status === 401) {
        window.location.assign("/");
        throw new GatewayAuthError("Gateway session expired", 401);
    }
    if (!response.ok) {
        throw new GatewayAuthError(`Gateway request failed (${response.status})`, response.status);
    }
    return (await response.json()) as T;
};

export const getGatewaySession = async (): Promise<GatewaySession> => {
    const body = await requestGateway<{ session?: GatewaySession }>("/gateway/auth/session");
    return body.session || { authenticated: false };
};

export const loginGateway = async (pin: string, remember: boolean): Promise<GatewaySession> => {
    const body = await requestGateway<{ session?: GatewaySession }>("/gateway/auth/login", {
        method: "POST",
        body: JSON.stringify({ pin, remember })
    });
    return body.session || { authenticated: false };
};

export const logoutGateway = async (): Promise<void> => {
    await requestGateway("/gateway/auth/logout", {
        method: "POST"
    });
};

