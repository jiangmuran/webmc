export interface ThunderCtx {
  isThundering: boolean;
  chunkIsLoaded: boolean;
  skyVisible: boolean;
  rng: () => number;
}

export const PER_TICK_PER_CHUNK_CHANCE = 1 / 100000;

export function tryStrike(c: ThunderCtx): boolean {
  if (!c.isThundering || !c.chunkIsLoaded || !c.skyVisible) return false;
  return c.rng() < PER_TICK_PER_CHUNK_CHANCE;
}

export function strikeHeight(topBlock: number): number {
  return topBlock;
}
