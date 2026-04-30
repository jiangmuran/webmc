export interface DrinkCtx {
  amplifier: number;
}

// Wiki (minecraft.wiki/w/Bad_Omen): "Bad Omen has 5 amplifier levels
// (0–4, displayed as I–V)." Old MAX_AMPLIFIER=5 would clamp to a
// non-existent level VI; sibling ominous_bottle.ts already typed the
// amplifier as `0 | 1 | 2 | 3 | 4`.
export const MAX_AMPLIFIER = 4;

export function badOmenAmplifier(c: DrinkCtx): number {
  return Math.max(0, Math.min(MAX_AMPLIFIER, c.amplifier));
}

export function drinkDurationTicks(): number {
  return 32;
}

export function returnsEmptyBottle(): boolean {
  return true;
}
