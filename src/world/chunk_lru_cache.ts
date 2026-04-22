// LRU chunk cache. Recently-accessed chunks stay in memory; beyond
// capacity the oldest is evicted (with flush hook).

export interface LRUCache<V> {
  capacity: number;
  map: Map<string, V>;
}

export function makeLRU<V>(capacity: number): LRUCache<V> {
  return { capacity, map: new Map() };
}

export function get<V>(c: LRUCache<V>, key: string): V | undefined {
  const v = c.map.get(key);
  if (v === undefined) return undefined;
  c.map.delete(key);
  c.map.set(key, v);
  return v;
}

export function set<V>(c: LRUCache<V>, key: string, value: V): V | undefined {
  if (c.map.has(key)) c.map.delete(key);
  c.map.set(key, value);
  if (c.map.size > c.capacity) {
    const first = c.map.keys().next().value;
    if (first !== undefined) {
      const evicted = c.map.get(first);
      c.map.delete(first);
      return evicted;
    }
  }
  return undefined;
}

export function size<V>(c: LRUCache<V>): number {
  return c.map.size;
}

export function has<V>(c: LRUCache<V>, key: string): boolean {
  return c.map.has(key);
}
