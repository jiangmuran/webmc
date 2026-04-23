// Dirty chunk tracker. Marks chunks that need to be re-saved; throttles
// flushes to avoid write-storms.

export interface DirtyTracker {
  dirty: Set<string>;
  lastFlushMs: number;
  intervalMs: number;
}

export function makeTracker(intervalMs = 5000): DirtyTracker {
  return { dirty: new Set(), lastFlushMs: 0, intervalMs };
}

export function markDirty(t: DirtyTracker, chunkKey: string): void {
  t.dirty.add(chunkKey);
}

export function shouldFlush(t: DirtyTracker, nowMs: number): boolean {
  return t.dirty.size > 0 && nowMs - t.lastFlushMs >= t.intervalMs;
}

export function flush(t: DirtyTracker, nowMs: number): string[] {
  const keys = [...t.dirty];
  t.dirty.clear();
  t.lastFlushMs = nowMs;
  return keys;
}

export function pendingCount(t: DirtyTracker): number {
  return t.dirty.size;
}
