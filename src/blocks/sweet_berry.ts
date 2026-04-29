// Sweet berry bush. 4 growth stages; stage 3 has berries to harvest.
// Walking through at stage 1+ deals 1 HP on move and applies slowness.

export interface SweetBerryBush {
  stage: number; // 0..3
}

const MAX_STAGE = 3;
const GROWTH_CHANCE_PER_TICK = 0.08;
const DAMAGE_PER_STEP = 1;

export function makeBush(): SweetBerryBush {
  return { stage: 0 };
}

export function growBush(bush: SweetBerryBush, rng: () => number = Math.random): boolean {
  if (bush.stage >= MAX_STAGE) return false;
  if (rng() < GROWTH_CHANCE_PER_TICK) {
    bush.stage++;
    return true;
  }
  return false;
}

export interface WalkThroughResult {
  damage: number;
  slownessSec: number;
}

export function walkThroughDamage(bush: SweetBerryBush, moved: boolean): WalkThroughResult {
  if (bush.stage === 0) return { damage: 0, slownessSec: 0 };
  if (!moved) return { damage: 0, slownessSec: 1 };
  return { damage: DAMAGE_PER_STEP, slownessSec: 1 };
}

// Wiki (minecraft.wiki/w/Sweet_Berries): mature stage 3 drops 2-3
// berries; stage 2 drops 1-2 berries; both regress the bush to stage
// 1. Old formula used Math.random() * 3 (2-4 range, off by one) and
// was non-deterministic. Now takes an rng for testability and matches
// wiki ranges.
export function harvestBush(bush: SweetBerryBush, rng: () => number = Math.random): string[] {
  if (bush.stage < 2) return [];
  if (bush.stage === 2) {
    bush.stage = 1;
    const count = 1 + Math.floor(rng() * 2); // 1-2
    return Array.from({ length: count }, () => 'webmc:sweet_berries');
  }
  bush.stage = 1;
  const count = 2 + Math.floor(rng() * 2); // 2-3
  return Array.from({ length: count }, () => 'webmc:sweet_berries');
}
