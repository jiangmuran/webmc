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

export function harvestYield(
  stage: AmethystStage,
  fortuneLevel: number,
  silkTouch: boolean,
): number {
  if (stage !== 'cluster') return 0;
  if (silkTouch) return 1; // block form
  const base = 4;
  // Fortune up to +3 extra.
  return base + Math.floor(Math.random() * (1 + fortuneLevel));
}
