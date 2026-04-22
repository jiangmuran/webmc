// Wither boss phases. Phase 1: airborne, three-head ranged attack.
// Phase 2 (half health): armored charge, immune to arrows/projectiles,
// smashes through blocks.

export interface WitherState {
  health: number;
  maxHealth: number;
}

export type WitherPhase = 1 | 2;

export const WITHER_MAX_HEALTH = 300;
export const WITHER_ARMORED_HALF = WITHER_MAX_HEALTH / 2;

export function phase(s: WitherState): WitherPhase {
  return s.health <= s.maxHealth / 2 ? 2 : 1;
}

export function immuneToProjectile(s: WitherState): boolean {
  return phase(s) === 2;
}

export function canBreakBlocks(s: WitherState): boolean {
  return phase(s) === 2;
}

export function regenFromDrinkingMilk(_s: WitherState): boolean {
  // Wither is immune to milk effects; milk does not drain its effects.
  return false;
}
