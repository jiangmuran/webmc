// Client snapshot interpolation. Render state lags 100ms behind most
// recent snapshot; two-point lerp.

export interface Snapshot {
  timestampMs: number;
  x: number;
  y: number;
  z: number;
}

export const RENDER_LAG_MS = 100;

export function findInterpolants(
  snapshots: Snapshot[],
  renderTimeMs: number,
): { from: Snapshot; to: Snapshot; t: number } | null {
  if (snapshots.length < 2) return null;
  for (let i = 0; i < snapshots.length - 1; i++) {
    const a = snapshots[i];
    const b = snapshots[i + 1];
    if (!a || !b) continue;
    if (a.timestampMs <= renderTimeMs && renderTimeMs <= b.timestampMs) {
      const t = (renderTimeMs - a.timestampMs) / Math.max(1, b.timestampMs - a.timestampMs);
      return { from: a, to: b, t };
    }
  }
  return null;
}

export function lerpPos(a: Snapshot, b: Snapshot, t: number): { x: number; y: number; z: number } {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}

export function pruneOld(snapshots: Snapshot[], nowMs: number, keepMs = 2000): Snapshot[] {
  return snapshots.filter((s) => nowMs - s.timestampMs <= keepMs);
}
