export type CatchPool = 'fish' | 'treasure' | 'junk';

const BASE_WEIGHTS: Record<CatchPool, number> = {
  fish: 85,
  treasure: 5,
  junk: 10,
};

export function poolWeights(luckOfTheSea: number): Record<CatchPool, number> {
  const t = Math.max(0, luckOfTheSea);
  return {
    fish: BASE_WEIGHTS.fish,
    treasure: BASE_WEIGHTS.treasure + t * 2,
    junk: Math.max(0, BASE_WEIGHTS.junk - t * 2 - 0.1),
  };
}

export function pickPool(weights: Record<CatchPool, number>, rng: () => number): CatchPool {
  const total = weights.fish + weights.treasure + weights.junk;
  let r = rng() * total;
  r -= weights.fish;
  if (r < 0) return 'fish';
  r -= weights.treasure;
  if (r < 0) return 'treasure';
  return 'junk';
}

export const LURE_TICK_REDUCTION_PER_LEVEL = 100;

export function lureReducesTicks(lureLevel: number): number {
  return LURE_TICK_REDUCTION_PER_LEVEL * Math.max(0, lureLevel);
}
