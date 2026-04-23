export interface ThrottleState {
  dirtySet: Set<string>;
  lastFlushMs: number;
  minFlushIntervalMs: number;
  maxBatchSize: number;
}

export function markDirty(s: ThrottleState, key: string): void {
  s.dirtySet.add(key);
}

export function shouldFlush(s: ThrottleState, nowMs: number): boolean {
  if (s.dirtySet.size === 0) return false;
  if (s.dirtySet.size >= s.maxBatchSize) return true;
  return nowMs - s.lastFlushMs >= s.minFlushIntervalMs;
}

export function drainBatch(s: ThrottleState, nowMs: number): readonly string[] {
  const keys = [...s.dirtySet];
  s.dirtySet.clear();
  s.lastFlushMs = nowMs;
  return keys;
}
