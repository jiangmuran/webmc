// Iron golem crack state. At low HP, crack decals appear. 4 tiers.

export interface IronGolem {
  hp: number;
  maxHp: number;
}

export type CrackTier = 'none' | 'low' | 'medium' | 'high';

export function crackTier(g: IronGolem): CrackTier {
  const fraction = g.hp / g.maxHp;
  if (fraction > 0.75) return 'none';
  if (fraction > 0.5) return 'low';
  if (fraction > 0.25) return 'medium';
  return 'high';
}

// Iron ingot heals 25 HP; only usable if HP < maxHp.
export const IRON_REPAIR = 25;

export function repair(g: IronGolem): boolean {
  if (g.hp >= g.maxHp) return false;
  g.hp = Math.min(g.maxHp, g.hp + IRON_REPAIR);
  return true;
}

// Drops: iron ingots 3-5, red poppies 0-2.
export function dropsOnDeath(rand: () => number): { id: string; count: number }[] {
  return [
    { id: 'webmc:iron_ingot', count: 3 + Math.floor(rand() * 3) },
    { id: 'webmc:poppy', count: Math.floor(rand() * 3) },
  ];
}
