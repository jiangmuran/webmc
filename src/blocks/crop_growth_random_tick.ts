// Random tick crops. Wheat, carrot, potato, beetroot. Grows by 1 age
// per tick with probability gated by light + hydration + neighbors.

export interface CropQuery {
  crop: 'wheat' | 'carrot' | 'potato' | 'beetroot' | 'melon_stem' | 'pumpkin_stem' | 'nether_wart';
  age: number;
  lightAbove: number;
  hydrated: boolean;
  inRowWithSameCrop: boolean;
  rand: () => number;
}

export function maxAge(crop: CropQuery['crop']): number {
  if (crop === 'beetroot') return 3;
  if (crop === 'nether_wart') return 3;
  return 7;
}

export function growthChance(q: CropQuery): number {
  if (q.crop === 'nether_wart') return 0.1; // nether wart ignores hydration/light
  if (q.lightAbove < 9) return 0;
  let base = q.hydrated ? 0.125 : 0.05;
  if (q.inRowWithSameCrop) base *= 2; // MC "row bonus"
  return base;
}

export function randomTick(q: CropQuery): 'grew' | 'stays' {
  if (q.age >= maxAge(q.crop)) return 'stays';
  const chance = growthChance(q);
  if (q.rand() < chance) return 'grew';
  return 'stays';
}

// Bone meal advance.
//
// Wiki (minecraft.wiki/w/Beetroot_Seeds): "One application of bone
// meal has a 75% chance of advancing growth by one stage."
// Old `Math.floor(rand() * 2)` gave 0 or 1 with 50/50 probability —
// 25 percentage points under the wiki canon for the +1 case (would
// take ~6.4 bone meals on average to fully grow vs the wiki's 5⅓).
//
// Wheat/carrot/potato/melon/pumpkin: wiki says 2-5 stages per
// application (uniform). Nether wart: not affected by bone meal.
export function boneMealSteps(crop: CropQuery['crop'], rand: () => number): number {
  if (crop === 'beetroot') return rand() < 0.75 ? 1 : 0;
  if (crop === 'nether_wart') return 0;
  return 2 + Math.floor(rand() * 4);
}
