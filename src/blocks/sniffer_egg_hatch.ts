// Wiki (minecraft.wiki/w/Sniffer_Egg): "Sniffer eggs ... hatch in 10
// minutes when placed on moss blocks or 20 minutes when placed on any
// other block." 20 minutes = 24000 ticks (1 game-day), 10 minutes =
// 12000 ticks. Old constants were 10× too long (240000 / 120000)
// — players who placed an egg and waited a full game-day saw it
// still uncracked, when the wiki says it should already be hatched.
export const HATCH_TICKS_NORMAL = 24000;
export const HATCH_TICKS_MOSS = 12000;

export interface SnifferEgg {
  onMoss: boolean;
  tickAge: number;
  cracks: 0 | 1 | 2;
}

export function tickEgg(e: SnifferEgg): SnifferEgg {
  const limit = e.onMoss ? HATCH_TICKS_MOSS : HATCH_TICKS_NORMAL;
  const age = e.tickAge + 1;
  const frac = age / limit;
  const cracks: 0 | 1 | 2 = frac >= 1 ? 2 : frac >= 2 / 3 ? 2 : frac >= 1 / 3 ? 1 : 0;
  return { ...e, tickAge: age, cracks };
}

export function isReady(e: SnifferEgg): boolean {
  const limit = e.onMoss ? HATCH_TICKS_MOSS : HATCH_TICKS_NORMAL;
  return e.tickAge >= limit;
}
