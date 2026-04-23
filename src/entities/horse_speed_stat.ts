// Horse speed/jump/health roll. On breed, stats are averaged from parents
// plus small random drift.

export interface HorseStats {
  speed: number; // blocks/tick
  jumpStrength: number;
  maxHealth: number;
}

export const SPEED_MIN = 0.1125;
export const SPEED_MAX = 0.3375;
export const JUMP_MIN = 0.4;
export const JUMP_MAX = 1.0;
export const HEALTH_MIN = 15;
export const HEALTH_MAX = 30;

export function rollWild(rand: () => number): HorseStats {
  const r = (a: number, b: number): number => a + rand() * (b - a);
  return {
    speed: r(SPEED_MIN, SPEED_MAX),
    jumpStrength: r(JUMP_MIN, JUMP_MAX),
    maxHealth: Math.floor(r(HEALTH_MIN, HEALTH_MAX + 1)),
  };
}

export function breedChild(a: HorseStats, b: HorseStats, rand: () => number): HorseStats {
  const wild = rollWild(rand);
  return {
    speed: (a.speed + b.speed + wild.speed) / 3,
    jumpStrength: (a.jumpStrength + b.jumpStrength + wild.jumpStrength) / 3,
    maxHealth: Math.round((a.maxHealth + b.maxHealth + wild.maxHealth) / 3),
  };
}
