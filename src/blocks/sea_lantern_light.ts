export const SEA_LANTERN_LIGHT_LEVEL = 15;

export function emitsLight(): number {
  return SEA_LANTERN_LIGHT_LEVEL;
}

// Wiki (minecraft.wiki/w/Sea_Lantern): drops 2-3 prismarine crystals
// (uniform) without fortune. Fortune III can extend the upper bound
// to 5; the caller stacks the bonus. Old formula rolled 2-4, off by
// one on the high end.
export function prismarineCrystalsDropped(rng: () => number): number {
  return 2 + Math.floor(rng() * 2);
}

export function silkTouchDropsSelf(): boolean {
  return true;
}
