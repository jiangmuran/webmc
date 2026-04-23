// Brewing stand timing. Ingredient added → 400 ticks (20s) to brew all
// three slots. Blaze powder fuel consumed per 20 brews.

export const BREW_TICKS = 400;
export const BLAZE_POWDER_USES = 20;

export interface BrewingState {
  ticksRemaining: number;
  fuelUses: number;
}

export function startBrew(s: BrewingState): BrewingState {
  if (s.fuelUses <= 0) return s;
  return { ...s, ticksRemaining: BREW_TICKS };
}

export function tick(s: BrewingState): { state: BrewingState; finished: boolean } {
  if (s.ticksRemaining <= 0) return { state: s, finished: false };
  const next = s.ticksRemaining - 1;
  if (next === 0) {
    return { state: { ticksRemaining: 0, fuelUses: Math.max(0, s.fuelUses - 1) }, finished: true };
  }
  return { state: { ...s, ticksRemaining: next }, finished: false };
}

export function addBlazePowder(s: BrewingState): BrewingState {
  return { ...s, fuelUses: s.fuelUses + BLAZE_POWDER_USES };
}

export function progress01(s: BrewingState): number {
  if (s.ticksRemaining <= 0) return 0;
  return 1 - s.ticksRemaining / BREW_TICKS;
}
