// Iron golem durability + visual cracks. HP fractions trigger visible
// crack tiers; golems regenerate HP over time. Repaired with iron ingots
// (25 HP each).

export type CrackTier = 'none' | 'minor' | 'moderate' | 'severe';

export interface IronGolemState {
  hp: number;
  maxHp: number;
}

export function makeIronGolem(): IronGolemState {
  return { hp: 100, maxHp: 100 };
}

export function crackTier(state: IronGolemState): CrackTier {
  const ratio = state.hp / state.maxHp;
  if (ratio >= 0.75) return 'none';
  if (ratio >= 0.5) return 'minor';
  if (ratio >= 0.25) return 'moderate';
  return 'severe';
}

export function repairIronGolem(state: IronGolemState, ingots: number): number {
  if (ingots <= 0) return 0;
  const heal = Math.min(state.maxHp - state.hp, 25 * ingots);
  state.hp += heal;
  return Math.ceil(heal / 25);
}

export function damageIronGolem(state: IronGolemState, amount: number): void {
  state.hp = Math.max(0, state.hp - amount);
}
