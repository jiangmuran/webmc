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
  const spared = s.unbreakingLevel > 0 && rng() < 1 / (s.unbreakingLevel + 1);
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
