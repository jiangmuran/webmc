export interface WitherState {
  hpPercent: number;
}

export const SHIELD_THRESHOLD = 0.5;

export function hasShield(w: WitherState): boolean {
  return w.hpPercent > SHIELD_THRESHOLD;
}

export function explosionImmuneFromArrows(w: WitherState): boolean {
  return hasShield(w);
}

export function meleeOnlyBelowShield(w: WitherState): boolean {
  return !hasShield(w);
}
