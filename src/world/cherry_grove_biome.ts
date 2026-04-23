// Cherry grove biome. Pink cherry leaves, falling petals particle.

export const CHERRY_PETAL_COLOR = 0xffc6dd;
export const CHERRY_LEAF_COLOR = 0xe699a3;

export interface CherryCtx {
  inCherryGrove: boolean;
  rand: () => number;
}

export const PETAL_PARTICLE_CHANCE_PER_TICK = 0.02;

export function emitsPetalThisTick(c: CherryCtx): boolean {
  if (!c.inCherryGrove) return false;
  return c.rand() < PETAL_PARTICLE_CHANCE_PER_TICK;
}

export function canSpawnHere(mobType: string): boolean {
  return mobType === 'bee' || mobType === 'rabbit' || mobType === 'pig' || mobType === 'sheep';
}

export const CHERRY_TREE_HEIGHT_MIN = 7;
export const CHERRY_TREE_HEIGHT_MAX = 12;
