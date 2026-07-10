/*
 * Filename: IDB.ts
 * FullPath: apps/CWSP-reborn/src/backend/web/pwa/IDB.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Stream C — thin IndexedDB key-value helper with an
 * injectable in-memory store so PWA defer flows run unchanged under Node tests.
 *
 * NOTE: The browser path uses the native `indexedDB` factory. The memory path
 * is the canonical test/SSR fallback and must stay behavior-compatible (async
 * get/set/delete, structured by key). We intentionally do not bring a polyfill
 * here: callers that need IDB in a non-browser host should inject a KvStore.
 */

/** Minimal async key-value contract used by PWA defer/restore flows. */
export interface KvStore {
    get(key: string): Promise<unknown>;
    set(key: string, value: unknown): Promise<void>;
    delete(key: string): Promise<void>;
}

/**
 * Pure in-memory KvStore. Used directly in Node tests and as the fallback when
 * `indexedDB` is unavailable. Keeps insertion order semantics irrelevant —
 * callers only rely on last-write-wins by key.
 */
export function createMemoryKvStore(): KvStore {
    const map = new Map<string, unknown>();
    return {
        async get(key: string): Promise<unknown> {
            return map.get(key);
        },
        async set(key: string, value: unknown): Promise<void> {
            map.set(key, value);
        },
        async delete(key: string): Promise<void> {
            map.delete(key);
        },
    };
}

/**
 * Browser-backed KvStore over a single IDB object store.
 *
 * Behavior contract:
 * - lazily opens/creates the database with `storeName` as the object store;
 * - the store is keyed by string keys and uses `put` for last-write-wins;
 * - if `indexedDB` is not available, throws `Error("IDB unavailable")` so the
 *   caller can fall back to `createMemoryKvStore()` explicitly. We do not
 *   silently fall back here to avoid hiding environment bugs in the browser.
 */
export function createIdbKvStore(dbName: string, storeName: string): KvStore {
    const indexedDB = getIndexedDB();
    if (!indexedDB) {
        throw new Error("IDB unavailable: indexedDB not present in this context");
    }

    // Shared connection promise so repeated get/set/delete don't re-open the DB.
    let dbPromise: Promise<IDBDatabase> | null = null;

    function openDb(): Promise<IDBDatabase> {
        if (dbPromise) {
            return dbPromise;
        }
        dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
            const req = indexedDB.open(dbName, 1);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName);
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error ?? new Error("IDB open failed"));
        });
        return dbPromise;
    }

    function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
        return openDb().then(
            (db) =>
                new Promise<T>((resolve, reject) => {
                    const transaction = db.transaction(storeName, mode);
                    const store = transaction.objectStore(storeName);
                    const request = run(store);
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error ?? new Error("IDB request failed"));
                }),
        );
    }

    return {
        async get(key: string): Promise<unknown> {
            return tx<unknown>("readonly", (store) => store.get(key) as IDBRequest<unknown>);
        },
        async set(key: string, value: unknown): Promise<void> {
            await tx<unknown>("readwrite", (store) => store.put(value, key) as IDBRequest<unknown>);
        },
        async delete(key: string): Promise<void> {
            await tx<undefined>("readwrite", (store) => store.delete(key) as IDBRequest<undefined>);
        },
    };
}

/** Type-safe accessor for the global indexedDB, narrowed to the browser shape. */
function getIndexedDB(): IDBFactory | undefined {
    if (typeof indexedDB !== "undefined") {
        return indexedDB;
    }
    // Some non-browser hosts expose it on globalThis; never assume.
    const maybe = (globalThis as { indexedDB?: IDBFactory }).indexedDB;
    return maybe;
}
