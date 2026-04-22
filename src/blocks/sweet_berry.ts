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

export function harvestBush(bush: SweetBerryBush): string[] {
  if (bush.stage < MAX_STAGE) {
    if (bush.stage === 2) {
      bush.stage = 1;
      return ['webmc:sweet_berries'];
    }
    return [];
  }
  bush.stage = 1;
  const count = 2 + Math.floor(Math.random() * 3); // 2-3 berries
  return Array.from({ length: count }, () => 'webmc:sweet_berries');
}
