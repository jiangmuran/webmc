// Wiki (minecraft.wiki/w/Horse#Breeding): "Newborns inherit stats
// from parents via (p1 + p2 + R) / 3, where R is uniform-random in:
//   Health:        15..30          (uniform)
//   Jump strength: 0.4..1.0        (uniform)
//   Speed:         0.1125..0.3375  (uniform)
//
// Old code:
//   - Health used a CONSTANT 15 (the lower bound), so foals always
//     regressed toward the weakest possible random pull instead of
//     sampling the natural 15..30 range.
//   - Jump used `rng()` directly (0..1), most rolls below 0.4 — under
//     the wiki natural-spawn floor.
//   - Speed used `rng() * 0.4` (0..0.4), low rolls dipped to 0
//     (slower than any natural-spawn horse).

export interface HorseStats {
  maxHealth: number;
  jumpStrength: number;
  speed: number;
}

const HEALTH_R_MIN = 15;
const HEALTH_R_MAX = 30;
const JUMP_R_MIN = 0.4;
const JUMP_R_MAX = 1.0;
const SPEED_R_MIN = 0.1125;
const SPEED_R_MAX = 0.3375;

function rangeRoll(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

export function averageWithRandom(a: HorseStats, b: HorseStats, rng: () => number): HorseStats {
  const avgHealth = (a.maxHealth + b.maxHealth + rangeRoll(rng, HEALTH_R_MIN, HEALTH_R_MAX)) / 3;
  const avgJump = (a.jumpStrength + b.jumpStrength + rangeRoll(rng, JUMP_R_MIN, JUMP_R_MAX)) / 3;
  const avgSpeed = (a.speed + b.speed + rangeRoll(rng, SPEED_R_MIN, SPEED_R_MAX)) / 3;
  return { maxHealth: avgHealth, jumpStrength: avgJump, speed: avgSpeed };
}

export function isRegressiveToMean(parent: number, child: number, mean: number): boolean {
  return Math.abs(child - mean) < Math.abs(parent - mean);
}
