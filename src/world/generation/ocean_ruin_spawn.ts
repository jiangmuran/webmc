export type OceanTemp = 'cold' | 'warm';

export const CHANCE_PER_CHUNK = 0.02;

export function canGenerate(inOcean: boolean, rng: () => number): boolean {
  return inOcean && rng() < CHANCE_PER_CHUNK;
}

export function lootTable(temp: OceanTemp): string[] {
  if (temp === 'cold') return ['enchanted_book', 'iron_pickaxe', 'fishing_rod', 'coal'];
  return ['emerald', 'stone_axe', 'leather_armor', 'cod'];
}

export function drownedSpawnWeight(): number {
  return 3;
}
