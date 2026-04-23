// Pumpkin/melon stems grow in 8 ages. When mature, if an empty adjacent
// cell is farmland/dirt with air above, a pumpkin/melon spawns.

export interface StemCtx {
  age: number;
  maxAge: number;
  fruitSpawned: boolean;
  hasEmptyDirtNeighbor: boolean;
}

export function tryGrow(c: StemCtx, rand: () => number): { state: StemCtx; fruitPlaced: boolean } {
  if (c.age < c.maxAge) {
    if (rand() < 0.125) return { state: { ...c, age: c.age + 1 }, fruitPlaced: false };
    return { state: c, fruitPlaced: false };
  }
  // Mature; may drop fruit
  if (c.fruitSpawned) return { state: c, fruitPlaced: false };
  if (!c.hasEmptyDirtNeighbor) return { state: c, fruitPlaced: false };
  if (rand() < 0.125) return { state: { ...c, fruitSpawned: true }, fruitPlaced: true };
  return { state: c, fruitPlaced: false };
}

export function onFruitBroken(c: StemCtx): StemCtx {
  return { ...c, fruitSpawned: false };
}
