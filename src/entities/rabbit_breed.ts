// Rabbit breeding. Parents accept dandelion, carrot, golden carrot.
// Baby inherits variant from parents, with small chance of biome variant.

export type RabbitVariant =
  | 'brown'
  | 'white'
  | 'black'
  | 'black_and_white'
  | 'gold'
  | 'salt_and_pepper'
  | 'killer_bunny';

export const RABBIT_BREED_FOODS = new Set(['dandelion', 'carrot', 'golden_carrot']);

export function accepts(food: string): boolean {
  return RABBIT_BREED_FOODS.has(food);
}

export function childVariant(
  a: RabbitVariant,
  b: RabbitVariant,
  biomeFallback: RabbitVariant,
  rand: () => number,
): RabbitVariant {
  const r = rand();
  if (r < 0.05) return biomeFallback;
  return r < 0.5 ? a : b;
}

export const RABBIT_BABY_GROW_TICKS = 24000;
