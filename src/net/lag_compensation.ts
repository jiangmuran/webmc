// Server-side lag compensation. Stores a sliding window of past entity
// positions; when processing a player's shot, rewinds to their view time.

export interface PositionHistory {
  samples: { t: number; x: number; y: number; z: number }[];
  maxAgeMs: number;
}

export function makeHistory(maxAgeMs = 1000): PositionHistory {
  return { samples: [], maxAgeMs };
}

export function record(h: PositionHistory, t: number, x: number, y: number, z: number): void {
  h.samples.push({ t, x, y, z });
  while (h.samples.length > 0) {
    const first = h.samples[0];
    if (!first) break;
    if (t - first.t <= h.maxAgeMs) break;
    h.samples.shift();
  }
}

export function positionAt(
  h: PositionHistory,
  t: number,
): { x: number; y: number; z: number } | null {
  if (h.samples.length === 0) return null;
  for (let i = h.samples.length - 1; i >= 0; i--) {
    const s = h.samples[i];
    if (s && s.t <= t) return { x: s.x, y: s.y, z: s.z };
  }
  return null;
}

export const MAX_LAG_COMPENSATION_MS = 200;

export function clampLag(ms: number): number {
  return Math.max(0, Math.min(MAX_LAG_COMPENSATION_MS, ms));
}
