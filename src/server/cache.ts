type CacheEntry = { value: unknown };

const store = new Map<string, CacheEntry>();

/**
 * In-memory stand-in for the Redis cache the Rust service uses for posts and
 * compressed images. Key shapes match: post id, and `${id}_${compression}`.
 */
export const memoryCache = {
    get<T>(key: string): T | undefined {
        return store.get(key)?.value as T | undefined;
    },
    set(key: string, value: unknown): void {
        store.set(key, { value });
    },
    has(key: string): boolean {
        return store.has(key);
    },
    clear(): void {
        store.clear();
    },
    size(): number {
        return store.size;
    },
};
