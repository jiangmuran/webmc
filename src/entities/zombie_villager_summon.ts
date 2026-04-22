// Zombie attacking a villager: on normal+ difficulty, villager becomes
// zombie villager (100% on hard, 50% on normal, 0% on easy). The
// original villager's profession/trades are preserved for cure.

export type Difficulty = 'peaceful' | 'easy' | 'normal' | 'hard';

export function conversionChance(d: Difficulty): number {
  switch (d) {
    case 'peaceful':
    case 'easy':
      return 0;
    case 'normal':
      return 0.5;
    case 'hard':
      return 1;
  }
}

export interface VillagerSnapshot {
  profession: string;
  tradesHash: string;
  xp: number;
}

export interface ConversionResult {
  converted: boolean;
  carriedOver: VillagerSnapshot | null;
}

export interface KillQuery {
  difficulty: Difficulty;
  rand: () => number;
  villager: VillagerSnapshot;
}

export function onVillagerKilledByZombie(q: KillQuery): ConversionResult {
  const chance = conversionChance(q.difficulty);
  if (chance <= 0) return { converted: false, carriedOver: null };
  if (q.rand() < chance) return { converted: true, carriedOver: q.villager };
  return { converted: false, carriedOver: null };
}
