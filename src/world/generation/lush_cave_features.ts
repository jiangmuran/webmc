export const MOSS_COVERAGE = 0.8;
export const AZALEA_TREE_CHANCE = 0.1;

export function surfaceBlock(): string {
  return 'moss_block';
}

export function cavePlantsFor(rng: () => number): string[] {
  const plants: string[] = [];
  if (rng() < 0.6) plants.push('glow_berries');
  if (rng() < 0.3) plants.push('spore_blossom');
  if (rng() < 0.5) plants.push('cave_vines');
  if (rng() < 0.7) plants.push('moss_carpet');
  return plants;
}

export function azaleaTreeAbove(): boolean {
  return true;
}
