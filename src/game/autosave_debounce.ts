// Autosave debouncer. Dirty chunks queue up; save triggers on interval
// or when queue size crosses a threshold. Also forced on visibility
// change (tab hidden) and before unload.

export interface SaveState {
  dirtyCount: number;
  lastSaveMs: number;
  inflight: boolean;
}

export const INTERVAL_MS = 30_000; // 30s autosave
export const THRESHOLD_DIRTY = 64;

export function makeSaveState(): SaveState {
  return { dirtyCount: 0, lastSaveMs: 0, inflight: false };
}

export function markDirty(s: SaveState, count = 1): void {
  s.dirtyCount += count;
}

export type Trigger = 'timer' | 'threshold' | 'visibility' | 'unload' | 'manual';

export interface ShouldSaveQuery {
  nowMs: number;
  trigger: Trigger;
}

export function shouldSave(s: SaveState, q: ShouldSaveQuery): boolean {
  if (s.inflight) return false;
  if (q.trigger === 'unload' || q.trigger === 'visibility' || q.trigger === 'manual') {
    return s.dirtyCount > 0;
  }
  if (q.trigger === 'threshold' && s.dirtyCount >= THRESHOLD_DIRTY) return true;
  return q.nowMs - s.lastSaveMs >= INTERVAL_MS && s.dirtyCount > 0;
}

export function beginSave(s: SaveState, nowMs: number): void {
  s.inflight = true;
  s.lastSaveMs = nowMs;
  s.dirtyCount = 0;
}

export function endSave(s: SaveState): void {
  s.inflight = false;
}
