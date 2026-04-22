// Regional per-player difficulty scaling. On Hard, mobs near a player's
// "difficulty center" (spawn chunk + time played) grow tougher. Scales
// armor drop chances, mob weapon probability, and spawner activation.
//
// Formula (approximation of MC's "RegionalDifficulty"):
//   base = difficulty (0..3 for peaceful..hard)
//   time = clamp(worldTimeTicks / (3 hours), 0, 1)
//   chunkPlay = clamp(chunkInhabitedTicks / (50 hours), 0, 1)
//   regional = base + time + chunkPlay × (2 if hard else 0)
//   clamped = max(0, min(6.75, regional))

import { type Difficulty } from './difficulty';

const BASE_BY_DIFFICULTY: Record<Difficulty, number> = {
  peaceful: 0,
  easy: 0.75,
  normal: 1.5,
  hard: 2.25,
};

export interface DifficultyQuery {
  difficulty: Difficulty;
  worldTimeSec: number;
  chunkInhabitedSec: number;
}

const MAX_WORLD_SEC = 3 * 60 * 60; // 3 hours
const MAX_INHABITED_SEC = 50 * 60 * 60; // 50 hours

export function regionalDifficulty(q: DifficultyQuery): number {
  const base = BASE_BY_DIFFICULTY[q.difficulty];
  if (base === 0) return 0;
  const time = Math.min(1, Math.max(0, q.worldTimeSec / MAX_WORLD_SEC));
  const chunk = Math.min(1, Math.max(0, q.chunkInhabitedSec / MAX_INHABITED_SEC));
  const extra = q.difficulty === 'hard' ? 2 * chunk : 0;
  return Math.min(6.75, Math.max(0, base + time + extra));
}

// Clamped to 0..1, used as a multiplier for probability rolls.
export function clampedRegional(q: DifficultyQuery): number {
  const r = regionalDifficulty(q);
  return Math.min(1, Math.max(0, (r - 2) / 4));
}

// Helper: on hard with long-inhabited chunks, mobs have higher chance
// to spawn with enchanted weapons/armor.
export function enchantedGearChance(q: DifficultyQuery): number {
  return 0.05 + 0.2 * clampedRegional(q);
}
