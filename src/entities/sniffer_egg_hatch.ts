// Sniffer egg: placed on any block, hatches over 24000 ticks (double
// on non-moss).

export const EGG_MOSS_HATCH_TICKS = 24000;
export const EGG_DEFAULT_HATCH_TICKS = 48000;

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
