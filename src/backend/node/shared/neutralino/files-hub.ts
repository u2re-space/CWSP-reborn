/*
 * Filename: files-hub.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/shared/neutralino/files-hub.ts
 * Change date and time: 15.22.00_21.07.2026
 * Reason for changes: Wave 3 Task 2 — Neutralino files-hub SoT. Owns local
 *   staging (copy into a per-transfer dir with basename collision suffix),
 *   enforces shared stage limits, applies the hybrid offer-after-stage
 *   policy, and wires the W1 packer (`planFilesBatches`) for `batchPlan`.
 *   Transport/WS emission is deliberately NOT done here (Task 3 owns offer
 *   emission). Android is untouched; the hardlinked generic/ mirror follows.
 */

import { randomUUID } from "node:crypto";
import { stat, copyFile, mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
    assertStageLimits,
    decideOfferAfterStage,
    planFilesBatches,
    type FilesHubPhase,
    type FilesIngressSource,
    type FilesPackerBatchPlan,
    type FilesStageLimitsResult,
} from "@fest-lib/cwsp-shared/v2/index.ts";

/**
 * One staged file. `name` is the collision-suffixed basename inside
 * `stageDir`; `sourcePath` is the original absolute path the caller passed in;
 * `stagedPath` is the absolute path under `stageDir` after the copy.
 */
export interface FilesHubFile {
    name: string;
    sourcePath: string;
    stagedPath: string;
    size: number;
}

/**
 * Active hub session. `batchPlan` comes from the W1 packer; zip bytes are
 * materialized in Task 3 (offer emission), not here.
 */
export interface FilesHubSession {
    transferId: string;
    stageDir: string;
    files: FilesHubFile[];
    phase: FilesHubPhase;
    batchPlan: FilesPackerBatchPlan[];
    source: FilesIngressSource;
    defaultDestinations: string[];
    openForShare: "manual" | "auto";
    /** Present only on `readyToOffer` (set by ingress auto-offer or confirmOffer). */
    destinations?: string[];
    createdAt: number;
}

export interface FilesHubIngressInput {
    source: FilesIngressSource;
    paths: string[];
    defaultDestinations: string[];
    openForShare: "manual" | "auto";
}

export interface FilesHubOptions {
    /** Root for per-transfer stage dirs. Defaults to `os.tmpdir()/cwsp-files`. */
    stageRoot?: string;
    /** Override id generator (defaults to `node:crypto.randomUUID`). */
    generateId?: () => string;
}

export interface FilesHubPhaseEvent {
    transferId: string;
    phase: FilesHubPhase;
}

export interface FilesHubRuntime {
    ingressLocalPaths(input: FilesHubIngressInput): Promise<FilesHubSession>;
    confirmOffer(transferId: string, destinations: string[]): Promise<void>;
    cancel(transferId: string): Promise<void>;
    getSession(transferId: string): FilesHubSession | undefined;
    /** Snapshot of active sessions (diagnostics / tests). */
    listSessions(): FilesHubSession[];
    /** Subscribe to phase transitions. Returns an unsubscribe. */
    onPhase(cb: (evt: FilesHubPhaseEvent) => void): () => void;
}

class FilesHubStageLimitError extends Error {
    readonly limitResult: FilesStageLimitsResult;
    constructor(limitResult: FilesStageLimitsResult) {
        const r = limitResult as { ok: false; reason: string; count: number; totalBytes: number };
        super(`CWSP_FILES_STAGE_LIMIT:${r.reason}`);
        this.name = "FilesHubStageLimitError";
        this.limitResult = limitResult;
    }
}

/**
 * Build a unique basename inside `stageDir` for a desired name, appending
 * `-N` before the extension when a collision would occur. Pure: callers must
 * ensure the returned name is reserved before the next call.
 */
function uniqueBasename(used: Set<string>, desired: string): string {
    if (!used.has(desired)) {
        used.add(desired);
        return desired;
    }
    const ext = path.extname(desired);
    const base = path.basename(desired, ext);
    let i = 1;
    for (;;) {
        const candidate = `${base}-${i}${ext}`;
        if (!used.has(candidate)) {
            used.add(candidate);
            return candidate;
        }
        i++;
    }
}

export function createFilesHub(options: FilesHubOptions = {}): FilesHubRuntime {
    const stageRoot = options.stageRoot ?? path.join(os.tmpdir(), "cwsp-files");
    const generateId = options.generateId ?? (() => randomUUID());
    const sessions = new Map<string, FilesHubSession>();
    const phaseListeners = new Set<(evt: FilesHubPhaseEvent) => void>();

    function emitPhase(session: FilesHubSession): void {
        const evt = { transferId: session.transferId, phase: session.phase };
        for (const cb of phaseListeners) {
            try {
                cb(evt);
            } catch {
                /* listener errors are non-fatal to the hub */
            }
        }
    }

    function setPhase(session: FilesHubSession, phase: FilesHubPhase): void {
        session.phase = phase;
        emitPhase(session);
    }

    async function removeStageDir(session: FilesHubSession): Promise<void> {
        try {
            await rm(session.stageDir, { recursive: true, force: true });
        } catch {
            /* best-effort GC; ignore fs errors on cleanup */
        }
    }

    async function ingressLocalPaths(
        input: FilesHubIngressInput,
    ): Promise<FilesHubSession> {
        const transferId = generateId();
        const stageDir = path.join(stageRoot, transferId);
        // WHY: create the per-transfer dir up front so copyFile targets exist.
        await mkdir(stageDir, { recursive: true });

        const files: FilesHubFile[] = [];
        const usedNames = new Set<string>();

        try {
            for (const src of input.paths) {
                const abs = path.resolve(src);
                const stats = await stat(abs);
                if (!stats.isFile()) {
                    throw new Error(`CWSP_FILES_INGRESS_NOT_FILE:${abs}`);
                }
                const desired = path.basename(abs);
                const name = uniqueBasename(usedNames, desired);
                const stagedPath = path.join(stageDir, name);
                await copyFile(abs, stagedPath);
                files.push({
                    name,
                    sourcePath: abs,
                    stagedPath,
                    size: stats.size,
                });
            }

            // WHY: enforce the shared isomorphic stage boundary before any
            // offer materialization. On failure, delete the partial dir and
            // surface a precise reason via FilesHubStageLimitError.
            const limit = assertStageLimits(files);
            if (!limit.ok) {
                throw new FilesHubStageLimitError(limit);
            }

            // W1 packer: sizes-only input keeps the plan isomorphic across shells.
            const batchPlan = planFilesBatches(
                files.map((f) => ({ name: f.name, size: f.size })),
            );

            const decision = decideOfferAfterStage({
                source: input.source,
                defaultDestinations: input.defaultDestinations,
                openForShare: input.openForShare,
            });

            const session: FilesHubSession = {
                transferId,
                stageDir,
                files,
                phase: decision.phase,
                batchPlan,
                source: input.source,
                defaultDestinations: input.defaultDestinations,
                openForShare: input.openForShare,
                destinations:
                    decision.phase === "readyToOffer" ? decision.destinations : undefined,
                createdAt: Date.now(),
            };

            sessions.set(transferId, session);
            emitPhase(session);
            return session;
        } catch (error) {
            // Partial stage dir must not survive a failed ingress.
            await rm(stageDir, { recursive: true, force: true });
            throw error;
        }
    }

    async function confirmOffer(
        transferId: string,
        destinations: string[],
    ): Promise<void> {
        const session = sessions.get(transferId);
        if (!session) {
            throw new Error(`CWSP_FILES_SESSION_NOT_FOUND:${transferId}`);
        }
        if (session.phase !== "needDestinations") {
            throw new Error(`CWSP_FILES_CONFIRM_BAD_PHASE:${session.phase}`);
        }
        const dest = destinations.map(String).filter(Boolean);
        if (dest.length === 0) {
            throw new Error("CWSP_FILES_CONFIRM_NO_DESTINATIONS");
        }
        session.destinations = dest;
        setPhase(session, "readyToOffer");
    }

    async function cancel(transferId: string): Promise<void> {
        const session = sessions.get(transferId);
        if (!session) {
            return;
        }
        sessions.delete(transferId);
        setPhase(session, "cancel");
        await removeStageDir(session);
    }

    function getSession(transferId: string): FilesHubSession | undefined {
        return sessions.get(transferId);
    }

    function listSessions(): FilesHubSession[] {
        return [...sessions.values()];
    }

    function onPhase(cb: (evt: FilesHubPhaseEvent) => void): () => void {
        phaseListeners.add(cb);
        return () => {
            phaseListeners.delete(cb);
        };
    }

    return {
        ingressLocalPaths,
        confirmOffer,
        cancel,
        getSession,
        listSessions,
        onPhase,
    };
}
