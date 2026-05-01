// Rabbit color variants by biome. Also the "killer bunny" rare variant.

export type RabbitType = 'brown' | 'white' | 'black' | 'black_white' | 'gold' | 'salt' | 'killer';

export interface SpawnQuery {
  biome: string;
  rand: () => number;
}

// Wiki (minecraft.wiki/w/Rabbit#Type_of_Rabbit):
//   Snowy biomes: 80% white, 20% black-and-white
//   Desert: 100% gold
//   Other biomes: 50% brown, 40% salt, 10% black
//
// Old non-snowy split was 50% brown / 25% salt / 12.5% black /
// 12.5% black_white. That over-rated black_white (which wiki
// confines to snowy biomes), under-rated salt (40% wiki vs 25%
// code), and slightly bumped black (10% wiki vs 12.5% code). The
// flower-forest special case (always salt) was also fabricated —
// wiki uses the standard "other biomes" mix.
export function rollRabbitType(q: SpawnQuery): RabbitType {
  if (q.biome === 'snowy_taiga' || q.biome === 'snowy_plains' || q.biome.startsWith('frozen_')) {
    return q.rand() < 0.8 ? 'white' : 'black_white';
  }
  if (q.biome === 'desert') return 'gold';
  const r = q.rand();
  if (r < 0.5) return 'brown';
  if (r < 0.9) return 'salt';
  return 'black';
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
