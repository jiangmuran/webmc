// Sniffer egg: placed on any block, hatches over 24000 ticks (half
// time on moss).
//
// Wiki (minecraft.wiki/w/Sniffer_Egg): "Sniffer eggs … hatch in 10
// minutes when placed on moss blocks or 20 minutes when placed on
// any other block."
//   10 min = 12000 ticks (moss)
//   20 min = 24000 ticks (default)
// Old constants were 24000/48000, ~2× the wiki values — sniffer
// players had to wait twice as long for hatching, with the moss
// "speed-up" matching the wiki default time. Sibling
// blocks/sniffer_egg_hatch.ts already had the correct 12000/24000.

export const EGG_MOSS_HATCH_TICKS = 12000;
export const EGG_DEFAULT_HATCH_TICKS = 24000;

export interface SnifferEgg {
  ticks: number;
  onMoss: boolean;
}

export function hatchTicksFor(onMoss: boolean): number {
  return onMoss ? EGG_MOSS_HATCH_TICKS : EGG_DEFAULT_HATCH_TICKS;
}

export function tick(e: SnifferEgg): SnifferEgg {
  return { ...e, ticks: e.ticks + 1 };
}

export function isHatched(e: SnifferEgg): boolean {
  return e.ticks >= hatchTicksFor(e.onMoss);
}

export function stage(e: SnifferEgg): 0 | 1 | 2 {
  const total = hatchTicksFor(e.onMoss);
  const pct = e.ticks / total;
  if (pct < 0.33) return 0;
  if (pct < 0.66) return 1;
  return 2;
}
