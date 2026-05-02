export interface WitherState {
  hpPercent: number;
}

export const SHIELD_THRESHOLD = 0.5;

// Wiki: the wither activates its armored shield when health drops
// BELOW 50%, becoming arrow-immune and forcing melee combat. Above
// 50% it flies and is ranged-vulnerable. Code had it inverted —
// `hpPercent > 0.5` meant shielded at full HP, then drops shield as
// HP decreases (opposite of wiki).
export function hasShield(w: WitherState): boolean {
  return w.hpPercent < SHIELD_THRESHOLD;
}

export function explosionImmuneFromArrows(w: WitherState): boolean {
  return hasShield(w);
}

export function meleeOnlyBelowShield(w: WitherState): boolean {
  return hasShield(w);
}
