// Drowned zombies. Some spawn holding tridents; 8.5% on easy, 11.5%
// normal, 15% hard. Tridents drop ~8.5% on kill (affected by looting).

export type Difficulty = 'easy' | 'normal' | 'hard';

export function holdsTridentChance(d: Difficulty): number {
  switch (d) {
    case 'easy':
      return 0.085;
    case 'normal':
      return 0.115;
    case 'hard':
      return 0.15;
  }
}

export interface SpawnQuery {
  difficulty: Difficulty;
  rand: () => number;
}

export function shouldSpawnWithTrident(q: SpawnQuery): boolean {
  return q.rand() < holdsTridentChance(q.difficulty);
}

// Wiki: drowned drop their trident with 8.5% base chance, +1% per
// looting level, capped at 11.5% with Looting III. Old cap was 15%
// which exceeded the Looting III maximum.
export const TRIDENT_DROP_BASE = 0.085;
export const TRIDENT_DROP_CAP = 0.115;

export function tridentDropChance(lootingLevel: number): number {
  return Math.min(TRIDENT_DROP_CAP, TRIDENT_DROP_BASE + lootingLevel * 0.01);
}

// Drowned has a ranged attack: throws held trident at the target if
// > 4 blocks away.
export const RANGED_MIN_DISTANCE = 4;
export const RANGED_MAX_DISTANCE = 20;

export function shouldThrowTrident(distance: number): boolean {
  return distance >= RANGED_MIN_DISTANCE && distance <= RANGED_MAX_DISTANCE;
}
