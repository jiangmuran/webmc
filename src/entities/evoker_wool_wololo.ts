// Evoker wololo. Casts a spell that turns nearby white sheep RED in
// Java Edition within a 16-block radius. Per wiki, evoker spells
// share a 100-tick (5-second) cooldown after each cast.

export interface WololoState {
  lastCastMs: number;
}

// Wiki (minecraft.wiki/w/Evoker): spell cooldown is 100 ticks (5 s),
// not 10 s. Old constant was 2× too long.
export const WOLOLO_COOLDOWN_MS = 5_000;
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
