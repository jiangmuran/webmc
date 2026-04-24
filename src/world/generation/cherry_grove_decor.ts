export const CHERRY_DECOR = [
  'cherry_log',
  'cherry_leaves',
  'pink_petals',
  'grass',
  'tall_grass',
] as const;
export const CHERRY_FLOWERS = ['pink_tulip', 'torchflower', 'dandelion', 'poppy'] as const;

export function treeTargetCount(_chunkZ: number, rng: () => number): number {
  return 4 + Math.floor(rng() * 5);
}

export function dropsPinkPetals(surfaceBlock: string, rng: () => number): boolean {
  if (surfaceBlock !== 'grass_block') return false;
  return rng() < 0.2;
}

export function canopyRadius(rng: () => number): number {
  return 2 + Math.floor(rng() * 3);
}
