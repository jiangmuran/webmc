// Drowned zombies. A flat 6.25% per-spawn chance to hold a trident
// (Java).
//
// Wiki (minecraft.wiki/w/Drowned#Equipment): "Trident (6.25% chance)
// may be enchanted; Fishing Rod (3.75% chance); Nautilus Shell (3%
// chance in java and 8% chance in bedrock; only appears in offhand)."
//
// Wiki canon is a single flat trident-equip chance (6.25%) regardless
// of difficulty. Old per-difficulty values (8.5% / 11.5% / 15%) were
// fabricated and inflated the trident rate at every difficulty —
// ~36% over wiki at Easy, ~84% over at Normal, ~140% over at Hard.

export type Difficulty = 'easy' | 'normal' | 'hard';

export const HOLDS_TRIDENT_CHANCE = 0.0625;

export function holdsTridentChance(_d?: Difficulty): number {
  return HOLDS_TRIDENT_CHANCE;
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
