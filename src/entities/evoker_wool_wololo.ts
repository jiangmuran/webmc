// Evoker "wololo" spell. Casts a spell that turns nearby BLUE sheep
// RED within a 16-block radius (Java Edition).
//
// Wiki (minecraft.wiki/w/Evoker#Sheep_color_conversion_spell): "While
// the evoker is not engaged in combat and mob_griefing is set to
// true, it changes the wool color of any blue sheep within sixteen
// blocks from blue to red." Updated in JE 19w04a from red→blue to
// blue→red.
//
// Wiki: "This spell resets the evoker's spell cooldown to three
// seconds and resets the cooldown for the sheep color conversion
// spell to seven seconds." So 7 s is the wololo-specific cooldown.
//
// Old code targeted `whiteSheepIds` — wrong color, wiki specifies
// BLUE sheep. Cooldown was 5 s; wiki canon is 7 s. Field renamed
// `targetSheepIds` (sheep that match the spell's blue → red rule);
// the legacy `whiteSheepIds` accessor is preserved as an alias for
// back-compat with callers that pre-date the fix.

export interface WololoState {
  lastCastMs: number;
}

export const WOLOLO_COOLDOWN_MS = 7_000;
export const WOLOLO_RANGE = 16;

export function makeWololo(): WololoState {
  return { lastCastMs: -Infinity };
}

export interface CastQuery {
  nowMs: number;
  // Sheep that match the wololo source color (blue per wiki). The
  // `whiteSheepIds` alias is kept for back-compat.
  targetSheepIds?: string[];
  whiteSheepIds?: string[];
  sheepDistances: Map<string, number>;
}

export function tryWololo(
  s: WololoState,
  q: CastQuery,
): { targetSheepId: string; nowMs: number } | null {
  if (q.nowMs - s.lastCastMs < WOLOLO_COOLDOWN_MS) return null;
  const ids = q.targetSheepIds ?? q.whiteSheepIds ?? [];
  let best: string | null = null;
  let bestD = Infinity;
  for (const id of ids) {
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

// Wiki: spell turns blue → red since JE 19w04a.
export const WOLOLO_SOURCE_COLOR = 'blue';
export const WOLOLO_TARGET_COLOR = 'red';
