// Crop random-tick growth. Light + adjacent-farmland-hydration + diag rules.

export interface CropCtx {
  age: number;
  maxAge: number;
  lightLevel: number;
  farmlandHydrated: boolean;
  sameCropNeighbors: number;
}

export const MIN_LIGHT = 9;

export function growthChance(c: CropCtx): number {
  if (c.lightLevel < MIN_LIGHT) return 0;
  let speed = 1;
  // Hydrated farmland × 4
  if (c.farmlandHydrated) speed *= 4;
  // Same-crop rule: adjacent diagonals reduce speed
  if (c.sameCropNeighbors > 0) speed *= 0.5;
  // Base 1/speed chance per random tick.
  return 1 / (25 / speed + 1);
}

export function tryAdvance(c: CropCtx, rand: () => number): CropCtx {
  if (c.age >= c.maxAge) return c;
  if (rand() < growthChance(c)) return { ...c, age: c.age + 1 };
  return c;
}

export function fullyGrown(c: CropCtx): boolean {
  return c.age >= c.maxAge;
}
