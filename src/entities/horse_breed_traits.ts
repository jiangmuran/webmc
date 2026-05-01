// Wiki (minecraft.wiki/w/Horse#Breeding): foals get (p1 + p2 + R)/3
// where R is in:
//   Health 15..30, Speed 0.1125..0.3375, Jump 0.4..1.0.
//
// Old code computed R as `triangular(0..1) × (max-min)`, missing the
// `+min` offset — R landed in [0, max-min] instead of [min, max], so
// foals were systematically pulled toward the floor. The terminal
// clamp masked under-floor results but did not let top-tier parents
// reach the wiki upper bound. Sibling horse_breed_inheritance.ts
// already uses the wiki-correct ranges.

export interface HorseStats {
  health: number;
  speed: number;
  jumpStrength: number;
}

export const HEALTH_RANGE: [number, number] = [15, 30];
export const SPEED_RANGE: [number, number] = [0.1125, 0.3375];
export const JUMP_RANGE: [number, number] = [0.4, 1.0];

function inRange(value: number, range: [number, number]): number {
  return Math.max(range[0], Math.min(range[1], value));
}

function rollR(rng: () => number, range: [number, number]): number {
  // Triangular distribution within the wiki range (3-roll average).
  const t = (rng() + rng() + rng()) / 3;
  return range[0] + t * (range[1] - range[0]);
}

export function breedOffspring(a: HorseStats, b: HorseStats, rng: () => number): HorseStats {
  const mixedHealth = (a.health + b.health + rollR(rng, HEALTH_RANGE)) / 3;
  const mixedSpeed = (a.speed + b.speed + rollR(rng, SPEED_RANGE)) / 3;
  const mixedJump = (a.jumpStrength + b.jumpStrength + rollR(rng, JUMP_RANGE)) / 3;
  return {
    health: inRange(mixedHealth, HEALTH_RANGE),
    speed: inRange(mixedSpeed, SPEED_RANGE),
    jumpStrength: inRange(mixedJump, JUMP_RANGE),
  };
}

export function estimatedJumpHeightBlocks(jumpStrength: number): number {
  return (
    -0.1817584952 * Math.pow(jumpStrength, 3) +
    3.689713992 * Math.pow(jumpStrength, 2) +
    2.128599134 * jumpStrength -
    0.343930367
  );
}
