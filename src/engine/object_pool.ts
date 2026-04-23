// Object pool for short-lived allocations (particles, raycast hits).

export interface Pool<T> {
  free: T[];
  factory: () => T;
  reset: (item: T) => void;
  inUse: number;
}

export function makePool<T>(factory: () => T, reset: (item: T) => void, prefill = 0): Pool<T> {
  const free: T[] = [];
  for (let i = 0; i < prefill; i++) free.push(factory());
  return { free, factory, reset, inUse: 0 };
}

export function acquire<T>(p: Pool<T>): T {
  const item = p.free.pop() ?? p.factory();
  p.inUse++;
  return item;
}

export function release<T>(p: Pool<T>, item: T): void {
  p.reset(item);
  p.free.push(item);
  p.inUse = Math.max(0, p.inUse - 1);
}

export function totalCapacity<T>(p: Pool<T>): number {
  return p.free.length + p.inUse;
}
