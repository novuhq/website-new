type CacheOptions<T> = {
  read: (key: string) => Promise<{ value: T; cacheable: boolean }>
  ttl: (value: T) => number
  now?: () => number
  maxEntries?: number
  maxBytes?: number
}

/** Best-effort, per-process cache; rejected work is never retained. */
export function createCachedReader<T>({
  read,
  ttl,
  now = Date.now,
  maxEntries = 100,
  maxBytes = 20 * 1024 * 1024,
}: CacheOptions<T>): (key: string) => Promise<T> {
  const entries = new Map<
    string,
    { value: T; expires: number; bytes: number }
  >()
  const inFlight = new Map<string, Promise<T>>()
  let retainedBytes = 0

  function remove(key: string) {
    retainedBytes -= entries.get(key)?.bytes ?? 0
    entries.delete(key)
  }

  return async (key) => {
    for (const [storedKey, entry] of entries) {
      if (entry.expires <= now()) remove(storedKey)
    }
    const cached = entries.get(key)
    if (cached) {
      entries.delete(key)
      entries.set(key, cached)
      return cached.value
    }
    const existing = inFlight.get(key)
    if (existing) return existing

    const pending = Promise.resolve()
      .then(() => read(key))
      .then(({ value, cacheable }) => {
        const bytes =
          Buffer.byteLength(JSON.stringify(value)) + Buffer.byteLength(key)
        if (cacheable && bytes <= maxBytes && maxEntries > 0) {
          while (
            entries.size >= maxEntries ||
            retainedBytes + bytes > maxBytes
          ) {
            const oldest = entries.keys().next().value
            if (oldest === undefined) break
            remove(oldest)
          }
          entries.set(key, { value, expires: now() + ttl(value), bytes })
          retainedBytes += bytes
        }
        return value
      })
      .finally(() => inFlight.delete(key))

    inFlight.set(key, pending)
    return pending
  }
}
