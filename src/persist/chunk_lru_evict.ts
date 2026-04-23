export interface CacheState<T> {
  entries: Map<string, T>;
  accessOrder: string[];
  capacity: number;
}

export function touch<T>(s: CacheState<T>, key: string): CacheState<T> {
  if (!s.entries.has(key)) return s;
  const order = s.accessOrder.filter((k) => k !== key);
  order.push(key);
  return { ...s, accessOrder: order };
}

export function put<T>(s: CacheState<T>, key: string, value: T): CacheState<T> {
  const entries = new Map(s.entries);
  entries.set(key, value);
  let order = s.accessOrder.filter((k) => k !== key);
  order.push(key);
  while (entries.size > s.capacity && order.length > 0) {
    const evict = order.shift();
    if (evict !== undefined) entries.delete(evict);
  }
  return { ...s, entries, accessOrder: order };
}
