// Amethyst bud / cluster growth. Budding amethyst rarely spawns a small
// bud on an adjacent face; buds advance through stages over ~1-8 real-time
// minutes. Mining a mature cluster drops 4 amethyst shards.

export type AmethystStage = 'small_bud' | 'medium_bud' | 'large_bud' | 'cluster';

export interface AmethystState {
  stage: AmethystStage;
}

const NEXT: Record<AmethystStage, AmethystStage | null> = {
  small_bud: 'medium_bud',
  medium_bud: 'large_bud',
  large_bud: 'cluster',
  cluster: null,
};

// Per-tick advance chance (call at 20Hz).
const GROWTH_CHANCE_PER_TICK = 0.04;

export function makeAmethystBud(): AmethystState {
  return { stage: 'small_bud' };
}

export function growthTick(state: AmethystState, rng: () => number = Math.random): boolean {
  const next = NEXT[state.stage];
  if (!next) return false;
  if (rng() < GROWTH_CHANCE_PER_TICK) {
    state.stage = next;
    return true;
  }
  return false;
}

export function dropsFor(state: AmethystState, hasSilkTouch: boolean): string[] {
  if (state.stage !== 'cluster') return [];
  if (hasSilkTouch) return ['webmc:amethyst_cluster'];
  return [
    'webmc:amethyst_shard',
    'webmc:amethyst_shard',
    'webmc:amethyst_shard',
    'webmc:amethyst_shard',
  ];
}

// Wiki (minecraft.wiki/w/Amethyst_Cluster#Light): "Small, medium,
// and large amethyst buds give off a light level of 1, 2 and 4
// respectively, while amethyst clusters give off a light level of 5."
// Old code returned 1 for every bud stage, dropping the per-stage
// glow gradient (the visible cue that a bud is maturing).
export function lightEmission(state: AmethystState): number {
  switch (state.stage) {
    case 'small_bud':
      return 1;
    case 'medium_bud':
      return 2;
    case 'large_bud':
      return 4;
    case 'cluster':
      return 5;
  }
}
