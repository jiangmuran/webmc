export interface Snapshot {
  tick: number;
  positions: Record<string, { x: number; y: number; z: number }>;
}

export function rewindToTick(history: Snapshot[], tick: number): Snapshot | undefined {
  for (let i = history.length - 1; i >= 0; i--) {
    const s = history[i];
    if (s && s.tick <= tick) return s;
  }
  return undefined;
}

export function prunedHistory(history: Snapshot[], maxTicks: number): Snapshot[] {
  if (history.length === 0) return history;
  const latest = history[history.length - 1]?.tick ?? 0;
  return history.filter((s) => latest - s.tick <= maxTicks);
}
