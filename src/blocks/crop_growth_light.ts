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

// Bone meal on wheat: 2-5 stage skips. On carrot/potato: 2-5 stages.
// On beetroot: 1-3 stages.
export function boneMealStages(
  crop: 'wheat' | 'carrot' | 'potato' | 'beetroot',
  rand: () => number,
): number {
  if (crop === 'beetroot') return 1 + Math.floor(rand() * 3);
  return 2 + Math.floor(rand() * 4);
}

// Melon/pumpkin stem growth tips the same light threshold but require
// an adjacent empty dirt/farmland tile for the fruit.
export function canProduceFruit(adjacentEmptyFarm: boolean, stemAge: number): boolean {
  return adjacentEmptyFarm && stemAge >= MAX_AGE;
}
