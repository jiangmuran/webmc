export const BREED_FOODS = new Set(['dandelion', 'carrot', 'golden_carrot']);

export function isBreedFood(id: string): boolean {
  return BREED_FOODS.has(id);
}

export function feedResetsLoveCooldownTicks(): number {
  return 6000;
}

export function babyTypeInheritsParent(a: string, b: string, rng: () => number): string {
  if (a === b) return a;
  return rng() < 0.5 ? a : b;
}
