// Cave spider: smaller, poison-applying variant. Spawns from mineshaft
// cobweb spawners. Poison duration scales with difficulty.

export interface PoisonByDifficulty {
  normal: number;
  hard: number;
}

export const CAVE_SPIDER_POISON_TICKS: PoisonByDifficulty = {
  normal: 7 * 20,
  hard: 15 * 20,
};

export function poisonTicks(difficulty: 'easy' | 'normal' | 'hard'): number {
  if (difficulty === 'easy') return 0;
  if (difficulty === 'normal') return CAVE_SPIDER_POISON_TICKS.normal;
  return CAVE_SPIDER_POISON_TICKS.hard;
}

export function fitsThroughOneBlockGap(): boolean {
  return true;
}

export const CAVE_SPIDER_HITBOX_WIDTH = 0.7;
export const CAVE_SPIDER_HITBOX_HEIGHT = 0.5;

export function climbsWalls(): boolean {
  return true;
}
