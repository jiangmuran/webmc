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

export function lightEmission(state: AmethystState): number {
  return state.stage === 'cluster' ? 5 : 1;
}
