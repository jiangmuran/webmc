export const MAX_ELYTRA_DURABILITY = 432;
export const DURABILITY_LOSS_PER_SECOND = 1;

export interface ElytraState {
  durability: number;
  isGliding: boolean;
  secondsGliding: number;
  unbreakingLevel: number;
}

export function isBroken(s: ElytraState): boolean {
  return s.durability <= 1;
}

export function tickSecond(s: ElytraState, rng: () => number): ElytraState {
  if (!s.isGliding) return s;
  // Wiki (minecraft.wiki/w/Unbreaking): tools have a level/(level+1)
  // chance to PREVENT durability loss (L1=50%, L3=75%). Old formula
  // `rng < 1/(level+1)` inverted the relationship — higher Unbreaking
  // levels skipped LESS often (L3 was 25% spared).
  const spared = s.unbreakingLevel > 0 && rng() < s.unbreakingLevel / (s.unbreakingLevel + 1);
  const loss = spared ? 0 : DURABILITY_LOSS_PER_SECOND;
  return {
    ...s,
    secondsGliding: s.secondsGliding + 1,
    durability: Math.max(0, s.durability - loss),
  };
}

export function repairWithPhantomMembrane(s: ElytraState, membraneCount: number): ElytraState {
  const repair = Math.min(MAX_ELYTRA_DURABILITY - s.durability, membraneCount * 108);
  return { ...s, durability: s.durability + repair };
}
