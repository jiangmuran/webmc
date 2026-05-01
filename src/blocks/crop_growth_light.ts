// Crop growth ticks. Crops need light ≥ 9 on the block above and
// stay hydrated on farmland. Growth stages 0..7 (wheat/carrot/potato).

export interface CropTickQuery {
  lightAbove: number;
  farmlandMoist: boolean;
  age: number; // 0..7
  rand: () => number;
  boneMealed: boolean;
}

export const MAX_AGE = 7;

export function growthChance(moist: boolean): number {
  return moist ? 0.1 : 0.04;
}

export function tickCrop(q: CropTickQuery): boolean {
  if (q.age >= MAX_AGE) return false;
  if (q.boneMealed) return true;
  if (q.lightAbove < 9) return false;
  return q.rand() < growthChance(q.farmlandMoist);
}

// Wiki (minecraft.wiki/w/Beetroot): "Bone meal has a 75% chance to
// advance growth by one stage" — 0 OR 1 stage per application, not
// 1-3. Old `1 + floor(rand*3)` returned 1-3 always — over by ~2
// stages on average and never giving the wiki's 25% no-op outcome.
// Sibling crop_growth_random_tick.ts already uses the wiki rule.
//
// Wheat/carrot/potato: bone meal advances 2-5 stages per wiki
// (uniform random).
export function boneMealStages(
  crop: 'wheat' | 'carrot' | 'potato' | 'beetroot',
  rand: () => number,
): number {
  if (crop === 'beetroot') return rand() < 0.75 ? 1 : 0;
  return 2 + Math.floor(rand() * 4);
}

// Melon/pumpkin stem growth tips the same light threshold but require
// an adjacent empty dirt/farmland tile for the fruit.
export function canProduceFruit(adjacentEmptyFarm: boolean, stemAge: number): boolean {
  return adjacentEmptyFarm && stemAge >= MAX_AGE;
}
