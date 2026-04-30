// Amethyst buds grow on budding amethyst blocks. Progression:
// small → medium → large → cluster. Random ticks advance a stage.

export type AmethystStage = 'small_bud' | 'medium_bud' | 'large_bud' | 'cluster';

const NEXT: Record<AmethystStage, AmethystStage> = {
  small_bud: 'medium_bud',
  medium_bud: 'large_bud',
  large_bud: 'cluster',
  cluster: 'cluster',
};

export const AMETHYST_GROW_CHANCE = 0.2;

export function randomTick(stage: AmethystStage, rand: () => number): AmethystStage {
  if (stage === 'cluster') return stage;
  if (rand() < AMETHYST_GROW_CHANCE) return NEXT[stage];
  return stage;
}

// Wiki (minecraft.wiki/w/Amethyst_Cluster): "Amethyst clusters drop
// 4 amethyst shards when mined with an iron pickaxe or higher (less
// or none with lower-tier pickaxes / Silk Touch returns the block).
// Fortune uses the standard discrete-ore formula:
//   probability of no bonus: 2 / (level + 2)
//   otherwise: equal chance for any multiplier from 2 to (level + 1)
// Fortune III gives an average of 8.8 shards per cluster (~2.2× base 4)."
//
// Old `base + floor(rand × (1 + fortuneLevel))` yielded 4-7 at
// Fortune III, averaging ~5.5 — vs wiki ~8.8 (~37% under canon).
// Now uses the wiki formula via a multiplier roll.
export function harvestYield(
  stage: AmethystStage,
  fortuneLevel: number,
  silkTouch: boolean,
  rand: () => number = Math.random,
): number {
  if (stage !== 'cluster') return 0;
  if (silkTouch) return 1; // block form
  const base = 4;
  if (fortuneLevel <= 0) return base;
  // Standard ore Fortune formula: rolls = floor(rand × (level + 2)) − 1,
  // multiplier = max(1, rolls + 1). For Fortune III, multipliers
  // are uniformly 1, 1, 2, 3, 4 (avg ≈ 2.2).
  const roll = Math.floor(rand() * (fortuneLevel + 2)) - 1;
  const multiplier = Math.max(1, roll + 1);
  return base * multiplier;
}
