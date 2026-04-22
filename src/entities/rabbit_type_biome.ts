// Rabbit color variants by biome. Also the "killer bunny" rare variant.

export type RabbitType = 'brown' | 'white' | 'black' | 'black_white' | 'gold' | 'salt' | 'killer';

export interface SpawnQuery {
  biome: string;
  rand: () => number;
}

export function rollRabbitType(q: SpawnQuery): RabbitType {
  if (q.biome === 'snowy_taiga' || q.biome === 'snowy_plains' || q.biome.startsWith('frozen_')) {
    return q.rand() < 0.8 ? 'white' : 'black_white';
  }
  if (q.biome === 'desert') return 'gold';
  if (q.biome === 'flower_forest') return 'salt';
  const r = q.rand();
  if (r < 0.5) return 'brown';
  if (r < 0.75) return 'salt';
  if (r < 0.875) return 'black';
  return 'black_white';
}

// Killer bunny: 1/1000 natural spawn, very rare.
export const KILLER_SPAWN_CHANCE = 1 / 1000;

export function rollKillerBunny(rand: () => number): boolean {
  return rand() < KILLER_SPAWN_CHANCE;
}

// Rabbit food: carrots, golden carrots, dandelions.
export const BREEDING_FOOD = new Set<string>([
  'webmc:carrot',
  'webmc:golden_carrot',
  'webmc:dandelion',
]);

export function canBreedWith(item: string): boolean {
  return BREEDING_FOOD.has(item);
}
