// Zombie reinforcement. Only Hard difficulty allows reinforcements;
// the spawning zombie inherits a "reinforcement" flag so it doesn't
// chain.
//
// Wiki (minecraft.wiki/w/Zombie#Reinforcements): "In Hard difficulty,
// zombie mobs can spawn additional zombie mobs of the same type to
// 'help' when damaged while targeting a player or other entity. Each
// mob has a 'likeliness to call reinforcements' statistic ranging
// from 0–10%, and 'leader' zombie mobs get a bonus of 50–75
// percentage points."
//
// Old chances allowed Normal difficulty (0.05) reinforcements — the
// wiki explicitly limits the mechanic to Hard. The 10% upper bound
// matches the wiki for non-leader zombies.

export type Difficulty = 'peaceful' | 'easy' | 'normal' | 'hard';

export interface ReinforcementQuery {
  difficulty: Difficulty;
  zombiesNearby: number; // throttle: >= 7 blocks the summon
  canSummon: boolean; // flag set to false on summoned descendants
  roll: number; // 0..1
}

const CHANCES: Record<Difficulty, number> = {
  peaceful: 0,
  easy: 0,
  normal: 0,
  hard: 0.1,
};

const MAX_NEARBY = 7;

export interface ReinforcementResult {
  summon: boolean;
  chance: number;
}

export function shouldSummonReinforcement(q: ReinforcementQuery): ReinforcementResult {
  if (!q.canSummon) return { summon: false, chance: 0 };
  if (q.zombiesNearby >= MAX_NEARBY) return { summon: false, chance: 0 };
  const chance = CHANCES[q.difficulty];
  return { summon: q.roll < chance, chance };
}

// The summoned zombie spawns at a random 7-12 block offset on the ground.
// Returns the chosen offset (world-space) using the roll as seed.
export function pickSummonOffset(roll1: number, roll2: number): { dx: number; dz: number } {
  const angle = roll1 * Math.PI * 2;
  const dist = 7 + roll2 * 5;
  return {
    dx: Math.round(Math.cos(angle) * dist),
    dz: Math.round(Math.sin(angle) * dist),
  };
}

// Wiki (minecraft.wiki/w/Zombie#Spawning): "Zombies have a 5% chance
// to spawn as babies." The chance is constant across all difficulties;
// old code scaled it to 7.5% on Hard difficulty, which is nowhere in
// the wiki.
export function isBabyZombie(roll: number, _difficulty: Difficulty): boolean {
  return roll < 0.05;
}

// Zombies pick up armor and items placed nearby; this has a per-item
// category probability.
export type PickupCategory = 'weapon' | 'armor' | 'food' | 'other';

const PICKUP_CHANCE: Record<PickupCategory, number> = {
  weapon: 0.55,
  armor: 0.4,
  food: 0.1,
  other: 0.1,
};

export function willPickup(cat: PickupCategory, roll: number): boolean {
  return roll < PICKUP_CHANCE[cat];
}
