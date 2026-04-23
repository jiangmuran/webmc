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

export function breedOffspring(a: HorseStats, b: HorseStats, rng: () => number): HorseStats {
  const mixedHealth =
    (a.health + b.health + ((rng() + rng() + rng()) / 3) * (HEALTH_RANGE[1] - HEALTH_RANGE[0])) / 3;
  const mixedSpeed =
    (a.speed + b.speed + ((rng() + rng() + rng()) / 3) * (SPEED_RANGE[1] - SPEED_RANGE[0])) / 3;
  const mixedJump =
    (a.jumpStrength +
      b.jumpStrength +
      ((rng() + rng() + rng()) / 3) * (JUMP_RANGE[1] - JUMP_RANGE[0])) /
    3;
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
