// Brain memory system. Entities record facts (nearest_target, home,
// last_attacker) with optional expiry.

export interface MemoryEntry {
  value: unknown;
  expireAtTick: number | null;
}

export interface Brain {
  entries: Map<string, MemoryEntry>;
}

export function makeBrain(): Brain {
  return { entries: new Map() };
}

export function set(
  b: Brain,
  key: string,
  value: unknown,
  expireAtTick: number | null = null,
): void {
  b.entries.set(key, { value, expireAtTick });
}

export function get(b: Brain, key: string, nowTick: number): unknown {
  const e = b.entries.get(key);
  if (!e) return undefined;
  if (e.expireAtTick !== null && nowTick >= e.expireAtTick) {
    b.entries.delete(key);
    return undefined;
  }
  return e.value;
}

export function forget(b: Brain, key: string): void {
  b.entries.delete(key);
}

export function has(b: Brain, key: string, nowTick: number): boolean {
  return get(b, key, nowTick) !== undefined;
}
