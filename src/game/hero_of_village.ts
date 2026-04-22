// Hero of the Village — status effect awarded for winning a raid. Grants
// villager trade discounts scaling with amplifier (40-55% off).

export interface HeroState {
  active: boolean;
  amplifier: number; // 0..4 (I..V)
  remainingSec: number;
}

const DEFAULT_DURATION_SEC = 40 * 60; // 40 minutes, matches MC

export function makeHero(): HeroState {
  return { active: false, amplifier: 0, remainingSec: 0 };
}

export function awardHero(state: HeroState, amplifier: number): void {
  state.active = true;
  state.amplifier = Math.min(4, Math.max(0, amplifier));
  state.remainingSec = DEFAULT_DURATION_SEC;
}

export function tickHero(state: HeroState, dtSec: number): void {
  if (!state.active) return;
  state.remainingSec = Math.max(0, state.remainingSec - dtSec);
  if (state.remainingSec === 0) state.active = false;
}

// Trade discount: amplifier 0 = 30%, each level +5%, capped 55%.
export function tradeDiscount(state: HeroState): number {
  if (!state.active) return 0;
  return Math.min(0.55, 0.3 + state.amplifier * 0.05);
}
