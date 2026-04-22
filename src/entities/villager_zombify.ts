// Villager zombification + curing. When a zombie kills a villager on
// normal/hard, the villager turns into a zombie villager. Splashing the
// zombie villager with weakness + feeding a golden apple starts a
// 3-5min cure timer.

export type Difficulty = 'peaceful' | 'easy' | 'normal' | 'hard';

export interface VillagerState {
  profession: string;
  zombified: boolean;
  curing: { progressSec: number; totalSec: number } | null;
}

export function makeVillager(profession = 'none'): VillagerState {
  return { profession, zombified: false, curing: null };
}

export interface ZombifyQuery {
  difficulty: Difficulty;
  rng: () => number;
}

export interface ZombifyResult {
  converted: boolean;
}

export function maybeZombify(v: VillagerState, q: ZombifyQuery): ZombifyResult {
  if (v.zombified) return { converted: false };
  if (q.difficulty === 'peaceful' || q.difficulty === 'easy') {
    return { converted: false };
  }
  // Normal: 50% chance; Hard: 100%.
  const chance = q.difficulty === 'normal' ? 0.5 : 1;
  if (q.rng() < chance) {
    v.zombified = true;
    v.curing = null;
    return { converted: true };
  }
  return { converted: false };
}

// Start cure: requires weakness potion + golden apple fed to zombie villager.
export function startCure(v: VillagerState, rng: () => number = Math.random): boolean {
  if (!v.zombified) return false;
  const totalSec = 180 + rng() * 120; // 3..5 minutes
  v.curing = { progressSec: 0, totalSec };
  return true;
}

export function tickCure(v: VillagerState, dtSec: number): boolean {
  if (!v.zombified || !v.curing) return false;
  v.curing.progressSec += dtSec;
  if (v.curing.progressSec >= v.curing.totalSec) {
    v.zombified = false;
    v.curing = null;
    return true;
  }
  return false;
}
