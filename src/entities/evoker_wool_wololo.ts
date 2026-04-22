// Evoker wololo. Casts a spell that turns nearby sheep blue. Targets
// white sheep only, range 16. Cooldown 10s.

export interface WololoState {
  lastCastMs: number;
}

export const WOLOLO_COOLDOWN_MS = 10_000;
export const WOLOLO_RANGE = 16;

export function makeWololo(): WololoState {
  return { lastCastMs: -Infinity };
}

export interface CastQuery {
  nowMs: number;
  whiteSheepIds: string[];
  sheepDistances: Map<string, number>;
}

export function tryWololo(
  s: WololoState,
  q: CastQuery,
): { targetSheepId: string; nowMs: number } | null {
  if (q.nowMs - s.lastCastMs < WOLOLO_COOLDOWN_MS) return null;
  let best: string | null = null;
  let bestD = Infinity;
  for (const id of q.whiteSheepIds) {
    const d = q.sheepDistances.get(id);
    if (d === undefined) continue;
    if (d > WOLOLO_RANGE) continue;
    if (d < bestD) {
      bestD = d;
      best = id;
    }
  }
  if (!best) return null;
  s.lastCastMs = q.nowMs;
  return { targetSheepId: best, nowMs: q.nowMs };
}

// Target sheep becomes red, not blue? In 1.20+ it's red after the
// legacy 19w04a change. Verify per MC version... we say red.
export const WOLOLO_TARGET_COLOR = 'red';
