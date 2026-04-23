export interface HorseStats {
  maxHealth: number;
  jumpStrength: number;
  speed: number;
}

export function averageWithRandom(a: HorseStats, b: HorseStats, rng: () => number): HorseStats {
  const avgHealth = (a.maxHealth + b.maxHealth + 15) / 3;
  const avgJump = (a.jumpStrength + b.jumpStrength + rng()) / 3;
  const avgSpeed = (a.speed + b.speed + rng() * 0.4) / 3;
  return { maxHealth: avgHealth, jumpStrength: avgJump, speed: avgSpeed };
}

export function isRegressiveToMean(parent: number, child: number, mean: number): boolean {
  return Math.abs(child - mean) < Math.abs(parent - mean);
}
