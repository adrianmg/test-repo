interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class Cache<T> {
  private store = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private defaultTtl: number;

  constructor(opts: { maxSize?: number; defaultTtl?: number } = {}) {
    this.maxSize = opts.maxSize ?? 1000;
    this.defaultTtl = opts.defaultTtl ?? 300_000;
  }

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: T, ttl?: number): void {
    if (this.store.size >= this.maxSize) {
      const oldest = this.store.keys().next().value;
      if (oldest) this.store.delete(oldest);
    }
    this.store.set(key, {
      value,
      expiresAt: Date.now() + (ttl ?? this.defaultTtl),
    });
  }

  clear(): void {
    this.store.clear();
  }
}
