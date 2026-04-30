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

// Wiki (minecraft.wiki/w/Rabbit#The_Killer_Bunny): "The killer bunny
// does not spawn naturally and must instead be spawned using the
// command /summon minecraft:rabbit ~ ~ ~ {RabbitType:99}."
// Old code rolled a 1/1000 natural spawn — wrong; killer bunnies
// are exclusively command-summoned in JE. KILLER_SPAWN_CHANCE kept
// as 0 (rather than removed) to preserve the export.
export const KILLER_SPAWN_CHANCE = 0;

export function rollKillerBunny(_rand: () => number): boolean {
  return false;
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
