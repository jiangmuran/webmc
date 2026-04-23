// Skeleton horse trap. During thunderstorm, a rare "trap" skeleton horse
// spawns; when approached, lightning strikes + 4 skeleton riders appear.

export interface StormCtx {
  thundering: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  regionalDifficulty: number;
  rand: () => number;
}

export const TRAP_HORSE_RARE_CHANCE = 0.0075;

export function shouldSpawnTrap(c: StormCtx): boolean {
  if (!c.thundering) return false;
  if (c.difficulty === 'easy') return false;
  return c.rand() < TRAP_HORSE_RARE_CHANCE * c.regionalDifficulty;
}

export const TRAP_RIDER_COUNT = 4;

export function onPlayerApproach(): { lightning: boolean; riders: number } {
  return { lightning: true, riders: TRAP_RIDER_COUNT };
}
