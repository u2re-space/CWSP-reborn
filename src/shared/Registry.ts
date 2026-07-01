const SharedLink = Symbol("SharedLink");
const SharedRegistry: Record<symbol, any> = (globalThis as any)[SharedLink] ?? {};
(globalThis as any)[SharedLink] ??= SharedRegistry;

export default SharedRegistry;
export function registerShared<T>(key: symbol, value: T) {
    SharedRegistry[key] ??= value;
}
